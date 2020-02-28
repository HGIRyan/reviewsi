import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from '../../utilities/index';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import simString from 'string-similarity';
import Moment, { localeData } from 'moment';

class GMBDetails extends Component {
	constructor() {
		super();

		this.state = {
			accessToken: '',
			search: '',
			location_data: {},
			insights: [],
			locations: [],
			og: [],
			searching: false,
			allTimeSearch: false,
			api: false,
			newAccount: '',
			all: false,
		};
	}
	async search(type) {
		let { search, locations, accessToken, api, og } = this.state;
		if (!locations[0] || api) {
			type ? this.setState({ allTimeSearch: true }) : this.setState({ searching: true });
			await axios.post(`/api/gmb/allaccounts`, { accessToken, api, search }).then(res => {
				this.setState({ searching: false, allTimeSearch: false });
				if (res.data.msg === 'GOOD' && !api) {
					let accounts = this.filterList(res.data.info);
					this.setState({ locations: accounts, og: res.data.info });
					if (type) {
						this.setState({ all: true });
						this.allAverage();
					} else {
						this.setState({ all: false });
					}
				} else if (accessToken && api && res.data.msg === 'GOOD') {
					let info = [];
					res.data.info.locations.map(e =>
						info.push({ location_id: e.name.split('/')[3], location_name: e.locationName, verified: e.locationState.isVerified, city: e.address.locality }),
					);
					this.setState({ locations: info });
				}
			});
		} else {
			let accounts = this.filterList(og);
			this.setState({ locations: accounts, location_data: {} });
			if (type) {
				this.setState({ all: true });
				this.allAverage();
			} else {
				this.setState({ all: false });
			}
		}
	}
	async allAverage() {
		let locations = this.state.locations.filter(e => e.insights !== null && e.insights.insights[0]);
		let one = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2018-09-01', count: 0 };
		let two = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2018-10-01', count: 0 };
		let three = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2018-11-01', count: 0 };
		let four = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2018-12-01', count: 0 };
		let five = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-01-01', count: 0 };
		let six = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-02-01', count: 0 };
		let sev = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-03-01', count: 0 };
		let eig = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-04-01', count: 0 };
		let nine = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-05-01', count: 0 };
		let ten = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-06-01', count: 0 };
		let elev = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-07-01', count: 0 };
		let twel = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-08-01', count: 0 };
		let thirt = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-09-01', count: 0 };
		let fourt = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-10-01', count: 0 };
		let fift = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-11-01', count: 0 };
		let sixt = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2019-12-01', count: 0 };
		let sevent = { website: 0, calls: 0, direct: 0, indirect: 0, chain: 0, views: 0, total: 0, startTime: '2020-01-01', count: 0 };
		let loop = [one, two, three, four, five, six, sev, eig, nine, ten, elev, twel, thirt, fourt, fift, sixt, sevent];
		await locations
			// .slice( 0, 1 )
			.map(e => {
				loop
					// .slice( 0, 1 )
					.forEach(el => {
						let sight = e.insights.insights.filter(i => i.range.startTime.split('T')[0] === el.startTime);
						if (sight[0]) {
							sight = sight[0];
							el.website = el.website + parseInt(sight.website);
							el.calls = el.calls + parseInt(sight.calls);
							el.direct = el.direct + parseInt(sight.direct);
							el.indirect = el.indirect + parseInt(sight.indirect);
							el.chain = el.chain + parseInt(sight.chain);
							el.views = el.views + parseInt(sight.views);
							el.total = el.total + parseInt(sight.total);
							el.count = el.count + 1;
						}
					});
			});
		await loop.map(e => {
			e.website = (e.website / e.count).toFixed(0);
			e.calls = (e.calls / e.count).toFixed(0);
			e.direct = (e.direct / e.count).toFixed(0);
			e.indirect = (e.indirect / e.count).toFixed(0);
			e.chain = (e.chain / e.count).toFixed(0);
			e.views = (e.views / e.count).toFixed(0);
			e.total = (e.total / e.count).toFixed(0);
		});
		let insights = {
			insights: loop,
		};
		let locationData = {
			id: 1,
			location_id: 1,
			insights,
			verified: true,
			location_name: 'All Time Averages',
		};
		this.setState({ location_data: locationData });
	}
	filterList(info) {
		let { search } = this.state;
		return info
			.filter(e => e.location_name.toLowerCase().includes(search.toLowerCase()))
			.sort((a, b) =>
				simString.compareTwoStrings(search, a.location_name.toLowerCase()) > simString.compareTwoStrings(search, b.location_name.toLowerCase()) ? 1 : -1,
			);
	}
	async selectAccount(e) {
		if (e.id) {
			this.setState({ location_data: e });
		} else {
			this.setState({ newAccount: e.location_id });
			alert('Please Wait up to 25 Seconds');
			await axios.post('/api/gmb/addaccount', { e, accessToken: this.state.accessToken }).then(res => {
				if (res.data.msg === 'GOOD') {
					let accounts = this.filterList(res.data.info);
					let data = res.data.info.filter(el => el.location_id === e.location_id)[0];
					this.setState({ locations: accounts, og: res.data.info, location_data: data, newAccount: '' });
				}
			});
		}
	}
	randomColor() {
		let first = Math.floor(Math.random(50) * Math.floor(255));
		let sec = Math.floor(Math.random(50) * Math.floor(255));
		let third = Math.floor(Math.random(50) * Math.floor(255));
		let fill = Math.floor(Math.random() * (6 - 1) + 1);
		let color = `rgba(${first}, ${sec}, ${third}, .${fill})`;
		return color;
	}
	InsightGraph(type) {
		let { location_data } = this.state;
		if (location_data.location_id) {
			let chartData = {};
			if (!this.state.all) {
				let sight = location_data.insights.insights
					.sort((a, b) => (Moment(a.range.startTime).format('x') >= Moment(b.range.startTime) ? 1 : -1))
					.filter(e => e.range.startTime && e[type] !== 0);
				chartData = {
					labels: sight.map(e => e.range.startTime.split('T')[0] + ' - ' + e.range.endTime.split('T')[0]),
					datasets: [
						{
							label: type === 'chain' ? 'Branded' : type.toProper(),
							data: sight.map(e => e[type]),
							backgroundColor: [this.randomColor()],
							borderColor: [this.randomColor()],
							// fill: false,
						},
					],
				};
			} else {
				chartData = {
					labels: location_data.insights.insights.map(e => e.startTime),
					datasets: [
						{
							label: type === 'chain' ? 'Branded' : type.toProper(),
							data: location_data.insights.insights.map(e => e[type]),
							backgroundColor: [this.randomColor()],
							borderColor: [this.randomColor()],
						},
					],
				};
			}
			return (
				<Line
					height={5}
					width={20}
					options={{
						maintainAspectRatio: false,
						// responsive: false,
						title: {
							display: false,
							text: type,
							fontSize: 25,
						},
						legend: {
							display: true,
							position: 'top',
						},
						hover: {
							mode: 'nearest',
							intersect: true,
						},
						scales: {
							xAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
								},
							],
							yAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
								},
							],
						},
					}}
					data={chartData}
				/>
			);
		}
	}
	render() {
		let graphStyle = { height: '20vh', width: '80%', marginBottom: '2.5%' };
		let user = this.props.location.state.userName;
		return (
			<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<div style={{ minHeight: '50vh', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
					{user === 'rhutchison' ? (
						<div style={{ width: '100%', height: '10vh', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
							<div className="input-field" style={{ height: '5vh', width: '30%' }}>
								<h2 style={{ margin: '0' }}>
									<input value={this.state.accessToken} onChange={e => this.setState({ accessToken: e.target.value })} />
								</h2>
								<label>Access Token</label>
							</div>
							<button className="btn primary-color primary-hover" style={{ marginLeft: '5%', marginTop: '2.5%' }}>
								Reset
							</button>
						</div>
					) : null}
					<div style={{ width: '100%', height: '10vh', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
						<div className="input-field" style={{ height: '5vh', width: '30%' }}>
							<h2 style={{ margin: '0' }}>
								<input
									value={this.state.search}
									onChange={e => this.setState({ search: e.target.value })}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											this.search();
										}
									}}
								/>
							</h2>
							<label>Search Term</label>
						</div>
						<LoadingWrapperSmall loading={this.state.searching} style={{ marginLeft: '5%', marginTop: '2.5%' }}>
							<button className="btn primary-color primary-hover" onClick={() => this.search()}>
								Search
							</button>
						</LoadingWrapperSmall>
						{user === 'rhutchison' ? (
							<label style={{ width: '35%', display: 'flex', justifyContent: 'flex-start', marginTop: '2.5%' }}>
								<input
									type="checkbox"
									checked={this.state.api && this.state.accessToken}
									onChange={() => (this.state.accessToken ? this.setState({ api: !this.state.api }) : null)}
								/>
								<span className="tab">API Search [Checked = Will Search and Return GMB API Results]</span>
							</label>
						) : null}
						<LoadingWrapperSmall loading={this.state.allTimeSearch} style={{ marginLeft: '5%', marginTop: '2.5%' }}>
							<button className="btn primary-color primary-hover" onClick={() => this.search('all')}>
								Get ALL
							</button>
						</LoadingWrapperSmall>
					</div>
					{this.state.location_data.location_id ? (
						<div style={{ width: '100%', minHeight: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<h1>{this.state.location_data.location_name}</h1>
							<div style={graphStyle} className="card">
								{this.InsightGraph('calls')}
							</div>
							<div style={graphStyle} className="card">
								{this.InsightGraph('website')}
							</div>
							<div style={graphStyle} className="card">
								{this.InsightGraph('direct')}
							</div>
							<div style={graphStyle} className="card">
								{this.InsightGraph('indirect')}
							</div>
							<div style={graphStyle} className="card">
								{this.InsightGraph('chain')}
							</div>
							<div style={graphStyle} className="card">
								{this.InsightGraph('total')}
							</div>
						</div>
					) : (
						<div style={{ width: '100%', minHeight: '30vh', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '5%' }}>
							{this.state.locations.map((e, i) => {
								return (
									<LoadingWrapperSmall loading={this.state.newAccount === e.location_id} style={{ width: '45%' }} key={i}>
										<div
											className="card hoverable"
											style={{ width: '100%', height: '5vh', display: 'flex', justifyContent: 'space-around', alignItems: 'center', cursor: 'pointer' }}
											onClick={() => this.selectAccount(e)}
										>
											<h6> {e.location_name}</h6>
											<h6>{e.location_id}</h6>
											{e.city ? <h6>{e.city}</h6> : null}
											<label style={{ width: '20%', display: 'flex', justifyContent: 'flex-start' }}>
												<input type="checkbox" checked={e.verified ? true : false} readOnly />
												<span className="tab">Verified</span>
											</label>
										</div>
									</LoadingWrapperSmall>
								);
							})}
						</div>
					)}
				</div>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(GMBDetails);
