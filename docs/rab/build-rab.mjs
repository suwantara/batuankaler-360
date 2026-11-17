import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, '..');
const htmlPath = path.join(here, 'rab.html');
const pdfPath = path.join(docs, 'RAB-Project-Pura-Batuan-Kaler-360.pdf');
const mdPath = path.join(docs, 'RAB-Project-Pura-Batuan-Kaler-360.md');
const csvPath = path.join(docs, 'RAB-Project-Pura-Batuan-Kaler-360.csv');

const rupiah = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('id-ID');

function rp(value) {
	return rupiah.format(value).replace(/\s/g, ' ');
}

const scenarios = [
	{
		id: 'A',
		title: 'Pengembangan penuh (replacement value)',
		subtitle:
			'Nilai pasar jika aplikasi, desain, konten, dan deployment dibangun dari nol oleh tim profesional.',
		note: 'Bukan tagihan aktual. Berguna untuk menunjukkan nilai aset digital yang diserahkan.',
		contingency: 0.1,
		categories: [
			{
				name: 'Manajemen & analisis',
				items: [
					['Kickoff, kebutuhan, dan koordinasi', 16, 'jam', 150000],
					['Validasi konten dengan pengelola pura', 16, 'jam', 150000],
					['Dokumentasi teknis dan serah terima', 12, 'jam', 150000]
				]
			},
			{
				name: 'Desain UI/UX',
				items: [
					['Riset dan information architecture', 12, 'jam', 175000],
					['Wireframe dan prototipe', 16, 'jam', 175000],
					['Desain visual situs publik', 28, 'jam', 175000],
					['Desain visual panel admin', 20, 'jam', 175000],
					['Design system dan responsive layout', 12, 'jam', 175000]
				]
			},
			{
				name: 'Pengembangan aplikasi',
				items: [
					['Setup, autentikasi, database, dan admin', 32, 'jam', 200000],
					['Halaman publik dan CMS', 48, 'jam', 200000],
					['Viewer, hotspot, mini-map, dan peta', 40, 'jam', 200000],
					['Media, storage, dan backup', 28, 'jam', 200000],
					['Bilingual dan fallback konten', 16, 'jam', 200000],
					['Hardening, bugfix, dan aksesibilitas', 20, 'jam', 200000]
				]
			},
			{
				name: 'Konten dan media',
				items: [
					['Pengambilan foto 360 (2 hari)', 2, 'hari', 3000000],
					['Stitching dan editing 48 panorama', 48, 'panorama', 75000],
					['Thumbnail dan optimasi 48 panorama', 48, 'panorama', 15000],
					['Copywriting Indonesia 16 halaman', 16, 'halaman', 150000],
					['Terjemahan dan review Inggris 16 halaman', 16, 'halaman', 200000],
					['Verifikasi konten dengan pengelola', 12, 'jam', 100000],
					['Kurasi dan caption galeri 24 foto', 24, 'foto', 25000]
				]
			},
			{
				name: 'QA dan keamanan',
				items: [
					['Pengujian fungsional, E2E, dan perangkat', 24, 'jam', 125000],
					['Audit keamanan dan performa', 12, 'jam', 200000]
				]
			},
			{
				name: 'Deployment dan handover',
				items: [
					['Server, domain, SSL, dan migrasi', 16, 'jam', 150000],
					['Dokumentasi dan manual pengguna', 20, 'jam', 125000],
					['Pelatihan admin (2 sesi)', 2, 'sesi', 750000],
					['Serah terima dan pendampingan', 8, 'jam', 150000]
				]
			},
			{
				name: 'Infrastruktur tahun pertama',
				items: [
					['Domain .id (1 tahun)', 1, 'tahun', 250000],
					['VPS 4 GB public IPv4 (1 tahun)', 1, 'tahun', 1080000],
					['Backup offsite (1 tahun)', 1, 'tahun', 200000]
				]
			}
		]
	},
	{
		id: 'B',
		title: 'Finalisasi dan serah terima',
		subtitle:
			'Biaya aktual yang masih relevan karena aplikasi sudah dibangun dan 48 panorama sudah tersedia.',
		note: 'Ini skenario yang paling relevan untuk diajukan ke Desa pada tahap serah terima.',
		contingency: 0.1,
		categories: [
			{
				name: 'Kurasi dan konten',
				items: [
					['Review dan pemetaan 48 panorama', 8, 'jam', 100000],
					['Input media, scene, hotspot, dan area', 32, 'jam', 75000],
					['Copywriting final Indonesia 12 halaman', 12, 'halaman', 150000],
					['Terjemahan dan review Inggris 12 halaman', 12, 'halaman', 175000],
					['Verifikasi konten dengan pengelola', 12, 'jam', 100000],
					['Kurasi dan caption galeri 24 foto', 24, 'foto', 25000]
				]
			},
			{
				name: 'QA dan finalisasi',
				items: [
					['QA perangkat, upload, dan alur publikasi', 16, 'jam', 125000],
					['Deployment, migrasi, domain, dan SSL', 12, 'jam', 150000],
					['Finalisasi dokumentasi dan manual', 8, 'jam', 100000],
					['Pelatihan admin (2 sesi)', 2, 'sesi', 750000],
					['Serah terima dan pendampingan awal', 4, 'jam', 150000]
				]
			},
			{
				name: 'Infrastruktur tahun pertama',
				items: [
					['Domain .id (1 tahun)', 1, 'tahun', 250000],
					['VPS 4 GB public IPv4 (1 tahun)', 1, 'tahun', 1080000],
					['Backup offsite (1 tahun)', 1, 'tahun', 200000]
				]
			}
		]
	},
	{
		id: 'C',
		title: 'Operasional dan pemeliharaan tahunan',
		subtitle:
			'Perkiraan biaya berulang setelah serah terima, dengan asumsi konten dikelola desa dan operator melakukan pemeliharaan ringan.',
		note: 'Belum termasuk pengembangan fitur baru atau produksi konten tambahan.',
		contingency: 0.1,
		categories: [
			{
				name: 'Infrastruktur',
				items: [
					['VPS 4 GB public IPv4 (1 tahun)', 1, 'tahun', 1080000],
					['Domain .id (1 tahun)', 1, 'tahun', 250000],
					['Backup offsite (1 tahun)', 1, 'tahun', 200000]
				]
			},
			{
				name: 'Pemeliharaan',
				items: [
					['Monitoring dan health check bulanan', 12, 'bulan', 50000],
					['Update keamanan dan dependency', 12, 'jam', 150000],
					['Uji backup dan restore (2 kali)', 2, 'kegiatan', 300000],
					['Dukungan konten ringan', 12, 'jam', 100000]
				]
			}
		]
	}
];

