import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, LoadingWrapperSmall } from './../../utilities/index';
import axios from 'axios';
import { ColorExtractor } from 'react-color-extractor';
import { Modal } from 'react-materialize';

class BrandSettings extends Component {
	constructor() {
		super();

		this.state = {
			logo: false,
			loading: true,
			bus: {},
			formData: {},
			colors: [],
			selectedAccent: '',
			uploading: false,
			images: {},
			link: '',
			imgLoaded: true,
		};
	}
	async componentDidMount() {
		let { client_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let exists = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				this.setState({ bus: exists[0], logo: exists[0].logo, selectedAccent: exists[0].accent_color });
			} else {
				this.getBus();
			}
		} else {
			await this.getBus();
		}
		this.setState({ loading: false });
	}
	async getBus() {
		let { client_id } = this.props.match.params;
		let info = await axios.get(`/api/indv/customers&business/${client_id}`);
		info = info.data;
		if (info.msg === 'GOOD') {
			if (Array.isArray(this.props.location.state.info)) {
				this.props.location.state.info.push(info.bus[0]);
			} else {
				this.props.location.state.info = [info.bus[0]];
			}
			this.props.location.state.focus_cust = info.info;
			this.props.history.replace(this.props.location.pathname, this.props.location.state);
			// this.setState({ bus: info.bus, logo: info.bus.logo.logo });
		} else {
			if (info.msg === 'NO SESSION') {
				info.msg = 'You Have Been Disconnected From The Server';
			}
			alert(info.msg + ' Click "OK" To Be Redirected To Login');
			this.props.history.push('/');
		}
	}
	async uploader(e) {
		let { logo } = this.state.bus;
		let files = e.target.files;
		let reader = new FileReader();
		if (logo && files[0]) {
			reader.readAsDataURL(files[0]);
			reader.onload = e => {
				const formData = { file: e.target.result };
				this.setState({ logo: e.target.result, formData });
			};
		} else {
			await this.getBus();
			alert('Try to upload again');
		}
	}
	upload() {
		let { client_id, loc } = this.props.match.params;
		let { logo, accent_color, industry } = this.state.bus;
		let { formData, selectedAccent } = this.state;
		this.setState({ uploading: true });
		if (formData.file) {
			axios.post('/api/logo/new', { formData, client_id, loc, logo, selectedAccent, accent_color, industry }).then(res => {
				res = res.data;
				if (res.msg === 'GOOD') {
					let { bus } = this.state;
					bus.logo = res.logo;
					this.props.location.state.info.map(e => (e.c_id === client_id ? (e.logo = res.logo) : null));
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					alert('There has been an error in uploading new logo');
				}
			});
		}
	}
	renderSwatches() {
		const { colors } = this.state;
		if (colors[0]) {
			return colors.map((color, id) => {
				return (
					<div
						key={id}
						onClick={() => this.setState({ selectedAccent: color.split('#')[1] })}
						style={{
							backgroundColor: color,
							width: 50,
							height: 50,
							margin: '5px',
							cursor: 'pointer',
						}}
					>
						<p style={{ fontSize: '.5em' }}>{color}</p>
					</div>
				);
			});
		}
	}
	getColors = colors => {
		if (colors[0]) {
			this.setState({ colors: [] });
			this.setState(state => ({ colors: [...state.colors, ...colors], selectedAccent: colors[0] }));
		} else {
			this.setState({ colors: [], selectedAccent: '#FFFF' });
		}
	};
	async getUploaded() {
		if (!Array.isArray(this.state.images)) {
			await axios.get('/api/uploadedimages').then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ images: res.data.res.resources, imgLoaded: false });
				}
			});
		}
	}
	async updateLogoLink(link) {
		let { client_id } = this.props.match.params;
		await axios.post(`/api/update/logolink`, { client_id, link, accent: this.state.selectedAccent }).then(res => {
			if (res.data.msg === 'GOOD') {
				let { bus } = this.state;
				bus.logo = this.state.logo;
				this.props.location.state.info.map(e => (e.c_id === client_id ? (e.logo = res.logo) : null));
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
			} else {
				alert('There has been an error in uploading new logo', res.data.msg);
			}
		});
	}
	render() {
		let { logo, bus } = this.state;
		let { loc } = this.props.match.params;
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' };
		let perm = this.props.location.state.permissions;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: bus.logo ? bus : data, loc }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<h2 style={{ marginLeft: '-60%' }}>Brand & Colors</h2>
						<hr />
						{this.state.msg ? <h6>{this.state.msg}</h6> : null}
						<div style={{ display: 'flex', justifyContent: 'space-between', width: '70vw' }}>
							<div style={{ width: '45%', marginRIght: '5%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
								{/*Info Side*/}
								<h4>Logo</h4>
								<blockquote className="left-align">
									This image is used in the header of your feedback request email as well as on the feedback blockquoteage. The maximum image file size is 2MB.
									We will scale your image for you. For best results we recommend re-sizing the image before uploading
								</blockquote>
								<div style={{ height: '20vh' }} />
								<h4>Accent Colors</h4>
								<blockquote className="left-align">
									The accent color is used in email designs and landing page designs. We have detected the colors below from your logo uploaded. Click on one of
									these colors to use it as your accent color, click the selection box for a small sample of base colors or enter a color's Hex number in the
									field to use that color. Please note that "white" (hex color:#fff) is not available. Choosing a white accent color would result in white
									buttons on white background.
								</blockquote>
							</div>
							<div style={{ width: '45%', marginLeft: '5%', display: 'flex', flexDirection: 'column' }}>
								{/*Logo Side*/}
								{/* <div style={{ height: '5vh' }} /> */}
								<div style={{ height: '40vh' }}>
									{perm === 'admin' ? (
										<form action="#" style={{ cursor: 'pointer' }}>
											<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column' }}>
												<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
													<div className="btn  primary-color primary-hover">
														<span style={{ display: 'flex' }}>
															Upload
															<i className="material-icons" style={{ marginLeft: '5%' }}>
																cloud_upload
															</i>
														</span>
													</div>
													<input type="file" name="file" onChange={e => this.uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
													<ColorExtractor getColors={this.getColors}>
														<img src={logo} alt="COMPANY NAME" style={{ width: 'auto', maxWidth: '200px', height: 'auto', maxHeight: '200px' }} />
													</ColorExtractor>
												</div>
												<div className="file-path-wrapper" style={{ maxWidth: '20vw' }}>
													<input className="file-path validate" type="text" />
												</div>
											</div>
										</form>
									) : (
										<ColorExtractor getColors={this.getColors}>
											<img src={logo} alt="COMPANY NAME" style={{ width: 'auto', maxWidth: '200px', height: 'auto', maxHeight: '200px' }} />
										</ColorExtractor>
									)}
									{this.state.formData.file ? (
										<LoadingWrapperSmall loading={this.state.uploading}>
											<button style={{ marginLeft: '-70%', width: '10vw' }} className="btn primary-color primary-hover" onClick={() => this.upload()}>
												Submit/Replace
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
											>
												<div
													style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: Array.isArray(this.state.images) ? 'auto' : '5vh' }}
												>
													<LoadingWrapper loading={this.state.imgLoaded}>
														<div style={{ width: '90%' }}>
															{this.state.link ? (
																<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '15vh' }}>
																	<img src={this.state.link} alt="" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '5vh' }} />
																	<div style={{ display: 'flex', width: '60%', justifyContent: 'space-around', alignItems: 'center' }}>
																		<button className="btn primary-color primary-hover" onClick={() => this.setState({ link: '' })}>
																			Back
																		</button>
																		<button className="btn primary-color primary-hover" onClick={() => this.updateLogoLink(this.state.link)}>
																			Update Logo
																		</button>
																	</div>
																</div>
															) : Array.isArray(this.state.images) ? (
																this.state.images.map((e, i) => {
																	return (
																		<img
																			src={e.url}
																			alt=""
																			className="hoverable"
																			style={{ maxWidth: '200px', maxHeight: '200px', margin: '1vh', border: 'solid black 1px', cursor: 'pointer' }}
																			key={i}
																			onClick={() => {
																				this.setState({ link: e.url, images: {}, logo: e.url });
																			}}
																		/>
																	);
																})
															) : null}
														</div>
													</LoadingWrapper>
												</div>
											</Modal>
										</div>
									)}
								</div>
								<div
									style={{
										backgroundColor: `${this.state.selectedAccent.includes('#') ? this.state.selectedAccent : `#${this.state.selectedAccent}`}`,
										width: 75,
										height: 75,
										margin: '20px',
										border: 'solid black 2px',
									}}
								>
									<p style={{ fontSize: '.75em' }}>SELECTED {this.state.selectedAccent}</p>
								</div>
								<div style={{ display: 'flex', flexWrap: 'wrap', width: '90%' }}>{this.renderSwatches()}</div>
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
export default connect(mapStateToProps, {})(BrandSettings);
