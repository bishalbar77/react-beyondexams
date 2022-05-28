import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import { getLocal, setLocal, clearLocal } from "../../common/localStorageAccess";
import { CreateCourseAccountSelector } from "./TutorialSteps.js";
import { Steps } from "intro.js-react";
import lwyLogo from "../../../assets/images/icons/logo-with-text.svg";
import { Backdrop, CircularProgress, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.tooltip + 1,
    color: "#fff",
  },
});

class AccountSelector extends Component {
  neverMissAnUpdateCheckbox = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      await axios({
        url: `https://beyondexamssubstack.herokuapp.com/subscribe?email=${localStorage.getItem("email")}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },

        // data: {
        //   newsletter: 1,
        // },
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e);
        });

      console.log("checked");
      console.log(localStorage.getItem("email"));
    } else {
      //unchecked
      console.log("unchecked");
    }
  };

  state = { isOpen: false, backdrop: false, role: "", user: "" };

  // referral system
  referral_code = this.props.referral_code;

  userLogin = (role_id) => {
    if (!role_id) {
      return;
    }
    let access_token = getLocal("uid");

    const formData = new FormData();
    formData.append("access_token", access_token);
    formData.append("role_id", role_id);
    formData.append("request_url", window.location.href);

    if (this.referral_code !== null) {
      formData.append("referral_code", this.referral_code);
    }

    if (role_id === 3) {
      this.setState({ backdrop: false });
      swal("Beta Version", "This feature is not yet available", "error");
    } else if (access_token) {
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/verifyFirebaseAccessToken`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: formData,
      })
        .then((response) => {
          let data = response.data.data;
          // console.log(data);
          setLocal("access_token", data.access_token);
          setLocal("name", data.name);
          setLocal("refresh_token", data.refresh_token);
          setLocal("email", data.email);
          setLocal("new", data.new);
          setLocal("unique_id", data.unique_id);
          setLocal("legacy_user_id", data.legacy_user_id);
          setLocal("phoenix_user_id", data.phoenix_user_id);
          setLocal("role_id", role_id);
          setLocal("slug", data.slug);
          this.setState({ backdrop: false });
          if (this.state.isOpen) {
            this.tutorialClick = true;
          }
          if (localStorage.getItem("coc") === "true") {
            window.location.href = "/explore-by-topics";
          } else if (data.new === 0) {
            window.location.href = "/dashboard/profile/" + data.slug;
          } else {
            window.location.href = "/explore-by-topics";
          }
        })
        .catch(() => {
          this.setState({ backdrop: false });
          clearLocal();
          swal("User not Authenticated", "Please try again", "error");
        });
    } else {
      this.setState({ backdrop: false });
      clearLocal();
      swal("User not Authenticated", "Please try again", "error");
    }
  };
  componentDidMount = () => {
    setTimeout(() => {
      if (localStorage.getItem("coc") === "true") {
        this.setState({ isOpen: true });
      }
    }, 500);
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
  adminLogin = () => {
    if (!this.state.role && !this.state.user) {
      return;
    }
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/userProxyLogin`,
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getLocal("admin_token") ? getLocal("admin_token") : getLocal("access_token")}`,
      },
      data: {
        role_id: this.state.role,
        user_id: this.state.user,
      },
    })
      .then((response) => {
        let data = response.data.data;
        console.log(data);
        setLocal("admin_token", getLocal("access_token"));
        setLocal("avatar", data.avatar);
        setLocal("access_token", data.access_token);
        setLocal("name", data.name);
        setLocal("refresh_token", data.refresh_token);
        setLocal("email", data.email);
        setLocal("new", data.new);
        setLocal("uid", data.unique_id);
        setLocal("unique_id", data.unique_id);
        setLocal("phoenix_user_id", data.phoenix_user_id);
        setLocal("role_id", this.state.role);
        setLocal("slug", data.slug);
        this.setState({ backdrop: false });
        if (this.state.isOpen) {
          this.tutorialClick = true;
        }
        if (localStorage.getItem("coc") === "true") {
          window.location.href = "/explore-by-topics";
        } else if (data.new === 0) {
          window.location.href = "/dashboard/profile";
        } else {
          window.location.href = "/explore-by-topics";
        }
      })
      .catch(() => {
        this.setState({ backdrop: false });
        swal("User not Authenticated", "Please try again", "error");
      });
  };

  // handleBackdrop = () => {
  //   this.setState({ backdrop: false });
  // };

  render() {
    const { classes } = this.props;
    // console.log(this.referral_code)
    return (
      <>
        <Backdrop className={classes.backdrop} open={this.state.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="login-logo" style={{ backgroundImage: `url(${lwyLogo})` }}></div>
        <p>Login as</p>
        {this.props.admin ? (
          <>
            <TextField
              id="role"
              label="Role id"
              onChange={(e) => {
                this.setState({ role: e.target.value });
              }}
            />
            <TextField
              id="user"
              label="User id"
              onChange={(e) => {
                this.setState({ user: e.target.value });
              }}
            />

            <div
              className="SelectorLoginBTN btn-selector-p-2"
              onClick={() => this.adminLogin()}
              onMouseEnter={() => this.props.setIndex(0)}
            >
              submit
            </div>
          </>
        ) : (
          <>
            <div
              className="SelectorLoginBTN btn-selector-p-2"
              onClick={() => {
                this.setState({ backdrop: true });
                this.userLogin(1);
              }}
              onMouseEnter={() => this.props.setIndex(0)}
            >
              Student
            </div>
            <div
              className="SelectorLoginBTN btn-selector-p-2"
              onClick={() => {
                this.setState({ backdrop: true });
                this.userLogin(2);
              }}
              onMouseEnter={() => this.props.setIndex(1)}
              data-tut="teacher"
            >
              Teacher
            </div>
            <div
              className="SelectorLoginBTN btn-selector-p-2"
              onClick={() => {
                this.setState({ backdrop: true });
                this.userLogin(3);
              }}
              onMouseEnter={() => this.props.setIndex(2)}
            >
              Parents
            </div>
            <Steps
              enabled={this.state.isOpen}
              steps={CreateCourseAccountSelector}
              initialStep={0}
              onExit={this.closeTour}
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
          </>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
            <Checkbox
              color="primary"
              onClick={(e) => {
                this.neverMissAnUpdateCheckbox(e);
              }}
            />
            <p style={{ fontSize: "14px", marginTop: "20px" }}>
              Never miss an update <br />
              Join our newsletter.
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(AccountSelector));
