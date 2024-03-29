import bcrypt from 'bcryptjs';
//do I need to add user module just for admin support
import { Strategy as localStrategy } from 'passport-local';
import { User } from './user.js';

const passportStrat = (passport) => {
  console.log('getting into passport');
  // console.log(passport);
  passport.use(
    new localStrategy((user, password, done) => {
      console.log({ user, password });

      User.findOne({ user: user })
        .then((user) => {
          console.log({ user });
          console.log('getting into local strategy');
          // if (err) throw err;
          if (!user) {
            console.log('no user found');
            return done(null, false);
          }
          console.log([{ password }, user.password]);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              console.log('correct password');
              return done(null, user);
            } else {
              console.log('incorrect password');
              return done(null, false);
            }
          });
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    })
  );

  passport.serializeUser((user, cb) => {
    console.log({ user });
    cb(null, user.user);
  });
  passport.deserializeUser((id, cb) => {
    console.log({ id });
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        user: user.user,
      };
      cb(err, userInformation);
    });
  });
};

export { passportStrat };
