const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const db = require("../../models/index.js");
const { generateUniqueReferralCode } = require("../../services/authService.js");
const { User } = db;

const getProfile = async (profile) => {
    const {id, displayName, emails, provider} = profile;
    if(emails && emails.length) {
        const email = emails[0].value;
        return {
            googleId: id,
            fullName: displayName,
            email: email,
            avatar: profile.photos[0].value,
            referralCode : await generateUniqueReferralCode()
        }
    }
    return null
}

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (acceessToken, refreshToken, profile, done) => {
    console.log(profile);

    try {
        const existingGoogleAccount = await User.findOne({
            where: {googleId: profile.id},
        })

        if(!existingGoogleAccount) {
            const existingEmailAccount = await User.findOne({
                where: {email: (await getProfile(profile)).email}
            })
            if(!existingEmailAccount) {
                console.log("come")
                const newAccount = await User.create(await getProfile(profile))
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
