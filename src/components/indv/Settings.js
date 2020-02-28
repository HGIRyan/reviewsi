import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from './../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';
import ReactTooltip from 'react-tooltip';

class Settings extends Component {
	constructor() {
		super();

		this.state = {
			repeat: 90,
			first: 1,
			open: 1,
			positive: 1,
			s_positive: 1,
			second: 1,
			frequency: 30,
			fromName: '',
			fromEmail: '',
			alertType: '',
			alertTo: [],
			feedback: [],
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' },
			saving: false,
		};
	}
	componentDidMount() {
		if (Array.isArray(this.props.location.state.info)) {
			let { client_id } = this.props.match.params;
			let exists = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				this.haveSettings(exists[0]);
			} else {
				this.getSettings();
			}
		} else {
			this.getSettings();
		}
	}
	async haveSettings(info) {
		let { from_email, repeat_request, feedback_alert, performance_report } = info;
		this.setState({
			fromEmail: from_email,
			repeat: repeat_request.repeat,
			first: repeat_request.first,
			open: repeat_request.open,
			positive: repeat_request.positive,
			s_positive: repeat_request.s_positive,
			second: repeat_request.second,
			feedback: feedback_alert.alert,
			frequency: performance_report.frequency,
			alertType: feedback_alert.alert[0].type,
			alertTo: performance_report.who,
			og: info,
		});
	}
	async getSettings() {
		let { client_id, loc } = this.props.match.params;
		await axios.get(`/api/settings/${client_id}/${loc}`).then(res => {
			if (res.data.msg === 'GOOD') {
				let settings = res.data.settings[0];
				this.haveSettings(settings);
			}
		});
	}
	async save() {
		this.setState({ saving: true });
		let { fromEmail, repeat, feedback, frequency, alertTo, og, first, positive, open, s_positive, second, alertType } = this.state;
		og.from_email = fromEmail;
		og.performance_report.who = alertTo;
		og.performance_report.frequency = frequency;
		feedback = feedback.map(e => ({ type: alertType, to: e.to }));
		og.feedback_alert.alert = feedback;
		og.repeat_request.repeat = repeat;
		og.repeat_request.first = first;
		og.repeat_request.positive = positive;
		og.repeat_request.open = open;
		og.repeat_request.s_positive = s_positive;
		og.repeat_request.second = second;
		await axios.post('/api/indv/settings/update', { og }).then(res => {
			if (res.data.msg === 'GOOD' && res.data.info) {
				this.setState({ saving: false });
				// this.props.location.state.info.map( e => ( parseInt( e.c_id ) === parseInt( og.c_id ) ? ( e = res.data.info ) : null ) );
				this.props.location.state.info.splice(
					this.props.location.state.info.findIndex(e => parseInt(e.c_id) === parseInt(res.data.info.c_id)),
					1,
					res.data.info,
				);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
			} else {
				alert(res.data.msg);
			}
		});
	}
	addFeedbackRec(val) {
		let rec = val.split(',');
		rec = rec.map(e => ({ type: this.state.alertType, to: e.trim() }));
		this.setState({ feedback: rec });
	}
	addPerformanceRec(val) {
		let rec = val.split(',');
		this.setState({ alertTo: rec });
	}
	async update() {
		let { client_id, loc } = this.props.match.params;
		let { fromEmail, frequency, alertType, alertTo, feedback, og } = this.state;
		og.feedback_alert.alert.splice(loc - 1, 1, { to: feedback, type: alertType });
		console.log(og.feedback_alert);
		og.performance_report.report.splice(loc - 1, 1, { freq: frequency, to: alertTo });
		await axios.post('/api/settings/update', { fromEmail, frequency, alertType, alertTo, feedback, og, client_id, loc });
	}
	render() {
		// let { client_id } = this.props.match.params;
		let { fromEmail, frequency, alertType, alertTo, feedback } = this.state;
		alertTo = alertTo.map((e, i) => e + `${i === alertTo.length ? ', ' : ''}`);
		feedback = feedback.map((e, i) => e.to + `${i === feedback.length ? ',  ' : ''}`);
		let permission = this.props.location.state.permissions;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<div style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
							<NoDiv just="space-between" align="center" margin="0 5%" padding="0 5%" className="card hoverable">
								<h3>Settings </h3>
								<div style={{ display: 'flex', width: '40%', justifyContent: 'flex-end' }}>
									<LoadingWrapperSmall loading={this.state.saving}>
										<button className="btn primary-color primary-hover" style={{ marginRight: '5%' }} onClick={() => this.save()}>
											Save
										</button>
									</LoadingWrapperSmall>
								</div>
							</NoDiv>
							{permission === 'admin' ? (
								<div style={{ display: 'flex', flexDirection: 'column' }} className="card hoverable">
									<h3 style={{ right: '35%', position: 'relative' }}>Feedback Settings</h3>
									<div style={{ display: 'flex', width: '80%', justifyContent: 'space-around', alignItems: 'flex-start' }}>
										<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
											{/* <i className="material-icons prefix">email</i> */}
											<h2 style={{ margin: '0' }}>
												<input
													id="email"
													type="email"
													className="validate"
													value={fromEmail}
													onChange={e => {
														this.setState({ fromEmail: e.target.value });
													}}
													data-tip
													data-for="from_email"
												/>
											</h2>
											<label htmlFor="email">Email: </label>
											<span className="helper-text" data-error="Invalid Email Format" data-success="" />
										</div>
										<ReactTooltip id="from_email" type="dark" effect="float" place="bottom">
											<span>
												What the from email will be on review requests,
												<br /> <br /> use an invalid email to use "no-reply@liftlocal.com"
											</span>
										</ReactTooltip>
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ repeat: parseInt(e.target.value) })} value={this.state.repeat.toString()}>
													<option value="365">365</option>
													<option value="180">180</option>
													<option value="90">90</option>
													<option value="60">60</option>
													<option value="45">45</option>
													<option value="30">30</option>
												</Select>
												<label htmlFor="repeat">Repeat Request: </label>
											</div>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ first: parseInt(e.target.value) })} value={this.state.first.toString()}>
													<option value="5">5</option>
													<option value="4">4</option>
													<option value="3">3</option>
													<option value="2">2</option>
													<option value="1">1</option>
												</Select>
												<label htmlFor="repeat">First Reminder: </label>
											</div>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ second: parseInt(e.target.value) })} value={this.state.second.toString()}>
													<option value="5">5</option>
													<option value="4">4</option>
													<option value="3">3</option>
													<option value="2">2</option>
													<option value="1">1</option>
												</Select>
												<label htmlFor="repeat">Second Reminder: </label>
											</div>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ open: parseInt(e.target.value) })} value={this.state.open.toString()}>
													<option value="5">5</option>
													<option value="4">4</option>
													<option value="3">3</option>
													<option value="2">2</option>
													<option value="1">1</option>
												</Select>
												<label htmlFor="repeat">Open Reminder: </label>
											</div>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ positive: parseInt(e.target.value) })} value={this.state.positive.toString()}>
													<option value="5">5</option>
													<option value="4">4</option>
													<option value="3">3</option>
													<option value="2">2</option>
													<option value="1">1</option>
												</Select>
												<label htmlFor="repeat">Positive Reminder: </label>
											</div>
											<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
												<Select id="repeat" onChange={e => this.setState({ s_positive: parseInt(e.target.value) })} value={this.state.s_positive.toString()}>
													<option value="5">5</option>
													<option value="4">4</option>
													<option value="3">3</option>
													<option value="2">2</option>
													<option value="1">1</option>
												</Select>
												<label htmlFor="repeat">Second Positive Reminder: </label>
											</div>
										</div>
									</div>
								</div>
							) : null}
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '2.5%' }} className="card hoverable">
								<h3 style={{ right: '30%', position: 'relative' }}>Notification Settings</h3>
								<hr />
								<h5 style={{ right: '30%', position: 'relative' }}>Send Feedback Alert Notifications</h5>
								<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
									<NoDiv align="center" width="40%">
										<i className="material-icons prefix">email</i>
										<div className="input-field" style={{ width: '100%', padding: '0', margin: '0' }} data-tip data-for="alert">
											<h2 style={{ margin: '0' }}>
												<input id="alert" type="text" value={feedback} onChange={e => this.addFeedbackRec(e.target.value)} />
											</h2>
											<label htmlFor="alert">Send Alert To: </label>
										</div>
									</NoDiv>
									<ReactTooltip id="alert" type="dark" effect="float" place="bottom">
										<span>Add Multiple Recipients and separate by comma</span>
									</ReactTooltip>
									<div style={{ width: '60%' }}>
										<h6 style={{ marginLeft: '-20%' }}>Alert Type</h6>
										<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
											<input type="checkbox" checked={alertType === 'positive'} onChange={() => this.setState({ alertType: 'positive' })} />
											<span className="tab">Positive Feedback</span>
										</label>
										<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
											<input type="checkbox" checked={alertType === 'negative'} onChange={() => this.setState({ alertType: 'negative' })} />
											<span className="tab">Negative Feedback</span>
										</label>
										<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
											<input type="checkbox" checked={alertType === 'all'} onChange={() => this.setState({ alertType: 'all' })} />
											<span className="tab">All Feedback</span>
										</label>
									</div>
								</div>
								<h5 style={{ right: '30%', position: 'relative' }}>Performance Report Settings</h5>
								<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
									<NoDiv align="center" width="40%">
										<i className="material-icons prefix">email</i>
										<div className="input-field" style={{ width: '100%', padding: '0', margin: '0' }} data-tip data-for="performance">
											<h2 style={{ margin: '0' }}>
												<input id="performance" type="text" value={alertTo} onChange={e => this.addPerformanceRec(e.target.value)} />
											</h2>
											<label htmlFor="performance">Send Report To: </label>
										</div>
									</NoDiv>
									<div style={{ width: '60%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<div className="input-field" style={{ width: '60%', padding: '0', margin: '0 0 0 0', height: '100%' }}>
											<Select id="report" value={frequency.toString()} onChange={e => this.setState({ frequency: parseInt(e.target.value) })}>
												<option value="14">Bi-Weekly</option>
												<option value="30">Monthly</option>
												<option value="60">Bi-Monthly</option>
												<option value="90">Quarterly</option>
											</Select>
											<label htmlFor="report">Performance Report: </label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Settings);
