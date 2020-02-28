let { DEV, landing_link } = process.env;
DEV = DEV.toLowerCase() === 'true' ? true : false;
const Err = require('./../Error');
const Default = require('./../Defaults');
module.exports = {
	filter: (comp, cust, type) => {
		try {
			if (type === 'pr' || type === 'or' || type === 'fr' || type === 'sr' || type === 'spr' || type === 's') {
				let format = comp.email_format[type].toString();
				if (format) {
					return module.exports.Standard(comp, cust, type, format);
				} else {
				}
			} else if (type) {
			} else {
			}
		} catch (e) {
			Err.emailMsg(e, 'templates/filter');
		}
	},
	formatPhoneNumber: phoneNumberString => {
		try {
			var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
			var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
			if (match) {
				var intlCode = match[1] ? '' : '';
				return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
			}
			return null;
		} catch (e) {
			Err.emailMsg(e, 'templates/formatPhoneNumber');
		}
	},
	keywords: (str, comp, cust) => {
		try {
			cust = Array.isArray(cust) ? cust[0] : cust;
			comp = Array.isArray(comp) ? comp[0] : comp;
			if (str) {
				// console.log(cust)
				let check = str => {
					str = str.split('.');
					let table = str[0];
					let col = str[1];
					if (table.includes('comp')) {
						return comp[col];
					} else if (table.includes('cust')) {
						return cust[col];
					}
				};
				if (str.includes('☀')) {
					str = str.split(' ');
					// console.log(str);
					let items = str.map((e, i) => {
						if (e.includes('☀')) {
							let key = e.split('☀').filter(el => {
								return el !== '';
							});
							let keyword = key.filter(el => el.toLowerCase().includes('customer.') || el.toLowerCase().includes('company.'))[0];
							key.splice(key.indexOf(keyword), 1, check(keyword));
							return key.join('');
						} else {
							return e;
						}
					});
					return items.join(' ').replace(/ ,/gi, ',');
				} else {
					return str;
				}
			} else {
				console.log(comp.c_id, comp.s_subject);
			}
		} catch (e) {
			Err.emailMsg(e, 'templates/keywords');
		}
	},
	Standard: (comp, cust, type, format) => {
		try {
			let body, thanks, question;
			let one = format.split('')[0];
			let two = format.split('')[1];
			let three = format.split('')[2];
			if (type === 'pr') {
				two = '2';
				body = comp.pr_body.pr.body
					? module.exports.keywords(comp.pr_body.pr.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.pr_body.pr.question
					? module.exports.keywords(comp.pr_body.pr.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.pr_body.pr.thanks ? module.exports.keywords(comp.pr_body.pr.thanks, comp, cust) : 'Thank you so much for your feedback.';
			} else if (type === 'or') {
				body = comp.or_body.or.body
					? module.exports.keywords(comp.or_body.or.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.or_body.or.question
					? module.exports.keywords(comp.or_body.or.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.or_body.or.thanks ? module.exports.keywords(comp.or_body.or.thanks, comp, cust) : 'Thank you so much for your feedback.';
			} else if (type === 'fr') {
				body = comp.fr_body.fr.body
					? module.exports.keywords(comp.fr_body.fr.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.fr_body.fr.question
					? module.exports.keywords(comp.fr_body.fr.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.fr_body.fr.thanks ? module.exports.keywords(comp.fr_body.fr.thanks, comp, cust) : 'Thank you so much for your feedback.';
			} else if (type === 'sr') {
				body = comp.sr_body.sr.body
					? module.exports.keywords(comp.sr_body.sr.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.sr_body.sr.question
					? module.exports.keywords(comp.sr_body.sr.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.sr_body.sr.thanks ? module.exports.keywords(comp.sr_body.sr.thanks, comp, cust) : 'Thank you so much for your feedback.';
			} else if (type === 'spr') {
				two = '2';
				body = comp.spr_body.spr.body
					? module.exports.keywords(comp.spr_body.spr.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.spr_body.spr.question
					? module.exports.keywords(comp.spr_body.spr.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.spr_body.spr.thanks ? module.exports.keywords(comp.spr_body.spr.thanks, comp, cust) : 'Thank you so much for your feedback.';
			} else if (type === 's') {
				body = comp.s_body.s.body
					? module.exports.keywords(comp.s_body.s.body, comp, cust)
					: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
				question = comp.s_body.s.question
					? module.exports.keywords(comp.s_body.s.question, comp, cust)
					: 'How likely is it that you would recommend our agency to a friend or colleague?';
				thanks = comp.s_body.s.thanks ? module.exports.keywords(comp.s_body.s.thanks, comp, cust) : 'Thank you so much for your feedback.';
			}
			let cor_id = Default.cHash(comp.cor_id);
			let c_id = Default.cHash(comp.c_id);
			let cus_id = cust.id ? Default.cHash(cust.id) : Default.cHash(cust.cus_id);
			// console.log(cus_id, `${landing_link}feedback/rating/${cor_id}/${cus_id}/3/email/${c_id}`);
			return `
		<style type="text/css">
		@import url('https://fonts.googleapis.com/css?family=Hind+Vadodara&display=swap');
        a :hover {
            cursor: pointer;
        }
        #one :hover {
            background-color: rgba(255, 15, 15, 1);
            border-radius: 50%;
            height: 40px;
        }
        #two :hover {
            background-color: rgba(255, 125, 15, 1);
            border-radius: 50%;
            height: 40px;
        }
        #three :hover {
            background-color: rgba(255, 250, 15, 1);
            border-radius: 50%;
            height: 40px;
        }
        #four :hover {
            background-color: rgba(100, 255, 15, 1);
            border-radius: 50%;
            height: 40px;
        }
        #five :hover {
            background-color: rgba(25, 200, 50, 1);
            border-radius: 50%;
            height: 40px;
        }
        </style>
        <body style="
                                min-width: 600px;
                                max-width: 700px;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none; 
                                user-select: none; 
                                color: black;
						        font-family: 'Hind Vadodara', sans-serif;
                                ">
            <div style=" text-align: center; max-width: 100%; background: #fff; margin: 0 5%; padding: 2.5% 0;">
            ${one === '1' ? `${comp.logo ? `<img src='${comp.logo}' alt='Company Logo' style="max-width: 200px;" />` : ''}` : ``}
				<div style='text-align: left; margin: 0; padding: 0;'>
                <p style='font-size: 1.25em;'>${body ? (body.includes('\n') ? body.split('\n').join('<br/>\n') : body) : ''}</p>
                <p style='font-size: 1.25em;'>${question ? (question.includes('\n') ? question.split('\n').join('<br/>\n') : question) : ''}</p>
                </div>
                <div style='text-align: left;'>
                ${
									two === '1'
										? `
                <div style="padding: .5% 2.5% 0 0; margin-left: 0; text-align: center;">
                    <br/>
                    <a href='${landing_link}feedback/rating/${cor_id}/${cus_id}/1/email/${c_id}' id='one'style='display: inline-block; border: solid black 2px;  border-radius: 50%; height: 50px; width: 50px; vertical-align: middle; margin: 0 2.5%; background-color: rgba(255, 15, 15, .7); text-decoration: none; color: black;'>
                        <h1 style='margin: 0; padding: 0; margin-top: 12.5%;'>1</h1>
                    </a>
                    <a  href='${landing_link}feedback/rating/${cor_id}/${cus_id}/2/email/${c_id}' id='two' style='display: inline-block; border: solid black 2px; border-radius: 50%; height: 50px; width: 50px; vertical-align: middle; margin: 0 2.5%; background-color: rgba(255, 125, 15, .7); text-decoration: none; color: black;'>
                        <h1 style='margin: 0; padding: 0; margin-top: 12.5%;'>2</h1>
                    </a>
                    <a  href='${landing_link}feedback/rating/${cor_id}/${cus_id}/3/email/${c_id}' id='three' style='display: inline-block; border: solid black 2px; border-radius: 50%; height: 50px; width: 50px; vertical-align: middle; margin: 0 2.5%; background-color: rgba(255, 250, 15, .7); text-decoration: none; color: black;'>
                        <h1 style='margin: 0; padding: 0; margin-top: 12.5%;'>3</h1>
                    </a>
                    <a  href='${landing_link}feedback/rating/${cor_id}/${cus_id}/4/email/${c_id}' id='four' style='display: inline-block; border: solid black 2px; border-radius: 50%; height: 50px; width: 50px; vertical-align: middle; margin: 0 2.5%; background-color: rgba(100, 255, 15, .7); text-decoration: none; color: black;'>
                        <h1 style='margin: 0; padding: 0; margin-top: 12.5%;'>4</h1>
                    </a>
                    <a  href='${landing_link}feedback/rating/${cor_id}/${cus_id}/5/email/${c_id}' id='five' style='display: inline-block; border: solid black 2px; border-radius: 50%; height: 50px; width: 50px; vertical-align: middle; margin: 0 2.5%; background-color: rgba(25, 200, 50, .7); text-decoration: none; color: black;'>
                        <h1 style='margin: 0; padding: 0; margin-top: 12.5%;'>5</h1>
                    </a>
                    <br/>
                    <div style='margin: 2.5% 0 0 0;'>
                        <p style='display: inline-block; margin: .5% 10%; font-size: 1em;'>1 = Not likely</p>
                        <p style='display: inline-block; margin: .5% 10%; font-size: 1em;'>5 = Very likely</p>
                        </div>
                    <br/>
                </div>
                `
										: two === '2'
										? `
                <div style="padding: .5% 2.5% 0 0; margin-left: 0; text-align: center;">
                        <a href='${landing_link}feedback/rating/${cor_id}/${cus_id}/direct/email/${c_id}'
                        style='background-color: ${
													comp.accent_color ? (!comp.accent_color.includes('#') ? '#' + comp.accent_color : comp.accent_color) : 'gray'
												}; outline: none;
                        border: none; color: white; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; padding: 15px 36px;'
                        >Leave A Review
                        </a>
						</div>
						`
										: ``
								}
					</div>
					${
						three === '1'
							? `
						<div style='display: inline-block; width:100%; margin: 2.5% 0; text-align: left; '>
					<p style='margin-top: 3.5%; font-size: 1.25em;;'>${thanks ? (thanks.includes('\n') ? thanks.split('\n').join('<br/>\n') : thanks) : ''}</p>
					<div style='display: inline-block; width: 80%; text-align: left; vertical-align: text-top;'>
					<p style='margin: .25% 0; font-size: 1em; line-height: 95%;'>${comp.company_name}</p>
					<p style='margin: .25% 0; font-size: 1em; line-height: 95%;'>${comp.address.street}</p>
					<p style='margin: .25% 0; font-size: 1em; line-height: 95%;'>${comp.address.state}, USA, ${comp.address.zip}</p>
					<p style='margin: .25% 0; font-size: 1em; line-height: 95%;'>${module.exports.formatPhoneNumber(comp.phone.phone)}</p>
					</div>
					<a href="${landing_link}feedback/unsubscribe/${cor_id}/${cus_id}/${c_id}" style='text-decoration: underline; display: inline-block;'>
					<p>Unsubscribe</p>
					</a>
					</div>
																					`
							: three === '2'
							? `
							<div style='display: inline-block; width:100%; margin: 2.5% 0; text-align: left; '>
							<p style='margin-top: 3.5%; font-size: 1.25em;'>${thanks ? (thanks.includes('\n') ? thanks.split('\n').join('<br/>\n') : thanks) : ''}</p>
				<div style='display= inline-block; width= 100%; margin= 2.5 % 0; textAlign= left;'>
					${comp.logo ? `<img src='${comp.logo}' alt='Company Logo' style="max-width: 19%;" />` : ''}
				</div>
                <div style='display: inline-block; width: 80%; text-align: left; '>
                    <p style='margin: .5% 0; font-size: 1em; line-height: 95%;'>${comp.company_name}</p>
                    <p style='margin: .5% 0; font-size: 1em; line-height: 95%;'>${comp.address.street}</p>
                    <p style='margin: .5% 0; font-size: 1em; line-height: 95%;'>${comp.address.state}, USA, ${comp.address.zip}</p>
                    <p style='margin: .5% 0; font-size: 1em; line-height: 95%;'>${module.exports.formatPhoneNumber(comp.phone.phone)}</p>
                </div>
                </div>
                <a href="${landing_link}feedback/unsubscribe/${cor_id}/${cus_id}/${c_id}" style='text-decoration: underline; display: inline-block;'>
                    <p>Unsubscribe</p>
                </a>
                `
							: three === '3'
							? `<div style="margin-top: 5%;">${comp.signature}</div>`
							: ``
					}
            </div>
        </body>
        `;
		} catch (e) {
			Err.emailMsg(e, 'templates/Standard');
		}
	},
	Addon: (comp, cust) => {
		try {
			return `
        `;
		} catch (e) {
			Err.emailMsg(e, 'templates/Addon');
		}
	},
	text: (comp, cust) => {
		try {
			return `
			Hi ${module.exports.keywords('☀customer.first_name☀', comp, cust)}, 
			\n		
			I hope you are doing well! We wanted to check-in and see how your experience has been with our agency. Using the scale of 1 to 5 below…	
			\n		
			1 - ${landing_link}feedback/rating/${comp.cor_id}/${cust.cus_id}/1/email/${comp.c_id}
			\n		
			2 - ${landing_link}feedback/rating/${comp.cor_id}/${cust.cus_id}/2/email/${comp.c_id}
			\n		
			3 - ${landing_link}feedback/rating/${comp.cor_id}/${cust.cus_id}/3/email/${comp.c_id}
			\n		
			4 - ${landing_link}feedback/rating/${comp.cor_id}/${cust.cus_id}/4/email/${comp.c_id}
			\n		
			5 - ${landing_link}feedback/rating/${comp.cor_id}/${cust.cus_id}/5/email/${comp.c_id}
			\n		
        `;
		} catch (e) {
			Err.emailMsg(e, 'templates/text');
		}
	},
};
