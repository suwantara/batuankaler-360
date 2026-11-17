import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, '..');
const pdfPath = path.join(docs, 'RAB-Pengabdian-Masyarakat-Pura-Batuan-Kaler-360.pdf');
const mdPath = path.join(docs, 'RAB-Pengabdian-Masyarakat-Pura-Batuan-Kaler-360.md');
const csvPath = path.join(docs, 'RAB-Pengabdian-Masyarakat-Pura-Batuan-Kaler-360.csv');
const htmlPath = path.join(here, 'rab-pkm.html');

const rupiah = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('id-ID');
const rp = (value) => rupiah.format(value).replace(/\s/g, ' ');

const inKind = [
	['Manajemen, analisis, dan koordinasi', 6600000],
	['Desain UI/UX situs publik dan admin', 15400000],
	['Pengembangan aplikasi dan panel admin', 36800000],
	['Produksi konten, foto 360, dan terjemahan', 17720000],
	['QA, keamanan, dan performa', 5400000],
	['Deployment, dokumentasi, dan pelatihan', 7600000],
	['Infrastruktur tahun pertama', 1530000]
];

const inKindSubtotal = inKind.reduce((sum, [, value]) => sum + value, 0);
const inKindContingency = Math.round(inKindSubtotal * 0.1);
const inKindTotal = inKindSubtotal + inKindContingency;

const activity = [
	{
		category: 'Survei dan koordinasi awal',
		items: [
			['Transport tim (3 hari × 2 orang)', 6, 'OH', 150000],
			['Konsumsi tim (3 hari × 4 orang)', 12, 'OH', 50000],
			['Komunikasi dan koordinasi', 1, 'paket', 200000]
		]
	},
	{
		category: 'Produksi foto 360',
		items: [
			['Transport tim (2 hari × 3 orang)', 6, 'OH', 150000],
			['Konsumsi tim (2 hari × 3 orang)', 6, 'OH', 50000],
			['Perawatan atau sewa peralatan 360', 1, 'paket', 500000],
			['Akomodasi tim (3 orang × 1 malam)', 3, 'OH', 300000]
		]
	},
	{
		category: 'Pengolahan dan pengembangan',
		items: [
			['Konsumsi rapat kerja (4 × 5 orang)', 20, 'OH', 40000],
			['Kuota internet dan data', 1, 'paket', 300000]
		]
	},
	{
		category: 'Validasi dan FGD pengelola',
		items: [
			['Konsumsi peserta FGD', 20, 'orang', 50000],
			['Transport narasumber', 2, 'orang', 300000],
			['Cetak materi validasi', 1, 'paket', 300000]
		]
	},
	{
		category: 'Pelatihan admin desa',
		items: [
			['Konsumsi peserta pelatihan', 15, 'orang', 50000],
			['Cetak modul pelatihan', 10, 'buku', 50000],
			['Transport tim pelatih', 2, 'orang', 150000]
		]
	},
	{
		category: 'Dokumentasi dan publikasi',
		items: [
			['Dokumentasi foto dan video', 1, 'paket', 500000],
			['Publikasi dan luaran', 1, 'paket', 1000000],
			['Desain dan cetak poster', 1, 'paket', 300000]
		]
	},
	{
		category: 'Operasional dan pelaporan',
		items: [
			['ATK dan cetak laporan', 1, 'paket', 300000],
			['Komunikasi dan internet', 1, 'paket', 200000]
		]
	}
].map((category, categoryIndex) => ({
	...category,
	categoryIndex,
	items: category.items.map(([name, volume, unit, unitPrice], index) => ({
		no: index + 1,
		name,
		volume,
		unit,
		unitPrice,
		total: volume * unitPrice
	}))
}));

const activitySubtotal = activity.reduce(
	(sum, category) => sum + category.items.reduce((itemSum, item) => itemSum + item.total, 0),
	0
);
const activityContingency = Math.round(activitySubtotal * 0.1);
const activityTotal = activitySubtotal + activityContingency;

