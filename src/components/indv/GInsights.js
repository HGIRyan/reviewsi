import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, LoadingWrapperSmall, NoDiv } from './../../utilities/index';
import moment from 'moment';
import { Modal } from 'react-materialize';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { Line } from 'react-chartjs-2';

class GInsight extends Component {
	constructor() {
		super();

		this.state = {
			calls: '',
			website: '',
			direction: '',
			messages: '',
			searches: { total: '', direct: '', discovery: '', branded: '' },
			reviews: '24',
			loading: true,
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' },
			recent: { searches: { total: 5 } },
			date: '',
			newCalls: '',
			newSite: '',
			newSearches: '',
			newDirection: '',
			newMessages: '',
			updating: false,
		};
	}
	async componentDidMount() {
		// let { info } = this.props.User;
		let { client_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let exists = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				await this.hasInsight(exists[0]);
			} else {
				await this.getInsight();
			}
		} else {
			await this.getInsight();
		}
		this.setState({ loading: false });
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
		let { og } = this.state;
		if (og.cor_id) {
			let chartData = {};
			if (type !== 'searches' && type !== 'reviews' && type !== 'ratings') {
				let anal = og[type][type].sort((a, b) => (a.date >= b.date ? 1 : -1));
				anal = anal.length >= 30 ? anal.filter((e, i) => (i % 5 === 0 ? e : null)) : anal;
				chartData = {
					labels: anal.map(e => e.date),
					datasets: [
						{
							label: type,
							data: anal.map(e => e[type]),
							backgroundColor: [this.randomColor()],
							borderColor: [this.randomColor()],
						},
					],
				};
			} else if (type === 'searches') {
				chartData = {
					labels: og.searches.searches.map(e => e.date),
					datasets: [
						{
							label: type,
							data: og.searches.searches.map(e => e.total),
							backgroundColor: [this.randomColor()],
							borderColor: [this.randomColor()],
						},
					],
				};
			} else if (type === 'reviews') {
				let nth = og.reviews.reviews.length >= 20 ? og.reviews.reviews.filter((e, i) => (i % 5 === 0 ? e : null)) : og.reviews.reviews;
				chartData = {
					labels: nth.map(e => e.date),
					datasets: [
						{
							label: 'New Reviews',
							data: nth.map(e => e.newReviews),
							borderColor: [this.randomColor()],
						},
					],
				};
			} else if (type === 'ratings') {
				let nth = og.reviews.reviews.length >= 20 ? og.reviews.reviews.filter((e, i) => (i % 5 === 0 ? e : null)) : og.reviews.reviews;
				chartData = {
					labels: nth.map(e => e.date),
					datasets: [
						// {
						// 	label: 'Total',
						// 	data: nth.map(e => e.totalReviews),
						// 	borderColor: [this.randomColor()],
						// 	showLabel: false,
						// },
						{
							label: 'Rating',
							data: nth.map(e => e.rating),
							borderColor: [this.randomColor()],
						},
						{
							label: 'llRating',
							data: nth.map(e => e.llrating),
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
						title: {
							display: false,
							text: type,
							fontSize: 25,
						},
						legend: {
							display: type === 'reviews' || type === 'ratings',
							position: 'top',
						},
					}}
					data={chartData}
				/>
			);
		} else {
			return 'Loading....';
		}
	}
	async getInsight() {
		let { client_id, loc } = this.props.match.params;
		await axios.get(`/api/insights/${client_id}/${loc}`).then(res => {
			if (res.data.msg === 'GOOD') {
				let { info } = res.data;
				this.hasInsight(info);
			} else {
				alert(res.data.msg);
			}
		});
	}
	async hasInsight(info) {
		let { calls, website, direction, searches, messages } = info;
		let date = moment(calls.calls[calls.calls.length - 1].date).format('l');
		calls = calls.calls[calls.calls.length - 1].calls;
		website = website.website[website.website.length - 1].website;
		direction = direction.direction[direction.direction.length - 1].direction;
		messages = messages.messages[messages.messages.length - 1].messages;
		let direct = searches.searches[searches.searches.length - 1].direct;
		let branded = searches.searches[searches.searches.length - 1].branded;
		let discovery = searches.searches[searches.searches.length - 1].discovery;
		let total = searches.searches[searches.searches.length - 1].total;
		searches = { direct, branded, discovery, total };
		let reviews = info.reviews.reviews[info.reviews.reviews.length - 1].totalReviews;
		let recent = { calls, website, direction, messages, searches, reviews };
		this.setState({ recent, date, og: info });
	}
	async updateInsights() {
		let { newCalls, newDirection, newSite, newSearches, newMessages, og } = this.state;
		let date = moment().format('YYYY-MM-DD');
		this.setState({ updating: true });
		if (newCalls || newDirection || newSite || newSearches || newMessages) {
			og.calls.calls.push({ calls: newCalls, date });
			og.direction.direction.push({ direction: newDirection, date });
			og.website.website.push({ website: newSite, date });
			og.messages.messages.push({ messages: newMessages, date });
			og.searches.searches.push({ total: newSearches, date });
			await axios.post('/api/indv/ginsights/update', { og }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.props.location.state.info.map(e => (e = parseInt(e.c_id) === parseInt(og.c_id) ? og : e));
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('No New Insights Inputed');
		}
		this.setState({ updating: false });
	}
	render() {
		let { recent, newCalls, newDirection, newSite, newSearches, newMessages } = this.state;
		// let today = () => moment().format('l');
		let perm = this.props.location.state.permissions;
		let titleStyle = { width: '100%', display: 'flex', justifyContent: 'flex-start', padding: '0', margin: '0', marginLeft: '5%' };
		let container = { height: '12.5vh', width: '100%' };
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<div
							style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', padding: '0 5%' }}
							className={perm === 'admin' ? 'card hoverable' : ''}
						>
							<h3>Google Insights</h3>
							<Modal
								header="Add New Recent Insights"
								trigger={perm === 'admin' ? <button className="btn primary-color primary-hover">Add Insights</button> : null}
							>
								<div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="calls">
											<i className="material-icons prefix">phone</i>
											<input type="number" onChange={e => this.setState({ newCalls: e.target.value })} value={newCalls} />
											<label htmlFor="icon_telephone">Calls: </label>
										</div>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="site">
											<i className="material-icons prefix">web</i>
											<input type="number" value={newSite} onChange={e => this.setState({ newSite: e.target.value })} />
											<label htmlFor="icon_telephone">Site Clicks: </label>
										</div>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="search">
											<i className="material-icons prefix">search</i>
											<input type="number" value={newSearches} onChange={e => this.setState({ newSearches: e.target.value })} />
											<label htmlFor="icon_telephone">Searches: </label>
										</div>
										<ReactTooltip id="calls" type="dark" effect="float" place="bottom">
											<span>Calls</span>
										</ReactTooltip>
										<ReactTooltip id="site" type="dark" effect="float" place="bottom">
											<span>site</span>
										</ReactTooltip>
										<ReactTooltip id="search" type="dark" effect="float" place="bottom">
											<span>search</span>
										</ReactTooltip>
									</div>
									<div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="direction">
											<i className="material-icons prefix">directions</i>
											<input type="number" value={newDirection} onChange={e => this.setState({ newDirection: e.target.value })} />
											<label htmlFor="icon_telephone">Directions: </label>
										</div>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="message">
											<i className="material-icons prefix">message</i>
											<input type="number" value={newMessages} onChange={e => this.setState({ newMessages: e.target.value })} />
											<label htmlFor="icon_telephone">Messages: </label>
										</div>
										<LoadingWrapperSmall loading={this.state.updating} text="Updating Insights">
											<button className="btn primary-color primary-hover" style={{ marginLeft: '50%' }} onClick={() => this.updateInsights()}>
												Submit
											</button>
										</LoadingWrapperSmall>
										<ReactTooltip id="direction" type="dark" effect="float" place="bottom">
											<span>direction</span>
										</ReactTooltip>
										<ReactTooltip id="message" type="dark" effect="float" place="bottom">
											<span>message</span>
										</ReactTooltip>
									</div>
								</div>
							</Modal>
						</div>
						<hr />
						<div style={{ width: '90%', display: 'flex' }} className="">
							<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 2.5%' }} className="card hoverable">
								<h5>Most Recent Insights</h5>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
									<NoDiv align="center">
										<i className="material-icons prefix">phone</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="calls">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.calls} />
											</h2>
											<label htmlFor="icon_telephone">Calls: </label>
										</div>
									</NoDiv>
									<NoDiv align="center">
										<i className="material-icons prefix">web</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="site">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.website} />
											</h2>
											<label htmlFor="icon_telephone">Site Clicks: </label>
										</div>
									</NoDiv>
									<NoDiv align="center">
										<i className="material-icons prefix">search</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="search">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.searches.total} />
											</h2>
											<label htmlFor="icon_telephone">Searches: </label>
										</div>
									</NoDiv>
									<ReactTooltip id="calls" type="dark" effect="float" place="bottom">
										<span>Calls</span>
									</ReactTooltip>
									<ReactTooltip id="site" type="dark" effect="float" place="bottom">
										<span>site</span>
									</ReactTooltip>
									<ReactTooltip id="search" type="dark" effect="float" place="bottom">
										<span>search</span>
									</ReactTooltip>
									<NoDiv align="center">
										<i className="material-icons prefix">directions</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="direction">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.direction} />
											</h2>
											<label htmlFor="icon_telephone">Directions: </label>
										</div>
									</NoDiv>
									<NoDiv align="center">
										<i className="material-icons prefix">message</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="message">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.messages} />
											</h2>
											<label htmlFor="icon_telephone">Messages: </label>
										</div>
									</NoDiv>
									<NoDiv align="center">
										<i className="material-icons prefix">stars</i>
										<div className="input-field" style={{ width: '100%' }} data-tip data-for="review">
											<h2 style={{ margin: '0' }}>
												<input disabled type="text" value={recent.reviews} />
											</h2>
											<label htmlFor="icon_telephone">Reviews: </label>
										</div>
									</NoDiv>
									<ReactTooltip id="direction" type="dark" effect="float" place="bottom">
										<span>direction</span>
									</ReactTooltip>
									<ReactTooltip id="message" type="dark" effect="float" place="bottom">
										<span>message</span>
									</ReactTooltip>
									<ReactTooltip id="review" type="dark" effect="float" place="bottom">
										<span>review</span>
									</ReactTooltip>
								</div>
							</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Reviews</h4>
							<div style={container}>{this.InsightGraph('reviews')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Ratings</h4>
							<div style={container}>{this.InsightGraph('ratings')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Calls</h4>
							<div style={container}>{this.InsightGraph('calls')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Searches</h4>
							<div style={container}>{this.InsightGraph('searches')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Website Clicks</h4>
							<div style={container}>{this.InsightGraph('website')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Direction Clicks</h4>
							<div style={container}>{this.InsightGraph('direction')}</div>
						</div>
						<div
							style={{ width: '90%', height: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							className="card hoverable"
						>
							<h4 style={titleStyle}>Messages</h4>
							<div style={container}>{this.InsightGraph('messages')}</div>
						</div>
						{/* <ThreeSplit just="flex-start" height="auto">
							<BoxSplit align="flex-start" width="30vw" padding="2.5%">
								<h2>Most Recent Insights as of {date} :</h2>
								<h5>Calls: {recent.calls ? recent.calls : 0}</h5>
								<h5>Website: {recent.website ? recent.website : 0}</h5>
								<h5>Directions: {recent.directin ? recent.direction : 0}</h5>
								<h5>Messages: {recent.messages ? recent.messages : 0}</h5>
								<h5>Searches: </h5>
								<h5 className="tab">Total: {recent.searches ? recent.searches.total : '0'}</h5>
								<h5 className="tab">Direct: {recent.searches ? recent.searches.direct : '0'}</h5>
								<h5 className="tab">Discovery: {recent.searches ? recent.searches.discovery : '0'}</h5>
								<h5 className="tab">Branded: {recent.searches ? recent.searches.branded : '0'}</h5>
								<h5>Total Reviews: {reviews}</h5>
							</BoxSplit>
							<BoxSplit align="flex-start" width="30vw" padding=".8%">
								<h2>
									Add New Insights as of {today()} : <button onClick={() => this.update()}>Update</button>
								</h2>
								<h5>
									Calls:{' '}
									<input
										type="number"
										value={calls}
										onChange={e => {
											this.setState({ calls: e.target.value });
										}}
									/>
								</h5>
								<h5>
									Website:{' '}
									<input
										type="number"
										value={website}
										onChange={e => {
											this.setState({ website: e.target.value });
										}}
									/>
								</h5>
								<h5>
									Directions:{' '}
									<input
										type="number"
										value={direction}
										onChange={e => {
											this.setState({ direction: e.target.value });
										}}
									/>{' '}
								</h5>
								<h5>
									Messages:{' '}
									<input
										type="number"
										value={messages}
										onChange={e => {
											this.setState({ messages: e.target.value });
										}}
									/>{' '}
								</h5>
								<h5>Searches: </h5>
								<h5 className="tab">
									Total:{' '}
									<input
										type="number"
										value={searches.total}
										onChange={e => {
											this.setState({ searches: { total: e.target.value, direct: searches.direct, discovery: searches.discovery, branded: searches.branded } });
										}}
									/>
								</h5>
								<h5 className="tab">
									Direct:{' '}
									<input
										type="number"
										value={searches.direct}
										onChange={e => {
											this.setState({ searches: { total: searches.total, direct: e.target.value, discovery: searches.discovery, branded: searches.branded } });
										}}
									/>
								</h5>
								<h5 className="tab">
									Discovery:{' '}
									<input
										type="number"
										value={searches.discovery}
										onChange={e => {
											this.setState({ searches: { total: searches.total, direct: searches.direct, discovery: e.target.value, branded: searches.branded } });
										}}
									/>
								</h5>
								<h5 className="tab">
									Branded:{' '}
									<input
										type="number"
										value={searches.branded}
										onChange={e => {
											this.setState({ searches: { total: searches.total, direct: searches.direct, discovery: searches.discovery, branded: e.target.value } });
										}}
									/>{' '}
								</h5>
								<h5>Total Reviews: {reviews} </h5>
							</BoxSplit>
						</ThreeSplit>
						<h1>Insight History</h1>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p>Here Goes the Call Graph</p>
							{this.InsightGraph('Calls')}
						</Infobox>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p> Here Goes the Website Graph</p>
							{this.InsightGraph('Website')}
						</Infobox>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p>Here Goes the Directions Graph</p>
							{this.InsightGraph('Direction')}
						</Infobox>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p>Here Goes the Messages Graph</p>
							{this.InsightGraph('Messages')}
						</Infobox>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p> Here Goes the Searches Graph</p>
							{this.InsightGraph('Searches')}
						</Infobox>
						<Infobox width="90%" height="20vh" border="solid black 1px" margin="1% 0 1% 0" direction="column">
							<p>Here Goes the Total Reviews Graph</p>
							{this.InsightGraph('Total Reviews')}
						</Infobox> */}
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(GInsight);
