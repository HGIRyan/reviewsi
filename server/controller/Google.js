const { GOOGLE_PLACE_API, AccountID, GMBBearer } = process.env;
let axios = require('axios');
const Err = require('./Error');
let fs = require('fs');
const moment = require('moment');
const credentials = {
	client: {
		id: '<client-id>',
		secret: '<client-secret>',
	},
	auth: {
		tokenHost: 'https://api.oauth.com',
	},
};
module.exports = {
	getToken: async () => {
		const oauth2 = require('simple-oauth2').create(credentials);
		const authorizationUri = oauth2.authorizationCode.authorizeURL({
			redirect_uri: 'http://localhost:4020/api/token',
			scope: '<scope>',
			state: '<state>',
		});
		const tokenConfig = {
			code: '<code>',
			redirect_uri: 'http://localhost:4020/api/token',
			scope: '<scope>',
		};

		try {
			const result = await oauth2.authorizationCode.getToken(tokenConfig);
			const accessToken = oauth2.accessToken.create(result);
			console.log(accessToken);
		} catch (error) {
			console.log('Access Token Error', error.message);
		}
	},
	Search: async (req, res) => {
		try {
			let { searchTerm } = req.body;
			searchTerm = searchTerm.toLowerCase().replace(/- /g, '');
			searchTerm = searchTerm.replace(/ /g, '+');
			await axios
				.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchTerm}&components=country:us&key=${GOOGLE_PLACE_API}`)
				.then(resp => {
					if (resp.status === 200) {
						if (resp.data.status === 'OK' || resp.data.status === 'ZERO_RESULTS') {
							let data = resp.data.predictions;
							res.status(200).send({ msg: 'GOOD', data });
						} else {
							res.status(200).send({ msg: 'Not Good, Some Error Occured. Contact your IT Department for details' });
						}
					} else {
						res.status(200).send({ msg: 'Super Not Good, Some Error Occured. Contact your IT Department for details' });
					}
				})
				.catch(err => console.log('ERROR::', err));
		} catch (e) {
			Err.emailMsg(e, 'Google/Search');
		}
	},
	Details: async (req, res) => {
		try {
			let { placeId } = req.body;
			await axios
				.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_PLACE_API}`)
				.then(resp => {
					if (resp.status === 200) {
						if (resp.data.status === 'OK') {
							data = resp.data.result;
							res.status(200).send({ msg: 'GOOD', data });
						}
					}
				})
				.catch(err => console.log('ERROR:: ', err));
		} catch (e) {
			Err.emailMsg(e, 'Google/Details');
		}
	},
	gmbLocationList: async app => {
		// try {
		console.log('Getting Locations');
		let times = 0;
		let pageToken = '';
		let locations = [];
		let loop = async () => {
			let request = async npt => {
				await axios
					.get(`https://mybusiness.googleapis.com/v4/accounts/${AccountID}/locations${npt ? `?pageToken=${npt}` : ''}`, {
						headers: {
							Authorization: `Bearer ${GMBBearer}`,
						},
					})
					.then(res => {
						times = times + 1;
						pageToken = res.data.nextPageToken ? res.data.nextPageToken : '';
						console.log('Page:', times, 'Locations:', res.data.locations.length);
						res.data.locations.map(async e => {
							await app.get('db').gmb.location_id([e.name.split('/')[3], e.locationName, e.locationState.isVerified]);
							// locations.push({ locationid: e.name.split('/')[3] });
						});
						setInterval(() => {
							loop();
						}, 5000);
						// return res.data;
					});
			};
			if (times === 0) {
				await request();
			} else if (pageToken) {
				request(pageToken);
			} else {
				console.log('DONE');
			}
		};
		loop();
		// } catch (error) {
		// 	Err.emailMsg(error, 'Google/gmbLocationList');
		// }
	},
	gmbInsights: async app => {
		let accounts = await app.get('db').gmb.all_accounts([]);
		accounts = accounts.filter(e => e.insights === null && e.verified !== null);
		let insights = async ({ location_id, startTime, endTime }) => {
			return await axios
				.post(
					`https://mybusiness.googleapis.com/v4/accounts/${AccountID}/locations:reportInsights`,
					{
						locationNames: [`accounts/${AccountID}/locations/${location_id}`],
						basicRequest: {
							metricRequests: [
								{
									metric: 'VIEWS_SEARCH',
								},
								{
									metric: 'ACTIONS_PHONE',
								},
								{
									metric: 'ACTIONS_WEBSITE',
								},
								{
									metric: 'QUERIES_DIRECT',
								},
								{
									metric: 'QUERIES_INDIRECT',
								},
								{
									metric: 'QUERIES_CHAIN',
								},
							],
							timeRange: {
								startTime,
								endTime,
							},
						},
					},
					{
						headers: {
							Authorization: `Bearer ${GMBBearer}`,
							accept: 'application/json',
						},
					},
				)
				.then(res => {
					if (res.data.locationMetrics) {
						let data = res.data.locationMetrics[0].metricValues;
						let website = data.filter(e => e.metric === 'ACTIONS_WEBSITE');
						let calls = data.filter(e => e.metric === 'ACTIONS_PHONE');
						let direct = data.filter(e => e.metric === 'QUERIES_DIRECT');
						let indirect = data.filter(e => e.metric === 'QUERIES_INDIRECT');
						let chain = data.filter(e => e.metric === 'QUERIES_CHAIN');
						let views = data.filter(e => e.metric === 'VIEWS_SEARCH');
						website = website[0] ? website[0].totalValue.value : null;
						calls = calls[0] ? calls[0].totalValue.value : null;
						direct = direct[0] ? direct[0].totalValue.value : null;
						indirect = indirect[0] ? indirect[0].totalValue.value : null;
						views = views[0] ? views[0].totalValue.value : null;
						chain = chain[0] ? chain[0].totalValue.value : null;
						return {
							website,
							calls,
							direct,
							indirect,
							chain,
							views,
							total: parseInt(direct) + parseInt(indirect) + parseInt(chain),
							range: { startTime, endTime },
						};
					} else {
						return null;
					}
				});
		};
		for (let ind = 0; ind < accounts.length; ind++) {
			setTimeout(() => {
				const e = accounts[ind];
				let insightobj = { insights: [] };
				console.log(e.location_name);
				for (let i = 17; i > 0; i--) {
					setTimeout(async () => {
						let startTime = moment()
							.subtract(i, 'months')
							.date(1)
							.format();
						let endTime = moment()
							.subtract(i - 1, 'months')
							.date(1)
							.format();
						// console.log(i, startTime, endTime);
						let dat = await insights({ location_id: e.location_id, startTime, endTime });
						if (dat !== null) {
							await insightobj.insights.push(dat);
						}
						if (i === 17) {
							await app.get('db').gmb.new_insights([e.location_id, insightobj]);
						}
					}, 1000 * i);
				}
			}, 10000 * ind);
		}
	},
	gmbCSV: async app => {
		let accounts = await app.get('db').gmb.all_accounts([]);
		accounts = accounts.filter(e => e.insights !== null && e.verified !== null && e.insights.insights[0]);
		let dates = [];
		let startDates = [];
		await accounts[0].insights.insights.map(e => {
			let range = e.range.startTime.split('T')[0] + ' - ' + e.range.endTime.split('T')[0];
			startDates.push(e.range.startTime.split('T')[0]);
			dates.push(range);
		});
		startDates = startDates.reverse();
		const writeStream = fs.createWriteStream(`${__dirname}/gmb_18.csv`);
		writeStream.write(` , , , ${dates.reverse().map(e => e + ',' + ',' + ',' + ',' + ',' + ',')}\n`);
		writeStream.write(`Verified, location_id, location_name, ${dates.reverse().map(e => ' website, calls, direct, indirect, chain, views, total')} \n`);
		// console.log(`Verified, location_id, location_name, ${dates.reverse().map(e => ' website, calls, direct, indirect, chain, views, total')} \n`);
		accounts
			// .slice( 0, 1 )
			.map(e => {
				let emptObj = {
					website: 0,
					calls: 0,
					direct: 0,
					chain: 0,
					views: 0,
					total: 0,
				};
				let name = e.location_name.replace(/,/g, '');
				let id = e.location_id;
				let verified = e.verified ? true : false;
				let one = e.insights.insights.filter(e => e.range.startTime.includes('2018-09-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2018-09-01'))[0]
					: emptObj;
				let two = e.insights.insights.filter(e => e.range.startTime.includes('2018-10-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2018-10-01'))[0]
					: emptObj;
				let three = e.insights.insights.filter(e => e.range.startTime.includes('2018-11-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2018-11-01'))[0]
					: emptObj;
				let four = e.insights.insights.filter(e => e.range.startTime.includes('2018-12-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2018-12-01'))[0]
					: emptObj;
				let five = e.insights.insights.filter(e => e.range.startTime.includes('2019-01-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-01-01'))[0]
					: emptObj;
				let six = e.insights.insights.filter(e => e.range.startTime.includes('2019-02-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-02-01'))[0]
					: emptObj;
				let sev = e.insights.insights.filter(e => e.range.startTime.includes('2019-03-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-03-01'))[0]
					: emptObj;
				let ei = e.insights.insights.filter(e => e.range.startTime.includes('2019-04-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-04-01'))[0]
					: emptObj;
				let nine = e.insights.insights.filter(e => e.range.startTime.includes('2019-05-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-05-01'))[0]
					: emptObj;
				let ten = e.insights.insights.filter(e => e.range.startTime.includes('2019-06-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-06-01'))[0]
					: emptObj;
				let elev = e.insights.insights.filter(e => e.range.startTime.includes('2019-07-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-07-01'))[0]
					: emptObj;
				let twel = e.insights.insights.filter(e => e.range.startTime.includes('2019-08-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-08-01'))[0]
					: emptObj;
				let thirt = e.insights.insights.filter(e => e.range.startTime.includes('2019-09-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-09-01'))[0]
					: emptObj;
				let fourt = e.insights.insights.filter(e => e.range.startTime.includes('2019-10-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-10-01'))[0]
					: emptObj;
				let fift = e.insights.insights.filter(e => e.range.startTime.includes('2019-11-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-11-01'))[0]
					: emptObj;
				let sixt = e.insights.insights.filter(e => e.range.startTime.includes('2019-12-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2019-12-01'))[0]
					: emptObj;
				let sevent = e.insights.insights.filter(e => e.range.startTime.includes('2020-01-01'))[0]
					? e.insights.insights.filter(e => e.range.startTime.includes('2020-01-01'))[0]
					: emptObj;
				writeStream.write(`${verified}, ${id}, ${name}, ${one.website}, ${one.calls}, ${one.direct}, ${one.indirect}, ${one.chain}, ${one.views}, ${one.total}, ${two.website}, ${two.calls}, ${two.direct}, ${two.indirect}, ${two.chain}, ${two.views}, ${two.total}, ${three.website}, ${three.calls}, ${three.direct}, ${three.indirect}, ${three.chain}, ${three.views}, ${three.total}, ${four.website}, ${four.calls}, ${four.direct}, ${four.indirect}, ${four.chain}, ${four.views}, ${four.total}, ${five.website}, ${five.calls}, ${five.direct}, ${five.indirect}, ${five.chain}, ${five.views}, ${five.total}, ${six.website}, ${six.calls}, ${six.direct}, ${six.indirect}, ${six.chain}, ${six.views}, ${six.total}, ${sev.website}, ${sev.calls}, ${sev.direct}, ${sev.indirect}, ${sev.chain}, ${sev.views}, ${sev.total}, ${ei.website}, ${ei.calls}, ${ei.direct}, ${ei.indirect}, ${ei.chain}, ${ei.views}, ${ei.total}, ${nine.website}, ${nine.calls}, ${nine.direct}, ${nine.indirect}, ${nine.chain}, ${nine.views}, ${nine.total}, ${ten.website}, ${ten.calls}, ${ten.direct}, ${ten.indirect}, ${ten.chain}, ${ten.views}, ${ten.total}, ${elev.website}, ${elev.calls}, ${elev.direct}, ${elev.indirect}, ${elev.chain}, ${elev.views}, ${elev.total}, ${twel.website}, ${twel.calls}, ${twel.direct}, ${twel.indirect}, ${twel.chain}, ${twel.views}, ${twel.total}, ${thirt.website}, ${thirt.calls}, ${thirt.direct}, ${thirt.indirect}, ${thirt.chain}, ${thirt.views}, ${thirt.total}, ${fourt.website}, ${fourt.calls}, ${fourt.direct}, ${fourt.indirect}, ${fourt.chain}, ${fourt.views}, ${fourt.total}, ${fift.website}, ${fift.calls}, ${fift.direct}, ${fift.indirect}, ${fift.chain}, ${fift.views}, ${fift.total}, ${sixt.website}, ${sixt.calls}, ${sixt.direct}, ${sixt.indirect}, ${sixt.chain}, ${sixt.views}, ${sixt.total}, ${sevent.website}, ${sevent.calls}, ${sevent.direct}, ${sevent.indirect}, ${sevent.chain}, ${sevent.views}, ${sevent.total}
			`);
			});
	},
	getAccounts: async (req, res) => {
		let { accessToken, api, search } = req.body;
		// console.log(accessToken, api, search);
		let accounts = await req.app.get('db').gmb.all_accounts([]);
		if (api) {
			// GMB REQUEST
			let info = await axios.get(`https://mybusiness.googleapis.com/v4/accounts/${AccountID}/locations?filter=location.locationName=${search}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			res.status(200).send({ msg: 'GOOD', info: info.data });
		} else {
			res.status(200).send({ msg: 'GOOD', info: accounts });
		}
	},
	newInsights: async (req, res) => {
		let insights = async ({ location_id, startTime, endTime, token }) => {
			return await axios
				.post(
					`https://mybusiness.googleapis.com/v4/accounts/${AccountID}/locations:reportInsights`,
					{
						locationNames: [`accounts/${AccountID}/locations/${location_id}`],
						basicRequest: {
							metricRequests: [
								{
									metric: 'VIEWS_SEARCH',
								},
								{
									metric: 'ACTIONS_PHONE',
								},
								{
									metric: 'ACTIONS_WEBSITE',
								},
								{
									metric: 'QUERIES_DIRECT',
								},
								{
									metric: 'QUERIES_INDIRECT',
								},
								{
									metric: 'QUERIES_CHAIN',
								},
							],
							timeRange: {
								startTime,
								endTime,
							},
						},
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
							accept: 'application/json',
						},
					},
				)
				.then(res => {
					if (res.data.locationMetrics) {
						let data = res.data.locationMetrics[0].metricValues;
						let website = data.filter(e => e.metric === 'ACTIONS_WEBSITE');
						let calls = data.filter(e => e.metric === 'ACTIONS_PHONE');
						let direct = data.filter(e => e.metric === 'QUERIES_DIRECT');
						let indirect = data.filter(e => e.metric === 'QUERIES_INDIRECT');
						let chain = data.filter(e => e.metric === 'QUERIES_CHAIN');
						let views = data.filter(e => e.metric === 'VIEWS_SEARCH');
						website = website[0] ? website[0].totalValue.value : null;
						calls = calls[0] ? calls[0].totalValue.value : null;
						direct = direct[0] ? direct[0].totalValue.value : null;
						indirect = indirect[0] ? indirect[0].totalValue.value : null;
						views = views[0] ? views[0].totalValue.value : null;
						chain = chain[0] ? chain[0].totalValue.value : null;
						return {
							website,
							calls,
							direct,
							indirect,
							chain,
							views,
							total: parseInt(direct) + parseInt(indirect) + parseInt(chain),
							range: { startTime, endTime },
						};
					} else {
						return null;
					}
				});
		};
		let { location_id, verified, location_name } = req.body.e;
		let insightobj = { insights: [] };
		for (let i = 17; i > 0; i--) {
			setTimeout(async () => {
				let startTime = moment()
					.subtract(i, 'months')
					.date(1)
					.format();
				let endTime = moment()
					.subtract(i - 1, 'months')
					.date(1)
					.format();
				// console.log(i, startTime, endTime);
				let dat = await insights({ location_id, startTime, endTime, token: req.body.accessToken });
				if (dat !== null) {
					await insightobj.insights.push(dat);
				}
				if (i === 17) {
					await req.app.get('db').gmb.new_insights_account([location_id, location_name, verified, insightobj]);
					let accounts = await req.app.get('db').gmb.all_accounts([]);
					await res.status(200).send({ msg: 'GOOD', info: accounts });
				}
			}, 1000 * i);
		}
	},
};