const operationalMinimum = [
	['VPS 4 GB public IPv4 (1 tahun)', 1, 'tahun', 1080000],
	['Domain .id (1 tahun)', 1, 'tahun', 250000],
	['Backup offsite (1 tahun)', 1, 'tahun', 200000]
].map(([name, volume, unit, unitPrice], index) => ({
	no: index + 1,
	name,
	volume,
	unit,
	unitPrice,
	total: volume * unitPrice
}));

const operationalMinimumSubtotal = operationalMinimum.reduce((sum, item) => sum + item.total, 0);

const operationalMaintenance = [
	['Monitoring dan health check bulanan', 12, 'bulan', 50000],
	['Update keamanan dan dependency', 12, 'jam', 150000],
	['Uji backup dan restore (2 kali)', 2, 'kegiatan', 300000],
	['Dukungan konten ringan', 12, 'jam', 100000]
].map(([name, volume, unit, unitPrice], index) => ({
	no: index + 1,
	name,
	volume,
	unit,
	unitPrice,
	total: volume * unitPrice
}));

const operationalMaintenanceSubtotal = operationalMaintenance.reduce(
	(sum, item) => sum + item.total,
	0
);
const operationalWithMaintenanceSubtotal =
	operationalMinimumSubtotal + operationalMaintenanceSubtotal;
const operationalWithMaintenanceTotal = Math.round(
	operationalWithMaintenanceSubtotal * 1.1
);
const operationalAll = [...operationalMinimum, ...operationalMaintenance].map((item, index) => ({
	...item,
	no: index + 1
}));

function tableHead() {
	return `<thead><tr><th style="width:6%">No</th><th>Uraian</th><th style="width:8%">Vol</th><th style="width:10%">Satuan</th><th style="width:16%">Harga satuan</th><th style="width:17%">Jumlah</th></tr></thead>`;
}

function activityTable() {
	const rows = activity
		.map((category) => {
			const items = category.items
				.map(
					(item) => `<tr>
						<td class="num">${item.no}</td>
						<td>${item.name}</td>
						<td class="num">${number.format(item.volume)}</td>
						<td>${item.unit}</td>
						<td class="num">${rp(item.unitPrice)}</td>
						<td class="num">${rp(item.total)}</td>
					</tr>`
				)
				.join('');
			const total = category.items.reduce((sum, item) => sum + item.total, 0);
			return `<tr class="category"><td colspan="6">${category.category}</td></tr>${items}
				<tr class="subtotal"><td colspan="5">Subtotal ${category.category}</td><td class="num">${rp(total)}</td></tr>`;
		})
		.join('');

	return `<table>${tableHead()}<tbody>${rows}</tbody></table>
		<table class="final-total"><tbody>
			<tr><td>Subtotal kegiatan</td><td class="num">${rp(activitySubtotal)}</td></tr>
			<tr><td>Kontingensi 10%</td><td class="num">${rp(activityContingency)}</td></tr>
			<tr class="grand"><td>Total RAB kegiatan PKM</td><td class="num">${rp(activityTotal)}</td></tr>
		</tbody></table>`;
}

function operationalTable(items, subtotal, title, total = subtotal) {
	return `<table>
		<thead><tr><th style="width:8%">No</th><th>Komponen</th><th style="width:10%">Vol</th><th style="width:12%">Satuan</th><th style="width:20%">Harga satuan</th><th style="width:20%">Jumlah</th></tr></thead>
		<tbody>${items
			.map(
				(item) => `<tr><td class="num">${item.no}</td><td>${item.name}</td><td class="num">${number.format(item.volume)}</td><td>${item.unit}</td><td class="num">${rp(item.unitPrice)}</td><td class="num">${rp(item.total)}</td></tr>`
			)
			.join('')}</tbody>
	</table>
	<table class="final-total"><tbody>
		<tr><td>Subtotal ${title}</td><td class="num">${rp(subtotal)}</td></tr>
		${total !== subtotal ? `<tr><td>Kontingensi 10%</td><td class="num">${rp(total - subtotal)}</td></tr><tr class="grand"><td>Total ${title}</td><td class="num">${rp(total)}</td></tr>` : ''}
	</tbody></table>`;
}

