// ========================================
// NAV HAMBURGER  (same logic as index.js)
// ========================================
(function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
})();


// ========================================
// CONTACT FORM
// ========================================
(function initContactForm() {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const successBanner = document.getElementById('formSuccess');
    const errorBanner   = document.getElementById('formError');

    const fields = {
        name:  { el: document.getElementById('name'),         err: document.getElementById('nameError') },
        email: { el: document.getElementById('emailAddress'), err: document.getElementById('emailError') },
        msg:   { el: document.getElementById('message'),      err: document.getElementById('messageError') },
    };

    if (!form) return;

    // ── Validation helpers ──────────────────────────────────────
    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function validateField(key) {
        const { el, err } = fields[key];
        const val = el.value.trim();
        let ok = true;

        if (key === 'email') ok = val.length > 0 && isValidEmail(val);
        else ok = val.length > 0;

        el.classList.toggle('invalid', !ok);
        err.classList.toggle('visible', !ok);
        return ok;
    }

    function validateAll() {
        const results = Object.keys(fields).map(k => validateField(k));
        return results.every(Boolean);
    }

    // ── Live validation: clear error as soon as field looks good ──
    Object.keys(fields).forEach(key => {
        fields[key].el.addEventListener('input', () => {
            const { el, err } = fields[key];
            const val = el.value.trim();
            const ok  = key === 'email' ? val.length > 0 && isValidEmail(val) : val.length > 0;
            if (ok) {
                el.classList.remove('invalid');
                err.classList.remove('visible');
            }
        });
    });

    // ── Submit ───────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide any existing banners
        successBanner.classList.remove('visible');
        errorBanner.classList.remove('visible');

        if (!validateAll()) return;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');

        try {
            const data = new FormData(form);
            const res  = await fetch(form.action, {
                method:  'POST',
                body:    data,
                headers: { 'Accept': 'application/json' },
            });

            if (res.ok) {
                // Success
                form.reset();
                successBanner.classList.add('visible');
                // Scroll banner into view on mobile
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                // Formspree returned an error
                errorBanner.classList.add('visible');
            }
        } catch {
            // Network error
            errorBanner.classList.add('visible');
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('sending');
        }
    });
})();