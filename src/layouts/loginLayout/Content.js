import React, { Component } from "react";
import { connect } from "react-redux";
import { } from "./../../utilities/index";

class Content extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="marketingImgContainer">
        <img
          src="//c1.sfdcstatic.com/content/dam/web/en_us/www/images/login-promos/login-promo-mfg-cg-cloud-launch.png"
          alt="marketing img"
          className="marketingImg"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}
export default connect(
  mapStateToProps,
  {}
)(Content);
