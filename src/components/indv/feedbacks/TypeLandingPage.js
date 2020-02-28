import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingWrapper, NoDiv, ImgBox } from '../../../utilities';
import axios from 'axios';
import Slider from 'react-slick';

class TypeLandingPage extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			review: true,
			info: {},
			feedback: [],
			res: [],
			w: 1920,
			h: 1080,
		};
	}
	async componentDidMount() {
		let { client_id, cust_id, source, type, loc } = this.props.match.params;
		this.setState({ w: window.innerWidth, h: window.innerHeight });
		await axios.post('/api/feedback/record/addon', { client_id, cust_id, source, type, loc }).then(async res => {
			if (res.data.msg === 'GOOD') {
				let { info, feedback, cust } = res.data;
				feedback = feedback.filter(e => e.rating >= 4);
				this.setState({ loading: false, info: info[0], feedback, review: feedback.length <= 5, cust: cust[0] });
			}
		});
	}
	footer() {
		let { info, w } = this.state;
		return (
			<div style={{ width: '90vw', position: 'realative', bottom: 0, display: 'flex', flexDirection: 'column', fontSize: '.75em' }}>
				<hr />
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h6 style={{ margin: '0', padding: '0' }}>{info ? info.company_name : 'Company Name'}</h6>
					<br />
					{w >= 1000 && info ? (
						<div style={{ margin: '0' }}>
							<p style={{ margin: '0', marginTop: '0%' }}>Phone: {info.phone.phone[0]}</p>
							<p style={{ marginTop: '0%' }}>
								Address: {info.address.street}, {info.address.city} {info.address.state}, {info.address.zip}
							</p>
						</div>
					) : null}
				</div>
				Powered By Lift Local ©
			</div>
		);
	}
	clickType() {
		let { type } = this.props.match.params;
		let { review, info, w } = this.state;
		let specType = type === 'lead' ? 'leadgen' : type === 'win' ? 'winback' : type === 'ref' ? 'referral' : type;
		const msg = info.landing_page[specType];
		const textStyle = {
			maxWidth: '95vw',
			height: 'auto',
			fontSize: w >= 1000 ? '2em' : '1.25em',
			margin: '2.5%',
		};
		if (type === 'lead' && info.active_prod.leadgen) {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						{!review ? (
							<NoDiv direction="column" width="25%" height="80vh" margin="5vh 0" align="center">
								<LoadingWrapper loading={review}>{this.reviewbox()}</LoadingWrapper>
							</NoDiv>
						) : null}
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<hr />
							<p style={textStyle}>{info.company_name}</p>
							<hr />
							<br />
							<p style={textStyle}>{msg}</p>
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else if (type === 'win' && info.active_prod.winback) {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<br />
							<p style={textStyle}>{msg}</p>
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else if (type === 'ref' && info.active_prod.referral) {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						{!review ? (
							<NoDiv direction="column" width="25%" height="80vh" margin="5vh 0" align="center">
								<LoadingWrapper loading={review}>{this.reviewbox()}</LoadingWrapper>
							</NoDiv>
						) : null}
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<br />
							<p style={textStyle}>{msg}</p>
							<NoDiv direction="column" align="center">
								<h3>Heres where you put the info</h3>
								<br />
								<h4>
									First Name: <input value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} />
								</h4>
								<h4>
									Last Name: <input value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} />
								</h4>
								<br />
								<h4>
									Email: <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
								</h4>
								<p style={textStyle}>OR</p>
								<h4>
									Phone: <input value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} />
								</h4>
							</NoDiv>
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else if (type === 'cross' && info.active_prod.cross_sell) {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						{!review ? (
							<NoDiv direction="column" width="25%" height="80vh" margin="5vh 0" align="center">
								<LoadingWrapper loading={review}>{this.reviewbox()}</LoadingWrapper>
							</NoDiv>
						) : null}
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<br />
							<p style={textStyle}>{msg}</p>
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<p className="noOverFlow" style={textStyle}>
								{msg}
							</p>
						</NoDiv>
					</NoDiv>
				</div>
			);
		}
	}
	reviewbox() {
		let { feedback } = this.state;
		let settings = {
			infinite: true,
			slidesToShow: 8,
			autoplay: true,
			speed: 2000,
			autoplaySpeed: 500,
			cssEase: 'linear',
			vertical: true,
			// height: '100%'
		};
		return (
			<NoDiv height="90%" direction="column" align="center" border="solid black 2px">
				<h1>Our Client Feedback</h1>
				<hr />
				<NoDiv height="80">
					<Slider {...settings}>
						{feedback.map((cust, i) => {
							return (
								<NoDiv key={i} just="center" align="center" border="solid black 1px" height="20%">
									{cust.feedback.length > 5 ? (
										<NoDiv direction="column" width="80%" margin="0 10%">
											<NoDiv width="100%" just="space-around">
												<h4>{cust.firstName}</h4>
												<NoDiv id="circle" height="25px" width="25px" just="center" align="center">
													{cust.rating}
												</NoDiv>
											</NoDiv>
											<br />
											<p>{cust.feedback.length >= 75 ? cust.feedback.substring(0, 150) + '...' : cust.feedback}</p>
										</NoDiv>
									) : (
										<NoDiv direction="column" width="80%" margin="0 10%" just="center" align="center">
											<h4>{cust.firstName}</h4>
											<NoDiv id="circle" height="25px" width="25px" just="center" align="center">
												{cust.rating}
											</NoDiv>
											<br />
										</NoDiv>
									)}
								</NoDiv>
							);
						})}
					</Slider>
				</NoDiv>
			</NoDiv>
		);
	}
	render() {
		let { info } = this.state;
		return (
			<LoadingWrapper loading={!info.c_id}>
				{/* {!review ? (
					<NoDiv direction="column" width="25%" height="80vh" margin="5vh 0" align="center">
						<LoadingWrapper loading={review}>{this.reviewbox()}</LoadingWrapper>
					</NoDiv>
				) : null} */}
				<div style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					{info.c_id ? this.clickType() : null}
					{info.c_id ? this.footer() : null}
				</div>
			</LoadingWrapper>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(TypeLandingPage);
