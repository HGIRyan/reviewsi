// IMPORTS
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Layout1, LoadingWrapper, ThreeSplit, BoxSplit, RowContainer } from './../../utilities/index';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Select } from 'react-materialize';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import Pagination from './function/Pagination';
import Moment from 'moment';
import { Doughnut } from 'react-chartjs-2';
// File Constants
const ReactTableFixedColumns = withFixedColumns(ReactTable);
// let saturday = Moment()
// 	.day(-1)
// 	.format('YYYY-MM-DD');
let sunday = Moment()
	.day(0)
	.format('YYYY-MM-DD');
class ReviewReport extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			pinfo: '',
			industry: '',
			searchBy: 'industry',
			id: false,
			type: false,
			name: false,
			auto: true,
			listSize: true,
			RemainingList: true,
			status: false,
			rating: 0,
			llrating: 0,
			pageAMT: 250,
			sentStats: { sent: 0, opened: 0, received: 0, clicked: 0 },
		};
	}
	async componentDidMount() {
		document.title = 'Lift Local - Review Report';
		let defaultDate = '2005-04-05';
		await this.setState({ loading: false });
		await this.Start();
		await this.sentStats(defaultDate);
	}
	async sentStats(date) {
		await axios.get(`/api/all-sent-stats/${date}`).then(res => {
			if (res.data.msg === 'GOOD') {
				let { stats } = res.data;
				this.setState({ sentStats: stats });
			} else {
				alert(res.data.msg);
			}
		});
	}
	async Start() {
		let { industry } = this.state;
		let { info } = this.props.location.state;
		if (!Array.isArray(info)) {
			await axios.post(`/api/reviewreport/data`, { industry }).then(async res => {
				await this.startData(res.data.info);
			});
		} else {
			await this.startData(info);
		}
	}
	async startData(og) {
		og = og.filter(e => e.active_prod.reviews && e.active && e.reviews.reviews.some(el => el.date === sunday));
		let dates = og[0].reviews.reviews.sort((b, a) => {
			var c = new Date(a.date);
			var d = new Date(b.date);
			return d - c;
		});
		await this.setState({ dates });
		await this.List(og);
		let slow = og.filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'slow').length;
		let good = og.filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'good').length;
		let needattn = og.filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'needs attention').length;
		let urgent = og.filter(e => e.reviews.reviews.length >= 4).filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'urgent')
			.length;
		let critical = og
			.filter(e => e.reviews.reviews.length >= 4)
			.filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'critical').length;
		let na = og.filter(e => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'new').length;
		let total = og.length;
		let avgGRating = (og.reduce((tot, n) => tot + parseFloat(n.reviews.reviews.filter(dat => dat.date === sunday)[0].rating), 0) / total).toFixed(2);
		let avgLLRating = (og.reduce((tot, n) => tot + parseFloat(n.reviews.reviews.filter(dat => dat.date === sunday)[0].llrating), 0) / total).toFixed(2);
		this.setState({ og, info: og, statuses: { slow, good, needattn, urgent, critical, na, total, avgGRating, avgLLRating } });
	}
	async search(val) {
		let { info, og } = this.state;
		if (val.length >= 2) {
			let similar = await info.filter(
				item =>
					item.company_name.toLowerCase().includes(val.toLowerCase()) ||
					item.industry.toLowerCase().includes(val.toLowerCase()) ||
					item.c_id
						.toString()
						.toLowerCase()
						.includes(val.toLowerCase()),
			);
			await this.List(similar);
		} else {
			this.List(og);
		}
	}
	async changePage(e) {
		await this.setState({ pageAMT: parseInt(e) });
		this.List(this.state.og);
	}
	async List(pinfo) {
		let { dates } = this.state;
		pinfo = (
			<ReactTableFixedColumns
				data={pinfo}
				columns={[
					{
						fixed: 'left',
						columns: [
							{
								Header: 'I',
								Cell: row => {
									return row.index + 1;
								},
								width: 40,
							},
							{
								Header: 'ID',
								accessor: 'c_id',
								width: 50,
							},
							{
								Header: 'Corporation',
								accessor: 'industry',
								width: 150,
							},
							{
								Header: 'Company Name',
								id: 'company_name',
								accessor: info => (
									<h6
										className="left-align"
										style={{ fontSize: '1.m', marginTop: '.8%', width: '30%', cursor: 'pointer' }}
										onClick={() => this.props.history.push(`/client-dash/${info.cor_id}/${info.c_id}`, this.props.location.state)}
									>
										{info.company_name.slice(0, 35)}
									</h6>
								),
								width: 250,
							},
							{
								Header: 'Total Reviews',
								id: 'c_id + 9',
								accessor: info => info.reviews.reviews[info.reviews.reviews.length - 1].totalReviews,
								width: 50,
							},
							{
								Header: 'Auto',
								accessor: 'auto_amt.amt',
								width: 50,
							},
							{
								Header: 'Link',
								id: 'c_id + 1',
								accessor: info => (
									<a href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${info.place_id}`} target="_blank" rel="noopener noreferrer">
										<i className="material-icons">web</i>
									</a>
								),
								width: 50,
							},
							{
								Header: 'List Size',
								id: 'c_id + 3',
								accessor: info => info.customers.reviews[info.customers.reviews.length - 1].size,
								width: 50,
							},
							{
								Header: 'Remaining List',
								id: 'c_id + 4',
								accessor: info => info.customers.reviews[info.customers.reviews.length - 1].remaining,
								width: 50,
							},
							{
								Header: 'Status',
								id: 'c_id + 6',
								accessor: info => {
									let filt = info.reviews.reviews.filter(dat => dat.date === sunday); //CHANGE TO SAT WHEN ACTUALLY RECORDING
									return filt[0] ? filt[0].status : 'NA';
								},
								width: 100,
							},
						],
					},
					{
						columns: dates
							? dates.slice(dates.length - 8, dates.length).map(date => {
									return {
										Header: date.date.split('T')[0],
										width: 100,
										id: date.date.split('T')[0],
										accessor: info => {
											let filter = info.reviews.reviews.filter(dat => dat.date === date.date.split('T')[0])[0];
											return filter ? (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														height: '100%',
														padding: '0',
														margin: '0',
														backgroundColor: parseInt(filter.newReviews) === 0 ? 'red' : parseInt(filter.newReviews) >= 6 ? 'purple' : 'green',
														color: parseInt(filter.newReviews) === 0 ? 'black' : 'white',
													}}
												>
													{filter.newReviews}
												</div>
											) : (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														height: '100%',
														padding: '0',
														margin: '0',
														backgroundColor: 'black',
														color: 'white',
													}}
												>
													N/A
												</div>
											);
										},
									};
							  })
							: null,
					},
				]}
				PaginationComponent={Pagination}
				showPaginationBottom={pinfo.length >= this.state.pageAMT ? true : false}
				defaultPageSize={this.state.pageAMT}
				className="-striped"
				style={{ maxHeight: '90vh', maxWidth: '100%', minWidth: '60vw', zIndex: '0', padding: '0' }}
				minRows={1}
			/>
		);
		this.setState({ pinfo });
	}
	Chart() {
		let { statuses } = this.state;
		let status = statuses ? statuses : { slow: 0, good: 0, needattn: 0, urgent: 0, critical: 0, na: 0 };
		let chartData = {
			labels: ['Critical', 'Urgent', 'Needs Attention', 'Good', 'Slow', 'N/A'],
			datasets: [
				{
					data: [status.critical, status.urgent, status.needattn, status.good, status.slow, status.na],
					backgroundColor: ['rgba(234, 67, 53, 1)', 'rgba(251, 188, 5, 1)', 'rgba(255, 241, 153, 1)', 'rgba(52, 168, 83, 1)', 'rgba(3, 150, 166, 1)'],
					hoverBackgroundColor: ['rgba(234, 67, 53, .5)', 'rgba(251, 188, 5, .5)', 'rgba(255, 241, 153, .5)', 'rgba(52, 168, 83, .5)', 'rgba(3, 150, 166, .5)'],
				},
			],
		};
		return (
			<Doughnut
				options={{
					maintainAspectRatio: false,
					title: {
						display: false,
						text: 'Status',
						fontSize: 25,
					},
					legend: {
						display: true,
						position: 'top',
					},
				}}
				data={chartData}
			/>
		);
	}
	render() {
		let width = window.innerWidth;
		let { dates, statuses, sentStats } = this.state;
		let statusBox = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: width >= 1500 ? '75%' : '90%' };
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'reports', type: 'reviews' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: width >= 1500 ? '90%' : '105%',
								marginTop: '-2.5vh',
								marginLeft: width >= 1500 ? '' : '12.5vw',
							}}
						>
							<h1 className="left-align" style={{ margin: '1% 0', padding: '0' }}>
								Review Report
							</h1>
							<ThreeSplit padding="0" just="space-between">
								<BoxSplit width="30%" align="flex-start" className="card">
									<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
										Status Graph
									</h4>
									<div style={{ width: '100%', height: '80%' }}>{this.Chart()}</div>
								</BoxSplit>
								<BoxSplit width="35%" className="card" align="flex-start">
									<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
										Status %
									</h4>
									<div style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
										<div style={statusBox}>
											<h6>Critical %</h6>
											{statuses ? <p>{((statuses.critical / statuses.total) * 100).toFixed(0)}%</p> : null}
										</div>
										<div style={statusBox}>
											<h6>URGENT %</h6>
											{statuses ? <p>{((statuses.urgent / statuses.total) * 100).toFixed(0)}%</p> : null}
										</div>
										<div style={statusBox}>
											<h6>Average Google Rating</h6>
											{statuses ? <p>{statuses.avgGRating} Stars</p> : null}
										</div>
										<div style={statusBox}>
											<h6>Average LL Rating</h6>
											{statuses ? <p>{statuses.avgLLRating} Stars</p> : null}
										</div>
										<div style={statusBox}>
											<h6>Average Rating Difference</h6>
											{statuses ? <p>{Math.abs(statuses.avgLLRating - statuses.avgGRating).toFixed(2)} Stars</p> : null}
										</div>
									</div>
								</BoxSplit>
								<BoxSplit width="25%" padding="0" align="flex-start" className="card">
									<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
										Total Actions
									</h4>
									<div style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
										<div style={statusBox}>
											<h6>Sent</h6>
											{<h6>{sentStats.sent}</h6>}
										</div>
										<div style={statusBox}>
											<h6>Opened</h6>
											<h6>{sentStats.opened}</h6>
											{/* {stats ? <p>{parseInt(stats.Opened).toLocaleString()} </p> : null}
										{stats ? <p>{((stats.Opened / stats.EmailSent) * 100).toFixed(1)} % </p> : null} */}
										</div>
										<div style={statusBox}>
											<h6>Received</h6>
											<h6>{sentStats.received}</h6>

											{/* {stats ? <p>{parseInt(stats.Received).toLocaleString()} </p> : null}
										{stats ? <p>{((stats.Received / stats.EmailSent) * 100).toFixed(1)} % </p> : null}
										{stats ? <p>{((stats.Received / stats.Opened) * 100).toFixed(1)} % </p> : null} */}
										</div>
										<div style={statusBox}>
											<h6>Clicked</h6>
											<h6>{sentStats.clicked}</h6>
											{/* {stats ? <p>{parseInt(stats.Clicked).toLocaleString()} </p> : null}
										{stats ? <p>{((stats.Clicked / stats.EmailSent) * 100).toFixed(1)} % </p> : null}
										{stats ? <p>{((stats.Clicked / stats.Opened) * 100).toFixed(1)} % </p> : null}
										{stats ? <p>{((stats.Clicked / stats.Received) * 100).toFixed(1)} % </p> : null} */}
										</div>
										<div style={statusBox}>
											<h6>{''}</h6>
										</div>
										<div style={statusBox}>
											<h6>{''}</h6>
										</div>
										<div style={statusBox}>
											<h6>{''}</h6>
										</div>
									</div>
								</BoxSplit>
							</ThreeSplit>
							<div style={{ width: '40vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<RowContainer className="input-field" style={{ margin: '0', display: 'flex', alignItems: 'center', width: '40%' }}>
									<i className="material-icons" style={{ margin: '0', padding: '0' }}>
										search
									</i>
									<input
										className=""
										placeholder="Search"
										autoFocus
										onChange={e => {
											this.search(e.target.value);
										}}
										style={{ width: '92.5%', margin: '0', padding: '0' }}
									/>
								</RowContainer>
								<button style={{ margin: '0' }} className="btn primary-color primary-hover">
									FILTER
									{/* FILTER BY STATE, INDUSTRTY, TIMEZONE ETC */}
								</button>
								<div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
									<h6 style={{ margin: '0', padding: '0', marginRight: '10%' }}>Limit</h6>
									<div style={{ width: '5vw', display: 'flex', alignItems: 'center' }}>
										<Select value={this.state.pageAMT.toString()} onChange={async e => this.changePage(e.target.value)}>
											<option value="10">10</option>
											<option value="25">25</option>
											<option value="50">50</option>
											<option value="75">75</option>
											<option value="100">100</option>
											<option value="250">250</option>
											<option value="500">500</option>
											<option value="750">750</option>
											<option value="1000">1000</option>
											<option value="1500">1500</option>
											<option value="2000">2000</option>
										</Select>
									</div>
								</div>
							</div>
							<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="card">
								{dates ? <div style={{ width: '100%' }}>{this.state.pinfo}</div> : null}
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
export default connect(mapStateToProps, {})(ReviewReport);