function calculate(scenario) {
	const categories = scenario.categories.map((category) => {
		const items = category.items.map(([name, volume, unit, unitPrice], index) => ({
			no: index + 1,
			name,
			volume,
			unit,
			unitPrice,
			total: volume * unitPrice
		}));
		return {
			name: category.name,
			items,
			total: items.reduce((sum, item) => sum + item.total, 0)
		};
	});
	const subtotal = categories.reduce((sum, category) => sum + category.total, 0);
	const contingency = Math.round(subtotal * scenario.contingency);
	return { ...scenario, categories, subtotal, contingency, total: subtotal + contingency };
}

const calculated = scenarios.map(calculate);

function summaryRows() {
	return calculated
		.map(
			(scenario) => `<tr>
				<td><strong>${scenario.id}</strong></td>
				<td>${scenario.title}</td>
				<td class="num">${rp(scenario.subtotal)}</td>
				<td class="num">${scenario.contingency ? rp(scenario.contingency) : '—'}</td>
				<td class="num"><strong>${rp(scenario.total)}</strong></td>
			</tr>`
		)
		.join('');
}

function detailTable(scenario) {
	let rowNumber = 0;
	const rows = scenario.categories
		.map((category) => {
			const header = `<tr class="category"><td colspan="6">${category.name}</td></tr>`;
			const items = category.items
				.map((item) => {
					rowNumber += 1;
					return `<tr>
						<td class="num">${rowNumber}</td>
						<td>${item.name}</td>
						<td class="num">${number.format(item.volume)}</td>
						<td>${item.unit}</td>
						<td class="num">${rp(item.unitPrice)}</td>
						<td class="num">${rp(item.total)}</td>
					</tr>`;
				})
				.join('');
			const total = `<tr class="subtotal"><td colspan="5">Subtotal ${category.name}</td><td class="num">${rp(category.total)}</td></tr>`;
			return header + items + total;
		})
		.join('');

	return `<table class="detail">
		<thead>
			<tr>
				<th style="width:6%">No</th>
				<th>Uraian pekerjaan</th>
				<th style="width:8%">Vol</th>
				<th style="width:11%">Satuan</th>
				<th style="width:16%">Harga satuan</th>
				<th style="width:17%">Jumlah</th>
			</tr>
		</thead>
		<tbody>${rows}</tbody>
	</table>
	<table class="final-total">
		<tbody>
			<tr><td>Subtotal</td><td class="num">${rp(scenario.subtotal)}</td></tr>
			<tr><td>Kontingensi ${Math.round((scenario.contingency / scenario.subtotal) * 100)}%</td><td class="num">${rp(scenario.contingency)}</td></tr>
			<tr class="grand"><td>Total ${scenario.id}</td><td class="num">${rp(scenario.total)}</td></tr>
		</tbody>
	</table>`;
}

