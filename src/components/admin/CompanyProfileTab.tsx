"use client";

import React, { useEffect, useState } from "react";
import {
  Compass,
  Save,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Target,
  Sparkles,
} from "lucide-react";
import { api, CompanyProfile, MissionItem, PillarItem } from "@/lib/api";

export function CompanyProfileTab() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingMain, setSavingMain] = useState(false);
  const [mainSuccess, setMainSuccess] = useState(false);

  // Mission Modal
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<MissionItem | null>(null);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDesc, setMissionDesc] = useState("");

  // Pillar Modal
  const [pillarModalOpen, setPillarModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<PillarItem | null>(null);
  const [pillarTitle, setPillarTitle] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");

  const [savingItem, setSavingItem] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat profil perusahaan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMainChange = (field: keyof CompanyProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSavingMain(true);
    setMainSuccess(false);
    try {
      const res = await api.updateProfile({
        headline: profile.headline,
        tagline: profile.tagline,
        aboutText: profile.aboutText,
        vision: profile.vision,
      });
      setProfile((prev) => (prev ? { ...prev, ...res.data } : res.data));
      setMainSuccess(true);
      setTimeout(() => setMainSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan teks profil.");
    } finally {
      setSavingMain(false);
    }
  };

  // Mission handlers
  const openCreateMission = () => {
    setEditingMission(null);
    setMissionTitle("");
    setMissionDesc("");
    setMissionModalOpen(true);
  };

  const openEditMission = (m: MissionItem) => {
    setEditingMission(m);
    setMissionTitle(m.title);
    setMissionDesc(m.desc);
    setMissionModalOpen(true);
  };

  const handleSaveMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !missionTitle.trim() || !missionDesc.trim()) return;

    setSavingItem(true);
    try {
      if (editingMission) {
        const res = await api.updateMission(editingMission.id, {
          title: missionTitle.trim(),
          desc: missionDesc.trim(),
        });
        setProfile({
          ...profile,
          missions: profile.missions.map((m) => (m.id === editingMission.id ? res.data : m)),
        });
      } else {
        const res = await api.addMission({
          title: missionTitle.trim(),
          desc: missionDesc.trim(),
          order: profile.missions.length + 1,
        });
        setProfile({
          ...profile,
          missions: [...profile.missions, res.data],
        });
      }
      setMissionModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan misi.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteMission = async (id: string) => {
    if (!profile || !confirm("Hapus poin misi ini?")) return;
    try {
      await api.deleteMission(id);
      setProfile({
        ...profile,
        missions: profile.missions.filter((m) => m.id !== id),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus misi.");
    }
  };

  // Pillar handlers
  const openCreatePillar = () => {
    setEditingPillar(null);
    setPillarTitle("");
    setPillarDesc("");
    setPillarModalOpen(true);
  };

  const openEditPillar = (p: PillarItem) => {
    setEditingPillar(p);
    setPillarTitle(p.title);
    setPillarDesc(p.desc);
    setPillarModalOpen(true);
  };

  const handleSavePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !pillarTitle.trim() || !pillarDesc.trim()) return;

    setSavingItem(true);
    try {
      if (editingPillar) {
        const res = await api.updatePillar(editingPillar.id, {
          title: pillarTitle.trim(),
          desc: pillarDesc.trim(),
        });
        setProfile({
          ...profile,
          pillars: profile.pillars.map((p) => (p.id === editingPillar.id ? res.data : p)),
        });
      } else {
        const res = await api.addPillar({
          title: pillarTitle.trim(),
          desc: pillarDesc.trim(),
          order: profile.pillars.length + 1,
        });
        setProfile({
          ...profile,
          pillars: [...profile.pillars, res.data],
        });
      }
      setPillarModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan pilar filosofi.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeletePillar = async (id: string) => {
    if (!profile || !confirm("Hapus pilar filosofi ini?")) return;
    try {
      await api.deletePillar(id);
      setProfile({
        ...profile,
        pillars: profile.pillars.filter((p) => p.id !== id),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus pilar filosofi.");
    }
  };

  if (loading && !profile) {
    return (
      <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <p className="text-sm text-neutral-500">Memuat profil perusahaan...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
        <button onClick={loadData} className="underline text-sm font-semibold">Coba lagi</button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8 w-full">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Profil Perusahaan, Visi, Misi & Pilar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Nilai fundamental dan filosofi Logia Creative yang ditampilkan pada section Tentang Kami.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Segarkan
        </button>
      </div>

      {/* Main Text Form */}
      <form onSubmit={handleSaveMain} className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <h3 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#ff4114]" />
            Narasi Utama & Pernyataan Visi
          </h3>
          <div className="flex items-center gap-2">
            {mainSuccess && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" />
                Tersimpan
              </span>
            )}
            <button
              type="submit"
              disabled={savingMain}
              className="px-4 py-2 min-h-[38px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
            >
              {savingMain ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan Teks Utama
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Headline Profil
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => handleMainChange("headline", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Tagline Filosofis
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => handleMainChange("tagline", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Tentang Kami (About Text)
            </label>
            <textarea
              value={profile.aboutText}
              onChange={(e) => handleMainChange("aboutText", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Visi Perusahaan
            </label>
            <textarea
              value={profile.vision}
              onChange={(e) => handleMainChange("vision", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>
        </div>
      </form>

      {/* Missions Section */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#ff4114]" />
            <h3 className="text-base font-bold text-black dark:text-white">Poin-Poin Misi Agensi</h3>
          </div>
          <button
            onClick={openCreateMission}
            className="px-3.5 py-1.5 min-h-[36px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Misi
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profile.missions.map((m, idx) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col justify-between"
            >
              <div>
                <span className="w-6 h-6 rounded-full bg-[#ff4114]/10 text-[#ff4114] text-xs font-bold flex items-center justify-center mb-2 font-mono">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-sm text-black dark:text-white mb-1">{m.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                  {m.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end gap-1">
                <button
                  onClick={() => openEditMission(m)}
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteMission(m.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars Section */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff4114]" />
            <h3 className="text-base font-bold text-black dark:text-white">Pilar Filosofi Brand</h3>
          </div>
          <button
            onClick={openCreatePillar}
            className="px-3.5 py-1.5 min-h-[36px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Pilar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profile.pillars.map((p, idx) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col justify-between"
            >
              <div>
                <span className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white text-xs font-bold flex items-center justify-center mb-2 font-mono">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-sm text-black dark:text-white mb-1">{p.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                  {p.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end gap-1">
                <button
                  onClick={() => openEditPillar(p)}
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeletePillar(p.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Modal */}
      {missionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl relative text-[var(--text-primary)]">
            <button
              onClick={() => setMissionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">{editingMission ? "Edit Misi" : "Tambah Poin Misi"}</h3>
            <form onSubmit={handleSaveMission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul Misi</label>
                <input
                  type="text"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="Contoh: Desain Berdampak"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi Misi</label>
                <textarea
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  placeholder="Uraian komitmen nyata misi ini..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMissionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
                >
                  Simpan Misi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pillar Modal */}
      {pillarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl relative text-[var(--text-primary)]">
            <button
              onClick={() => setPillarModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">{editingPillar ? "Edit Pilar Filosofi" : "Tambah Pilar Filosofi"}</h3>
            <form onSubmit={handleSavePillar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Pilar</label>
                <input
                  type="text"
                  value={pillarTitle}
                  onChange={(e) => setPillarTitle(e.target.value)}
                  placeholder="Contoh: Logika & Kreativitas"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Makna Filosofi</label>
                <textarea
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                  placeholder="Jelaskan nilai filosofis di balik pilar ini..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPillarModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
                >
                  Simpan Pilar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
