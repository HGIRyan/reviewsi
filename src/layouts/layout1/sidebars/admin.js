import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NoDiv, SideBarLink, SideBarComponentDiv } from '../../../utilities';

const width = window.innerWidth;
class Admin extends Component {
	constructor() {
		super();

		this.state = {
			home: false,
			reports: false,
			reportTypes: false,
			indvReports: false,
			indvReportsTypes: false,
			settings: false,
			settingsType: false,
			indvSettings: false,
			indvSettingsType: false,
			All: false,
			indv: false,
			industry: [],
			change: 0,
		};
	}

	sidebar() {
		// let { reports, indvReports, settings, indv } = this.state;
		let info = this.props.User ? this.props.User.info : null;
		// let loc = this.props.props.loc ? this.props.props.loc : this.props.props.match ? (this.props.props.match.loc ? this.props.props.match.loc : 1) : 1;
		let bigWidth = window.innerWidth >= 1500;
		let item = { width: !bigWidth ? '4.25vw' : '10vw', height: '4vh', margin: '1% 0', display: 'flex', justifyContent: !bigWidth ? 'center' : 'flex-start' };
		// let subItem = { width: '10vw', height: '4vh', paddingLeft: '5%', margin: '1% 0' };
		// let subSubItem = { width: !bigWidth ? '3vw' : '10vw', height: '3.5vh', paddingLeft: '5%', margin: '1% 0' };
		if (this.props.props.view) {
			let { sect, data } = this.props.props.view;
			let loca = this.props.props ? this.props.props.props.location.pathname : '/Home';
			let user = this.props.props ? this.props.props.props.location.state.userName : 'userName';
			// let industry = this.props.props.props.location.state.industry;
			// prettier-ignore
			data = data === undefined ? { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local',
        } : data;
			data = Array.isArray(data) ? data[0] : data;
			let { cor_id } = this.props.props.match;
			let locations = sect === 'indv' && data ? this.props.props.props.location.state.info.filter(e => parseInt(e.cor_id) === parseInt(cor_id)) : null;
			let lState = this.props.props.props.location.state;
			if (sect === 'all') {
				return (
					<SideBarComponentDiv className="center-align">
						{/* HOME */}
						<div style={{ height: '1.9vh' }} />
						<SideBarLink
							to={{ pathname: '/home', state: lState }}
							style={item}
							className={`${loca === '/home' ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
						>
							<i className="material-icons">home_work</i>
							{bigWidth ? (
								<h6 className="" style={{ margin: '.5%' }}>
									Home
								</h6>
							) : (
								''
							)}
						</SideBarLink>
						<hr />
						{/* REPORTS */}
						<SideBarLink
							style={item}
							className={`${loca === '/home/report/review' ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
							to={{ pathname: '/home/report/review', state: lState }}
						>
							<i className="material-icons">bar_chart</i>
							{bigWidth ? <h6>Review Report</h6> : ''}
						</SideBarLink>
						<SideBarLink
							style={item}
							className={`${loca.includes('/home/report/win') ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
							to={{ pathname: '/home/report/win', state: lState }}
						>
							<i className="material-icons">settings_backup_restore</i>
							{bigWidth ? <h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Winback Report' : 'Winback'}</h6> : ''}
						</SideBarLink>
						<SideBarLink
							style={item}
							className={`${loca.includes('/home/report/lead') ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
							to={{ pathname: '/home/report/lead', state: lState }}
						>
							<i className="material-icons">sports_handball</i>
							{bigWidth ? <h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Lead Report' : 'Lead'}</h6> : ''}
						</SideBarLink>
						<SideBarLink
							style={item}
							className={`${loca.includes('/home/report/cross') ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
							to={{ pathname: '/home/report/cross', state: lState }}
						>
							<i className="material-icons">bathtub</i>
							{bigWidth ? <h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Cross Sell Report' : 'Cross Sell'}</h6> : ''}
						</SideBarLink>
						<SideBarLink
							style={item}
							className={`${loca.includes('/home/report/ref') ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
							to={{ pathname: '/home/report/ref', state: lState }}
						>
							<i className="material-icons">group_add</i>
							{bigWidth ? <h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Referral Report' : 'Referral'}</h6> : ''}
						</SideBarLink>
						{/* {data ? data.active ? data.active.active.length > 1 ? <NoDiv direction='column'>
                        {this.multiLoc(data, info)}
                    </NoDiv> : null : null : null} */}
						<hr />
						{user === 'rhutchison' ? (
							<NoDiv direction="column">
								<SideBarLink
									style={item}
									className="tertiary-color sidebar-hover"
									indent="2.5%"
									to={{
										pathname: `/feedback/rating/8e9363e976215eb6409f4329282053afa3/7ffafcc29c19d87061e729d5a04a4cc66361a704d8df69/4/email/38a1e16456eb11041ee6050b7475dfaac1`,
										state: lState,
									}}
								>
									{bigWidth ? 'Review Landing' : 'RL'}
								</SideBarLink>
								<SideBarLink
									style={item}
									className="tertiary-color sidebar-hover"
									indent="2.5%"
									to={{
										pathname: `/feedback/contact/22/15116/email/lead/941`,
										state: lState,
									}}
								>
									{bigWidth ? 'Lead Landing' : 'LL'}
								</SideBarLink>
								<SideBarLink
									style={item}
									className="tertiary-color sidebar-hover"
									indent="2.5%"
									to={{
										pathname: `/migration`,
										state: lState,
									}}
								>
									{bigWidth ? 'Migration' : 'M'}
								</SideBarLink>
								<SideBarLink
									style={item}
									className="tertiary-color sidebar-hover"
									indent="2.5%"
									to={{
										pathname: `/user-create`,
										state: lState,
									}}
								>
									{bigWidth ? 'Create New User' : 'CNU'}
								</SideBarLink>
							</NoDiv>
						) : null}
					</SideBarComponentDiv>
				);
			} else if (sect === 'indv' && data) {
				return (
					<SideBarComponentDiv style={{ overflowY: 'auto' }} className="scrollNone">
						<hr />
						{/* INDV SIDEBAR */}
						<SideBarLink
							to={{ pathname: '/home', state: lState }}
							style={item}
							className={`${loca === '/home' ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
						>
							<i className="material-icons">home_work</i>
							{bigWidth ? <h6 className="">Home</h6> : ''}
						</SideBarLink>
						<SideBarLink
							to={{ pathname: `/client-dash/${data.cor_id}/${data.c_id}`, state: lState }}
							style={item}
							className={`${loca.includes(`/client-dash/${data.cor_id}/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
						>
							<i className="material-icons">home</i>
							<h6 className="">{width >= 1500 ? `${data.company_name.slice(0, 5)} Home` : ''}</h6>
						</SideBarLink>
						<hr />
						<SideBarLink
							indent="5%"
							to={{
								pathname: `/client-dash/${data.cor_id}/upload/${data.c_id}`,
								state: lState,
							}}
							style={item}
							className={`${loca.includes(`/client-dash/${data.cor_id}/upload/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
						>
							<i className="material-icons">cloud_upload</i>
							<h6 className="">{width >= 1500 ? 'Upload List' : ''}</h6>
						</SideBarLink>
						<SideBarLink
							indent="5%"
							to={{
								pathname: `/indv-customer/new/${data.cor_id}/${data.c_id}`,
								state: lState,
							}}
							style={item}
							className={`${loca.includes(`/indv-customer/new/${data.cor_id}/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
						>
							<i className="material-icons">fiber_new</i>
							<h6 className="">{width >= 1500 ? 'New Customer' : ''}</h6>
						</SideBarLink>
						<hr />
						{/* // ========================================================================== ALL */}

						{data.cor_id ? (
							<NoDiv direction="column" width="100%" just="center">
								{data.active_prod.reviews ? (
									<SideBarLink
										style={item}
										indent="2.5%"
										className={`${loca === `/client-dash/${data.cor_id}/report/review/${data.c_id}` ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
										to={{
											pathname: `/client-dash/${data.cor_id}/report/review/${data.c_id}`,
											state: lState,
										}}
									>
										<i className="material-icons">bar_chart</i>
										<h6>{width >= 1500 ? 'Reviews Report' : ''}</h6>
									</SideBarLink>
								) : null}
								{data.active_prod.winback ? (
									<SideBarLink
										indent="5%"
										style={item}
										className={`${
											loca.includes(`/client-dash/${data.cor_id}/report/win/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
										}  sidebar-hover left`}
										to={{ pathname: `/client-dash/${data.cor_id}/report/win/${data.c_id}`, state: lState }}
									>
										<i className="material-icons">settings_backup_restore</i>
										<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Winback Report' : 'Winback'}</h6>
									</SideBarLink>
								) : null}
								{data.active_prod.leadgen ? (
									<SideBarLink
										indent="5%"
										style={item}
										className={`${
											loca.includes(`/client-dash/${data.cor_id}/report/lead/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color left'
										}  sidebar-hover`}
										to={{ pathname: `/client-dash/${data.cor_id}/report/lead/${data.c_id}`, state: lState }}
									>
										<i className="material-icons">sports_handball</i>
										<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Lead Report' : 'Lead'}</h6>
									</SideBarLink>
								) : null}
								{data.active_prod.cross_sell ? (
									<SideBarLink
										indent="5%"
										style={item}
										className={`${loca.includes(`/client-dash/${data.cor_id}/report/cross/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
										to={{ pathname: `/client-dash/${data.cor_id}/report/cross/${data.c_id}`, state: lState }}
									>
										<i className="material-icons">bathtub</i>
										<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Cross Sell Report' : 'Cross Sell'}</h6>
									</SideBarLink>
								) : null}
								{data.active_prod.referral ? (
									<SideBarLink
										indent="5%"
										style={item}
										className={`${loca.includes(`/client-dash/${data.cor_id}/report/ref/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
										to={{ pathname: `/client-dash/${data.cor_id}/report/ref/${data.c_id}`, state: lState }}
									>
										<i className="material-icons">group_add</i>
										<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Referral Report' : 'Referral'}</h6>
									</SideBarLink>
								) : null}
								<div>
									{/* INDV SIDEBAR */}
									{data.active_prod.reviews ? (
										<SideBarLink
											indent="5%"
											style={item}
											className={`${
												loca.includes(`/client-dash/${data.cor_id}/emails/reviews/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
											}  sidebar-hover`}
											to={{
												pathname: `/client-dash/${data.cor_id}/emails/reviews/${data.c_id}`,
												state: lState,
											}}
										>
											<i className="material-icons">rate_review</i> <h6>{width >= 1500 ? 'Review Email' : ''}</h6>
										</SideBarLink>
									) : null}
									{data.active_prod.winback ? (
										<SideBarLink
											indent="5%"
											style={item}
											className={`${
												loca.includes(`/client-dash/${data.cor_id}/emails/winback/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
											}  sidebar-hover`}
											to={{
												pathname: `/client-dash/${data.cor_id}/emails/winback/${data.c_id}`,
												state: lState,
											}}
										>
											<i className="material-icons">settings_backup_restore</i>
											<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Winback' : ''}</h6>
										</SideBarLink>
									) : null}
									{data.active_prod.leadgen ? (
										<SideBarLink
											indent="5%"
											style={item}
											className={`${
												loca.includes(`/client-dash/${data.cor_id}/emails/leadgen/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
											}  sidebar-hover`}
											to={{
												pathname: `/client-dash/${data.cor_id}/emails/leadgen/${data.c_id}`,
												state: lState,
											}}
										>
											<i className="material-icons">sports_handball</i> <h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'LeadGen' : ''}</h6>
										</SideBarLink>
									) : null}
									{data.active_prod.cross_sell ? (
										<SideBarLink
											indent="5%"
											style={item}
											className={`${
												loca.includes(`/client-dash/${data.cor_id}/emails/cross/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
											}  sidebar-hover`}
											to={{
												pathname: `/client-dash/${data.cor_id}/emails/cross/${data.c_id}`,
												state: lState,
											}}
										>
											<i className="material-icons">bathtub</i>
											<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Cross Sell' : ''}</h6>
										</SideBarLink>
									) : null}
									{data.active_prod.referral ? (
										<SideBarLink
											indent="5%"
											style={item}
											className={`${loca.includes(`/client-dash/${data.cor_id}/emails/ref/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
											to={{
												pathname: `/client-dash/${data.cor_id}/emails/ref/${data.c_id}`,
												state: lState,
											}}
										>
											<i className="material-icons">group_add</i>
											<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Referral' : ''}</h6>
										</SideBarLink>
									) : null}
								</div>
								<SideBarLink
									indent="5%"
									style={item}
									className={`${loca.includes(`/client-dash/${data.cor_id}/review-links/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
									to={{
										pathname: `/client-dash/${data.cor_id}/review-links/${data.c_id}`,
										state: lState,
									}}
								>
									<i className="material-icons">link</i>
									<h6>{width >= 1500 ? 'Links' : ''}</h6>
								</SideBarLink>
								<SideBarLink
									indent="5%"
									style={item}
									className={`${loca.includes(`/client-dash/${data.cor_id}/brand-settings/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
									to={{
										pathname: `/client-dash/${data.cor_id}/brand-settings/${data.c_id}`,
										state: lState,
									}}
								>
									<i className="material-icons">broken_image</i>
									<h6>{width >= 1500 ? 'Logos' : ''}</h6>
								</SideBarLink>
								<SideBarLink
									indent="5%"
									style={item}
									className={`${loca.includes(`/client-dash/${data.cor_id}/settings/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
									to={{
										pathname: `/client-dash/${data.cor_id}/settings/${data.c_id}`,
										state: lState,
									}}
								>
									<i className="material-icons">perm_data_setting</i>
									<h6>{width >= 1500 ? 'General Settings' : ''}</h6>
								</SideBarLink>
								<SideBarLink
									indent="5%"
									style={item}
									className={`${loca.includes(`/client-dash/${data.cor_id}/insight-history/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
									to={{
										pathname: `/client-dash/${data.cor_id}/insight-history/${data.c_id}`,
										state: lState,
									}}
								>
									<i className="material-icons">grain</i>
									<h6>{width >= 1500 ? 'GMB Insights' : ''}</h6>
								</SideBarLink>
								<SideBarLink
									indent="5%"
									style={item}
									className={`${
										loca.includes(`/client-dash/${data.cor_id}/business-Details/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'
									}  sidebar-hover`}
									to={{
										pathname: `/client-dash/${data.cor_id}/business-details/${data.c_id}`,
										state: lState,
									}}
								>
									<i className="material-icons">info</i> <h6>{width >= 1500 ? 'Business Details' : ''}</h6>
								</SideBarLink>
							</NoDiv>
						) : null}
						<hr />
						<SideBarLink indent="-10%" to={{ pathname: `/addlocation/${data.cor_id}`, state: lState }}>
							{bigWidth ? <h6>Add A Location</h6> : <h6>Add</h6>}
						</SideBarLink>
						<hr />
						{locations.length >= 2 ? (
							<NoDiv
								direction="column"
								align="flex-start"
								width="100%"
								border="solid black 2px"
								style={{ overflowY: 'auto', maxHeight: '30vh' }}
								className="scrollNone"
							>
								{this.multiLoc(data, info, locations, lState)}
							</NoDiv>
						) : null}
					</SideBarComponentDiv>
				);
			}
		}
	}
	multiLoc(data, info, locations, lState) {
		// let length = locations.length;
		return locations.map((loc, i) => {
			if (loc.c_id !== data.c_id) {
				return (
					<SideBarLink
						key={i}
						className={`${data.c_id === loc.c_id ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						style={{
							width: '9.5vw',
							minHeight: '4vh',
							paddingLeft: '5%',
							margin: '1% 0',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							border: loc.active ? '' : 'solid red 1px',
							borderBottom: loc.active ? 'solid gray 1px' : 'solid red 1px',
						}}
						to={{ pathname: `/client-dash/${loc.cor_id}/${loc.c_id}`, state: lState }}
					>
						{loc.company_name.slice(0, 5)}
						{' @ '}
						{loc.address.city}
					</SideBarLink>
				);
			} else {
				return null;
			}
		});
	}
	render() {
		// let { pathname } = this.props.history.location;
		return (
			<NoDiv width="100%" direction="column" className="tertiary-color" style={{ borderRight: 'solid #00283d .5vh' }}>
				{this.sidebar()}
			</NoDiv>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Admin);
