const moment = require('moment');
const Default = require('./Defaults');
let { sessionCheck } = Default;
const Err = require('./Error');
const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_API_KEY, CLOUDINARY_SECRET, CLOUDINARY_NAME } = process.env;
cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_SECRET,
});
module.exports = {
	HomePageInfo: async (req, res, next) => {
		try {
			if (await sessionCheck(req)) {
				let db = req.app.get('db');
				let info = await db.info.all_business([]);
				let industry = await db.info.industries([]);
				if (req.session.user) {
					req.session.user.industry = industry;
					req.session.user.info = info;
				}
				if (info[0]) {
					res.status(200).send({ msg: 'GOOD', info, industry });
				} else {
					res.status(200).send({ msg: 'Broken' });
				}
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/HomePageInfo');
		}
	},
	CustomerInfo: async (req, res, next) => {
		try {
			if (await sessionCheck(req)) {
				let { id } = req.params;
				let info = await req.app.get('db').info.customers.corp_cust_all([id]);
				if (req.session.user) {
					req.session.user.focus_cust = info;
				}
				res.status(200).send({ info, msg: 'GOOD' });
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/CustomerInfo');
		}
	},
	custBusiness: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { id } = req.params;
				let info = await req.app.get('db').info.customers.corp_cust_all([id]);
				let bus = await req.app.get('db').info.new_business([id]);
				if (req.session.user) {
					req.session.user.info.push(bus[0]);
					req.session.user.focus_business = bus[0];
					req.session.user.focus_cust = info;
				}
				res.status(200).send({ info, bus, msg: 'GOOD' });
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/custBusiness');
		}
	},
	updateCustomer: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { firstName, lastName, email, phone, cust_id } = req.body;
				phone = phone === 'N/A' ? null : phone;
				let updated = await req.app.get('db').update.customer([firstName, lastName, email, phone, cust_id]);
				updated = updated[0];
				if (req.session.user.focus_cust) {
					req.session.user.focus_cust.map(cust => {
						if (cust.id === parseInt(cust_id)) {
							cust = updated;
						}
					});
				}
				res.status(200).send({ msg: 'GOOD', updated });
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/updateCustomer');
		}
	},
	DropInfo: async (req, res, next) => {
		try {
			res.status(200).send(stat);
		} catch (e) {
			Err.emailMsg(e, 'Info/DropInfo');
		}
	},
	Reviews: async (req, res) => {
		try {
			let { industry } = req.body;
			if (industry === '') {
			} else {
				//Send Different DB Query for specific industry
				// res.status(200).send()
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/Reviews');
		}
	},
	IndvReviews: async (req, res) => {
		try {
		} catch (e) {
			Err.emailMsg(e, 'Info/IndvReviews');
		}
	},
	Addon: async (req, res) => {
		try {
			let { type } = req.body;
			res.status(200).send({});
		} catch (e) {
			Err.emailMsg(e, 'Info/Addon');
		}
	},
	IndvAddon: async (req, res) => {
		try {
			let { type, client_id, range } = req.body;
			// res.status(200).send({ allTime, currentRange })
		} catch (e) {
			Err.emailMsg(e, 'Info/IndvAddon');
		}
	},
	SingleCustomer: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { cust_id } = req.params;
				let info = await req.app.get('db').info.customer([cust_id]);
				res.status(200).send(info);
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/SingleCustomer');
		}
	},
	FeedbackRecording: (req, res) => {
		try {
			let msg = {
				positive: {
					thanks: 'Thank You!',
					body:
						"We're glad you're happy with the service. Would you please recommend us on Google with a quick review and star rating through the link below? It would mean a lot to us!",
				},
				passive: {
					thanks: 'Thank You ',
					body:
						'Us here at James Dean Farmers appreciate your rating and want to hear more, please leave us some direct feedback or leave us a Review on Google',
				},
				demoter: {
					thanks: "We're Sorry...",
					body:
						'We appreciate your feedback and when it’s not outstanding, we want to follow up to see what we could have done better. We will reach out to address your feedback and situation. Please share any additional information directly with us that will help with our follow up with you:',
				},
				links: [
					{ site: 'Google', link: 'Google.com' },
					{ site: 'Facebook', link: 'facebook.com' },
				],
			};
			//{"thanks":"Thank you!", "body":"We're glad you're happy with the service. Would you please recommend us on Google with a quick review and star rating through the link below? It would mean a lot to us!"}
			res.status(200).send(msg);
		} catch (e) {
			Err.emailMsg(e, 'Info/FeedbackRecording');
		}
	},
	landingReviews: (req, res) => {
		try {
		} catch (e) {
			Err.emailMsg(e, 'Info/landingReviews');
		}
	},
	TypeDefaults: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { type } = req.params;
				let db = req.app.get('db');
				if (type !== 'NA') {
					let defaults = await db.info.industry_defaults([type]);
					if (req.session.user) {
						req.session.user.defaults = defaults[0];
					}
					if (defaults[0]) {
						res.status(200).send({ msg: 'GOOD', defaults: defaults[0] });
					} else {
						res.status(200).send({ msg: 'Bad' });
					}
				} else {
					let defaults = await db.info.industry_defaults(['all']);
					if (req.session.user) {
						req.session.user.defaults = defaults[0];
					}
					res.status(200).send({ msg: 'GOOD', defaults: defaults[0] });
				}
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/TypeDefaults');
		}
	},
	UpdateDefaults: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { type, addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback } = req.body;
				let db = req.app.get('db');
				await db.update.defaults([type, email, leadgen, winback, referral, cross_sell, settings, review_landing, addon_landing]);
				res.status(200).send({ msg: 'GOOD' });
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/UpdateDefaults');
		}
	},
	businessDetails: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { id } = req.params;
				let info = await req.app.get('db').info.specific_business([id]);
				if (info[0]) {
					if (req.session.user) {
						req.session.user.focus_business = info[0];
					}
					let send = 1;
					res.status(200).send({ msg: 'GOOD', info, send });
				} else {
					res.status(200).send({ msg: 'No Business Found' });
				}
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/businessDetails');
		}
	},
	updateBusinessDetails: async (req, res) => {
		try {
			let {
				NAState,
				UTC,
				businessName,
				city,
				country,
				lat,
				lng,
				cross_sell,
				leadgen,
				ownerFirst,
				ownerLast,
				email,
				phone,
				ref,
				reviews,
				street,
				winbacks,
				zip,
				og,
				loc,
				placeId,
				sf_id,
				business_id,
				client_id,
				am,
				agent_id,
			} = req.body.state;
			// console.log(req.body.state);
			let add = { street, state: NAState, city, zip };
			og.c_api.salesforce.sf_id = sf_id;
			og.c_api.salesforce.accountManager.name = am;
			og.c_api.gatherup.business_id = business_id;
			og.c_api.gatherup.client_id = client_id;
			og.c_api.internal = agent_id;
			og.company_name = businessName;
			og.address = add;
			og.phone = { phone: [phone] };
			og.email.email.splice(0, 1, email);
			og.active_prod = { reviews, cross_sell, referral: ref, winback: winbacks, leadgen };
			og.utc_offset = UTC;
			og.geo = { lat: parseInt(lat), lng: parseInt(lng) };
			og.place_id = placeId;
			let updated = await req.app
				.get('db')
				.update.business_details([
					og.c_id,
					og.company_name,
					{ first: ownerFirst, last: ownerLast },
					add,
					og.phone,
					og.email,
					og.active_prod,
					og.utc_offset,
					og.geo,
					og.c_api,
				])
				.catch(err => console.log('UPDATE COMPANY ERR::', err));
			let updatePlace = await req.app.get('db').update.place_id([og.c_id, og.place_id]);
			if (updated[0] && req.session.user && updatePlace[0]) {
				req.session.user.info.map((item, i) => {
					if (item.c_id === og.c_id) {
						req.session.user.info.splice(i, 1, og);
					}
				});
				res.status(200).send({ msg: 'GOOD', info: og });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/updateBusinessDetails');
		}
	},
	settings: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { id, loc } = req.params;
				let settings = await req.app.get('db').info.settings([id, loc]);
				if (settings[0]) {
					res.status(200).send({ msg: 'GOOD', settings });
				} else {
					res.status(200).send({ msg: 'Nothing Returned' });
				}
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/settings');
		}
	},
	updateSettings: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { fromEmail, og, client_id } = req.body;
				let { feedback_alert, performance_report } = og;
				await req.app.get('db').update.report_settings_alerts([fromEmail, feedback_alert, performance_report, client_id]);
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/updateSettings');
		}
	},
	insights: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { id, loc } = req.params;
				let info = await req.app.get('db').info.specific_business([id]);
				if (info[0]) {
					res.status(200).send({ msg: 'GOOD', info: info[0] });
				} else {
					res.status(200).send({ msg: 'Business Not Found' });
				}
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/insights');
		}
	},
	newInsights: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { calls, website, direction, messages, searches } = req.body.og;
				await req.app.get('db').update.insights([req.body.client_id, calls, website, direction, messages, searches]);
				res.sendStatus(200);
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/newInsights');
		}
	},
	updateChecklist: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { checklist, client_id } = req.body;
				await req.app.get('db').update.checklist([checklist, client_id]);
				res.status(200).send({ msg: 'GOOD', checklist });
			} else {
				res.status(200).send({ msg: 'NO SESSION' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/updateChecklist');
		}
	},
	updateLinks: async (req, res) => {
		try {
			if (await sessionCheck(req)) {
				let { client_id, review_links, og } = req.body;
				let links = await req.app.get('db').update.links([client_id, review_links]);
				if (links[0]) {
					req.session.user.info.map((item, i) => {
						if (item.c_id === og.c_id) {
							req.session.user.info.splice(i, 1, og);
						}
					});
					res.status(200).send({ msg: 'GOOD' });
				} else {
					res.status(200).send({ msg: 'ERROR' });
				}
			}
		} catch (e) {
			Err.emailMsg(e, 'Info/updateLinks');
		}
	},
	allSentStats: async (req, res) => {
		try {
			let { date } = req.params;
			let db = req.app.get('db').info.sent_stats;
			// Total Sent
			let sent = await db.sent(date);
			// Opened
			let opened = await db.opened(date);
			// Recieved
			let received = await db.feedback(date);
			// Clicked
			let clicked = await db.clicked(date);
			res.status(200).send({ msg: 'GOOD', stats: { sent: sent[0].count, opened: opened[0].count, received: received[0].count, clicked: clicked[0].count } });
		} catch (error) {
			Err.emailMsg(error, 'Info/updateLinks');
			res.status(200).send({ msg: `There has been an error \n ${error}` });
		}
	},
	getUploadedImages: async (req, res) => {
		try {
			let results = await cloudinary.search.max_results(500).execute();
			res.status(200).send({ msg: 'GOOD', res: results });
			// cloudinary.api.resources(function(error, result) {
			// 	console.log(result.rate_limit_allowed, result.rate_limit_remaining, result.rate_limit_reset_at);
			// });
		} catch (error) {
			Err.emailMsg(error, 'Info/getUploadedImages');
			res.status(200).send({ msg: `There has been an error \n ${error}` });
		}
	},
	companyLogo: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { client_id } = req.body;
			client_id = Default.cUnHash(client_id);
			let logo = await db.info.company_logo([client_id]);
			res.status(200).send({ msg: 'GOOD', logo });
		} catch (error) {
			Err.emailMsg(error, 'Info/getUploadedImages');
			res.status(200).send({ msg: `There has been an error \n ${error}` });
		}
	},
};
