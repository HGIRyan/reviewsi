import React, { Component } from 'react';
import { connect } from 'react-redux';

class Sales extends Component {
    constructor() {
        super()

        this.state = {

        }
    }

    render() {
        return (
            <div>
                Sales SideBar
          </div>
        )
    }
}

function mapStateToProps(state) {
    return { ...state };
}
export default connect(
    mapStateToProps, {}
)(Sales);