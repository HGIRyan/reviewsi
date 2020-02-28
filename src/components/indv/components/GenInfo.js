import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	// Layout1,
	// LoadingWrapper,
	// LargeContentHolder,
	// ReportTable,
	// MapTR,
	// CompanyInfoBox,
	// DefaultLink,
	// pagination,
	// LoadingWrapperSmall,
	Infobox,
} from './../../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';

class GenInfo extends Component {
	constructor() {
		super();

		this.state = {
			autoAmt: '0',
			updated: false,
			bus: {},
		};
	}
	componentDidUpdate() {
		let { bus } = this.props;
		if (bus && !this.state.updated) {
			this.setState({ autoAmt: bus[0].auto_amt.amt.toString(), updated: true, bus: bus[0] });
		}
	}
	async updateAuto(val) {
		let { c_id, cor_id } = this.state.bus;
		let { bus } = this.state;
		bus.auto_amt = { amt: parseInt(val) };
		await axios.post('/api/update/auto', { val, c_id, cor_id }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.props.location.state.info.splice(
					this.props.location.state.info.findIndex(e => parseInt(e.c_id) === parseInt(c_id)),
					1,
					bus,
				);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
			} else {
				alert(res.data.msg);
			}
		});
	}
	render() {
		let { style, bus, promoters, responses, demoters, smsSent, emailSent, length } = this.props;
		let address = bus ? (bus[0] ? bus[0].address : {}) : {};
		let p = { margin: '0' };
		let h5 = { marginTop: '1vh' };
		return (
			<div className="card" style={style}>
				<Infobox rborder="0" width="30%">
					<h5 style={h5}>Address</h5>
					<p style={p}>{address.street},</p>
					<p style={p}>
						{address.city}
						{', '} {address.state}
						{', '}
						{address.zip}
					</p>
				</Infobox>
				<Infobox rborder="0">
					<h3 style={(p, { margin: '5% 0 2.5% 0' })}>{((promoters / responses - demoters / responses).toFixed(2) * 100).toString()}</h3>
					<br />
					<p style={h5}>NPS SCORE</p>
				</Infobox>
				<Infobox rborder="0">
					{/* <h3 style={(p, { margin: '5% 0 2.5% 0' })}>{bus ? bus[0].auto_amt.amt : null}</h3> */}
					<div className="input-field" style={{ width: '5vw', padding: '0', margin: '-7.5% 0 1% 0' }}>
						<Select
							value={this.state.autoAmt}
							onChange={e => this.updateAuto(e.target.value)}
							style={{ margin: '0 !important', padding: '0 !important', width: '20px !important' }}
						>
							<option value="0">Pause</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</Select>
					</div>
					<br />
					<p style={(h5, { marginTop: '-2.5%' })}>Auto Amount</p>
				</Infobox>
				<Infobox width="15%" rborder="0">
					<Infobox direction="row" width="100%" margin="5% 0 0 0">
						<Infobox width="50%">
							<h4 style={p}>{smsSent}</h4>
							<h6 style={p}>SMS</h6>
						</Infobox>
						<Infobox width="50%">
							<h4 style={p}>{emailSent}</h4>
							<h6 style={p}>email</h6>
						</Infobox>
					</Infobox>
					<p style={(h5, { padding: '0' })}>Monthly Sends</p>
				</Infobox>
				<Infobox width="25%" padding="0 0 0 5%">
					<Infobox direction="row" width="150%" margin="4% 0 0 0">
						<Infobox width="33.33%">
							<h4 style={p}>{promoters}</h4>
							<h6 style={p}>Promoters</h6>
						</Infobox>
						<Infobox width="33.33%">
							<h4 style={p}>{demoters}</h4>
							<h6 style={p}>Demoters</h6>
						</Infobox>
						<Infobox width="33.33%">
							<h4 style={p}>{length}</h4>
							<h6 style={p}>Total</h6>
						</Infobox>
					</Infobox>
					<p style={(h5, { padding: '0' })}>Customer Profiles</p>
				</Infobox>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(GenInfo);
