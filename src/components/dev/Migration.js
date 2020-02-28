import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1 } from '../../utilities/index';
import axios from 'axios';

class Migration extends Component {
	constructor() {
		super();

		this.state = {
			info: [],
			bus_id: '',
			c_id: '',
			client_id: '',
			search: '',
			sf_id: '',
			res: [],
		};
	}
	componentDidMount() {
		this.setState({ info: this.props.location.state.info });
		// console.log(this.props.location.state);
	}
	async gatherAgents() {
		// let { info, c_id, bus_id, client_id } = this.state;
		let { info, c_id } = this.state;
		let check = info.filter(e => parseInt(e.c_id) === parseInt(c_id));
		if (check[0]) {
			await axios.post('/api/getgatherupcustomer', { c_id, check }).then(res => {
				if (res.data.msg === 'GOOD') {
					console.log('WE GOOD');
				}
			});
		} else {
			console.log('WE NOT GUCCI');
		}
		// await axios.get('/api/all-agents').then(res => console.log(res));
	}
	async updateAPI() {
		let { info, c_id, bus_id, client_id } = this.state;
		let check = info.filter(e => parseInt(e.c_id) === parseInt(c_id));
		if (check[0] && client_id) {
			await axios.post('/api/update/gatherup/credientials', { c_id, bus_id, client_id, check }).then(res => {
				if (res.data.msg === 'GOOD') {
					console.log('WE GOOD');
				}
			});
		} else {
			console.log('WE NOT GUCCI');
		}
	}
	async testSF() {
		await axios.get('/api/salesforce/test').then(res => {
			console.log(res.data);
		});
	}
	results() {
		let { search } = this.state;
		let res = this.props.location.state.info;
		res = res.filter(e => e.company_name.toLowerCase().includes(search.toLowerCase()));
		if (search && res[0]) {
			return res.map((e, i) => {
				return (
					<div
						key={i}
						style={{
							cursor: 'pointer',
							minWidth: '20vw',
							height: '5vh',
							margin: '5%',
							border: 'solid black',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onClick={() => this.submitSF(e)}
					>
						{e.company_name}
					</div>
				);
			});
		} else {
			return 'No Results';
		}
	}
	async submitSF(e) {
		let { sf_id } = this.state;
		if (sf_id && e.c_id) {
			e.c_api.salesforce = { sf_id: sf_id };
			console.log(e.c_api);
			// Send API Obj and ID
			let c_id = e.c_id;
			let key = e.c_api;
			await axios.post('/api/update/api', { c_id, key });
			// alert(`Good e - ${e.c_id} SF - ${sf_id}`);
		} else alert('Missing SalesForce ID');
	}
	render() {
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: 'Lift Local' };

		return (
			<Layout1 view={{ sect: 'indv', data: data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				Migration Page
				{/* <button onClick={() => this.gatherAgents()}> Start Migration </button>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h5>C_ID</h5>
					<input onChange={e => this.setState({ c_id: e.target.value })} />
					<h5>bus_id</h5>
					<input onChange={e => this.setState({ bus_id: e.target.value })} />
					<h5>client_id</h5>
					<input onChange={e => this.setState({ client_id: e.target.value })} />
					<button onClick={() => this.updateAPI()}>Apply</button>
				</div> */}
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h3>SF Tests</h3>
					<button onClick={() => this.testSF()}>TEST</button>
				</div>
				{/* <div style={{ display: 'flex', flexDirection: 'column' }}>
					<h3>Attatch SF To LiLo</h3>
					<h6>SalesForce ID</h6>
					<input onChange={e => this.setState({ sf_id: e.target.value })} value={this.state.sf_id} />
					<h6>Search For Client</h6>
					<input onChange={e => this.setState({ search: e.target.value })} value={this.state.search} />
					{this.results()}
				</div> */}
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Migration);
