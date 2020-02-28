import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, ThreeSplit, BoxSplit, MapTR, ReportTable } from './../../utilities/index';
import axios from 'axios';
let permission = 4;
class TypeReport extends Component {
	constructor() {
		super();

		this.state = {
			range: 30,
			loading: true,
		};
	}
	componentDidMount() {
		let { client_id } = this.props.match.params;
		if (Array.isArray(this.props.history.location.state)) {
			let item = this.props.history.location.state.filter(item => item.c_id === parseInt(client_id));
			if (item[0]) {
				this.setState({ og: item, loading: false });
			}
		} else if (Array.isArray(this.props.User.user.info)) {
			let item = this.props.history.location.state.filter(item => item.c_id === parseInt(client_id));
			if (item[0]) {
				this.setState({ og: item, loading: false });
			}
		}
		this.Start();
	}
	async Start() {
		let { client_id, type } = this.props.match.params;
		let { range } = this.state;
		await axios.post(`/api/typereport/indv/data`, { type, client_id, range }).then(res => {
			let { allTime, currentRange } = res.data;
			allTime = allTime.map((info, i) => {
				return (
					<MapTR key={i}>
						<td>{info.customer_id}</td>
						<td>{info.name}</td>
						<td>{info.feedback}</td>
						<td>{info.date.split('T')[0]}</td>
					</MapTR>
				);
			});
			this.setState({ allTime, currentRange });
		});
	}

	render() {
		let { client_id, type } = this.props.match.params;
		let { allTime } = this.state;
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' };
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og ? this.state.og : data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						{client_id} {type} Report
						<ThreeSplit height={permission === 4 ? '40vh' : 'auto'}>
							<BoxSplit width="40%" just="flex-start" align="flex-start" padding="2.5%">
								<h1>All Time</h1>
								{permission === 4 ? (
									<>
										<h3 style={{ marginBottom: '2.5%' }}>List Size:</h3>
									</>
								) : null}
								<h3 style={{ marginBottom: '2.5%' }}>Open Rate:</h3>
								<h3 style={{ marginBottom: '2.5%' }}>Total Clicks:</h3>
								{permission === 4 ? (
									<>
										<h3 style={{ marginBottom: '2.5%' }}>Unsub: 24 (32%)</h3>
									</>
								) : null}
							</BoxSplit>
							<BoxSplit width="40%" just="flex-start" align="flex-start" padding="2.5%">
								<h1>
									Past
									{
										<select>
											<option value="30">30</option>
											<option value="90">90</option>
											<option value="custom">Custom</option>
										</select>
									}
									Days
								</h1>
								{permission === 4 ? (
									<>
										<h3 style={{ marginBottom: '2.5%' }}>List Size:</h3>
										<h3 style={{ marginBottom: '2.5%' }}>Emails Sent:</h3>
									</>
								) : null}
								<h3 style={{ marginBottom: '2.5%' }}>Open Rate:</h3>
								<h3 style={{ marginBottom: '2.5%' }}>Total Clicks:</h3>
								{permission === 4 ? (
									<>
										<h3 style={{ marginBottom: '2.5%' }}>Unsub:</h3>
									</>
								) : null}
							</BoxSplit>
						</ThreeSplit>
						<h1>All Time Results</h1>
						<ReportTable className="header">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Feedback</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>{allTime}</tbody>
						</ReportTable>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}
function mapStateToProps(state) {
	return { ...state };
}
export default connect(
	mapStateToProps,
	{},
)(TypeReport);
