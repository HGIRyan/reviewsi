const Moment = require('moment');
const DefaultFun = require('./Defaults');
const { GOOGLE_PLACE_API } = process.env;
DEV = process.env.DEV.toLowerCase() === 'true' ? true : false;
PROD = process.env.PROD.toLowerCase() === 'true' ? true : false;
trial = process.env.trial.toLowerCase() === 'true' ? true : false;
const axios = require('axios');
const moment = require('moment');
const Err = require('./Error');
const sendEmail = require('./Mail/Reviews');
module.exports = {
	addonRecord: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { client_id, cust_id, source, type, loc } = req.body;
			type = type === 'lead' ? 'leadgen' : type === 'win' ? 'winbacks' : type === 'ref' ? 'referral' : 'cross_sell';
			let update = await db.record.addon_feedback([cust_id]);
			if (!update[0]) {
				let info = await db.info.specific_business([client_id]);
				let cust = await db.info.customer([cust_id]);
				let check = cust[0].activity.active.filter(e => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Clicked Email'));
				if (!check[0]) {
					await cust[0].activity.active.push({ date: Moment().format('YYYY-MM-DD'), type: `Clicked Email` });
					let activity = cust[0].activity;
					cust = await db.record.update_activity([cust_id, activity]);
				}
				let feedback = [];
				if (info[0].reviews) {
					feedback = await db.info.all_feedback_specific([client_id]);
				}
				res.status(200).send({ msg: 'GOOD', info, feedback, cust });
			} else {
				res.status(200).send({ msg: 'Not Good' });
			}
			// Record Data as well as grab feedback scores + feedback if they have reviews service
		} catch (e) {
			// Err.emailMsg(e, 'Record/addonRecord');
		}
	},
	record: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { type } = req.params;
			// UPDATE CUSTOMER ACTIVITY
			let today = Moment().format('YYYY-MM-DD');
			let fiveDay = Moment()
				.subtract(5, 'days')
				.format('YYYY-MM-DD');
			if (type === 'review') {
				req.body.map(async e => {
					let { event, timestamp, email, category } = e;
					if (Array.isArray(category) && category[0] !== 'Error') {
						// Check
						let check = await db.record.check([parseInt(category[2])]);
						if (parseInt(category[2]) && email !== 'liftlocal@sink.sendgrid.net' && category[0] === 'reviews' && check[0]) {
							let offset = check[0].utc_offset.split('-')[1];
							if (event === 'open') {
								if (!check[0].updated && check[0].last_email === category[1]) {
									check[0].activity.active.push({
										date: Moment(timestamp * 1000)
											.subtract(offset, 'minutes')
											.format('YYYY-MM-DD'),
										type: `Opened ${category[1]}`,
									});
									await db.record.open([
										parseInt(category[2]),
										Moment(timestamp * 1000)
											.subtract(offset, 'minutes')
											.format('YYYY-MM-DD-/-LTS'),
										event,
									]);
									await db.update.record.activity(parseInt(category[2]), check[0].activity);
								}
							} else if (event === 'delivered' && check[0]) {
								check[0].email_status === 'open' ? null : await db.record.delivered([parseInt(category[2]), event]);
							} else if (event === 'bounce' || event === 'dropped' || event === 'spamreport' || event === 'unsubscribe' || event === 'deferred') {
								// Unsubscribe
								await db.record.unsub([
									parseInt(category[2]),
									Moment(timestamp * 1000)
										.subtract(offset, 'minutes')
										.format('YYYY-MM-DD-/-LTS'),
								]);
							}
						}
					}
				});
			} else {
				// res.status(200).send({ msg: 'BAD TYPE' });
			}
			res.sendStatus(200);
		} catch (e) {
			Err.emailMsg(e, 'Record/record');
			// DEV ? console.log('Record/record', e) : null;
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	newInsights: async (req, res) => {
		let db = req.app.get('db');
		let {} = req.body;
	},
	directClick: async (req, res) => {
		try {
			let { client_id, cust_id, rating, source, cor_id } = req.body;

			let clicked = await req.app.get('db');
			console.log('Hey Dude');
		} catch (error) {
			Err.emailMsg(e, 'Record/directClick');
			DEV ? console.log('Record/directClick', e) : null;
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	directFeedback: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { feedback, cust_id, rating, activity, cust, info } = req.body;
			if (cust_id.match(/[a-z]/i)) {
				cust_id = DefaultFun.cUnHash(cust_id);
			}
			let msg;
			if (parseInt(rating) <= 2) {
				msg = 'We Recieved Your Message';
			} else if (parseInt(rating) === 3) {
				msg = 'We Recieved Your Message';
			} else if (rating >= 4) {
				msg = 'We Recieved Your Message';
			}
			const directF = await db.record.direct_feedback([cust_id, feedback]);
			if (directF[0]) {
				let check = cust.activity.active.filter(e => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Left Feedback'));
				if (!check[0]) {
					await db.record.update_activity([cust_id, activity]);
				}
				// Send Feedback Email
				await module.exports.notificationEmail({ info, rating, cust, feedback });
				res.status(200).send({ status: 'GOOD', msg, directF });
			} else {
				res.status(200).send({ status: 'BAD', msg: 'Something Went Wrong. Thank you' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/directFeedback');
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	siteClick: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { site, cust_id, rating, activity, cust } = req.body;
			if (cust_id.match(/[a-z]/i)) {
				cust_id = DefaultFun.cUnHash(cust_id);
			}
			let msg;
			if (parseInt(rating) <= 2) {
				msg = 'You Are Now Being Redirected';
			} else if (parseInt(rating) === 3) {
				msg = 'You Are Now Being Redirected';
			} else if (rating >= 4) {
				msg = 'You Are Now Being Redirected';
			}
			const clicked = await db.record.site_click([cust_id, site]);
			if (clicked[0]) {
				let check = cust.activity.active.filter(e => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Clicked to'));
				if (!check[0]) {
					cust = await db.record.update_activity([cust_id, activity]);
				}
				res.status(200).send({ status: 'GOOD', msg, clicked, cust });
			} else {
				res.status(200).send({ status: 'BAD', msg: 'Something Went Wrong. Thank you' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/siteclick');
		}
	},
	feedback: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { client_id, cust_id, rating, source, cor_id } = req.body;
			client_id = DefaultFun.cUnHash(client_id);
			cust_id = DefaultFun.cUnHash(cust_id);
			// rating = DefaultFun.cUnHash(rating);
			source = DefaultFun.cUnHash(source);
			cor_id = DefaultFun.cUnHash(cor_id);
			let update = [];
			if (rating === 'direct') {
				update = [{}];
			} else {
				update = await db.record.reviewFeedback([cust_id, rating, Moment().format('YYYY-MM-DD-/-LTS'), source]);
			}
			if (update[0]) {
				// UPDATE RATING, PUSH ON END OF RATING HISTORY
				let info = await db.info.specific_business([client_id]);
				let cust = await db.info.customer([cust_id]);
				// Update Activity
				let check = cust[0].activity.active.filter(e => e.date === Moment().format('YYYY-MM-DD'));
				if (info[0].feedback_alert.alert.some(e => e.to !== 'no-reply@liftlocal.com') && info[0].feedback_alert.alert.length >= 1 && rating !== 'direct') {
					// check
					let noti_email = await db.record.checks.noti_email([cust_id, update[0].last_email]);
					// console.log('SENDING NOTI EMAIL', noti_email[0], cust_id, update[0].last_email);
					if (noti_email[0]) {
						// Update Noti_email
						await db.record.checks.update_noti_email([cust_id, update[0].last_email]);
						await module.exports.notificationEmail({ info, rating, cust });
					}
				}
				if (!check[0]) {
					await cust[0].activity.active.push({
						date: Moment().format('YYYY-MM-DD'),
						type: rating === 'direct' ? 'Clicked Direct Link' : `Left Rating of ${rating}`,
					});
					(await update[0].rating_history) ? update[0].rating_history.rating.push(parseInt({ rating: rating, date: Moment().format('YYYY-MM-DD') })) : null;
					let activity = cust[0].activity;
					update[0].rating_history ? await db.record.update_rating_history([cust_id, update[0].rating_history]) : null;
					cust = await db.record.update_activity([cust_id, activity]);
				}
				res.status(200).send({ msg: 'GOOD', info, cust });
			} else {
				res.status(200).send({ msg: 'Not Good' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/feedback');
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	notificationEmail: async ({ info, rating, cust, feedback }) => {
		info = Array.isArray(info) ? info[0] : info;
		cust = Array.isArray(cust) ? cust[0] : cust;
		let { company_name, feedback_alert, c_api, logo, address } = info;
		feedback_alert = feedback_alert.alert.filter(e => {
			if (rating >= 3) {
				return e.type === 'all' || e.type === 'positive';
			} else {
				return e.type === 'all' || e.type === 'negative';
			}
		});
		let from = c_api.salesforce.sf_id
			? { email: c_api.salesforce.accountManager.email, name: `${c_api.salesforce.accountManager.name} @ Lift Local` }
			: { email: 'manager@liftlocal', name: 'Lift Local' };
		let emails = [];
		feedback_alert.forEach(e => emails.push({ email: e.to }));
		displayStars = rating => {
			let diff = 5 - rating;
			let stars = [];
			for (let i = 0; i < rating; i++) {
				stars.push('https://res.cloudinary.com/lift-local/image/upload/v1580503925/Google_f29eew.png');
			}
			if (diff !== 0) {
				for (let i = 0; i < diff; i++) {
					stars.push('https://res.cloudinary.com/lift-local/image/upload/v1581694229/GoogleGrey_ozrrtb.png');
				}
			}
			return stars
				.map(
					(e, i) =>
						`<img
					src='${e}'
					alt="Star Ratings"
					style="
						display: inline-block;
						vertical-align: middle;
						height: 50px;
						width: 50px;
						overflow: hidden;
						margin: 0 1px;
					"
					key='${i}'
				/>`,
				)
				.join('');
		};
		let email = [
			{
				to: emails,
				from,
				replyTo: from.email,
				subject: `New Feedback Left`,
				text: `New Feedback Left. Please Turn on HTML Emails`,
				html: `
				<style>
				@import url('https://fonts.googleapis.com/css?family=Hind+Vadodara&display=swap');
				.noMargin {
					margin: 0;
					padding: 0;
				}
			</style>
			
			<body style="min-width: 600px;
											max-width: 700px;
											-webkit-user-select: none;
											-moz-user-select: none;
											-ms-user-select: none; 
											user-select: none; 
											color: black;
											font-family: 'Hind Vadodara', sans-serif;">
				<div style="width: 100%; min-height: 40vh; text-align: center; margin:0 auto; ">
					<img
						src='${logo}'
						alt='Company Logo' style='max-width:200px;' />
					<h2 class='noMargin'>Customer Feedback</h2>
					<h3 class='noMargin'>for ${company_name},</h3>
					<h4 class='noMargin'>${address.street}, ${address.city}, ${address.state}, ${address.zip}</h4>
					<hr style='width:40%' />
					<h3 class='noMargin'>Feedback Provided on ${moment().format('MMM Do, YY')}</h3>
					<h3 class='noMargin'>Customer Name: ${cust.first_name} ${cust.last_name}</h3>
					<h3 class='noMargin'>Customer Email: ${cust.email}</h3>
					<h3 style="margin-bottom:0;  margin:5% auto 0;">Rating</h3>
					<div style="min-width:60%; margin:0 auto; padding:0; text-align:center; font-size: 2em;  vertical-align: middle; display: inline-block;">
					<h1 style="display: inline-block; vertical-align: middle; margin: 0; padding: 0; color: #e7711b; fontSize: 80px; fontFamily: arial,sans-serif; marginRight: 5px">
					${rating}
					</h1>
					${displayStars(rating)}
					</div>
					<h5 class='noMargin'>out of 5</h5>
					${
						feedback
							? `<div style="margin: 5% 0;">
					<h3>NEW DIRECT FEEDBACK</h3>
					<div>${feedback}</div>
				</div>`
							: ''
					}
					</div>
					</body>
					`,
				category: ['feedback', 'notification', cust.cus_id.toString(), info.c_id.toString()],
			},
		];
		// <a href='https://ll.lift-local.com/indv-customer/${cor_id}/${cust[0].cus_id}/${c_id}' style="text-decoration: none;">
		// <div style="min-width: 60%; background-color: gray; text-align:center;">
		// 	<h2 >View Customer Activity</h2>
		// </div>
		// </a>

		sendEmail.sendMail(email);
		// console.log(email);
	},
	referral: async (req, res) => {
		try {
			let db = req.app.get('db');
			let {} = req.body;
		} catch (e) {
			Err.emailMsg(e, 'Record/referral');
		}
	},
	newReviews: async (app, allComp) => {
		try {
			let db = app.get('db');
			let date = moment().format('YYYY-MM-DD');
			allComp = await allComp
				.filter(e => e.place_id !== 'N/A')
				.map(async (e, i) => {
					await axios
						.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${e.place_id}&key=${GOOGLE_PLACE_API}`)
						.then(async resp => {
							if (resp.status === 200) {
								if (resp.data.status === 'OK') {
									let { result } = resp.data;
									// console.log(result, e);
									let lastReviews =
										e.reviews.reviews.length >= 5 ? e.reviews.reviews.slice(e.reviews.reviews.length - 5, e.reviews.reviews.length - 1) : e.reviews.reviews;
									// console.log(lastReviews);
									let rating = result.rating;
									let newReviews = result.user_ratings_total;
									if (lastReviews[lastReviews.length - 1] && Array.isArray(lastReviews)) {
										let weekReview = newReviews - lastReviews[lastReviews.length - 1].totalReviews;
										let month = lastReviews.reduce((a, b) => ({ newReviews: parseFloat(a.newReviews) + parseFloat(b.newReviews) })).newReviews + weekReview;
										let status = month === 0 ? 'CRITICAL' : month === 1 ? 'URGENT' : month === 2 ? 'NEEDS ATTENTION' : month <= 5 ? 'GOOD' : 'SLOW';
										// If Recording Length is less than 4 status default to "N/A"
										let llRating = await db.info.customers.feedback_avg(e.c_id);
										llRating = llRating[0].avg;
										llRating = parseFloat(llRating).toFixed(2);
										llRating = isNaN(llRating) ? '3' : llRating;
										e.reviews.reviews.push({
											totalReviews: newReviews,
											newReviews: weekReview,
											rating,
											date: '2020-02-23',
											status,
											llrating: llRating,
										});
										let sorted = e.customers.reviews.sort((a, b) => (a.date > b.date ? 1 : -1));
										let cns = sorted[sorted.length - 1].remaining;
										let auto = await DefaultFun.setting_auto_amt(cns, month, e);
										if (auto !== 'NA' && !trial) {
											await db.update.record.auto_amt([e.c_id, { amt: auto }]);
										}
										// UPDATE REVIEW HISTORY
										await db.update.record.reviews([e.c_id, e.reviews]);
										await db.update.record.review_history([e.c_id, weekReview, status]);
									}
								}
							}
						})
						.catch(e => console.log(e));
				});
		} catch (e) {
			Err.emailMsg(e, 'Record/newReviews');
			console.log('ERROR Record/newReviews', e);
		}
	},
	custCount: async (app, allComp) => {
		try {
			let db = app.get('db');
			let date = moment().format('YYYY-MM-DD');
			await allComp.forEach(async e => {
				// GET CUSTOMERS TOTAL
				// GET ALL WITH NO FEEDBACK
				let lastSend = moment()
					.subtract(e.repeat_request.repeat, 'days')
					.format('YYYY-MM-DD');
				let total = await db.info.customers.count_comp_total([e.c_id, lastSend]);
				let remaining = await db.info.customers.cust_activity([e.c_id]);
				remaining = remaining.filter(
					e => Moment(e.last_sent).format('x') <= Moment(lastSend).format('x') || e.activity.active[e.activity.active.length - 1].type === 'Customer added',
				).length;
				e.customers.reviews.push({
					size: total[0].total,
					remaining: remaining,
					date,
					percent: (remaining / total[0].total).toFixed(2) * 100,
				});
				await db.update.record.customers_reviews([e.c_id, e.customers]);
				// console.log(e.c_id, e.customers.reviews.length);
			});
		} catch (e) {
			Err.emailMsg(e, 'Record/custCount');
			console.log('ERROR Record/custCount', e);
		}
	},
	unsubscribe: async (req, res) => {
		try {
			let { cor_id, cust_id, client_id } = req.body;
			client_id = DefaultFun.cUnHash(client_id);
			cust_id = DefaultFun.cUnHash(cust_id);
			cor_id = DefaultFun.cUnHash(cor_id);
			// Get Customer + Company
			let info = await req.app.get('db').info.cust_comp([client_id, cust_id]);
			if (info[0]) {
				// Update Activity and Mark as not active
				if (!info[0].activity.active.some(e => e.type === 'Unsubscribed' && e.date === Moment().format('YYYY-MM-DD'))) {
					await info[0].activity.active.push({ date: Moment().format('YYYY-MM-DD'), type: `Unsubscribed` });
					let activity = info[0].activity;
					await req.app.get('db').record.update_activity([cust_id, activity]);
					await req.app.get('db').record.unsub([cust_id, Moment().format('YYYY-MM-DD-/-LTS')]);
				}
				res.status(200).send({ msg: 'GOOD', info: info[0] });
			} else {
				res.status(200).send({ msg: 'There was an Error in unsubscribing' });
			}
		} catch (error) {
			Err.emailMsg(error, 'Record/unsubscribe');
			console.log('ERROR Record/unsubscribe', error);
			res.status(200).send({ msg: 'There was an Error in unsubscribing', error });
		}
	},
};
