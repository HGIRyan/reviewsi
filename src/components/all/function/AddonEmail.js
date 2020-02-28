import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EmailContainer } from './../../../utilities/index';
// import { Slider, Slide } from 'materialize-css';
// import AliceCarousel from 'react-alice-carousel';
// import 'react-alice-carousel/lib/alice-carousel.css';

class Addon extends Component {
	constructor() {
		super();

		this.state = {
			subject: '',
		};
	}
	text(v) {
		if (v.includes('<br/>')) {
			return v
				.split('<br/>')
				.map(e => this.keywords(e, this.props.og, { first_name: 'Ryan', last_name: 'Hutch', email: 'liftreviewslocal@gmail.com', id: '2' }).concat('\n'))
				.join(' ');
		} else return v;
	}
	keywords(str, comp, cust) {
		cust = Array.isArray(cust) ? cust[0] : cust;
		comp = Array.isArray(comp) ? comp[0] : comp;
		if (str) {
			let check = str => {
				str = str.split('.');
				let table = str[0];
				let col = str[1];
				if (table === 'comp') {
					return comp[col];
				} else if (table === 'cust') {
					return cust[col];
				}
			};
			if (str.includes('☀')) {
				str = str.split(' ');
				let items = str.map((e, i) => {
					if (e.includes('☀')) {
						e = e.split('☀')[1];
						return check(e);
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
	}
	AddonType() {
		let { addon, type, email, og, changeBody } = this.props;
		if (type === 'winback' && addon.email_1) {
			let { email_1, email_2, email_3, email_4, email_5, email_6 } = addon;
			let emails = [email_1.winback, email_2.winback, email_3.winback, email_4.winback, email_5.winback, email_6.winback];
			return {
				body: (
					<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
						<div className="input-field">
							<textarea
								rows="5"
								style={{
									borderBottom: 'none',
									boxShadow: 'none',
									minHeight: '15vh',
									display: 'block',
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
								id="textarea1"
								className="materialize-textarea"
								value={this.text(emails[email].body)}
								onChange={e => changeBody(e.target.value, 'body,body')}
							></textarea>
						</div>
					</form>
				),
				signature: (
					<div style={{ display: 'flex' }}>
						<img style={{ maxHeight: '5vh' }} src={og.logo} alt={`${og.company_name}'s Logo`} />
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
							<h6 style={{ margin: '0', padding: '0' }}>
								{og.owner_name.first} @ {og.company_name}
							</h6>
							<p style={{ margin: '0', padding: '0' }}>{og.address.street}</p>
							<p style={{ margin: '0', padding: '0' }}>
								{og.address.city}, {og.address.state} {og.address.zip}
							</p>
						</div>
					</div>
				),
			};
		} else if (type === 'leadgen' && addon.email_1) {
			let { email_1, email_2, email_3, email_4, email_5, email_6 } = addon;
			let emails = [email_1.leadgen, email_2.leadgen, email_3.leadgen, email_4.leadgen, email_5.leadgen, email_6.leadgen];
			return {
				body: (
					<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
						<div className="input-field">
							<textarea
								rows="5"
								style={{
									borderBottom: 'none',
									boxShadow: 'none',
									minHeight: '15vh',
									display: 'block',
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
								id="textarea1"
								className="materialize-textarea"
								value={this.text(emails[email].body)}
								onChange={e => changeBody(e.target.value, 'body,body')}
							></textarea>
						</div>
					</form>
				),
				signature: (
					<div style={{ display: 'flex' }}>
						<img style={{ maxHeight: '5vh' }} src={og.logo} alt={`${og.company_name}'s Logo`} />
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
							<h6 style={{ margin: '0', padding: '0' }}>
								{og.owner_name.first} @ {og.company_name}
							</h6>
							<p style={{ margin: '0', padding: '0' }}>{og.address.street}</p>
							<p style={{ margin: '0', padding: '0' }}>
								{og.address.city}, {og.address.state} {og.address.zip}
							</p>
						</div>
					</div>
				),
			};
		} else if (type === 'ref' && addon.email_1) {
			let { email_1, email_2, email_3, email_4, email_5, email_6 } = addon;
			let emails = [email_1.referral, email_2.referral, email_3.referral, email_4.referral, email_5.referral, email_6.referral];
			return {
				body: (
					<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
						<div className="input-field">
							<textarea
								rows="5"
								style={{
									borderBottom: 'none',
									boxShadow: 'none',
									minHeight: '15vh',
									display: 'block',
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
								id="textarea1"
								className="materialize-textarea"
								value={this.text(emails[email].body)}
								onChange={e => changeBody(e.target.value, 'body,body')}
							></textarea>
						</div>
					</form>
				),
				signature: (
					<div style={{ display: 'flex' }}>
						<img style={{ maxHeight: '5vh' }} src={og.logo} alt={`${og.company_name}'s Logo`} />
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
							<h6 style={{ margin: '0', padding: '0' }}>
								{og.owner_name.first} @ {og.company_name}
							</h6>
							<p style={{ margin: '0', padding: '0' }}>{og.address.street}</p>
							<p style={{ margin: '0', padding: '0' }}>
								{og.address.city}, {og.address.state} {og.address.zip}
							</p>
						</div>
					</div>
				),
			};
		} else if (type === 'cross' && addon.email_1) {
			let { email_1, email_2, email_3, email_4, email_5, email_6 } = addon;
			let emails = email_1.cross
				? [email_1.cross, email_2.cross, email_3.cross, email_4.cross, email_5.cross, email_6.cross]
				: [email_1.cross_sell, email_2.cross_sell, email_3.cross_sell, email_4.cross_sell, email_5.cross_sell, email_6.cross_sell];
			return {
				body: (
					<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
						<div className="input-field">
							<textarea
								rows="5"
								style={{
									borderBottom: 'none',
									boxShadow: 'none',
									minHeight: '15vh',
									display: 'block',
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
								id="textarea1"
								className="materialize-textarea"
								value={this.text(emails[email].body)}
								onChange={e => changeBody(e.target.value, 'body,body')}
							></textarea>
						</div>
					</form>
				),
				signature: (
					<div style={{ display: 'flex' }}>
						<img style={{ maxHeight: '5vh' }} src={og.logo} alt={`${og.company_name}'s Logo`} />
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
							<h6 style={{ margin: '0', padding: '0' }}>
								{og.owner_name.first} @ {og.company_name}
							</h6>
							<p style={{ margin: '0', padding: '0' }}>{og.address.street}</p>
							<p style={{ margin: '0', padding: '0' }}>
								{og.address.city}, {og.address.state} {og.address.zip}
							</p>
						</div>
					</div>
				),
			};
		} else if (type === 'N/A') {
			return 'User Has No Services';
		} else {
			return {
				body: 'NO BODY',
				signature: 'NO SIGNATURE',
			};
		}
	}
	render() {
		let type = this.AddonType();
		return (
			<EmailContainer>
				<div
					style={{
						texAlign: 'center',
						maxWidth: '100%',
						minWidth: '80%',
						background: 'rgba(108, 106, 107, 0.1)',
						margin: '5%',
						marginTop: '0%',
						padding: '2.5%',
						maxHeight: '700px',
						minHeight: '500px',
					}}
					className="hoverable"
				>
					{/* Email Box */}
					<div style={{ margin: '5% 5% 0 5%' }}>{type.body}</div>
					<button className="btn" style={{ margin: '0 5% 5% 5%' }}>
						Get Quote
					</button>
					<div style={{ margin: '5% 5% 0 5%' }}>{type.signature}</div>
					<div style={{ margin: '10% 5% 0 5%' }}>
						{/*Footer*/}
						<hr />
						Copyright © 2020 Lift Local, All rights reserved.
						<br />
						<br />
						<a href="Google.com">unsubscribe</a>
					</div>
				</div>
			</EmailContainer>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Addon);
