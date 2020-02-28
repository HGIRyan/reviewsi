import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NoDiv, LoadingWrapper, StyledReviewLinks, LoadingWrapperSmall } from './../../../utilities/index';
import axios from 'axios';
import moment from 'moment';

class ReviewLandingPage extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			links: [],
			res: {
				demoter: { thanks: '', body: '' },
				passive: { thanks: '', body: '' },
				positive: { thanks: '', body: '' },
				links: [{ site: '', link: '' }],
			},
			w: 1920,
			h: 1080,
			feedback: '',
			msg: '',
			submitting: false,
			linkIndex: false,
			logo: 'https://res.cloudinary.com/lift-local/image/upload/v1582323045/unnamed_1_qu2m0v.png',
		};
	}
	async componentDidMount() {
		window.scrollTo(-5, 0);
		document.body.style.width = '100vw';
		document.body.style.height = '100vh';
		this.setState({ w: window.innerWidth, h: window.innerHeight });
		let { client_id, cust_id, rating, source, cor_id } = this.props.match.params;
		await axios.post('/api/company_logo', { client_id }).then(res => {
			if (res.data.msg === 'GOOD') {
				console.log(res.data.logo);
				this.setState({ logo: res.data.logo[0].logo });
			}
		});
		if (rating <= 5 || rating === 'direct') {
			await this.rating(client_id, cust_id, rating, source, cor_id);
		}
	}

	async rating(client_id, cust_id, rating, source, cor_id) {
		await axios.post('/api/feedback/reviews/record', { client_id, cust_id, rating, source, cor_id }).then(res => {
			res = res.data;
			if (res.msg === 'GOOD') {
				let info = res.info[0];
				let resp = {
					demoter: info.demoter_landing,
					passive: info.passive_landing,
					positive: info.positive_landing,
					links: info.review_links,
				};
				let checkSkip = false;
				if (rating !== 'direct') {
					if (rating <= 2) {
						checkSkip = resp.demoter.skip;
					} else if (rating === 3) {
						checkSkip = resp.passive.skip;
					} else {
						checkSkip = resp.positive.skip;
					}
				}
				this.setState({ res: resp, og: info, cust: res.cust[0] });
				if (rating !== 'direct' && !checkSkip) {
					this.setState({ loading: false });
				} else if (rating === 'direct' || checkSkip) {
					let item = info.review_links.links[0];
					let index = 0;
					this.clickSite(item, index);
				}
			} else {
				// this.props.history.push('/feedback/rating/848/15096/8/email/1');
			}
		});
	}
	async submitFeedback() {
		// Set Click To False
		// <Route path="/feedback/rating/:cor_id/:cust_id/:rating/:source/:client_id" component={ReviewLandingPage} />
		let { feedback, cust } = this.state;
		let { cust_id, client_id, cor_id, rating } = this.props.match.params;
		cust.activity.active.push({ date: moment().format('YYYY-MM-DD'), type: 'Left Feedback' });
		let activity = cust.activity;
		this.setState({ submitting: true });
		await axios.post('/api/record/reviews/direct-feedback', { feedback, cust_id, client_id, cor_id, rating, activity, cust, info: this.state.og }).then(res => {
			res = res.data;
			if (res.status === 'GOOD') {
				this.setState({ msg: res.msg, submitting: false });
			} else {
				this.setState({ msg: res.msg });
			}
		});
	}
	async clickSite(item, i) {
		// Set Click To True and wich site was clicked
		let { site, link } = item;
		let { cust } = this.state;
		this.setState({ linkIndex: i });
		let { cust_id, client_id, cor_id, rating } = this.props.match.params;
		cust.activity.active.push({ date: moment().format('YYYY-MM-DD'), type: `Clicked to leave review on ${site}` });
		let activity = cust.activity;
		await axios.post('/api/record/reviews/click-site', { site, cust_id, client_id, cor_id, rating, activity, cust }).then(res => {
			res = res.data;
			if (res.status === 'GOOD') {
				if (rating < 3 && site.toLowerCase() === 'google' && this.state.og.place_id) {
					this.setState({ msg: res.msg });
					window.location.href = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${this.state.og.place_id}`;
				} else {
					this.setState({ msg: res.msg });
					window.location.href = link;
				}
			} else {
				this.setState({ msg: res.msg });
				window.location.href = link;
			}
		});
	}
	reviewSites(links) {
		let { w } = this.state;
		const linkStyle = {
			display: 'flex',
			flexDirection: 'column',
			width: w >= 1100 ? '15vw' : '90vw',
			margin: '1%',
		};
		let siteLogos = site => {
			if (site === 'Google') {
				return 'https://res.cloudinary.com/lift-local/image/upload/v1580936186/Google%20Logo.png';
			}
		};
		return (
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
				{links.map((item, i) => {
					return (
						<LoadingWrapperSmall loading={this.state.linkIndex === i} key={i} style={{ margin: '1vh' }}>
							<div style={linkStyle} key={i} onClick={() => this.clickSite(item, i)} className="border-hover">
								<img src={siteLogos(item.site)} alt="Company Logos" style={{ maxWidth: '15vw', maxHeight: '7vh' }} />
								<StyledReviewLinks site={item.site}>
									{/* {item.site} */}
									Write A Review
								</StyledReviewLinks>
							</div>
						</LoadingWrapperSmall>
					);
				})}
			</div>
		);
	}
	feedback(rating) {
		let { loading, showLinks, w } = this.state;
		let { links } = this.state.res;
		links = links.links;
		if (!links[0] && this.state.og.place_id) {
			links = [
				{
					site: 'Google',
					link: `https://search.google.com/local/writereview?placeid=${this.state.og.place_id}`,
				},
			];
		}
		if (rating <= 2) {
			return (
				<LoadingWrapper loading={loading}>
					<NoDiv direction="column" align="center" width="100%" margin="0">
						<form className="col" style={{ width: '50%', margin: '2.5% 0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
							<div
								className="input-field feedbacktextarea"
								style={{ border: 'solid gray 1px', padding: '0 2.5%', boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '' }}
							>
								<textarea
									rows="5"
									style={{ minHeight: '6vh', width: w >= 1100 ? '40vw' : '90vw', borderBottom: 'none' }}
									id="textarea1"
									className="materialize-textarea"
									placeholder="Please Leave Your Feedback Here"
									onChange={e => this.setState({ feedback: e.target.value })}
									value={this.state.feedback}
									type="text"
									data-length="2555"
									onFocus={() => {
										this.setState({ focus: !this.state.focus });
									}}
									onBlur={() => {
										this.setState({ focus: !this.state.focus });
									}}
									autoFocus
								></textarea>
							</div>
						</form>
						<LoadingWrapperSmall loading={this.state.submitting}>
							<button onClick={() => this.submitFeedback()} className="btn primary-color primary-hover">
								Submit
							</button>
						</LoadingWrapperSmall>
						{/* <p
							className="underline"
							onClick={() => {
								this.setState({ showLinks: !showLinks });
							}}
						>
							Click To See Our Online Profiles
						</p> */}
						<br />
						{/* {showLinks ? this.reviewSites(links) : null} */}
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
							<h6>Or... Leave a Review on one of the following</h6>
							<div style={{ display: 'flex', flexWrap: 'wrap', width: '30%', justifyContent: 'flex-start' }}>
								{links.map((e, i) => {
									let siteLogos = site => {
										if (site === 'Google') {
											return 'https://res.cloudinary.com/lift-local/image/upload/v1580936186/Google%20Logo.png';
										}
									};
									return (
										<div
											key={i}
											style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer' }}
											onClick={() => this.clickSite(e, i)}
										>
											<img src={siteLogos(e.site)} alt="Logo" style={{ maxHeight: '40px', margin: '0', padding: '0' }} />
											<h4 style={{ textDecoration: 'underline', margin: '0', padding: '0' }}>{e.site}</h4>
										</div>
									);
								})}
							</div>
						</div>
					</NoDiv>
				</LoadingWrapper>
			);
		} else if (parseInt(rating) === 8) {
			return (
				<LoadingWrapper loading={loading}>
					<h1>Thank You For Your Feedback.</h1>{' '}
				</LoadingWrapper>
			);
		} else if (parseInt(rating) === 3) {
			return (
				<LoadingWrapper loading={loading}>
					<NoDiv direction="column" align="center" width="100%" margin=".5% 0">
						<form className="col" style={{ width: '50%', margin: '2.5% 0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
							<div
								className="input-field feedbacktextarea"
								style={{ border: 'solid gray 1px', padding: '0 2.5%', boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '' }}
							>
								<textarea
									rows="5"
									style={{ minHeight: '6vh', width: w >= 1100 ? '40vw' : '90vw', borderBottom: 'none' }}
									id="textarea1"
									className="materialize-textarea"
									placeholder="Please Leave Your Feedback Here:"
									onChange={e => this.setState({ feedback: e.target.value })}
									value={this.state.feedback}
									type="text"
									data-length="2555"
									onFocus={() => {
										this.setState({ focus: !this.state.focus });
									}}
									onBlur={() => {
										this.setState({ focus: !this.state.focus });
									}}
									autoFocus
								/>
							</div>
						</form>
						<LoadingWrapperSmall loading={this.state.submitting}>
							<button onClick={() => this.submitFeedback()} className="btn primary-color primary-hover">
								Submit
							</button>
						</LoadingWrapperSmall>
						<h1>Or...</h1>
						{this.reviewSites(links)}
					</NoDiv>
				</LoadingWrapper>
			);
		} else if (rating >= 4) {
			return (
				<LoadingWrapper loading={loading}>
					<NoDiv direction="column" align="center" width="100%" margin=".5% 0">
						{!showLinks ? (
							<NoDiv direction="column" align="center">
								<br />
								{this.reviewSites(links)}
								<br />
								{this.state.showFeedback ? (
									<form className="col" style={{ width: '50%', margin: '2.5% 0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
										<div
											className="input-field feedbacktextarea"
											style={{ boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '', border: this.state.focus ? 'solid gray 1px' : '' }}
										>
											<textarea
												rows="5"
												style={{ minHeight: '6vh', width: w >= 1100 ? '40vw' : '90vw', borderBottom: 'none' }}
												id="textarea1"
												className="materialize-textarea"
												placeholder="Please Leave Your Feedback Here:"
												onChange={e => this.setState({ feedback: e.target.value })}
												value={this.state.feedback}
												type="text"
												data-length="2555"
												onFocus={() => {
													this.setState({ focus: !this.state.focus });
												}}
												onBlur={() => {
													this.setState({ focus: !this.state.focus });
												}}
												autoFocus
											/>
										</div>
									</form>
								) : null}
								{this.state.showFeedback ? (
									<LoadingWrapperSmall loading={this.state.submitting}>
										<button onClick={() => this.submitFeedback()} className="btn primary-color primary-hover">
											Submit
										</button>
									</LoadingWrapperSmall>
								) : null}

								<p
									className="underline"
									onClick={() => {
										this.setState({ showFeedback: !this.state.showFeedback });
									}}
								>
									{this.state.showFeedback ? 'Close' : 'Click To Leave Direct Feedback'}
								</p>
							</NoDiv>
						) : null}
					</NoDiv>
				</LoadingWrapper>
			);
		}
	}
	footer() {
		let { og, w } = this.state;
		return (
			<div style={{ width: '90vw', position: 'realative', bottom: 10, display: 'flex', flexDirection: 'column', fontSize: '.75em' }}>
				<hr />
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h6 style={{ margin: '0', padding: '0' }}>{og ? og.company_name : 'Company Name'}</h6>
					<br />
					{w >= 1100 && og ? (
						<div style={{ margin: '0' }}>
							<p style={{ margin: '0', marginTop: '0%' }}>Phone: {og.phone.phone[0]}</p>
							<p style={{ marginTop: '0%' }}>
								Address: {og.address.street}, {og.address.city} {og.address.state}, {og.address.zip}
							</p>
						</div>
					) : null}
				</div>
				Powered By Lift Local ©
			</div>
		);
	}
	render() {
		let { rating } = this.props.match.params;
		let { w, og } = this.state;
		let body, thanks;
		let { demoter, positive, passive } = this.state.res;
		if (parseInt(rating) <= 2) {
			body = demoter.body;
			thanks = demoter.thanks;
		} else if (parseInt(rating) === 3) {
			body = passive.body;
			thanks = passive.thanks;
		} else if (parseInt(rating) <= 5) {
			body = positive.body;
			thanks = positive.thanks;
		} else {
			body = '';
			thanks = '';
		}
		const textStyle = {
			maxWidth: '95vw',
			height: 'auto',
			fontSize: w >= 1100 ? '2em' : '1.25em',
			margin: '2.5%',
		};

		return (
			<LoadingWrapper loading={this.state.loading} logo={this.state.logo} page="landing">
				<div style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<div
						style={{
							width: w >= 1100 ? '50vw' : '100vw',
							// height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							minHeight: w >= 1100 ? '100%' : '85vh',
							padding: '2.5%',
							marginTop: '2.5%',
							marginBottom: '2.5%',
						}}
						className={w >= 1100 ? 'card' : ''}
					>
						{/*Logo Header*/}
						{og ? <img src={og.logo} alt={`${og.company_name}'s Company Logo`} /> : null}
						{/*Body And Thanks*/}
						<p className="noOverFlow" style={(textStyle, { margin: w >= 1100 ? '' : '20% 0', fontSize: w >= 1100 ? '1.2em' : '1.5em', width: '80%' })}>
							{body}
						</p>
						{/*Feedback*/}
						<p className="noOverFlow" style={(textStyle, { fontSize: '1.2em' })}>
							{thanks}
						</p>
						{!this.state.msg ? og ? this.feedback(parseInt(rating)) : null : <h3 style={{ fontSize: w >= 1100 ? '.6em' : '.6em' }}>{this.state.msg}</h3>}
						{/*Footer*/}
					</div>
					{this.footer()}
				</div>
			</LoadingWrapper>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(ReviewLandingPage);
