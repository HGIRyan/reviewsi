import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToUser } from './../../ducks/User';
import { NoDiv, Layout1, Infobox, LoadingWrapper, LoadingWrapperSmall } from './.././../utilities/index';
import { ColorExtractor } from 'react-color-extractor';
import { Select } from 'react-materialize';
import axios from 'axios';
import DoubleRingSVG from './../../Assets/Double Ring-3s-200px.svg';
import { Modal } from 'react-materialize';

class AddBusiness extends Component {
	constructor() {
		super();
		// prettier-ignore
		this.state = {
            page: 1, industry: '',
            businessName: '', corpName: '', street: '', country: '', state: '', zip: '', city: '', timezone: '', phone: '', website: '',
            geo: { lat: 0, lng: 0 }, places:[],
			firstName: '', lastName: '', placeId: '', email: 'no-reply@liftlocal.com',
			rating: '', reviews: '',
			img: '', color: '#FFFF', colors: [], formData: {},
			insights: { calls: '', website: '', direction: '', messages: '', searches: { direct: '', branded: '', discovery: '' } },
			service: { reviews: true, cross: false, referral: false, winback: false, leadgen: false },
			rankKey: ['insurance','Auto insurance','Home insurance','Life insurance','insurance agency'], keyval: '',
			links: [], site: '', searching: false,
			Loading: true, submitting: false, imgLoaded: true, modalOpen: false, uploading: false
		};
	}
	async componentDidMount() {
		document.title = 'Lift Local - New Business';
		if (!this.props.location.state.industry[0]) {
		} else {
			// this.setState({ loading: false });
		}
	}
	async getDefault() {
		let industry = this.stateindustry ? this.stateindustry : 'All';
		await axios.get(`/api/get/default/${industry}`).then(res => {
			this.setState({ img: res.data.defaults.settings.logo, color: res.data.defaults.settings.color });
		});
	}
	async getDetails(placeId) {
		await this.setState({
			placeId,
			links: [{ site: 'Google', link: `https://search.google.com/local/writereview?placeid=${placeId}` }],
			searching: true,
			places: [],
		});
		await axios
			.post('/api/google/place/placeid/details', { placeId })
			.then(res => {
				if (res.data.msg === 'GOOD') {
					let data = res.data.data;
					let address = data.formatted_address.split(',');
					let street = address[0];
					let country = address[address.length - 1];
					let state = address[2].split(' ')[1];
					let city = address[1];
					let zip = address[2].split(' ')[2];
					let geo = { lat: data.geometry.location.lat, lng: data.geometry.location.lng };
					let website = data.website;
					let timezone = data.utc_offset;
					let phone = data.international_phone_number;
					if (website && phone && timezone) {
						this.setState({
							businessName: data.name,
							street,
							country,
							state,
							zip,
							city,
							resp: false,
							geo,
							website,
							timezone,
							phone,
							rating: data.rating,
							reviews: data.user_ratings_total,
							searching: false,
						});
					} else {
						alert("This GMB Profile Doesn't Have All Required Information");
					}
				} else {
				}
			})
			.catch(err => console.log('ERROR::', err));
	}
	async getPlaces(searchTerm) {
		this.setState({ searching: true });
		await axios
			.post('/api/google/place/search', { searchTerm })
			.then(res => {
				res = res.data;
				if (res.msg === 'GOOD') {
					if (res.data.length !== 0) {
						this.setState({ places: res.data, searching: false });
					} else {
						alert('No Results');
					}
				} else {
					alert(res.msg);
				}
			})
			.catch(err => console.log('ERROR::', err));
	}
	addKey() {
		let { keyval, rankKey } = this.state;
		rankKey.push(keyval);
		this.setState({ rankKey, keyval: '' });
	}
	async submit() {
		let info = this.state;
		this.setState({ submitting: true });
		axios.defaults.timeout = 50000;
		await axios
			.post('/api/ll/createbusiness', { info })
			.then(async res => {
				res = res.data;
				this.setState({ submitting: false });
				if (res.msg === 'GOOD' && res.businessInfo.c_id) {
					if (Array.isArray(this.props.location.state.info)) {
						this.props.location.state.info.push(res.businessInfo);
					}
					this.props.history.push(`/client-dash/${res.businessInfo.cor_id}/${res.businessInfo.c_id}`, this.props.location.state);
				} else {
					alert(res.msg);
				}
			})
			.catch(err => console.log('ERROR: ', err));
	}
	async uploader(e) {
		// let { logo } = this.state.bus;
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = e => {
			const formData = { file: e.target.result };
			this.setState({ img: e.target.result, formData });
		};
		// if (logo) {
		// } else {
		// 	await this.getBus();
		// 	alert('Try to upload again');
		// }
	}
	renderSwatches() {
		const { colors } = this.state;

		return colors.map((color, id) => {
			return (
				<div
					key={id}
					onClick={() => this.setState({ color: color.split('#')[1] })}
					style={{
						backgroundColor: color,
						width: 75,
						height: 75,
						margin: '5px',
						cursor: 'pointer',
					}}
				>
					{color}
				</div>
			);
		});
	}
	getColors = colors => {
		this.setState({ colors: [] });
		this.setState(state => ({ colors: [...state.colors, ...colors], color: colors[0] }));
	};
	async moveUp(i) {
		let { links } = this.state;
		if (i !== 0) {
			let first = links[i - 1];
			let current = links[i];
			links.splice(i - 1, 1, current);
			links.splice(i, 1, first);
			this.setState({ links: links });
		}
	}
	async moveDown(i) {
		let { links } = this.state;
		if (i !== links.length - 1) {
			let first = links[i + 1];
			let current = links[i];
			links.splice(i + 1, 1, current);
			links.splice(i, 1, first);
			this.setState({ links: links });
		}
	}
	async link(i, value) {
		let { links } = this.state;
		links.splice(i, 1, { site: links[i].site, link: value });
		this.setState({ links: links });
	}
	async add(siteType) {
		let { links } = this.state;
		if (!this.state.links.filter(e => e.site === siteType)[0]) {
			links.unshift({ site: siteType, link: '' });
			this.setState({ links: links, site: siteType });
		} else {
			alert('Site already added to review links');
		}
	}
	async delete(i) {
		let { links } = this.state;
		links.splice(i, 1);
		this.setState({ links: links });
	}
	async lookup(site, i) {
		let { placeId, links } = this.state;
		if (site === 'Google') {
			links.splice(i, 1, { site, link: `https://search.google.com/local/writereview?placeid=${placeId}` });
			this.setState({ links: links });
		}
	}
	async getUploaded() {
		if (!Array.isArray(this.state.images)) {
			await axios.get('/api/uploadedimages').then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ images: res.data.res.resources, imgLoaded: false, modalOpen: true });
				}
			});
		}
	}
	async getLogoLink() {
		let { formData, industry } = this.state;
		await this.setState({ uploading: true });
		await axios.post('/api/create/logolink', { formData, industry }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.setState({ uploading: false, img: res.data.link });
			} else {
				alert('There was an error trying to upload your image', res.data.msg);
				this.setState({ uploading: false });
			}
		});
	}
	siteLogo(site) {
		if (site === 'Google') {
			return 'https://centerlyne.com/wp-content/uploads/2016/10/Google_-G-_Logo.svg_.png';
		} else {
			return 'https://image.flaticon.com/icons/png/512/124/124010.png';
		}
	}
	render() {
		let { page, rankKey, keyval, service, img } = this.state;
		return (
			<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div>
						<NoDiv just="flex-start" width="50%" align="center" style={{ marginLeft: '15%' }}>
							<h3 style={{ right: '30%', position: 'relative' }}>Business Details</h3>
							<Select value={this.state.page.toString()} onChange={e => this.setState({ page: parseInt(e.target.value) })}>
								<option value="1">Page 1</option>
								<option value="2">Page 2</option>
								<option value="3">Page 3</option>
								<option value="4">Page 4</option>
							</Select>
						</NoDiv>
						<div className="card hoverable" style={{ display: 'flex', width: '70vw' }}>
							<div style={{ display: 'flex', width: '100%', height: '100%', border: 'solid black 1px' }} className="card-content">
								{page === 1 ? (
									<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
										{!this.props.location.state.industry.some(e => e.industry.toLowerCase() === this.state.industry.toLowerCase()) ? (
											<div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
												<Select value={''} onChange={e => this.setState({ industry: e.target.value })}>
													{this.props.location.state.industry.map(i => (
														<option value={i.industry.toLowerCase()} key={i.industry}>
															{i.industry}
														</option>
													))}
													<option value="">New</option>
												</Select>
												<div className="input-field">
													<input
														id="industry"
														type="text"
														className="validate"
														value={this.state.industry}
														onChange={e => this.setState({ industry: e.target.value })}
													/>
													<label htmlFor="industry">New Industry: </label>
												</div>
											</div>
										) : (
											<div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
												<Select value={this.state.industry} onChange={e => this.setState({ industry: e.target.value })}>
													{this.props.location.state.industry.map(i => (
														<option value={i.industry.toLowerCase()} key={i.industry}>
															{i.industry}
														</option>
													))}
													<option value="">New</option>
												</Select>
											</div>
										)}
										<div style={{ display: 'flex', width: '100%', height: '100%' }}>
											<div style={{ display: 'flex', flexDirection: 'column', width: '45%', alignItems: 'center', marginRight: '5%' }}>
												<h5>Bussiness Info</h5>
												<hr />
												<div className="input-field" style={{ width: '70%' }}>
													<h2 style={{ margin: '0' }}>
														<input
															id="bussiness_name"
															type="text"
															className="validate"
															value={this.state.businessName}
															onChange={e => this.setState({ businessName: e.target.value })}
															onKeyPress={e => (e.key === 'Enter' ? this.getPlaces(this.state.businessName) : null)}
														/>
														<button className="btn primary-color primary-hover" onClick={() => this.getPlaces(this.state.businessName)}>
															Search
														</button>
													</h2>
													<label htmlFor="business_name">Business Name:</label>
													{/* {PUT MAPPED LIST OF RETURNED FROM GOOGLE SEARCH} */}
													{this.state.places[0] ? (
														<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
															{this.state.places.map((e, i) => {
																return (
																	<div
																		onClick={() => this.getDetails(e.place_id)}
																		key={i}
																		className="card hoverable"
																		style={{
																			width: '100%',
																			minHeight: '5vh',
																			display: 'flex',
																			alignItems: 'center',
																			justifyContent: 'flex-start',
																			margin: '1.5% 0',
																			cursor: 'pointer',
																		}}
																	>
																		{e.description}
																	</div>
																);
															})}
														</div>
													) : null}
													{this.state.searching ? <img style={{ width: '35px', height: '35px' }} src={DoubleRingSVG} alt="Double Ring SVG Loading" /> : null}
												</div>
												<div className="input-field" style={{ width: '70%' }}>
													<h2 style={{ margin: '0' }}>
														<input
															id="street"
															type="text"
															className="validate"
															value={this.state.street}
															onChange={e => this.setState({ street: e.target.value })}
														/>
													</h2>
													<label htmlFor="street">Street Address: </label>
												</div>
												<div className="input-field" style={{ width: '70%' }}>
													<h2 style={{ margin: '0' }}>
														<input id="city" type="text" className="validate" value={this.state.city} onChange={e => this.setState({ city: e.target.value })} />
													</h2>
													<label htmlFor="city">City: </label>
												</div>
												<div style={{ display: 'flex', alignItems: 'flex-start', width: '70%', justifyContent: 'space-between' }}>
													<div className="input-field">
														<Select name="state" onChange={e => this.setState({ state: e.target.value })} value={this.state.state}>
															<option value="">Select State</option>
															<option value="AL">Alabama</option>
															<option value="AK">Alaska</option>
															<option value="AZ">Arizona</option>
															<option value="AR">Arkansas</option>
															<option value="CA">California</option>
															<option value="CO">Colorado</option>
															<option value="CT">Connecticut</option>
															<option value="DE">Delaware</option>
															<option value="DC">District Of Columbia</option>
															<option value="FL">Florida</option>
															<option value="GA">Georgia</option>
															<option value="HI">Hawaii</option>
															<option value="ID">Idaho</option>
															<option value="IL">Illinois</option>
															<option value="IN">Indiana</option>
															<option value="IA">Iowa</option>
															<option value="KS">Kansas</option>
															<option value="KY">Kentucky</option>
															<option value="LA">Louisiana</option>
															<option value="ME">Maine</option>
															<option value="MD">Maryland</option>
															<option value="MA">Massachusetts</option>
															<option value="MI">Michigan</option>
															<option value="MN">Minnesota</option>
															<option value="MS">Mississippi</option>
															<option value="MO">Missouri</option>
															<option value="MT">Montana</option>
															<option value="NE">Nebraska</option>
															<option value="NV">Nevada</option>
															<option value="NH">New Hampshire</option>
															<option value="NJ">New Jersey</option>
															<option value="NM">New Mexico</option>
															<option value="NY">New York</option>
															<option value="NC">North Carolina</option>
															<option value="ND">North Dakota</option>
															<option value="OH">Ohio</option>
															<option value="OK">Oklahoma</option>
															<option value="OR">Oregon</option>
															<option value="PA">Pennsylvania</option>
															<option value="RI">Rhode Island</option>
															<option value="SC">South Carolina</option>
															<option value="SD">South Dakota</option>
															<option value="TN">Tennessee</option>
															<option value="TX">Texas</option>
															<option value="UT">Utah</option>
															<option value="VT">Vermont</option>
															<option value="VA">Virginia</option>
															<option value="WA">Washington</option>
															<option value="WV">West Virginia</option>
															<option value="WI">Wisconsin</option>
															<option value="WY">Wyoming</option>
														</Select>
														<label>State</label>
													</div>
													<div className="input-field" style={{ height: '5vh', marginTop: '2.5%' }}>
														<h2 style={{ margin: '0' }}>
															<input value={this.state.zip} onChange={e => this.setState({ zip: e.target.value })} />
														</h2>
														<label>Zip Code</label>
													</div>
												</div>
												<div className="input-field" style={{ width: '70%' }}>
													<label style={{ margin: '0' }}>Country</label>
													<Select name="country" onChange={e => this.setState({ country: e.target.value })} value={this.state.country}>
														<option value="Select Country">Select Country</option>
														<option value="United States">United States</option>
														<option value="Canada">Canada</option>
													</Select>
												</div>
												<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
													<div className="input-field">
														<h2 style={{ margin: '0' }}>
															<input value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} />
														</h2>
														<label>Phone Number</label>
													</div>
													<div className="input-field">
														<h2 style={{ margin: '0' }}>
															<input value={this.state.website} onChange={e => this.setState({ website: e.target.value })} readOnly disabled="disabled" />
														</h2>
														<label>Website</label>
													</div>
												</div>
												<h5>Technicals</h5>
												<hr />
												<div className="input-field" style={{ width: '70%' }}>
													<h2 style={{ margin: '0' }}>
														<input value={this.state.timezone} onChange={e => this.setState({ timezone: e.target.value })} readOnly disabled="disabled" />
													</h2>
													<label> UTC Offset</label>
												</div>
												<div style={{ width: '70%' }}>
													<div style={{ display: 'flex' }}>
														<div className="input-field">
															<h2 style={{ margin: '0' }}>
																<input
																	value={this.state.geo.lat}
																	// onChange={e => this.setState(prevState => ({ geo: { ...prevState, lat: e.target.value } }))}
																	readOnly
																	disabled="disabled"
																/>
															</h2>
															<label>LAT</label>
														</div>
														<div className="input-field">
															<h2 style={{ margin: '0' }}>
																<input
																	value={this.state.geo.lng}
																	// onChange={ e => this.setState( { lat: e.target.value } ) }
																	readOnly
																	disabled="disabled"
																/>
															</h2>
															<label>LNG</label>
														</div>
													</div>
													<div className="input-field" style={{ width: '70%' }}>
														<h2 style={{ margin: '0' }}>
															<input value={this.state.placeId} onChange={e => this.setState({ placeId: e.target.value })} readOnly disabled="disabled" />
															{this.state.placeId ? (
																<a
																	className="btn primary-color primary-hover"
																	target="_blank"
																	rel="noopener noreferrer"
																	href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${this.state.placeId}`}
																>
																	Google.com
																</a>
															) : null}
														</h2>
														<label>Place ID</label>
													</div>
												</div>
											</div>
											<div style={{ display: 'flex', flexDirection: 'column', width: '45%', marginLeft: '5%', alignItems: 'center' }}>
												<h5>Owner Info</h5>
												<hr />
												<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
													<div className="input-field">
														<h2 style={{ margin: '0' }}>
															<input value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} />
														</h2>
														<label> Owner First Name</label>
													</div>
													<div className="input-field">
														<h2 style={{ margin: '0' }}>
															<input value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} />
														</h2>
														<label> Owner Last Name</label>
													</div>
												</div>
												<div className="input-field" style={{ width: '70%' }}>
													<h2 style={{ margin: '0' }}>
														<input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
													</h2>
													<label> Owner Email</label>
												</div>

												{/* <div className="input-field" style={{ width: '70%' }}></div> */}
												{/* <div className="input-field" style={{ width: '70%' }}></div> */}
												{/* <div className="input-field" style={{ width: '70%' }}></div> */}
												<h5>Purchased Products</h5>
												<hr />
												<label
													style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}
												>
													<input
														type="checkbox"
														checked={this.state.service.reviews}
														onChange={() => this.setState(prevState => ({ service: { ...prevState.service, reviews: !service.reviews } }))}
													/>
													<span className="tab">Review Gen</span>
												</label>
												<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
													<input
														type="checkbox"
														checked={this.state.service.winbacks}
														onChange={() => this.setState(prevState => ({ service: { ...prevState.service, winback: !service.winback } }))}
													/>
													<span className="tab">Winbacks</span>
												</label>
												<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
													<input
														type="checkbox"
														checked={this.state.service.leadgen}
														onChange={() => this.setState(prevState => ({ service: { ...prevState.service, leadgen: !service.leadgen } }))}
													/>
													<span className="tab">Lead Gen</span>
												</label>
												<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
													<input
														type="checkbox"
														checked={this.state.service.cross}
														onChange={() => this.setState(prevState => ({ service: { ...prevState.service, cross: !service.cross } }))}
													/>
													<span className="tab">Cross Sell</span>
												</label>
												<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
													<input
														type="checkbox"
														checked={this.state.service.referral}
														onChange={() => this.setState(prevState => ({ service: { ...prevState.service, referral: !service.referral } }))}
													/>
													<span className="tab">Referral Gen</span>
												</label>
											</div>
										</div>
										<button
											className="btn primary-color primary-hover"
											onClick={() => {
												this.setState({ page: page + 1 });
												this.getDefault();
											}}
										>
											Next Page
										</button>
									</div>
								) : page === 2 ? (
									<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
										<h3 style={{ right: '32%', position: 'relative' }}>Online Review Links</h3>
										<hr />
										<div style={{ width: '100%', padding: '2.5%' }}>
											<Infobox direction="row" just="flex-start" width="90%">
												<Select value={this.state.site} onChange={e => this.add(e.target.value)}>
													<option value="">Select A Site</option>
													<option value="Google">Google</option>
													<option value="Facebook">Facebook</option>
												</Select>
											</Infobox>
											<div style={{ width: '60vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
												{this.state.links.map((item, i) => {
													let logo = item.site ? this.siteLogo(item.site) : null;
													return (
														<div
															className="card hoverable"
															style={{
																width: '75%',
																display: 'flex',
																alignItems: 'flex-start',
																flexDirection: 'column',
																backgroundColor: 'rgba(182, 182, 182, 0.2)',
															}}
															key={i}
														>
															<div style={{ display: 'flex', alignItems: 'center', height: '5vh', marginLeft: '5%' }}>
																<img style={{ maxWidth: '4vw', maxHeight: '4vh' }} src={logo} alt={`${item.site} Logo`} />
																<h4 style={{ margin: '0 2.5%' }}>{item.site}</h4>
																<input style={{ minWidth: '20vw' }} value={item.link} onChange={e => this.link(i, e.target.value)} />
																{/* <button className="btn primary-color primary-hover" style={{ margin: '0 2.5%' }} onClick={() => this.save()}>
																	Save
																</button> */}
															</div>
															{/* {this.siteLogo(item.site)} */}
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
														</div>
													);
												})}
											</div>
										</div>
										<button className="btn primary-color primary-hover" onClick={() => this.setState({ page: page + 1 })}>
											Next Page
										</button>
									</div>
								) : page === 3 ? (
									<div>
										<h2 style={{ marginLeft: '-60%' }}>Brand & Colors</h2>
										<hr />
										{this.state.msg ? <h6>{this.state.msg}</h6> : null}
										<div style={{ display: 'flex', justifyContent: 'space-between', width: '70vw' }}>
											<div style={{ width: '45%', marginRIght: '5%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
												{/*Info Side*/}
												<h4>Logo</h4>
												<blockquote>
													This image is used in the header of your feedback request email as well as on the feedback blockquoteage. The maximum image file size
													is 2MB. We will scale your image for you. For best results we recommend re-sizing the image before uploading
												</blockquote>
												<div style={{ height: '20vh' }} />
												<h4>Accent Colors</h4>
												<blockquote>
													The accent color is used in email designs and landing page designs. We have detected the colors below from your logo uploaded. Click
													on one of these colors to use it as your accent color, click the selection box for a small sample of base colors or enter a color's
													Hex number in the field to use that color. Please note that "white" (hex color:#fff) is not available. Choosing a white accent color
													would result in white buttons on white background.
												</blockquote>
											</div>
											<div style={{ width: '45%', marginLeft: '5%', display: 'flex', flexDirection: 'column' }}>
												{/*Logo Side*/}
												{/* <div style={{ height: '5vh' }} /> */}
												<div style={{ height: '40vh' }}>
													<ColorExtractor getColors={this.getColors}>
														<img src={img} alt="COMPANY NAME" style={{ width: 'auto', maxWidth: '200px', height: 'auto', maxHeight: '200px' }} />
													</ColorExtractor>
													<form action="#" style={{ cursor: 'pointer' }}>
														<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column' }}>
															<div>
																<div className="btn  primary-color primary-hover">
																	<span style={{ display: 'flex' }}>
																		Upload
																		<i className="material-icons" style={{ marginLeft: '5%' }}>
																			cloud_upload
																		</i>
																	</span>
																	<input type="file" name="file" onChange={e => this.uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
																</div>
															</div>
															<div className="file-path-wrapper" style={{ maxWidth: '20vw' }}>
																<input className="file-path validate" type="text" />
															</div>
														</div>
													</form>
													{this.state.formData.file ? (
														<LoadingWrapperSmall loading={this.state.uploading}>
															<button
																style={{ marginLeft: '-70%', width: '10vw' }}
																className="btn primary-color primary-hover"
																onClick={() => this.getLogoLink()}
															>
																Submit
															</button>
														</LoadingWrapperSmall>
													) : (
														<div onClick={() => this.getUploaded()}>
															<Modal
																trigger={
																	<button className="btn primary-color primary-hover" style={{ width: '7.5vw', marginLeft: '-24vw' }}>
																		Search
																	</button>
																}
																style={{ outline: 'none' }}
																bottomSheet={false}
																fixedFooter={false}
																open={this.state.modalOpen}
																options={{
																	dismissible: true,
																}}
																id="search"
															>
																<div
																	style={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center',
																		height: Array.isArray(this.state.images) ? 'auto' : '5vh',
																	}}
																>
																	<LoadingWrapper loading={this.state.imgLoaded}>
																		<div style={{ width: '90%' }}>
																			{Array.isArray(this.state.images)
																				? this.state.images.map((e, i) => {
																						return (
																							<img
																								src={e.url}
																								alt=""
																								className="hoverable"
																								style={{ maxWidth: '200px', maxHeight: '200px', margin: '1vh', border: 'solid black 1px', cursor: 'pointer' }}
																								key={i}
																								onClick={() => {
																									this.setState({ img: e.url, images: {}, logo: e.url, modalOpen: false });
																								}}
																							/>
																						);
																				  })
																				: null}
																		</div>
																	</LoadingWrapper>
																</div>
															</Modal>
														</div>
													)}
												</div>
												<div
													style={{
														backgroundColor: `${this.state.color ? (this.state.color.includes('#') ? this.state.color : `#${this.state.color}`) : null}`,
														width: 100,
														height: 100,
														margin: '20px',
														border: 'solid black 2px',
													}}
												>
													{' '}
													SELECTED {this.state.color}{' '}
												</div>
												<div style={{ display: 'flex', flexWrap: 'wrap', width: '90%' }}>{this.renderSwatches()}</div>
											</div>
										</div>
										<button className="btn primary-color primary-hover" onClick={() => this.setState({ page: page + 1 })}>
											Next Page
										</button>
									</div>
								) : (
									<div style={{ display: 'flex', flexDirection: 'column', width: '90%', justifyContent: 'flex-start' }}>
										<h5>Add KeyWords</h5>
										<hr />
										<div className="input-field" style={{ width: '70%' }}>
											<h2 style={{ margin: '0' }}>
												<input
													id="keyword"
													type="text"
													className="validate"
													value={keyval}
													onChange={e => this.setState({ keyval: e.target.value })}
													onKeyPress={e => (e.key === 'Enter' ? this.addKey() : null)}
												/>
											</h2>
											<label htmlFor="keyword">New Keyword: </label>
											<button className="btn primary-color primary-hover" onClick={() => this.addKey()}>
												Add
											</button>
										</div>
										{rankKey.map((key, i) => {
											return (
												<div
													style={{ display: 'flex', width: '20%', justifyContent: 'flex-start', padding: '0 .5%', alignItems: 'center', cursor: 'pointer' }}
													key={i}
													className="card hoverable"
													onClick={() => {
														rankKey.splice(i, 1);
														this.setState({ rankKey });
													}}
												>
													<h6 style={{ marginRight: '5%' }}>{i + 1}.</h6>
													<h6>{key}</h6>
												</div>
											);
										})}
										<LoadingWrapperSmall loading={this.state.submitting}>
											<button className="btn primary-color primary-hover" onClick={() => this.submit()} style={{ width: '75%', marginLeft: '10%' }}>
												Submit
											</button>
										</LoadingWrapperSmall>
									</div>
								)}
							</div>
						</div>
					</div>
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, { addToUser })(AddBusiness);
