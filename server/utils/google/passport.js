const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const db = require("../../models/index.js");
const { User } = db;

const getProfile = (profile) => {
    const {id, displayName, emails, provider} = profile;
    if(emails && emails.length) {
        const email = emails[0].value;
        console.log(profile)
        return {
            googleId: id,
            name: displayName,
            email,
            provider
        }
    }
    return null
}

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (acceessToken, refreshToken, profile, done) => {
    try {
        const existingGoogleAccount = await User.findOne({
            where: {googleId: profile.id},
        })

        if(!existingGoogleAccount) {
            const existingEmailAccount = await User.findOne({
                where: {email: getProfile(profile).email}
            })

            if(!existingEmailAccount) {
                const userInfo = getProfile(profile);
                const newAccount = await User.create(getProfile(profile))
                return done(null, newAccount)
            }
            return done(null, existingEmailAccount)
        }
        return done(null, existingGoogleAccount)
    } catch (error) {
        throw new Error(error)
    }
  })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    })
    .catch((error) => done(error) )
});
