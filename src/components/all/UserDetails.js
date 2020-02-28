import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from '../../utilities/index';
import axios from 'axios';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('SECRET_CRYPTR');

class UserDetails extends Component {
	constructor() {
		super();

		this.state = {
			og: { email: '', username: '' },
			email: '',
			username: '',
			password: '',
			passCheck: '',
			checked: true,
		};
	}
	componentDidMount() {
		let { userInfo } = this.props.history.location.state;
		if (userInfo.email) {
			this.setState({
				og: userInfo,
				email: userInfo.email,
				username: userInfo.username,
			});
		} else {
			alert('No User');
		}
	}
	revert() {
		this.setState({
			email: this.state.og.email,
			username: this.state.og.username,
			password: '',
		});
	}
	async save() {
		let { email, username, password, passCheck, og } = this.state;
		if (passCheck === password) {
			if (password.length >= 6) {
				this.setState({ checked: true });
				// Update DB
				og.email = email;
				og.username = username;
				og.password = cryptr.encrypt(password);
				await axios.post('/api/update/user-info', { og });
			} else {
				alert("Password Doesn't Reach Requirements. Must Include A Number, Capital Letter and Be Atleast 6 Characters Long");
			}
		} else {
			this.setState({ checked: false });
			alert('Passwords Dont Match');
		}
	}
	render() {
		let { email, password, username, passCheck, checked } = this.state;
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
							<h1>Account Details</h1>
							<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between' }}>
								<button className="btn primary-color primary-hover" onClick={() => this.revert()}>
									Revert Changes
								</button>
								<button className="btn primary-color primary-hover" onClick={() => this.save()}>
									Save Changes
								</button>
							</div>
						</div>
						<div
							style={{
								width: '100%',
								minHeight: '60vh',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								alignItems: 'center',
							}}
							className="card"
						>
							<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
								<h2 style={{ margin: '0' }}>
									<input
										id="email"
										type="email"
										className="validate"
										value={email}
										onChange={e => {
											this.setState({ email: e.target.value });
										}}
									/>
								</h2>
								<label htmlFor="email">Email: </label>
								<span className="helper-text" data-error="Invalid Email Format" data-success="" />
							</div>
							<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
								<h2 style={{ margin: '0' }}>
									<input
										id="email"
										type="email"
										className="validate"
										value={username}
										onChange={e => {
											this.setState({ username: e.target.value });
										}}
									/>
								</h2>
								<label htmlFor="email">User Name: </label>
								<span className="helper-text" data-error="Invalid Email Format" data-success="" />
							</div>
							<div style={{ display: 'flex', alignItems: 'center', width: '20vw', border: checked ? '' : 'solid red' }}>
								<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
									<h2 style={{ margin: '0' }}>
										<input
											id="pass"
											type="text"
											value={password}
											onChange={e => {
												this.setState({ password: e.target.value });
											}}
										/>
									</h2>
									<label htmlFor="pass">Password: </label>
								</div>
								<i className="material-icons prefix" style={{ margin: '0', padding: '0', marginLeft: '5%' }}>
									remove_red_eye
								</i>
							</div>
							{password ? (
								<div style={{ display: 'flex', alignItems: 'center', width: '20vw', border: checked ? '' : 'solid red' }}>
									<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												id="passCheck"
												type="text"
												value={passCheck}
												onChange={e => {
													this.setState({ passCheck: e.target.value });
												}}
											/>
										</h2>
										<label htmlFor="passCheck">Password Check: </label>
									</div>
									<i className="material-icons prefix" style={{ margin: '0', padding: '0', marginLeft: '5%' }}>
										remove_red_eye
									</i>
								</div>
							) : null}
						</div>
					</div>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(UserDetails);