function markdown() {
	const lines = [];
	lines.push('# Rencana Anggaran Biaya (RAB)');
	lines.push('');
	lines.push('## Pura Batuan Kaler 360 — Virtual Tour Kawasan Pura');
	lines.push('');
	lines.push('**Disiapkan untuk:** Pemerintah Desa Batuan Kaler / Pengelola Pura  ');
	lines.push('**Versi:** 1.0 — November 2026  ');
	lines.push('**Mata uang:** Rupiah (IDR)  ');
	lines.push('');
	lines.push('> RAB ini bukan quotation resmi. Harga merupakan asumsi pasar untuk perencanaan dan dapat berubah sesuai vendor, lingkup, dan ketentuan pajak yang berlaku.');
	lines.push('');
	lines.push('## Ringkasan tiga skenario');
	lines.push('');
	lines.push('| Kode | Skenario | Subtotal | Kontingensi 10% | Total |');
	lines.push('|---|---|---:|---:|---:|');
	for (const scenario of calculated) {
		lines.push(
			`| ${scenario.id} | ${scenario.title} | ${rp(scenario.subtotal)} | ${rp(scenario.contingency)} | **${rp(scenario.total)}** |`
		);
	}
	lines.push('');
	lines.push('## Asumsi');
	lines.push('');
	lines.push('- Harga menggunakan asumsi pasar Indonesia/Bali tahun 2026.');
	lines.push('- Skenario A adalah nilai pengembangan penuh, bukan tagihan aktual.');
	lines.push('- Skenario B adalah perkiraan biaya finalisasi dan serah terima karena aplikasi dan 48 panorama sudah tersedia.');
	lines.push('- Skenario C adalah biaya berulang tahunan setelah serah terima.');
	lines.push('- Belum termasuk pajak, perizinan, biaya adat, pembelian kamera 360, drone, iklan, atau produksi konten baru.');
	lines.push('- Kontingensi 10% disediakan untuk perubahan kecil, revisi, dan ketidakpastian lapangan.');
	lines.push('');
	for (const scenario of calculated) {
		lines.push(`## Skenario ${scenario.id} — ${scenario.title}`);
		lines.push('');
		lines.push(scenario.subtitle);
		lines.push('');
		lines.push(`> ${scenario.note}`);
		lines.push('');
		for (const category of scenario.categories) {
			lines.push(`### ${category.name}`);
			lines.push('');
			lines.push('| No | Uraian | Vol | Satuan | Harga satuan | Jumlah |');
			lines.push('|---:|---|---:|---|---:|---:|');
			category.items.forEach((item, index) => {
				lines.push(
					`| ${index + 1} | ${item.name} | ${number.format(item.volume)} | ${item.unit} | ${rp(item.unitPrice)} | ${rp(item.total)} |`
				);
			});
			lines.push(`| | **Subtotal ${category.name}** | | | | **${rp(category.total)}** |`);
			lines.push('');
		}
		lines.push('| | | | | **Subtotal** | **' + rp(scenario.subtotal) + '** |');
		lines.push('|---|---|---|---|---:|---:|');
		lines.push(`| | | | | Kontingensi 10% | ${rp(scenario.contingency)} |`);
		lines.push(`| | | | | **Total ${scenario.id}** | **${rp(scenario.total)}** |`);
		lines.push('');
	}
	lines.push('## Jadwal pembayaran yang disarankan (Skenario B)');
	lines.push('');
	lines.push('| Tahap | Persentase | Jumlah |');
	lines.push('|---|---:|---:|');
	lines.push(`| Kickoff dan finalisasi rencana | 30% | ${rp(Math.round(calculated[1].total * 0.3))} |`);
	lines.push(`| Konten, QA, dan deployment | 40% | ${rp(Math.round(calculated[1].total * 0.4))} |`);
	lines.push(`| Serah terima dan pendampingan | 30% | ${rp(Math.round(calculated[1].total * 0.3))} |`);
	lines.push('');
	lines.push('## Catatan pengadaan');
	lines.push('');
	lines.push('- RAB Belum termasuk pajak. Sesuaikan PPN/PPh dengan status vendor dan ketentuan yang berlaku.');
	lines.push('- Jika desa memiliki operator teknis sendiri, beberapa item pemeliharaan dapat dikurangi.');
	lines.push('- Nilai aplikasi yang sudah dikembangkan dapat dicatat sebagai kontribusi in-kind/aset digital yang diserahkan.');
	lines.push('- Simpan dokumen ini bersama berita acara serah terima dan dokumentasi sistem.');
	lines.push('');
	return lines.join('\n');
}

