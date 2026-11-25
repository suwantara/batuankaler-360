import type { Locale } from './locales';

const id = {
	meta: {
		title: 'Pura Batuan Kaler 360 | Virtual Tour Kawasan Pura',
		description:
			'Berjalan menyusuri kawasan Pura Batuan Kaler lewat panorama 360° yang diambil langsung di lokasi, dilengkapi informasi area dan panduan berkunjung.'
	},
	common: {
		skipToContent: 'Lewati ke konten',
		menu: 'Menu',
		closeMenu: 'Tutup menu',
		language: 'Ganti bahasa',
		navigation: 'Navigasi utama',
		footerNavigation: 'Navigasi footer'
	},
	errorPage: {
		eyebrow: 'Kesalahan',
		notFoundTitle: 'Halaman tidak ditemukan.',
		notFoundBody:
			'Alamat ini tidak tersedia atau kontennya sudah dipindahkan. Periksa kembali tautan, atau lanjutkan dari beranda.',
		unauthorizedTitle: 'Akses diperlukan.',
		unauthorizedBody: 'Sesi Anda tidak valid atau sudah berakhir. Masuk kembali untuk melanjutkan.',
		forbiddenTitle: 'Akses tidak diizinkan.',
		forbiddenBody: 'Akun Anda tidak memiliki izin untuk membuka halaman ini.',
		serverTitle: 'Terjadi kendala pada server.',
		serverBody:
			'Halaman gagal dimuat. Coba muat ulang beberapa saat lagi. Jika masalah berlanjut, hubungi pengelola.',
		genericTitle: 'Halaman tidak dapat dibuka.',
		genericBody:
			'Terjadi kendala saat membuka halaman ini. Coba kembali ke beranda atau muat ulang halaman.',
		backHome: 'Kembali ke beranda',
		openTour: 'Buka virtual tour',
		retry: 'Muat ulang halaman',
		dashboard: 'Ke dashboard admin',
		publicSite: 'Buka situs publik',
		login: 'Masuk admin',
		help: 'Jika tautan ini seharusnya tersedia, hubungi pengelola kawasan.',
		adminHelp: 'Jika masalah berlanjut, periksa log server atau hubungi pengembang.',
		standaloneFooter: 'Pura Batuan Kaler 360 · Virtual tour kawasan pura'
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
		learnHistory: 'Pelajari sejarahnya',
		viewAllAreas: 'Lihat semua area',
		openGallery: 'Lihat galeri foto',
		readGuide: 'Baca panduan kunjungan',
		readHistory: 'Baca sejarahnya'
	},
	visitInfo: {
		eyebrow: 'Informasi kunjungan',
		title: 'Sebelum Anda datang.',
		description:
			'Informasi praktis dari pengelola kawasan untuk membantu kunjungan yang tertib, hormat, dan terencana.',
		empty: 'Informasi kunjungan sedang disiapkan oleh pengelola.',
		updated: 'Terakhir diperbarui',
		openMap: 'Buka peta',
		managerSite: 'Situs pengelola',
		guideLink: 'Baca panduan kunjungan',
		fallback:
			'Terjemahan Inggris belum lengkap. Sebagian informasi ditampilkan dalam Bahasa Indonesia.',
		labels: {
			location: 'Lokasi',
			hours: 'Jam kunjungan',
			access: 'Akses',
			dressCode: 'Pakaian',
			photoPolicy: 'Ketentuan foto',
			etiquette: 'Etika kunjungan',
			contact: 'Kontak',
			manager: 'Pengelola'
		}
	},
	locationMap: {
		eyebrow: 'Lokasi',
		title: 'Temukan kawasan pura.',
		description:
			'Kawasan pura berada di Dusun Canggi, Desa Batuan Kaler. Gunakan peta untuk merencanakan perjalanan dan mengenali jalur menuju lokasi.',
		addressLabel: 'Alamat',
		address:
			'Pura Puseh Ganggangan Canggi, Dusun Canggi, Desa Batuan Kaler, Kecamatan Sukawati, Kabupaten Gianyar, Bali 80582',
		mapTitle: 'Peta lokasi Pura Batuan Kaler',
		openMap: 'Buka di Google Maps',
		directions: 'Petunjuk arah',
		note: 'Peta menampilkan titik kawasan pura. Gunakan tombol petunjuk arah untuk navigasi dari lokasi Anda.'
	},
	footer: {
		description:
			'Dokumentasi digital kawasan Pura Batuan Kaler dalam bentuk virtual tour 360 derajat. Disusun untuk mendukung orientasi pengunjung dengan tetap menghormati nilai dan aturan tempat.',
		explore: 'Tautan',
		visit: 'Kunjungan',
		note: 'Konten sedang melalui proses validasi pengelola.',
		rights: 'Pura Batuan Kaler 360.',
		cta: {
			eyebrow: 'Virtual tour',
			title: 'Masuk ke kawasan, satu panorama demi satu.',
			body: 'Lanjutkan ke area berikutnya lewat hotspot dan daftar scene.'
		}
	},
	home: {
		hero: {
			eyebrow: 'Dokumentasi digital kawasan pura',
			title: 'Pura Batuan Kaler, dalam pandangan 360°.',
			titleLead: 'Pura Batuan Kaler,',
			titleAccent: 'dalam pandangan 360°.',
			description:
				'Putar panorama untuk melihat kawasan pura seperti berdiri di tempat. Foto diambil langsung di lokasi, dari Jaba Pura hingga Utama Mandala, supaya yang Anda lihat sesuai kenyataan.',
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
			title: 'Kenali pura sebelum melangkah masuk.',
			body: 'Kawasan pura dipotret menjadi {count} panorama 360°, dari Jaba Pura hingga Utama Mandala, lengkap dengan foto detail. Keterangan tiap area disusun bersama pengelola dan tampil setelah disetujui.',
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
			title: 'Menyusuri kawasan, scene demi scene.',
			body: 'Mulai dari Jaba Pura, gunakan ikon hotspot untuk berpindah ke area berikutnya, dan buka keterangan area di sepanjang jalur.',
			previewLabel: 'Pratinjau panorama 360°'
		},
		history: {
			eyebrow: 'Sejarah',
			title: 'Konteks yang melandasi kawasan.',
			body: 'Ringkasan sejarah disusun dari sumber tertulis kawasan pura, lalu tampil setelah disetujui pengelola.',
			noteLabel: 'Catatan kurasi',
			status: 'Dalam proses verifikasi'
		},
		areas: {
			eyebrow: 'Area',
			title: 'Dari Jaba Pura hingga Utama Mandala.',
			body: 'Tiap area punya fungsi dan aturan kunjungan yang berbeda. Keterangan di bawah ini disusun sebagai kerangka dan menunggu peninjauan pengelola.',
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
			body: 'Foto close-up detail pura dan panorama pilihan akan tampil setelah konten disetujui pengelola.',
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
				'Geser untuk melihat sekeliling, ketuk ikon hotspot untuk berpindah area atau membuka keterangan, dan buka layar penuh bila ingin lebih leluasa.',
			notice:
				'Scene dan hotspot dikelola pengelola. Keterangan area menyusul setelah diverifikasi.',
			panel: {
				sceneList: 'Daftar scene',
				sceneListHint: 'Pilih scene untuk berpindah panorama.',
				activeScene: 'Scene aktif',
				sceneMap: 'Peta alur',
				sceneMapHint:
					'Titik menunjukkan scene. Garis menunjukkan hubungan hotspot navigasi. Pilih titik untuk berpindah.',
				sceneMapLabel: 'Peta alur scene',
				info: 'Informasi hotspot',
				infoEmpty: 'Pilih hotspot informasi pada panorama untuk menampilkan keterangan area.',
				infoNotice: 'Konten informasi masih dalam kerangka dan menunggu verifikasi pengelola.',
				closeInfo: 'Tutup informasi',
				emptyScenes: 'Belum ada scene yang dipublikasikan.',
				emptyScenesHint: 'Scene yang sudah dipublikasikan akan tampil di sini.',
				legendInfo: 'Hotspot informasi',
				legendNavigate: 'Hotspot pindah area',
				legendDrag: 'Geser panorama untuk melihat'
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
				gesture: 'Geser · Zoom · 360°',
				pickHint: 'Klik titik pada panorama untuk mengambil yaw/pitch',
				hintTitle: 'Cara menjelajah',
				hintDrag: 'Geser atau sentuh panorama untuk melihat sekeliling.',
				hintDismiss: 'Tutup petunjuk',
				keyboardHint: 'Gunakan tombol panah untuk melihat, dan + / − untuk zoom.',
				keyboardLabel:
					'Panorama 360 derajat. Gunakan tombol panah untuk melihat sekeliling dan tombol plus atau minus untuk zoom.'
			},
			glossary: {
				title: 'Istilah kawasan',
				hint: 'Kenali nama area sebelum mulai menjelajah.',
				note: 'Deskripsi area masih dalam proses verifikasi pengelola.'
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
				'Ringkasan sejarah disusun dari sumber tertulis tentang Pura Puseh Ganggangan Canggi, lalu tampil setelah disetujui pengelola.',
			notice:
				'Konten sejarah belum tayang. Kerangka halaman disiapkan agar informasi yang tampil memiliki sumber yang jelas.',
			toc: 'Dalam halaman ini',
			updated: 'Terakhir diperbarui',
			source: 'Sumber',
			empty: 'Artikel sejarah sedang disiapkan oleh pengelola.',
			fallback:
				'Terjemahan Inggris belum lengkap. Sebagian artikel ditampilkan dalam Bahasa Indonesia.'
		},
		area: {
			eyebrow: 'Area',
			title: 'Tiga bagian, satu alur kunjungan.',
			description:
				'Kawasan pura terbagi menjadi Jaba Pura, Madya Mandala, dan Utama Mandala. Tiap bagian punya fungsi dan aturan sendiri. Keterangan menyusul setelah peninjauan pengelola.',
			notice:
				'Konten halaman ini masih dalam peninjauan pengelola dan belum menjadi panduan resmi.',
			updated: 'Terakhir diperbarui',
			empty: 'Daftar area sedang disiapkan oleh pengelola.',
			fallback:
				'Terjemahan Inggris belum lengkap. Sebagian daftar ditampilkan dalam Bahasa Indonesia.',
			detailScenesTitle: 'Scene di area ini',
			detailScenesDescription: 'Pilih scene untuk membuka panorama 360 derajat pada area ini.',
			detailEmpty: 'Belum ada scene yang dipublikasikan untuk area ini.',
			backToAreas: 'Kembali ke daftar area'
		},
		galeri: {
			eyebrow: 'Galeri',
			title: 'Dokumentasi visual kawasan.',
			description:
				'Foto close-up detail pura dan panorama pilihan akan tampil di sini setelah konten disetujui pengelola.',
			notice: 'Belum ada media yang dipublikasikan.',
			updated: 'Terakhir diperbarui',
			empty: 'Galeri sedang disiapkan oleh pengelola.',
			fallback:
				'Terjemahan Inggris belum lengkap. Sebagian keterangan ditampilkan dalam Bahasa Indonesia.'
		},
		panduan: {
			eyebrow: 'Panduan kunjungan',
			title: 'Informasi sebelum berkunjung.',
			description:
				'Etika berkunjung, pakaian, dan akses mengikuti ketentuan resmi pengelola pura. Panduan diperbarui setelah dikonfirmasi.',
			guideEyebrow: 'Panduan umum',
			guideTitle: 'Prinsip yang perlu dijaga.',
			notice:
				'Informasi pada tahap ini bersifat umum. Ketentuan resmi akan ditambahkan setelah dikonfirmasi oleh pengelola.',
			toc: 'Dalam halaman ini',
			updated: 'Terakhir diperbarui',
			source: 'Sumber',
			empty: 'Artikel panduan sedang disiapkan oleh pengelola.',
			fallback:
				'Terjemahan Inggris belum lengkap. Sebagian artikel ditampilkan dalam Bahasa Indonesia.'
		}
	}
};

export type SiteDictionary = typeof id;

const en: SiteDictionary = {
	meta: {
		title: 'Pura Batuan Kaler 360 | Virtual Tour of the Temple Grounds',
		description:
			'Walk through the Pura Batuan Kaler grounds via 360° panoramas shot on site, with area notes and a visit guide.'
	},
	common: {
		skipToContent: 'Skip to content',
		menu: 'Menu',
		closeMenu: 'Close menu',
		language: 'Change language',
		navigation: 'Main navigation',
		footerNavigation: 'Footer navigation'
	},
	errorPage: {
		eyebrow: 'Error',
		notFoundTitle: 'Page not found.',
		notFoundBody:
			'This address is unavailable or the content has moved. Check the link again, or continue from the home page.',
		unauthorizedTitle: 'Access required.',
		unauthorizedBody: 'Your session is invalid or has ended. Sign in again to continue.',
		forbiddenTitle: 'Access not allowed.',
		forbiddenBody: 'Your account does not have permission to open this page.',
		serverTitle: 'The server ran into a problem.',
		serverBody:
			'The page failed to load. Try reloading in a moment. If the problem continues, contact the site manager.',
		genericTitle: 'The page could not be opened.',
		genericBody:
			'Something went wrong while opening this page. Try returning to the home page or reloading.',
		backHome: 'Back to home',
		openTour: 'Open virtual tour',
		retry: 'Reload page',
		dashboard: 'Go to admin dashboard',
		publicSite: 'Open public site',
		login: 'Admin sign in',
		help: 'If this link should be available, contact the site manager.',
		adminHelp: 'If the problem continues, check the server logs or contact the developer.',
		standaloneFooter: 'Pura Batuan Kaler 360 · Virtual tour of the temple grounds'
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
		exploreTour: 'Enter the 360° tour',
		learnHistory: 'Read its history',
		viewAllAreas: 'See all areas',
		openGallery: 'See the photo gallery',
		readGuide: 'Read the visit guide',
		readHistory: 'Read the history'
	},
	visitInfo: {
		eyebrow: 'Visit information',
		title: 'Before you arrive.',
		description:
			'Practical information from the site management to help make your visit respectful, orderly, and well planned.',
		empty: 'Visit information is being prepared by the management.',
		updated: 'Last updated',
		openMap: 'Open map',
		managerSite: 'Management website',
		guideLink: 'Read the visit guide',
		fallback: 'The English translation is incomplete. Some information is shown in Indonesian.',
		labels: {
			location: 'Location',
			hours: 'Visiting hours',
			access: 'Access',
			dressCode: 'Dress code',
			photoPolicy: 'Photography policy',
			etiquette: 'Visit etiquette',
			contact: 'Contact',
			manager: 'Managed by'
		}
	},
	locationMap: {
		eyebrow: 'Location',
		title: 'Find the temple grounds.',
		description:
			'The temple grounds are located in Dusun Canggi, Batuan Kaler Village. Use the map to plan your journey and recognise the route to the site.',
		addressLabel: 'Address',
		address:
			'Pura Puseh Ganggangan Canggi, Dusun Canggi, Batuan Kaler Village, Sukawati District, Gianyar Regency, Bali 80582',
		mapTitle: 'Location map of Pura Batuan Kaler',
		openMap: 'Open in Google Maps',
		directions: 'Get directions',
		note: 'The map shows the point of the temple grounds. Use the directions button for navigation from your location.'
	},
	footer: {
		description:
			'Digital documentation of Pura Batuan Kaler through a 360-degree virtual tour. Designed to help visitors orient themselves while respecting the values and rules of the place.',
		explore: 'Links',
		visit: 'Visit',
		note: 'Content is currently undergoing review by the temple management.',
		rights: 'Pura Batuan Kaler 360.',
		cta: {
			eyebrow: 'Virtual tour',
			title: 'Enter the grounds, one panorama at a time.',
			body: 'Continue to the next areas with hotspots and the scene list.'
		}
	},
	home: {
		hero: {
			eyebrow: 'Digital documentation of the temple grounds',
			title: 'Pura Batuan Kaler, in a 360° view.',
			titleLead: 'Pura Batuan Kaler,',
			titleAccent: 'in a 360° view.',
			description:
				'Turn the panorama to see the grounds as if you were standing there. Every shot was taken on site, from Jaba Pura to Utama Mandala, so what you see matches the place.',
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
			title: 'Know the temple before you step in.',
			body: 'The grounds were photographed into {count} 360° panoramas, from Jaba Pura to Utama Mandala, along with detail photos. Area notes are prepared with the caretakers and appear once approved.',
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
			title: 'Walk the grounds, scene by scene.',
			body: 'Start at Jaba Pura, use the hotspot icons to move to the next area, and open area notes along the route.',
			previewLabel: '360° panorama preview'
		},
		history: {
			eyebrow: 'History',
			title: 'The context that shapes the grounds.',
			body: 'A written history of the grounds is being prepared and will appear once approved by the caretakers.',
			noteLabel: 'Curatorial note',
			status: 'Under verification'
		},
		areas: {
			eyebrow: 'Areas',
			title: 'From Jaba Pura to Utama Mandala.',
			body: 'Each area has its own function and visit rules. The notes below are a framework awaiting review by the caretakers.',
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
			body: 'Close-up photos of temple details and selected panoramas will appear once the content is approved.',
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
				'Drag to look around, tap a hotspot to move between areas or open notes, and use fullscreen when you want more room.',
			notice: 'Scenes and hotspots are managed by the caretakers. Area notes follow once verified.',
			panel: {
				sceneList: 'Scene list',
				sceneListHint: 'Choose a scene to move to another panorama.',
				activeScene: 'Active scene',
				sceneMap: 'Scene map',
				sceneMapHint:
					'Dots represent scenes. Lines represent navigation hotspots. Choose a dot to move between scenes.',
				sceneMapLabel: 'Scene map',
				info: 'Hotspot information',
				infoEmpty: 'Choose an information hotspot on the panorama to display area details.',
				infoNotice: 'Information content is still a framework awaiting management verification.',
				closeInfo: 'Close information',
				emptyScenes: 'No published scenes yet.',
				emptyScenesHint: 'Published scenes will appear here.',
				legendInfo: 'Information hotspot',
				legendNavigate: 'Area navigation hotspot',
				legendDrag: 'Drag the panorama to look around'
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
				gesture: 'Drag · Zoom · 360°',
				pickHint: 'Click a point on the panorama to capture yaw/pitch',
				hintTitle: 'How to explore',
				hintDrag: 'Drag or touch the panorama to look around.',
				hintDismiss: 'Dismiss hint',
				keyboardHint: 'Use the arrow keys to look around, and + / − to zoom.',
				keyboardLabel:
					'360-degree panorama. Use the arrow keys to look around and the plus or minus buttons to zoom.'
			},
			glossary: {
				title: 'Site terms',
				hint: 'Learn the area names before you start exploring.',
				note: 'Area descriptions are still undergoing management verification.'
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
				'A written history of Pura Puseh Ganggangan Canggi is being prepared and will appear once approved by the caretakers.',
			notice:
				'The history content is not published yet. The page framework is prepared so that everything shown has a clear source.',
			toc: 'On this page',
			updated: 'Last updated',
			source: 'Source',
			empty: 'The history article is being prepared by the management.',
			fallback: 'The English translation is incomplete. Part of the article is shown in Indonesian.'
		},
		area: {
			eyebrow: 'Areas',
			title: 'Three sections, one visit route.',
			description:
				'The grounds are divided into Jaba Pura, Madya Mandala, and Utama Mandala. Each has its own function and rules. Notes follow once reviewed by the caretakers.',
			notice: 'This page is still under review by the caretakers and is not yet an official guide.',
			updated: 'Last updated',
			empty: 'The area list is being prepared by the management.',
			fallback: 'The English translation is incomplete. Part of the list is shown in Indonesian.',
			detailScenesTitle: 'Scenes in this area',
			detailScenesDescription: 'Choose a scene to open the 360-degree panorama for this area.',
			detailEmpty: 'No published scenes are available for this area yet.',
			backToAreas: 'Back to the area list'
		},
		galeri: {
			eyebrow: 'Gallery',
			title: 'Visual documentation of the grounds.',
			description:
				'Close-up photos of the temple and selected panoramas will appear here once the content is approved.',
			notice: 'No media has been published yet.',
			updated: 'Last updated',
			empty: 'The gallery is being prepared by the management.',
			fallback: 'The English translation is incomplete. Some captions are shown in Indonesian.'
		},
		panduan: {
			eyebrow: 'Visit guide',
			title: 'Information before your visit.',
			description:
				'Visit etiquette, dress, and access follow the official rules of the temple caretakers. This guide is updated once confirmed.',
			guideEyebrow: 'General guidance',
			guideTitle: 'Principles to keep in mind.',
			notice:
				'Information at this stage is general. Official requirements will be added after confirmation by the management.',
			toc: 'On this page',
			updated: 'Last updated',
			source: 'Source',
			empty: 'The visit guide article is being prepared by the management.',
			fallback: 'The English translation is incomplete. Part of the article is shown in Indonesian.'
		}
	}
};

export const dictionary: Record<Locale, SiteDictionary> = { id, en };
