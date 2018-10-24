const passport = require('passport');
require('dotenv/config');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CONSUMER_KEY,
  clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000/google/redirect'
},
((request, accessToken, refreshToken, profile, done) => {
  done(null, profile);
})));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: 'http://localhost:3000/facebook/redirect',
  profileFields: ['id', 'displayName', 'photos', 'email']
},
((request, accessToken, refreshToken, profile, done) => {
  done(null, profile);
})));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: 'http://localhost:3000/linkedin/redirect',
  scope: ['r_emailaddress', 'r_basicprofile']
}, ((accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
})));

module.exports = passport;
