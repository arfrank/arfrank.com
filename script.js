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

	var bgStack = document.querySelector('.bg-stack');
	var layers = [document.getElementById('bg-a'), document.getElementById('bg-b')];
	var activeLayer = 0;
	var currentIndex = -1;
	var currentCoords = null;
	var infoText = document.getElementById('info_text');
	var infoCoords = document.getElementById('info_coords');
	var bgCountEl = document.getElementById('bg-count');
	var reloadBtn = document.getElementById('change_bg');
	var toast = document.getElementById('toast');

	function pad2(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

	function preload(name) {
		var img = new Image();
		img.src = name + '.jpg';
		return img;
	}

	function parseCoords(link) {
		if (!link) return null;
		var m = /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(link);
		if (!m) return null;
		return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
	}

	function formatCoords(c) {
		if (!c) return '';
		var latDir = c.lat >= 0 ? 'N' : 'S';
		var lngDir = c.lng >= 0 ? 'E' : 'W';
		return Math.abs(c.lat).toFixed(3) + '° ' + latDir + '   ' + Math.abs(c.lng).toFixed(3) + '° ' + lngDir;
	}

	// === Coordinate count-up animation ====================================
	function animateCoords(prev, next) {
		if (!next) return;
		if (prefersReducedMotion || !prev) {
			infoCoords.textContent = formatCoords(next);
			currentCoords = next;
			return;
		}
		var start = performance.now();
		var dur = 520;
		function step(t) {
			var p = Math.min(1, (t - start) / dur);
			var eased = 1 - Math.pow(1 - p, 3);
			var lat = prev.lat + (next.lat - prev.lat) * eased;
			var lng = prev.lng + (next.lng - prev.lng) * eased;
			infoCoords.textContent = formatCoords({ lat: lat, lng: lng });
			if (p < 1) requestAnimationFrame(step);
			else currentCoords = next;
		}
		requestAnimationFrame(step);
	}

	// === Update photo counter ============================================
	function setCount(idx) {
		if (!bgCountEl) return;
		var nextLabel = pad2(idx + 1) + ' / ' + pad2(bg.length);
		if (bgCountEl.textContent === nextLabel) return;
		if (prefersReducedMotion) { bgCountEl.textContent = nextLabel; return; }
		bgCountEl.classList.add('is-changing');
		setTimeout(function () {
			bgCountEl.textContent = nextLabel;
			bgCountEl.classList.remove('is-changing');
		}, 200);
	}

	// === Toast ============================================================
	var toastTimer = null;
	function showToast(msg) {
		if (!toast) return;
		toast.textContent = msg;
		toast.classList.add('is-visible');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 1800);
	}

	// === Change background ================================================
	function changeBG(forced) {
		var nextIndex;
		if (typeof forced === 'number' && forced >= 0 && forced < bg.length) {
			nextIndex = forced;
		} else {
			nextIndex = Math.floor(Math.random() * bg.length);
			while (nextIndex === currentIndex && bg.length > 1) {
				nextIndex = Math.floor(Math.random() * bg.length);
			}
		}

		var name = bg[nextIndex];
		var img = preload(name);

		var apply = function () {
			var nextLayer = layers[1 - activeLayer];
			var prevLayer = layers[activeLayer];
			nextLayer.style.backgroundImage = 'url(' + name + '.jpg)';

			nextLayer.classList.remove('is-visible');
			void nextLayer.offsetWidth;
			nextLayer.classList.add('is-visible');
			prevLayer.classList.remove('is-visible');

			activeLayer = 1 - activeLayer;
			var prevCoords = currentCoords;
			currentIndex = nextIndex;
			setCount(currentIndex);

			var info = gps[name];
			if (info) {
				infoText.textContent = info.desc;
				if (info.link) infoText.setAttribute('href', info.link);
				else infoText.removeAttribute('href');
				animateCoords(prevCoords, parseCoords(info.link));
			}

			preload(bg[(nextIndex + 1) % bg.length]);
		};

		if (img.complete) apply();
		else { img.onload = apply; img.onerror = apply; }
	}

	function nextBG() { changeBG((currentIndex + 1) % bg.length); }
	function prevBG() { changeBG((currentIndex - 1 + bg.length) % bg.length); }

	function getParam(name) {
		var match = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
		return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : undefined;
	}

	// === Cursor parallax on background ====================================
	function bindParallax() {
		if (prefersReducedMotion || !bgStack) return;
		var raf = false;
		var pendingX = 0, pendingY = 0;
		document.addEventListener('mousemove', function (e) {
			pendingX = (e.clientX / window.innerWidth - 0.5) * -10;  // -5..5
			pendingY = (e.clientY / window.innerHeight - 0.5) * -10;
			if (!raf) {
				requestAnimationFrame(function () {
					raf = false;
					bgStack.style.setProperty('--mx', pendingX.toFixed(1) + 'px');
					bgStack.style.setProperty('--my', pendingY.toFixed(1) + 'px');
				});
				raf = true;
			}
		}, { passive: true });
	}

	// === Click background → next photo ====================================
	function bindBgClick() {
		document.addEventListener('click', function (e) {
			if (e.target.closest('a, button, .caption, [data-no-bg-click]')) return;
			nextBG();
		});
	}

	// === Keyboard navigation ==============================================
	function bindKeyboard() {
		document.addEventListener('keydown', function (e) {
			var tag = e.target && e.target.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (e.key === 'ArrowRight' || e.key === ' ') {
				e.preventDefault();
				nextBG();
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevBG();
			}
		});
	}

	// === Reload button: 360° spin =========================================
	function bindReload() {
		if (!reloadBtn) return;
		reloadBtn.addEventListener('click', function (e) {
			e.stopPropagation(); // don't double-trigger via the bg-click handler
			if (!prefersReducedMotion) {
				reloadBtn.classList.remove('is-spinning');
				void reloadBtn.offsetWidth;
				reloadBtn.classList.add('is-spinning');
			}
			nextBG();
		});
	}

	// === Click coordinates → copy permalink ===============================
	function bindCoordsCopy() {
		if (!infoCoords) return;
		infoCoords.setAttribute('role', 'button');
		infoCoords.setAttribute('tabindex', '0');
		infoCoords.setAttribute('title', 'Copy permalink');
		var copy = function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			if (currentIndex < 0) return;
			var url = location.origin + location.pathname + '?bg=' + currentIndex;
			var done = function () { showToast('Permalink copied'); };
			var fail = function () { showToast('Copy failed'); };
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(url).then(done, fail);
			} else {
				try {
					var el = document.createElement('input');
					el.value = url; document.body.appendChild(el); el.select();
					document.execCommand('copy');
					document.body.removeChild(el);
					done();
				} catch (err) { fail(); }
			}
		};
		infoCoords.addEventListener('click', copy);
		infoCoords.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') copy(e);
		});
	}

	function init() {
		var yearEl = document.getElementById('year');
		if (yearEl) yearEl.textContent = new Date().getFullYear();

		// Initial counter render (so it doesn't pop in empty)
		if (bgCountEl) bgCountEl.textContent = '00 / ' + pad2(bg.length);

		bindReload();
		bindBgClick();
		bindKeyboard();
		bindCoordsCopy();
		bindParallax();

		var initial = parseInt(getParam('bg'), 10);
		changeBG(isNaN(initial) ? undefined : initial);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
