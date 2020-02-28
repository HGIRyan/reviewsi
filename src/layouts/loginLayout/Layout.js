import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoginContentHolder, LoginChildFlexContainer, MarketContent, Login } from './../../utilities/index';
import ContentHolder from './Content';

class Layout extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<Login>
				<LoginContentHolder width={window.innerWidth >= 1100 ? null : '100vw'}>
					<LoginChildFlexContainer height={window.innerWidth >= 1100 ? null : '90vh'}>{this.props.children}</LoginChildFlexContainer>
				</LoginContentHolder>
				{window.innerWidth >= 1100 ? (
					<MarketContent>
						<ContentHolder />
					</MarketContent>
				) : null}
			</Login>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Layout);
