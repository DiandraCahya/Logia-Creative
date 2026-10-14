# Slot Font "Anthropic Sans" (opsional)

Anthropic Sans adalah font proprietary Anthropic. **Jangan** pakai kalau Anda
tidak punya lisensinya. Folder ini disediakan sebagai slot saja.

Situs sudah berjalan dengan **Inter** sebagai substitusi terdekat (dimuat via
`next/font/google`, variable, `display: swap`). Tidak ada error kalau folder ini
kosong.

## Cara mengaktifkan font lokal Anda sendiri

1. Taruh file woff2 di sini, contoh:

   ```
   public/fonts/anthropic-sans/AnthropicSans-Regular.woff2
   public/fonts/anthropic-sans/AnthropicSans-Medium.woff2
   ```

2. Buka `src/app/layout.tsx`, ikuti blok komentar "SLOT Anthropic Sans":

   ```ts
   import localFont from "next/font/local";

   const anthropic = localFont({
     src: [
       { path: "../../public/fonts/anthropic-sans/AnthropicSans-Regular.woff2", weight: "400", style: "normal" },
       { path: "../../public/fonts/anthropic-sans/AnthropicSans-Medium.woff2", weight: "500", style: "normal" },
     ],
     variable: "--font-anthropic",
     display: "swap",
   });
   ```

3. Tambahkan ke `<html>`:

   ```tsx
   className={`scroll-smooth ${fontSubstitute.variable} ${anthropic.variable}`}
   ```

4. Tidak ada langkah lain. `--font-sans` di `globals.css` sudah menaruh
   `"Anthropic Sans"` di posisi pertama stack, jadi begitu variabelnya ada,
   seluruh situs otomatis memakainya.