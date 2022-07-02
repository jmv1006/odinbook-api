import { Strategy } from "passport-local";
import { compare } from "bcryptjs";
import con from "../db/db";

const LocalStrategy = new Strategy({usernameField: "Email", passwordField: "Password"}, (Email, Password, done) => {
    con.query(`SELECT * FROM Users WHERE Email="${Email}"`, (err, result) => {
        if (err) {
          return done(err)
        }

        if (result.length == 0) {
            return done(null, false, { message: "Incorrect Username" });
        }

        if(result.length > 0) {
            compare(Password, result[0].Password, (err, res) => {
                if(res) {
                    return done(null, result[0])
                }
                return done(null, false, { message: "Incorrect Password" })
            })
        }
    });
});

export default LocalStrategy;