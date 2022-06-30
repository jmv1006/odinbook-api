import { Strategy } from "passport-local";

const LocalStrategy = new Strategy((username, password, done) => {
    //stuff here
});

export default LocalStrategy;