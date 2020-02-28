const sgMail = require('@sendgrid/mail');
let { SG_Reviews, DEV, PROD } = process.env;
DEV = DEV.toLowerCase() === 'true' ? true : false;
PROD = PROD.toLowerCase() === 'true' ? true : false;
sgMail.setApiKey(SG_Reviews);
const templates = require('./templates');
const moment = require('moment');
const validate = require('email-validator');
const Err = require('./../Error');
const Default = require('./../Defaults');
// CATEGORIES = [SERVICE, EMAIL, CUST_ID, COMP_ID]
module.exports = {
	extra: () => 'HEY',
	sendMail: (emails, msg) => {
		try {
			let today = () => moment().format('LLL');
			// console.log(today(), emails.length ? emails.length : 1, `Email${emails.length ? 's' : ''} Sent For ${emails[0].category[3]}`);
			// recieves an Array of objects
			sgMail
				.send(emails)
				.then(() => {
					msg ? console.log(msg) : '';
					console.log(
						'\x1b[36m%s\x1b[0m',
						DEV ? 'SENT IN DEV MODE:' : '',
						today(),
						emails.length ? emails.length : 1,
						`Email${emails.length ? 's' : ''} Sent For ${emails[0].category[3]}`,
					);
				})
				.catch(error => {
					console.error(error.toString());
					const { message, code, response } = error;
					console.log('ERROR: ', message, code, response);
					const { headers, body } = response;
					console.log('Response: ', headers, body);
				});
		} catch (e) {
			Err.emailMsg(e, 'Reviews/sendMail');
		}
	},
	s_: async (app, offset) => {
		try {
			// Standard Initial Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log('ERROR:: ', err));
			console.log(`Starting First Send to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						let customers = await db.mail
							.review_s([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.repeat, 'days')
									.format('YYYY-MM-DD'),
								comp.auto_amt.amt,
							])
							.catch(err => console.log('ERROR:: ', err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => i.email.emailValidate() && i.id)
									.map(async cust => {
										let { first_name, email, feedback_text, id, activity } = cust;
										if (!cust.f_id) {
											let feed = await db.record.create_feedback([id, 'First Send']).catch(err => console.log(err));
											!DEV && PROD ? await db.record.reset_feedback([feed[0].f_id]).catch(err => console.log(err)) : null;
										} else {
											!DEV && PROD ? await db.record.reset_feedback([cust.f_id]).catch(err => console.log(err)) : null;
										}
										activity.active
											? activity.active.push({
													type: 'First Review Request',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'First Review Request',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										// RESET FEEDBACK
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback_rs([id, false, 'First Send']).catch(err => console.log(err)) : null;
										let format = {
											to: {
												email: DEV && !PROD ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.s_subject, comp, cust) : `${cust.first_name} DEV FIRST SEND`,
											text: await templates.text(comp, cust, 's'),
											html: await templates.filter(comp, cust, 's'),
											attachments: [],
											category: ['reviews', 'First Send', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						} else {
							// CHECK TO SEE IF THEY HAVE ANY CUSTOMERS AND SEND EXTRA INFO TO AM
							// module.exports.depleatedList(comp);
							await Default.depleated(comp);
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/s_');
			console.log('ERROR Reviews/s_', e);
		}
	},
	fr_: async (app, offset) => {
		try {
			//First Reminder Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log(err));
			console.log(`Starting First Reminder to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						let customers = await db.mail
							.review_fr_([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.first, 'days')
									.format('YYYY-MM-DD'),
							])
							.catch(err => console.log(err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => i.email.emailValidate() && i.id)
									.map(async cust => {
										let { first_name, email, feedback_text, id, activity } = cust;
										activity.active
											? activity.active.push({
													type: 'First Review Reminder',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'First Review Reminder',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback([id, 'First Reminder']).catch(err => console.log(err)) : null;
										let format = {
											to: {
												email: DEV ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.fr_subject, comp, cust) : `${cust.first_name} DEV FIRST REMINDER`,
											text: await templates.text(comp, cust, 'fr'),
											html: await templates.filter(comp, cust, 'fr'),
											attachments: [],
											category: ['reviews', 'First Reminder', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/fr_');
			console.log('ERROR Reviews/fr_', e);
		}
	},
	sr_: async (app, offset) => {
		try {
			//Second Reminder Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log(err));
			console.log(`Starting Second Reminder to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						// MAKE QUERY
						let customers = await db.mail
							.review_sr_([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.second, 'days')
									.format('YYYY-MM-DD'),
							])
							.catch(err => console.log(err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => i.email.emailValidate() && i.id)
									.map(async cust => {
										let { first_name, email, feedback_text, id, activity } = cust;
										activity.active
											? activity.active.push({
													type: 'Second Review Reminder',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'Second Review Reminder',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback([id, 'Second Reminder']).catch(err => console.log(err)) : null;
										let format = {
											to: {
												email: DEV ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.sr_subject, comp, cust) : `${cust.first_name} DEV Second REMINDER`,
											text: await templates.text(comp, cust, 'sr'),
											html: await templates.filter(comp, cust, 'sr'),
											attachments: [],
											category: ['reviews', 'Second Reminder', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/sr_');
			console.log('ERROR Reviews/sr_', e);
		}
	},
	or_: async (app, offset) => {
		try {
			// Opened Reminder Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log(err));
			console.log(`Starting Open Reminder to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						let customers = await db.mail
							.review_or_([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.open, 'days')
									.format('YYYY-MM-DD'),
							])
							.catch(err => console.log(err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => validate.validate(i.email) && i.id)
									.map(async cust => {
										let { first_name, email, feedback_text, id, activity } = cust;
										activity.active
											? activity.active.push({
													type: 'Opened Reminder',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'Opened Reminder',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback([id, 'Open Reminder']).catch(err => console.log(err)) : null;
										let format = {
											// Pass through correct object and recieve formatted object to push into array to send through sendgrid
											to: {
												email: DEV ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.or_subject, comp, cust) : `${cust.first_name} DEV OPEN REMINDER`,
											text: await templates.text(comp, cust, 'or'),
											html: await templates.filter(comp, cust, 'or'),
											attachments: [],
											category: ['reviews', 'Open Reminder', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/or_');
			console.log('ERROR Reviews/or_', e);
		}
	},
	pr_: async (app, offset) => {
		try {
			// Positive Feedback Reminder Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log(err));
			console.log(`Starting Positive Reminder to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						let customers = await db.mail
							.review_pr_([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.positive, 'days')
									.format('YYYY-MM-DD'),
							])
							.catch(err => console.log(err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => validate.validate(i.email) && i.id)
									.map(async cust => {
										let { first_name, email, id, activity } = cust;
										activity.active
											? activity.active.push({
													type: 'Positive Reminder',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'Positive Reminder',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback([id, 'Positive Reminder']).catch(err => console.log(err)) : null;
										let format = {
											// Pass through correct object and recieve formatted object to push into array to send through sendgrid
											to: {
												email: DEV ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.pr_subject, comp, cust) : `${cust.first_name} DEV POSITIVE REMINDER`,
											text: await templates.text(comp, cust, 'pr'),
											html: await templates.filter(comp, cust, 'pr'),
											attachments: [],
											category: ['reviews', 'Positive Reminder', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						} else {
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/pr_');
			console.log('ERROR Reviews/pr_', e);
		}
	},
	spr_: async (app, offset) => {
		try {
			//Second Positive Reminder Email
			let db = app.get('db');
			let companies = await db.mail.all_business([offset]).catch(err => console.log(err));
			console.log(`Starting Second Positive Reminder to ${companies.length} Companies On`, moment().format('LLLL'), offset);
			await Promise.all(
				companies
					//.slice(0, 250)
					.filter(comp => comp.active && comp.active_prod.reviews && comp.c_id)
					.map(async comp => {
						// MAKE QUERY
						let customers = await db.mail
							.review_spr_([
								comp.c_id,
								moment()
									.subtract(offset.split('-')[1], 'minutes')
									.subtract(comp.repeat_request.second, 'days')
									.format('YYYY-MM-DD'),
							])
							.catch(err => console.log(err));
						if (customers[0]) {
							let cust = await Promise.all(
								customers
									.filter(i => i.email.emailValidate() && i.id)
									.map(async cust => {
										let { first_name, email, feedback_text, id, activity } = cust;
										activity.active
											? activity.active.push({
													type: 'Second Positive Review Reminder',
													date: moment()
														.subtract(offset.split('-')[1], 'minutes')
														.format('YYYY-MM-DD'),
											  })
											: {
													active: [
														{
															type: 'Second Positive Review Reminder',
															date: moment()
																.subtract(offset.split('-')[1], 'minutes')
																.format('YYYY-MM-DD'),
														},
													],
											  };
										!DEV && PROD
											? await db.record
													.update_sent([
														id,
														moment()
															.subtract(offset.split('-')[1], 'minutes')
															.format('YYYY-MM-DD'),
														activity,
													])
													.catch(err => console.log(err))
											: null;
										!DEV && PROD ? await db.record.update_feedback([id, 'Second Positive Reminder']).catch(err => console.log(err)) : null;
										let format = {
											to: {
												email: DEV ? 'liftreviewslocal@gmail.com' : email,
												name: first_name,
											},
											from: {
												email: validate.validate(typeof comp.email.email[0] === 'string' ? comp.email.email[0] : 'not good')
													? comp.email.email[0]
													: `reviews@${comp.company_name.replace(/\s/g, '')}.com`,
												name: comp.owner_name.first + ' @ ' + comp.company_name,
											},
											replyTo: 'no-reply@liftlocal.com',
											subject: !DEV && PROD ? await templates.keywords(comp.spr_subject, comp, cust) : `${cust.first_name} DEV Second Positive REMINDER`,
											text: await templates.text(comp, cust, 'spr'),
											html: await templates.filter(comp, cust, 'spr'),
											attachments: [],
											category: ['reviews', 'Second Positive Reminder', id.toString(), comp.c_id.toString()],
										};
										return format;
									}),
							);
							module.exports.sendMail(cust);
						}
					}),
			);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/fr_');
			console.log('ERROR Reviews/spr_', e);
		}
	},
	depleatedList: async comp => {
		try {
			console.log('Yo Wassup', comp.c_id);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/depleatedList');
		}
	},
	SendGridTest: async app => {
		try {
			const msg = {
				to: 'test@example.com',
				from: 'test@example.com',
				subject: 'Sending with Twilio SendGrid is Fun',
				text: 'and easy to do anywhere, even with Node.js',
				html: '<strong>and easy to do anywhere, even with Node.js</strong>',
			};
			console.log('SEND TEST');
			sgMail.send(msg);
		} catch (e) {
			Err.emailMsg(e, 'Reviews/sendGridTest');
		}
	},
	ManualSend: async (req, res) => {
		try {
			let { selected, bus, type } = req.body;
			let db = req.app.get('db');
			comp = await db.info.specific_business([bus.c_id]);
			bus = comp[0] ? comp[0] : bus;
			let lastEmail =
				type.email === 's'
					? 'First Send'
					: type.email === 'fr'
					? 'First Reminder'
					: type.email === 'sr'
					? 'Second Reminder'
					: type.email === 'or'
					? 'Open Reminder'
					: type.email === 'pr'
					? 'Positive Reminder'
					: 'Second Positive Reminder';
			let emails = await Promise.all(
				selected.map(async cust => {
					let { first_name, email, cus_id, activity } = cust;
					if (!cust.f_id) {
						await db.record.create_feedback([cus_id, `Manual Review Request: ${type.email}`]).catch(err => console.log(err));
					}
					activity.active
						? activity.active.push({
								type: `Manual Review Request: ${type.email}`,
								date: moment().format('YYYY-MM-DD'),
						  })
						: {
								active: [
									{
										type: `Manual Review Request: ${type.email}`,
										date: moment().format('YYYY-MM-DD'),
									},
								],
						  };
					!DEV ? await db.record.update_sent([cus_id, moment().format('YYYY-MM-DD'), activity]).catch(err => console.log(err)) : null;
					!DEV ? await db.record.update_feedback_rs([cus_id, false, lastEmail]).catch(err => console.log(err)) : null;
					let fromEmail =
						bus.email.email[0] === null || !bus.email.email[0].emailValidate() ? `reviews@${bus.company_name.replace(/\s/g, '')}.com` : bus.email.email[0];
					let format = {
						// Pass through correct object and recieve formatted object to push into array to send through sendgrid
						to: {
							email: DEV ? 'liftreviewslocal@gmail.com' : email,
							name: first_name,
						},
						from: {
							email: fromEmail,
							name: bus.owner_name.first + ' @ ' + bus.company_name,
						},
						replyTo: 'no-reply@liftlocal.com',
						subject: !DEV && PROD ? await templates.keywords(bus[type.subject], bus, cust) : `${cust.first_name} DEV MANUAL SEND: ${type.email}`,
						text: await templates.text(bus, cust, type.email),
						html: await templates.filter(bus, cust, type.email),
						attachments: [],
						category: ['reviews', lastEmail, cus_id.toString(), bus.c_id.toString()],
					};
					return format;
				}),
			);
			module.exports.sendMail(emails, 'MANUAL');
			res.status(200).send({ msg: 'GOOD', sent: emails.length });
		} catch (e) {
			Err.emailMsg(e, 'Reviews/ManualSend');
			console.log('ERROR Reviews/ManualSend', e);
			res.status(200).send({ msg: 'NOT GOOD', err: e });
		}
	},
};

// EXAMPLE  FOR SENDING API REQUEST OUTSIDE OF NPM MODULE
// var options = {
//     headers:
//     {
//         accept: 'application/json',
//         authorization: `Bearer ${SG_Reviews}`
//     },
//     body: '{}'
// }
// await axios.get('https://api.sendgrid.com/v3/suppression/bounces', options).then(res => { console.log(res.data) })
// {"active":[{"type":"Customer Added","date":"2019-12-11"},{"date":"2019-12-05","type":"Opened First Reminder"}]}
