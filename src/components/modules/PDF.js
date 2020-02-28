import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';

class PDF extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<div>
				<input type="text" placeholder="name" name="name" onChange={this.handleInput} />
				<input type="text" placeholder="name" name="name" onChange={this.handleInput} />
				<input type="number" placeholder="name" name="name" onChange={this.handleInput} />
				<input type="number" placeholder="name" name="name" onChange={this.handleInput} />
				<input type="number" placeholder="name" name="name" onChange={this.handleInput} />
				<button onClick={this.createAndDownloadPDF}>Download PDF</button>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(PDF);
