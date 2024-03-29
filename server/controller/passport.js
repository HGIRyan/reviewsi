const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
// const User = require('./models/user');
const config = {
	JWT_SECRET: 'codeworkrauthentication',
	oauth: {
		google: {
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
	},
};

// JSON WEB TOKENS STRATEGY
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader('authorization'),
			secretOrKey: config.JWT_SECRET,
		},
		async (payload, done) => {
			try {
				// Find the user specified in token
				// const user = await User.findById(payload.sub);

				// If user doesn't exists, handle it
				if (!user) {
					return done(null, false);
				}

				// Otherwise, return the user
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		},
	),
);

// Google OAuth Strategy
passport.use(
	'googleToken',
	new GooglePlusTokenStrategy(
		{
			clientID: config.oauth.google.clientID,
			clientSecret: config.oauth.google.clientSecret,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Should have full user profile over here
				// console.log('profile', profile);
				console.log('accessToken', accessToken);
				console.log('refreshToken', refreshToken);
			} catch (error) {
				done(error, false, error.message);
			}
		},
	),
);

// LOCAL STRATEGY
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			try {
				// Find the user given the email
				const user = await User.findOne({ 'local.email': email });

				// If not, handle it
				if (!user) {
					return done(null, false);
				}

				// Check if the password is correct
				const isMatch = await user.isValidPassword(password);

				// If not, handle it
				if (!isMatch) {
					return done(null, false);
				}

				// Otherwise, return the user
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		},
	),
);