function inKindTable() {
	return `<table>
		<thead><tr><th>Komponen kontribusi</th><th style="width:24%">Nilai</th></tr></thead>
		<tbody>${inKind
			.map(([name, value]) => `<tr><td>${name}</td><td class="num">${rp(value)}</td></tr>`)
			.join('')}</tbody>
	</table>
	<table class="final-total"><tbody>
		<tr><td>Subtotal nilai kontribusi</td><td class="num">${rp(inKindSubtotal)}</td></tr>
		<tr><td>Kontingensi/nilai cadangan 10%</td><td class="num">${rp(inKindContingency)}</td></tr>
		<tr class="grand"><td>Total nilai kontribusi kampus</td><td class="num">${rp(inKindTotal)}</td></tr>
	</tbody></table>`;
}

function markdown() {
	const lines = [];
	lines.push('# RAB Program Pengabdian kepada Masyarakat');
	lines.push('');
	lines.push('## Pura Batuan Kaler 360 — Desa Batuan Kaler');
	lines.push('');
	lines.push('**Sifat:** RAB program pengabdian, **bukan tagihan kepada Desa**.  ');
	lines.push('**Versi:** 1.1 — November 2026  ');
	lines.push('**Mata uang:** Rupiah (IDR)');
	lines.push('');
	lines.push('> Pengembangan aplikasi, desain, produksi konten, dan dokumentasi merupakan kontribusi kampus/ tim pelaksana. Desa tidak ditagih biaya pengembangan.');
	lines.push('');
	lines.push('## Ringkasan pembiayaan');
	lines.push('');
	lines.push('| Komponen | Nilai | Ditagihkan ke Desa? |');
	lines.push('|---|---:|---|');
	lines.push(`| Nilai kontribusi kampus (in-kind) | ${rp(inKindTotal)} | Tidak |`);
	lines.push(`| Belanja kegiatan PKM | ${rp(activityTotal)} | Diajukan ke dana PKM kampus |`);
	lines.push(`| Operasional tahun pertama (minimum) | ${rp(operationalMinimumSubtotal)} | Diusulkan kampus/CSR/APBDes |`);
	lines.push(`| Operasional tahunan dengan pemeliharaan | ${rp(operationalWithMaintenanceTotal)} | Opsional, sesuai kemampuan desa |`);
	lines.push('');
	lines.push('## RAB kegiatan PKM');
	lines.push('');
	lines.push('| Kategori | Subtotal |');
	lines.push('|---|---:|');
	for (const category of activity) {
		const total = category.items.reduce((sum, item) => sum + item.total, 0);
		lines.push(`| ${category.category} | ${rp(total)} |`);
	}
	lines.push(`| **Subtotal** | **${rp(activitySubtotal)}** |`);
	lines.push(`| Kontingensi 10% | ${rp(activityContingency)} |`);
	lines.push(`| **Total RAB kegiatan PKM** | **${rp(activityTotal)}** |`);
	lines.push('');
	lines.push('## Nilai kontribusi kampus (in-kind)');
	lines.push('');
	lines.push('| Komponen | Nilai |');
	lines.push('|---|---:|');
	for (const [name, value] of inKind) lines.push(`| ${name} | ${rp(value)} |`);
	lines.push(`| **Subtotal** | **${rp(inKindSubtotal)}** |`);
	lines.push(`| Kontingensi 10% | ${rp(inKindContingency)} |`);
	lines.push(`| **Total nilai kontribusi** | **${rp(inKindTotal)}** |`);
	lines.push('');
	lines.push('## Operasional setelah program');
	lines.push('');
	lines.push('| Komponen | Nilai |');
	lines.push('|---|---:|');
	for (const item of operationalMinimum) lines.push(`| ${item.name} | ${rp(item.total)} |`);
	lines.push(`| **Minimum tahunan** | **${rp(operationalMinimumSubtotal)}** |`);
	lines.push(`| Dengan pemeliharaan ringan | ${rp(operationalWithMaintenanceTotal)} |`);
	lines.push('');
	lines.push('## Catatan');
	lines.push('');
	lines.push('- RAB kegiatan PKM bersifat contoh; sesuaikan dengan skim hibah dan aturan kampus.');
	lines.push('- Kamera 360 diasumsikan tersedia. Jika harus menyewa, tambahkan biaya sewa.');
	lines.push('- Tidak ada honorarium pengembangan yang dibebankan ke desa.');
	lines.push('- Operasional tahun pertama dapat ditanggung kampus/CSR; tahun berikutnya dapat menggunakan APBDes atau operator desa.');
	lines.push('- RAB belum termasuk pajak dan ketentuan pengadaan yang berlaku.');
	lines.push('');
	return lines.join('\n');
}

