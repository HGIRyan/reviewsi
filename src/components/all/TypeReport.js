import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Layout1, LoadingWrapper, StyledLink, ThreeSplit, BoxSplit, RowContainer } from './../../utilities/index';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import Pagination from './function/Pagination';
// import Moment from 'moment';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

class TypeReport extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			show: false,
			id: false,
			name: false,
			listSize: true,
			RemainingList: true,
			SearchBy: 'company_name',
		};
	}
	async componentDidMount() {
		let { type } = this.props.match.params;
		document.title = `Lift Local - ${type} Report`;
		type = await this.typeSync(type);
		let { info } = this.props.location.state;
		let og = info;
		this.setState({ og });
		if (Array.isArray(info) && info.length > 0) {
			info = info.filter(item => item.active_prod[type]);
			if (info[0]) {
				await this.setState({ info });
				await this.List(info, type);
			} else {
				let pinfo = <p>No Results</p>;
				await this.setState({ info, pinfo });
			}
		} else {
			await this.Start(type);
		}
		this.setState({ loading: false, type });
	}
	typeSync(type) {
		if (type === 'cross') {
			return 'cross_sell';
		} else if (type === 'win') {
			return 'winback';
		} else if (type === 'lead') {
			return 'leadgen';
		} else if (type === 'ref') {
			return 'referral';
		}
	}
	async Start(type) {
		await axios.get('/api/home/info').then(async res => {
			if (res.data.msg === 'GOOD') {
				let info = res.data.info.filter(item => item[type]);
				if (info[0]) {
					await this.setState({ info });
					await this.List(info, type);
				} else {
					let pinfo = <p>No Results</p>;
					await this.setState({ info, pinfo });
				}
			} else {
				alert(res.data.msg);
			}
		});
	}
	async search(val) {
		let { SearchBy, type, info } = this.state;
		if (val.length >= 3) {
			let similar = await info.filter(item => item[SearchBy].toLowerCase().includes(val.toLowerCase()));
			await this.List(similar, type);
		} else {
			this.List(info, type);
		}
	}

	async List(pinfo, type) {
		// type = type === 'referral' ? 'ref' : type === 'winback' ? 'winbacks' : type;
		let specType = type === 'winback' ? 'winbacks' : type === 'referral' ? 'ref' : type;
		let dates = pinfo[0].addons[specType].sort((a, b) => {
			var c = new Date(a.date);
			var d = new Date(b.date);
			return d - c;
		});
		pinfo = (
			<ReactTableFixedColumns
				data={pinfo}
				columns={[
					{
						Header: '',
						fixed: 'left',
						columns: [
							{
								Header: 'ID',
								accessor: 'c_id',
								width: 50,
							},
							{
								Header: 'Name',
								accessor: 'company_name',
								width: 250,
							},
							{
								Header: 'List Size',
								id: 'c_id + 2',
								accessor: info => info.customers[type][info.customers[type].length - 1].size,
								width: 100,
							},
							{
								Header: 'Remaining List',
								id: 'c_id + 3',
								accessor: info => info.customers[type][info.customers[type].length - 1].remaining,
								width: 100,
							},
						],
					},
					{
						Header: '',
						columns: dates.map(date => {
							return {
								Header: date.date.split('T')[0],
								id: date.date.split('T')[0],
								width: 100,
								accessor: info => {
									let filter = info.addons[specType].filter(dat => dat.date === date.date.split('T')[0])[0];
									return filter ? filter.clicks : 'N/A';
								},
							};
						}),
					},
				]}
				PaginationComponent={Pagination}
				showPaginationBottom={pinfo.length >= 500 ? true : false}
				defaultPageSize={pinfo.length >= 500 ? 500 : pinfo.length}
				className="-striped"
				minRows={1}
				style={{ maxHeight: '80vh', maxWidth: '80vw', zIndex: '0' }}
			/>
		);
		// pinfo = pinfo.map((info, j) => {
		// 	for (let i = 0; i < info.active.active.length; i++) {
		// 		return (
		// 			<MapTR key={info.c_id} index={j}>
		// 				<td>{info.c_id}</td>
		// 				<td>
		// 					<DefaultLink to={`/client-dash/${info.c_id}/1`}>{info.company_name.name[i]}</DefaultLink>
		// 				</td>
		// 				<td>{info.customers.cust[i][info.customers.cust[i].length - 1][type][info.customers.cust[0][info.customers.cust[0].length - 1][type].length - 1].size}</td>
		// 				<td>{info.customers.cust[i][info.customers.cust[i].length - 1][type][info.customers.cust[0][info.customers.cust[0].length - 1][type].length - 1].remaining}</td>
		// 				{/* Map Dates and have results that match */}
		// 			</MapTR>
		// 		);
		// 	}
		// });
		this.setState({ pinfo });
	}
	render() {
		let { type } = this.props.match.params;
		let { show, pinfo } = this.state;
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'reports', type: type }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<ThreeSplit>
							<BoxSplit width="20vw;">
								<BoxSplit width="100%;">
									<h3>Current: {type === 'win' ? 'Winbacks' : type === 'lead' ? 'Lead Gen' : type === 'cross' ? 'Cross Sell' : 'Referral'}</h3>
									<p> Select Another </p>
									{type !== 'win' ? (
										<StyledLink
											onClick={() => {
												this.Start('win');
												this.setState({ show: !show });
											}}
											to="/home/report/win"
										>
											Winbacks
										</StyledLink>
									) : null}
									{type !== 'lead' ? (
										<StyledLink
											onClick={() => {
												this.Start('lead');
												this.setState({ show: !show });
											}}
											to="/home/report/lead"
										>
											Lead Gen
										</StyledLink>
									) : null}
									{type !== 'cross' ? (
										<StyledLink
											onClick={() => {
												this.Start('cross');
												this.setState({ show: !show });
											}}
											to="/home/report/cross"
										>
											Cross Selling
										</StyledLink>
									) : null}
									{type !== 'ref' ? (
										<StyledLink
											onClick={() => {
												this.Start('ref');
												this.setState({ show: !show });
											}}
											to="/home/report/ref"
										>
											Referral Gen
										</StyledLink>
									) : null}
								</BoxSplit>
							</BoxSplit>
							<BoxSplit width="30vw">
								<RowContainer>
									{/* <h6>
										<select onChange={e => this.setState({ searchBy: e.target.value })} value={this.state.searchBy}>
											<option value="company_name">Name</option>
											<option value="c_id">ID</option>
										</select>
									</h6>
									<input
										onChange={e => {
											this.search(e.target.value);
										}}
									/> */}
								</RowContainer>
							</BoxSplit>
							{/* <BoxSplit width="30vw;">Hello</BoxSplit> */}
						</ThreeSplit>
						{pinfo ? <div>{pinfo}</div> : null}
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(TypeReport);
