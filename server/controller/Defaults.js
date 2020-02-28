// Imports
const bcrypt = require('bcryptjs');
const Moment = require('moment');
let { DEV, SESSION_SECRET } = process.env;
DEV = DEV.toLowerCase() === 'true' ? true : false;
const ll = 'YYYY-MM-DD';
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SECRET_CRYPTR');
const Err = require('./Error');
const { SF_SECRET, SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
var jsforce = require('jsforce');
// const Mail = require('./Mail/Reviews');
// TIME FUNCTIONS
// ==============================================================
// SORTING DATES
// Sorting Functiojn takes in array of dates and returns the dates sorted from oldest to newest
let dateSorting = arr => {
	if (Array.isArray(arr)) {
		return arr.sort((a, b) => new Moment(a).format('YYYYMMDD') - new Moment(b).format('YYYYMMDD'));
	} else {
		return 'Input is Not Array';
	}
};
// For Moment Functions some take in nothing and return formatted date. Time is a number to be added or subtracted. Day is the day of the week 0 is previous sunday and 7 is next sunday
let today = () => Moment().format(ll);
let saturday = () =>
	Moment()
		.day(-1)
		.format(ll);
let sunday = () =>
	Moment()
		.day(0)
		.format(ll);
let customAdd = time =>
	typeof time === 'number'
		? Moment()
				.add(time, 'days')
				.format(ll)
		: 'Input is Not Number';
let customSub = time =>
	typeof time === 'number'
		? Moment()
				.subtract(time, 'days')
				.format(ll)
		: 'Input is Not Number';
let customIso = day =>
	typeof time === 'number'
		? Moment()
				.isoWeekday(day)
				.format(ll)
		: 'Input is Not Number';

// ==============================================================
// Custom Hash
let cHash = str => {
	try {
		return cryptr.encrypt(str);
	} catch (e) {
		return null;
	}
};
let cUnHash = hash => {
	try {
		return cryptr.decrypt(hash);
	} catch (e) {
		return null;
	}
};
let randomString = length =>
	Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
		.toString(36)
		.slice(1);
// ==============================================================
// ANALYTICS
// For Initial Format functions take in insight specific number/string
// For New inputs functions take in insight specific number/string, location and original JSON, rec for Record
let checklist = () => {
	return { list: [{ item: 'GMB Access', active: true }] };
};
let calls = calls => {
	if (typeof calls === 'number' || typeof calls === 'string') {
		return { calls: [{ calls, date: today() }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newCalls = (calls, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.calls.length >= loc) {
			rec.calls[loc - 1].push({ calls, date: today() });
			return rec;
		} else {
			rec.calls.push([{ calls, date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let website = website => {
	if (typeof website === 'number' || typeof website === 'string') {
		return { website: [{ website, date: today() }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newWebsite = (website, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.website.length >= loc) {
			rec.website[loc - 1].push({ website, date: today() });
			return rec;
		} else {
			rec.website.push([{ website, date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let direction = direction => {
	if (typeof direction === 'number' || typeof direction === 'string') {
		return { direction: [{ direction, date: today() }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newDirection = (direction, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.direction.length >= loc) {
			rec.direction[loc - 1].push({ direction, date: today() });
			return rec;
		} else {
			rec.direction.push([{ direction, date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let messages = messages => {
	if (typeof messages === 'number' || typeof messages === 'string') {
		return { messages: [{ messages, date: today() }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newMessages = (messages, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.messages.length >= loc) {
			rec.messages[loc - 1].push({ messages, date: today() });
			return rec;
		} else {
			rec.messages.push([{ messages, date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let searches = searches => {
	if (typeof searches === 'object') {
		searches.date = today();
		return { searches: [searches] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newSearches = (search, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number' && typeof search === 'object') {
		searches.date = today();
		if (rec.searches.length >= loc) {
			rec.searches[loc - 1].push(search);
			return rec;
		} else {
			rec.searches.push([{ search }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let reviews = (reviews, rating) => {
	if (typeof reviews === 'number' || typeof reviews === 'string') {
		return { reviews: [{ totalReviews: reviews, newReviews: 0, rating, date: today(), llrating: '5', status: 'NEW' }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newReviews = (reviews, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.reviews.length >= loc) {
			let last = rec.reviews[loc - 1][rec.reviews[loc - 1].length - 1].totalReviews;
			rec.reviews[loc - 1].push({ totalReviews: reviews, newReviews: reviews - last, date: today() });
			return rec;
		} else {
			rec.reviews.push([{ reviews, date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
let ranking = ranking => {
	if (Array.isArray(ranking)) {
		return { ranking: [{ ranking: [...ranking], date: today() }] };
	} else {
		return 'Not Valid Data Type';
	}
};
let newRanking = (ranking, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number' && Array.isArray(ranking)) {
		if (rec.ranking.length >= loc) {
			rec.ranking[loc - 1].push({ ranking: [...ranking], date: today() });
			return rec;
		} else {
			rec.ranking.push([{ ranking: [...ranking], date: today() }]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record or Ranking Array';
	}
};
let rank_key = key => {
	if (Array.isArray(key)) {
		return { rank_key: [...key] };
	} else {
		return 'Key Is Wrong Data Type';
	}
};
let newRank_key = (key, loc, rec) => {
	if (typeof rec === 'object' && typeof loc === 'number') {
		if (rec.rank_key.length >= loc) {
			key.map(key => {
				rec.rank_key[loc - 1].push(key);
				return rec;
			});
			return rec;
		} else {
			rec.rank_key.push([...key]);
			return rec;
		}
	} else {
		return 'wrong DataType for Loc or Record';
	}
};
// ==============================================================
// REPORTS
let review_links = arr => {
	return { links: arr };
};
let feedback_alert = (type, email) => {
	return { alert: [{ type, to: email }] };
};
let depleated_list = () => {};
let performance_report = (freq, email) => {
	// {"who":[],"frequency":90}
	return { frequency: freq, who: [email] };
};
let reportHistory = () => {
	return { report: [] };
};
// ==============================================================
// DEFAULTS
let reviewEmail = email => {
	let { standard, first, opened, positive } = email;
	if (typeof email === 'object') {
		let obj = {
			Standard: {
				subject: standard.subject,
				Body: { body: standard.body.body, thanks: standard.body.thanks, question: standard.body.question },
			},
			First: { subject: first.subject, Body: { body: first.body.body, thanks: first.body.thanks, question: first.body.question } },
			Opened: { subject: opened.subject, Body: { body: opened.body.body, thanks: opened.body.thanks, question: opened.body.question } },
			Positive: {
				subject: positive.subject,
				Body: { body: positive.body.body, thanks: positive.body.thanks, question: positive.body.question },
			},
		};
		return obj;
	} else {
		return 'Wrong DataType for Review Emails Default';
	}
};
let leadEmail = lead => {
	if (typeof lead === 'object') {
		let { email_1, email_2, email_3, email_4, email_5, email_6 } = lead;
		let obj = { email_1, email_2, email_3, email_4, email_5, email_6 };
		return obj;
	}
};
let winEmail = win => {
	if (typeof win === 'object') {
		let { email_1, email_2, email_3, email_4, email_5, email_6 } = win;
		let obj = { email_1, email_2, email_3, email_4, email_5, email_6 };
		return obj;
	}
};
let crossEmail = cross => {
	if (typeof cross === 'object') {
		let { email_1, email_2, email_3, email_4, email_5, email_6 } = cross;
		let obj = { email_1, email_2, email_3, email_4, email_5, email_6 };
		return obj;
	}
};
let refEmail = ref => {
	if (typeof ref === 'object') {
		let { email_1, email_2, email_3, email_4, email_5, email_6 } = ref;
		let obj = { email_1, email_2, email_3, email_4, email_5, email_6 };
		return obj;
	}
};
let addon = {
	leadgen: {
		email_1: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_2: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_3: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_4: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_5: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_6: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
	},
	winback: {
		email_1: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_2: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_3: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_4: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_5: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_6: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
	},
	referral: {
		email_1: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_2: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_3: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_4: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_5: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_6: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
	},
	cross: {
		email_1: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_2: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_3: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_4: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
		email_5: {
			subject: 'New Proposal',
			body:
				"Hi, <br/> We hope you're doing well! Insurance prices are always changing and we can help you save with an updated policy quote. It's our mission to make sure you're safe, protected and fully covered, all at the best price. We'd love to run a new proposal for you. <br/> Click the button below for your complimentary consultation:",
		},
		email_6: {
			subject: 'Time to Update Your Policy ',
			body:
				"Hi, <br/> Did you know you can save money by bundling your insurance? Having more than one policy with us can help you save money on your monthly premium. We'd love to take a look at your current policy and see if there's an opportunity to bundle your insurance needs. We can't wait to help you save time and money! <br/> Click the button below for your complimentary consultation:",
		},
	},
};
let activeProd = (r, c, ref, w, l) => {
	return {
		reviews: r,
		cross_sell: c,
		referral: ref,
		winback: w,
		leadgen: l,
	};
};
let review = {
	Standard: { subject: 'Please Give Us A Review', Body: { body: 'Please For the love of pete give us a review', thanks: 'Thank You!' } },
	First: { subject: 'Please Give Us A Review', Body: { body: 'Please For the love of pete give us a review', thanks: 'Thank You!' } },
	Opened: { subject: 'Please Give Us A Review', Body: { body: 'Please For the love of pete give us a review', thanks: 'Thank You!' } },
	Positive: { subject: 'Please Give Us A Review', Body: { body: 'Please For the love of pete give us a review', thanks: 'Thank You!' } },
};
let review_landing = {
	positive: { thanks: 'Thanks For Leaving Good Rating ', body: 'GO TO GOOGLE' },
	passive: { thanks: 'You Suck', body: 'Comeon, you couldve rated us better' },
	demoter: { thanks: 'Okay Mr. Bronze', body: "Bruh, You blow butt. We're awesome and you suck" },
};
let addon_landing = {
	leadgen: { thanks: 'Thats Right. you Want this', body: 'Come On BOII' },
	winbacks: { thanks: 'Thats Right. you Want this', body: 'Come On BOII' },
	referral: { thanks: 'Thats Right. you Want this', body: 'Come On BOII' },
	cross_sell: { thanks: 'Thats Right. you Want this', body: 'Come On BOII' },
};
let settings = {
	auto_amt: 1,
	email_format: {
		auto_amt: 1,
		email_format: { s: 112, fr: 112, pr: 112, or: 112 },
		process: 1,
		repeat: 360,
		first: 2,
		open: 2,
		positive: 1,
		logo: 'https://res.cloudinary.com/lift-local/image/upload/v1567611441/xmohqlp6gqrrg2kghs1q.png',
		color: 'c4040c',
		frequency: 30,
		from_email: 'no-reply@liftlocal.com',
	},
	process: 1,
	repeat: 180,
	first: 2,
	open: 2,
	positive: 1,
	logo: '',
	color: '',
	// Report Settings
	frequency: 30,
	from_email: 'no-reply@liftlocal.com',
};

// ==============================================================
// SETTINGS
let auto_amt = amt => {
	if (typeof amt === 'number') {
		return { amt };
	} else {
		return 'Wrong Data Type for Auto_amt default. Expected Type number';
	}
};
let depleated = async e => {
	try {
		let email = [
			{
				to: e.c_api.salesforce.accountManager.email ? e.c_api.salesforce.accountManager.email : 'Ebakker@liftlocal.com',
				from: 'rhutchison@liftlocal.com',
				subject: `${e.owner_name.first} @ ${e.company_name} Has Run Out Of Names`,
				html: `
				Hi, this is a friendly note to let you know that all your feedback requests have been sent.
				
				Please visit your Customer Dashboard and add some more customers so you can continue getting additional feedback and reviews!
				
				==> <a href='https://ll.liftlocal.com/client-dash/${e.cor_id}/upload/${e.c_id}'>Visit Your Customer Dashboard</a>
				`,
			},
		];
		await Err.emailMsg(email, 'Defaults/Depleated');
		if (e.c_api.salesforce) {
			var conn = new jsforce.Connection();
			conn
				.login(SF_USERNAME, SF_PASSWORD + SF_SECURITY_TOKEN, function(err, userInfo) {})
				.then(res => {
					console.log(res.id ? 'SF Logged In' : 'SF Error');
				});
			await conn.sobject('Account').update(
				{
					Id: e.c_api.salesforce.sf_id,
					Need_Reviews_List__c: true,
				},
				function(err, ret) {
					if (err || !ret.success) {
						return console.error(err, ret);
					}
				},
			);
		}
	} catch (error) {
		Err.emailMsg(error, 'defaults/depleated');
		console.log('ERROR defaults/depleated', error);
	}
};
let custCount = async (req, og) => {
	try {
		let db = req.app.get('db');
		let date = Moment().format('YYYY-MM-DD');
		// GET CUSTOMERS TOTAL
		// GET ALL WITH NO FEEDBACK
		let lastSend = Moment()
			.subtract(og.repeat_request.repeat, 'days')
			.format('YYYY-MM-DD');
		let total = await db.info.customers.count_comp_total([og.c_id, lastSend]);
		let remaining = await db.info.customers.cust_activity([og.c_id]);
		remaining = remaining.filter(
			e => Moment(e.last_sent).format('x') <= Moment(lastSend).format('x') || e.activity.active[e.activity.active.length - 1].type === 'Customer added',
		).length;
		og.customers.reviews.push({
			size: total[0].total,
			remaining: remaining,
			date,
			percent: (remaining / total[0].total).toFixed(2) * 100,
		});
		await db.update.record.customers_reviews([og.c_id, og.customers]);
		return og.customers;
	} catch (error) {
		Err.emailMsg(error, 'defaults/custCount');
		console.log('ERROR defaults/custCount', error);
	}
};
let setting_auto_amt = (cns, sum, e) => {
	try {
		cns = parseInt(cns);
		switch (true) {
			case cns === 0:
				depleated(e);
				return 'NA';
			case cns <= 50:
				if (cns <= 20 && cns >= 1) {
					return 1;
				} else {
					return 2;
				}
			case sum === 0:
				if (cns <= 100) {
					return 2;
				} else if (cns <= 450) {
					return Math.ceil(cns * 0.02) >= 10 ? 5 : Math.ceil(cns * 0.025);
				} else {
					return Math.ceil(cns * 0.03) >= 15 ? 10 : Math.ceil(cns * 0.03);
				}
			case sum === 1:
				if (cns <= 100) {
					return 2;
				} else if (cns <= 450) {
					return Math.ceil(cns * 0.02) >= 10 ? 5 : Math.ceil(cns * 0.025);
				} else {
					return Math.ceil(cns * 0.03) >= 15 ? 10 : Math.ceil(cns * 0.03);
				}

			case sum >= 2 && sum <= 5:
				if (cns <= 250) {
					return 2;
				} else if (cns <= 500) {
					return 3;
				} else {
					return Math.ceil(cns * 0.02) >= 7 ? 5 : Math.ceil(cns * 0.02);
				}
			case sum >= 6:
				return 2;

			default:
				Err.emailMsg(error, 'defaults/setting_auto_amt');
				console.log('ERROR defaults/setting_auto_amt', `Error with ${e.c_id} - ${e.owner_name.first}`);
				return 'NA';
		}
	} catch (error) {
		Err.emailMsg(error, 'defaults/setting_auto_amt');
		console.log('ERROR defaults/setting_auto_amt', error);
	}
};
let newAuto_amt = (amt, loc, rec) => {
	if (typeof amt === 'number') {
		rec.amt.splice(loc - 1, 1, amt);
	} else {
		return 'Wrong Data Type for New Auto Amt Default. Expected Type Number';
	}
};
let email_format = format => {
	if (typeof format === 'number') {
		return { s: format, fr: format, pr: format, or: format };
	} else {
		return 'Wrong Data Type for Format default. Expected Type number';
	}
};
let newEmail_format = (format, loc, rec) => {
	if (typeof format === 'number') {
		rec.format.splice(loc - 1, 1, format);
	} else {
		return 'Wrong Data Type for New Format Default. Expected Type Number';
	}
};
let request_process = process => {
	if (typeof process === 'number') {
		return { process: [process] };
	} else {
		return 'Wrong Data Type for Process default. Expected Type number' + process;
	}
};
let newRequest_process = (process, loc, rec) => {
	if (typeof process === 'number') {
		rec.process.splice(loc - 1, 1, process);
	} else {
		return 'Wrong Data Type for New Process Default. Expected Type Number';
	}
};
let repeat_request = (r, f, o, p, sr, spr) => {
	if (typeof r === 'number') {
		return { repeat: r, first: f, open: o, positive: p, second: sr, s_positive: spr };
	} else {
		return 'Wrong Data Type for Repeat Request default. Expected Type number';
	}
};
let newRepeat_request = (repeat, loc, rec) => {
	if (typeof repeat === 'number') {
		rec.repeat.splice(loc - 1, 1, repeat);
	} else {
		return 'Wrong Data Type for New Repeat Request Default. Expected Type Number';
	}
};
let first_reminder = first => {
	if (typeof first === 'number') {
		return { first: [first] };
	} else {
		return 'Wrong Data Type for First Reminder default. Expected Type number';
	}
};
let newFirst_reminder = (first, loc, rec) => {
	if (typeof first === 'number') {
		rec.first.splice(loc - 1, 1, first);
	} else {
		return 'Wrong Data Type for New First Reminder Default. Expected Type Number';
	}
};
let open_reminder = open => {
	if (typeof open === 'number') {
		return { open: [open] };
	} else {
		return 'Wrong Data Type for Open Reminder default. Expected Type number';
	}
};
let newOpen_reminder = (open, loc, rec) => {
	if (typeof open === 'number') {
		rec.open.splice(loc - 1, 1, open);
	} else {
		return 'Wrong Data Type for New Open Reminder Default. Expected Type Number';
	}
};
let positive_reminder = positive => {
	if (typeof positive === 'number') {
		return { positive: [positive] };
	} else {
		return 'Wrong Data Type for Positive Reminder default. Expected Type number';
	}
};
let newPositive_reminder = (positive, loc, rec) => {
	if (typeof positive === 'number') {
		rec.positive.splice(loc - 1, 1, positive);
	} else {
		return 'Wrong Data Type for New Positive Default. Expected Type Number';
	}
};
let logo = logo => {
	if (typeof logo === 'string') {
		return { logo: [logo] };
	} else {
		return 'Wrong Data Type for Logo default. Expected Type String';
	}
};
let newLogo = (logo, loc, rec) => {
	if (typeof logo === 'string') {
		rec.logo.splice(loc - 1, 1, logo);
	} else {
		return 'Wrong Data Type for New Logo Default. Expected Type String';
	}
};
let accent_color = color => {
	if (typeof color === 'string') {
		return { color: [color] };
	} else {
		return 'Wrong Data Type for Accent Color default. Expected Type String';
	}
};
let newAccent_color = (color, loc, rec) => {
	if (typeof color === 'string') {
		rec.color.splice(loc - 1, 1, color);
	} else {
		return 'Wrong Data Type for New Auto Amt Default. Expected Type String';
	}
};

// let direction = (direction) => {
//     if (typeof direction === 'number' || typeof direction === 'string') {
//         return {
//             direction: [[{ direction, date: today() }]]
//         }
//     } else { return 'Not Valid Data Type' }
// };
// let newDirection = (direction, loc, rec) => {
//     if (typeof rec === 'object' && typeof loc === 'number') {
//         if (rec.direction.length >= loc) {
//             rec.direction[loc - 1].push({ direction, date: today() })
//             return rec
//         } else {
//             rec.direction.push([{ direction, date: today() }])
//             return rec
//         }
//     } else {
//         return 'wrong DataType for Loc or Record'
//     }
// };

// ==============================================================
// COMPANY
let name = (first, last) => {
	return { first, last };
};
let address = (street, city, zip, state) => {
	return { street, city, zip, state };
};
let phone = num => {
	return { phone: [num] };
};
let email = e => {
	return { email: [e] };
};

// ==============================================================
// REVIEWEMAIL
let standardBody = body => {
	return { s: body };
};
let firstBody = body => {
	return { fr: body };
};
let openBody = body => {
	return { or: body };
};
let positiveBody = body => {
	return { pr: body };
};
let secondReminder = body => {
	return { sr: body };
};
let secondPositiveReminder = body => {
	return { spr: body };
};

// ==============================================================
// ADDONEMAIL

// ==============================================================
// CUSTOMER
let activity = () => {
	return { active: [{ type: 'Customer Added', date: today() }] };
};

// ==============================================================
// RESULTS

// ==============================================================
// FEEDBACK

// ==============================================================
// LOGIN
let password = (lastname, zip) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(lastname + zip, salt);
	return hash;
};
let newPass = pass => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(pass, salt);
	return hash;
};
let cusHash = pass => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(pass, salt);
	return hash;
};
let mPassword = zip => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(zip, salt);
	return hash;
};
// ==============================================================
// ==============================================================
// SECURITY
let sessionCheck = async req => {
	let db = req.app.get('db');
	if (req.session.user || DEV === 'true') {
		if (DEV === 'true') {
			let info = await db.info.all_business([]);
			let industry = await db.info.industries([]);
			req.session.user = {
				user: true,
				email: 'password',
				userName: 'userName',
				permissions: 'admin',
				info,
				industry,
			};
		}
		return true;
	} else {
		return false;
	}
};

let indust = client => {
	let indust =
		client === 100390
			? 'Unassigned'
			: client === 100391
			? 'Allstate'
			: client === 100392
			? 'Farmers'
			: client === 100393
			? 'Leavitt'
			: client === 114047
			? 'Progressive'
			: client === 115967
			? 'Nationwide'
			: client === 124118
			? 'SIAAZ'
			: client === 116467
			? 'Watson'
			: 'NA';
	return indust;
};
let accountManager = oid => {
	// console.log(oid);
	if (oid === '0056A000002o98TQAQ') {
		return { name: 'Bradley Riley', email: 'briley@liftlocal.com' };
	} else if (oid === '0056A000002W45BQAS') {
		return { name: 'Chris White', email: 'cwhite@liftlocal.com' };
	} else if (oid === '0056A000002W45GQAS') {
		return { name: 'Dylan Bakker', email: 'dbakker@liftlocal.com' };
	} else if (oid === '0053s0000034S2ZAAU') {
		return { name: 'Dylan Payne', email: 'dpayne@liftlocal.com' };
	} else if (oid === '0053s000002lRoyAAE') {
		return { name: 'Kodi Porter', email: 'kporter@liftlocal.com' };
	} else {
		return { name: 'Ryan H', email: 'rhutchison@liftlocal.com' };
	}
};
// Exports
module.exports = {
	custCount,
	depleated,
	accountManager,
	setting_auto_amt,
	indust,
	sessionCheck,
	// Time
	dateSorting,
	today,
	saturday,
	sunday,
	customAdd,
	customSub,
	customIso,
	password,
	// Customers
	activity,
	// Company
	name,
	address,
	phone,
	email,
	// Analytics
	calls,
	website,
	direction,
	messages,
	searches,
	reviews,
	ranking,
	rank_key,
	checklist,
	newCalls,
	newWebsite,
	newDirection,
	newMessages,
	newSearches,
	newReviews,
	newRanking,
	newRank_key,
	// Review Email
	standardBody,
	firstBody,
	openBody,
	positiveBody,
	secondReminder,
	secondPositiveReminder,
	// Reports
	review_links,
	feedback_alert,
	depleated_list,
	performance_report,
	reportHistory,
	// Defaults
	addon,
	review,
	review_landing,
	addon_landing,
	// Settings
	auto_amt,
	email_format,
	request_process,
	repeat_request,
	first_reminder,
	open_reminder,
	positive_reminder,
	logo,
	accent_color,
	newAuto_amt,
	newEmail_format,
	newRequest_process,
	newRepeat_request,
	newFirst_reminder,
	newOpen_reminder,
	newPositive_reminder,
	newLogo,
	newAccent_color,
	// Defaults
	reviewEmail,
	leadEmail,
	winEmail,
	crossEmail,
	refEmail,
	settings,
	activeProd,
	// CHASH
	cHash,
	cusHash,
	cUnHash,
	mPassword,
	randomString,
	newPass,
};