function csv() {
	const rows = [['kelompok', 'kategori', 'uraian', 'volume', 'satuan', 'harga_satuan', 'jumlah']];
	for (const category of activity) {
		for (const item of category.items) {
			rows.push([
				'Kegiatan PKM',
				category.category,
				item.name,
				String(item.volume),
				item.unit,
				String(item.unitPrice),
				String(item.total)
			]);
		}
	}
	rows.push(['Kegiatan PKM', '', 'Subtotal', '', '', '', String(activitySubtotal)]);
	rows.push(['Kegiatan PKM', '', 'Kontingensi 10%', '', '', '', String(activityContingency)]);
	rows.push(['Kegiatan PKM', '', 'Total', '', '', '', String(activityTotal)]);
	for (const [name, value] of inKind) {
		rows.push(['In-kind kampus', '', name, '', '', '', String(value)]);
	}
	rows.push(['In-kind kampus', '', 'Subtotal', '', '', '', String(inKindSubtotal)]);
	rows.push(['In-kind kampus', '', 'Kontingensi 10%', '', '', '', String(inKindContingency)]);
	rows.push(['In-kind kampus', '', 'Total', '', '', '', String(inKindTotal)]);
	for (const item of operationalMinimum) {
		rows.push(['Operasional', '', item.name, String(item.volume), item.unit, String(item.unitPrice), String(item.total)]);
	}
	rows.push(['Operasional', '', 'Minimum tahunan', '', '', '', String(operationalMinimumSubtotal)]);
	rows.push(['Operasional', '', 'Dengan pemeliharaan', '', '', '', String(operationalWithMaintenanceTotal)]);
	return rows
		.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
		.join('\n');
}

