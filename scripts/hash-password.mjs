import crypto from "node:crypto";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Masukkan password admin baru: ", (password) => {
  const trimmed = password.trim();
  if (!trimmed) {
    console.error("Password tidak boleh kosong.");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(trimmed, salt, 64).toString("hex");
  const result = `${salt}:${hash}`;

  console.log("\nBerhasil membuat hash password admin!\n");
  console.log("Salin baris berikut ke .env.local dan environment variables Vercel Anda:\n");
  console.log(`ADMIN_PASSWORD_HASH="${result}"\n`);

  rl.close();
});
