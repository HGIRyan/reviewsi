const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();
const Default = require('./Defaults');
const { sendBack } = process.env;
let similar = require('string-similarity');
let email = require('./Mail/Reviews');
const Err = require('./Error');
module.exports = {
	loginBypass: async (db, req, next) => {
		try {
			if (!req.session.user) {
				let info = await db.info.all_business([]);
				let industry = await db.info.industries([]);
				req.session.user = {
					user: true,
					email: 'password',
					userName: 'DEV',
					permissions: 'admin',
					info,
					industry,
				};
			}
		} catch (e) {
			Err.emailMsg(e, 'Authentication/loginBypass');
		}
	},
	resetSession: async (req, res) => {
		try {
			// console.log('RESETING SESSION START');
			if (req.session.user) {
				let db = req.app.get('db');
				let info = await db.info.all_business([]);
				let industry = await db.info.industries([]);
				req.session.user.info = info;
				req.session.user.industry = industry;
				req.session.user.focus_cust = [];
				res.status(200).send({ msg: 'GOOD', session: req.session.user });
				// console.log('RESETING SESSION END');
			} else {
				console.log('BRUH THERE AINT NO SESSION');
			}
		} catch (e) {
			Err.emailMsg(e, 'Authentication/resetSession');
		}
	},
	logout: async (req, res) => {
		try {
			req.session.destroy();
			if (req.session) {
				res.status(200).send({ msg: 'NOT LOGGED OUT. ERROR' });
			} else {
				res.status(200).send({ msg: 'GOOD' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Authentication/logout');
		}
	},
	login: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { userName, password } = req.body;
			userName = userName.toLowerCase();
			let loginInfo = await db.info.login([userName]);
			if (!loginInfo[0]) {
				//If the username does not exist
				res.status(200).send({ msg: "Username or Email doesn't Exist" });
			} else {
				let pass = loginInfo[0].hash_pass;
				password = Default.cUnHash(password);
				let compare = bcrypt.compareSync(password, pass);
				let permission = loginInfo[0].permission;
				if (compare) {
					if (permission === 'admin') {
						let info = await db.info.all_business([]);
						let industry = await db.info.industries([]);
						req.session.user = {
							user: true,
							email: loginInfo[0].email,
							userName: loginInfo[0].username,
							userInfo: loginInfo[0],
							permissions: permission,
							industry,
							info,
							expires: moment(req.session.cookie.expires).format('x'),
						};
					} else if (permission === 'sales') {
						req.session.user = {
							user: true,
							email: loginInfo[0].email,
							userName: loginInfo[0].username,
							userInfo: loginInfo[0],
							permissions: permission,
							expires: moment(req.session.cookie.expires).format('x'),
						};
					} else if (permission === 'client') {
						let c_id = loginInfo[0].c_id;
						let clientInfo = await db.info.client_info([c_id]);
						let cor_id = clientInfo[0].cor_id;
						let customers = await db.info.customers.corp_cust_all([cor_id]);
						req.session.user = {
							user: true,
							email: loginInfo[0].email,
							userName: loginInfo[0].username,
							userInfo: loginInfo[0],
							permissions: permission,
							info: clientInfo,
							focus_cust: customers,
							expires: moment(req.session.cookie.expires).format('x'),
						};
					}
					res.status(200).send({ msg: 'GOOD', session: req.session.user });
				} else {
					res.status(200).send({ msg: 'Wrong Password' });
				}
			}
		} catch (e) {
			Err.emailMsg(e, 'Authentication/login');
		}
	},
	register: (req, res) => {
		try {
			let { userName } = req.body;
			let hash = Default.password(userName);
		} catch (e) {
			Err.emailMsg(e, 'Authentication/Register');
		}
	},
	forgotPass: async (req, res) => {
		let db = req.app.get('db');
		let { userName } = req.body;
		// Check If Email Exists
		let check = await db.auth.check_email([userName]);
		if (check.length > 1) {
			check = check.sort((a, b) => (similar.compareTwoStrings(userName, a.email) > similar.compareTwoStrings(userName, b.email) ? 1 : -1));
		}
		// Update Forgot Pass Code
		if (check[0]) {
			let forgotCode = Default.randomString(4);
			await db.auth.reset_code([check[0].user_id, forgotCode]);
			// Email Code To Email
			let emails = [
				{
					to: check[0].email,
					from: {
						name: 'Lift Local',
						email: 'password-reset@liftlocal.com',
					},
					subject: 'Lift Local Password Reset',
					text: `
					You recently requested to reset your password for your Lift Local account.\n
				 	Use the code below to reset it. This password reset is only valid  until 12am EST.\n
				 	${forgotCode} \n
				 	If you did not request a password reset, please ignore this email or contact your account manager.
				 	\n
				 	© 2020 Lift Local LLC. All rights reserved.
				 	2500 Executive Pkwy # 140, Lehi, UT 84043
				 `,
					html: `
					<img src='https://res.cloudinary.com/lift-local/image/upload/v1580399400/Lift%20Local.png' alt='Lift Local Logo' style="max-width:200px;"/>
					<br/>
					You recently requested to reset your password for your Lift Local account.<br/>
				 	Use the code below to reset it. This password reset is only valid until 12am EST.<br/>
				 	<h1><b>${forgotCode}</b></h1> <br/>
				 	If you did not request a password reset, please ignore this email or contact your account manager.
				 	<br/>
				 	© 2020 Lift Local LLC. All rights reserved.
				 	2500 Executive Pkwy # 140, Lehi, UT 84043
				`,
					category: ['reset', 'password', check[0].user_id.toString(), check[0].c_id.toString()],
				},
			];
			await email.sendMail(emails);
		}

		res.status(200).send({ msg: 'GOOD' });
	},
	resetCode: async (req, res) => {
		let { code } = req.body;
		let check = await req.app.get('db').auth.check_code([code]);
		if (check[0]) {
			res.status(200).send({ msg: 'GOOD', info: check[0] });
		} else {
			res.status(200).send({ msg: 'Invalid Code' });
		}
	},
	newPass: async (req, res) => {
		let { newPass, info } = req.body;
		let pass = Default.newPass(newPass);
		if (pass) {
			await req.app.get('db').auth.new_pass([info.user_id, pass]);
			res.status(200).send({ msg: 'GOOD' });
		}
	},
	updateLoginInfo: async (req, res) => {
		let { og } = req.body;
		let pass = Default.cUnHash(og.password);
		let newPass = Default.newPass(pass);
		await req.app.get('db').auth.update_login([og.user_id, og.email, og.username, newPass]);
		res.status(200).send({ msg: 'GOOD' });
	},
};
