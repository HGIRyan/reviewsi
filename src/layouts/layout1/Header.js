import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import { DefaultLink, NoDiv } from './../../utilities/index';
import { Divider } from 'react-materialize';
const history = createBrowserHistory();
class Header extends Component {
	constructor() {
		super();

		this.state = {
			reseting: false,
			show: false,
			links: false,
		};
	}
	async logout() {
		await axios.get('/api/ll/logout').then(res => {
			if (res.data.msg === 'GOOD') {
				history.replace('/', {});
				// history.push('/');
				window.location.reload();
			}
		});
	}
	async resetSession() {
		this.setState({ reseting: true });
		await axios.get('/api/ll/resetsession').then(res => {
			if (res.data.msg === 'GOOD') {
				this.setState({ reseting: false });
				history.replace('/home', res.data.session);
				window.location.reload();
			} else {
				alert(res.data.msg);
			}
		});
	}
	toggleHover() {
		this.setState({ show: !this.state.show });
	}
	render() {
		let { match } = this.props.props;
		// let { data } = view;
		let { client_id } = match;
		let propAct = this.props.props;
		let perm = propAct.props.location.state.permissions;
		let User = this.props.props.props.location.state;
		let dat = User ? User.info.filter(item => item.c_id === parseInt(client_id)) : [];
		dat = dat[0] ? dat[0] : { logo: 'https://res.cloudinary.com/lift-local/image/upload/v1575577374/LiftLocalWhiteLogo_q1kxkg.png' };
		let dropStyle = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '1vh 0',
			margin: '0',
			fontSize: '1.2em',
			color: 'black',
			width: '100%',
		};
		return (
			<div className="row tertiary-color" style={{ width: '100vw', height: '100%' }}>
				<div
					className="col s8 valign-wrapper "
					style={{ height: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: '40%', maxWidth: '90%' }}
				>
					<img
						className=""
						src={
							dat.logo
								? dat.logo
									? dat.logo
									: `https://via.placeholder.com/200x60.png?text=${dat.company_name}`
								: 'https://res.cloudinary.com/lift-local/image/upload/v1575577374/LiftLocalWhiteLogo_q1kxkg.png'
						}
						alt="Company Logo"
						style={{ maxHeight: '3.5vh', maxWidth: '8vw' }}
						onClick={() =>
							dat.cor_id
								? this.props.props.props.history.push(`/client-dash/${dat.cor_id}/${dat.c_id}`, this.props.props.props.location.state)
								: this.props.props.props.history.push(`/home`, this.props.props.props.location.state)
						}
					/>
					<h5
						className=""
						style={{ margin: '1vh', color: !dat.active ? 'red' : '' }}
						onClick={() =>
							dat.cor_id
								? this.props.props.props.history.push(`/client-dash/${dat.cor_id}/${dat.c_id}`, this.props.props.props.location.state)
								: this.props.props.props.history.push(`/home`, this.props.props.props.location.state)
						}
					>
						{`${dat.company_name ? dat.company_name : ''}`}
					</h5>
					{dat.c_id ? (
						<p style={{ display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ links: !this.state.links })}>
							Links{!this.state.links ? <i className="material-icons">arrow_drop_down</i> : <i className="material-icons">arrow_drop_up</i>}
						</p>
					) : null}
					{dat.c_id ? (
						<a
							style={{ color: 'white' }}
							href={dat.place_id ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${dat.place_id}` : null}
							rel="noopener noreferrer"
							target="_blank"
						>
							<p style={{ fontSize: '.75em', marginLeft: '2vw' }}>{`${dat.address.street}, ${dat.address.city}, ${dat.address.state} [${dat.address.zip}]`}</p>
						</a>
					) : null}
				</div>
				<h6
					style={{
						marginTop: '0vh',
						display: 'flex',
						alignItems: 'center',
						cursor: 'pointer',
						width: '10vw',
						position: 'absolute',
						right: '0',
						marginRight: window.innerWidth >= 1500 ? '-1.5vw' : '-6vw',
					}}
					onClick={() => this.setState({ show: !this.state.show, corporate: false })}
				>
					{window.innerWidth >= 1500 ? User.userName : ''}
					{!this.state.show ? <i className="material-icons">arrow_drop_down</i> : <i className="material-icons">arrow_drop_up</i>}
				</h6>
				{this.state.show ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							// alignItems: 'center',
							cursor: 'pointer',
							width: '10vw',
							position: 'absolute',
							right: '0',
							marginRight: '1vw',
							marginTop: '4vh',
							zIndex: '90000',
						}}
						className="card hoverable"
					>
						<Divider />
						{perm === 'admin' ? (
							<h6
								style={dropStyle}
								onClick={() => {
									this.resetSession();
									this.setState({ show: false });
								}}
								className="hoverable"
							>
								Refresh{' '}
								<i className="material-icons" style={{ margin: '0', padding: '0' }}>
									autorenew
								</i>
							</h6>
						) : null}
						<DefaultLink to={{ pathname: `/account-details/settings`, state: User }} style={dropStyle} className="hoverable">
							<h6 style={dropStyle}>Account Details</h6>
						</DefaultLink>
						<DefaultLink to={{ pathname: `/home/gmb/details`, state: User }} style={dropStyle} className="hoverable">
							<h6 style={dropStyle}>GMB Details Search</h6>
						</DefaultLink>
						<h6 style={dropStyle} onClick={this.logout} className="hoverable">
							Logout?
						</h6>
						{perm === 'admin' ? (
							<NoDiv direction="column" align="center" style={{ width: '100%' }}>
								<Divider />
								<DefaultLink to={{ pathname: '/home/defaults', state: User }} style={dropStyle} className="hoverable">
									<h6 style={dropStyle}>All Defaults</h6>
								</DefaultLink>
								<h6
									style={dropStyle}
									onClick={() => {
										this.setState({ corporate: !this.state.corporate });
									}}
									className="hoverable"
								>
									Corporate
									{!this.state.corporate ? (
										<i className="material-icons" style={{ margin: '0', padding: '0' }}>
											arrow_drop_down
										</i>
									) : (
										<i style={{ margin: '0', padding: '0' }} className="material-icons">
											arrow_drop_up
										</i>
									)}
								</h6>
								{this.state.corporate ? <Divider /> : null}
								{this.state.corporate
									? User.industry.map(e => {
											return (
												<DefaultLink key={e.industry} to={{ pathname: `/home/${e.industry}/defaults`, state: User }} style={dropStyle} className="hoverable">
													{e.industry}
												</DefaultLink>
											);
									  })
									: null}
							</NoDiv>
						) : null}
					</div>
				) : null}

				{/* <Dropdown
					style={{ zIndex: 2000, marginRight: '10vw' }}
					trigger={
						<h6
							className="right center-align"
							style={{ marginRight: '-2vw', marginTop: '-.5vh', display: 'flex', alignItems: 'center', cursor: 'pointer', width: '10vw' }}
							node="button"
						>
							Drop Me!
							<i className="material-icons">arrow_drop_down</i>
						</h6>
					}
					options={{
						alignment: 'left',
						closeOnClick: true,
						constrainWidth: true,
						coverTrigger: true,
						inDuration: 150,
						outDuration: 250,
					}}
				>
					<h6 style={dropStyle} onClick={this.logout}>
						Logout?
					</h6>
					<Divider />
					<h6 style={dropStyle} onClick={() => this.resetSession()}>
						<i className="material-icons">autorenew</i>
					</h6>
				</Dropdown> */}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Header);
