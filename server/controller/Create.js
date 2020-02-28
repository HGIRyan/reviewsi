// Imports
const cloudinary = require('cloudinary').v2;
const Default = require('./Defaults');
const Moment = require('moment');
const faker = require('faker');
const { CLOUDINARY_API_KEY, CLOUDINARY_SECRET, CLOUDINARY_NAME, SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
var jsforce = require('jsforce');
cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_SECRET,
});
const ll = 'YYYY-MM-DD';
const Err = require('./Error');
const proper = str => {
	if (typeof str === 'string') {
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	} else {
		return str;
	}
};
module.exports = {
	addBusiness: async (req, res) => {
		try {
			let { info } = req.body;
			let db = req.app.get('db');
			let error = false;
			// Insert Into Company and Return Company_id
			let { industry, formData } = info;
			let { reviews, cross, referral, winback, leadgen } = info.service;
			let { calls, direction, searches, messages, website } = info.insights;
			if (industry && info.email && info.businessName) {
				if (formData.file) {
					await cloudinary.uploader.upload(formData.file, { width: 200 }, async (err, resp) => {
						if (err) {
							res.status(200).send({ msg: 'Error with Updating Logo' });
						} else {
							info.img = resp.secure_url;
						}
					});
				}
				let defaults = await db.info.specific_default([industry]);
				if (!defaults[0]) {
					// Create Defaults
					let allD = await db.info.specific_default(['All']).catch(err => {
						console.log('ERROR:: specific_default', err);
						error = true;
					});
					allD = allD[0];
					defaults = await db.create
						.new_industry_default([
							industry.replace(/\w\S*/g, function(txt) {
								return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							}),
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
							console.log('ERROR:: new_industry_default', err);
							error = true;
						});
				}
				defaults = defaults[0];
				let name = Default.name(info.firstName, info.lastName);
				let address = Default.address(info.street, info.city, info.zip, info.state);
				let phone = Default.phone(info.phone);
				let email = Default.email(info.email);
				const corpCheck = await db.info.get_single_corp([info.businessName.trim()]).catch(err => {
					console.log('ERROR:: corpCheck', err);
					error = true;
				});
				if (corpCheck[0]) {
					res.status(200).send({ msg: 'Company Already Exists' });
				} else {
					let corp = await db.create
						.corporation([
							industry.replace(/\w\S*/g, function(txt) {
								return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							}),
							info.businessName.trim(),
							info.email.trim(),
						])
						.catch(err => {
							console.log('ERROR:: corporation', err);
							error = true;
						});
					corp = corp[0];
					let company = await db.create
						.business([
							corp.cor_id,
							industry.replace(/\w\S*/g, function(txt) {
								return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							}),
							info.businessName.trim(),
							name,
							address,
							phone,
							email,
							info.timezone,
							info.geo,
							Default.activeProd(reviews, cross, referral, winback, leadgen),
						])
						.catch(err => {
							console.log('ERROR:: business', err);
							error = true;
						});
					let co_id = company[0].c_id;
					// Create Login
					let hash = Default.password(info.lastName, address.zip);
					await db.create.login([co_id, info.email, info.email, hash, 'client']).catch(err => {
						console.log('ERROR:: password', err);
						error = true;
					});
					// Create Analytics Row
					await db.create
						.analytics([
							co_id,
							Default.calls(calls),
							Default.website(website),
							Default.direction(direction),
							Default.messages(messages),
							Default.searches(searches),
							Default.checklist(),
							Default.reviews(info.reviews, info.rating),
							{ rank: [] },
							Default.rank_key(info.rankKey),
						])
						.catch(err => {
							console.log('ERROR:: analytics', err);
							error = true;
						});
					// Get From Defaults and add to report settings and Settings
					let from_email = (defaults.settings.from_email = 'owner' ? info.email : defaults.settings.from_email);
					await db.create
						.report_setting([
							co_id,
							from_email,
							info.placeId,
							Default.performance_report(defaults.settings.frequency, info.email),
							Default.feedback_alert('all', info.email),
							Default.reportHistory(),
							Default.review_links(info.links),
						])
						.catch(err => {
							console.log('ERROR:: report_setting', err);
							error = true;
						});
					await db.create
						.settings([
							co_id,
							Default.auto_amt(defaults.settings.auto_amt),
							defaults.settings.email_format,
							1,
							Default.repeat_request(
								defaults.settings.repeat,
								defaults.settings.first,
								defaults.settings.open,
								defaults.settings.positive,
								defaults.settings.second,
								defaults.settings.s_positive,
							),
							info.img,
							info.color,
						])
						.catch(err => {
							console.log('ERROR:: settings', err);
							error = true;
						});
					let email_1 = {};
					let email_2 = {};
					let email_3 = {};
					let email_4 = {};
					let email_5 = {};
					let email_6 = {};
					let { s, fr, or, pr, sr, spr } = defaults.email;
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
							Default.secondReminder(sr.sr_body),
							sr.sr_subject,
							spr.spr_subject,
							Default.secondPositiveReminder(spr.spr_body),
							positive,
							passive,
							demoter,
						])
						.catch(err => {
							console.log('ERROR:: review_email', err);
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
						console.log('ERROR:: addon_email', err);
						error = true;
					});
					if (!error) {
						let businessInfo = await db.info.new_business([co_id]).catch(err => {
							console.log('ERROR:: new_business', err);
							error = true;
						});
						businessInfo[0].c_id = co_id;
						if (businessInfo[0]) {
							businessInfo = businessInfo[0];
							if (Array.isArray(req.session.user.info)) {
								req.session.user.info.push(businessInfo);
							}
							res.status(200).send({ msg: 'GOOD', businessInfo });
						} else {
							res.status(200).send({ msg: 'Error in adding business' });
						}
					} else {
						res.status(200).send({ msg: 'Error in adding business' });
					}
				}
			} else {
				res.status(200).send({ msg: 'Did not submit industry or corp name or email or business name' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Create/createBusiness');
			res.status(200).send({ msg: `ERROR: ${e}` });
		}
	},
	addLocation: async (req, res) => {
		try {
			let { info, cor_id } = req.body;
			let db = req.app.get('db');
			let error = false;
			let bus = await db.info.specific_corp([cor_id]);
			if (bus[0]) {
				let { reviews, cross, referral, winback, leadgen } = info.service;
				let { calls, direction, searches, messages, website } = info.insights;
				// prettier-ignore
				let { industry, businessName, firstName, lastName, geo, timezone,
					street, city, zip, state, phone } = info;
				let name = Default.name(firstName, lastName);
				let address = Default.address(street, city, zip, state);
				phone = Default.phone(phone);
				let email = Default.email(info.email);
				// prettier-ignore
				let company = await db.create
					.business( [
						cor_id, industry, businessName.trim(), name, address,
						phone, email, timezone, geo, Default.activeProd( reviews, cross, referral, winback, leadgen ),
					])
					.catch(err => {
						console.log('ERROR:: business', err);
						error = true;
					});
				let co_id = company[0].c_id;
				let hash = Default.password(info.lastName, address.zip);
				let lEmail = info.email ? info.email : 'No Current Email';
				let user = firstName.toLowerCase().split('')[0] + lastName.toLowerCase();
				await db.create.login([co_id, lEmail, user, hash, 'client']).catch(err => {
					console.log('ERROR:: password', err);
					error = true;
				});
				await db.create
					.analytics([
						co_id,
						Default.calls(calls),
						Default.website(website),
						Default.direction(direction),
						Default.messages(messages),
						Default.searches(searches),
						Default.checklist(),
						Default.reviews(info.reviews, info.rating),
						{ rank: [] },
						Default.rank_key(info.rankKey),
					])
					.catch(err => {
						console.log('ERROR:: analytics', err);
						error = true;
					});
				let from_email = bus[0].from_email;
				await db.create
					.report_setting([
						co_id,
						from_email,
						info.placeId,
						bus[0].performance_report,
						bus[0].feedback_alert,
						Default.reportHistory(),
						Default.review_links(info.links),
					])
					.catch(err => {
						console.log('ERROR:: report_setting', err);
						error = true;
					});
				await db.create.settings([co_id, bus[0].auto_amt, bus[0].email_format, 1, bus[0].repeat_request, info.img, info.color]).catch(err => {
					console.log('ERROR:: settings', err);
					error = true;
				});
				await db.create
					.review_email([
						co_id,
						bus[0].s_subject,
						bus[0].s_body,
						bus[0].fr_subject,
						bus[0].fr_body,
						bus[0].or_subject,
						bus[0].or_body,
						bus[0].pr_subject,
						bus[0].pr_body,
						bus[0].sr_body,
						bus[0].sr_subject,
						bus[0].spr_subject,
						bus[0].spr_body,
						bus[0].positive_landing,
						bus[0].passive_landing,
						bus[0].demoter_landing,
					])
					.catch(err => {
						console.log('ERROR:: review_email', err);
						error = true;
					});

				await db.create.addon_email([co_id, bus[0].email_1, bus[0].email_2, bus[0].email_3, bus[0].email_4, bus[0].email_5, bus[0].email_6]).catch(err => {
					console.log('ERROR:: addon_email', err);
					error = true;
				});
				if (!error) {
					let businessInfo = await db.info.new_business([co_id]).catch(err => {
						console.log('ERROR:: new_business', err);
						error = true;
					});
					if (businessInfo[0]) {
						businessInfo = businessInfo[0];
						if (Array.isArray(req.session.user)) {
							req.session.user.info.push(businessInfo);
						}
						res.status(200).send({ msg: 'GOOD', businessInfo });
					} else {
						res.status(200).send({ msg: 'Error in adding business' });
					}
				} else {
					res.status(200).send({ msg: 'There was an Error in setting up a new location' });
				}
			} else {
				res.status(200).send({ msg: 'Bad Client ID' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Create/addLocation');
			res.status(200).send({ msg: `ERROR ${e}` });
		}
	},
	addLoop: async (req, res) => {
		try {
			let error = false;
			let db = req.app.get('db');
			let activity = await Default.activity();
			let lastSent = Default.customSub(360);
			for (let j = 90; j < 800; j++) {
				let Good = await db.check(j);
				if (Good[0]) {
					console.log(j);
					for (let i = 0; i < 50; i++) {
						let loc = 1;
						let firstName = faker.name.firstName;
						let lastName = faker.name.lastName;
						let email = faker.internet.email;
						let service = 'reviews';
						let client_id = j;
						await db.create.new_customer_e([client_id, firstName, lastName, email, service, lastSent, activity, loc]).catch(err => {
							console.log('ERROR:: NEW EMAIL', err);
							error = true;
						});
					}
				}
			}
		} catch (e) {
			Err.emailMsg(e, 'Create/addLoop');
			res.status(200).send({ msg: 'BAD' });
		}
	},
	addDefaults: async (req, res) => {
		try {
			let { industry } = req.params;
			let db = req.app.get('db');
			industry = 'Insurance';
			let { addon, review, review_landing, addon_landing, settings } = Default;
			await db.create.defaults([industry, review, addon.leadgen, addon.winback, addon.referral, addon.cross, settings, review_landing, addon_landing]);
			res.status(200).send({ msg: 'GOOD' });
		} catch (e) {
			Err.emailMsg(e, 'Create/addDefaults');
			res.status(200).send({ msg: 'BAD' });
		}
	},
	newCustomer: async (req, res) => {
		try {
			let error = false;
			let db = req.app.get('db');
			let { firstName, lastName, email, phone, checkPhone, checkEmail, service } = req.body.state;
			let { client_id, cor_id } = req.params;
			let activity = await Default.activity();
			let lastSent = Default.customSub(360 * 12);
			let cust;
			if (checkEmail && checkPhone) {
				cust = await db.create.new_customer([client_id, firstName, lastName, email, phone, service, lastSent, activity, cor_id]).catch(err => {
					console.log('ERROR:: New Customer Full', err);
					error = true;
				});
			} else if (checkEmail) {
				cust = await db.create.new_customer_e([client_id, firstName, lastName, email, service, lastSent, activity, cor_id]).catch(err => {
					console.log('ERROR:: New Customer Email', err);
					error = true;
				});
			} else if (checkPhone) {
				cust = await db.create.new_customer_p([client_id, firstName, lastName, phone, service, lastSent, activity, cor_id]);
			} else {
				('THERES AN ISSUE');
			}
			if (req.session.user.focus_cust) {
				if (parseInt(req.session.user.focus_cust[0].c_id) === parseInt(client_id)) {
					req.session.user.focus_cust.push(cust);
				}
			}
			res.status(200).send({ msg: 'GOOD', cust });
		} catch (e) {
			Err.emailMsg(e, 'Create/newCustomer');
			res.status(200).send({ msg: 'BAD' });
		}
	},
	addLogo: async (req, res) => {
		try {
			console.log('ADDDING LOGO');
			let { file } = req.body.formData;
			let { client_id, loc, logo, selectedAccent, accent_color, industry } = req.body;
			cloudinary.uploader.upload(file, { width: 200, use_filename: true, public_id: industry }, async (err, resp) => {
				if (err) {
					res.status(200).send({ msg: 'BAD', logo });
				} else {
					if (accent_color) {
						let link = resp.secure_url;
						logo = link;
						accent_color = selectedAccent;
						await req.app.get('db').update.logo_color([client_id, logo, accent_color]);
						if (req.session.user) {
							req.session.user.info.map(item => {
								if (item.c_id === parseInt(client_id)) {
									item.logo = logo;
								}
							});
						}

						res.status(200).send({ msg: 'GOOD', logo });
					} else {
						let link = resp.secure_url;
						res.status(200).send({ msg: 'GOOD', link });
					}
				}
			});
		} catch (e) {
			Err.emailMsg(e, 'Create/addLogo');
			res.status(200).send({ msg: 'BAD' });
		}
	},
	newLogoLink: async (req, res) => {
		try {
			let { formData, industry } = req.body;
			let { file } = formData;
			cloudinary.uploader.upload(file, { width: 200, use_filename: true, public_id: industry }, async (err, resp) => {
				if (err) {
					res.status(200).send({ msg: err });
				} else {
					let link = resp.secure_url;
					res.status(200).send({ msg: 'GOOD', link });
				}
			});
		} catch (e) {
			Err.emailMsg(e, 'Create/newLogoLink');
			res.status(200).send({ msg: `BAD ${e}` });
		}
	},
	newUser: async (req, res) => {
		try {
			let { userName, email, password, permissionLevel, cor_id } = req.body.state;
			cor_id = cor_id ? parseInt(cor_id) : 1;
			userName = userName.toLowerCase();
			let hash = Default.cusHash(password);
			await req.app.get('db').create.login([cor_id, email, userName, hash, permissionLevel]);
			res.status(200).send({ msg: 'GOOD' });
		} catch (e) {
			DEV ? console.log(e) : null;
			res.status(200).send({ msg: 'BAD', error: e });
		}
	},
	uploadCustomer: async (req, res) => {
		try {
			if (req.session.user) {
				let { og, data, corp, reset, uploadTo, service } = req.body;
				let db = req.app.get('db');
				let corpCust = await db.info.customers.corp_cust([og.cor_id, service]);
				if (reset) {
					let scrub =
						uploadTo !== 'all'
							? data.filter(({ email: id1 }) => !corpCust.some(({ email: id2 }) => id2.toLowerCase() === id1.toLowerCase() && id1.c_id === parseInt(uploadTo)))
							: corpCust.filter(({ email: id1 }) => !data.some(({ email: id2 }) => id2.toLowerCase() === id1.toLowerCase()));
					// scrub.forEach(async e => {
					// 	await db.update.delete_cust([e.c_id, e.cus_id, false]);
					// });
				}
				let uploadArr = async (arr, c_id, cor_id) => {
					let activity = await Default.activity();
					let lastSent = Default.customSub(360 * 12);
					arr.forEach(async e => {
						e.first_name = proper(e.first_name);
						e.last_name = proper(e.last_name);
						e.email = e.email ? proper(e.email) : '';
						e.phone = e.phone ? proper(e.phone) : '';
						e.phone && e.email
							? await db.create.new_customer([c_id, e.first_name, e.last_name, e.email, e.phone, service, activity, cor_id])
							: e.phone && !e.email
							? await db.create.new_customer_p([c_id, e.first_name, e.last_name, e.phone, service, lastSent, activity, cor_id])
							: !e.phone && e.email
							? await db.create.new_customer_e([c_id, e.first_name, e.last_name, e.email, service, lastSent, activity, cor_id])
							: '';
					});
				};
				let newCust = await data.filter(({ email: id1 }) => !corpCust.some(({ email: id2 }) => (id1 && id2 ? id2.toLowerCase() === id1.toLowerCase() : null)));
				// let newCust = data;
				if (newCust[0] && og.c_api.salesforce.sf_id) {
					var conn = new jsforce.Connection();
					await conn.login(SF_USERNAME, SF_PASSWORD + SF_SECURITY_TOKEN, function(err, userInfo) {}); //.then(re => console.log(re));
					await conn.sobject('Account').update(
						{
							Id: og.c_api.salesforce.sf_id,
							Need_Reviews_List__c: false,
						},
						function(err, ret) {
							if (err || !ret.success) {
								return console.error(err, ret);
							}
						},
					);
				}
				if (uploadTo !== 'all' && newCust[0] && req.session.user) {
					let comp = corp.filter(e => e.c_id === parseInt(uploadTo));
					await uploadArr(newCust, parseInt(uploadTo), parseInt(comp[0].cor_id));
					let newCorpCust = await db.info.customers.corp_cust([og.cor_id, service]);
					req.session.user.focus_cust = newCorpCust;
					await module.exports.custCount(req, corp);
					res.status(200).send({ msg: 'GOOD', list: `Uploaded ${newCust.length} new names to ${comp[0].company_name}`, cust: newCorpCust });
				} else if (newCust[0]) {
					let indvLength = Math.floor(newCust.length / corp.length);
					await corp.forEach((e, i) =>
						i !== corp.length - 1
							? uploadArr(newCust.slice(i * indvLength, i * indvLength + indvLength), e.c_id, e.cor_id)
							: uploadArr(newCust.slice(i * indvLength, newCust.length + 5), e.c_id, e.cor_id),
					);
					let newCorpCust = await db.info.customers.corp_cust([og.cor_id, service]);
					req.session.user.focus_cust = newCorpCust;
					await module.exports.custCount(req, corp);
					// prettier-ignore
					res.status( 200 ).send( {
						msg: 'GOOD',
						list: `Uploaded: \n ${ corp.map( ( e, i ) =>
							i !== corp.length - 1
							? `${ newCust.slice( i * indvLength, i * indvLength + indvLength ).length } new names to ${ e.company_name } \n`
							: `${ newCust.slice( i * indvLength, newCust.length + 5 ).length } new names to ${ e.company_name } \n`
							).join( ' ' ) }\n Totalling ${ newCust.length } New Customers`,
							cust: newCorpCust
						});
				} else {
					await module.exports.custCount(req, corp);
					let newCorpCust = await db.info.customers.corp_cust([og.cor_id, service]);
					req.session.user.focus_cust = newCorpCust;
					res.status(200).send({ msg: 'GOOD', list: 'NO NEW NAMES', cust: newCorpCust });
				}
				// res.status(200).send({ msg: 'GOOD', lists: 'NO NEW NAMES' });
				// console.log(uploadTo, data.length, proper(data[0].email), corpCust.length);
			} else {
				res.status(200).send({ msg: `ERROR: Session not found` });
			}
		} catch (e) {
			Err.emailMsg(e, 'Create/uploadCustomer');
			res.status(200).send({ msg: `ERROR: ${e}` });
		}
	},
	custCount: async (req, comp) => {
		let db = req.app.get('db');
		comp = comp[0];
		let date = Moment().format('YYYY-MM-DD');
		// GET CUSTOMERS TOTAL
		// GET ALL WITH NO FEEDBACK
		let lastSend = Moment()
			.subtract(comp.repeat_request.repeat, 'days')
			.format('YYYY-MM-DD');
		let total = await db.info.customers.count_comp_total([comp.c_id, lastSend]);
		let remaining = await db.info.customers.cust_activity([comp.c_id]);
		remaining = remaining.filter(
			e => Moment(e.last_sent).format('x') <= Moment(lastSend).format('x') || e.activity.active[e.activity.active.length - 1].type === 'Customer added',
		).length;
		comp.customers.reviews.push({
			size: total[0].total,
			remaining: remaining,
			date,
			percent: (remaining / total[0].total).toFixed(2) * 100,
		});
		await db.update.record.customers_reviews([comp.c_id, comp.customers]);
		return '';
	},
};
