import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from './../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';
// import validator from 'email-validator';

class UserCreate extends Component {
	constructor() {
		super();

		this.state = {
			userName: '',
			email: '',
			password: '',
			permissionLevel: 'admin',
			cor_id: '',
			uploading: false,
			msg: '',
		};
	}
	async submitUser() {
		let state = this.state;
		let { userName, email, password } = this.state;
		if (userName && email.emailValidate() && password) {
			this.setState({ uploading: true, msg: '' });
			await axios.post('/api/add-new-user/dev', { state }).then(res => {
				this.setState({ uploading: false, msg: 'Saved ✓' });
			});
		} else {
			alert(`${!userName ? 'Username, ' : ''}${!email.emailValidate() ? 'Email, ' : ''}${!password ? 'Password' : ''} is Invalid`);
		}
	}

	render() {
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' };
		return (
			<Layout1 view={{ sect: 'all', data: data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<div></div>
				<LoadingWrapper>
					<NoDiv width="75%" direction="column" className="card hoverable" height="auto" padding="2.5%">
						<NoDiv just="space-between" width="90%" align="center" margin="0 5%">
							<h3> New User </h3>
							<LoadingWrapperSmall loading={this.state.uploading}>{this.state.msg ? this.state.msg : null}</LoadingWrapperSmall>
						</NoDiv>
						<hr />
						<div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div className="input-field" style={{ marginRight: '5%', width: '20vw' }}>
									<i className="material-icons prefix">account_circle</i>
									<input
										id="username"
										type="text"
										className="validate"
										value={this.state.userName}
										onChange={e => this.setState({ userName: e.target.value })}
									/>
									<label htmlFor="username">Username: </label>
								</div>
								<div className="input-field" style={{ marginRight: '5%', width: '20vw' }}>
									<i className="material-icons prefix">security</i>
									<input
										id="password"
										type="text"
										className="validate"
										value={this.state.password}
										onChange={e => this.setState({ password: e.target.value })}
									/>
									<label htmlFor="password">Password: </label>
								</div>
								<div className="input-field" style={{ width: '20vw' }}>
									<i className="material-icons prefix">email</i>
									<input id="email" type="email" className="validate" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
									<label htmlFor="email">Email: </label>
									<span className="helper-text" data-error="Invalid Email Format" data-success="" />
								</div>
							</div>
							<div>
								<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
									<h5>Permission Level: </h5>
									<Select value={this.state.permissionLevel} onChange={e => this.setState({ permissionLevel: e.target.value })}>
										<option value="admin">Admin</option>
										<option value="sales">Sales</option>
										<option value="client">Client</option>
									</Select>
								</div>
								<blockquote>
									<p>Leave Blank if not attatching to a company</p>
									<p>Use Cor_id</p>
								</blockquote>
								<div className="input-field" style={{ marginRight: '5%', width: '20vw' }}>
									<i className="material-icons prefix">settings_input_svideo</i>
									<input id="cor_id" type="text" className="validate" value={this.state.cor_id} onChange={e => this.setState({ cor_id: e.target.value })} />
									<label htmlFor="cor_id">Attatch to Company: </label>
								</div>
								<button className="btn waves-effect waves-light primary-color primary-hover" onClick={() => this.submitUser()}>
									Submit New User
								</button>
							</div>
						</div>
					</NoDiv>
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(UserCreate);