writeFileSync(mdPath, markdown() + '\n');
writeFileSync(csvPath, csv() + '\n');

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>RAB Pengabdian Masyarakat — Pura Batuan Kaler 360</title>
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
	.cover { min-height: 252mm; padding: 28mm 20mm 18mm; display: flex; flex-direction: column; justify-content: space-between; background: #141829; color: #f9f2d7; }
	.cover .kicker { margin: 0; color: #f2dea8; font-size: 8pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
	.cover h1 { margin-top: 14mm; color: #fffdf7; font-size: 34pt; }
	.cover .subtitle { max-width: 135mm; margin-top: 7mm; color: rgb(249 242 215 / .78); font-size: 12pt; }
	.cover .badge { display: inline-block; margin-top: 10mm; padding: 2mm 4mm; border: 1px solid rgb(242 222 168 / .5); color: #f2dea8; font-size: 7pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
	.cover .meta { margin-top: 16mm; padding-top: 6mm; border-top: 1px solid rgb(249 242 215 / .25); font-size: 8pt; }
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
	table.final-total { width: 58%; margin: 0 0 1em auto; font-size: 8.6pt; }
	table.final-total tr.grand td { background: #21294c; color: #fffdf7; font-weight: 700; }
	.callout { margin: .8em 0; padding: 3.5mm 4mm; border-left: 3px solid #d2a84a; background: #f7f0dd; font-size: 8.4pt; }
	.callout strong { color: #21294c; }
	.callout--danger { border-left-color: #a53d32; background: #fbefed; }
	.signature { display: grid; grid-template-columns: 1fr 1fr; gap: 15mm; margin-top: 15mm; font-size: 9pt; }
	.signature .line { margin-top: 20mm; padding-top: 2mm; border-top: 1px solid #777; }
	.small { color: #6b6f7b; font-size: 7.8pt; }
</style>
</head>
<body>
<section class="cover">
	<div>
		<p class="kicker">Rencana Anggaran Biaya · Program Pengabdian</p>
		<h1>RAB Pengabdian<br />Masyarakat</h1>
		<p class="subtitle">Pura Batuan Kaler 360 — dokumentasi digital dan virtual tour kawasan pura untuk Desa Batuan Kaler.</p>
		<span class="badge">Bukan tagihan kepada Desa</span>
		<div class="meta">
			<div><span>Pelaksana</span>Tim Pengabdian Kampus</div>
			<div><span>Mitra</span>Pemerintah Desa Batuan Kaler &amp; Pengelola Pura</div>
			<div><span>Versi</span>1.1 — November 2026</div>
			<div><span>Sifat</span>Rencana anggaran program dan operasional</div>
		</div>
	</div>
	<div class="footer"><span>Pura Batuan Kaler 360</span><span>Pengabdian · 2026</span></div>
</section>

<section class="page-break">
	<p class="eyebrow">Ringkasan pembiayaan</p>
	<h1 style="font-size:23pt; margin-top:4mm">Kontribusi kampus, bukan tagihan desa</h1>
	<p class="lead" style="margin-top:4mm">Pengembangan aplikasi, desain, produksi konten, dan dokumentasi merupakan kontribusi kampus/tim pelaksana. Desa tidak ditagih biaya pengembangan.</p>
	<table>
		<thead><tr><th>Komponen</th><th style="width:24%">Nilai</th><th style="width:25%">Ditagihkan ke Desa?</th></tr></thead>
		<tbody>
			<tr><td>Nilai kontribusi kampus (in-kind)</td><td class="num">${rp(inKindTotal)}</td><td>Tidak</td></tr>
			<tr><td>Belanja kegiatan PKM</td><td class="num">${rp(activityTotal)}</td><td>Diajukan ke dana PKM kampus</td></tr>
			<tr><td>Operasional tahun pertama (minimum)</td><td class="num">${rp(operationalMinimumSubtotal)}</td><td>Diusulkan kampus/CSR/APBDes</td></tr>
			<tr><td>Operasional tahunan dengan pemeliharaan</td><td class="num">${rp(operationalWithMaintenanceTotal)}</td><td>Opsional, sesuai kemampuan desa</td></tr>
		</tbody>
	</table>
	<div class="callout"><strong>Prinsip utama.</strong> Tidak ada invoice pengembangan kepada Desa. Angka kontribusi kampus adalah nilai in-kind untuk laporan dan pengakuan kontribusi, bukan uang yang diminta dari desa.</div>
	<h2>Pembagian peran</h2>
	<table>
		<thead><tr><th style="width:24%">Pihak</th><th>Kontribusi</th></tr></thead>
		<tbody>
			<tr><td>Kampus</td><td>SDM, desain, pengembangan, produksi konten, QA, pelatihan, dokumentasi, dan luaran pengabdian.</td></tr>
			<tr><td>Desa</td><td>Koordinasi, izin, narasumber, validasi konten, tempat kegiatan, dan operator konten setelah serah terima.</td></tr>
			<tr><td>Sponsor/CSR</td><td>Opsional untuk domain, VPS, backup, atau pemeliharaan tahun pertama.</td></tr>
		</tbody>
	</table>
</section>

<section class="page-break">
	<p class="eyebrow">RAB kegiatan</p>
	<h1 style="font-size:23pt; margin-top:4mm">Belanja kegiatan pengabdian</h1>
	<p class="lead" style="margin-top:4mm">Contoh RAB kegiatan untuk diajukan ke dana pengabdian kampus. Sesuaikan dengan skim hibah dan aturan kampus.</p>
	${activityTable()}
	<div class="callout"><strong>Asumsi.</strong> Tim 4 orang, 3 kunjungan lapangan, kamera 360 tersedia. Jika kamera harus disewa, tambahkan biaya sewa. RAB belum termasuk honorarium pengembangan.</div>
</section>

<section class="page-break">
	<p class="eyebrow">Kontribusi kampus</p>
	<h1 style="font-size:23pt; margin-top:4mm">Nilai in-kind yang diserahkan</h1>
	<p class="lead" style="margin-top:4mm">Nilai pasar pekerjaan yang sudah diselesaikan. Angka ini untuk laporan pertanggungjawaban dan pengakuan kontribusi, bukan tagihan kepada desa.</p>
	${inKindTable()}
	<div class="callout"><strong>Catatan.</strong> Nilai in-kind dapat dicantumkan dalam laporan pengabdian dan berita acara serah terima sebagai kontribusi program, bukan sebagai utang atau kewajiban desa.</div>
</section>

<section class="page-break">
	<p class="eyebrow">Operasional</p>
	<h1 style="font-size:23pt; margin-top:4mm">Biaya setelah program</h1>
	<p class="lead" style="margin-top:4mm">Biaya minimum agar situs tetap online. Tahun pertama dapat ditanggung kampus/CSR; tahun berikutnya dapat menggunakan APBDes atau operator desa.</p>
	<h2>Minimum tahunan</h2>
	${operationalTable(operationalMinimum, operationalMinimumSubtotal, 'operasional minimum')}
	<h2>Dengan pemeliharaan ringan</h2>
	${operationalTable(operationalAll, operationalWithMaintenanceSubtotal, 'operasional dengan pemeliharaan', operationalWithMaintenanceTotal)}
	<div class="callout"><strong>Pengurangan biaya.</strong> Jika memakai subdomain resmi desa, biaya domain dapat dihilangkan. Jika desa menyediakan operator, dukungan konten dan sebagian pemeliharaan dapat dikurangi.</div>
</section>

<section class="page-break">
	<p class="eyebrow">Catatan &amp; pengesahan</p>
	<h1 style="font-size:23pt; margin-top:4mm">Ketentuan program</h1>
	<h2>Yang tidak termasuk</h2>
	<ul>
		<li>Pembelian kamera 360, drone, atau peralatan produksi baru.</li>
		<li>Iklan, perizinan, biaya adat, dan produksi konten di luar lingkup.</li>
		<li>Pajak dan ketentuan pengadaan yang berlaku.</li>
		<li>Pengembangan fitur baru setelah serah terima.</li>
	</ul>
	<h2>Rekomendasi pembiayaan</h2>
	<ol>
		<li>Pengembangan dan produksi konten: kontribusi kampus, tanpa tagihan ke desa.</li>
		<li>Belanja kegiatan: dana pengabdian kampus.</li>
		<li>Operasional tahun pertama: kampus/CSR, atau APBDes jika disetujui.</li>
		<li>Operasional tahun berikutnya: APBDes/operator desa, minimum Rp1.530.000 per tahun.</li>
	</ol>
	<div class="callout callout--danger"><strong>Pernyataan.</strong> RAB ini bukan quotation dan bukan tagihan komersial. Nilai kontribusi kampus tidak boleh diperlakukan sebagai kewajiban pembayaran Desa.</div>
	<h2>Pengesahan</h2>
	<div class="signature">
		<div>Disusun oleh:<div class="line">Ketua Pelaksana / Tim Pengabdian</div></div>
		<div>Diketahui oleh:<div class="line">Kepala Desa Batuan Kaler</div></div>
	</div>
	<div class="signature" style="margin-top:4mm">
		<div>Disetujui oleh:<div class="line">Dosen Pembimbing / LPPM</div></div>
		<div>Pengelola Pura:<div class="line">Nama / Peran</div></div>
	</div>
	<p class="small" style="margin-top:12mm">Dokumen ini merupakan alat perencanaan program pengabdian. Nilai final mengikuti kesepakatan, skim hibah, dan ketentuan yang berlaku.</p>
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
	footerTemplate: `<div style="width:100%;padding:0 15mm;font-family:Segoe UI,Arial,sans-serif;font-size:7px;color:#6b6f7b;display:flex;justify-content:space-between;"><span>RAB Pengabdian Masyarakat · Pura Batuan Kaler 360 · November 2026</span><span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span></div>`
});
await browser.close();

console.log(`PDF: ${path.relative(process.cwd(), pdfPath)}`);
console.log(`Markdown: ${path.relative(process.cwd(), mdPath)}`);
console.log(`CSV: ${path.relative(process.cwd(), csvPath)}`);
console.log(`In-kind: ${rp(inKindTotal)}`);
console.log(`Kegiatan PKM: ${rp(activityTotal)}`);
console.log(`Operasional minimum: ${rp(operationalMinimumSubtotal)}`);
console.log(`Operasional dengan pemeliharaan: ${rp(operationalWithMaintenanceTotal)}`);
