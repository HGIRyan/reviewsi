import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingWrapper, LoginLayout, LoadingWrapperSmall } from './../../utilities/index';
import axios from 'axios';
import { addToUser } from './../../ducks/User';
import 'materialize-css';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('SECRET_CRYPTR');
class Login extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			userName: '',
			password: '',
		};
	}
	async componentDidMount() {
		if (typeof this.props.location.state === 'string') {
			alert('Please Login To Continue');
			this.setState({ prevLink: this.props.location.state });
		}
		await this.setState({ loading: false });
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location !== this.props.location) {
			//   this.setState({ prevPath: this.props.location })
		}
	}
	async forgotPassword() {
		let { userName } = this.state;
		if (userName.emailValidate()) {
			this.setState({ submitting: true });
			await axios.post('/api/ll/reset/password', { userName }).then(res => {
				this.setState({ submitting: false, showCode: true });
			});
		} else {
			alert('Invalid Email');
		}
	}
	async checkCode() {
		let { resetCode } = this.state;
		if (resetCode) {
			this.setState({ submitting: true });
			await axios.post('/api/ll/reset/code', { code: resetCode }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ submitting: false, codeCheck: true, info: res.data.info });
				} else {
					alert('Invalid Code, Contact Account Manager');
				}
			});
		} else {
			alert('Please Insert Code');
		}
	}
	async changePass() {
		let { newPass, newPass2, info } = this.state;
		if (newPass === newPass2) {
			await axios.post('/api/ll/reset/newpass', { newPass, info }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ forgotPass: false });
				}
			});
		} else {
			alert('Passwords Do Not Match');
		}
	}
	async Login() {
		let { userName, password } = this.state;
		await this.setState({ loading: true });
		password = cryptr.encrypt(password);
		await axios.post('/api/ll/login', { userName, password }).then(res => {
			if (res.data.msg !== 'GOOD') {
				this.setState({ msg: res.data.msg, loading: false });
			} else if (res.data) {
				this.setState({ msg: 'Success', loading: false });
				let i = res.data.session.permissions;
				if (i === 'admin') {
					if (this.state.prevLink) {
						this.props.history.push(this.state.prevLink, res.data.session); //SEND TO ADMIN PAGE
					} else {
						this.props.history.push('/home', res.data.session); //SEND TO ADMIN PAGE
					}
				} else if (i === 'sales') {
					// this.props.history.push('/home', {login: 'login'}) //SEND TO SALES PAGE
				} else if (i === 'client') {
					let { cor_id, c_id, company_name } = res.data.session.info[0];
					if (
						this.state.prevLink &&
						(this.state.prevLink.includes('client-dash') || this.state.prevLink.includes('indv-customer')) &&
						this.state.prevLink.includes(`/${c_id}`)
					) {
						this.props.history.push(this.state.prevLink, res.data.session); //SEND TO ADMIN PAGE
					} else {
						alert(`Invalid Permissions To View Page, Redirecting To ${company_name} HomePage`);
						this.props.history.push(`/client-dash/${cor_id}/${c_id}`, res.data.session); //SEND TO CLIENT PAGE
					}
				}
			}
		});
	}
	keyPress = () => event => {
		if (event.key === 'Enter' && window.innerWidth >= 1200) {
			this.Login();
		}
	};
	render() {
		let { userName, password, msg } = this.state;
		let width = window.innerWidth;
		if (width <= 1200) {
			alert('Warning: this site will not work correctly with small screens');
		}
		return (
			<>
				<LoginLayout>
					<LoadingWrapper loading={this.state.loading}>
						<div className="card hoverable">
							<div className="card-content">
								<img
									src="https://res.cloudinary.com/lift-local/image/upload/v1569512765/Transparent_Large_Logo_c2jemz.png"
									alt="Lift Local Logo"
									style={{ maxHeight: '200px', maxWidth: '100%' }}
								/>
								<br />
								<br />
								{!this.state.forgotPass ? (
									<div>
										<form>
											<blockquote>
												<div className="input-field">
													<h2 style={{ margin: '0', paddingTop: '1.5%' }}>
														<input
															id="email"
															type="email"
															value={userName}
															onKeyPress={this.keyPress()}
															onChange={e => this.setState({ userName: e.target.value })}
															className="validate"
														/>
													</h2>
													<label data-error="Invalid" data-success="Valid" htmlFor="email">
														Email
													</label>
												</div>
											</blockquote>
											<blockquote>
												<div className="input-field">
													<h2 style={{ margin: '0', paddingTop: '1.5%' }}>
														<input
															id="password"
															type="password"
															value={password}
															onKeyPress={this.keyPress()}
															onChange={e => this.setState({ password: e.target.value })}
														/>
													</h2>
													<label htmlFor="password">Password</label>
												</div>
											</blockquote>
											<p style={{ color: msg === 'Success' ? 'green' : 'red', margin: '1%' }}>{msg}</p>
										</form>
										<div className="row">
											<div className="containers">
												<button
													className="btn primary-color  waves-effect waves-light col s12 hoverable"
													onClick={() => this.Login()}
													onKeyPress={this.keyPress()}
												>
													Login <i className="material-icons right">arrow_forward</i>
												</button>
												<br />
												<br />
												<br />
												<br />
												<button className="btn secondary-color  waves-effect waves-light  col s12" onClick={() => this.setState({ forgotPass: true })}>
													{' '}
													<i className="material-icons right">priority_high</i>Forgot Password
												</button>
												<br />
												<br />
												<br />
												<a className="btn-small   col s12" href="https://liftlocal.com/request-demo/" target="_blank" rel="noopener noreferrer">
													Don't Have An Account?
												</a>
											</div>
										</div>
									</div>
								) : (
									<div>
										<h4>Password Recovery</h4>
										<p>If you cant remember your login email call your account manager</p>
										<form>
											<blockquote>
												<div className="input-field">
													<h2 style={{ margin: '0', paddingTop: '1.5%' }}>
														<input id="email" type="email" value={userName} onChange={e => this.setState({ userName: e.target.value })} className="validate" />
													</h2>
													<label data-error="Invalid" data-success="Valid" htmlFor="email">
														Email
													</label>
												</div>
											</blockquote>
											{!this.state.showCode ? (
												<LoadingWrapperSmall loading={this.state.submitting}>
													<button className="btn primary-color  waves-effect waves-light col s12 hoverable" onClick={() => this.forgotPassword()}>
														Reset
													</button>
												</LoadingWrapperSmall>
											) : !this.state.codeCheck ? (
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
													<div className="input-field" style={{ width: '40%' }}>
														<h2 style={{ margin: '0', padding: '0' }}>
															<input onChange={e => this.setState({ resetCode: e.target.value })} />
														</h2>
														<label>Reset Code</label>
													</div>
													<LoadingWrapperSmall loading={this.state.submitting}>
														<button className="btn primary-color  waves-effect waves-light col s12 hoverable" onClick={() => this.checkCode()}>
															Submit
														</button>
													</LoadingWrapperSmall>
												</div>
											) : (
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
													<h4>New Password</h4>
													<div className="input-field" style={{ width: '95%' }}>
														<h2 style={{ margin: '0', padding: '0' }}>
															<input onChange={e => this.setState({ newPass: e.target.value })} />
														</h2>
														<label>New Password</label>
													</div>
													<div className="input-field" style={{ width: '95%' }}>
														<h2 style={{ margin: '0', padding: '0' }}>
															<input onChange={e => this.setState({ newPass2: e.target.value })} />
														</h2>
														<label>Twice</label>
													</div>
													<LoadingWrapperSmall loading={this.state.submitting}>
														<button className="btn primary-color  waves-effect waves-light col s12 hoverable" onClick={() => this.changePass()}>
															Change Password
														</button>
													</LoadingWrapperSmall>
												</div>
											)}
											<p style={{ color: msg === 'Success' ? 'green' : 'red', margin: '1%' }}>{msg}</p>
										</form>
									</div>
								)}
							</div>
						</div>
					</LoadingWrapper>
				</LoginLayout>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, { addToUser })(Login);
