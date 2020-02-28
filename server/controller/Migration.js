const axios = require('axios');
const Default = require('./Defaults');
const { GOOGLE_PLACE_API, SF_SECRET, SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
let moment = require('moment');
var jsforce = require('jsforce');
let security_token = 'DMXDYS2AL7GXEoG9E4cmudsTy';
let oAuth = new jsforce.OAuth2({
	// you can change loginUrl to connect to sandbox or prerelease env.
	// loginUrl: 'https://liftlocal.my.salesforce.com/',
	clientId: '3MVG9CEn_O3jvv0yDRMxBSY7MuDi0eZL0fIvVf9jf_LXSNv2WPsW2gvQ.7qhFr7ZTx_kzCPr1p73iKP_MQwLh',
	clientSecret: SF_SECRET,
	redirectUri: 'https://3f2d7a71.ngrok.io/api/salesforce/test',
});
module.exports = {
	getAgents: async (req, res) => {
		console.log('Starting');
		let db = req.app.get('db');
		await axios.get('http://localhost:4000/api/migrate').then(res => {
			let { aData } = res.data;
			if (Array.isArray(aData)) {
				aData
					.filter(e => e.name)
					// .slice( 0, 50 )
					.forEach(async e => {
						let { multiple_loc, a_id, active } = e;

						// await module.exports.createRows(e, db);
						// if (a_id !== null) {
						// 	await axios.get(`http://localhost:4000/api/migrate/multi/${a_id}`).then(res => {
						// 		if (res.data.msg === 'GOOD') {
						// 			res.data.mData.forEach(async (e, i) => {
						// 				// Get Corp and use for corp_id
						// 				if (!e.lactive) {
						// 					let corp = await db.migrate.get_corp([e.a_id]);
						// 					if (corp[0]) {
						// 						module.exports.secondRows(e, db, corp[0]);
						// 					} else {
						// 						module.exports.createRows(e, db);
						// 					}
						// 				}
						// 			});
						// 		} else {
						// 			console.log(res.data.msg);
						// 		}
						// 	});
						// }
						// CREATE COMPANY
						// NEEDS
						// Owner Name
						// Email
						// GEO
					});
			}
			// console.log(res.data.msg);
			// console.log(res.data.aData[0]);
		});
		res.status(200).send({ msg: 'GOOD' });
	},
	createRows: async (e, db) => {
		// prettier-ignore
		let {a_id, agency, name, street_address, 
			city, zip_code, state, phone, timezone, active, 
			feedbacks_recieved, auto_amt, customers_not_sent, email_logo, google_link, client
		} = e;
		console.log(a_id, name);
		let indust = await Default.indust(client);
		let defaults = await db.info.specific_default([indust]);
		if (!defaults[0]) {
			// Create Defaults
			let allD = await db.info.specific_default(['All']).catch(err => {
				console.log('ERROR:: specific_default', a_id, err);
				error = true;
			});
			allD = allD[0];
			defaults = await db.create
				.new_industry_default([
					indust,
					allD.email,
					allD.leadgen,
					allD.winback,
					allD.referral,
					allD.cross_sell,
					allD.settings,
					allD.review_landing,
					allD.addon_landing,
				])
				.catch(err => {
					console.log('ERROR:: new_industry_default', a_id, err);
					error = true;
				});
		}
		defaults = defaults[0];
		let company_name = name;
		let address = { street: street_address, city, zip: zip_code, state };
		phone = { phone: [phone] };
		let email = { email: ['No Current Email'] };
		let cor_email = 'No Current Email';
		let tz = timezone;
		let utc_offset = tz === 'EST' ? '-240' : tz === 'CST' ? '-300' : tz === 'MST' ? '-360' : tz === 'PST' ? '-420' : 'NA';
		let customers = {
			// GET TOTAL CUSTOMERS AND SPLICE
			reviews: [{ size: 0, remaining: customers_not_sent, date: '' }],
			cross_sell: [{ size: 0, remaining: 0, date: '' }],
			winback: [{ size: 0, remaining: 0, date: '' }],
			referral: [{ size: 0, remaining: 0, date: '' }],
			leadgen: [{ size: 0, remaining: 0, date: '' }],
		};
		let owner_name = { first: '', last: '' };
		let geo = { lat: '', lng: '' };
		let active_prod = { reviews: active, cross_sell: false, referral: false, winback: false, leadgen: false };
		let place_id = google_link !== null ? (google_link.includes('placeid') ? google_link.split('placeid=')[1] : 'N/A') : 'N/A';
		// CREATE CORPORATION
		const corpCheck = await db.info.get_single_corp([company_name]).catch(err => {
			console.log('ERROR:: corpCheck', a_id, err);
			error = true;
		});
		let corp;
		if (!corpCheck[0]) {
			corp = await db.create.m_corporation([indust, company_name, cor_email, a_id]).catch(err => {
				console.log('ERROR:: corporation', a_id, a_id, err);
				error = true;
			});
			corp = corp[0];
		} else {
			corp = corpCheck[0];
		}
		let company = await db.create.business([corp.cor_id, indust, company_name, owner_name, address, phone, email, utc_offset, geo, active_prod]).catch(err => {
			console.log('ERROR:: business', a_id, err);
			error = true;
		});
		let co_id = company[0].c_id;
		let hash = Default.mPassword(address.zip);
		await db.create.login([co_id, cor_email, company_name, hash, 'client']).catch(err => {
			console.log('ERROR:: password', a_id, err);
			error = true;
		});
		await db.create
			.m_analytics([
				co_id,
				Default.calls(0),
				Default.website(0),
				Default.direction(0),
				Default.messages(0),
				Default.searches({ direct: '', branded: '', discovery: '' }),
				Default.checklist(),
				Default.reviews(0, 0),
				{ rank: [] },
				Default.rank_key([0]),
				customers,
			])
			.catch(err => {
				console.log('ERROR:: analytics', a_id, err);
				error = true;
			});
		// Get From Defaults and add to report settings and Settings
		let from_email = (defaults.settings.from_email = 'owner' ? 'NO EMAIL' : defaults.settings.from_email);
		await db.create
			.report_setting([
				co_id,
				from_email,
				place_id,
				Default.performance_report(defaults.settings.frequency, 'NO EMAIL'),
				Default.feedback_alert('all', 'NO EMAIL'),
				Default.reportHistory(),
			])
			.catch(err => {
				console.log('ERROR:: report_setting', a_id, err);
				error = true;
			});
		await db.create
			.settings([
				co_id,
				Default.auto_amt(auto_amt ? auto_amt : 0),
				defaults.settings.email_format,
				1,
				Default.repeat_request(defaults.settings.repeat, defaults.settings.first, defaults.settings.open, defaults.settings.positive),
				email_logo ? email_logo : 'N/A',
				defaults.settings.color,
			])
			.catch(err => {
				console.log('ERROR:: settings', a_id, err);
				console.log(
					co_id,
					Default.auto_amt(auto_amt ? auto_amt : 0),
					defaults.settings.email_format,
					1,
					Default.repeat_request(defaults.settings.repeat, defaults.settings.first, defaults.settings.open, defaults.settings.positive),
					email_logo ? email_logo : 'N/A',
					defaults.settings.color,
				);
				error = true;
			});
		let email_1 = {};
		let email_2 = {};
		let email_3 = {};
		let email_4 = {};
		let email_5 = {};
		let email_6 = {};
		let { s, fr, or, pr } = defaults.email;
		let { positive, passive, demoter } = defaults.review_landing;
		await db.create
			.review_email([
				co_id,
				s.s_subject,
				Default.standardBody(s.s_body),
				fr.fr_subject,
				Default.firstBody(fr.fr_body),
				or.or_subject,
				Default.openBody(or.or_body),
				pr.pr_subject,
				Default.positiveBody(pr.pr_body),
				positive,
				passive,
				demoter,
			])
			.catch(err => {
				console.log('ERROR:: review_email', a_id, err);
				error = true;
			});
		email_1.cross = defaults.cross_sell.email_1;
		email_2.cross = defaults.cross_sell.email_2;
		email_3.cross = defaults.cross_sell.email_3;
		email_4.cross = defaults.cross_sell.email_4;
		email_5.cross = defaults.cross_sell.email_5;
		email_6.cross = defaults.cross_sell.email_6;
		email_1.leadgen = defaults.leadgen.email_1;
		email_2.leadgen = defaults.leadgen.email_2;
		email_3.leadgen = defaults.leadgen.email_3;
		email_4.leadgen = defaults.leadgen.email_4;
		email_5.leadgen = defaults.leadgen.email_5;
		email_6.leadgen = defaults.leadgen.email_6;
		email_1.winback = defaults.winback.email_1;
		email_2.winback = defaults.winback.email_2;
		email_3.winback = defaults.winback.email_3;
		email_4.winback = defaults.winback.email_4;
		email_5.winback = defaults.winback.email_5;
		email_6.winback = defaults.winback.email_6;
		email_1.referral = defaults.referral.email_1;
		email_2.referral = defaults.referral.email_2;
		email_3.referral = defaults.referral.email_3;
		email_4.referral = defaults.referral.email_4;
		email_5.referral = defaults.referral.email_5;
		email_6.referral = defaults.referral.email_6;
		await db.create.addon_email([co_id, email_1, email_2, email_3, email_4, email_5, email_6]).catch(err => {
			console.log('ERROR:: addon_email', a_id, err);
			error = true;
		});
	},
	secondRows: async (e, db, corp) => {
		// prettier-ignore
		let {a_id, agency, name, street_address, 
			city, zip_code, state, phone, timezone, active, 
			feedbacks_recieved, auto_amt, customers_not_sent, email_logo, google_link, client
		} = e;
		console.log(a_id, name);
		let indust = await Default.indust(client);
		let defaults = await db.info.specific_default([indust]);
		if (!defaults[0]) {
			// Create Defaults
			let allD = await db.info.specific_default(['All']).catch(err => {
				console.log('ERROR:: specific_default', a_id, err);
				error = true;
			});
			allD = allD[0];
			defaults = await db.create
				.new_industry_default([
					indust,
					allD.email,
					allD.leadgen,
					allD.winback,
					allD.referral,
					allD.cross_sell,
					allD.settings,
					allD.review_landing,
					allD.addon_landing,
				])
				.catch(err => {
					console.log('ERROR:: new_industry_default', a_id, err);
					error = true;
				});
		}
		defaults = defaults[0];
		let company_name = name;
		let address = { street: street_address, city, zip: zip_code, state };
		phone = { phone: [phone] };
		let email = { email: ['No Current Email'] };
		let cor_email = 'No Current Email';
		let tz = timezone;
		let utc_offset = tz === 'EST' ? '-240' : tz === 'CST' ? '-300' : tz === 'MST' ? '-360' : tz === 'PST' ? '-420' : 'NA';
		let customers = {
			// GET TOTAL CUSTOMERS AND SPLICE
			reviews: [{ size: 0, remaining: customers_not_sent, date: '' }],
			cross_sell: [{ size: 0, remaining: 0, date: '' }],
			winback: [{ size: 0, remaining: 0, date: '' }],
			referral: [{ size: 0, remaining: 0, date: '' }],
			leadgen: [{ size: 0, remaining: 0, date: '' }],
		};
		let owner_name = { first: '', last: '' };
		let geo = { lat: '', lng: '' };
		let active_prod = { reviews: active, cross_sell: false, referral: false, winback: false, leadgen: false };
		let place_id = google_link !== null ? (google_link.includes('placeid') ? google_link.split('placeid=')[1] : 'N/A') : 'N/A';
		// CREATE CORPORATION
		let company = await db.create.business([corp.cor_id, indust, company_name, owner_name, address, phone, email, utc_offset, geo, active_prod]).catch(err => {
			console.log('ERROR:: business', a_id, err);
			error = true;
		});
		let co_id = company[0].c_id;
		let hash = Default.mPassword(address.zip);
		await db.create.login([co_id, cor_email, company_name, hash, 'client']).catch(err => {
			console.log('ERROR:: password', a_id, err);
			error = true;
		});
		await db.create
			.m_analytics([
				co_id,
				Default.calls(0),
				Default.website(0),
				Default.direction(0),
				Default.messages(0),
				Default.searches({ direct: '', branded: '', discovery: '' }),
				Default.checklist(),
				Default.reviews(0, 0),
				{ rank: [] },
				Default.rank_key([0]),
				customers,
			])
			.catch(err => {
				console.log('ERROR:: analytics', a_id, err);
				error = true;
			});
		// Get From Defaults and add to report settings and Settings
		let from_email = (defaults.settings.from_email = 'owner' ? 'NO EMAIL' : defaults.settings.from_email);
		await db.create
			.report_setting([
				co_id,
				from_email,
				place_id,
				Default.performance_report(defaults.settings.frequency, 'NO EMAIL'),
				Default.feedback_alert('all', 'NO EMAIL'),
				Default.reportHistory(),
			])
			.catch(err => {
				console.log('ERROR:: report_setting', a_id, err);
				error = true;
			});
		await db.create
			.settings([
				co_id,
				Default.auto_amt(auto_amt ? auto_amt : 0),
				defaults.settings.email_format,
				1,
				Default.repeat_request(defaults.settings.repeat, defaults.settings.first, defaults.settings.open, defaults.settings.positive),
				email_logo ? email_logo : 'N/A',
				defaults.settings.color,
			])
			.catch(err => {
				console.log('ERROR:: settings', a_id, err);
				console.log(
					co_id,
					Default.auto_amt(auto_amt ? auto_amt : 0),
					defaults.settings.email_format,
					1,
					Default.repeat_request(defaults.settings.repeat, defaults.settings.first, defaults.settings.open, defaults.settings.positive),
					email_logo ? email_logo : 'N/A',
					defaults.settings.color,
				);
				error = true;
			});
		let email_1 = {};
		let email_2 = {};
		let email_3 = {};
		let email_4 = {};
		let email_5 = {};
		let email_6 = {};
		let { s, fr, or, pr } = defaults.email;
		let { positive, passive, demoter } = defaults.review_landing;
		await db.create
			.review_email([
				co_id,
				s.s_subject,
				Default.standardBody(s.s_body),
				fr.fr_subject,
				Default.firstBody(fr.fr_body),
				or.or_subject,
				Default.openBody(or.or_body),
				pr.pr_subject,
				Default.positiveBody(pr.pr_body),
				positive,
				passive,
				demoter,
			])
			.catch(err => {
				console.log('ERROR:: review_email', a_id, err);
				error = true;
			});
		email_1.cross = defaults.cross_sell.email_1;
		email_2.cross = defaults.cross_sell.email_2;
		email_3.cross = defaults.cross_sell.email_3;
		email_4.cross = defaults.cross_sell.email_4;
		email_5.cross = defaults.cross_sell.email_5;
		email_6.cross = defaults.cross_sell.email_6;
		email_1.leadgen = defaults.leadgen.email_1;
		email_2.leadgen = defaults.leadgen.email_2;
		email_3.leadgen = defaults.leadgen.email_3;
		email_4.leadgen = defaults.leadgen.email_4;
		email_5.leadgen = defaults.leadgen.email_5;
		email_6.leadgen = defaults.leadgen.email_6;
		email_1.winback = defaults.winback.email_1;
		email_2.winback = defaults.winback.email_2;
		email_3.winback = defaults.winback.email_3;
		email_4.winback = defaults.winback.email_4;
		email_5.winback = defaults.winback.email_5;
		email_6.winback = defaults.winback.email_6;
		email_1.referral = defaults.referral.email_1;
		email_2.referral = defaults.referral.email_2;
		email_3.referral = defaults.referral.email_3;
		email_4.referral = defaults.referral.email_4;
		email_5.referral = defaults.referral.email_5;
		email_6.referral = defaults.referral.email_6;
		await db.create.addon_email([co_id, email_1, email_2, email_3, email_4, email_5, email_6]).catch(err => {
			console.log('ERROR:: addon_email', a_id, err);
			error = true;
		});
	},
	fixSettings: async (req, res) => {
		let db = req.app.get('db');
		await axios.get('http://localhost:4000/api/migrate').then(async res => {
			let { aData } = res.data;
			await aData.forEach(async e => {
				let set = await db.migrate.check_settings([e.a_id]);
				if (!set[0]) {
					console.log(e.a_id);
				}
			});
		});
	},
	checkNum: async (req, res) => {
		let db = req.app.get('db');
		let count = await db.migrate.all_agent([]);
		count.forEach((e, i) => {
			if (i !== 0) {
				if (e.agent_id - 1 !== count[i - 1].agent_id && e.agent_id - 2 === count[i - 2].agent_id) {
					console.log(e.agent_id, count[i].agent_id, '||||', e.agent_id - 1, count[i - 1].agent_id, '||||', e.agent_id - 2, count[i - 2].agent_id);
				}
			}
		});
	},
	reviews: async (req, res) => {
		try {
			console.log('STARTING');
			let db = req.app.get('db');
			let corporations = await db.migrate.corporations([]);
			let amt = 0;
			corporations.slice(1000, 3000).forEach(async e => {
				await axios
					.get(`http://localhost:4000/api/migrate/active/${e.agent_id}`)
					.then(async res => {
						if (res.data.msg === 'GOOD') {
							let active_prod = { reviews: res.data.active, cross_sell: false, referral: false, winback: false, leadgen: false };
							await db.update.active_prod([e.c_id, active_prod]);
						} else {
						}
					})
					.catch(e => console.log(e));
			});
			// .slice(0, 1500)
			// .slice(750, 1500)
			// {"reviews":[{"totalReviews":0,"newReviews":0,"rating":0,"date":"2019-10-28","llrating":"5","status":"NEW"}]}
			// .forEach(async e => {
			// 	await axios.get(`http://localhost:4000/api/migrate/reviews/${e.agent_id}`).then(async res => {
			// 		if (res.data.msg === 'GOOD') {
			// 			let { reviews } = res.data;
			// 			let review = { reviews: [] };
			// 			reviews.forEach(async el => {
			// 				let { sat, status, ratings, rating_info, date } = el;
			// 				status = status === null ? 'N/A' : status;
			// 				review.reviews.push({ totalReviews: 40, newReviews: ratings, rating: 4, date: sat, llrating: 4, status });
			// 				await db.record.review_history([e.c_id, sat, status, ratings, rating_info, date]).catch(err => console.log('Review History', err));
			// 			});
			// 			amt = amt + reviews.length;
			// 			// await db.record.anal_reviews([e.c_id, review]);
			// 			// console.log(e.c_id, review.reviews.length);
			// 			console.log(amt);
			// 		} else {
			// 			console.log('ERROR:::', res.data.msg);
			// 		}
			// 	});
			// });
			res.status(200).send({ msg: 'GOOD' });
		} catch (e) {
			console.log(e);
		}
	},
	customers: async (req, res) => {
		try {
			console.log('STARTING');
			let db = req.app.get('db');
			let corporations = await db.migrate.corporations([]);
			let amt = 0;
			corporations.slice(0, 1).forEach(async e => {
				await axios.get(`http://localhost:4000/api/migrate/customers/${e.agent_id}`).then(async res => {
					if (res.data.msg === 'GOOD') {
						let { customers } = res.data;
						customers
							// .slice( 0, 5 )
							.forEach(async cus => {
								let { first_name, last_name, email, phone, date_last_sent, date_added, status_info, rating } = cus;
								let activity = { active: [{ type: status_info, date: date_last_sent }] };
								let active = status_info === 'Unsubscribed' ? false : true;
								await db.migrate
									.indv_cust([e.c_id, first_name, last_name, email, phone, date_last_sent, activity, date_added, active, e.cor_id])
									.catch(err => console.log('ERROR::', err));
								// console.log(e.c_id, first_name, last_name, email, phone, date_last_sent, activity, date_added, active, e.cor_id);
							});
						// console.log(customers.length);
						amt = amt + customers.length;
						console.log(amt);
						// let total = customers.length;
						// e.customers.reviews[0].size = total;
						// await db.record.customers([e.c_id, e.customers]);
					} else {
						console.log(res.data.msg);
					}
				});
				// Get Customers
			});
			res.status(200).send({ msg: 'GOOD' });
		} catch (e) {
			console.log(e);
		}
	},
	updateCor: async (req, res) => {
		try {
			let { cor_id, og } = req.body;
			console.log('Recieved ', cor_id);
			let db = req.app.get('db').migrate;
			await db.update_cor([cor_id, og.c_id]);
			await db.update_cust_cor([cor_id, og.c_id]);
			res.status(200).send({ msg: 'GOOD', cor_id, og });
		} catch (e) {
			console.log(e);
			res.status(200).send({ msg: 'BAD', err: e });
		}
	},
	setLinks: async (req, res) => {
		try {
			let db = req.app.get('db');
			let agents = await db.migrate.all_place_id([]);
			agents.map(async e => {
				if (e.place_id && e.place_id !== 'N/A' && e.place_id !== 'NA') {
					let links = { links: [{ site: 'Google', link: `https://search.google.com/local/writereview?placeid=${e.place_id}` }] };
					await db.update.links([e.c_id, links]);
				} else {
					// console.log(e.c_id, e.company_name, e.place_id);
				}
			});
		} catch (e) {
			console.log(e);
		}
	},
	updateGatherupAPI: async (req, res) => {
		let { c_id, bus_id, client_id, check } = req.body;
		// console.log(c_id, bus_id, client_id, check);
		// check[0].c_api.gatherup.business_id = bus_id;
		// check[0].c_api.gatherup.client_id = client_id;
		check[0].c_api.llinternal = client_id;
		let key = check[0].c_api;
		await req.app.get('db').migrate.gatherup_api([c_id, key]);
		res.status(200).send({ msg: 'GOOD', check });
	},
	getCustomers: async (req, res) => {
		let { check } = req.body;
		let key = check[0].c_api.llinternal;
		let { c_id, cor_id } = check[0];
		console.log('HERE', key);
		await axios.get(`http://localhost:4000/api/migrate/customers/${key}`).then(res => {
			if (res.data.msg === 'GOOD') {
				let { customers } = res.data;
				console.log(customers.length);
				customers
					// .slice(0, 5) //HELLO PLEASE DONT DELETE
					.forEach(async cus => {
						let { first_name, last_name, email, phone, date_last_sent, date_added, status_info, rating, customer_id } = cus;
						// console.log(date_last_sent);
						let activity = { active: [{ type: status_info, date: date_last_sent }] };
						let active = status_info === null ? true : status_info.toLowerCase().includes('unsub') || status_info === 'Failed to send' ? false : true;
						let last_sent = sent => {
							if (sent === null) {
								return '2025-06-23';
							} else if (sent.toLowerCase().includes('unsub')) {
								return '2025-06-23';
							} else if (sent === null || sent === 'Customer added') {
								return '2005-05-25';
							} else {
								return moment().format('YYYY-MM-DD');
							}
						};
						phone = phone === 'N/A' ? null : phone;
						let cust = await req.app
							.get('db')
							.migrate.indv_cust([c_id, first_name, last_name, email, phone, last_sent(status_info), activity, date_added, active, cor_id, customer_id])
							.catch(err => console.log('ERROR::', err));
						// CREATE FEEDBACK
						if ((status_info !== null || status_info === 'Customer added') && active && cust[0]) {
							let emailStatus = info => {
								switch (info) {
									case '1st reminder sent':
										return 'First Review Reminder';
									case 'Click to review site':
										return 'Done';
									case 'Review received':
										return 'Done';
									case 'Rating received':
										return 'Positive Reminder';
									case 'Request sent':
										return 'First Send';
									case 'Opened - no feedback':
										return 'Open Reminder';
									case '2nd reminder sent':
										return 'Second Reminder';
									case 'Feedback received':
										return 'Feedback';
									default:
										return 'NONE';
								}
							};
							let click = status_info === 'Click to review site' || status_info === 'Review received' ? true : false;
							let status = emailStatus(status_info);
							let history = rating !== null ? { rating: [rating] } : { rating: [] };
							// let email_status = status !== 'Second Reminder' && status !== 'First Send' ? 'open' : 'delivered';
							// FIX ABOVE
							// let updated = email_status === 'open' ? true : false;
							// await req.app.get('db').migrate.feedback([cust[0].cus_id, rating, click, email_status, status, history, updated]);
						} else {
							// console.log(status_info);
						}
					});
			} else {
				console.log(res.data.msg);
			}
		});
		res.status(200).send({ msg: 'GOOD' });
	},
	custCount: async (req, res) => {
		let { check } = req.body;
		let db = req.app.get('db');
		check = check[0];
		let date = moment().format('YYYY-MM-DD');
		// GET CUSTOMERS TOTAL
		// GET ALL WITH NO FEEDBACK
		let lastSend = moment()
			.subtract(check.repeat_request.repeat, 'days')
			.format('YYYY-MM-DD');
		console.log(lastSend);
		let total = await db.info.customers.count_comp_total([check.c_id, lastSend]);
		let remaining = await db.info.customers.cust_activity([check.c_id]);
		remaining = remaining.filter(
			e => Moment(e.last_sent).format('x') <= Moment(lastSend).format('x') || e.activity.active[e.activity.active.length - 1].type === 'Customer added',
		).length;
		check.customers.reviews.push({
			size: total[0].total,
			remaining: remaining,
			date,
			percent: (remaining / total[0].total).toFixed(2) * 100,
		});
		await db.update.record.customers_reviews([check.c_id, check.customers]);
		console.log('DONE');
		res.status(200).send({ msg: 'GOOD' });
	},
	recordFeedback: async (req, res) => {
		let { check } = req.body;
		let e = check[0];
		let db = req.app.get('db');
		let date = moment().format('YYYY-MM-DD');
		await axios
			.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${e.place_id}&key=${GOOGLE_PLACE_API}`)
			.then(async resp => {
				if (resp.status === 200) {
					if (resp.data.status === 'OK') {
						let { result } = resp.data;
						let lastReviews =
							e.reviews.reviews.length >= 5 ? e.reviews.reviews.slice(e.reviews.reviews.length - 5, e.reviews.reviews.length - 1) : e.reviews.reviews;
						let rating = result.rating;
						let newReviews = result.user_ratings_total;
						if (lastReviews[lastReviews.length - 1]) {
							let weekReview = newReviews - lastReviews[lastReviews.length - 1].totalReviews;
							let month = lastReviews.reduce((a, b) => ({ newReviews: parseInt(a.newReviews) + parseInt(b.newReviews) })).newReviews + weekReview;
							let status = month === 0 ? 'CRITICAL' : month === 1 ? 'URGENT' : month === 2 ? 'NEEDS ATTENTION' : month <= 5 ? 'GOOD' : 'SLOW';
							let llRating = await db.info.customers.feedback_avg(e.c_id);
							llRating = llRating[0].avg !== null ? parseFloat(llRating[0].avg).toFixed(2) : 5;
							console.log(llRating);
							e.reviews.reviews.push({ totalReviews: newReviews, newReviews: weekReview, rating, date, status, llrating: llRating });
							let sorted = e.customers.reviews.sort((a, b) => (a.date > b.date ? 1 : -1));
							let cns = sorted[sorted.length - 1].remaining;
							let auto = await Default.setting_auto_amt(cns, month, e);
							if (auto !== 'NA') {
								await db.update.record.auto_amt([e.c_id, { amt: auto }]);
							}
							// UPDATE REVIEW HISTORY
							await db.update.record.reviews([e.c_id, e.reviews]);
						}
					}
				}
			})
			.catch(e => console.log(e));
		res.status(200).send({ msg: 'GOOD' });
	},
	syncCustomers: async (req, res) => {
		let config = {
			headers: { Authorization: 'bearer ' + '28bca51fe655a945781a02985eab3a69' },
		};
		let bodyParams = {
			clientId: '17f025df2271f8b11e03ae7df50b202669ea932b',
			businessId: business_id,
			client: client,
			autoFeedback: amount.mode,
			autoSend: amount.amt,
		};
		await axios.post('https://app.gatherup.com/api/business/auto-feedback-requests', bodyParams, config);
	},
	SFLogin: (req, res) => {
		res.redirect(oAuth.getAuthorizationUrl({ scope: 'api id web refresh_token' }));
	},
	SFTest: async (req, res) => {
		var conn = new jsforce.Connection();
		await conn
			.login(SF_USERNAME, SF_PASSWORD + SF_SECURITY_TOKEN, function(err, userInfo) {
				if (err) {
					return console.error('This error is in the auth callback: ' + err);
				}
			})
			.then(res => {
				console.log(res);
			});
		res.status(200).send({ c: conn.limitInfo });
	},
	updateAPI: async (req, res) => {
		let { c_id, key } = req.body;
		console.log(c_id, key);
		await req.app.get('db').migrate.gatherup_api([c_id, key]);
		res.sendStatus(200);
	},
};
