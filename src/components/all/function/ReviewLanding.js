import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NoDiv, LoadingWrapper, StyledReviewLinks, LoadingWrapperSmall } from './../../../utilities/index';
// import axios from 'axios';
// import moment from 'moment';

class ReviewLandingPage extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			links: { links: [{ site: '', link: '' }] },
			w: 1920,
			h: 1080,
			feedback: '',
			msg: '',
			submitting: false,
			linkIndex: false,
			og: {},
		};
	}
	async componentDidMount() {
		window.scrollTo(-5, 0);
		if (this.props.og.c_id) {
			let { review_links } = this.props.og;
			this.setState({ loading: false, og: this.props.og, links: review_links });
		}
		// document.body.style.width = '100%';
		// document.body.style.height = '100vh';
		// this.setState({ w: window.innerWidth, h: window.innerHeight });
		// let { client_id, cust_id, rating, source, cor_id } = this.props.match.params;
		// if (rating <= 5 || rating === 'direct') {
		// 	await this.rating(client_id, cust_id, rating, source, cor_id);
		// }
	}

	async clickSite(item, i) {
		// Set Click To True and wich site was clicked
		let { link } = item;
		window.location.href = link;
	}
	reviewSites(links) {
		let { w } = this.state;
		const linkStyle = {
			display: 'flex',
			flexDirection: 'column',
			width: w >= 1100 ? '15vw' : '90%',
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
								<img src={siteLogos(item.site)} alt={`${item.site} Logo`} style={{ maxWidth: '15vw', maxHeight: '7vh' }} />
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
		let { loading, showLinks, links } = this.state;
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
								style={{ border: 'solid gray 1px', padding: '0 .5%', boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '' }}
							>
								<textarea
									rows="5"
									style={{ borderBottom: 'none', minHeight: '6vh', width: '25vw' }}
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
								></textarea>
							</div>
						</form>
						<LoadingWrapperSmall loading={this.state.submitting}>
							<button className="btn primary-color primary-hover">Submit</button>
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
								style={{ border: 'solid gray 1px', padding: '0 .5%', boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '' }}
							>
								<textarea
									rows="5"
									style={{ borderBottom: 'none', minHeight: '6vh', width: '25vw' }}
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
												style={{ borderBottom: 'none', minHeight: '6vh', width: '25vw' }}
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
		if (og.c_id) {
			return (
				<div style={{ width: '90%', position: 'realative', bottom: 10, display: 'flex', flexDirection: 'column', fontSize: '.75em' }}>
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
	}
	render() {
		let { rating } = this.props;
		let body, thanks;
		let { w, og } = this.state;
		let { positive, passive, demoter, updateLanding } = this.props;

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
			<LoadingWrapper loading={this.state.loading}>
				<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<div
						style={{
							width: w >= 1100 ? '70%' : '100%',
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
						{og ? <img src={og.logo} alt={`${og.company_name}'s Company Logo`} style={{ maxWidth: '200px' }} /> : null}
						{/*Body And Thanks*/}
						<form className="col" style={(textStyle, { width: '80%', fontSize: ' 1.5em', margin: '0', padding: '0' })}>
							<div className="input-field">
								<textarea
									rows="5"
									style={{ borderBottom: 'none', boxShadow: 'none', height: 'auto', textAlign: 'center' }}
									id="textarea1"
									className="materialize-textarea"
									value={body}
									onChange={e => updateLanding(e.target.value, 'body')}
								></textarea>
							</div>
						</form>
						{/* <p className="noOverFlow" style={(textStyle, { margin: w >= 1100 ? '' : '20% 0', fontSize: w >= 1100 ? '1.2em' : '1.5em', width: '80%' })}>
							{body}
						</p> */}
						{/*Feedback*/}
						<form className="col" style={(textStyle, { width: '80%', fontSize: ' 1.2em', margin: '0', padding: '0' })}>
							<div className="input-field">
								<textarea
									rows="5"
									style={{ borderBottom: 'none', boxShadow: 'none', height: 'auto', textAlign: 'center' }}
									id="textarea1"
									className="materialize-textarea"
									value={thanks}
									onChange={e => updateLanding(e.target.value, 'thanks')}
								></textarea>
							</div>
						</form>
						{/* <p className="noOverFlow" style={(textStyle, { fontSize: '1.2em' })}>
							{thanks}
						</p> */}
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

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { NoDiv, LoadingWrapper, StyledReviewLinks } from './../../../utilities/index';
// // import axios from 'axios';
// // import moment from 'moment';

// class ReviewLanding extends Component {
// 	constructor() {
// 		super();

// 		this.state = {
// 			loading: true,
// 			links: [],
// 			res: {
// 				demoter: { thanks: '', body: '' },
// 				passive: { thanks: '', body: '' },
// 				positive: { thanks: '', body: '' },
// 				links: [{ site: '', link: '' }],
// 			},
// 			w: 1920,
// 			h: 1080,
// 			feedback: '',
// 			msg: '',
// 		};
// 	}
// 	async componentDidMount() {
// 		let { review_landing, img } = this.props.data;
// 		let resp = {
// 			demoter: review_landing.demoter,
// 			passive: review_landing.passive,
// 			positive: review_landing.positive,
// 			links: [],
// 		};
// 		let og = {
// 			logo: img,
// 			place_id: 'INVALID',
// 			company_name: 'Lift Local',
// 			phone: { phone: ['(801) 407-5983'] },
// 			address: { street: '3400 Ashton Blvd #420', city: 'Lehi', state: 'Ut', zip: '84043' },
// 		};
// 		this.setState({ res: resp, og, loading: false });
// 	}
// 	async submitFeedback() {
// 		// Set Click To False
// 		this.setState({ msg: 'Feedback Recorded' });
// 	}
// 	async clickSite(item) {
// 		// Set Click To True and wich site was clicked
// 		this.setState({ msg: 'Site Clicked' });
// 	}
// 	feedback(rating) {
// 		let { loading, showLinks, w } = this.state;
// 		let { links } = this.state.res;
// 		if (!links[0] && this.state.og.place_id) {
// 			links = [
// 				{
// 					site: 'Google',
// 					link: `https://search.google.com/local/writereview?placeid=${this.state.og.place_id}`,
// 				},
// 			];
// 		}
// 		const linkStyle = {
// 			display: 'flex',
// 			flexDirection: 'column',
// 			width: w >= 1000 ? 'auto' : '90%',
// 			margin: '.5%',
// 		};
// 		const linkDiv = {
// 			width: w >= 1000 ? '15vw' : '90%',
// 			fontSize: '1.5em',
// 		};
// 		if (rating <= 2) {
// 			return (
// 				<LoadingWrapper loading={loading}>
// 					<NoDiv direction="column" align="center" width="100%" margin="0">
// 						<form className="col" style={{ width: '50%', margin: '2.5% 0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
// 							<div className="input-field">
// 								<textarea
// 									rows="5"
// 									style={{ minHeight: '6vh', width: w >= 1000 ? '40%' : '90%' }}
// 									id="textarea1"
// 									className="materialize-textarea"
// 									placeholder="Please Leave Your Feedback Here"
// 									onChange={e => this.setState({ feedback: e.target.value })}
// 									value={this.state.feedback}
// 								></textarea>
// 							</div>
// 						</form>
// 						<button onClick={() => this.submitFeedback()} className="btn primary-color primary-hover">
// 							Submit
// 						</button>
// 						<p
// 							className="underline"
// 							onClick={() => {
// 								this.setState({ showLinks: !showLinks });
// 							}}
// 						>
// 							Click To See Our Online Profiles
// 						</p>
// 						{showLinks
// 							? links.map((item, i) => {
// 									return (
// 										<div style={(linkStyle, { marginTop: i === 0 ? '1%' : '' })} key={i} onClick={() => this.clickSite(item)}>
// 											<StyledReviewLinks site={item.site} style={linkDiv}>
// 												{item.site}
// 											</StyledReviewLinks>
// 										</div>
// 									);
// 							  })
// 							: null}
// 					</NoDiv>
// 				</LoadingWrapper>
// 			);
// 		} else if (parseInt(rating) === 8) {
// 			return (
// 				<LoadingWrapper loading={loading}>
// 					<h1>Thank You For Your Feedback.</h1>{' '}
// 				</LoadingWrapper>
// 			);
// 		} else if (parseInt(rating) === 3) {
// 			return (
// 				<LoadingWrapper loading={loading}>
// 					<NoDiv direction="column" align="center" width="100%" margin=".5% 0">
// 						<form className="col" style={{ width: '50%', margin: '2.5% 0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
// 							<div className="input-field">
// 								<textarea
// 									rows="5"
// 									style={{ minHeight: '6vh', width: w >= 1000 ? '40%' : '90%' }}
// 									id="textarea1"
// 									className="materialize-textarea"
// 									placeholder="Please Leave Your Feedback Here"
// 									onChange={e => this.setState({ feedback: e.target.value })}
// 									value={this.state.feedback}
// 								></textarea>
// 							</div>
// 						</form>
// 						<button onClick={() => this.submitFeedback()} className="btn primary-color primary-hover">
// 							Submit
// 						</button>
// 						{links.map((item, i) => {
// 							return (
// 								<div style={(linkStyle, { marginTop: i === 0 ? '1%' : '' })} key={i} onClick={() => this.clickSite(item)}>
// 									<StyledReviewLinks site={item.site} style={linkDiv}>
// 										{item.site}
// 									</StyledReviewLinks>
// 								</div>
// 							);
// 						})}
// 					</NoDiv>
// 				</LoadingWrapper>
// 			);
// 		} else if (rating >= 4) {
// 			return (
// 				<LoadingWrapper loading={loading}>
// 					<NoDiv direction="column" align="center" width="100%" margin="2.5% 0">
// 						{!showLinks ? (
// 							<NoDiv direction="column" align="center">
// 								<br />
// 								{links.map((item, i) => {
// 									return (
// 										<div style={(linkStyle, { marginTop: i === 0 ? '1%' : '' })} key={i} onClick={() => this.clickSite(item)}>
// 											<StyledReviewLinks site={item.site} style={linkDiv}>
// 												{item.site}
// 											</StyledReviewLinks>
// 										</div>
// 									);
// 								})}
// 								<br />
// 							</NoDiv>
// 						) : null}
// 					</NoDiv>
// 				</LoadingWrapper>
// 			);
// 		}
// 	}
// 	footer() {
// 		let { og } = this.state;
// 		return (
// 			<div style={{ width: '100%', display: 'flex', flexDirection: 'column', fontSize: '.75em' }}>
// 				<hr />
// 				<div style={{ display: 'flex', flexDirection: 'column' }}>
// 					<h6 style={{ margin: '0', padding: '0' }}>{og ? og.company_name : 'Company Name'}</h6>
// 					<br />
// 					<div style={{ margin: '0' }}>
// 						<p style={{ margin: '0', marginTop: '0' }}>Phone: {og.phone.phone[0]}</p>
// 						<p style={{ marginTop: '0' }}>
// 							Address: {og.address.street}, {og.address.city} {og.address.state}, {og.address.zip}
// 						</p>
// 					</div>
// 				</div>
// 				Powered By Lift Local ©
// 			</div>
// 		);
// 	}
// 	render() {
// 		// let { rating } = this.props.match.params;
// 		let { loading, w, og } = this.state;
// 		let { ratingLanding } = this.props.data;
// 		let { updateReviewLanding } = this.props;
// 		let body, thanks;
// 		let rating = ratingLanding;
// 		let content = {
// 			demoter: this.props.data.review_landing.demoter,
// 			passive: this.props.data.review_landing.passive,
// 			positive: this.props.data.review_landing.positive,
// 		};
// 		let { demoter, positive, passive } = content;
// 		if (parseInt(rating) <= 2) {
// 			body = demoter.body;
// 			thanks = demoter.thanks;
// 		} else if (parseInt(rating) === 3) {
// 			body = passive.body;
// 			thanks = passive.thanks;
// 		} else if (parseInt(rating) <= 5) {
// 			body = positive.body;
// 			thanks = positive.thanks;
// 		} else {
// 			body = '';
// 			thanks = '';
// 		}

// 		return (
// 			<LoadingWrapper loading={loading}>
// 				<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
// 					<div
// 						style={{
// 							height: '100%',
// 							width: '100%',
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							padding: '2.5%',
// 							marginTop: '2.5%',
// 							marginBottom: '2.5%',
// 						}}
// 						className={w >= 1000 ? 'card' : ''}
// 					>
// 						{/*Logo Header*/}
// 						{og ? <img src={og.logo} alt={`${og.company_name}'s Company Logo`} style={{ maxWidth: '400px' }} /> : null}
// 						{/*Body And Thanks*/}
// 						<form className="col" style={{ width: '90%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
// 							<div className="input-field" style={{ width: '100%' }}>
// 								<textarea
// 									rows="5"
// 									style={{ borderBottom: 'none', boxShadow: 'none', minHeight: '5vh' }}
// 									id="textarea1"
// 									className="materialize-textarea"
// 									value={body}
// 									onChange={e => updateReviewLanding(e.target.value, 'body')}
// 								></textarea>
// 							</div>
// 						</form>
// 						{/*Feedback*/}
// 						<form className="col" style={{ width: '90%', margin: '2.5% 0', fontSize: ' 1.5em' }}>
// 							<div className="input-field" style={{ width: '100%' }}>
// 								<textarea
// 									rows="5"
// 									style={{ borderBottom: 'none', boxShadow: 'none', minHeight: '5vh' }}
// 									id="textarea1"
// 									className="materialize-textarea"
// 									value={thanks}
// 									onChange={e => updateReviewLanding(e.target.value, 'thanks')}
// 								></textarea>
// 							</div>
// 						</form>
// 						{!this.state.msg ? og ? this.feedback(parseInt(rating)) : null : <h3>{this.state.msg}</h3>}
// 						{/*Footer*/}
// 						{this.state.og ? this.footer() : null}
// 					</div>
// 				</div>
// 			</LoadingWrapper>
// 		);
// 	}
// }

// function mapStateToProps(state) {
// 	return { ...state };
// }
// export default connect(mapStateToProps, {})(ReviewLanding);
