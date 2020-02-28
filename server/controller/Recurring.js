// const { GOOGLE_PLACE_API } = process.env;
let axios = require('axios');
let Defaults = require('./Defaults');
const { SF_SECRET, SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
var jsforce = require('jsforce');

module.exports = {
	syncSF: async app => {
		let db = app.get('db');
		let allComp = await db.info.all_record_business([]);
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
		allComp
			.filter(e => e.c_api)
			.forEach(async e => {
				if (e.c_api.salesforce) {
					let key = e.c_api.salesforce.sf_id;
					//prettier-ignore
					let info = await conn
                        .query( `
                        select asset.name,asset.quantity, account.name, asset.asset_status__c, account.id, account.ownerid, account.status__c,
                        account.close_date__c from asset where asset.accountid = '${key}'`,
					        function ( err, result ) {
					            if (err) {
					                return console.error('This error is in the auth callback: ' + err);
					            }
					         } )
					    .then(res => {
					        return res;
                        } );
					let accountManager;
					let account_status;
					let assets = [];
					// {asset: '', quantity:'', status:''}
					info.records.forEach(el => {
						let name;
						if (el.Name.includes('inback')) {
							name = 'winback';
						} else if (el.Name.includes('ross')) {
							name = 'cross_sell';
						} else if (el.Name.includes('eview')) {
							name = 'reviews';
						} else if (el.Name.includes('aps')) {
							name = 'maps';
						}
						assets.push({ asset: name, quantity: el.Quantity, status: el.Asset_Status__c });
						account_status = el.Account.Status__c;
						accountManager = Defaults.accountManager(el.Account.OwnerId);
						e.active_prod[name] = el.Asset_Status__c.toLowerCase().includes('active') ? true : false;
					});
					e.c_api.salesforce.accountManager = accountManager;
					e.c_api.salesforce.assets = assets;
					let active = account_status.toLowerCase().includes('active') ? true : false;
					// Update Company Table Row
					await db.update.sf_company_sync([e.c_id, active, e.active_prod, e.c_api]);
				}
			});
	},
	rankTest: async () => {
		await axios.get('https://api.dataforseo.com/', 'rhutchison@liftlocal.com');
	},
};
