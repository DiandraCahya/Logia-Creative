/**
 * Logia Creative CMS - Storage Layer
 * Supports two drivers:
 * 1. 'local' for local development & self-hosted runtime.
 * 2. 'github' for Vercel production, committing changes atomically via Git Data API.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import type {
  BatchFileChange,
  CommitBatchResult,
  ContentStore,
} from "./types";

export class LocalStoreDriver implements ContentStore {
  readonly driverName = "local" as const;

  private resolvePath(relativePath: string): string {
    const clean = relativePath.replace(/^[\/\\]+/, "");
    return path.join(process.cwd(), clean);
  }

  async readJson<T>(relativePath: string): Promise<T> {
    const primaryPath = this.resolvePath(relativePath);
    try {
      const raw = await fs.readFile(primaryPath, "utf-8");
      return JSON.parse(raw) as T;
    } catch {
      // Fallback: check content/defaults/ if reading from content/
      if (relativePath.startsWith("content/") && !relativePath.startsWith("content/defaults/")) {
        const defaultRel = relativePath.replace(/^content\//, "content/defaults/");
        const fallbackPath = this.resolvePath(defaultRel);
        const rawDefault = await fs.readFile(fallbackPath, "utf-8");
        return JSON.parse(rawDefault) as T;
      }
      throw new Error(`File not found: ${relativePath}`);
    }
  }

  async writeJson<T>(relativePath: string, data: T): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(fullPath, content, "utf-8");
  }

  async writeFile(relativePath: string, data: Buffer): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, data);
  }

  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  async commitBatch(
    files: BatchFileChange[],
    deletions?: string[],
    _message?: string
  ): Promise<CommitBatchResult> {
    try {
      for (const f of files) {
        const fullPath = this.resolvePath(f.path);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        if (typeof f.content === "string") {
          const encoding = f.encoding === "base64" ? "base64" : "utf-8";
          await fs.writeFile(fullPath, f.content, encoding);
        } else {
          await fs.writeFile(fullPath, f.content);
        }
      }

      if (deletions && deletions.length > 0) {
        for (const del of deletions) {
          await this.deleteFile(del);
        }
      }

      try {
        revalidatePath("/");
      } catch {
        // Ignored if called outside request context
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to commit batch to local store" };
    }
  }

  async getLatestSha(): Promise<string | null> {
    return "local-dev";
  }

  async resetToDefaults(): Promise<CommitBatchResult> {
    try {
      const defaultsDir = this.resolvePath("content/defaults");
      const targetDir = this.resolvePath("content");
      const files = await fs.readdir(defaultsDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const src = path.join(defaultsDir, file);
          const dest = path.join(targetDir, file);
          await fs.copyFile(src, dest);
        }
      }
      try {
        revalidatePath("/");
      } catch {
        // ignore outside request
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal mereset ke default" };
    }
  }
}

export class GithubStoreDriver implements ContentStore {
  readonly driverName = "github" as const;
  private token: string;
  private owner: string;
  private repo: string;
  private branch: string;
  private localFallback: LocalStoreDriver;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || "";
    this.owner = process.env.GITHUB_OWNER || "";
    this.repo = process.env.GITHUB_REPO || "";
    this.branch = process.env.GITHUB_BRANCH || "main";
    this.localFallback = new LocalStoreDriver();
  }

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Logia-Creative-CMS",
    };
  }

  async readJson<T>(relativePath: string): Promise<T> {
    // In Vercel, read static files bundled at build time first for maximum speed
    try {
      return await this.localFallback.readJson<T>(relativePath);
    } catch {
      // If not available locally, fetch from GitHub raw/contents API
      if (!this.token || !this.owner || !this.repo) {
        throw new Error(`GitHub credentials not configured and file not found locally: ${relativePath}`);
      }
      const cleanPath = relativePath.replace(/^[\/\\]+/, "");
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${cleanPath}?ref=${this.branch}`;
      const res = await fetch(url, { headers: this.headers, next: { revalidate: 0 } });
      if (!res.ok) {
        throw new Error(`GitHub API error ${res.status} reading ${cleanPath}`);
      }
      const data = await res.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(content) as T;
    }
  }

  async writeJson<T>(relativePath: string, data: T): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await this.commitBatch([{ path: relativePath, content, encoding: "utf-8" }]);
  }

  async writeFile(relativePath: string, data: Buffer): Promise<void> {
    await this.commitBatch([{ path: relativePath, content: data }]);
  }

  async deleteFile(relativePath: string): Promise<void> {
    await this.commitBatch([], [relativePath]);
  }

  /**
   * Atomic publish: Git Data API
   * 1. Get branch ref SHA
   * 2. Get base tree SHA from commit
   * 3. Upload Blobs for all changed files
   * 4. Create new Tree with blobs and deletions
   * 5. Create new Commit referencing parent and new tree
   * 6. Update branch ref
   */
  async commitBatch(
    files: BatchFileChange[],
    deletions?: string[],
    message?: string,
    expectedSha?: string
  ): Promise<CommitBatchResult> {
    if (!this.token || !this.owner || !this.repo) {
      return {
        success: false,
        error: "GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO must be set in environment variables.",
      };
    }

    try {
      const apiBase = `https://api.github.com/repos/${this.owner}/${this.repo}`;

      // 1. Get latest commit SHA of target branch
      const refRes = await fetch(`${apiBase}/git/ref/heads/${this.branch}`, {
        headers: this.headers,
        cache: "no-store",
      });
      if (!refRes.ok) {
        const err = await refRes.text();
        return { success: false, error: `Failed to get branch ref: ${refRes.status} ${err}` };
      }
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      // Conflict detection: Check if repository was updated by another commit
      if (expectedSha && latestCommitSha !== expectedSha) {
        return {
          success: false,
          isConflict: true,
          error: "Konflik: Repository telah diperbarui oleh commit lain (SHA berubah). Muat ulang halaman untuk mengambil data terbaru.",
        };
      }

      // 2. Get base tree SHA from commit object
      const commitRes = await fetch(`${apiBase}/git/commits/${latestCommitSha}`, {
        headers: this.headers,
        cache: "no-store",
      });
      if (!commitRes.ok) {
        return { success: false, error: `Failed to get commit object: ${commitRes.status}` };
      }
      const commitData = await commitRes.json();
      const baseTreeSha = commitData.tree.sha;

      // 3. Upload blobs in parallel
      const treeEntries: Array<{
        path: string;
        mode: "100644";
        type: "blob";
        sha: string | null;
      }> = [];

      for (const file of files) {
        const cleanPath = file.path.replace(/^[\/\\]+/, "");
        let base64Content: string;
        if (typeof file.content === "string") {
          base64Content =
            file.encoding === "base64"
              ? file.content
              : Buffer.from(file.content, "utf-8").toString("base64");
        } else {
          base64Content = file.content.toString("base64");
        }

        const blobRes = await fetch(`${apiBase}/git/blobs`, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            content: base64Content,
            encoding: "base64",
          }),
        });

        if (!blobRes.ok) {
          const err = await blobRes.text();
          return { success: false, error: `Failed to create blob for ${cleanPath}: ${err}` };
        }

        const blobData = await blobRes.json();
        treeEntries.push({
          path: cleanPath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        });
      }

      // Add deletions (sha: null deletes from tree in Git Data API)
      if (deletions && deletions.length > 0) {
        for (const del of deletions) {
          const cleanPath = del.replace(/^[\/\\]+/, "");
          treeEntries.push({
            path: cleanPath,
            mode: "100644",
            type: "blob",
            sha: null,
          });
        }
      }

      // 4. Create new Tree
      const treeRes = await fetch(`${apiBase}/git/trees`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeEntries,
        }),
      });

      if (!treeRes.ok) {
        const err = await treeRes.text();
        return { success: false, error: `Failed to create git tree: ${err}` };
      }

      const treeData = await treeRes.json();
      const newTreeSha = treeData.sha;

      // 5. Create new Commit
      const commitMsg = message?.trim() ? `cms: ${message.trim()}` : "cms: update content";
      const newCommitRes = await fetch(`${apiBase}/git/commits`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          message: commitMsg,
          tree: newTreeSha,
          parents: [latestCommitSha],
        }),
      });

      if (!newCommitRes.ok) {
        const err = await newCommitRes.text();
        return { success: false, error: `Failed to create git commit: ${err}` };
      }

      const newCommitData = await newCommitRes.json();
      const newCommitSha = newCommitData.sha;

      // 6. Update branch ref
      const updateRefRes = await fetch(`${apiBase}/git/refs/heads/${this.branch}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({
          sha: newCommitSha,
          force: false,
        }),
      });

      if (!updateRefRes.ok) {
        const err = await updateRefRes.text();
        return { success: false, error: `Failed to update branch ref: ${err}` };
      }

      return {
        success: true,
        commitSha: newCommitSha,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to commit batch to GitHub" };
    }
  }

  async getLatestSha(): Promise<string | null> {
    if (!this.token || !this.owner || !this.repo) return null;
    try {
      const apiBase = `https://api.github.com/repos/${this.owner}/${this.repo}`;
      const refRes = await fetch(`${apiBase}/git/ref/heads/${this.branch}`, {
        headers: this.headers,
        cache: "no-store",
      });
      if (!refRes.ok) return null;
      const refData = await refRes.json();
      return refData.object.sha;
    } catch {
      return null;
    }
  }

  async resetToDefaults(): Promise<CommitBatchResult> {
    try {
      const defaultFiles = [
        "site.json",
        "projects.json",
        "promos.json",
        "testimonials.json",
        "rate-card.json",
        "media.json",
      ];
      const batch: BatchFileChange[] = [];
      for (const filename of defaultFiles) {
        const data = await this.localFallback.readJson<unknown>(`content/defaults/${filename}`);
        batch.push({
          path: `content/${filename}`,
          content: JSON.stringify(data, null, 2),
          encoding: "utf-8",
        });
      }
      return await this.commitBatch(batch, [], "reset ke default pabrik");
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal mereset ke default di GitHub" };
    }
  }
}

let storeInstance: ContentStore | null = null;

export function getStore(): ContentStore {
  if (storeInstance) return storeInstance;
  const driver = process.env.CMS_STORE_DRIVER?.toLowerCase();
  if (driver === "github") {
    storeInstance = new GithubStoreDriver();
  } else {
    storeInstance = new LocalStoreDriver();
  }
  return storeInstance;
}
