// Imports
const Moment = require('moment');
let { DEV } = process.env;
DEV = DEV.toLowerCase() === 'true' ? true : false;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SECRET_CRYPTR');
const Err = require('./Error');
const pdf = require('html-pdf');
const sendEmail = require('./Mail/Reviews');

module.exports = {
	indvReviewReport: async (req, res) => {
		try {
			let { promoters, demoters, passives, reviews, responses, og, startDate, endDate } = req.body;
			await pdf
				.create(module.exports.indvReviewReportHTML({ promoters, demoters, passives, reviews, responses, og, startDate, endDate }), {})
				.toFile(`${__dirname}/Review_Report.pdf`, (err, e) => {
					if (err) {
						res.status(200).send(Promise.reject());
					}
					setTimeout(() => {
						res.status(200).send({ msg: 'GOOD' });
					}, 1000);
				});
		} catch (e) {
			Err.emailMsg(e, 'Documents/indvReviewReport');
			res.status(200).send({ msg: `BAD: ${e}` });
		}
	},
	getindvReviewReport: async (req, res) => {
		try {
			let { name } = req.params;
			res.status(200).sendFile(`${__dirname}/Review_Report.pdf`);
			// res.sendStatus(200);
		} catch (error) {
			Err.emailMsg(error, 'Documents/getindvReviewReport');
			res.send({ msg: `BAD: ${error}` });
		}
	},
	emailIndvReviewReport: async (req, res) => {
		try {
			let { og, emailTo, emailMessage } = req.body;
			let { c_api } = og;
			let pdf = `${__dirname}/Review_Report.pdf`;
			let content = require('fs')
				.readFileSync(pdf)
				.toString('base64');
			let from = c_api.salesforce.sf_id
				? { email: c_api.salesforce.accountManager.email, name: `${c_api.salesforce.accountManager.name} @ Lift Local` }
				: { email: 'manager@liftlocal', name: 'Lift Local' };
			let email = [
				{
					to: {
						name: og.company_name,
						email: emailTo,
					},
					from,
					replyTo: from.email,
					subject: `Lift Local Performance Report`,
					text: `${emailMessage}`,
					html: `${emailMessage}`,
					attachments: [{ filename: 'Report.pdf', content, type: 'application/pdf', disposition: 'attachment' }],
					category: ['report', 'reviews', 'manual', og.c_id.toString()],
				},
			];
			sendEmail.sendMail(email);
			res.status(200).send({ msg: 'GOOD' });
		} catch (error) {
			res.status(200).send({ msg: `BAD: ${error}` });
		}
	},
	indvReviewReportHTML: ({ promoters, demoters, passives, reviews, responses, og, startDate, endDate }) => {
		let gRating = reviews[reviews.length - 1].rating;
		let llRating = reviews[reviews.length - 1].llrating;
		thisMonth = reviews => {
			if (Array.isArray(reviews)) {
				let weeks = parseInt(30 / 7) + 1;
				// reviews = reviews.slice(reviews.length - weeks, reviews.length - 1);
				if (reviews.length >= Math.ceil(30 / 7)) {
					return parseInt(reviews[reviews.length - 1].totalReviews) - parseInt(reviews[reviews.length - weeks].totalReviews);
				} else {
					return reviews[reviews.length - 1].totalReviews;
				}
			}
		};
		style = arr => {
			if (arr[0]) {
				let type = arr[0].rating;
				return arr
					.map(
						(e, i) => `
                <a href='${`https://ll.lift-local.com/indv-customer/${og.cor_id}/${e.cus_id}/${og.c_id}`}' target="_blank" rel="noopener noreferrer" style="margin: 20px 0;">
                            <div class='indvfeed card'>
                               <div style='display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; width: 150px; height: 100%;'>
                                  <div class='circle' style='background-color: ${
																		type <= 2 ? 'rgba(234, 67, 53, 1)' : type === 3 ? 'rgba(255, 241, 153, 1)' : 'rgba(52, 168, 83, 1)'
																	};'>${e.rating}</div>
                                  <h6 style='margin: 0; padding: 0; margin-left: 2.5%;'>${e.first_name} ${e.last_name}</h6>
                               </div>
                              <h6  style='margin: 0; padding: 0;'>${Moment(e.activity.active[e.activity.active.length - 1].date).format('MMM Do, YY')}</h6>
                            </div>
                         </a>
                `,
					)
					.join('');
			} else {
				return '';
			}
		};
		displayStars = rating => {
			rating = typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating).toFixed(1);
			rating = rating.toString();
			let int = rating.split('.')[0];
			let dec = rating.split('.')[1];
			let stars = [];
			for (let i = 0; i < int; i++) {
				stars.push({ link: 'https://res.cloudinary.com/lift-local/image/upload/v1580503925/Google_f29eew.png', type: 'int' });
			}
			if (dec !== '0') {
				stars.push({ link: 'https://res.cloudinary.com/lift-local/image/upload/v1580503925/Google_f29eew.png', type: 'dec' });
			}
			return stars
				.map(
					e =>
						`<img
						src="${e.link}"
						alt="Star Ratings"
						style="
							height: 20px;
							width: ${e.type === 'int' ? '20px' : 20 * (dec / 10)}px;
							overflow: hidden;
                            -o-object-fit: ${e.type === 'int' ? '' : 'cover'};
                            object-fit: ${e.type === 'int' ? '' : 'cover'};
                            -o-object-position: ${e.type === 'int' ? '' : '0'};
                            object-position: ${e.type === 'int' ? '' : '0'};
							margin: 0 1px;
						"
					/>`,
				)
				.join('');
		};
		return `
        <!doctype html>
        <html>
        <head>
         <meta charset="utf-8">
         <title>Review Report</title>
        <style>
        /* prefixed by https://autoprefixer.github.io (PostCSS: v7.0.26, autoprefixer: v9.7.3) */

        @import url("https://fonts.googleapis.com/css?family=Hind+Vadodara&display=swap");
        body {
            width: 1500px;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            line-height: 1;
            background-color: rgb(245, 245, 245);
            font-family: "Hind Vadodara", sans-serif;
        }
        a {
            text-decoration: none;
            color: black;
        }
        h1 {
            font-size: 2rem !important;
        }
        h3 {
            font-size: 1.6rem !important;
        }
        h4 {
            font-size: 1.4rem !important;
        }
        h5 {
            font-size: 1.2rem !important;
        }
        h6 {
            font-size: 1rem !important;
        }
        .body {
            width: 100%;
            min-height: 80vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
        }
        #header {
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            padding: 0 2.5%;
        }
        .threesplit {
            width: 95%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            -webkit-box-align: start;
                -ms-flex-align: start;
                    align-items: flex-start;
            margin: 2.5% auto;
        }
        .topsplit {
            /* 	border: solid black; */
            height: 200px;
            width: 400px;
        }
        .midsplit {
            /* 	border: solid black; */
            height: 400px;
            width: 400px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
        }
        .feedbacksplit {
            /* 	border: solid black; */
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            min-height: 400px;
            width: 400px;
        }
        .breakdown {
            height: 25%;
            width: 95%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
        }
        .progbar {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            width: 100%;
            padding: 2.5%;
        }
        .progress {
            height: 8px !important;
            background-color: rgba(108, 106, 107, 0.25) !important;
        }
        .bigperc {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            height: 90%;
            width: 30%;
        }
        .h1perc {
            margin: 0;
        }
        .ratingRow {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            justifycontent: space-around;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            width: 100%;
            height: 50%;
        }
        .starbox {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            margin-top: 2.5%;
            min-width: 50%;
        }
        .starRating {
            margin: 0;
            padding: 0;
            color: #e7711b;
            font-size: 20px;
            font-family: arial, sans-serif;
            margin-right: 5px;
        }
        .stars {
        }
        .sinceRow {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: distribute;
                justify-content: space-around;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            width: 100px;
            height: 50%;
            margin-top: -20px;
            /* 	border: solid black; */
        }
        .sinceBot {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            width: 187px;
            height: 50%;
        }
        .feedresults {
            width: 80%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
        }
        .indvfeed {
            color: black;
            width: 325px;
            height: 50px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            padding: 0 2.5%;
            margin: 20px 0;
        }
        .circle {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            color: black;
            border-radius: 25px 25px;
            height: 30px;
            width: 30px;
            padding: 0;
        }
        </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
            <link rel="stylesheet"
 		href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/css/materialize.min.css">
        </head>
       
        <body>
         <div class="body">
            <div id='header'>
               <h1>Reviews Report: ${og.company_name}</h1>
               <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 80%;">
               <h4 style="margin: 0; padding: 0;">Exported Date: ${Moment().format('MMM Do, YY')}</h4>
               <h4 style="margin: 0; padding: 0;">Date Range: ${Moment(startDate).format('MMM Do, YY')} - ${Moment(endDate).format('MMM Do, YY')}</h4>
               </div>
            </div>
            <div class='threesplit'>
               <div class='topsplit card'>
                  <div class='ratingRow'>
                     <div style="width: 33%; margin-right: 15%; display: flex; align-items: center;">
                        <h4 style="margin-left: 15%;">Google</h4>
                     </div>
                     <div class='starbox'>
                        <p class='starRating'>${gRating}</p>
                        <div class='stars'>${displayStars(gRating)}</div>
                     </div>
                     <div style="width: 33%;"></div>
                  </div>
                  <div class='sinceRow'>
                     <div class='sinceBot'>
                        <h5>+${og.reviews ? og.reviews.reviews[og.reviews.reviews.length - 1].totalReviews - og.reviews.reviews[0].totalReviews : null}</h5>
                        <p>Since Joining</p>
                     </div>
                     <div class='sinceBot'>
                        <h5>+${og.reviews ? thisMonth(og.reviews.reviews) : null}</h5>
                        <p>Since Month</p>
                     </div>
                  </div>
               </div>
               <div class='topsplit card'>
                  <div class='ratingRow'>
                     <div style="width: 33%; margin-right: 15%; display: flex; align-items: center;">
                        <h4 style="margin-left: 15%;">
                        1st Party
                        <br/>
                        Feedback</h4>
                     </div>
                     <div class='starbox'>
                        <p class='starRating'>${llRating}</p>
                        <div class='stars'>${displayStars(llRating)}</div>
                     </div>
                     <div style="width: 33%;"></div>
                  </div>
                  <div class='sinceRow'>
                     <div class='sinceBot'>
                        <h5>+${og.reviews ? responses : null}</h5>
                        <p>Since Joining</p>
                     </div>
                     <div class='sinceBot'>
                        <h5>+
                        ${
													og.reviews
														? Array.isArray(promoters) && Array.isArray(passives) && Array.isArray(demoters)
															? promoters.filter(
																	e =>
																		Moment(e.last_sent).format('x') >=
																		Moment()
																			.subtract(1, 'month')
																			.format('x'),
															  ).length +
															  passives.filter(
																	e =>
																		Moment(e.last_sent).format('x') >=
																		Moment()
																			.subtract(1, 'month')
																			.format('x'),
															  ).length +
															  demoters.filter(
																	e =>
																		Moment(e.last_sent).format('x') >=
																		Moment()
																			.subtract(1, 'month')
																			.format('x'),
															  ).length
															: ''
														: null
												}</h5>
                        <p>Since Month</p>
                     </div>
                  </div>
               </div>
               <div class='topsplit card'>
                  <div class='ratingRow'>
                     <div style="width: 33%; margin-right: 15%; display: flex; align-items: center;">
                        <h4 style="margin-left: 15%;">
                        3rd Party <br/> Feedback
                        </h4>
                     </div>
                     <div class='starbox'>
                        <p class='starRating'></p>
                        <div class='stars'></div>
                     </div>
                     <div style="width: 33%;"></div>
                  </div>
                  <div class='sinceRow'>
                     <div class='sinceBot'>
                        <h5>+0</h5>
                        <p>Since Joining</p>
                     </div>
                     <div class='sinceBot'>
                        <h5>+0</h5>
                        <p>Since Month</p>
                     </div>
                  </div>
               </div>
            </div>
            <div class='threesplit'>
               <div class='midsplit card'>
                  <canvas id="doughnut-chart" width="300px" height="300px"></canvas>
                  <script>
                     new Chart(document.getElementById("doughnut-chart"), {
                        type: "doughnut",
                        data: {
                           labels: ["Promoters", "Passives", "Demoters"],
                           datasets: [{
                              label: "Ratings",
                              data: [${promoters.length}, ${passives.length}, ${demoters.length}],
                              backgroundColor: ['rgba(52, 168, 83, 1)', 'rgba(255, 241, 153, 1)', 'rgba(234, 67, 53, 1)'],
                              hoverBackgroundColor: ['rgba(52, 168, 83, .5)', 'rgba(255, 241, 153, .5)', 'rgba(234, 67, 53, .5)'],
                           }]
                        },
                        options: {
                           title: {
                              display: true,
                              text: "Feedback Ratings",
                              animation: {
                                 duration: 0
                              },
                              responsiveAnimationDuration: 0
                           }
                        }
                     });
                  </script>
               </div>
               <div class='midsplit card'>
                  <h5 class='midTitle' style="margin-left:5%;">NPS Breakdown</h5>
                  <div class='breakdown'>
                     <div class='bigperc'>
                        <h1 class='h1perc' style="color: rgba(52, 168, 83, 1)">${((promoters.length / responses) * 100).toFixed(0)}%</h1>
                        <h6>Promoters</h6>
                     </div>
                     <h1 style=" margin: 2.5% 0 0; ">-</h1>
                     <div class='bigperc'>
                        <h1 class='h1perc' style="color: rgba(234, 67, 53, 1)">${((demoters.length / responses) * 100).toFixed(0)}%</h1>
                        <h6>Detractors</h6>
                     </div>
                     <h1 style=" margin: 2.5% 0 0; ">=</h1>
                     <div class='bigperc'>
                        <h1 class='h1perc' style="color: rgba(52, 168, 83, 1)">${Math.abs(
													((promoters.length / responses) * 100).toFixed(0) - ((demoters.length / responses) * 100).toFixed(0),
												)}</h1>
                        <h6>NPScore</h6>
                     </div>
                  </div>
                  <hr style='width:90%;' />
                  <div class='progbar'>
                     <h6 style='padding: 0; margin: 0;'>
                        Promoters (4-5) <b>${promoters.length}</b>
                     </h6>
                     <div class="progress" style="width: 40%; margin-top: 5%;">
                        <div class="determinate" style="width: ${((promoters.length / responses) * 100).toFixed(
													0,
												)}%; background-color: rgba(52, 168, 83, 1);"></div>
                     </div>
                  </div>
                  <div class='progbar'>
                     <h6 style='padding: 0; margin: 0;'>
                        Promoters (3) <b>${passives.length}</b>
                     </h6>
                     <div class="progress" style="width: 40%; margin-top: 5%;">
                        <div class="determinate" style="width: ${((passives.length / responses) * 100).toFixed(
													0,
												)}%; background-color: rgba(255, 241, 153, 1);"></div>
                     </div>
                  </div>
                  <div class='progbar'>
                     <h6 style='padding: 0; margin: 0;'>
                        Promoters (1-2) <b>${demoters.length}</b>
                     </h6>
                     <div class="progress" style="width: 40%; margin-top: 5%;">
                        <div class="determinate" style="width: ${((demoters.length / responses) * 100).toFixed(
													0,
												)}%; background-color: rgba(234, 67, 53, 1);"></div>
                     </div>
                  </div>
               </div>
               <div class='midsplit card'></div>
            </div>
            <div class='threesplit'>
               <div class='feedbacksplit'>
                  <h4 style="margin: 0; padding: 0;">Promoter</h4>
                  <p style="margin: 0; padding: 0;">${Math.ceil((promoters.length / responses) * 100)}% of Feedback</p>
                  <hr style="width: 90%; " />
                  <div class='feedresults' style="height: ${promoters.length >= 10 ? '700' : promoters.length * 50 + promoters.length * 20}px">
                     ${style(promoters.slice(0, 10))}
                  </div>
               </div>
               <div class='feedbacksplit'>
                  <h4 style="margin: 0; padding: 0;">Passive</h4>
                  <p style="margin: 0; padding: 0;">${Math.ceil((passives.length / responses) * 100)}% of Feedback</p>
                  <hr style="width: 90%; " />
                  <div class='feedresults'  style="height: ${passives.length >= 10 ? '700' : passives.length * 50 + passives.length * 20}px">
                  ${style(passives.slice(0, 10))}
                  </div>
               </div>
               <div class='feedbacksplit'>
                  <h4 style="margin: 0; padding: 0;">Demoter</h4>
                  <p style="margin: 0; padding: 0;">${Math.ceil((demoters.length / responses) * 100)}% of Feedback</p>
                  <hr style="width: 90%; " />
                  <div class='feedresults'  style="height: ${demoters.length >= 10 ? '700' : demoters.length * 50 + demoters.length * 20}px">
                  ${style(demoters.slice(0, 10))}
                  </div>
               </div>
            </div>
         </div>
      </body>
       
        </html>
        `;
	},
};
