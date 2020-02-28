import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, DefaultLink, LoadingWrapperSmall } from './../../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';
var validator = require('email-validator');

class CustNew extends Component {
	constructor() {
		super();

		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			checkFirst: false,
			checkLast: false,
			checkPhone: false,
			checkEmail: false,
			service: 'reviews',
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' },
			notes: '',
			warning: false,
			saving: false,
		};
	}
	componentDidMount() {
		if (Array.isArray(this.props.location.state.info)) {
			let { client_id } = this.props.match.params;
			if (this.props.location.state.info) {
				let item = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
				if (item[0]) {
					this.setState({ og: item[0] });
				}
			} else {
				alert('I Guess youll Die');
			}
		}
	}

	async submit() {
		let { firstName, lastName, email, phone, service } = this.state;
		// NameCheck
		this.setState({ saving: true });
		if (service !== 'NONE') {
			(await firstName) === '' ? this.setState({ checkFirst: false }) : this.setState({ checkFirst: true });
			(await lastName) === '' ? this.setState({ checkLast: false }) : this.setState({ checkLast: true });
			// EmailCheck
			(await validator.validate(email)) ? this.setState({ checkEmail: true }) : this.setState({ checkEmail: false });
			// PhoneCheck
			(await phone.length) === 10 ? this.setState({ checkPhone: true }) : this.setState({ checkPhone: false });
			this.checked();
		} else {
			this.setState({ warning: true, saving: false });
		}
	}
	async checked() {
		let { checkEmail, checkFirst, checkLast, checkPhone } = this.state;
		let { client_id, cor_id } = this.props.match.params;
		let state = this.state;
		if (checkFirst && checkLast && (checkPhone || checkEmail)) {
			await axios.post(`/api/new/customer/${client_id}/${cor_id}`, { state }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ saving: false });
					this.props.history.location.state.focus_cust.push(res.data.cust[0]);
					this.props.history.push({ pathname: `/client-dash/${cor_id}/${client_id}`, state: this.props.history.location.state });
				} else {
					this.setState({ saving: false });
					alert(res.data.msg);
				}
			});
		}
	}

	render() {
		let { client_id, cor_id } = this.props.match.params;
		let data = { c_id: client_id, owner_name: { first: 'Boi, Unknown' }, company_name: 'Lift Local' };
		let { og } = this.state;
		let permission = this.props.location.state.permissions;
		let iconStyle = { marginTop: '2.5%' };
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: og.c_id ? og : data, cor_id }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<NoDiv width="75%" direction="column" className="card hoverable" height="65vh">
							<NoDiv just="space-between" width="90%" align="center" margin="0 5%">
								<h3> New Customer </h3>
								{permission === 'admin' ? (
									<DefaultLink
										className="btn primary-color primary-hover"
										to={{ pathname: `/client-dash/${cor_id}/upload/${client_id}`, state: this.props.location.state }}
									>
										Import Customers
									</DefaultLink>
								) : null}
							</NoDiv>
							{/* <hr /> */}
							<NoDiv width="100%" height="45vh">
								<NoDiv width="50%" direction="column" padding="2.5%" height="100%">
									<NoDiv margin="2.5% 0">
										<div className="input-field" style={{ marginRight: '5%' }}>
											<i className="material-icons prefix" style={{ marginTop: '5%' }}>
												account_circle
											</i>
											<input
												id="first_name"
												type="text"
												className="validate"
												value={this.state.firstName}
												onChange={e => this.setState({ firstName: e.target.value })}
											/>
											<label htmlFor="first_name">First Name: </label>
										</div>
										<div className="input-field">
											<input
												id="last_name"
												type="text"
												className="validate"
												value={this.state.lastName}
												onChange={e => this.setState({ lastName: e.target.value })}
											/>
											<label htmlFor="last_name">Last Name: </label>
										</div>
									</NoDiv>
									<div className="input-field" style={{ width: '20vw' }}>
										<i className="material-icons prefix" style={iconStyle}>
											email
										</i>
										<input id="email" type="email" className="validate" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
										<label htmlFor="email">Email: </label>
										<span className="helper-text" data-error="Invalid Email Format" data-success="" />
									</div>
									<br />
									<div className="input-field" style={{ width: '20vw' }}>
										<i className="material-icons prefix" style={iconStyle}>
											phone
										</i>
										<input
											id="icon_telephone"
											type="tel"
											className="validate"
											value={this.state.phone}
											onChange={e => this.setState({ phone: e.target.value })}
										/>
										<label htmlFor="icon_telephone">Phone: </label>
									</div>
									{/* <h6>Phone:</h6>
									<input value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} type="number" name="phone" pattern="[0-9]{10}" /> */}
									<br />
									<NoDiv just="center" align="center" height="2.5%">
										<label>
											<input type="checkbox" />
											<span>Send Feedback Request Immediantly</span>
										</label>
									</NoDiv>
								</NoDiv>
								<NoDiv width="50%" height="45vh" direction="column" align="flex-start" padding="2.5%">
									<form className="col" style={{ width: '60%', margin: '2.5% 0' }}>
										<div className="input-field">
											<textarea id="textarea1" className="materialize-textarea" onChange={e => this.setState({ notes: e.target.value })}></textarea>
											<label htmlFor="textarea1">Customer Notes</label>
										</div>
									</form>
									<div className="input-field" style={{ width: '60%' }}>
										<Select
											onChange={e => this.setState({ service: e.target.value })}
											defaultValue={this.state.service}
											style={{ margin: '0 5%', fontSize: '.75em' }}
											className="styled-select"
										>
											<option value="NONE">Select A Service</option>
											<option value="reviews">Reviews</option>
											<option value="leadgen">Lead Gen</option>
											<option value="winback">WinBacks</option>
											<option value="cross">Cross Sell</option>
											<option value="referral">Referral</option>
										</Select>
										{!this.state.warning ? <label>Service: </label> : <label style={{ color: 'red' }}>Please Select A Service</label>}
									</div>
									<LoadingWrapperSmall loading={this.state.saving}>
										<button onClick={() => this.submit()} className="btn primary-color primary-hover">
											Submit
										</button>
									</LoadingWrapperSmall>
								</NoDiv>
							</NoDiv>
						</NoDiv>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}
function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(CustNew);
