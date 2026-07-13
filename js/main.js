/* =============================================
   Vertical Tech Garden - Main JavaScript
   ============================================= */

(function() {
    function init() {

    /* --- Set active nav link based on current page --- */
    var pageName = window.location.pathname.split('/').pop() || 'index.html';
    if (pageName === '' || pageName === '/') pageName = 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === pageName) {
            link.classList.add('active');
        }
    });

    /* --- Handle anchor scrolling after full page load --- */
    if (window.location.hash) {
        var savedHash = window.location.hash;
        window.scrollTo(0, 0);
        window.addEventListener('load', function() {
            var target = document.querySelector(savedHash);
            if (target) {
                var navbar = document.querySelector('.navbar');
                var offset = navbar ? navbar.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    /* --- Hero Slider --- */
    const hero = document.getElementById('hero');
    const slides = document.querySelectorAll('.hero-slide');

    if (hero && slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const interval = 5000;

        function goToSlide(index) {
            slides.forEach((s, i) => {
                s.classList.remove('active');
                const bg = s.querySelector('.hero-slide-bg');
                if (bg) {
                    if (i === index) {
                        bg.style.transition = 'transform 7s cubic-bezier(0.4, 0, 0.2, 1)';
                        bg.style.transform = '';
                    } else {
                        bg.style.transition = 'none';
                        bg.style.transform = 'scale(1.2) translateX(-30px)';
                    }
                }
            });
            slides[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        function startAutoPlay() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, interval);
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    }

    /* --- WhatsApp Float Badge --- */
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappBadge = document.getElementById('whatsappBadge');

    if (whatsappFloat && whatsappBadge) {
        setTimeout(() => {
            whatsappBadge.classList.add('show');
        }, 3000);

        whatsappFloat.addEventListener('click', () => {
            whatsappBadge.classList.remove('show');
        });
    }

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 80);
        backToTop.classList.toggle('visible', scrollY > 400);
    });

    /* --- Mobile Nav Toggle --- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    /* --- Active Nav Link Highlighting --- */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && href.charAt(0) === '#') {
                link.classList.remove('active');
                if (href === '#' + current) {
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* --- Stats Counter Animation --- */
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
        statObserver.observe(el);
    });

    /* --- Scroll Reveal Animation --- */
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    }

    /* Add reveal class to elements */
    function setupReveal() {
        const elements = document.querySelectorAll(
            '.problem-card, .benefit-card, .mag-row, .step-card, .faq-item, .testimonial-card, .ci-item, .calc-result-card, .trust-item, .ts-item, .mag-featured-bg'
        );
        elements.forEach(el => el.classList.add('reveal'));

        /* Show contact page elements immediately */
        document.querySelectorAll('.contact-card, .contact-social, .contact-form-box, .contact-map').forEach(el => {
            el.classList.add('visible');
        });
    }
    setupReveal();

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    /* Animate stats already in view (observer handles the rest) */
    document.querySelectorAll('.stat-number').forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateCounter(el);
            /* unobserve so it doesn't double-animate */
            statObserver.unobserve(el);
        }
    });

    /* --- Harvest Calculator --- */
    const hcSpace = document.getElementById('hcSpace');
    if (hcSpace) {
        const hcPeople = document.getElementById('hcPeople');
        const hcCrop = document.getElementById('hcCrop');
        const hcBtn = document.getElementById('hcBtn');
        const hcSpaceVal = document.getElementById('hcSpaceVal');
        const hcPeopleVal = document.getElementById('hcPeopleVal');
        const hcYield = document.getElementById('hcYield');
        const hcPortions = document.getElementById('hcPortions');
        const hcWater = document.getElementById('hcWater');
        const hcSavings = document.getElementById('hcSavings');
        const hcSystem = document.getElementById('hcSystem');
        const hcUnits = document.getElementById('hcUnits');
        const hcSuffFill = document.getElementById('hcSuffFill');
        const hcSuffLabel = document.getElementById('hcSuffLabel');

        const cropData = {
            mixed:   { yieldPerSqFt: 0.45, waterSaved: 320, savingsPerWeek: 800, label: 'Mixed Greens' },
            leafy:   { yieldPerSqFt: 0.55, waterSaved: 280, savingsPerWeek: 600, label: 'Leafy Greens' },
            herbs:   { yieldPerSqFt: 0.30, waterSaved: 240, savingsPerWeek: 500, label: 'Herbs' },
            veggies: { yieldPerSqFt: 0.35, waterSaved: 360, savingsPerWeek: 1200, label: 'Vegetables' },
            fruit:   { yieldPerSqFt: 0.25, waterSaved: 300, savingsPerWeek: 1500, label: 'Fruits' }
        };

        const systems = [
            { name: 'Vertical Grow Bags', minSpace: 4, maxSpace: 12, unitsPerSqFt: 0.5, price: 650 },
            { name: 'Multistorey Garden', minSpace: 8, maxSpace: 40, unitsPerSqFt: 0.2, price: 1500 },
            { name: 'Tower Garden', minSpace: 12, maxSpace: 80, unitsPerSqFt: 0.12, price: 4500 },
            { name: 'NFT System', minSpace: 30, maxSpace: 200, unitsPerSqFt: 0.06, price: 15000 }
        ];

        function formatKES(amount) {
            return 'KSh ' + Math.round(amount).toLocaleString();
        }

        function calculateHarvest() {
            const space = parseInt(hcSpace.value) || 16;
            const people = parseInt(hcPeople.value) || 4;
            const crop = cropData[hcCrop.value];

            hcSpaceVal.textContent = space + ' sq ft';
            hcPeopleVal.textContent = people;

            const weeklyKg = Math.round(space * crop.yieldPerSqFt * 100) / 100;
            const portions = Math.round(weeklyKg / 0.15);
            const waterSaved = Math.round(space * crop.waterSaved);
            const monthlySavings = Math.round(crop.savingsPerWeek * 4.3 * (space / 16));

            const neededPerPerson = 0.5;
            const totalNeeded = people * neededPerPerson;
            const suffPct = Math.min(100, Math.round((weeklyKg / totalNeeded) * 100));

            let recSystem = systems[0];
            for (let i = systems.length - 1; i >= 0; i--) {
                if (space >= systems[i].minSpace) {
                    recSystem = systems[i];
                    break;
                }
            }
            const unitsNeeded = Math.max(1, Math.round(space * recSystem.unitsPerSqFt));

            hcYield.innerHTML = weeklyKg + ' <small>kg</small>';
            hcPortions.textContent = portions;
            hcWater.textContent = formatKES(waterSaved).replace('KSh ', '') + ' L';
            hcSavings.textContent = formatKES(monthlySavings);
            hcSystem.textContent = recSystem.name;
            hcUnits.textContent = unitsNeeded;
            hcSuffFill.style.width = suffPct + '%';
            hcSuffLabel.textContent = suffPct + '% of your family\'s greens';
        }

        hcSpace.addEventListener('input', calculateHarvest);
        hcPeople.addEventListener('input', calculateHarvest);
        hcCrop.addEventListener('change', calculateHarvest);
        hcBtn.addEventListener('click', (e) => { e.preventDefault(); calculateHarvest(); });
        calculateHarvest();
    }

    /* --- Testimonials Slider --- */
    const testiTrack = document.getElementById('testimonialTrack');
    if (testiTrack) {
        const testiPrev = document.getElementById('testiPrev');
        const testiNext = document.getElementById('testiNext');
        const testiDots = document.getElementById('testiDots');
        const testiProgressBar = document.getElementById('testiProgressBar');
        const testiFilters = document.getElementById('testiFilters');
        const allSlides = Array.from(testiTrack.querySelectorAll('.testimonial-card'));
        const testiInterval = 6000;
        let testiCurrent = 0;
        let testiAutoplay;
        let testiProgressId;
        let testiProgressStart;
        let activeFilter = 'all';

        function getPerView() {
            const w = window.innerWidth;
            if (w <= 700) return 1;
            if (w <= 992) return 2;
            return 3;
        }

        function visibleSlides() {
            return allSlides.filter(card => activeFilter === 'all' || card.dataset.category === activeFilter);
        }

        function pageCount() {
            const perView = getPerView();
            return Math.max(1, Math.ceil(visibleSlides().length / perView));
        }

        function buildDots() {
            testiDots.innerHTML = '';
            const pages = pageCount();
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('testi-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => { testiGoTo(i); testiResetAutoplay(); });
                testiDots.appendChild(dot);
            }
        }

        function applyFilter(filter) {
            activeFilter = filter;
            allSlides.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('testi-hidden', !match);
            });
            testiCurrent = 0;
            buildDots();
            testiGoTo(0);
            testiResetAutoplay();
        }

        function testiGoTo(index) {
            const slides = visibleSlides();
            if (!slides.length) return;
            const pages = pageCount();
            testiCurrent = ((index % pages) + pages) % pages;
            const perView = getPerView();
            const cardWidth = slides[0].getBoundingClientRect().width;
            const gap = 24;
            const offset = testiCurrent * perView * (cardWidth + gap);
            testiTrack.style.transform = `translateX(-${offset}px)`;
            document.querySelectorAll('.testi-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === testiCurrent);
            });
        }

        function testiStartProgress() {
            if (!testiProgressBar) return;
            testiProgressBar.style.width = '0%';
            testiProgressStart = Date.now();
            cancelAnimationFrame(testiProgressId);
            function frame() {
                const elapsed = Date.now() - testiProgressStart;
                const pct = Math.min((elapsed / testiInterval) * 100, 100);
                testiProgressBar.style.width = pct + '%';
                if (pct < 100) {
                    testiProgressId = requestAnimationFrame(frame);
                }
            }
            testiProgressId = requestAnimationFrame(frame);
        }

        function testiResetAutoplay() {
            clearInterval(testiAutoplay);
            testiAutoplay = setInterval(() => {
                testiGoTo(testiCurrent + 1);
                testiStartProgress();
            }, testiInterval);
            testiStartProgress();
        }

        if (testiFilters) {
            testiFilters.querySelectorAll('.testi-filter').forEach(btn => {
                btn.addEventListener('click', () => {
                    testiFilters.querySelectorAll('.testi-filter').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });

                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                    applyFilter(btn.dataset.filter);
                });
            });
        }

        buildDots();
        testiGoTo(0);
        testiResetAutoplay();

        testiPrev.addEventListener('click', () => {
            testiGoTo(testiCurrent - 1);
            testiResetAutoplay();
        });

        testiNext.addEventListener('click', () => {
            testiGoTo(testiCurrent + 1);
            testiResetAutoplay();
        });

        testiTrack.addEventListener('mouseenter', () => {
            clearInterval(testiAutoplay);
            cancelAnimationFrame(testiProgressId);
            if (testiProgressBar) testiProgressBar.style.width = '0%';
        });

        testiTrack.addEventListener('mouseleave', () => {
            testiResetAutoplay();
        });

        testiTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { testiGoTo(testiCurrent - 1); testiResetAutoplay(); }
            if (e.key === 'ArrowRight') { testiGoTo(testiCurrent + 1); testiResetAutoplay(); }
        });

        /* Touch swipe support */
        let touchStartX = 0;
        testiTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        testiTrack.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? testiGoTo(testiCurrent - 1) : testiGoTo(testiCurrent + 1);
                testiResetAutoplay();
            }
        }, { passive: true });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                buildDots();
                testiGoTo(0);
            }, 200);
        });
    }

    /* --- FAQ Accordion --- */
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(active => {
                active.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* --- Gallery Filtering (show all, no limit) --- */
    const filterBtns = document.querySelectorAll('.gf-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function filterGallery(filter) {
        galleryItems.forEach(item => {
            const match = filter === 'all'
                || item.dataset.category === filter
                || item.dataset.system === filter;
            item.style.display = match ? 'block' : 'none';
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGallery(btn.dataset.filter);
        });
    });

    var defaultFilter = document.querySelector('.gf-btn.active')?.dataset?.filter || 'multistorey';
    filterGallery(defaultFilter);

    /* --- Gallery Lightbox --- */
    const lightbox = document.getElementById('galleryLightbox');
    const glImage = document.getElementById('glImage');
    const glCaption = document.getElementById('glCaption');
    let lightboxIndex = 0;
    let lightboxImages = [];

    function openLightbox(index) {
        lightboxIndex = index;
        lightboxImages = Array.from(document.querySelectorAll('.gallery-item img'));
        const img = lightboxImages[index];
        glImage.src = img.src;
        glImage.alt = img.alt;
        const overlay = img.closest('.gallery-item').querySelector('.gallery-overlay span');
        glCaption.textContent = overlay ? overlay.textContent : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
        const img = lightboxImages[lightboxIndex];
        glImage.src = img.src;
        glImage.alt = img.alt;
        const overlay = img.closest('.gallery-item').querySelector('.gallery-overlay span');
        glCaption.textContent = overlay ? overlay.textContent : '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightbox) {
        lightbox.querySelector('.gl-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.gl-prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.gl-next').addEventListener('click', () => navigateLightbox(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    /* --- Cart System --- */
    let cart = [];
    const cartCount = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartItemCount = document.getElementById('cartItemCount');

    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.classList.add('cart-open');
        renderCart();
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.classList.remove('cart-open');
    }

    function totalItems() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function updateCartCount() {
        cartCount.textContent = totalItems();
    }

    function renderCart() {
        if (cart.length === 0) {
            cartBody.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
            cartFooter.style.display = 'none';
            cartItemCount.textContent = '0 items';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach((item, index) => {
            const lineTotal = item.price * item.qty;
            total += lineTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.product}</h4>
                        <span>${formatKES(item.price)} each</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" data-index="${index}" data-action="dec">-</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-index="${index}" data-action="inc">+</button>
                    </div>
                    <div class="cart-item-total">${formatKES(lineTotal)}</div>
                    <button class="cart-item-remove" data-index="${index}"><i class="fas fa-times"></i></button>
                </div>
            `;
        });

        cartBody.innerHTML = html;
        cartFooter.style.display = 'block';
        cartTotal.textContent = formatKES(total);
        const t = totalItems();
        cartItemCount.textContent = t + (t === 1 ? ' item' : ' items');

        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                if (btn.dataset.action === 'inc') {
                    cart[idx].qty++;
                } else {
                    cart[idx].qty--;
                    if (cart[idx].qty <= 0) {
                        cart.splice(idx, 1);
                    }
                }
                updateCartCount();
                renderCart();
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                updateCartCount();
                renderCart();
            });
        });
    }

    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    document.getElementById('cartClear').addEventListener('click', () => {
        cart = [];
        updateCartCount();
        renderCart();
    });

    document.getElementById('cartCheckout').addEventListener('click', () => {
        closeCart();
        var orderMsg = 'Order:\n' + cart.map(function(i) {
            return i.product + ' x' + i.qty + ' - ' + formatKES(i.price * i.qty);
        }).join('\n');
        orderMsg += '\n\nTotal: ' + formatKES(cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0));
        localStorage.setItem('vtg_cart_message', orderMsg);
        window.location.href = 'contact.html';
    });

    function findCartItem(product) {
        return cart.findIndex(i => i.product === product);
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product;
            const price = parseInt(btn.dataset.price);
            const idx = findCartItem(product);
            if (idx !== -1) {
                cart[idx].qty++;
            } else {
                cart.push({ product, price, qty: 1 });
            }
            updateCartCount();
            renderCart();
            openCart();

            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            btn.style.background = 'var(--green-700)';
            btn.style.color = 'var(--white)';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        });
    });

    /* --- Contact Form --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formSubmitBtn = document.getElementById('formSubmitBtn');
        const formStatus = document.getElementById('formStatus');

        function showFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorEl = document.getElementById(fieldId + 'Error');
            if (field) field.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.toggle('visible', !!message);
            }
        }

        function clearFieldErrors() {
            contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            contactForm.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
        }

        function showFormStatus(type, message) {
            formStatus.className = 'form-status visible status-' + type;
            formStatus.innerHTML = type === 'success'
                ? '<i class="fas fa-check-circle"></i> ' + message
                : '<i class="fas fa-exclamation-circle"></i> ' + message;
        }

        function hideFormStatus() {
            formStatus.className = 'form-status';
            formStatus.innerHTML = '';
        }

        function setLoading(isLoading) {
            formSubmitBtn.disabled = isLoading;
            formSubmitBtn.innerHTML = isLoading
                ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
                : '<i class="fas fa-paper-plane"></i> Send Message';
        }

        function validateField(id, rules) {
            const field = document.getElementById(id);
            const value = field ? field.value.trim() : '';
            for (const rule of rules) {
                const error = rule(value, field);
                if (error) {
                    showFieldError(id, error);
                    return false;
                }
            }
            showFieldError(id, '');
            return true;
        }

        function validateForm() {
            clearFieldErrors();
            hideFormStatus();

            const isNameValid = validateField('name', [
                v => !v ? 'Please enter your name' : null,
                v => v.length < 2 ? 'Name must be at least 2 characters' : null,
            ]);

            const isEmailValid = validateField('email', [
                v => !v ? 'Please enter your email' : null,
                v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email' : null,
            ]);

            const phone = document.getElementById('phone').value.trim();
            const isPhoneValid = validateField('phone', [
                v => v && !/^[\d\s\+\-\(\)]{7,15}$/.test(v) ? 'Please enter a valid phone number' : null,
            ]);

            const isMessageValid = validateField('message', [
                v => !v ? 'Please enter your message' : null,
                v => v.length < 10 ? 'Message must be at least 10 characters' : null,
            ]);

            return isNameValid && isEmailValid && isPhoneValid && isMessageValid;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            const formData = new FormData(contactForm);
            const name = formData.get('name') || 'Visitor';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const interest = formData.get('interest') || 'Not specified';
            const message = formData.get('message') || '';

            var whatsappMsg = '*New Enquiry from ' + name + '*\n';
            whatsappMsg += 'Email: ' + email + '\n';
            whatsappMsg += 'Phone: ' + phone + '\n';
            whatsappMsg += 'Interest: ' + interest + '\n';
            whatsappMsg += 'Message: ' + message + '\n';
            var waUrl = 'https://wa.me/254706035470?text=' + encodeURIComponent(whatsappMsg);
            window.open(waUrl, '_blank');
            contactForm.reset();
        });

        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                const id = field.id;
                if (id === 'name') validateField('name', [v => !v ? 'Please enter your name' : null]);
                else if (id === 'email') validateField('email', [
                    v => !v ? 'Please enter your email' : null,
                    v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email' : null,
                ]);
                else if (id === 'phone') validateField('phone', [
                    v => v && !/^[\d\s\+\-\(\)]{7,15}$/.test(v) ? 'Please enter a valid phone number' : null,
                ]);
                else if (id === 'message') validateField('message', [
                    v => !v ? 'Please enter your message' : null,
                ]);
            });
            field.addEventListener('input', () => {
                document.getElementById(field.id + 'Error')?.classList.remove('visible');
                field.classList.remove('error');
            });
        });
    }

    // --- Footer Accordion (mobile) ---
    document.querySelectorAll('.footer-accordion-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            toggle.closest('.footer-accordion').classList.toggle('is-open');
        });
    });

    // --- Footer Newsletter ---
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterStatus = document.getElementById('newsletterStatus');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!isValid) {
                newsletterStatus.textContent = 'Please enter a valid email address.';
                newsletterStatus.className = 'footer-newsletter-status error';
                return;
            }

            newsletterStatus.textContent = 'Subscribing...';
            newsletterStatus.className = 'footer-newsletter-status';

            try {
                const response = await fetch('https://formspree.io/f/xyzebvkj', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        _subject: 'Newsletter Subscription'
                    }),
                });

                if (response.ok) {
                    newsletterStatus.textContent = "Thanks! You're subscribed to our growing tips.";
                    newsletterStatus.className = 'footer-newsletter-status success';
                    newsletterForm.reset();
                } else {
                    newsletterStatus.textContent = 'Something went wrong. Please try again.';
                    newsletterStatus.className = 'footer-newsletter-status error';
                }
            } catch (err) {
                newsletterStatus.textContent = 'Unable to subscribe. Check your connection and try again.';
                newsletterStatus.className = 'footer-newsletter-status error';
            }
        });
    }

    /* --- Lazy Load Background Images --- */
    var lazyBgElems = document.querySelectorAll('[data-bg]');
    if (lazyBgElems.length > 0 && 'IntersectionObserver' in window) {
        var bgObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var bgVal = el.getAttribute('data-bg');
                    el.style.setProperty('--bg-url', bgVal);
                    el.style.setProperty('--bg-loaded', bgVal);
                    el.classList.add('loaded');
                    el.removeAttribute('data-bg');
                    bgObserver.unobserve(el);
                }
            });
        }, { rootMargin: '200px' });

        lazyBgElems.forEach(function(el) {
            bgObserver.observe(el);
        });
    }
    }

    function tryInit() {
        if (document.querySelector('.nav-links')) {
            init();
            return true;
        }
        return false;
    }

    if (!tryInit()) {
        var check = setInterval(function() {
            if (tryInit()) clearInterval(check);
        }, 50);
    }
})();


