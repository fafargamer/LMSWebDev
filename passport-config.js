const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUser) {
  const authenticateUser = (username, password, done) => {
    const user = getUser(username)
    if(!user || password != user.password){
            return done(null,false)
        }
    }
  passport.user(new LocalStrategy({ username: 'username', password: 'password'}),
  authenticateUser)
  passport.serializeUser((user, done) => {})
  passport.deserializeUser((id, done) => {})
}

module.exports = initialize