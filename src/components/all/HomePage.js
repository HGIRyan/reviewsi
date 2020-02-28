import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addToUser } from './../../ducks/User';
import { Layout1, LoadingWrapper, StyledLink, pagination } from './../../utilities/index';
// import InfoContainer from './function/InfoContainer';
import simString from 'string-similarity';
import { Modal } from 'react-materialize';
class HomePage extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			company: [],
			SearchBy: 'company_name',
			showMore: false,
			specIndustry: '',
			searching: '',
			current: 1,
			perPage: 100,
			pages: '',
		};
	}
	async componentDidMount() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.title = 'Lift Local - Home';
		if (this.props.location.state) {
			let { info, industry } = this.props.location.state;
			info = info
				.sort((a, b) => a.cor_id - b.cor_id) //Sort to have oldest at top
				.sort((a, b) => b.active - a.active); //SORT TO HAVE INACTIVE ALL LAST
			await this.setState({ og: info, industry: industry, info: info, amount: info.length });
			// this.CompanyInfo(info);
		} else {
			await this.GetCompanyInfo();
		}
		await this.setState({ loading: false });
	}
	async Search(value) {
		let { og } = this.state;
		this.setState({ searching: value });
		if (value.length >= 2 && value.length % 2 === 0) {
			value = value.toLowerCase();
			let similar;
			similar = await og
				.filter(
					item =>
						simString.compareTwoStrings(value, item.company_name.toLowerCase()) >= 0.2 ||
						item.company_name.toLowerCase().includes(value.toLowerCase()) ||
						item.industry.toLowerCase().includes(value.toLowerCase()) ||
						item.address.state.toLowerCase().includes(value.toLowerCase()) ||
						item.address.city.toLowerCase().includes(value.toLowerCase()) ||
						item.c_id
							.toString()
							.toLowerCase()
							.includes(value.toLowerCase()) ||
						item.cor_id
							.toString()
							.toLowerCase()
							.includes(value.toLowerCase()),
				)
				.sort((a, b) =>
					simString.compareTwoStrings(value, a.company_name.toLowerCase()) > simString.compareTwoStrings(value, b.company_name.toLowerCase()) ? 1 : -1,
				);
			this.setState({ info: similar, current: 1 });
			// await this.CompanyInfo(similar);
		} else if (value.length === 0) {
			this.setState({ info: og });
		}
	}
	async chanegPage(num) {
		let { current, info, perPage } = this.state;
		let pages = Math.ceil(info.length / perPage);
		if (num !== '-1' && num !== '+1') {
			this.setState({ current: num });
		} else {
			if (num === '+1' && current !== pages) {
				this.setState({ current: current + 1 });
			} else if (num === '-1' && current !== 1) {
				this.setState({ current: current - 1 });
			}
		}
	}
	CompanyInfo(info) {
		let { current, perPage } = this.state;
		let page = pagination(info, current, perPage);
		return page.arr.map((info, i) => {
			let total = info.customers.reviews[info.customers.reviews.length - 1].size;
			let remaining = info.customers.reviews[info.customers.reviews.length - 1].remaining;
			return (
				<div
					className="card hoverable"
					key={i}
					style={{
						border: `${total === 0 ? 'solid rgba(250, 0, 0, .9) 5px' : remaining === 0 ? 'solid rgba(250, 0, 0, .5) 5px' : ''}`,
						margin: '1vh 0',
						backgroundColor: `${i % 2 !== 0 ? '' : 'lightgray'}`,
						zIndex: '1',
					}}
				>
					<div className="card-content center-align" style={{ cursor: 'pointer', display: 'flex', height: '5vh', padding: '0 2.5%' }}>
						<div
							className="left-align"
							style={{ width: '7.5%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
							onClick={() => this.props.history.push(`/client-dash/${info.cor_id}/${info.c_id}`, this.props.location.state)}
						>
							<h6 style={{ margin: '0' }}>c_id: {info.c_id}</h6>
							<h6 style={{ margin: '0' }}>cor_id: {info.cor_id}</h6>
						</div>
						<h6
							className="left-align valign-wrapper"
							style={{ marginTop: '.8%', width: '20%' }}
							onClick={() => this.props.history.push(`/client-dash/${info.cor_id}/${info.c_id}`, this.props.location.state)}
						>
							{info.company_name.slice(0, 30)}
						</h6>
						<div
							className="left-align valign-wrapper"
							style={{ width: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingRight: '5%' }}
						>
							<h6 style={{ margin: '0', fontSize: '1em' }}>{info.address.city.slice(0, 12)}</h6>
							<h6 style={{ margin: '0', fontSize: '1em' }}>{`, ${info.address.state}`}</h6>
						</div>
						<div
							style={{
								backgroundColor: `${parseInt(total) === 0 ? 'rgba(240, 52, 52, .5)' : ''}`,
								width: '60%',
								height: '100%',
								display: 'flex',
							}}
						>
							<h6 className="left-align " style={{ width: '10%' }}>
								{info.auto_amt.amt}
							</h6>
							<h6 className="left-align " style={{ width: '10%' }}>
								{total}
							</h6>
							<h6 className="left-align " style={{ width: '10%' }}>
								{remaining}
							</h6>
							<div className="left-align valign-wrapper" style={{ marginTop: '.1%', padding: '0', width: '40%' }}>
								<h6 style={{ margin: '0' }}>
									{info.place_id && info.place_id !== 'N/A' ? (
										<a
											className={`btn primary-color primary-hover`}
											href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${info.place_id}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Google Listing
										</a>
									) : (
										<a
											className={`btn primary-color primary-hover`}
											href={`https://www.google.com/search?q=${info.company_name +
												' ' +
												info.address.street +
												' ' +
												info.address.city +
												' ' +
												info.address.zip}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Google Listing
										</a>
									)}
								</h6>
							</div>
							<h6 className="left-align " style={{ width: '10%' }}>
								{info.created.split('T')[0]}
							</h6>
							{!info.active || total === 0 || remaining === 0 ? (
								<h6 className="left-align " style={{ width: '10%' }}>
									{!info.active ? <i className="material-icons">money_off</i> : null}
									{total === 0 ? <i className="material-icons">sports_kabaddi</i> : null}
									{remaining === 0 ? <i className="material-icons">sentiment_very_dissatisfied</i> : null}
								</h6>
							) : null}
						</div>
					</div>
				</div>
			);
		});

		// await this.setState({ company, loading: false, amount: company.length, pages });
		// return company;
	}
	async GetCompanyInfo() {
		await axios.get('/api/home/info').then(async res => {
			if (res.data.msg === 'GOOD') {
				this.props.location.state.info = res.data.info;
				this.props.location.state.industry = res.data.industry;
				let info = this.props.location.state.info;
				let industry = this.props.location.state.industry;
				info = info
					.sort((a, b) => a.cor_id - b.cor_id) //Sort to have oldest at top
					.sort((a, b) => b.active - a.active); //SORT TO HAVE INACTIVE ALL LAST
				this.setState({ info, og: info, industry, amount: info.length });
			} else {
				if (res.data.msg === 'NO SESSION') {
					this.props.history.push('/', {});
				} else {
					alert(res.data.msg);
				}
			}
		});
	}
	async onEnter() {
		let { info } = this.state;
		if (info[0]) {
			let dat = info[0];
			this.props.history.push(`/client-dash/${dat.cor_id}/${dat.c_id}`, this.props.location.state);
		}
	}
	render() {
		let width = window.innerWidth;
		let { specIndustry, info, current, perPage } = this.state;
		let pages = info ? (
			<div
				style={{
					marginTop: '-5%',
					width: `${width >= 1500 ? '80vw' : '90vw'}`,
					// zIndex: 5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
					paddingBottom: '.5%',
				}}
			>
				<button className={`btn ${current === 1 ? 'secondary-color noCursor' : 'primary-color primary-hover'}`} onClick={() => this.chanegPage('-1')}>
					<i className="material-icons">arrow_back_ios </i>
				</button>
				{pagination(info, current, perPage).pages.map(number => {
					return (
						<button
							key={number}
							id={number}
							onClick={() => this.chanegPage(number)}
							className={`btn ${current === number ? 'secondary-color noCursor' : 'primary-color primary-hover'}`}
						>
							{number}
						</button>
					);
				})}
				<button
					className={`btn ${current === Math.ceil(info.length / perPage) ? 'secondary-color' : 'primary-color primary-hover'}`}
					onClick={() => this.chanegPage('+1')}
				>
					<i className="material-icons">arrow_forward_ios</i>
				</button>
			</div>
		) : null;
		let company = info ? this.CompanyInfo(info) : null;
		return (
			<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div className="navbar-fixed" style={{ position: '-webkit-sticky', top: '-8vh' }}>
						<nav className="tertiary-color" style={{ width: '30%', right: `${width >= 1500 ? '10vw' : '5vw'}`, boxShadow: 'none', height: '4vh' }}>
							<div className="nav-wrapper row" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="input-field col s8 left " style={{ display: 'flex', alignItems: 'center', height: '90%' }}>
									<i className="material-icons" style={{ position: 'absolute', marginTop: '.5vh' }}>
										search
									</i>
									<input
										id="search"
										type="search"
										placeholder="Search"
										className="tertiary-color searchB"
										onChange={e => this.Search(e.target.value)}
										value={this.state.searching}
										onKeyPress={e => (e.key === 'Enter' ? this.onEnter() : null)}
										autoFocus
										style={{
											fontSize: '1.2em',
											padding: '0px 2.5vw',
											margin: '0px',
											marginLeft: '-5%',
											marginTop: '1vh',
										}}
									/>
									<Modal
										style={{ width: '20vw', padding: '0' }}
										header="Search Process"
										trigger={
											<i
												className="material-icons primary-color primary-hover"
												style={{
													marginTop: '1vh',
													height: '2.5vh',
													width: '2.5vh',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: '2.5vh',
												}}
											>
												info
											</i>
										}
									>
										<p>
											Searching returns <br /> Company Name, <br /> Coorporation, <br /> City and State
										</p>
									</Modal>
								</div>
								<div className="col s4 right" style={{ height: '90%', marginTop: '-2.5vh' }}>
									<StyledLink
										className="btnn-small primary-color"
										to={{ pathname: `/addbusiness/${specIndustry}`, state: this.props.location.state }}
										// style={{ display: 'flex', padding: '0', margin: '0', justifyContent: 'center', alignItems: 'center' }}
									>
										<span role="img" aria-label="emoji">
											➕
										</span>{' '}
										Business
									</StyledLink>
								</div>
							</div>
						</nav>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%',
							marginTop: '-10vh',
							marginLeft: width >= 1500 ? '' : '10vw',
						}}
					>
						<div
							className="card"
							style={{
								position: 'fixed',
								padding: '0',
								lineHeight: 'normal',
								zIndex: '5',
								width: width >= 1500 ? '75vw' : '90vw',
								height: '4vh',
								backgroundColor: 'white',
								color: 'black',
								borderBottom: 'solid lightgray',
								margin: '0',
							}}
						>
							{/* <nav
								className="card"
								style={{
									height: '4vh',
									backgroundColor: 'lightgray',
									color: 'black',
									margin: '0 auto',
									maxWidth: '100%',
								}}
							> */}
							<div
								className="row center-align valign-wrapper"
								style={{ width: '100%', display: 'flex', height: '100%', zIndex: '100 !important', padding: '0 2.5%' }}
							>
								<p style={{ lineHeight: 'normal', margin: '0', width: '7.5%' }} className="left-align">
									ID:
								</p>
								<p style={{ lineHeight: 'normal', margin: '0', width: '20%' }} className="left-align">
									Company Name
								</p>
								<p style={{ width: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingRight: '5%' }} className="left-align">
									City
								</p>
								<div style={{ display: 'flex', minWidth: '60%' }} className=" left-align valign-wrapper">
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }} className="left-align">
										Auto:{' '}
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }} className="left-align">
										List Size:{' '}
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '11%' }} className="left-align">
										Remaining:
									</p>
									{/* <p style={{ lineHeight: 'normal', margin: '0', width: '15%' }} className="left-align">
										Locations
									</p> */}
									<p style={{ lineHeight: 'normal', margin: '0', width: '40%', padding: '0' }} className="center-align valign-wrapper">
										Google Listing:
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }}>Created: </p>
								</div>
							</div>
							{/* </nav> */}
							{/*  */}
						</div>
						<div
							className=""
							style={{
								width: width >= 1500 ? '75vw' : '90vw',
								display: 'flex',
								flexDirection: 'column',
								// marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
								height: 'auto',
								marginTop: '5vh',
								paddingBottom: '12vh',
							}}
						>
							{company}
						</div>
					</div>
					{pages}
					{/* <div style={{ position: '-webkit-sticky', top: '0' }} className="input-field">
						<Select
							value={this.state.perPage.toString()}
							onChange={e => this.setState({ perPage: parseInt(e.target.value), current: 1 })}
							style={{ width: '50%' }}
						>
							<option value="100">100</option>
							<option value="200">200</option>
							<option value="300">300</option>
							<option value="400">400</option>
							<option value="500">500</option>
						</Select>
					</div> */}
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, { addToUser })(HomePage);
