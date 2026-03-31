(function () {
    const STORAGE_KEY = 'loginGoogleUser';

    function decodeJwtPayload(jwt) {
        const part = jwt.split('.')[1];
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(json);
    }

    function getStoredUser() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function saveUserFromCredential(credential) {
        const payload = decodeJwtPayload(credential);
        const user = {
            name: payload.name || '',
            email: payload.email || '',
            picture: payload.picture || ''
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    }

    function showHome(user) {
        document.getElementById('view-home').hidden = false;
        document.getElementById('view-profile').hidden = true;
        const loggedOut = document.getElementById('home-logged-out');
        const loggedIn = document.getElementById('home-logged-in');
        if (user) {
            loggedOut.hidden = true;
            loggedIn.hidden = false;
            document.getElementById('home-name').textContent = user.name || 'Usuario';
        } else {
            loggedOut.hidden = false;
            loggedIn.hidden = true;
        }
    }

    function showProfile(user) {
        document.getElementById('view-home').hidden = true;
        document.getElementById('view-profile').hidden = false;
        document.getElementById('profile-name').textContent = user.name || '—';
        document.getElementById('profile-email').textContent = user.email || '—';
        const img = document.getElementById('profile-photo');
        if (user.picture) {
            img.src = user.picture;
            img.hidden = false;
        } else {
            img.hidden = true;
        }
    }

    function handleCredentialResponse(response) {
        if (!response || !response.credential) return;
        const user = saveUserFromCredential(response.credential);
        showHome(user);
    }

    function initGoogleButton() {
        const clientId = window.GOOGLE_CLIENT_ID;
        const wrap = document.getElementById('google-btn-wrap');
        if (!wrap) return;

        if (!clientId || clientId.indexOf('REEMPLAZA') !== -1) {
            wrap.innerHTML =
                '<p class="warn">Edita <code>docs/config.js</code> y pon tu GOOGLE_CLIENT_ID.</p>';
            return;
        }

        wrap.innerHTML = '';
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        google.accounts.id.renderButton(wrap, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            locale: 'es'
        });
    }

    function loadGsiAndInit() {
        if (window.google && google.accounts && google.accounts.id) {
            initGoogleButton();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = function () {
            initGoogleButton();
        };
        document.head.appendChild(script);
    }

    function logout() {
        sessionStorage.removeItem(STORAGE_KEY);
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        showHome(null);
        loadGsiAndInit();
    }

    document.getElementById('btn-logout').addEventListener('click', logout);
    document.getElementById('btn-logout-home').addEventListener('click', logout);

    document.getElementById('to-profile').addEventListener('click', function (e) {
        e.preventDefault();
        const user = getStoredUser();
        if (user) showProfile(user);
    });

    document.getElementById('link-home').addEventListener('click', function (e) {
        e.preventDefault();
        const user = getStoredUser();
        showHome(user);
        if (!user) loadGsiAndInit();
    });

    window.addEventListener('load', function () {
        const user = getStoredUser();
        if (user) {
            showHome(user);
        } else {
            showHome(null);
            loadGsiAndInit();
        }
    });
})();
