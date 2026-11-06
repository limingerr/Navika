# AGENTS.md

NAVIKA adalah aplikasi pencari peluang mahasiswa (beasiswa, magang, bootcamp). Gunakan bahasa Indonesia untuk copy dan komentar. Spesifikasi produk ada di `PRD-NAVIKA.md`.

## Struktur aplikasi

- `app/` berisi halaman, layout, dan Route Handlers Next.js 16.
- `src/components/` berisi komponen React dan penyedia state aplikasi; `src/data/` berisi katalog bawaan; `src/lib/` berisi fungsi pendukung serta klien Supabase; `src/services/` berisi integrasi dan layanan.
- `scripts/` berisi perintah CLI, `tests/` berisi tes Node.js, dan `style/` berisi CSS aplikasi.
- `supabase/` berisi skema, seed, dan migrasi database. Jangan pindahkan kunci service role ke kode browser.
- Prototipe HTML lama sudah dihapus. PRD dan bahan referensi desain tetap merupakan dokumen sejarah, bukan sumber data pengguna atau katalog produksi.
- `export/`, `laporan.pdf`, dan `contoh desain/` adalah bahan referensi. Tanggal, nama, dan jumlah pada mockup bukan data nyata.

## Konvensi

- Jalankan perintah dari root: `npm.cmd run dev`, `npm.cmd test`, dan `npm.cmd run build`.
- Baca panduan yang relevan di `node_modules/next/dist/docs/` sebelum mengubah kode Next.js.
- Gunakan JavaScript dan CSS biasa; jangan tambahkan Tailwind atau TypeScript.
- Match harus deterministik dan dapat dijelaskan per dimensi; MVP tidak menggunakan AI untuk pencocokan.
- ID bisnis tidak boleh diambil dari nama file atau label tampilan.
- Pertahankan penyesuaian warna untuk kontras WCAG saat mengubah CSS aplikasi.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `.agents/skills/antislop/SKILL.md` (core) and then the skill for the task:
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: replace the core and skill folders from the release matching it, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
