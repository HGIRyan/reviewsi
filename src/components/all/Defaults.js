import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, LargeContentHolder, NoDiv, LoadingWrapperSmall } from './../../utilities/index';
// import AddonEmail from './function/AddonEmail';
import ReviewLanding from './function/ReviewLanding';
// import AddonLanding from './function/AddonLanding';
import axios from 'axios';
import ReviewEmail from './function/Email';
import { Select, Modal } from 'react-materialize';
import { ColorExtractor } from 'react-color-extractor';

class Defaults extends Component {
	constructor() {
		super();

		this.state = {
			type_: 's',
			loading: true,
			addon: {},
			ratingLanding: 3,
			defaults: {},
			addon_landing: {},
			cross_sell: {},
			email: {},
			leadgen: {},
			referral: {},
			review_landing: {},
			settings: {},
			winback: {},
			img: '',
			color: '',
			rating: 3,
			colors: [],
			activeFormat: { one: '1', two: '1', three: '3' },
			addonEmail: 0,
			addonType: 'winback',
			addonLType: 'winback',
			addonSubject: '',
			updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: false },
			positive: {},
			passive: {},
			demoter: {},
			updating: false,
			imgLoaded: true,
			updateImg: false,
		};
	}
	async componentDidMount() {
		document.title = 'Lift Local - Default Settings';
		await this.getDefaults();
		this.setState({ loading: false });
		window.scrollTo(0, 0);
	}
	async getDefaults() {
		let { type } = this.props.match.params;
		type = type ? type : 'NA';
		await axios.get(`/api/get/default/${type}`).then(res => {
			if (res.data.msg === 'GOOD') {
				let { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback } = res.data.defaults;
				let { fr, or, pr, s, spr, sr } = email;
				let fr_ = { fr_body: fr.fr_body, fr_subject: fr.fr_subject };
				let or_ = { or_body: or.or_body, or_subject: or.or_subject };
				let pr_ = { pr_body: pr.pr_body, pr_subject: pr.pr_subject };
				let s_ = { s_body: s.s_body, s_subject: s.s_subject };
				let sr_ = { sr_body: sr.sr_body, sr_subject: sr.sr_subject };
				let spr_ = { spr_body: spr.spr_body, spr_subject: spr.spr_subject };
				let emails = { fr: fr_, or: or_, s: s_, pr: pr_, sr: sr_, spr: spr_ };
				let format = settings.email_format;
				format = {
					s: { one: format.s.toString().split('')[0], two: format.s.toString().split('')[1], three: format.s.toString().split('')[2] },
					fr: { one: format.fr.toString().split('')[0], two: format.fr.toString().split('')[1], three: format.fr.toString().split('')[2] },
					or: { one: format.or.toString().split('')[0], two: format.or.toString().split('')[1], three: format.or.toString().split('')[2] },
					pr: { one: format.pr.toString().split('')[0], two: format.pr.toString().split('')[1], three: format.pr.toString().split('')[2] },
					spr: { one: format.spr.toString().split('')[0], two: format.spr.toString().split('')[1], three: format.spr.toString().split('')[2] },
					sr: { one: format.sr.toString().split('')[0], two: format.sr.toString().split('')[1], three: format.sr.toString().split('')[2] },
				};
				let email_1 = { leadgen: leadgen.email_1, winback: winback.email_1, referral: referral.email_1, cross_sell: cross_sell.email_1 };
				let email_2 = { leadgen: leadgen.email_2, winback: winback.email_2, referral: referral.email_2, cross_sell: cross_sell.email_2 };
				let email_3 = { leadgen: leadgen.email_3, winback: winback.email_3, referral: referral.email_3, cross_sell: cross_sell.email_3 };
				let email_4 = { leadgen: leadgen.email_4, winback: winback.email_4, referral: referral.email_4, cross_sell: cross_sell.email_4 };
				let email_5 = { leadgen: leadgen.email_5, winback: winback.email_5, referral: referral.email_5, cross_sell: cross_sell.email_5 };
				let email_6 = { leadgen: leadgen.email_6, winback: winback.email_6, referral: referral.email_6, cross_sell: cross_sell.email_6 };
				let addon = { email_1, email_2, email_3, email_4, email_5, email_6 };
				let positive = review_landing.positive;
				let passive = review_landing.passive;
				let demoter = review_landing.demoter;
				this.setState({
					addon_landing,
					cross_sell,
					leadgen,
					referral,
					winback,
					// email: reviewEmails.fr.fr_body ? reviewEmails : email,
					addon,
					review_landing,
					settings,
					img: settings.logo ? settings.logo : 'https://res.cloudinary.com/lift-local/image/upload/v1569512765/Transparent_Large_Logo_c2jemz.png',
					color: settings.color,
					emails,
					format,
					activeFormat: format.s,
					addonSubject: email_1.winback.subject,
					passive,
					demoter,
					positive,
				});
			} else if (res.data.msg === 'NO SESSION') {
				this.props.history.push('/', this.props.location.pathname);
			} else {
				alert('Could Not Find Industry');
			}
		});
	}
	renderSwatches() {
		const { colors } = this.state;
		if (colors[0]) {
			return colors.map((color, id) => {
				return (
					<div
						key={id}
						onClick={() => this.setState({ color: color.split('#')[1] })}
						style={{
							backgroundColor: color,
							width: 50,
							height: 50,
							margin: '5px',
							cursor: 'pointer',
						}}
					>
						<p style={{ fontSize: '.5em' }}>{color}</p>
					</div>
				);
			});
		}
	}
	getColors = colors => {
		if (colors[0]) {
			this.setState({ colors: [] });
			this.setState(state => ({ colors: [...state.colors, ...colors], color: colors[0] }));
		} else {
			this.setState({ colors: [], color: '#FFFF' });
		}
	};
	async uploader(e) {
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = e => {
			const formData = { file: e.target.result, img: e.target.result };
			this.setState({ img: e.target.result, formData });
		};
	}
	upload() {
		let { client_id, loc } = this.props.match.params;
		let { img } = this.state;
		let { formData, color } = this.state;
		if (formData.file) {
			axios.post('/api/logo/new', { formData, client_id, loc, img, color }).then(res => {
				res = res.data;
				if (res.msg === 'GOOD') {
					this.setState({ msg: 'Logo Saved', img: res.link });
					alert('Uploaded New Image');
				} else {
					alert('There has been an error in uploading new logo');
				}
			});
		}
	}
	async update() {
		let { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback, img, color } = this.state;
		let { type } = this.props.match.params;
		settings.logo = img;
		settings.color = color;
		type = type ? type : 'All';
		await axios.post('/api/update/default', { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback, type }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.setState({ saved: 'Defaults Updated' });
			}
		});
	}
	async updateReviewEmail() {
		this.setState({ updating: { reviewEmail: true, addonEmail: false, reviewLanding: false, addonLanding: false } });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { settings, format, emails, formData, color } = this.state;
		let { s, fr, pr, or, spr, sr } = format;
		settings.email_format = {
			s: parseInt(s.one + s.two + s.three),
			fr: parseInt(fr.one + fr.two + fr.three),
			or: parseInt(or.one + or.two + or.three),
			pr: parseInt(pr.one + pr.two + pr.three),
			spr: parseInt(spr.one + spr.two + spr.three),
			sr: parseInt(sr.one + sr.two + sr.three),
		};
		settings.color = color;
		settings.from_email = settings.from_email ? settings.from_email : 'no-reply@liftlocal.com';
		if (settings.from_email.emailValidate()) {
			await axios.post('/api/defaults/update/review-email', { settings, emails, formData, type }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: false } });
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('Invalid From Email');
		}
	}
	async updateAllReviewEmail(newImg) {
		this.setState({ updating: { reviewEmail: true, addonEmail: false, reviewLanding: false, addonLanding: false } });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { settings, format, emails, formData, color } = this.state;
		let { s, fr, pr, or, spr, sr } = format;
		settings.email_format = {
			s: parseInt(s.one + s.two + s.three),
			fr: parseInt(fr.one + fr.two + fr.three),
			or: parseInt(or.one + or.two + or.three),
			pr: parseInt(pr.one + pr.two + pr.three),
			spr: parseInt(spr.one + spr.two + spr.three),
			sr: parseInt(sr.one + sr.two + sr.three),
		};
		settings.color = color;
		settings.from_email = settings.from_email ? settings.from_email : 'no-reply@liftlocal.com';
		if (settings.from_email.emailValidate()) {
			await axios.post('/api/defaults/update/review-email/all', { settings, emails, type, newImg }).then(res => {
				if (res.data.msg === 'GOOD') {
					alert('Click Refresh Button In Menu For All Changes To Be Viewed');
					window.location.reload();
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('Invalid From Email');
		}
	}
	async saveReviewLanding() {
		this.setState({ updating: true });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { passive, positive, demoter } = this.state;
		let review_landing = { passive, positive, demoter };
		await axios.post('/api/defaults/update/review-landing', { type, review_landing }).then(res => {
			if (res.data.msg === 'GOOD') {
				alert('Click Refresh Button In Menu For All Changes To Be Viewed');
				window.location.reload();
			} else {
				alert(res.data.msg);
				this.setState({ updating: false });
			}
		});
	}
	async updateAllReviewLanding() {
		// this.setState({ updating: true });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { passive, positive, demoter } = this.state;
		let review_landing = { passive, positive, demoter };
		await axios.post('/api/defaults/update/review-landing/all', { type, review_landing }).then(res => {
			if (res.data.msg === 'GOOD') {
				window.location.reload();
			} else {
				alert(res.data.msg);
				this.setState({ updating: false });
			}
		});
	}
	async updateAddonEmail() {
		this.setState({ updating: { reviewEmail: false, addonEmail: true, reviewLanding: false, addonLanding: false } });
		// let { type } = this.props.match.params;
		// type = type ? type : 'ALL';
	}
	async updateAddonLanding() {
		this.setState({ updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: true } });
		// let { type } = this.props.match.params;
		// type = type ? type : 'ALL';
	}
	changeEmail(val, click) {
		let { addonEmail, addon, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		if (click) {
			this.setState({ addonEmail: val, addonSubject: addon[`email_${val + 1}`][addonType].subject });
		} else {
			if (val === 1) {
				if (addonEmail < 5) {
					this.setState({ addonEmail: addonEmail + 1, addonSubject: addon[`email_${addonEmail + 2}`][addonType].subject });
				} else {
					this.setState({ addonEmail: 0, addonSubject: addon.email_1[addonType].subject });
				}
			} else if (val === -1) {
				if (addonEmail > 0) {
					this.setState({ addonEmail: addonEmail - 1, addonSubject: addon[`email_${addonEmail}`][addonType].subject });
				} else {
					this.setState({ addonEmail: 5, addonSubject: addon.email_6[addonType].subject });
				}
			} else {
				alert('Bruh');
			}
		}
	}
	async changeFormat(val, num) {
		let { type_ } = this.state;
		this.setState(prevState => ({
			format: { ...prevState.format, [type_]: { ...prevState.format[type_], [num]: val } },
			activeFormat: { ...prevState.activeFormat, [num]: val },
		}));
	}
	async updateEmail(val, part) {
		let { type_ } = this.state;
		if (part.includes('body')) {
			part = part.split(',')[1];
			this.setState(prevState => ({
				emails: {
					...prevState.emails,
					[type_]: { ...prevState.emails[type_], [`${type_}_body`]: { ...prevState.emails[type_][`${type_}_body`], [part]: val } },
				},
			}));
		} else {
			this.setState(prevState => ({ ...prevState.emails, [type_]: { ...prevState.emails[type_], [part]: val } }));
		}
	}
	async updateReviewSubject(val) {
		let { type_ } = this.state;
		this.setState(prevState => ({
			emails: {
				...prevState.emails,
				[type_]: { ...prevState.emails[type_], [`${type_}_subject`]: val },
			},
		}));
	}
	async updateReviewLanding(val, part) {
		let { ratingLanding } = this.state;
		let type = ratingLanding <= 2 ? 'demoter' : ratingLanding === 3 ? 'passive' : 'positive';
		if (part.includes('body')) {
			this.setState(prevState => ({
				review_landing: {
					...prevState.review_landing,
					// eslint-disable-next-line
					[type]: { ...prevState.review_landing[type], ['body']: val },
				},
			}));
		} else {
			this.setState(prevState => ({
				review_landing: {
					...prevState.review_landing,
					// eslint-disable-next-line
					[type]: { ...prevState.review_landing[type], ['thanks']: val },
				},
			}));
		}
	}
	async updateLanding(val, part) {
		let { rating } = this.state;
		if (rating <= 2) {
			this.setState(prevState => ({
				demoter: { ...prevState.demoter, [part]: val },
			}));
		} else if (rating === 3) {
			this.setState(prevState => ({
				passive: { ...prevState.passive, [part]: val },
			}));
		} else if (rating >= 4) {
			this.setState(prevState => ({
				positive: { ...prevState.positive, [part]: val },
			}));
		}
	}
	async updateSkip(val) {
		let { rating } = this.state;
		if (rating <= 2) {
			this.setState(prevState => ({ demoter: { ...prevState.demoter, skip: val === '1' ? true : false } }));
		} else if (rating === 3) {
			this.setState(prevState => ({ passive: { ...prevState.passive, skip: val === '1' ? true : false } }));
		} else {
			this.setState(prevState => ({ positive: { ...prevState.positive, skip: val === '1' ? true : false } }));
		}
	}
	checkSkip() {
		let { rating, demoter, positive, passive } = this.state;
		if (rating <= 2) {
			return demoter.skip ? '1' : '0';
		} else if (rating === 3) {
			return passive.skip ? '1' : '0';
		} else {
			return positive.skip ? '1' : '0';
		}
	}
	async changeTypeEmail(val) {
		let { addonEmail, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		this.setState(prevState => ({
			addon: {
				...prevState.addon,
				[`email_${addonEmail + 1}`]: {
					...prevState.addon[`email_${addonEmail + 1}`],
					[addonType]: { ...prevState.addon[`email_${addonEmail + 1}`][addonType], body: val },
				},
			},
		}));
	}
	async getUploaded() {
		if (!Array.isArray(this.state.images)) {
			await axios.get('/api/uploadedimages').then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ images: res.data.res.resources, imgLoaded: false });
				}
			});
		}
	}
	async updateSubject(val) {
		let { addonEmail, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		this.setState(prevState => ({
			emails: {
				...prevState.emails,
				[`email_${addonEmail + 1}`]: {
					...prevState.emails[`email_${addonEmail + 1}`],
					[addonType]: { ...prevState.emails[`email_${addonEmail + 1}`][addonType], subject: val },
				},
			},
			subject: val,
		}));
	}
	Review(event) {
		let { value } = event.target;
		this.setState({ emailFormat: value });
	}
	ReviewType(e) {
		let { value } = e.target;
		this.setState({ ReviewType: value });
	}
	Addons(e) {
		let { value } = e.target;
		this.setState({ addonType: value });
	}
	render() {
		let { settings, img, format, emails, type_ } = this.state;
		let reviewInputStyle = {
			width: '100%',
			marginBottom: '5%',
		};
		// let emailLabel = {
		// 	width: '50%',
		// 	display: 'flex',
		// 	justifyContent: 'flex-start',
		// 	marginBottom: '5%',
		// 	// marginLeft: '20%',
		// 	padding: '0',
		// };
		let og = this.props.history.location.state.info[0];
		og.logo = this.state.img;
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'settings', type: 'defaults' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<LargeContentHolder>
							{this.state.saved ? this.state.saved : ''}
							<NoDiv width="100%" padding="2.5% 0">
								<NoDiv direction="column" just="space-around" height="100%" width="25%" padding=" 0 2.5%" className="card hoverable">
									<h4>Review Settings</h4>
									<LoadingWrapperSmall loading={this.state.updating.reviewEmail}>
										<button
											style={{ zIndex: '0' }}
											className="btn primary-color primary-hover waves-effect waves-light"
											onClick={() => {
												this.updateReviewEmail();
											}}
										>
											Save Review Email
										</button>
									</LoadingWrapperSmall>
									<Modal
										open={this.state.openREmailWarning}
										style={{ outline: 'none' }}
										trigger={
											<button
												style={{ marginTop: '5%' }}
												className="btn primary-color primary-hover"
												onClick={() => this.setState({ openREmailWarning: true })}
											>
												Update All Review Emails
											</button>
										}
									>
										{this.state.updateImg ? (
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
												<h3 style={{ color: 'red', fontSize: '1.5em', textAlign: 'center' }}>
													Warning: Are You Sure You Want To Update{' '}
													<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
														{this.props.match.params.type ? `ALL ${this.props.match.params.type}` : 'ALL'}
													</b>
													<br />
													Accounts With The New Image?
												</h3>
												<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<button className="btn primary-color primary-hover" onClick={() => this.updateAllReviewEmail(true)}>
														Yes
													</button>
													<button className="btn primary-color primary-hover" onClick={() => this.updateAllReviewEmail(false)}>
														No
													</button>
												</div>
											</div>
										) : (
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
												<h3 style={{ color: 'red', fontSize: '1.5em' }}>
													Warning: Are You Sure You Want To Update{' '}
													<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
														{this.props.match.params.type ? `ALL ${this.props.match.params.type}` : 'ALL'}
													</b>
													Accounts With These Settings?
												</h3>
												<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<button className="btn primary-color primary-hover" onClick={() => this.setState({ updateImg: true })}>
														Yes
													</button>
													<button className="btn primary-color primary-hover" onClick={() => this.setState({ openREmailWarning: false })}>
														No
													</button>
												</div>
											</div>
										)}
									</Modal>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.auto_amt ? settings.auto_amt.toString() : '0'}
												type="number"
												onChange={e => this.setState({ settings: { ...settings, auto_amt: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Auto AMT</label>
									</div>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.process ? settings.process.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, process: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Request Process</label>
									</div>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.repeat ? settings.repeat.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, repeat: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Repeat Request</label>
									</div>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.first ? settings.first.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, first: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Not Opened Second Reminder</label>
									</div>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.open ? settings.open.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, open: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Opened No Feedback Reminder</label>
									</div>
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.positive ? settings.positive.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, positive: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Positive Feedback No Click Reminder</label>
									</div>
									{/* <div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												value={settings.frequency ? settings.frequency.toString() : '0'}
												onChange={e => this.setState({ settings: { ...settings, frequency: e.target.value ? parseInt(e.target.value) : 0 } })}
											/>
										</h2>
										<label>Report Frequency</label>
									</div> */}
									<div className="input-field" style={reviewInputStyle}>
										<h2 style={{ margin: '0' }}>
											<input
												id="email"
												type="email"
												className="validate"
												value={settings.from_email}
												onChange={e => this.setState({ settings: { ...settings, from_email: e.target.value } })}
											/>
											<span className="helper-text" data-error="Invalid Email Format" data-success="" />
										</h2>
										<label>From Email</label>
									</div>
								</NoDiv>
								<div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									{/* REVIEW EMAIL */}
									<div>
										<div style={{ minHeight: '50vh', width: '100%', marginLeft: '5%', padding: '2.5%' }} className="card hoverable">
											<div style={{ height: '25%' }}>
												<h5>Email Type</h5>
												<Select value={type_} onChange={e => this.setState({ type_: e.target.value, activeFormat: format[e.target.value] })}>
													<option value="s">Standard First Send</option>
													<option value="fr">First Reminder</option>
													<option value="sr">Second Reminder</option>
													<option value="or">Opened Reminder</option>
													<option value="pr">Positive Feedback Reminder</option>
													<option value="spr">Second Positive Reminder</option>
												</Select>
											</div>
											<div style={{ height: '25%' }}>
												<h5>Header</h5>
												<Select value={this.state.activeFormat.one} onChange={e => this.changeFormat(e.target.value, 'one')}>
													<option value="1">Logo Header</option>
													<option value="2">No Logo</option>
													{/* <option value="3">3</option> */}
												</Select>
											</div>
											<div style={{ height: '25%' }}>
												<h5>Feedback</h5>
												<Select value={this.state.activeFormat.two} onChange={e => this.changeFormat(e.target.value, 'two')}>
													<option value="1" disabled={type_ === 'pr'}>
														1 - 5 Feedback
													</option>
													<option value="2">Direct Feedback</option>
													{/* <option value="3">3</option> */}
												</Select>
											</div>
											<div style={{ height: '25%' }}>
												<h5>Signature</h5>
												<Select value={this.state.activeFormat.three} onChange={e => this.changeFormat(e.target.value, 'three')}>
													<option value="1">Company Info</option>
													<option value="2">Company Info + Logo</option>
													{/* <option value="3">3</option> */}
												</Select>
											</div>
										</div>
										<div style={{ marginLeft: '5%', display: 'flex', width: '100%', flexDirection: 'column', padding: '0' }} className="card hoverable">
											<div style={{ display: 'flex' }}>
												{/* <div style={{ maxWidth: '150px', maxHeight: '100px', display: 'flex', justifyContent: 'center' }}>
													<ColorExtractor getColors={this.getColors}>
														<img src={img} alt="COMPANY NAME" style={{ maxHeight: '100%', maxWidth: '100%' }} />
													</ColorExtractor>
												</div> */}
												{/* <form action="#" style={{ cursor: 'pointer', width: '60%' }}>
													<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<div className="btn  primary-color primary-hover">
																<span style={{ display: 'flex', justifyContent: 'center' }}>
																	<i className="material-icons">cloud_upload</i> Upload
																</span>
																<input type="file" name="file" onChange={e => this.uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
															</div>
														</div>
														<div className="file-path-wrapper" style={{ maxWidth: '20vw' }}>
															<input className="file-path validate" type="text" />
														</div>
													</div>
												</form> */}
												<div style={{ display: 'flex', alignItems: 'center', height: '15vh' }}>
													<form action="#" style={{ cursor: 'pointer' }}>
														<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
															<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
																<ColorExtractor getColors={this.getColors}>
																	<img src={img} alt="COMPANY NAME" style={{ maxWidth: '200px', height: 'auto' }} />
																</ColorExtractor>
																<input type="file" name="file" onChange={e => this.uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
															</div>
														</div>
													</form>
													<div
														style={{
															width: '',
															height: '100%',
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															justifyContent: 'space-around',
														}}
													>
														<button
															className="btn primary-color primary-hover"
															style={{ display: 'flex', justifyContent: 'center' }}
															onClick={() => {
																this.upload();
															}}
														>
															<i className="material-icons">cloud_upload</i> Upload
														</button>
														<div onClick={() => this.getUploaded()}>
															<Modal
																open={this.state.modalOpen}
																trigger={<button className="btn primary-color primary-hover">Search</button>}
																style={{ outline: 'none' }}
																bottomSheet={false}
																fixedFooter={false}
															>
																<div
																	style={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center',
																		minHeight: Array.isArray(this.state.images) ? '15vh' : '5vh',
																	}}
																>
																	<LoadingWrapper loading={this.state.imgLoaded}>
																		<div style={{ width: '90%' }}>
																			{this.state.link ? (
																				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '15vh' }}>
																					<img src={this.state.link} alt="" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '5vh' }} />
																					<div style={{ display: 'flex', width: '60%', justifyContent: 'space-around', alignItems: 'center' }}>
																						<button className="btn primary-color primary-hover" onClick={() => this.setState({ link: '' })}>
																							Back
																						</button>
																						{this.state.img === this.state.link ? (
																							<h3>Cool, updated Bro</h3>
																						) : (
																							<button className="btn primary-color primary-hover" onClick={() => this.setState({ img: this.state.link })}>
																								Update Logo
																							</button>
																						)}
																					</div>
																				</div>
																			) : Array.isArray(this.state.images) ? (
																				this.state.images.map((e, i) => {
																					return (
																						<img
																							src={e.url}
																							alt=""
																							className="hoverable"
																							style={{ maxWidth: '200px', maxHeight: '200px', margin: '1vh', border: 'solid black 1px', cursor: 'pointer' }}
																							key={i}
																							onClick={() => {
																								this.setState({ link: e.url, images: {}, logo: e.url });
																							}}
																						/>
																					);
																				})
																			) : null}
																		</div>
																	</LoadingWrapper>
																</div>
															</Modal>
														</div>
													</div>
												</div>
												{/* <div className="file-path-wrapper" style={{ maxWidth: '90%' }}>
															<input className="file-path validate" type="text" />
														</div> */}
												{/* <button
													style={{ marginLeft: '5%', display: 'flex', justifyContent: 'center', zIndex: '0' }}
													className="btn primary-color primary-hover waves-effect waves-light"
													onClick={() =>
														this.setState({
															img: 'https://res.cloudinary.com/lift-local/image/upload/v1569512765/Transparent_Large_Logo_c2jemz.png',
															color: '6c6a6b',
														})
													}
												>
													REMOVE
												</button> */}
											</div>
											<div
												style={{
													backgroundColor: this.state.color.includes('#') ? this.state.color : `#${this.state.color}`,
													width: '75px',
													height: '75px',
													margin: '5px',
													border: 'solid black 2px',
													fontSize: '.8em',
												}}
											>
												SELECTED {this.state.color.includes('#') ? this.state.color : `#${this.state.color}`}{' '}
											</div>
											<div style={{ display: 'flex', flexWrap: 'wrap' }}>{this.renderSwatches()}</div>
											<h2>{this.state.msg ? this.state.msg : null}</h2>
										</div>
									</div>
								</div>
								<div style={{}}>
									<div className="input-field" style={{ minWidth: '50%', marginLeft: '10%', marginBottom: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												style={{ margin: '0' }}
												id="subject"
												type="text"
												className="validate"
												value={this.state.emails ? this.state.emails[type_][`${type_}_subject`] : 'Subject'}
												onChange={e => this.updateReviewSubject(e.target.value)}
											/>
											<span className="helper-text" data-error="Invalid Subject" data-success="" />
										</h2>
										<label style={{ margin: '0' }} htmlFor="subject">
											Subject:{' '}
										</label>
									</div>
									<div style={{ marginLeft: '2.5%' }}>
										{og ? (
											<ReviewEmail comp={og} type={type_} format={this.state.activeFormat} email={emails} updateEmail={this.updateEmail.bind(this)} />
										) : null}
									</div>
								</div>
							</NoDiv>
							<hr />
							<div style={{ width: '100%', minHeight: '80vh', display: 'flex' }}>
								<div
									style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '2.5%' }}
								>
									<h3>Landing Page Settings</h3>
									<hr style={{ marginLeft: '0' }} />
									<div className="input-field">
										<label style={{ margin: '0' }}>Rating:</label>
										<Select value={this.state.rating.toString()} onChange={e => this.setState({ rating: parseInt(e.target.value) })}>
											<option value="2">1-2</option>
											<option value="3">3</option>
											<option value="4">4-5</option>
										</Select>
									</div>
									<div className="input-field">
										<label style={{ margin: '0' }}>Skip Landing:</label>
										<Select value={this.checkSkip()} onChange={e => this.updateSkip(e.target.value)}>
											<option value="0">Do Not Skip</option>
											<option value="1">Skip</option>
										</Select>
									</div>
									<LoadingWrapperSmall loading={this.state.updating} text="UPDATING">
										<button className="btn primary-color primary-hover" onClick={() => this.saveReviewLanding()}>
											Update Landing Page
										</button>
									</LoadingWrapperSmall>
									<Modal
										open={this.state.openRLandingWarning}
										style={{ outline: 'none' }}
										trigger={
											<button
												style={{ marginTop: '5%' }}
												className="btn primary-color primary-hover"
												// onClick={() => this.setState({ openRLandingWarning: true })}
											>
												Update All Landing Pages
											</button>
										}
									>
										<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
											<h3 style={{ color: 'red', fontSize: '1.5em' }}>
												Warning: Are You Sure You Want To Update{' '}
												<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
													{this.props.match.params.type ? `ALL ${this.props.match.params.type}` : 'ALL'}
												</b>
												Accounts With These Settings?
											</h3>
											<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<button className="btn primary-color primary-hover" onClick={() => this.updateAllReviewLanding()}>
													Yes
												</button>
												<button className="btn primary-color primary-hover" onClick={() => this.setState({ openRLandingWarning: false })}>
													No
												</button>
											</div>
										</div>
									</Modal>
								</div>
								<div
									style={{
										width: '60%',
										height: '80%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										// border: 'solid black',
										padding: '2.5% 0',
									}}
								>
									{og ? (
										<ReviewLanding
											og={og}
											rating={this.state.rating}
											updateLanding={this.updateLanding.bind(this)}
											demoter={this.state.demoter}
											passive={this.state.passive}
											positive={this.state.positive}
										/>
									) : null}
								</div>
							</div>
							{/* <h1>
								Addon Settings
								<hr />
							</h1>
							<div style={{ display: 'flex', width: '100%' }}>
								<div
									style={{
										height: '40vh',
										width: '25%',
										marginLeft: '5%',
										// marginTop: '5%',
										// border: 'solid black 2px',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
										justifyContent: 'space-around',
									}}
								>
									<h5>Select Email ☀</h5>
									<button
										className="btn primary-color primary-hover waves-effect waves-light"
										onClick={() => {
											this.updateAddonEmail();
										}}
										style={{ zIndex: '0' }}
									>
										Save Email
									</button>
									<Select onChange={e => this.Addons(e)} value={this.state.addonType}>
										<option value="winback">Winbacks</option>
										<option value="leadgen">LeadGen</option>
										<option value="ref">Referral</option>
										<option value="cross">CrossSell</option>
									</Select>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 0} onChange={() => this.changeEmail(0, true)} />
										<span className="tab">Email 1</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 1} onChange={() => this.changeEmail(1, true)} />
										<span className="tab">Email 2</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 2} onChange={() => this.changeEmail(2, true)} />
										<span className="tab">Email 3</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 3} onChange={() => this.changeEmail(3, true)} />
										<span className="tab">Email 4</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 4} onChange={() => this.changeEmail(4, true)} />
										<span className="tab">Email 5</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.addonEmail === 5} onChange={() => this.changeEmail(5, true)} />
										<span className="tab">Email 6</span>
									</label>
									<div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
										<p
											onClick={() => this.changeEmail(-1)}
											style={{ display: 'flex', alignItems: 'center' }}
											className="btn btn-small primary-color primary-hover"
										>
											<i className="material-icons">arrow_back_ios</i>
										</p>
										<p
											onClick={() => this.changeEmail(1)}
											style={{ display: 'flex', alignItems: 'center' }}
											className="btn btn-small primary-color primary-hover"
										>
											<i className="material-icons">arrow_forward_ios</i>
										</p>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
									<div className="input-field" style={{ width: '50%', marginLeft: '10%', marginBottom: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												style={{ margin: '0' }}
												id="subject"
												type="text"
												className="validate"
												value={this.state.addonSubject}
												onChange={e => this.updateSubject(e.target.value)}
											/>
											<span className="helper-text" data-error="Invalid Subject" data-success="" />
										</h2>
										<label style={{ margin: '0' }} htmlFor="subject">
											Subject:{' '}
										</label>
									</div>
									<AddonEmail
										type={this.state.addonType}
										addon={this.state.addon}
										email={this.state.addonEmail}
										og={og}
										changeBody={this.changeTypeEmail.bind(this)}
										data={this.state}
									/>
								</div>
							</div>
							<br />
							<hr />
							<br />
							<Select onChange={e => this.setState({ addonLType: e.target.value })} value={this.state.addonLType}>
								<option value="winback">Winbacks</option>
								<option value="leadgen">LeadGen</option>
								<option value="ref">Referral</option>
								<option value="cross">CrossSell</option>
							</Select>
							<button
								className="btn primary-color primary-hover waves-effect waves-light"
								onClick={() => {
									this.updateAddonLanding();
								}}
								style={{ zIndex: '0' }}
							>
								Save Landing
							</button>
							<div style={{ width: '90%' }}>
								<AddonLanding landing={addon_landing} data={this.state} />
							</div> */}
						</LargeContentHolder>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Defaults);
