import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, Infobox, LoadingWrapperSmall } from './../../utilities/index';
import Axios from 'axios';
import { Select } from 'react-materialize';

class ReviewLinks extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			links: [],
			site: 'Google',
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' },
			placeId: '',
			saving: false,
		};
	}
	async componentDidMount() {
		let { client_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let exists = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				await this.hasLinks(exists[0]);
			} else {
				await this.getLinks();
			}
		} else {
			await this.getLinks();
		}
		this.setState({ loading: false });
	}
	async getLinks() {
		let { client_id } = this.props.match.params;
		await Axios.get(`/api/get/business_details/${client_id}`).then(res => {
			if (res.data.msg === 'GOOD') {
				if (Array.isArray(this.props.location.state.info)) {
					this.props.location.state.info.push(res.data.info[0]);
				} else {
					this.props.location.state.info = [res.data.info[0]];
				}
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
			}
		});
	}
	async hasLinks(info) {
		let links = info.review_links.links;
		this.setState({ links: links, og: info, placeId: info.place_id });
	}
	async moveUp(i) {
		let { og } = this.state;
		if (i !== 0) {
			let first = og.review_links.links[i - 1];
			let current = og.review_links.links[i];
			og.review_links.links.splice(i - 1, 1, current);
			og.review_links.links.splice(i, 1, first);
			this.setState({ links: og.review_links.links, og });
		}
	}
	async moveDown(i) {
		let { og } = this.state;
		if (i !== og.review_links.links.length - 1) {
			let first = og.review_links.links[i + 1];
			let current = og.review_links.links[i];
			og.review_links.links.splice(i + 1, 1, current);
			og.review_links.links.splice(i, 1, first);
			this.setState({ links: og.review_links.links, og });
		}
	}
	async link(i, value) {
		let { site, og } = this.state;
		og.review_links.links.splice(i, 1, { site, link: value });
		this.setState({ links: og.review_links.links, og });
	}
	async add() {
		let { site, og } = this.state;
		if (!og.review_links.links.filter(e => e.site === site)[0]) {
			og.review_links.links.unshift({ site, link: '' });
			this.setState({ links: og.review_links.links, og });
		} else {
			this.setState({ msg: 'Site already added to review links' });
		}
	}
	async delete(i) {
		let { og } = this.state;
		og.review_links.links.splice(i, 1);
		this.setState({ links: og.review_links.links, og });
	}
	async lookup(site, i) {
		let { placeId, og } = this.state;
		if (site === 'Google') {
			og.review_links.links.splice(i, 1, { site, link: `https://search.google.com/local/writereview?placeid=${placeId}` });
			this.setState({ links: og.review_links.links, og });
		}
	}
	async save() {
		let { client_id } = this.props.match.params;
		let { og } = this.state;
		let { review_links } = og;
		this.setState({ saving: true });
		if (review_links.links.every(e => e.link)) {
			await Axios.post('/api/links/update', { client_id, review_links, og }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.props.location.state.info.map(e => (e.c_id === client_id ? (e.links = review_links) : null));
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
					this.setState({ msg: 'Saving Link was a Success', saving: false });
				} else {
					this.setState({ msg: 'Error In Saving New Link' });
				}
			});
		} else {
			alert('A Link Is Missing');
		}
	}
	siteLogo(site) {
		if (site === 'Google') {
			return 'https://centerlyne.com/wp-content/uploads/2016/10/Google_-G-_Logo.svg_.png';
		} else {
			return 'https://image.flaticon.com/icons/png/512/124/124010.png';
		}
	}
	render() {
		let { links, site, msg } = this.state;
		links = Array.isArray(links) ? links : [];
		let perm = this.props.location.state.permissions;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<h3 style={{ right: '33.5%', position: 'relative' }}>Online Review Links</h3>
						{/* <hr /> */}
						{msg ? <h6>{msg}</h6> : null}
						<div className="card" style={{ width: '70vw', padding: '2.5%' }}>
							{perm === 'admin' ? (
								<Infobox direction="row" just="flex-start" width="90%">
									<Select value={site} onChange={e => this.setState({ site: e.target.value })}>
										<option value="Google">Google</option>
										<option value="Facebook">Facebook</option>
									</Select>
									<button style={{ margin: '0 5%' }} className="btn primary-color primary-hover" onClick={() => this.add()}>
										Add Aditional Link
									</button>
									<LoadingWrapperSmall loading={this.state.saving}>
										<button className="btn primary-color primary-hover" style={{ margin: '0 2.5%' }} onClick={() => this.save()}>
											Save
										</button>
									</LoadingWrapperSmall>
								</Infobox>
							) : null}
							<div style={{ width: '60vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
								{links.map((item, i) => {
									let logo = item.site ? this.siteLogo(item.site) : null;
									return (
										<div
											className="card hoverable"
											style={{ width: '75%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', backgroundColor: 'rgba(182, 182, 182, 0.2)' }}
											key={i}
										>
											<div style={{ display: 'flex', alignItems: 'center', height: '5vh', marginLeft: '5%' }}>
												<img style={{ maxWidth: '4vw', maxHeight: '4vh' }} src={logo} alt={`${item.site} Logo`} />
												<h4 style={{ margin: '0 2.5%' }}>{item.site}</h4>
												<input style={{ width: '30vw' }} value={item.link} onChange={e => this.link(i, e.target.value)} />
											</div>
											{/* {this.siteLogo(item.site)} */}
											{perm === 'admin' ? (
												<Infobox direction="row" width="auto">
													<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.moveUp(i)}>
														<i className="material-icons">arrow_upward</i>
													</button>
													<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.moveDown(i)}>
														<i className="material-icons">arrow_downward</i>
													</button>
													<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.delete(i)}>
														Delete
													</button>
													{item.link ? (
														<a rel="noopener noreferrer" target="_blank" href={item.link.includes('http') ? item.link : `http://${item.link}`}>
															<button className="btn btn-small primary-color primary-hover" style={{ width: '7.5vw' }}>
																Test URL
															</button>
														</a>
													) : null}
													<button
														className="btn btn-small primary-color primary-hover"
														onClick={() => this.lookup(item.site, i)}
														style={{ margin: '2.5% 2.5%' }}
													>
														Lookup
													</button>
												</Infobox>
											) : null}
										</div>
									);
								})}
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
export default connect(mapStateToProps, {})(ReviewLinks);