function csv() {
	const rows = [['skenario', 'kategori', 'no', 'uraian', 'volume', 'satuan', 'harga_satuan', 'jumlah']];
	for (const scenario of calculated) {
		for (const category of scenario.categories) {
			category.items.forEach((item, index) => {
				rows.push([
					scenario.id,
					category.name,
					String(index + 1),
					item.name,
					String(item.volume),
					item.unit,
					String(item.unitPrice),
					String(item.total)
				]);
			});
			rows.push([scenario.id, category.name, '', `Subtotal ${category.name}`, '', '', '', String(category.total)]);
		}
		rows.push([scenario.id, '', '', 'Subtotal skenario', '', '', '', String(scenario.subtotal)]);
		rows.push([scenario.id, '', '', 'Kontingensi 10%', '', '', '', String(scenario.contingency)]);
		rows.push([scenario.id, '', '', 'Total skenario', '', '', '', String(scenario.total)]);
	}
	return rows
		.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
		.join('\n');
}

mkdirSync(here, { recursive: true });
writeFileSync(mdPath, markdown() + '\n');
writeFileSync(csvPath, csv() + '\n');

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>RAB Project Pura Batuan Kaler 360</title>
<style>
	@page { size: A4; margin: 17mm 15mm 18mm; }
	* { box-sizing: border-box; }
	html { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
	body { margin: 0; background: #fffdf7; color: #3d4250; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 9pt; line-height: 1.5; }
	h1, h2, h3 { margin: 0; color: #21294c; font-family: Georgia, serif; line-height: 1.16; }
	h1 { font-size: 25pt; }
	h2 { margin-top: 1.4em; padding-top: .5em; border-top: 1px solid #d9d1bc; font-size: 14pt; }
	h3 { margin-top: 1em; font-size: 11pt; }
	p { margin: .5em 0; }
	ul { margin: .5em 0; padding-left: 1.2em; }
	li { margin: .2em 0; }
	code { padding: .08em .3em; border-radius: 3px; background: #efe9da; font-family: Consolas, monospace; font-size: .9em; }
	.cover { min-height: 252mm; padding: 30mm 20mm 18mm; display: flex; flex-direction: column; justify-content: space-between; background: #141829; color: #f9f2d7; }
	.cover .kicker { margin: 0; color: #f2dea8; font-size: 8pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
	.cover h1 { margin-top: 14mm; color: #fffdf7; font-size: 35pt; }
	.cover .subtitle { max-width: 135mm; margin-top: 7mm; color: rgb(249 242 215 / .78); font-size: 12pt; }
	.cover .meta { margin-top: 18mm; padding-top: 6mm; border-top: 1px solid rgb(249 242 215 / .25); font-size: 8pt; }
	.cover .meta span { display: block; margin-bottom: 1mm; color: rgb(249 242 215 / .55); font-size: 6.8pt; letter-spacing: .12em; text-transform: uppercase; }
	.cover .meta div { margin-bottom: 5mm; }
	.cover .footer { display: flex; justify-content: space-between; padding-top: 5mm; border-top: 1px solid rgb(249 242 215 / .22); color: rgb(249 242 215 / .55); font-size: 7pt; text-transform: uppercase; letter-spacing: .08em; }
	.page-break { break-before: page; }
	.eyebrow { color: #9b7830; font-size: 7pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
	.lead { max-width: 150mm; color: #5f5f5b; font-size: 10pt; }
	table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: .6em 0 .9em; font-size: 8pt; }
	thead { display: table-header-group; }
	th, td { padding: 5px 6px; border: 1px solid #d9d1bc; vertical-align: top; overflow-wrap: break-word; }
	th { background: #eee7d6; color: #21294c; text-align: left; }
	.num { text-align: right; white-space: nowrap; }
	tr.category td { background: #e9e2d2; color: #21294c; font-weight: 700; }
	tr.subtotal td { background: #f5f0e4; font-weight: 700; }
	tfoot tr.grand td { background: #21294c; color: #fffdf7; font-weight: 700; }
	table.final-total { width: 58%; margin: 0 0 1em auto; font-size: 8.6pt; }
	table.final-total td { padding: 5px 6px; }
	table.final-total tr.grand td { background: #21294c; color: #fffdf7; font-weight: 700; }
	.callout { margin: .8em 0; padding: 3.5mm 4mm; border-left: 3px solid #d2a84a; background: #f7f0dd; font-size: 8.4pt; }
	.callout strong { color: #21294c; }
	.callout--danger { border-left-color: #a53d32; background: #fbefed; }
	.summary td { font-size: 8.4pt; }
	.signature { display: grid; grid-template-columns: 1fr 1fr; gap: 15mm; margin-top: 15mm; font-size: 9pt; }
	.signature .line { margin-top: 20mm; padding-top: 2mm; border-top: 1px solid #777; }
	.small { color: #6b6f7b; font-size: 7.8pt; }
</style>
</head>
<body>
<section class="cover">
	<div>
		<p class="kicker">Rencana Anggaran Biaya · Serah Terima</p>
		<h1>Pura Batuan<br />Kaler 360</h1>
		<p class="subtitle">RAB pengembangan, finalisasi, dan operasional sistem virtual tour 360° kawasan Pura Batuan Kaler.</p>
		<div class="meta">
			<div><span>Disiapkan untuk</span>Pemerintah Desa Batuan Kaler &amp; Pengelola Pura</div>
			<div><span>Versi</span>1.0 — November 2026</div>
			<div><span>Mata uang</span>Rupiah Indonesia (IDR)</div>
			<div><span>Sifat</span>Dokumen perencanaan, bukan quotation resmi</div>
		</div>
	</div>
	<div class="footer"><span>Pura Batuan Kaler 360</span><span>RAB · 2026</span></div>
</section>

<section class="page-break">
	<p class="eyebrow">Ringkasan</p>
	<h1 style="font-size:23pt; margin-top:4mm">Tiga skenario anggaran</h1>
	<p class="lead" style="margin-top:4mm">RAB ini memisahkan nilai pengembangan penuh, kebutuhan aktual serah terima, dan biaya operasional tahunan agar dapat digunakan untuk diskusi dengan Pemerintah Desa.</p>
	<table class="summary">
		<thead><tr><th style="width:10%">Kode</th><th>Skenario</th><th style="width:17%">Subtotal</th><th style="width:15%">Kontingensi</th><th style="width:18%">Total</th></tr></thead>
		<tbody>${summaryRows()}</tbody>
	</table>
	<div class="callout"><strong>Rekomendasi untuk Desa.</strong> Gunakan Skenario B sebagai dasar biaya finalisasi dan serah terima. Skenario A dapat dicatat sebagai nilai aset digital yang sudah dikembangkan. Skenario C disiapkan sebagai anggaran operasional tahunan.</div>
	<h2>Asumsi utama</h2>
	<ul>
		<li>Harga memakai asumsi pasar Indonesia/Bali tahun 2026.</li>
		<li>Aplikasi sudah dibangun dan 48 panorama sudah tersedia; Skenario B tidak mengulang biaya pengembangan penuh.</li>
		<li>Kontingensi 10% disediakan untuk revisi kecil dan ketidakpastian lapangan.</li>
		<li>Belum termasuk pajak, perizinan, biaya adat, pembelian kamera 360, drone, iklan, atau produksi konten baru.</li>
		<li>Harga dapat berubah sesuai vendor, lingkup, dan ketentuan pengadaan desa.</li>
	</ul>
	<h2>Jadwal pembayaran yang disarankan — Skenario B</h2>
	<table>
		<thead><tr><th>Tahap</th><th style="width:18%">Persentase</th><th style="width:24%">Jumlah</th></tr></thead>
		<tbody>
			<tr><td>Kickoff dan finalisasi rencana</td><td class="num">30%</td><td class="num">${rp(Math.round(calculated[1].total * 0.3))}</td></tr>
			<tr><td>Konten, QA, dan deployment</td><td class="num">40%</td><td class="num">${rp(Math.round(calculated[1].total * 0.4))}</td></tr>
			<tr><td>Serah terima dan pendampingan</td><td class="num">30%</td><td class="num">${rp(Math.round(calculated[1].total * 0.3))}</td></tr>
		</tbody>
	</table>
	<div class="callout callout--danger"><strong>Catatan pajak.</strong> RAB belum memasukkan PPN/PPh. Sesuaikan dengan status vendor dan ketentuan perpajakan yang berlaku.</div>
</section>

${calculated.map((scenario) => `
<section class="page-break">
	<p class="eyebrow">Skenario ${scenario.id}</p>
	<h1 style="font-size:22pt; margin-top:4mm">${scenario.title}</h1>
	<p class="lead" style="margin-top:4mm">${scenario.subtitle}</p>
	<div class="callout">${scenario.note}</div>
	${detailTable(scenario)}
</section>`).join('')}

<section class="page-break">
	<p class="eyebrow">Catatan &amp; persetujuan</p>
	<h1 style="font-size:23pt; margin-top:4mm">Ketentuan dan pengesahan</h1>
	<h2>Ruang lingkup RAB</h2>
	<ul>
		<li>Skenario A menggambarkan nilai pengembangan penuh dari nol.</li>
		<li>Skenario B menggambarkan finalisasi konten, QA, deployment, pelatihan, dan serah terima.</li>
		<li>Skenario C menggambarkan operasional dan pemeliharaan tahunan.</li>
		<li>Perubahan lingkup di luar daftar pekerjaan akan dihitung terpisah.</li>
	</ul>
	<h2>Pengurangan biaya yang mungkin</h2>
	<ul>
		<li>Jika desa menyediakan operator teknis sendiri, item pemeliharaan dapat dikurangi.</li>
		<li>Jika konten sudah final dan terverifikasi, item copywriting/verifikasi dapat dikurangi.</li>
		<li>Jika domain menggunakan subdomain resmi desa, biaya domain dapat dihilangkan.</li>
		<li>Jika hosting memakai fasilitas desa, biaya VPS dapat disesuaikan.</li>
	</ul>
	<h2>Pengesahan</h2>
	<div class="signature">
		<div>Disusun oleh:<div class="line">Nama / Peran</div></div>
		<div>Disetujui oleh:<div class="line">Nama / Peran Desa</div></div>
	</div>
	<p class="small" style="margin-top:12mm">Dokumen ini merupakan alat perencanaan. Nilai final mengikuti kesepakatan, lingkup pekerjaan, dan ketentuan pengadaan yang berlaku di Desa Batuan Kaler.</p>
</section>
</body>
</html>`;

writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
	path: pdfPath,
	format: 'A4',
	printBackground: true,
	preferCSSPageSize: true,
	displayHeaderFooter: true,
	headerTemplate: '<div></div>',
	footerTemplate: `<div style="width:100%;padding:0 15mm;font-family:Segoe UI,Arial,sans-serif;font-size:7px;color:#6b6f7b;display:flex;justify-content:space-between;"><span>RAB Project Pura Batuan Kaler 360 · November 2026</span><span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span></div>`
});
await browser.close();

console.log(`PDF: ${path.relative(process.cwd(), pdfPath)}`);
console.log(`Markdown: ${path.relative(process.cwd(), mdPath)}`);
console.log(`CSV: ${path.relative(process.cwd(), csvPath)}`);
for (const scenario of calculated) {
	console.log(`Skenario ${scenario.id}: ${rp(scenario.total)}`);
}
