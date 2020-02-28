import React, { Component } from 'react';
import { InfoContainer, InfoName, InfoReviews, InfoGRating, InfoActive, MainContain, DefaultLink, NoDiv } from './../../../utilities/index';
import { connect } from 'react-redux';
import axios from 'axios';

class InfoWrapper extends Component {
	constructor() {
		super();

		this.state = {
			information: false,
			hovering: false,

			stilWant: false,
		};
	}
	runCall = async () => {
		if (!this.state.information) {
			this.setState({ information: true });
			let res = await axios.get('/api/home/dropinfo');
			this.setState({ information: res.data });
		}
	};
	makeCall = async () => {
		await this.setState({ hovering: true, stillWant: true });
		this.state.bounce();
	};
	leaving = () => {
		setTimeout(() => {
			this.setState({ information: false, hovering: false, stillWant: false });
			this.state.bounce.cancel();
		}, 500);
	};
	render() {
		let { info } = this.props;
		// let { information } = this.state
		return (
			<>
				<InfoContainer
				// onMouseEnter={this.makeCall}
				// onMouseLeave={this.leaving}
				>
					<DefaultLink to={`/client-dash/${info.c_id}/1`}>
						<MainContain width="70vw">
							{info.c_id}
							<NoDiv width="7vw" just="center" align="center">
								{info.industry}
							</NoDiv>
							<InfoName>{info.company_name.name[0]}</InfoName>
							<InfoReviews>
								<h6>
									Since Joining:{' '}
									{parseInt(info.reviews.reviews[0][info.reviews.reviews[0].length - 1].totalReviews) - parseInt(info.reviews.reviews[0][0].totalReviews)}
								</h6>
							</InfoReviews>
							<InfoGRating>{info.reviews.reviews[0][info.reviews.reviews[0].length - 1].rating}</InfoGRating>
							{/* <InfoLLRating>
                                {info.llrating}
                            </InfoLLRating> */}
							{/* <InfoStatus color={info.status}>
                                {info.status}
                            </InfoStatus> */}
							<InfoActive>
								{info.active ? info.active.active.filter(i => i === true).length : null} {' out of '}
								{info.active ? info.active.active.length : null}
								{info.active ? (info.active.active.some(i => i === true) ? ' Active ' : ' Inactive ') : null}
								{' Locations'}
							</InfoActive>
						</MainContain>
					</DefaultLink>
				</InfoContainer>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(InfoWrapper);
