import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingWrapper, NoDiv, ImgBox } from '../../../utilities';
import Slider from 'react-slick';

class AddonLanding extends Component {
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
		let { img } = this.props.data;
		let info = {
			logo: img,
			place_id: 'INVALID',
			company_name: 'Lift Local',
			phone: { phone: ['(801) 407-5983'] },
			address: { street: '3400 Ashton Blvd #420', city: 'Lehi', state: 'Ut', zip: '84043' },
		};
		this.setState({ info, loading: false });
	}
	footer() {
		let { info } = this.state;
		return (
			<div style={{ width: '90vw', position: 'realative', bottom: 0, display: 'flex', flexDirection: 'column', fontSize: '.75em' }}>
				<hr />
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h6 style={{ margin: '0', padding: '0' }}>{info ? info.company_name : 'Company Name'}</h6>
					<br />
					<div style={{ margin: '0' }}>
						<p style={{ margin: '0', marginTop: '0%' }}>Phone: {info.phone.phone[0]}</p>
						<p style={{ marginTop: '0%' }}>
							Address: {info.address.street}, {info.address.city} {info.address.state}, {info.address.zip}
						</p>
					</div>
				</div>
				Powered By Lift Local ©
			</div>
		);
	}
	clickType() {
		let { addonLType } = this.props.data;
		let type = addonLType;
		let { info } = this.state;
		const msg = 'Message';
		const textStyle = {
			maxWidth: '95vw',
			height: 'auto',
			fontSize: '1.25em',
			margin: '2.5%',
		};
		if (type === 'leadgen') {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<hr />
							<p style={textStyle}>{info.company_name}</p>
							<hr />
							<br />
							<p style={textStyle}>{msg}</p>
							{type}
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else if (type === 'winback') {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<hr />
							<p style={textStyle}>{info.company_name}</p>
							<hr />
							<br />
							{type}
							<p style={textStyle}>{msg}</p>
						</NoDiv>
					</NoDiv>
				</div>
			);
		} else if (type === 'ref') {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
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
								{type}
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
		} else if (type === 'cross') {
			return (
				<div>
					<NoDiv width="100%" height="80vh" just="center">
						<NoDiv direction="column" width="75%" align="center" margin="15% 0">
							<ImgBox src={info.logo} alt={`${info.company_name}'s Logo`} />
							<br />
							<p style={textStyle}>{msg}</p>
							{type}
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
		let { loading } = this.state;
		return (
			<LoadingWrapper loading={loading}>
				<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<div
						style={{
							height: '100%',
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: '2.5%',
							marginTop: '2.5%',
							marginBottom: '2.5%',
						}}
						className="card"
					>
						{/* {!review ? (
					<NoDiv direction="column" width="25%" height="80vh" margin="5vh 0" align="center">
						<LoadingWrapper loading={review}>{this.reviewbox()}</LoadingWrapper>
					</NoDiv>
				) : null} */}
						{this.clickType()}
						{/* {this.footer()} */}
					</div>
				</div>
			</LoadingWrapper>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(
	mapStateToProps,
	{},
)(AddonLanding);
