import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { LoadingWrapper } from './../../../utilities/index';

class Unsubscribe extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
		};
	}
	async componentDidMount() {
		let { cor_id, cust_id, client_id } = this.props.match.params;
		if (isNaN(cor_id)) {
			// MARK UNSUB
			await axios.post('/api/unsubscribe', { cor_id, cust_id, client_id }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ info: res.data.info, loading: false });
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			console.log('HELLO THIS IS Not from an email');
		}
	}

	render() {
		let w = window.innerWidth;
		let { info } = this.state;
		let infoStyle = {
			padding: '0',
			margin: '.5% 0',
		};
		return (
			<div style={{ width: '100vw', height: w >= 1200 ? '80vh' : '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<LoadingWrapper loading={this.state.loading}>
					<div
						style={{
							width: w >= 1200 ? '80%' : '100%',
							height: w >= 1200 ? '80%' : '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							padding: '0 5%',
						}}
						className="card hoverable"
					>
						<div
							style={{
								width: '100%',
								height: '60%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{info ? <img style={{ maxHeight: '200px' }} alt="Company Logo" src={info.logo} /> : ''}
							<h4>Unsubscribed</h4>
							<p>You have been unsubscribed.</p>
							<p style={{ width: w >= 1200 ? '60%' : '100%' }}>
								Done! We've unsubscribed you from our feedback request emails.
								<br /> We've stopped sending new feedback requests immediately, but it might take up to an hour for existing messages to make it to your inbox.
							</p>
							<p>Sincerely,</p>
							<h5>{info ? `${info.owner_name.first} ${info.owner_name.last}` : ''}</h5>
						</div>
						{w >= 1000 ? <hr style={{ width: '60%' }} /> : ''}
						<div
							style={{
								marginLeft: w >= 650 ? '20%' : '',
								width: '50%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								padding: '0',
								color: info ? info.accent_color : '',
								marginTop: w >= 650 ? '' : '15%',
							}}
						>
							<h6 style={infoStyle}>{info ? info.company_name : 'No'}</h6>
							<p style={infoStyle}>{info ? info.address.street : ''}</p>
							<p style={infoStyle}>{info ? `${info.address.city},  ${info.address.state},  ${info.address.zip}` : ''}</p>
						</div>
					</div>
				</LoadingWrapper>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Unsubscribe);
