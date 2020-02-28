// *** IMPORTS *** //
require('dotenv').config();
let { DB_CONNECTION_STRING, SERVER_PORT, SESSION_SECRET, DEV, PROD } = process.env;
DEV = DEV ? (DEV.toLowerCase() === 'true' ? true : false) : false;
PROD = PROD ? (PROD.toLowerCase() === 'true' ? true : false) : false;
const moment = require('moment');
const express = require('express');
const redis = require('redis');
const session = require('express-session');
const massive = require('massive');
const cron = require('node-schedule');
const app = express();
const path = require('path');
const Auth = require('./controller/Authentication');
const Info = require('./controller/Info');
const Documents = require('./controller/Documents');
const Google = require('./controller/Google');
const Create = require('./controller/Create');
const Update = require('./controller/Update');
const Record = require('./controller/Record');
const Reviews = require('./controller/Mail/Reviews');
const Migration = require('./controller/Migration');
const Recurring = require('./controller/Recurring');
// const Passport = require('./controller/passport');
// const passport = require('passport');
const Crypto = require('crypto');
const Defaults = require('./controller/Defaults');
moment.tz.setDefault('UTC');
// *** TOPLEVEL MIDDLEWARE *** //
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.static(`${__dirname}/../build`));
if (PROD) {
	let RedisStore = require('connect-redis')(session);
	let redisClient = redis.createClient();
	app.use(
		session({
			store: new RedisStore({ client: redisClient }),
			secret: SESSION_SECRET,
			name: 'LiftLocal',
			proxy: true,
			resave: true,
			saveUninitialized: true,
			cookie: {
				maxAge: 86400000,
			},
		}),
	);
} else {
	app.use(
		session({
			secret: SESSION_SECRET,
			name: 'LiftLocal',
			proxy: true,
			resave: true,
			saveUninitialized: true,
			cookie: {
				maxAge: 86400000,
			},
		}),
	);
}
app.use(async function(req, res, next) {
	if (DEV) {
		let db = req.app.get('db');
		// await Auth.loginBypass(db, req, next);
		next();
		// cron.scheduleJob(`50 ${moment().format('m') % 2 == 0 ? moment().format('m') : '0'} * * * *`, async () => {
		// });
	} else {
		next();
	}
});
massive(DB_CONNECTION_STRING).then(async db => {
	await app.set('db', db);
	// *** IM LISTENING! *** //
	await app.listen(SERVER_PORT, () => {
		console.log(`Listening on PORT: ${SERVER_PORT} || Running in ${!DEV ? 'Production' : 'Dev'} Mode`);
		console.log('\x1b[35m%s\x1b[0m', `Started on ${moment().format('LLLL')}`);
	});
	await console.log('\x1b[7m%s\x1b[0m', 'll-software Database Connected');
});

// *** ENDPOINTS *** //
// Getting Current Session
app.get('/api/get-session', async (req, res) => {
	if (req.session.user) {
		res.status(200).send(req.session.user);
	} else {
		res.status(200).send({ msg: 'No Session Found' });
	}
});
// AUTHENTICATION ENDPOINTS
app.post('/api/ll/login', Auth.login); //Login Route
app.post('/api/ll/register', Auth.register); //Registration Route
app.get('/api/ll/logout', Auth.logout); //Registration Route
app.post('/api/ll/createbusiness', Create.addBusiness); //Registration Route
app.post('/api/ll/addlocation', Create.addLocation);
app.get('/api/ll/resetsession', Auth.resetSession);
app.post('/api/ll/reset/password', Auth.forgotPass);
app.post('/api/ll/reset/code', Auth.resetCode);
app.post('/api/ll/reset/newpass', Auth.newPass);
app.post('/api/update/user-info', Auth.updateLoginInfo);

//REPORTS
app.get('/api/all-sent-stats/:date', Info.allSentStats);

// GOOGLE ENDPOINTS
app.post('/api/gmb/allaccounts', Google.getAccounts);
app.post('/api/gmb/addaccount', Google.newInsights);
app.post('/api/google/place/search', Google.Search);
app.post('/api/google/place/placeid/details', Google.Details);

// EMAIL RECORD
app.post('/api/record/email/:type', Record.record);
app.post('/api/record/reviews/direct-feedback', Record.directFeedback);
app.post('/api/record/reviews/click-site', Record.siteClick);

