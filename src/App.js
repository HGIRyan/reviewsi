import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Switch, Route, withRouter } from 'react-router-dom';
import { addToUser } from './ducks/User';
import './App.css';
import 'materialize-css';
import axios from 'axios';
import { LoadingWrapper } from './utilities';

// COMPONENT IMPORTS
import Login from './components/login/Login';
import HomePage from './components/all/HomePage';
import AddBusiness from './components/all/AddBusiness';
import Defaults from './components/all/Defaults';
import ReviewReport from './components/all/ReviewReport';
import TypeReport from './components/all/TypeReport';
import ClientDash from './components/indv/Dash';
import ClientReviewReport from './components/indv/ReviewReport';
import ClientTypeReport from './components/indv/TypeReport';
import ClientGInsight from './components/indv/GInsights';
import ClientSettings from './components/indv/Settings';
import ClientBrandSettings from './components/indv/BrandSettings';
import ReviewLinks from './components/indv/ReviewLinks';
import BusinessDetails from './components/indv/BusinessDetails';
import ReviewEmails from './components/indv/ReviewEmails';
import TypeEmails from './components/indv/TypeEmails';
import ClientUploads from './components/indv/ClientUploads';
import CustView from './components/indv/customer/CustView';
import CustNew from './components/indv/customer/CustNew';
import ReviewLandingPage from './components/indv/feedbacks/ReviewLandingPage';
import TypeLandingPage from './components/indv/feedbacks/TypeLandingPage';
import AddLocation from './components/indv/AddLocation';
import Migration from './components/dev/Migration';
import UserCreate from './components/dev/UserCreate';
import AccountDetails from './components/all/UserDetails';
import Unsubscribe from './components/all/function/Unsubscribe';
import GMBDetails from './components/all/GMBDetails';

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const Dev = true;
class App extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			refresh: 5,
			changes: 0,
			reload: 0,
		};
	}
	abortController = new AbortController();
	async componentDidMount() {
		// if (Dev) {
		// 	document.title = `DEV - ${document.title}`;
		// }
		if (this.props.location.state) {
			if (moment().format('x') >= moment(this.props.location.state.expires).format('x')) {
				alert('Session Expired \n redirecting to login');
				await axios.get('/api/ll/logout').then(res => {
					if (res.data.msg === 'GOOD') {
						history.replace('/', {});
						// history.push('/');
						window.location.reload();
					}
				});
			}
		}
		let loca = this.props.history.location.pathname;
		if (loca !== '/' && !loca.includes('/feedback/rating') && !loca.includes('/feedback/contact')) {
			if (!this.props.location.state) {
				await this.getUserInfo();
				await this.setState({ loading: false });
			} else {
				console.log('Has Session');
				await this.setState({ loading: false });
			}
		} else {
			await this.setState({ loading: false });
		}
	}
	async componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.history.location.pathname !== prevProps.location.pathname) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
		if (
			prevProps.history.location.pathname !== prevProps.location.pathname &&
			prevProps.history.location.pathname === '/home' &&
			this.state.reload % 3 === 0 &&
			this.state.reload !== 0
		) {
			await axios.get('/api/ll/resetsession').then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ resetStateModal: false });
					history.replace('/home', res.data.session);
					window.location.reload();
				} else {
					alert(res.data.msg);
				}
			});
		}
		if (prevProps.history.location.pathname !== prevProps.location.pathname && prevProps.history.location.pathname === '/home') {
			this.setState({ reload: this.state.reload + 1 });
		}
	}
	async getUserInfo() {
		await axios.get('/api/get-session').then(async res => {
			if (!res.data.msg) {
				let info = res.data.info.filter(item => item !== null);
				res.data.info = info;
				let path = this.props.history.location.pathname;
				this.props.history.replace(path, res.data);
				// await this.props.addToUser(res.data);
			} else {
				console.log('\x1b[31m%s\x1b[0m', res.data.msg, 'NO');
				if (
					this.props.history.location.pathname !== '/' &&
					!this.props.history.location.pathname.includes('/feedback/rating') &&
					!this.props.history.location.pathname.includes('/feedback/contact')
				) {
					this.GoHome();
					// this.props.history.push('/', this.props.location.pathname);
				}
			}
		});
	}
	GoHome() {
		this.props.history.push('/', this.props.location.pathname);
		// return <Redirect to="/" prevLink={this.props.location.pathname} />;
	}
	componentWillUnmount() {
		this.abortController.abort();
	}

	render() {
		let width = window.innerWidth;
		let { loading } = this.state;
		let i;
		if (this.props.location.state) {
			let { permissions } = this.props.location.state;
			i = permissions;
		}
		const AdminRoute = ({ component: Component, ...rest }) =>
			width >= 1200 ? (
				<Route
					{...rest}
					render={
						props => ((i === 'admin' && typeof i !== 'undefined') || Dev ? <Component {...props} redux={this.props.addToUser} /> : () => this.GoHome())
						//
					}
				/>
			) : (
				small()
			);
		// const SaleRoute = ({ component: Component, ...rest }) => (
		// 	<Route
		// 		{...rest}
		// 		render={props => ((i === 'admin' && typeof i !== 'undefined') || Dev || i === 'sales' ? <Component {...props} /> : <Redirect to="/" />)}
		// 	/>
		// );
		const ClientRoute = ({ component: Component, ...rest }) =>
			width >= 1200 ? (
				<Route
					{...rest}
					render={props =>
						(i === 'admin' && typeof i !== 'undefined') || Dev || (i === 'client' && typeof i !== 'undefined') ? <Component {...props} /> : () => this.GoHome()
					}
				/>
			) : (
				small()
			);
		const small = () => {
			return (
				<div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'solid black' }}>
					<h5>
						Warning: This device screen is to small.
						<br /> Please use a larger display to view site
					</h5>
				</div>
			);
		};
		const fourofour = ({ location, history }) => {
			// prettier-ignore
			return (
				<div>
					<h1>
						This Content is blocked in your contry of <br />
						<code>United States Of America</code>
					</h1>
					<br /><br />
					<h3>
						Also Trump 2020 <br /> <code>#MAGA</code>
					</h3>
					<br /><br /><br /><br /><br />
					<code>https://ll.liftlocal.com{location.pathname}</code>
					{' _ _ _ _ _ '}Cannot be found
					<hr />
					404 page
					<br />
					Click to Redirect to Login Page
					<br /><br /><br /><br />
					<button
						className="btn primary-color primary-hover"
						onClick={() => {
							history.push('/');
						}}
					>
						Login
					</button>
					<br /><br /><br /><br /><br />
					<button
						className="btn primary-color primary-hover"
						onClick={() => {
							history.goBack();
						}}
					>
						Go Back
					</button>
				</div>
			);
		};
		return (
			<div className="App">
				<LoadingWrapper loading={loading}>
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path="/feedback/unsubscribe/:cor_id/:cust_id/:client_id" component={Unsubscribe} />
						<Route path="/feedback/rating/:cor_id/:cust_id/:rating/:source/:client_id" component={ReviewLandingPage} />
						<Route path="/feedback/contact/:cor_id/:cust_id/:source/:type/:client_id" component={TypeLandingPage} />
						<AdminRoute path="/migration" component={Migration} />
						<AdminRoute path="/user-create" component={UserCreate} />
						<AdminRoute exact path="/home" component={HomePage} />
						<AdminRoute exact path="/addbusiness/:industry" component={AddBusiness} />
						<AdminRoute exact path="/addlocation/:cor_id" component={AddLocation} />
						<AdminRoute exact path="/addbusiness/" component={AddBusiness} />
						<AdminRoute exact path="/home/defaults" component={Defaults} />
						<AdminRoute path="/home/:type/defaults" component={Defaults} />
						<AdminRoute path="/home/report/review" component={ReviewReport} />
						<AdminRoute path="/home/report/:type" component={TypeReport} />
						<AdminRoute path="/home/gmb/details" component={GMBDetails} />
						{/* You Have No Permission
                  <br />
                        <Link to='/'>Re Log In</Link> */}
						<ClientRoute path="/account-details/settings" component={AccountDetails} />
						<ClientRoute path="/client-dash/:cor_id/settings/:client_id" component={ClientSettings} />
						<ClientRoute path="/client-dash/:cor_id/brand-settings/:client_id" component={ClientBrandSettings} />
						<ClientRoute path="/client-dash/:cor_id/review-links/:client_id" component={ReviewLinks} />
						<ClientRoute path="/client-dash/:cor_id/upload/:client_id" component={ClientUploads} />
						<ClientRoute path="/indv-customer/new/:cor_id/:client_id" component={CustNew} />
						<ClientRoute path="/client-dash/:cor_id/emails/reviews/:client_id" component={ReviewEmails} />
						<ClientRoute path="/client-dash/:cor_id/emails/:type/:client_id" component={TypeEmails} />
						<ClientRoute path="/client-dash/:cor_id/business-Details/:client_id" component={BusinessDetails} />
						<ClientRoute exact path="/client-dash/:cor_id/:client_id" component={ClientDash} />
						<ClientRoute path="/client-dash/:cor_id/report/review/:client_id" component={ClientReviewReport} />
						<ClientRoute path="/client-dash/:cor_id/report/:type/:client_id" component={ClientTypeReport} />
						<ClientRoute path="/client-dash/:cor_id/insight-history/:client_id" component={ClientGInsight} />
						<ClientRoute path="/indv-customer/:cor_id/:cust_id/:client_id" component={CustView} />
						<Route component={fourofour} />
					</Switch>
				</LoadingWrapper>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default withRouter(connect(mapStateToProps, { addToUser })(App));
