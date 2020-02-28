import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EmailContainer } from './../../../utilities/index';
import ReactTooltip from 'react-tooltip';
import ContentEditable from 'react-contenteditable';
// import './../../../reset.css';
const DEV = true;
let link = !DEV ? 'https://ll.liftlocal.com/' : 'http://localhost:3000/';

class Email extends Component {
	constructor() {
		super();

		this.state = {};
	}
	componentDidMount() {}
	keywords(str, comp, cust, loc) {
		cust = Array.isArray(cust) ? cust[0] : cust;
		comp = Array.isArray(comp) ? comp[0] : comp;
		return str;
		// if (str === 'NO') {
		// 	let check = str => {
		// 		str = str.split('.');
		// 		let table = str[0];
		// 		let col = str[1];
		// 		if (table === 'comp') {
		// 			return comp[col];
		// 		} else if (table === 'cust') {
		// 			return cust[col];
		// 		}
		// 	};
		// 	if (str.includes('☀')) {
		// 		str = str.split(' ');
		// 		let items = str.map((e, i) => {
		// 			if (e.includes('☀')) {
		// 				e = e.split('☀')[1];
		// 				return check(e);
		// 			} else {
		// 				return e;
		// 			}
		// 		});
		// 		return items.join(' ').replace(/ ,/gi, ',');
		// 	} else {
		// 		return str;
		// 	}
		// } else {
		// 	return str;
		// }
	}
	formatPhoneNumber(phoneNumberString) {
		var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
		var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			var intlCode = match[1] ? '+1 ' : '';
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		}
		return null;
	}
	render() {
		let body, thanks, question;
		let { loc, type, comp, email, updateEmail, updateSignature } = this.props;
		let { one, two, three } = this.props.format;
		let cust = { first_name: 'Ryan', last_name: 'Hutch', email: 'liftreviewslocal@gmail.com', id: '2' };
		if (type === 'pr') {
			two = '2';
			body = email.pr.pr_body.body ? this.keywords(email.pr.pr_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.pr.pr_body.question ? this.keywords(email.pr.pr_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.pr.pr_body.thanks ? this.keywords(email.pr.pr_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		} else if (type === 'or') {
			body = email.or.or_body.body ? this.keywords(email.or.or_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.or.or_body.question ? this.keywords(email.or.or_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.or.or_body.thanks ? this.keywords(email.or.or_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		} else if (type === 'sr') {
			body = email.sr.sr_body.body ? this.keywords(email.sr.sr_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.sr.sr_body.question ? this.keywords(email.sr.sr_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.sr.sr_body.thanks ? this.keywords(email.sr.sr_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		} else if (type === 'spr') {
			body = email.spr.spr_body.body ? this.keywords(email.spr.spr_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.spr.spr_body.question ? this.keywords(email.spr.spr_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.spr.spr_body.thanks ? this.keywords(email.spr.spr_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		} else if (type === 'fr') {
			body = email.fr.fr_body.body ? this.keywords(email.fr.fr_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.fr.fr_body.question ? this.keywords(email.fr.fr_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.fr.fr_body.thanks ? this.keywords(comp.fr_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		} else if (type === 's') {
			body = email.s.s_body.body ? this.keywords(email.s.s_body.body, comp, cust, loc) : 'Cannot Get Body';
			question = email.s.s_body.question ? this.keywords(email.s.s_body.question, comp, cust, loc) : 'Cannot Get Question';
			thanks = email.s.s_body.thanks ? this.keywords(email.s.s_body.thanks, comp, cust, loc) : 'Cannot Get Thanks';
		}
		return (
			<EmailContainer right="0">
				<p style={{ margin: '0', padding: '0', marginTop: '-50%' }} data-tip data-for="from_email">
					☀
				</p>
				<ReactTooltip id="from_email" type="dark" effect="float" place="bottom">
					<span>
						To add dynamic info choose from one below
						<h6>Customer Info</h6>
						<ul style={{ textAlign: 'left' }}>
							<li>First Name: ☀customer.first_name☀</li>
							<li>Last Name: ☀customer.last_name☀</li>
							<li>Email: ☀customer.email☀</li>
						</ul>
						{/* <h6>Company Info</h6>
						<ul>
							<li>First Name: company.first_name☀</li>
							<li>Last Name: company.last_name☀</li>
							<li>Email: company.email☀</li>
						</ul> */}
					</span>
				</ReactTooltip>
				<div
					style={{
						texAlign: 'center',
						width: '90%',
						margin: '0',
						padding: '2.5%',
						border: 'solid rgba(0, 0, 0, 0.25) 1px',
						backgroundColor: 'rgba(255, 255, 255, .75)',
						// marginLeft: '10%',
					}}
					className="hoverable"
				>
					{one === '1' ? comp.logo ? <img src={comp.logo} alt="Company Logo" style={{ maxWidth: '200px', maxHeight: '100px' }} /> : '' : ``}
					<div style={{ textAlign: 'left', margin: '0', padding: '0' }}>
						{/* <p style={{ fontSize: ' 1.5em' }}>{body ? body : ''}</p> */}
						<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
							<div className="input-field">
								<textarea
									rows="5"
									style={{ borderBottom: 'none', boxShadow: 'none', minHeight: '10vh' }}
									id="textarea1"
									className="materialize-textarea"
									value={body}
									onChange={e => updateEmail(e.target.value, 'body,body')}
								></textarea>
							</div>
						</form>
						<form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
							<div className="input-field">
								<textarea
									rows="25"
									style={{ borderBottom: 'none', boxShadow: 'none', minHeight: '6vh' }}
									id="textarea1"
									className="materialize-textarea"
									value={question}
									onChange={e => updateEmail(e.target.value, 'body,question')}
								></textarea>
							</div>
						</form>
					</div>
					<div style={{ textAlign: 'left' }}>
						{two === '1' ? (
							<div style={{ padding: '.5% 2.5% 0 0', marginLeft: 0, textAlign: 'center' }}>
								<br />
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/1/email/${loc}`}
									id="one"
									style={{
										display: 'inline-block',
										border: 'solid black 2px',
										borderRadius: '50%',
										height: '50px',
										width: '50px',
										verticalAlign: 'middle',
										margin: '0 2.5%',
										backgroundColor: 'rgba(255, 15, 15, .7)',
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<h4 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>1</h4>
								</a>
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/2/email/${loc}`}
									id="two"
									style={{
										display: 'inline-block',
										border: 'solid black 2px',
										borderRadius: '50%',
										height: '50px',
										width: '50px',
										verticalAlign: 'middle',
										margin: '0 2.5%',
										backgroundColor: 'rgba(255, 125, 15, .7)',
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<h4 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>2</h4>
								</a>
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/3/email/${loc}`}
									id="three"
									style={{
										display: 'inline-block',
										border: 'solid black 2px',
										borderRadius: '50%',
										height: '50px',
										width: '50px',
										verticalAlign: 'middle',
										margin: '0 2.5%',
										backgroundColor: 'rgba(255, 250, 15, 0.7)',
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<h4 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>3</h4>
								</a>
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/4/email/${loc}`}
									id="four"
									style={{
										display: 'inline-block',
										border: 'solid black 2px',
										borderRadius: '50%',
										height: '50px',
										width: '50px',
										verticalAlign: 'middle',
										margin: '0 2.5%',
										backgroundColor: 'rgba(100, 255, 15, 0.7)',
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<h4 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>4</h4>
								</a>
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/5/email/${loc}`}
									id="five"
									style={{
										display: 'inline-block',
										border: 'solid black 2px',
										borderRadius: '50%',
										height: '50px',
										width: '50px',
										verticalAlign: 'middle',
										margin: '0 2.5%',
										backgroundColor: 'rgba(25, 200, 50, 0.7)',
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<h4 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>5</h4>
								</a>
								<br />
								<div style={{ margin: ' 2.5% 0 0 0' }}>
									<p style={{ display: 'inline-block', margin: '.5% 10%', fontSize: '1em' }}>0 = Not likely</p>
									<p style={{ display: 'inline-block', margin: '.5% 10%', fontSize: '1em' }}>5 = Very likely</p>
								</div>
								<br />
							</div>
						) : two === '2' ? (
							<div style={{ padding: '.5 % 2.5 % 0 0', marginLeft: 0, textAlign: 'center' }}>
								<a
									href={`${link}feedback/rating/${comp.c_id}/${cust.id}/direct/email/${loc}`}
									style={{
										backgroundColor: `${comp.accent_color ? (!comp.accent_color.includes('#') ? '#' + comp.accent_color : comp.accent_color) : 'gray'}`,
										outline: 'none',
										border: 'none',
										color: 'white',
										textAlign: 'center',
										textDecoration: 'none',
										display: 'inline-block',
										fontSize: '16px',
										margin: '4px 2px',
										cursor: 'pointer',
										padding: ' 15px 36px',
									}}
								>
									Leave A Review
								</a>
							</div>
						) : (
							``
						)}
					</div>
					{three === '1' ? (
						<div style={{ display: 'inline-block', width: '100%', margin: ' 2.5% 0', textAlign: 'left' }}>
							<p style={{ marginTop: '3.5%', fontSize: ' 1em' }}>{thanks ? thanks : null}</p>
							<div style={{ display: 'inline-block', width: '80%', textAlign: 'left', verticalAlign: 'textTop' }}>
								<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>{comp.owner_name.first + ' @ ' + comp.company_name}</p>
								<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>{comp.address.street}</p>
								<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>
									{comp.address.state}, USA, {comp.address.zip}
								</p>
								<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>{this.formatPhoneNumber(comp.phone.phone)}</p>
							</div>
							<a href={`${link}feedback/unsubscribe/${comp.cor_id}/1/${comp.c_id}`} style={{ textDecoration: 'underline', display: 'inline-block' }}>
								<p>Unsubscribe</p>
							</a>
						</div>
					) : three === '2' ? (
						<div>
							<div style={{ display: 'inline-block', width: '100%', margin: '2.5 % 0', textAlign: 'left' }}>
								<p style={{ marginTop: '3.5%', fontSize: ' 1em' }}>{thanks ? thanks : null}</p>
								{comp.logo ? (
									<img src={comp.logo} alt="Company Logo" style={{ maxWidth: '19%', maxHeight: '100px', padding: '0', margin: '0', textAlign: 'left' }} />
								) : (
									''
								)}
							</div>
							<div style={{ display: 'inline-block', width: '100%', margin: '2.5 % 0', textAlign: 'left' }}>
								<div style={{ display: 'inline-block', width: '80%', textAlign: 'left' }}>
									<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>{comp.owner_name.first + ' @ ' + comp.company_name}</p>
									<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>{comp.address.street}</p>
									<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>
										{comp.address.state}, USA, {comp.address.zip}
									</p>
									<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>{this.formatPhoneNumber(comp.phone.phone)}</p>
								</div>
							</div>
							<a href={`${link}feedback/unsubscribe/${comp.cor_id}/1/${comp.c_id}`} style={{ textDecoration: 'underline', display: 'inline-block' }}>
								<p>Unsubscribe</p>
							</a>
						</div>
					) : three === '3' ? (
						<div
							style={{
								minHeight: '20vh',
								width: '105%',
								margin: '5% 0 0 -1vw',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
							}}
						>
							<ContentEditable
								className="reset"
								html={email.signature} // innerHTML of the editable div
								disabled={false} // use true to disable edition
								onChange={e => updateSignature(e.target.value)} // handle innerHTML change
								style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
							/>
							{/* <form className="col" style={{ width: '100%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
								<div className="input-field">
									<textarea
										rows="5"
										style={{ borderBottom: 'none', boxShadow: 'none', minHeight: '10vh' }}
										id="textarea1"
										className="materialize-textarea"
										value={email.signature}
										onChange={e => updateSignature(e.target.value)}
									></textarea>
								</div>
							</form> */}
						</div>
					) : (
						``
					)}
				</div>
			</EmailContainer>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Email);
