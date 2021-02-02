import { StrategyOptions } from 'passport-jwt';
import { config } from '../config';
import { getUserByUsername } from '../services/user.service';


const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const jwtOpts: StrategyOptions = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

export function initPassportStrategies() {
    passport.use(
        'jwt',
        // @ts-ignore TODO: fix types
        new jwtStrategy(jwtOpts, async (payload, done) => {
            try {
                const user = await getUserByUsername(payload.username);
                if (user) {
                    done(null, user);
                } else {
                    done(null, null);
                }

            } catch (err) {
                done(err, null);
            }
        })
    );

}
