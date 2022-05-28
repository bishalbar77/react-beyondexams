import React, { Component } from "react";
import swal from "sweetalert";
import { setLocal } from "../../common/localStorageAccess";
// import { Link } from "react-router-dom";
import GoogleImg from "../../../assets/images/icons/google.svg";
import "firebase/auth";
import firebase from "../../common/init-fcm";
import lwyLogo from "../../../assets/images/icons/logo-with-text.svg";
import { Steps } from "intro.js-react";
import { CreateCourseAuthSelector } from "./TutorialSteps.js";

var provider = new firebase.auth.GoogleAuthProvider();
//provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl");

class AuthSelector extends Component {
  state = { open: false };
  componentDidMount = () => {
    setTimeout(() => {
      if (localStorage.getItem("coc") === "true") {
        this.setState({ isOpen: true });
      }
    }, 500);
  };
  handlelogin = async () => {
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        setLocal("access_specifier", "google");
        setLocal("uid", result.user.uid);
        setLocal("google_access_token", result.credential.accessToken);
        setLocal("first_name", result.additionalUserInfo.profile.given_name);
        setLocal("last_name", result.additionalUserInfo.profile.family_name);
        setLocal("email", result.user.email);
        setLocal("unique_id", result.additionalUserInfo.profile.id);
        setLocal("avatar", result.user.photoURL);
        if (this.state.isOpen) {
          this.tutorialClick = true;
        }
        this.props.toggleAuthentication();
      })
      .catch((err) => {
        swal("Account Not Selected", "Please select an account to continue", "warning");
      });
  };
  closeTour = () => {
    this.setState({
      isOpen: false,
    });
    if (this.tutorialClick) {
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
  };

  render() {
    return (
      <>
        <div className="login-logo" style={{ backgroundImage: `url(${lwyLogo})` }}></div>
        <p>Login with</p>
        <div onClick={this.handlelogin} className="SelectorLoginBTN" data-tut="google">
          <div className="justify-center">
            <img src={GoogleImg} alt="Google Button" width="45px" />
          </div>
          <div className="justify-center">Google</div>
        </div>
        <p>By login with google you accept </p>
        <p>
          <b>
            <a
              className="login-anchor"
              href="https://drive.google.com/file/d/16IQiMsgnGzuPo5iSTKWTxGgAbMiOUC9h/view?usp=sharing"
            >
              Our terms of service
            </a>
            {" and "}
            <a
              className="login-anchor"
              href="https://docs.google.com/document/d/1_eNr7v4pYKcXeCAJ7DSjaAgdrpLbuBSGrbbz5SHPfQE/edit"
            >
              privacy policy
            </a>
          </b>
        </p>
        <p className="flex">You are just one step away!</p>
        {!localStorage.getItem("access_token") && (
          <Steps
            enabled={this.state.isOpen}
            steps={CreateCourseAuthSelector}
            initialStep={0}
            onExit={() => this.closeTour()}
            showStepNumbers={false}
            options={{
              tooltipClass: "tour-tool-tip myTooltipClass",
              showStepNumbers: false,
              overlayOpacity: 0,
              highlightClass: "myHighlightClass",
              showBullets: false,
              keyboardNavigation: false,
              // skipLabel: "Got it",
              // showButtons: false,
            }}
          />
        )}
      </>
    );
  }
}

export default AuthSelector;
