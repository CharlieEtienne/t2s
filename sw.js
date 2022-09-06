if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(serviceWorker => {
			console.log("Service Worker registered: ", serviceWorker);
		})
		.catch(error => {
			console.error("Error registering the Service Worker: ", error);
		});
}

const CACHE_NAME = 't2s-cache';
const urlsToCache = [
	'/',
	'sw.js',
	'manifest.json',
	'ani_equalizer_white.gif',
	'icon-192.png',
	'icon-512.png',
	'favicon.ico',
	'favicon.png',
	'/assets/css/lity.min.css',
	'/assets/css/quill.snow.css',
	'/assets/css/richVoiceEditor.css',
	'/assets/css/material-palenight.css',
	'/assets/css/one-light.css',
	'/assets/css/style.css',
	'/assets/js/highlight.min.js',
    '/assets/js/lity.min.js',
    '/assets/js/quill.js',
    '/assets/js/richVoiceEditor_options.js',
    '/assets/js/richVoiceEditor.js',
    '/assets/js/toastr_options.js',
    '/assets/js/cookies.js',
    '/assets/js/helpers.js',
    '/assets/js/main.js',
	'/assets/icons/emphasis.svg',
	'/assets/icons/pitch-high.svg',
	'/assets/icons/pitch-low.svg',
	'/assets/icons/pitch-x-high.svg',
	'/assets/icons/pitch-x-low.svg',
	'/assets/icons/rate-fast.svg',
	'/assets/icons/rate-slow.svg',
	'/assets/icons/rate-x-fast.svg',
	'/assets/icons/rate-x-slow.svg',
	'/assets/icons/spellout.svg',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
	'https://fonts.googleapis.com/css?family=Nunito&display=swap',
	'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css',
	'https://unpkg.com/swiper/swiper-bundle.min.css',
	'https://code.jquery.com/jquery-3.4.1.min.js',
	'https://kit.fontawesome.com/fbb35493dc.js',
	'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js',
	'https://unpkg.com/swiper/swiper-bundle.min.js',
];
console.log('loading sw');

self.addEventListener('install', function(event) {
	// Perform install steps
	console.log('installing sw');
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('Opened cache');
				let x = cache.addAll(urlsToCache);
				console.log('cache added');
				return x;
			})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
					// Cache hit - return response
					if (response) {
						return response;
					}
					return fetch(event.request);
				}
			)
	);
});