const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const db = require("../../models/index.js");
const { User } = db;

const getProfile = (profile) => {
    const {id, displayName} = profile;
    return {
        facebookId: id,
        fullName: displayName,
    }
}

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_KEY,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/api/auth/facebook/callback'
  },
  async (acceessToken, refreshToken, profile, done) => {
    try {
        const existingFacebookAccount = await User.findOne({
            where: {facebookId: profile.id},
        })

        if(!existingFacebookAccount) {
          const existingFacebookAccount = await User.findOne({
              where: {facebookId: getProfile(profile).facebookId}
          })
          if(!existingFacebookAccount) {
              const newAccount = await User.create(getProfile(profile))
              return done(null, newAccount)
          }
          return done(null, existingEmailAccount)
      }
      return done(null, existingFacebookAccount)
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
