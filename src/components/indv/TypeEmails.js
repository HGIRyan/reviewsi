import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv } from './../../utilities/index';
import AddonEmail from './../all/function/AddonEmail';
// import { Select } from 'react-materialize';
import Axios from 'axios';

class TypeEmails extends Component {
	constructor() {
		super();

		this.state = {
			type: 'N/A',
			from: 'no-reply@liftlocal.com',
			emails: {},
			services: {},
			loading: true,
			email: 0,
			subject: '',
		};
	}
	async componentDidMount() {
		let { client_id } = this.props.match.params;
		let { info } = this.props.User;
		if (this.props.location.state && Array.isArray(this.props.location.state)) {
			let exists = this.props.location.state.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				await this.hasEmail(exists[0]);
			} else {
				await this.getEmail();
			}
		} else if (info) {
			let exists = info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				await this.hasEmail(exists[0]);
			} else {
				await this.getEmail();
			}
		} else {
			await this.getEmail();
		}
		this.setState({ loading: false });
	}
	async hasEmail(info) {
		let { email_1, email_2, email_3, email_4, email_5, email_6, active_prod } = info;
		let emails = { email_1, email_2, email_3, email_4, email_5, email_6 };
		let { winback, leadgen, referral, cross_sell } = active_prod;
		let { type } = this.props.match.params;
		let services = { winback, leadgen, referral, cross_sell };
		type = type === 'ref' ? 'referral' : type;
		this.setState({ emails, services, og: info, type, subject: emails[`email_${1}`][type].subject });
	}
	async getEmail() {
		let { client_id } = this.props.match.params;
		await Axios.get(`/api/get/business_details/${client_id}`).then(res => {
			if (res.data.msg === 'GOOD') {
				this.hasEmail(res.data.info);
			}
		});
	}
	changeEmail(val, click) {
		let { email, emails } = this.state;
		let { type } = this.props.match.params;
		type = type === 'ref' ? 'referral' : type;
		if (click) {
			this.setState({ email: val, subject: emails[`email_${val + 1}`][type].subject });
		} else {
			if (val === 1) {
				if (email < 5) {
					this.setState({ email: email + 1, subject: emails[`email_${email + 2}`][type].subject });
				} else {
					this.setState({ email: 0, subject: emails.email_1[type].subject });
				}
			} else if (val === -1) {
				if (email > 0) {
					this.setState({ email: email - 1, subject: emails[`email_${email}`][type].subject });
				} else {
					this.setState({ email: 5, subject: emails.email_6[type].subject });
				}
			} else {
				alert('Bruh');
			}
		}
	}
	async changeTypeEmail(val) {
		let { email } = this.state;
		let { type } = this.props.match.params;
		type = type === 'ref' ? 'referral' : type;
		this.setState(prevState => ({
			emails: {
				...prevState.emails,
				[`email_${email + 1}`]: { ...prevState.emails[`email_${email + 1}`], [type]: { ...prevState.emails[`email_${email + 1}`][type], body: val } },
			},
		}));
	}
	async updateSubject(val) {
		let { email } = this.state;
		let { type } = this.props.match.params;
		type = type === 'ref' ? 'referral' : type;
		this.setState(prevState => ({
			emails: {
				...prevState.emails,
				[`email_${email + 1}`]: { ...prevState.emails[`email_${email + 1}`], [type]: { ...prevState.emails[`email_${email + 1}`][type], subject: val } },
			},
			subject: val,
		}));
	}
	render() {
		let { client_id } = this.props.match.params;
		let { type, from, emails } = this.state;
		let headerStyle = {
			marginLeft: '10%',
		};
		let emailLabel = {
			width: '50%',
			display: 'flex',
			justifyContent: 'flex-start',
			marginBottom: '5%',
			// marginLeft: '20%',
			padding: '0',
		};
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<NoDiv width="95%" direction="column">
							{type === 'leadgen' ? (
								<h3 style={headerStyle}>Lead Gen Settings</h3>
							) : type === 'winback' ? (
								<h3 style={headerStyle}>Winback Settings</h3>
							) : type === 'cross' ? (
								<h3 style={headerStyle}>Cross Sell Settings</h3>
							) : (
								<h3 style={headerStyle}> Referral Settings</h3>
							)}
							<hr />
							<div style={{ height: '2.5vh' }} />
							<div style={{ width: '70vw', marginLeft: '5%', display: 'flex', minHeight: '20vh', maxHeight: '80vh' }}>
								<div className="input-field" style={{ width: '25%' }}>
									<h2 style={{ margin: '0', padding: '0' }}>
										{/* <i className="material-icons prefix">email</i> */}
										<input
											style={{ margin: '0' }}
											id="email"
											type="text"
											className="validate"
											value={from}
											onChange={e => this.setState({ from: e.target.value })}
										/>
										<span className="helper-text" data-error="Invalid Email Format" data-success="" />
									</h2>
									<label htmlFor="email">From Email: </label>
								</div>
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
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 0} onChange={() => this.changeEmail(0, true)} />
										<span className="tab">Email 1</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 1} onChange={() => this.changeEmail(1, true)} />
										<span className="tab">Email 2</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 2} onChange={() => this.changeEmail(2, true)} />
										<span className="tab">Email 3</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 3} onChange={() => this.changeEmail(3, true)} />
										<span className="tab">Email 4</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 4} onChange={() => this.changeEmail(4, true)} />
										<span className="tab">Email 5</span>
									</label>
									<label style={emailLabel}>
										<input type="checkbox" checked={this.state.email === 5} onChange={() => this.changeEmail(5, true)} />
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
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '5%' }}>
									<div className="input-field" style={{ width: '50%', marginBottom: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												style={{ margin: '0' }}
												id="subject"
												type="text"
												className="validate"
												value={this.state.subject}
												onChange={e => this.updateSubject(e.target.value)}
											/>
											<span className="helper-text" data-error="Invalid Subject" data-success="" />
										</h2>
										<label style={{ margin: '0' }} htmlFor="subject">
											Subject:{' '}
										</label>
									</div>
									<AddonEmail
										type={this.props.match.params.type}
										addon={emails}
										email={this.state.email}
										og={this.state.og}
										changeBody={this.changeTypeEmail.bind(this)}
									/>
								</div>
							</div>
						</NoDiv>
						{client_id} Type Emails
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(TypeEmails);
