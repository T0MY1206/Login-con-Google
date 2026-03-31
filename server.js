const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const callbackURL = `${baseUrl}/auth/google/callback`;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env (o en el panel del hosting).');
    process.exit(1);
}

const defaultSessionSecret = 'solo-desarrollo-no-usar-en-produccion';
if (isProd && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === defaultSessionSecret)) {
    console.error('En producción define SESSION_SECRET con una cadena larga y aleatoria.');
    process.exit(1);
}

const app = express();
if (isProd) {
    app.set('trust proxy', 1);
}

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || defaultSessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: isProd,
        sameSite: 'lax',
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    });

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ${baseUrl} (puerto ${PORT})`);
    if (isProd) {
        console.log(`OAuth callback: ${callbackURL}`);
    }
});