import type { Locale } from './locales';

const id = {
	meta: {
		title: 'Pura Batuan Kaler 360 — Virtual Tour Kawasan Pura',
		description:
			'Jelajahi kawasan Pura Batuan Kaler melalui panorama 360 derajat, informasi area, sejarah, dan panduan kunjungan.'
	},
	common: {
		skipToContent: 'Lewati ke konten',
		menu: 'Menu',
		closeMenu: 'Tutup menu',
		language: 'Ganti bahasa',
		navigation: 'Navigasi utama',
		footerNavigation: 'Navigasi footer'
	},
	nav: [
		{ label: 'Beranda', path: '' },
		{ label: 'Virtual Tour', path: '/tour' },
		{ label: 'Sejarah', path: '/sejarah' },
		{ label: 'Area', path: '/area' },
		{ label: 'Galeri', path: '/galeri' },
		{ label: 'Panduan', path: '/panduan' }
	],
	actions: {
		exploreTour: 'Jelajahi Virtual Tour',
		learnHistory: 'Pelajari Sejarah',
		viewAllAreas: 'Lihat Semua Area',
		openGallery: 'Buka Galeri',
		readGuide: 'Baca Panduan',
		readHistory: 'Baca Sejarah'
	},
	footer: {
		description:
			'Dokumentasi digital kawasan Pura Batuan Kaler dalam bentuk virtual tour 360 derajat. Disusun untuk mendukung orientasi pengunjung dengan tetap menghormati nilai dan aturan tempat.',
		explore: 'Jelajahi',
		visit: 'Kunjungan',
		note: 'Konten sedang melalui proses validasi pengelola.',
		rights: 'Pura Batuan Kaler 360.',
		cta: {
			eyebrow: 'Virtual tour',
			title: 'Masuk ke kawasan, satu panorama demi satu.',
			body: 'Mulai dari Jaba Pura, lalu berjalan menuju area berikutnya melalui hotspot dan daftar scene.'
		}
	},
	home: {
		hero: {
			eyebrow: 'Dokumentasi digital kawasan pura',
			title: 'Pura Batuan Kaler, dalam pandangan 360°.',
			titleLead: 'Pura Batuan Kaler,',
			titleAccent: 'dalam pandangan 360°.',
			description:
				'Jelajahi suasana kawasan pura melalui panorama interaktif, mengenal area yang terdokumentasi, dan memahami konteks kunjungan dengan tetap menghormati nilai dan aturan tempat.',
			note: 'Konten visual dan informasi sedang melalui proses validasi pengelola.',
			viewLabel: 'Pratinjau panorama',
			meta: [
				{ label: 'Panorama', value: '360°' },
				{ label: 'Navigasi', value: 'Multi-scene' },
				{ label: 'Bahasa', value: 'ID / EN' }
			]
		},
		intro: {
			eyebrow: 'Tentang proyek',
			title: 'Menjaga ingatan tempat melalui dokumentasi yang cermat.',
			body: 'Pura Batuan Kaler 360 menghadirkan dokumentasi visual kawasan pura dalam bentuk tur panorama. Setiap area, keterangan, dan panduan kunjungan disusun untuk membantu pengunjung memahami tempat sebelum berkunjung.',
			points: [
				{
					title: 'Dokumentasi visual',
					body: 'Panorama dan foto membantu pengunjung mengenali ruang, bangunan, dan jalur kawasan.'
				},
				{
					title: 'Informasi kontekstual',
					body: 'Setiap titik dapat dilengkapi keterangan area, fungsi, dan aturan yang berlaku.'
				},
				{
					title: 'Panduan kunjungan',
					body: 'Informasi praktis disusun bersama pengelola agar kunjungan berlangsung hormat dan tertib.'
				}
			]
		},
		tour: {
			eyebrow: 'Virtual tour',
			title: 'Berpindah dari satu area ke area lain.',
			body: 'Panorama 360 derajat dilengkapi titik interaktif untuk berpindah lokasi dan membuka informasi area. Gunakan drag, sentuhan, atau kontrol zoom untuk menjelajah.',
			previewLabel: 'Pratinjau panorama 360°'
		},
		history: {
			eyebrow: 'Sejarah',
			title: 'Konteks yang melandasi kawasan.',
			body: 'Ringkasan sejarah dan perkembangan kawasan pura akan ditampilkan setelah melalui proses verifikasi dan persetujuan pengelola. Pendekatan ini menjaga agar informasi yang dipublikasikan dapat dipertanggungjawabkan.',
			noteLabel: 'Catatan kurasi',
			status: 'Dalam proses verifikasi'
		},
		areas: {
			eyebrow: 'Area',
			title: 'Titik-titik yang dapat dijelajahi.',
			body: 'Setiap area memiliki karakter, fungsi, dan aturan yang berbeda. Nama dan deskripsi area pada tahap ini merupakan kerangka konten dan menunggu verifikasi pengelola.',
			items: [
				{
					name: 'Jaba Pura',
					description:
						'Ruang terbuka di bagian luar kawasan pura yang menjadi titik awal orientasi pengunjung.'
				},
				{
					name: 'Madya Mandala',
					description: 'Bagian tengah kawasan yang menghubungkan area luar dengan ruang utama.'
				},
				{
					name: 'Utama Mandala',
					description:
						'Ruang utama yang memerlukan perhatian khusus terhadap aturan dan etika kunjungan.'
				}
			]
		},
		gallery: {
			eyebrow: 'Galeri',
			title: 'Dokumentasi visual kawasan.',
			body: 'Foto dan media akan ditambahkan setelah izin dokumentasi dan validasi konten selesai. Galeri disiapkan untuk menampilkan detail arsitektur, lanskap, dan suasana kawasan.',
			pending: 'Dokumentasi menyusul',
			items: [
				{ title: 'Ruang luar', caption: 'Kerangka dokumentasi area luar' },
				{ title: 'Jalur masuk', caption: 'Kerangka dokumentasi jalur kunjungan' },
				{ title: 'Detail arsitektur', caption: 'Kerangka dokumentasi detail bangunan' }
			]
		},
		guide: {
			eyebrow: 'Panduan kunjungan',
			title: 'Persiapan sebelum berkunjung.',
			body: 'Informasi jam kunjungan, pakaian, dan etika akan mengikuti ketentuan resmi pengelola pura.',
			items: [
				{
					title: 'Etika kunjungan',
					body: 'Jaga ketenangan, ikuti arahan pemandu, dan hormati area yang dibatasi.'
				},
				{
					title: 'Pakaian',
					body: 'Gunakan pakaian sopan dan nyaman. Informasi lengkap akan mengikuti ketentuan pengelola.'
				},
				{
					title: 'Akses',
					body: 'Periksa jalur, waktu kunjungan, dan kebutuhan khusus sebelum berangkat.'
				}
			]
		}
	},
	pages: {
		tour: {
			eyebrow: 'Virtual tour',
			title: 'Jelajahi kawasan dalam 360°.',
			description:
				'Gunakan panorama interaktif untuk melihat suasana kawasan. Tarik atau geser tampilan, gunakan tombol zoom, dan buka layar penuh untuk pengalaman yang lebih luas.',
			notice:
				'Panorama pada halaman ini masih menggunakan aset uji. Scene dan hotspot dikelola melalui dashboard admin.',
			panel: {
				sceneList: 'Daftar scene',
				sceneListHint: 'Pilih scene untuk berpindah panorama.',
				activeScene: 'Scene aktif',
				info: 'Informasi hotspot',
				infoEmpty: 'Pilih hotspot informasi pada panorama untuk menampilkan keterangan area.',
				infoNotice: 'Konten informasi masih dalam kerangka dan menunggu verifikasi pengelola.',
				closeInfo: 'Tutup informasi',
				emptyScenes: 'Belum ada scene yang dipublikasikan.',
				emptyScenesHint:
					'Scene yang berstatus published akan tampil di sini. Administrator dapat mengelola scene melalui dashboard.'
			},
			controls: {
				loading: 'Memuat panorama…',
				error: 'Panorama gagal dimuat. Periksa koneksi lalu coba lagi.',
				retry: 'Coba lagi',
				zoomIn: 'Perbesar',
				zoomOut: 'Perkecil',
				reset: 'Reset tampilan',
				fullscreen: 'Layar penuh',
				exitFullscreen: 'Keluar layar penuh',
				gesture: 'Geser · Zoom · 360°'
			},
			tips: [
				{
					title: 'Tarik atau geser',
					body: 'Ubah arah pandang dengan mouse atau sentuhan.'
				},
				{
					title: 'Zoom',
					body: 'Gunakan tombol + dan − untuk memperbesar atau memperkecil tampilan.'
				},
				{
					title: 'Layar penuh',
					body: 'Buka viewer dalam layar penuh untuk pengalaman yang lebih luas.'
				}
			]
		},
		sejarah: {
			eyebrow: 'Sejarah',
			title: 'Sejarah dan konteks kawasan.',
			description:
				'Halaman ini akan memuat ringkasan sejarah Pura Batuan Kaler setelah melalui verifikasi dan persetujuan pengelola.',
			notice:
				'Konten sejarah belum dipublikasikan. Kerangka halaman disiapkan agar informasi yang nantinya tampil memiliki sumber yang dapat dipertanggungjawabkan.'
		},
		area: {
			eyebrow: 'Area',
			title: 'Mengenal area kawasan pura.',
			description:
				'Setiap area memiliki fungsi dan aturan kunjungan yang berbeda. Daftar berikut merupakan kerangka konten yang akan dilengkapi setelah verifikasi pengelola.',
			notice:
				'Nama, deskripsi, dan batas area masih menunggu validasi. Jangan menggunakan halaman ini sebagai panduan resmi sebelum konten final dipublikasikan.'
		},
		galeri: {
			eyebrow: 'Galeri',
			title: 'Dokumentasi visual kawasan.',
			description:
				'Galeri akan menampilkan foto dan media kawasan setelah izin dokumentasi dan validasi konten selesai.',
			notice:
				'Belum ada media final yang dipublikasikan. Elemen pada halaman ini merupakan placeholder untuk tata letak galeri.'
		},
		panduan: {
			eyebrow: 'Panduan kunjungan',
			title: 'Informasi sebelum berkunjung.',
			description:
				'Panduan kunjungan akan memuat informasi praktis mengenai etika, pakaian, akses, dan ketentuan pengelola pura.',
			notice:
				'Informasi pada tahap ini bersifat umum. Ketentuan resmi akan ditambahkan setelah dikonfirmasi oleh pengelola.'
		}
	}
};

