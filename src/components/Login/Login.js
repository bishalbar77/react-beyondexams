import React, { Component } from "react";
import MetaHelmet from "../common/MetaHelmet";
import AuthSelector from "./components/AuthSelector";
import AccountSelector from "./components/AccountSelector";
import Matomo from "../common/Matomo";
import "../../assets/css/Login/loginSelector.css";
import { connect } from "react-redux";
import { toggleAuthentication, handleLoader } from "../../actions/authActions";
import Animated from "./components/Animated";
import Group52 from "../../assets/images/icons/Group-52.svg";

class LoginSelector extends Component {
  constructor(props) {
    super(props);
    this.query = null;
    this.referral_code = null;
  }
  toggleAuthentication = () => {
    this.props.toggleAuthentication();
  };
  state = {
    index: 0,
  };

  /* referral code */

  setIndex = (val) => {
    this.setState({
      index: val,
    });
  };

  componentDidMount() {
    // if (localStorage.getItem("google_access_token")) {
    //   this.props.toggleAuthentication();
    // }
    this.query = new URLSearchParams(window.location.search);
    this.referral_code = this.query.get("referral_code");
  }

  render() {
    const { isAuthenticated } = this.props;
    // console.log(this.referral_code)
    return (
      <Matomo pageTitle="Login page">
        <MetaHelmet title="BeyondExams" description="Best educational videos on your fingertips. Start learning now!" />
        <div>
          <div className="login-top-section">
            <div className="container flex">
              <div className="login-top-left flex flex-center">
                <Animated index={this.state.index} />
              </div>
              <div className="login-top-right flex flex-center">
                <div className="flex-column login-form">
                  {isAuthenticated ? (
                    <AccountSelector
                      referral_code={this.referral_code}
                      setIndex={this.setIndex}
                      admin={this.props.admin}
                    />
                  ) : (
                    <AuthSelector toggleAuthentication={this.toggleAuthentication} />
                  )}
                  <img src={Group52} className="group-52" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Matomo>
    );
  }
}
const mapStatesToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    loaderVisibility: state.auth.loaderVisibility,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleAuthentication: () => dispatch(toggleAuthentication()),
    handleLoader: (bool) => dispatch(handleLoader(bool)),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(LoginSelector);
