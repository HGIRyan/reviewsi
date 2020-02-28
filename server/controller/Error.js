const Moment = require('moment');
const DefaultFun = require('./Defaults');
const sgMail = require('@sendgrid/mail');
DEV = process.env.DEV.toLowerCase() === 'true' ? true : false;
PROD = process.env.PROD.toLowerCase() === 'true' ? true : false;
const { errorEmail, SG_Reviews } = process.env;
sgMail.setApiKey(SG_Reviews);
module.exports = {
	emailMsg: (e, loc) => {
		if (!Array.isArray(e)) {
			const msg = {
				to: errorEmail,
				from: 'Errors@LiftLocal.com',
				subject: `Errors for${e.name}`,
				text: 'and easy to do anywhere, even with Node.js',
				html: `Here is your Error <br/> ${JSON.stringify(e)} <br/> ${loc} <br/> <hr/> <br/> ${e}`,
				category: ['Error'],
			};
			if (!DEV && PROD) {
				sgMail.send(msg).catch(error => {
					console.error(error.toString());
					const { message, code, response } = error;
					console.log('ERROR: ', message, code, response);
					const { headers, body } = response;
					console.log('Response: ', headers, body);
				});
			} else {
				console.log('\x1b[31m%s\x1b[0m', 'ERROR::', e);
				console.log('\x1b[31m%s\x1b[0m', 'Loc::', loc);
			}
		} else if (!DEV && PROD) {
			sgMail.send(e).catch(error => {
				console.error(error.toString());
				const { message, code, response } = error;
				console.log('ERROR: ', message, code, response);
				const { headers, body } = response;
				console.log('Response: ', headers, body);
			});
		} else {
			console.log('\x1b[31m%s\x1b[0m', 'DEV ERROR::', e);
			console.log('\x1b[31m%s\x1b[0m', 'DEV ERROR Loc::', loc);
		}
		// try {
		// } catch (e) {
		// 	Err.emailMsg(e, 'Reviews/addonRecord');
		// }
	},
};
