import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, proper, LoadingWrapperSmall } from './../../utilities/index';
import XLSX from 'xlsx';
import { Select } from 'react-materialize';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

class ClientUpload extends Component {
	constructor() {
		super();
		this.state = {
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' },
			corp: [{ c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' }],
			uploadTo: '1',
			highlight: false,
			file: {},
			data: [],
			cols: [],
			ws_og: {},
			order: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7'],
			ordering: false,
			reset: false,
			service: 'reviews',
			length: 0,
		};
		this.onUpload = this.onUpload.bind(this);
		this.upload = this.upload.bind(this);
	}
	componentDidMount() {
		let { client_id, cor_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let item = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (item[0]) {
				let corp = this.props.location.state.info.filter(item => item.cor_id === parseInt(cor_id));
				this.setState({ og: item[0], corp, uploadTo: item[0].c_id.toString() });
			} else {
				this.props.history.goBack();
			}
		} else {
			this.props.history.push('/');
		}
	}
	async onUpload(e) {
		const files = e.target.files;
		if (files && files[0]) {
			await this.setState({ file: files[0] });
			await this.upload();
		}
	}
	make_cols = refstr => {
		let o = [],
			C = XLSX.utils.decode_range(refstr).e.c + 1;
		for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
		return o;
	};
	upload() {
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = e => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			this.setState({ ws_og: ws });
			let data = XLSX.utils.sheet_to_json(ws, { header: ['first', 'second', 'third', 'fourth', 'fith', 'sixth', 'seventh'] });
			/* Update state */
			data.map(e => {
				e.first = e.first ? proper(e.first) : null;
				e.second = e.second ? proper(e.second) : null;
				e.third = e.third ? proper(e.third) : null;
				e.fourth = e.fourth ? proper(e.fourth) : null;
				e.fith = e.fith ? proper(e.fith) : null;
				e.sixth = e.sixth ? proper(e.sixth) : null;
				e.seventh = e.seventh ? proper(e.seventh) : null;
				return '';
			});

			this.setState({ data: data.slice(1, data.length), cols: this.make_cols(ws['!ref']), length: data.slice(1, data.length).length }, () => {
				this.defaultValue(data[0]);
			});
		};
		if (rABS) {
			reader.readAsBinaryString(this.state.file);
		} else {
			reader.readAsArrayBuffer(this.state.file);
		}
	}
	async formatOrder() {
		let { order, ws_og, corp, og, uploadTo, reset, service } = this.state;
		let arr = ['first_name', 'last_name', 'email'];
		order = order.filter(e => !e.includes('Column') && !e.includes('ignore'));
		if (arr.every(e => order.includes(e))) {
			this.setState({ ordering: true });
			let data = XLSX.utils.sheet_to_json(ws_og, { header: order });
			data = data.slice(1, data.length);
			data.map(e => {
				if (e.email) {
					e.first_name = e.first_name ? e.first_name : 'Valued Customer';
					e.last_name = e.last_name ? e.last_name : '.';
				}
			});
			data.filter(e => e.email && e.first_name && e.last_name).filter(e => e.email.emailValidate());
			await axios.post('/api/upload-customers', { og, data, corp, uploadTo, reset, service }).then(res => {
				this.setState({ ordering: false });
				if (res.data.msg === 'GOOD') {
					alert(res.data.list);
					this.props.location.state.focus_cust = res.data.cust;
					this.props.history.push(`/client-dash/${og.cor_id}/${uploadTo === 'all' ? og.c_id : uploadTo}`, this.props.location.state);
				} else {
					alert(res.data.msg);
					if (res.data.msg === 'ERROR: Session not found') {
						this.props.history.push('/');
					}
				}
			});
		} else {
			this.setState({ ordering: false });
			alert('Please Make Sure there is atleast a Last Name, First Name and Email Column');
		}
		// SEND TO CLOUD
	}
	async changeOrder(i, v) {
		let { order } = this.state;
		let ind = await order.indexOf(v);
		await order.splice(ind, 1, `Column ${ind + 1}`);
		await order.splice(i, 1, v);
		await this.setState({ order });
	}
	defaultValue(cell) {
		let { order } = this.state;
		let arr = ['first_name', 'last_name', 'email', 'phone'];
		let cellArr = [cell.first, cell.second, cell.third, cell.fourth, cell.fith, cell.sixth, cell.seventh];
		cellArr.map((str, i) => {
			if (!arr.includes(str) && str) {
				str = str.toLowerCase();
				if (str.includes('first') && order[i] !== 'first_name') {
					order.splice(i, 1, 'first_name');
					this.setState({ order });
					return 'first_name';
				} else if (str.includes('last') && order[i] !== 'last_name') {
					order.splice(i, 1, 'last_name');
					this.setState({ order });
					return 'last_name';
				} else if (str.includes('email') && order[i] !== 'email') {
					order.splice(i, 1, 'email');
					this.setState({ order });
					return 'email';
				} else if (str.includes('phone') && order[i] !== 'phone') {
					order.splice(i, 1, 'phone');
					this.setState({ order });
					return 'phone';
				} else {
					order.splice(i, 1, `Column ${i + 1}`);
					this.setState({ order });
					return `Column ${i + 1}`;
				}
			} else {
				return `Column ${i + 1}`;
			}
		});
	}
	render() {
		let { loc } = this.props.match.params;
		let { og, highlight, data } = this.state;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: og, loc }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<NoDiv
							style={{ marginTop: '5vh' }}
							border={`solid ${highlight ? 'blue' : 'white'} 5px`}
							height={`${data[0] ? 'auto' : '40vh'}`}
							width="60vw"
							align="center"
							just="center"
						>
							{/* <ImgBox src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Cloud_upload_font_awesome.svg/512px-Cloud_upload_font_awesome.svg.png" alt="Upload" height="50%" onClick={() => {}} /> */}
							{!data[0] ? (
								<form action="#" style={{ cursor: 'pointer' }}>
									<img src={og.logo ? og.logo : ''} alt="" style={{ maxWidth: '200px' }} />
									<h4>Upload {og.company_name}'s List</h4>
									<div className="file-field input-field">
										<div className="btn  primary-color primary-hover">
											<span style={{ display: 'flex' }}>
												Upload{' '}
												<i className="material-icons" style={{ marginLeft: '5%' }}>
													cloud_upload
												</i>
											</span>
											<input type="file" onChange={this.onUpload} accept=".xls, .csv, .xlsx" />
										</div>
										<div className="file-path-wrapper">
											<input className="file-path validate" type="text" />
										</div>
									</div>
								</form>
							) : (
								<div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-around' }}>
									{/* DEMO AREA */}
									<h3>{this.state.file.name}</h3>
									<h6>List Size: {this.state.length}</h6>
									{data[0].first ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 1
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.first}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 1</h5>
												<Select value={this.state.order[0]} onChange={e => this.changeOrder(0, e.target.value)}>
													<option disabled value="Column 1">
														Column 1
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].second ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 2
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.second}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 2</h5>
												<Select value={this.state.order[1]} onChange={e => this.changeOrder(1, e.target.value)}>
													<option disabled value="Column 2">
														Column 2
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].third ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 3
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.third}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 3</h5>
												<Select value={this.state.order[2]} onChange={e => this.changeOrder(2, e.target.value)}>
													<option disabled value="Column 3">
														Column 3
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].fourth ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 4
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.fourth}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 4</h5>
												<Select value={this.state.order[3]} onChange={e => this.changeOrder(3, e.target.value)}>
													<option disabled value="Column 4">
														Column 4
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].fith ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 5
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.fith}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 5</h5>
												<Select value={this.state.order[5]} onChange={e => this.changeOrder(4, e.target.value)}>
													<option disabled value="Column 4">
														Column 4
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].sixth ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 6
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.sixth}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 6</h5>
												<Select value={this.state.order[5]} onChange={e => this.changeOrder(5, e.target.value)}>
													<option disabled value="Column 6">
														Column 6
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									{data[0].seventh ? (
										<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
											<div
												style={{
													width: '40%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
													padding: '.5%',
												}}
											>
												<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
													Column 7
												</h5>
												{data.slice(0, 5).map((e, i) => {
													return (
														<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
															{e.seventh}
														</h6>
													);
												})}
											</div>
											<div style={{ width: '25%' }}>
												<h5>Column 7</h5>
												<Select value={this.state.order[6]} onChange={e => this.changeOrder(6, e.target.value)}>
													<option disabled value="Column 7">
														Column 7
													</option>
													<option value="first_name">First Name</option>
													<option value="last_name">Last Name</option>
													<option value="email">Email</option>
													<option value="phone">Phone</option>
													<option value="ignore">Ignore</option>
												</Select>
											</div>
										</div>
									) : null}
									<div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
										{this.state.corp.length >= 2 ? (
											<div className="input-field" style={{ width: '30%' }}>
												<Select value={this.state.uploadTo.toString()} onChange={e => this.setState({ uploadTo: e.target.value.toString() })}>
													{this.state.corp.map((e, i) => (
														<option value={e.c_id.toString()} key={i}>
															{`${e.c_id.toString()} - ${e.company_name}`}
														</option>
													))}
													<option value={'all'}>{`Split Between All`}</option>
												</Select>
												<label>Upload Client To</label>
											</div>
										) : (
											<div>Uploading to {this.state.og.company_name}</div>
										)}
										<div className="input-field" style={{ width: '30%' }}>
											<Select value={this.state.service} onChange={e => this.setState({ service: e.target.value })}>
												<option value="reviews">Reviews</option>
											</Select>
											<label>Service For List</label>
										</div>
										<label
											style={{ width: '30%', display: 'flex', justifyContent: 'flex-start', marginBottom: '2.5%', marginTop: '2.5%' }}
											data-tip
											data-for="reset"
										>
											<input type="checkbox" checked={this.state.reset} onChange={() => this.setState({ reset: !this.state.reset })} />
											<span className="tab">Reset/Scrub List</span>
										</label>
										<ReactTooltip id="reset" type="dark" effect="float" place="bottom">
											<span>Warning: This will reset the list</span>
										</ReactTooltip>
									</div>
									<LoadingWrapperSmall loading={this.state.ordering} style={{ marginBottom: '5%' }}>
										<button className="btn  primary-color primary-hover" onClick={() => this.formatOrder()}>
											Order
										</button>
									</LoadingWrapperSmall>
								</div>
							)}
						</NoDiv>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(ClientUpload);
