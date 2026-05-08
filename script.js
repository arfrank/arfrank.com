(function () {
	var gps = {
		'canyonlands': { desc: 'Canyonlands National Park', link: 'https://www.google.com/maps/place/Canyonlands+National+Park/@38.378,-109.855,12z' },
		'french_atlantic': { desc: 'Argenton, France', link: 'https://www.google.com/maps/place/Argenton,+France/@48.5171,-4.7692,15z' },
		'quandary2': { desc: 'Quandary Peak', link: 'https://www.google.com/maps/place/Quandary+Peak/@39.397,-106.106,13z' },
		'quandary': { desc: 'Quandary Peak', link: 'https://www.google.com/maps/place/Quandary+Peak/@39.397,-106.106,13z' },
		'jtree': { desc: 'Joshua Tree National Park', link: 'https://www.google.com/maps/place/Joshua+Tree+National+Park/@34.04,-116.19,11z' },
		'hoodoo': { desc: 'Bryce Canyon National Park', link: 'https://www.google.com/maps/place/Bryce+Canyon+National+Park/@37.595,-112.158,12z' },
		'hearst': { desc: 'Hearst Castle', link: 'https://www.google.com/maps/place/Hearst+Castle/@35.685,-121.168,15z' },
		'zion': { desc: 'Zion National Park', link: 'https://www.google.com/maps/place/Zion+National+Park/@37.288,-112.948,12z' },
		'mesa': { desc: 'Monument Valley', link: 'https://www.google.com/maps/place/Monument+Valley/@36.983,-110.119,12z' },
		'grand_canyon': { desc: 'Grand Canyon National Park', link: 'https://www.google.com/maps/place/Grand+Canyon+National+Park/@36.106,-112.113,11z' },
		'castle_hill': { desc: 'Castle Hill, NZ', link: 'https://www.google.com/maps/place/Castle+Hill,+New+Zealand/@-43.217,171.717,15z' },
		'halfdome': { desc: 'Half Dome, Yosemite National Park', link: 'https://www.google.com/maps/place/Half+Dome/@37.733,-119.534,13z' },
		'whitney': { desc: 'Mt. Whitney, Sequoia National Park', link: 'https://www.google.com/maps/place/Mount+Whitney/@36.578,-118.292,13z' },
		'whitney2': { desc: 'Mt. Whitney, Sequoia National Park', link: 'https://www.google.com/maps/place/Mount+Whitney/@36.578,-118.292,13z' },
		'lower_antelope': { desc: 'Lower Antelope Canyon', link: 'https://www.google.com/maps/place/Lower+Antelope+Canyon/@36.899,-111.415,15z' },
		'iceland_church': { desc: 'Hallgrímskirkja, Reykjavík, Iceland', link: 'https://www.google.com/maps/place/Hallgrímskirkja/@64.142,-21.927,17z' },
		'reykjavik_musichall': { desc: 'Harpa Concert Hall, Reykjavík, Iceland', link: 'https://www.google.com/maps/place/Harpa/@64.150,-21.934,17z' }
	};

	var bg = [
		'canyonlands', 'french_atlantic', 'quandary', 'quandary2', 'jtree', 'hoodoo',
		'hearst', 'zion', 'mesa', 'grand_canyon', 'castle_hill', 'halfdome',
		'whitney', 'whitney2', 'lower_antelope', 'iceland_church', 'reykjavik_musichall'
	];

	var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	var layers = [document.getElementById('bg-a'), document.getElementById('bg-b')];
	var activeLayer = 0;
	var currentIndex = -1;
	var infoEl = document.getElementById('info');
	var infoText = document.getElementById('info_text');

	function randomIndex() {
		var n = Math.floor(Math.random() * bg.length);
		while (n === currentIndex && bg.length > 1) {
			n = Math.floor(Math.random() * bg.length);
		}
		return n;
	}

	function preload(name) {
		var img = new Image();
		img.src = name + '.jpg';
		return img;
	}

	function changeBG(forced) {
		var nextIndex;
		if (typeof forced === 'number' && forced >= 0 && forced < bg.length) {
			nextIndex = forced;
		} else {
			nextIndex = randomIndex();
		}

		var name = bg[nextIndex];
		var img = preload(name);

		var apply = function () {
			var nextLayer = layers[1 - activeLayer];
			var prevLayer = layers[activeLayer];
			nextLayer.style.backgroundImage = 'url(' + name + '.jpg)';
			nextLayer.classList.add('is-visible');
			prevLayer.classList.remove('is-visible');
			activeLayer = 1 - activeLayer;
			currentIndex = nextIndex;

			var info = gps[name];
			if (info) {
				infoText.textContent = info.desc;
				if (info.link) {
					infoText.setAttribute('href', info.link);
				} else {
					infoText.removeAttribute('href');
				}
			}

			if (!prefersReducedMotion) {
				infoEl.className = '';
				// Re-trigger pulse on the next frame so the class change takes effect.
				requestAnimationFrame(function () {
					setTimeout(function () { infoEl.className = 'animated pulse'; }, 600);
				});
			}

			// Warm the next image so the following swap is instant.
			preload(bg[(nextIndex + 1) % bg.length]);
		};

		if (img.complete) {
			apply();
		} else {
			img.onload = apply;
			img.onerror = apply;
		}
	}

	function getParam(name) {
		var match = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
		return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : undefined;
	}

	function init() {
		var yearEl = document.getElementById('year');
		if (yearEl) yearEl.textContent = new Date().getFullYear();

		var btn = document.getElementById('change_bg');
		if (btn) {
			btn.addEventListener('click', function () { changeBG(); });
		}

		var initial = parseInt(getParam('bg'), 10);
		changeBG(isNaN(initial) ? undefined : initial);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
