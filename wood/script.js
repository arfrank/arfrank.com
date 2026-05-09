(function () {
	var pieces = Array.prototype.slice.call(document.querySelectorAll('.piece'));
	var indicator = document.querySelector('.indicator');
	var indicatorNum = document.querySelector('.indicator__num');
	var indicatorTotal = document.querySelector('.indicator__total');
	var indicatorTitle = document.querySelector('.indicator__title');
	var progressBar = document.querySelector('.scroll-progress span');
	var toTopBtn = document.querySelector('.to-top');
	var toast = document.getElementById('toast');

	var lightbox = document.getElementById('lightbox');
	var lightboxImg = lightbox && lightbox.querySelector('.lightbox__img');
	var lightboxTitle = lightbox && lightbox.querySelector('.lightbox__title');
	var lightboxCount = lightbox && lightbox.querySelector('.lightbox__count');

	var yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	var prefersReducedMotion = window.matchMedia
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;

	if (indicatorTotal) indicatorTotal.textContent = String(pieces.length).padStart(2, '0');

	// === [1] Scroll progress bar ============================================
	function updateProgress() {
		if (!progressBar) return;
		var docH = document.documentElement.scrollHeight - window.innerHeight;
		var pct = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
		progressBar.style.width = (pct * 100).toFixed(2) + '%';
	}

	// === [2] Sticky piece indicator =========================================
	var currentPieceIndex = -1;
	function setIndicator(index) {
		if (index === currentPieceIndex) return;
		currentPieceIndex = index;
		if (!indicator) return;
		var piece = pieces[index];
		if (!piece) return;
		var num = piece.dataset.num;
		var title = piece.querySelector('.piece__title');
		if (indicatorTitle) {
			indicatorTitle.classList.add('is-changing');
			setTimeout(function () {
				indicatorNum.textContent = num;
				indicatorTitle.textContent = title ? title.textContent : '';
				indicatorTitle.classList.remove('is-changing');
			}, prefersReducedMotion ? 0 : 180);
		}
	}

	// === [3] Hover-preview thumbs (preview hero on hover, swap on click) ====
	pieces.forEach(function (piece) {
		var heroWrap = piece.querySelector('.piece__hero');
		var heroBase = heroWrap && heroWrap.querySelector('img');
		var thumbs = piece.querySelectorAll('.spec__details img');
		if (!heroBase) return;

		// Build a stack wrapper so the preview img can layer over the base
		// without affecting layout. Tilt + parallax also live on the stack.
		heroBase.classList.add('hero-base');
		var stack = document.createElement('div');
		stack.className = 'piece__hero-stack';
		heroWrap.insertBefore(stack, heroBase);
		stack.appendChild(heroBase);

		var heroPreview = document.createElement('img');
		heroPreview.className = 'hero-preview';
		heroPreview.setAttribute('aria-hidden', 'true');
		heroPreview.alt = '';
		heroPreview.decoding = 'async';
		stack.appendChild(heroPreview);

		piece._heroStack = stack;
		piece._heroBase = heroBase;
		piece._heroPreview = heroPreview;

		// Track the committed hero src — click commits update this
		var currentHeroSrc = heroBase.getAttribute('src');
		piece._getCurrent = function () { return currentHeroSrc; };

		// Hero click → lightbox
		heroWrap.addEventListener('click', function () {
			openLightbox(piece, heroBase.getAttribute('src'));
		});

		thumbs.forEach(function (thumb) {
			thumb.setAttribute('role', 'button');
			thumb.setAttribute('tabindex', '0');
			thumb.setAttribute('aria-label', 'Preview this photo as the main image; click to swap');

			// Hover preview — fade in an overlay; never touch the base
			thumb.addEventListener('mouseenter', function () {
				if (heroWrap.classList.contains('is-swapping')) return;
				if (thumb.classList.contains('is-current')) return;
				if (thumb.getAttribute('src') === heroBase.getAttribute('src')) return;
				heroPreview.setAttribute('src', thumb.getAttribute('src'));
				heroWrap.classList.add('is-previewing');
			});
			thumb.addEventListener('mouseleave', function () {
				heroWrap.classList.remove('is-previewing');
			});

			// Click commits the swap (crossfade on the base)
			var doSwap = function (e) {
				if (e) e.stopPropagation();
				if (heroWrap.classList.contains('is-swapping')) return;
				if (thumb.classList.contains('is-current')) return;

				// Drop preview state — base will own the swap visually
				heroWrap.classList.remove('is-previewing');

				var heroSrc = currentHeroSrc;
				var thumbSrc = thumb.getAttribute('src');

				heroWrap.classList.add('is-swapping');
				thumbs.forEach(function (t) { t.classList.remove('is-current'); });

				setTimeout(function () {
					heroBase.setAttribute('src', thumbSrc);
					thumb.setAttribute('src', heroSrc);
					thumb.classList.add('is-current', 'just-swapped');
					currentHeroSrc = thumbSrc;
					setTimeout(function () { thumb.classList.remove('just-swapped'); }, 720);
					void heroBase.offsetWidth;
					heroWrap.classList.remove('is-swapping');
				}, prefersReducedMotion ? 0 : 240);
			};

			thumb.addEventListener('click', doSwap);
			thumb.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					doSwap();
				}
			});
		});
	});

	// === [4] Lightbox =======================================================
	var lbState = { piece: null, photos: [], index: 0 };

	function getPiecePhotos(piece) {
		var photos = [];
		var hero = piece.querySelector('.piece__hero img');
		if (hero) photos.push(hero.getAttribute('src'));
		piece.querySelectorAll('.spec__details img').forEach(function (img) {
			photos.push(img.getAttribute('src'));
		});
		return photos;
	}

	function openLightbox(piece, currentSrc) {
		if (!lightbox) return;
		lbState.piece = piece;
		lbState.photos = getPiecePhotos(piece);
		var idx = lbState.photos.indexOf(currentSrc);
		lbState.index = idx >= 0 ? idx : 0;
		renderLightbox();
		lightbox.hidden = false;
		document.body.style.overflow = 'hidden';
	}

	function closeLightbox() {
		if (!lightbox) return;
		lightbox.hidden = true;
		document.body.style.overflow = '';
		lbState.piece = null;
	}

	function cycleLightbox(delta) {
		if (!lightbox || !lbState.piece) return;
		var n = lbState.photos.length;
		lbState.index = (lbState.index + delta + n) % n;
		lightbox.classList.add('is-changing');
		setTimeout(function () {
			renderLightbox();
			lightbox.classList.remove('is-changing');
		}, prefersReducedMotion ? 0 : 180);
	}

	function renderLightbox() {
		if (!lbState.piece) return;
		var title = lbState.piece.querySelector('.piece__title');
		if (lightboxImg) lightboxImg.setAttribute('src', lbState.photos[lbState.index]);
		if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
		if (lightboxCount) lightboxCount.textContent = (lbState.index + 1) + ' / ' + lbState.photos.length;
	}

	if (lightbox) {
		lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
		lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function () { cycleLightbox(-1); });
		lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function () { cycleLightbox(1); });
		lightbox.addEventListener('click', function (e) {
			if (e.target === lightbox) closeLightbox();
		});
	}

	// === [5] Keyboard navigation ============================================
	document.addEventListener('keydown', function (e) {
		// Lightbox keys
		if (lightbox && !lightbox.hidden) {
			if (e.key === 'Escape') { closeLightbox(); return; }
			if (e.key === 'ArrowLeft') { cycleLightbox(-1); return; }
			if (e.key === 'ArrowRight') { cycleLightbox(1); return; }
			return;
		}
		// Page nav: ↑/k = prev, ↓/j = next
		var goNext = (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J');
		var goPrev = (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K');
		if (!goNext && !goPrev) return;
		// Don't hijack arrows in form fields
		var t = e.target;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		e.preventDefault();
		var target = (currentPieceIndex < 0 ? 0 : currentPieceIndex) + (goNext ? 1 : -1);
		target = Math.max(0, Math.min(pieces.length - 1, target));
		var piece = pieces[target];
		if (!piece) return;
		piece.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
	});

	// === [6] Subtle parallax on hero photos ================================
	// === [7] Mouse-tilt 3D on hero =========================================
	if (!prefersReducedMotion) {
		pieces.forEach(function (piece) {
			var heroWrap = piece.querySelector('.piece__hero');
			var stack = piece._heroStack;
			if (!heroWrap || !stack) return;

			heroWrap.addEventListener('mousemove', function (e) {
				var rect = heroWrap.getBoundingClientRect();
				var cx = (e.clientX - rect.left) / rect.width - 0.5;
				var cy = (e.clientY - rect.top) / rect.height - 0.5;
				stack.style.setProperty('--tilt-x', (-cy * 1.6).toFixed(2) + 'deg');
				stack.style.setProperty('--tilt-y', (cx * 2.4).toFixed(2) + 'deg');
			});
			heroWrap.addEventListener('mouseleave', function () {
				stack.style.setProperty('--tilt-x', '0deg');
				stack.style.setProperty('--tilt-y', '0deg');
			});
		});

		// Parallax: shift each hero stack by a few px based on its scroll position
		var parallaxTicking = false;
		function updateParallax() {
			parallaxTicking = false;
			var vh = window.innerHeight;
			pieces.forEach(function (piece) {
				var stack = piece._heroStack;
				if (!stack) return;
				var rect = piece.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > vh) return;
				var center = rect.top + rect.height / 2;
				var rel = (center - vh / 2) / (vh / 2);
				var clamped = Math.max(-1, Math.min(1, rel));
				var offset = (-clamped * 10).toFixed(1);
				stack.style.setProperty('--parallax-y', offset + 'px');
			});
		}
		window.addEventListener('scroll', function () {
			if (!parallaxTicking) {
				window.requestAnimationFrame(updateParallax);
				parallaxTicking = true;
			}
		}, { passive: true });
		updateParallax();
	}

	// === [8] Title underline = pure CSS (already in stylesheet) =============

	// === [9] Back-to-top ====================================================
	if (toTopBtn) {
		toTopBtn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
		});
	}

	function updateChrome() {
		// Indicator visibility (after first piece)
		if (indicator) {
			indicator.classList.toggle('is-visible', window.scrollY > 100);
		}
		// Back-to-top after one viewport
		if (toTopBtn) {
			var show = window.scrollY > window.innerHeight * 0.8;
			toTopBtn.hidden = !show;
		}
	}

	// === [10] Permalink copy on number click ================================
	function showToast(msg) {
		if (!toast) return;
		toast.textContent = msg;
		toast.classList.add('is-visible');
		clearTimeout(toast._t);
		toast._t = setTimeout(function () { toast.classList.remove('is-visible'); }, 1800);
	}

	pieces.forEach(function (piece, idx) {
		var num = piece.querySelector('.piece__num');
		if (!num) return;
		piece.id = 'piece-' + piece.dataset.num;
		num.setAttribute('role', 'button');
		num.setAttribute('tabindex', '0');
		num.setAttribute('aria-label', 'Copy permalink to this piece');

		var copyLink = function (e) {
			if (e) e.preventDefault();
			var url = location.origin + location.pathname + '#' + piece.id;
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(url).then(
					function () { showToast('Permalink copied'); history.replaceState(null, '', '#' + piece.id); },
					function () { showToast('Copy failed'); }
				);
			} else {
				// Fallback
				var el = document.createElement('input');
				el.value = url; document.body.appendChild(el); el.select();
				try { document.execCommand('copy'); showToast('Permalink copied'); }
				catch (err) { showToast('Copy failed'); }
				document.body.removeChild(el);
				history.replaceState(null, '', '#' + piece.id);
			}
		};

		num.addEventListener('click', copyLink);
		num.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') copyLink(e);
		});
	});

	// === Scroll observer + RAF combo for smooth chrome updates ==============
	var ticking = false;
	window.addEventListener('scroll', function () {
		if (!ticking) {
			window.requestAnimationFrame(function () {
				ticking = false;
				updateProgress();
				updateChrome();
			});
			ticking = true;
		}
	}, { passive: true });
	updateProgress();
	updateChrome();

	// === Fade-in + indicator tracking via IntersectionObserver ==============
	if ('IntersectionObserver' in window) {
		var fadeObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) {
					e.target.classList.add('is-visible');
					fadeObserver.unobserve(e.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

		// Track which piece is "current" (closest to viewport center)
		var trackObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) {
					var idx = pieces.indexOf(e.target);
					if (idx >= 0) setIndicator(idx);
				}
			});
		}, { rootMargin: '-30% 0px -50% 0px', threshold: 0 });

		pieces.forEach(function (p) {
			fadeObserver.observe(p);
			trackObserver.observe(p);
		});
	} else {
		pieces.forEach(function (p) { p.classList.add('is-visible'); });
	}

	// On initial load, jump to hash if present
	if (location.hash) {
		var target = document.querySelector(location.hash);
		if (target && target.classList.contains('piece')) {
			setTimeout(function () { target.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 50);
		}
	}
})();