export type SiteDictionary = typeof id;

const en: SiteDictionary = {
	meta: {
		title: 'Pura Batuan Kaler 360 — Virtual Tour of the Temple Grounds',
		description:
			'Explore the grounds of Pura Batuan Kaler through 360-degree panoramas, area information, history, and visit guidance.'
	},
	common: {
		skipToContent: 'Skip to content',
		menu: 'Menu',
		closeMenu: 'Close menu',
		language: 'Change language',
		navigation: 'Main navigation',
		footerNavigation: 'Footer navigation'
	},
	nav: [
		{ label: 'Home', path: '' },
		{ label: 'Virtual Tour', path: '/tour' },
		{ label: 'History', path: '/sejarah' },
		{ label: 'Areas', path: '/area' },
		{ label: 'Gallery', path: '/galeri' },
		{ label: 'Visit Guide', path: '/panduan' }
	],
	actions: {
		exploreTour: 'Explore the Virtual Tour',
		learnHistory: 'Learn the History',
		viewAllAreas: 'View All Areas',
		openGallery: 'Open Gallery',
		readGuide: 'Read the Guide',
		readHistory: 'Read the History'
	},
	footer: {
		description:
			'Digital documentation of Pura Batuan Kaler through a 360-degree virtual tour. Designed to help visitors orient themselves while respecting the values and rules of the place.',
		explore: 'Explore',
		visit: 'Visit',
		note: 'Content is currently undergoing review by the temple management.',
		rights: 'Pura Batuan Kaler 360.',
		cta: {
			eyebrow: 'Virtual tour',
			title: 'Enter the grounds, one panorama at a time.',
			body: 'Begin at Jaba Pura, then move through the following areas with hotspots and the scene list.'
		}
	},
	home: {
		hero: {
			eyebrow: 'Digital documentation of the temple grounds',
			title: 'Pura Batuan Kaler, in a 360° view.',
			titleLead: 'Pura Batuan Kaler,',
			titleAccent: 'in a 360° view.',
			description:
				'Explore the atmosphere of the temple grounds through interactive panoramas, discover documented areas, and understand the context of a visit while respecting the values and rules of the place.',
			note: 'Visual content and information are currently undergoing review by the temple management.',
			viewLabel: 'Panorama preview',
			meta: [
				{ label: 'Panorama', value: '360°' },
				{ label: 'Navigation', value: 'Multi-scene' },
				{ label: 'Language', value: 'ID / EN' }
			]
		},
		intro: {
			eyebrow: 'About the project',
			title: 'Preserving a sense of place through careful documentation.',
			body: 'Pura Batuan Kaler 360 presents visual documentation of the temple grounds as a panoramic tour. Each area, caption, and visit guideline is prepared to help visitors understand the place before they arrive.',
			points: [
				{
					title: 'Visual documentation',
					body: 'Panoramas and photographs help visitors recognise spaces, buildings, and routes across the grounds.'
				},
				{
					title: 'Contextual information',
					body: 'Each point can carry descriptions of the area, its function, and the rules that apply.'
				},
				{
					title: 'Visit guidance',
					body: 'Practical information is prepared with the management so visits remain respectful and orderly.'
				}
			]
		},
		tour: {
			eyebrow: 'Virtual tour',
			title: 'Move from one area to another.',
			body: 'The 360-degree panorama includes interactive points for moving between locations and opening area information. Drag, swipe, or use the zoom controls to explore.',
			previewLabel: '360° panorama preview'
		},
		history: {
			eyebrow: 'History',
			title: 'The context that shapes the grounds.',
			body: 'A summary of the history and development of the temple grounds will be published after verification and approval by the management. This approach ensures that published information can be accounted for.',
			noteLabel: 'Curatorial note',
			status: 'Under verification'
		},
		areas: {
			eyebrow: 'Areas',
			title: 'Points to explore.',
			body: 'Each area has a different character, function, and set of rules. Area names and descriptions at this stage are a content framework awaiting management verification.',
			items: [
				{
					name: 'Jaba Pura',
					description:
						'The open outer area of the temple grounds, serving as the starting point for visitor orientation.'
				},
				{
					name: 'Madya Mandala',
					description: 'The middle section connecting the outer area with the main sacred space.'
				},
				{
					name: 'Utama Mandala',
					description:
						'The main sacred space, which requires particular attention to visit rules and etiquette.'
				}
			]
		},
		gallery: {
			eyebrow: 'Gallery',
			title: 'Visual documentation of the grounds.',
			body: 'Photographs and media will be added once documentation permission and content review are complete. The gallery is prepared to show architectural details, landscape, and atmosphere.',
			pending: 'Documentation forthcoming',
			items: [
				{ title: 'Outer spaces', caption: 'Documentation framework for outer areas' },
				{ title: 'Approach path', caption: 'Documentation framework for visitor routes' },
				{ title: 'Architectural detail', caption: 'Documentation framework for building details' }
			]
		},
		guide: {
			eyebrow: 'Visit guide',
			title: 'Preparing before you arrive.',
			body: 'Information on visiting hours, dress, and etiquette will follow the official rules of the temple management.',
			items: [
				{
					title: 'Visit etiquette',
					body: 'Keep a quiet demeanour, follow the guide, and respect restricted areas.'
				},
				{
					title: 'Dress',
					body: 'Wear modest, comfortable clothing. Full details will follow the management requirements.'
				},
				{
					title: 'Access',
					body: 'Check the route, visiting hours, and any special needs before setting out.'
				}
			]
		}
	},
	pages: {
		tour: {
			eyebrow: 'Virtual tour',
			title: 'Explore the grounds in 360°.',
			description:
				'Use the interactive panorama to view the atmosphere of the grounds. Drag or swipe the view, use the zoom controls, and open full screen for a wider experience.',
			notice:
				'This page currently uses test assets. Scenes and hotspots are managed through the admin dashboard.',
			panel: {
				sceneList: 'Scene list',
				sceneListHint: 'Choose a scene to move to another panorama.',
				activeScene: 'Active scene',
				info: 'Hotspot information',
				infoEmpty: 'Choose an information hotspot on the panorama to display area details.',
				infoNotice: 'Information content is still a framework awaiting management verification.',
				closeInfo: 'Close information',
				emptyScenes: 'No published scenes yet.',
				emptyScenesHint:
					'Published scenes will appear here. An administrator can manage scenes through the dashboard.'
			},
			controls: {
				loading: 'Loading panorama…',
				error: 'The panorama failed to load. Check your connection and try again.',
				retry: 'Try again',
				zoomIn: 'Zoom in',
				zoomOut: 'Zoom out',
				reset: 'Reset view',
				fullscreen: 'Full screen',
				exitFullscreen: 'Exit full screen',
				gesture: 'Drag · Zoom · 360°'
			},
			tips: [
				{
					title: 'Drag or swipe',
					body: 'Change the viewing direction with a mouse or touch.'
				},
				{
					title: 'Zoom',
					body: 'Use the + and − buttons to enlarge or reduce the view.'
				},
				{
					title: 'Full screen',
					body: 'Open the viewer in full screen for a wider experience.'
				}
			]
		},
		sejarah: {
			eyebrow: 'History',
			title: 'History and context of the grounds.',
			description:
				'This page will present a summary of the history of Pura Batuan Kaler after verification and approval by the management.',
			notice:
				'Historical content has not been published yet. The page framework is prepared so that the information shown later has accountable sources.'
		},
		area: {
			eyebrow: 'Areas',
			title: 'Getting to know the temple grounds.',
			description:
				'Each area has a different function and set of visiting rules. The list below is a content framework to be completed after management verification.',
			notice:
				'Area names, descriptions, and boundaries are awaiting validation. Do not use this page as an official guide until the final content is published.'
		},
		galeri: {
			eyebrow: 'Gallery',
			title: 'Visual documentation of the grounds.',
			description:
				'The gallery will present photographs and media of the grounds once documentation permission and content review are complete.',
			notice:
				'No final media has been published yet. The elements on this page are placeholders for the gallery layout.'
		},
		panduan: {
			eyebrow: 'Visit guide',
			title: 'Information before your visit.',
			description:
				'The visit guide will contain practical information about etiquette, dress, access, and the rules of the temple management.',
			notice:
				'Information at this stage is general. Official requirements will be added after confirmation by the management.'
		}
	}
};

export const dictionary: Record<Locale, SiteDictionary> = { id, en };