// Defaults
app.get('/api/default/:industry', Create.addDefaults);
// HOME PAGE ENDPOINTS
app.get('/api/home/info', Info.HomePageInfo);
app.get('/api/home/dropinfo', Info.DropInfo);
app.post('/api/reviewreport/data', Info.Reviews);
app.post('/api/reviewreport/indv/data', Info.IndvReviews);
app.post('/api/typereport/data/', Info.Addon);
app.post('/api/typereport/indv/data/', Info.IndvAddon);

// Defaults
app.get('/api/get/default/:type', Info.TypeDefaults);
app.post('/api/update/default', Info.UpdateDefaults);
app.post('/api/update/review/landingpage', Update.updateReviewLandingPage);

// Client Dash
app.post('/api/logo/new', Create.addLogo); //Create/update logo
app.post('/api/create/logolink', Create.newLogoLink);
app.post('/api/report/checklist', Info.updateChecklist);
app.post('/api/update/auto', Update.autoAmt);
app.get('/api/get/business_details/:id', Info.businessDetails);
app.post('/api/update/business_details', Info.updateBusinessDetails);
app.get('/api/indv/customers&business/:id', Info.custBusiness);
app.post('/api/new/customer/:client_id/:cor_id', Create.newCustomer);
// app.get('/api/feedback/fakereviews', Info.landingReviews); //Used on scrolling reviews for addon landing
app.get('/api/settings/:id/:cor_id', Info.settings);
// app.post('/api/settings/update', Info.updateSettings);
app.get('/api/insights/:id/:cor_id', Info.insights);
app.post('/api/insights/new', Info.newInsights);
app.post('/api/links/update', Info.updateLinks);
app.post('/api/request/send', Reviews.ManualSend);
app.get('/api/uploadedimages', Info.getUploadedImages);
app.post('/api/update/logolink', Update.updateLogoLink);
// CUSTOMERS
app.post('/api/add-new-user/dev', Create.newUser);
app.post('/api/upload-customers', Create.uploadCustomer);
app.get('/api/indv/customers/:id', Info.CustomerInfo);
app.get('/api/indv/:cust_id/customers', Info.SingleCustomer);
app.post('/api/update/customerinfo', Info.updateCustomer);

// FEEDBACK RECORDING
app.post('/api/feedback/record/addon', Record.addonRecord);
app.post('/api/feedback/reviews/record', Record.feedback);
app.post('/api/company_logo', Info.companyLogo);
app.post('/api/feedback/reviews/directClick', Record.directClick);
app.post('/api/unsubscribe', Record.unsubscribe);

// UPDATES
app.post('/api/defaults/update/review-email/all', Update.reviewEmailAll);
app.post('/api/defaults/update/review-email', Update.reviewEmail);
app.post('/api/defaults/update/review-landing/all', Update.reviewLandingAll);
app.post('/api/defaults/update/review-landing', Update.reviewLanding);
app.post('/api/indv/settings/update', Update.indvSettings);
app.post('/api/indv/dash/delete-customer', Update.deleteCustomer);
app.post('/api/indv/review-email/update', Update.indvReviewEmail);
app.post('/api/indv/ginsights/update', Update.gInsights);
app.post('/api/set-active', Update.active);

// app.get('/api/set-pdf/:name', Documents.getindvReviewReport);

// MIGRATION
app.get('/api/all-agents', Migration.setLinks);
app.post('/api/update/cor_id', Migration.updateCor);
app.post('/api/update/gatherup/credientials', Migration.updateGatherupAPI);
app.post('/api/getgatherupcustomer', Migration.recordFeedback);
app.post('/api/update/api', Migration.updateAPI);
// ManualSync
app.post('/api/sync/salesforce', Update.syncSalesForce);
app.post('/api/sync/gatherup', Update.syncGatherup);
app.post('/api/sync/internal', Update.syncInternal);
// DEV TEST
app.get('/api/salesforce/test', Migration.SFTest);
app.get('/api/salesforce/login', Migration.SFLogin);
// Documents

app.get('/api/doc/get/indv/reviewReport/:name', Documents.getindvReviewReport);
app.post('/api/doc/email/indv/reviewReport', Documents.emailIndvReviewReport);
app.post('/api/doc/gen/indv/reviewreport', Documents.indvReviewReport);
app.get('/api/token', (req, res) => {
	console.log(res);
});
// =========================================
// KEEP AT BOTTOM OF ALL ENDPOINTS
// =========================================
app.get('*', (req, res) => {
	res.sendFile(path.resolve(`${__dirname}/../build/index.html`));
});
// =========================================
// =========================================
// Recurring functions with cron jobs
// 'Seconds Minutes Hour DayOfMonth Month DayOfWeek'
// =========================================
// PRODUCTION ONLY SCHEDULED FUNCTIONS
//  |
//  ▼
if (!DEV && PROD) {
	cron.scheduleJob('40 * * * * *', async () => {
		let offset = '-300';
		// await Reviews.pr_(app, offset);
	});
	// =========================================
	// REVIEWS SCHEDULED EMAILS
	// =========================================
	let offset;
	// =========================================
	cron.scheduleJob('45 03 21 * * *', async () => {
		//Eastern
		offset = '-240';
		await Reviews.s_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	cron.scheduleJob('45 03 22 * * *', async () => {
		//Central
		offset = '-300';
		await Reviews.s_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	cron.scheduleJob('45 03 23 * * *', async () => {
		//Mountain
		offset = '-360';
		await Reviews.s_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	cron.scheduleJob('45 04 0 * * *', async () => {
		//Pacific
		offset = '-420';
		await Reviews.s_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	cron.scheduleJob('45 03 01 * * *', async () => {
		//Alaska
		offset = '-480';
		await Reviews.s_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	cron.scheduleJob('45 03 03 * * *', async () => {
		//Hawaii
		offset = '-540';
		await Reviews.s_(app, offset);
		await Reviews.sr_(app, offset);
		await Reviews.fr_(app, offset);
		await Reviews.or_(app, offset);
		await Reviews.spr_(app, offset);
		await Reviews.pr_(app, offset);
	});
	// =========================================
	// SCHEDULED RECORDING STATS
	// =========================================
	cron.scheduleJob('15 03 05 * * 7', async () => {
		// NEW REVIEWS
		let allComp = await app.get('db').info.all_record_business([]);
		let amt = 100;
		console.log(`Counting New Reviews for ${allComp.length} companies at ${amt} per interval taking ${Math.ceil(allComp.length / amt) * 5} Seconds`);
		for (let i = 0; i < Math.ceil(allComp.length / amt); i++) {
			setTimeout(async () => {
				await Record.newReviews(app, allComp.slice(i * amt, i * amt + amt));
			}, 10000 * i);
		}
		// GOOGLE INSIGHTS - TODO
	});
	cron.scheduleJob('15 0 05 * * *', async () => {
		// Reset Login Code
		await app.get('db').auth.reset_codes([]);
	});
	cron.scheduleJob('55 25 06 * * 7', async () => {
		// CUSTOMER COUNT
		let allComp = await app.get('db').info.all_record_business([]);
		let amt = 15;
		console.log(`Counting Customers for ${allComp.length} companies at ${amt} per interval taking ${Math.ceil(allComp.length / amt) * 5} Seconds`);
		for (let i = 0; i < Math.ceil(allComp.length / amt); i++) {
			setTimeout(async () => {
				await Record.custCount(app, allComp.slice(i * amt, i * amt + amt));
			}, 5000 * i);
		}
	});
	// =========================================
	// SCHEDULED SEND REPORTS
	// =========================================
	cron.scheduleJob('45 03 03 2-30/2 * *', async () => {
		// PERFORMANCE REPORT
		let offset = '-420';
		// SYNCING WITH SALESFORCE
		// await Recurring.syncSF(app);
	});
	cron.scheduleJob('55 25 10 * * 7', async () => {
		// SYNC WITH SALESFORCE
		// Get Account Manager
	});
} else {
	cron.scheduleJob('35 53 * * * *', async () => {});
}

// =========================================
// Prototypes
// =========================================
String.prototype.toProper = function() {
	let str = this;
	if (typeof str === 'string') {
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
};
Array.prototype.push2 = function(x) {
	this.push(x);
	return this;
};
String.prototype.emailValidate = function() {
	let str = this;
	// eslint-disable-next-line
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(str).toLowerCase());
};
