import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import "../../../../../assets/css/User/Dashboard/klapz.css";
import PhoneInput from "react-phone-input-2";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import "react-phone-input-2/lib/high-res.css";
import firebase from "../../../../common/init-fcm";
import CircularProgress from "@material-ui/core/CircularProgress";
import swal from "sweetalert";
import "firebase/auth";
import axios from "axios";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: 600,
  },
  paper: {
    borderRadius: "16px",
    paddingBottom: "20px",
    width: 600,
    "@media(max-width:600px)": {
      margin: "12px",
    },
  },

  closeButton: {
    color: "white",
  },
  loader: {
    color: "white",
    width: "18px !important",
    height: "18px !important",
  },
});

class Klapz extends Component {
  state = {
    phone: "",
    getOtp: false,
    otp: new Array(6).fill(""),
    error: false,
    showProgress: false,
    sendOtpButtonDisabled: true,
  };
  componentDidMount = () => {
    console.log(this.props.id);
    setTimeout(() => {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign", {
        size: "normal",
        callback: (response) => {
          console.log("captcha resolved");
          this.setState({ sendOtpButtonDisabled: false });
        },
      });
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }, 300);
  };

  handleChange = (element, index) => {
    if (this.state.error) {
      this.setState({ error: false });
    }
    if (isNaN(element.value)) return false;
    this.setState({ otp: [...this.state.otp.map((d, idx) => (idx === index ? element.value : d))] });
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  handleClose = () => {
    this.setState({ phone: "", getOtp: false, otp: new Array(6).fill(""), error: false, showProgress: false });
    this.props.handleClose();
  };
  signInWithPhoneNumber = (e) => {
    console.log("sign");
    const phoneNumber = "+" + this.state.phone;
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        console.log("code sent");
        window.confirmationResult = confirmationResult;
        this.setState({ getOtp: true, showProgress: false });
        // this.setState({ showProgress: false });
      })
      .catch((error) => {
        this.setState({ showProgress: false });
        console.log(error);
        swal(error.message, error.code, "error");
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ showProgress: true });
    this.signInWithPhoneNumber();
  };
  verifyOtp = () => {
    this.setState({ showProgress: true });
    const code = this.state.otp.join("");
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        console.log("success");
        // const query = new URLSearchParams(window.location.search);
        const videoId = this.props.id;

        await axios({
          url: `https://klapz.club/user?apiKey=1b7wo7qbkqrrwkz6`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            user: {
              firstName: localStorage.getItem("first_name"),
              lastName: localStorage.getItem("last_name"),
              mobileNumber: "+" + this.state.phone,
            },
            content: {
              url: "https://www.youtube.com/watch?v=" + videoId,
            },
          },
        })
          .then((data) => {
            console.log(data.data.redirect);
            window.location.href = data.data.redirect;
            this.handleClose();
          })
          .catch((e) => {
            this.setState({ showProgress: false });
            console.log(e);
          });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, showProgress: false });
      });
  };
  resendOtp = () => {
    const phoneNumber = "+" + this.state.phone;
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <div onClick={this.handleClick} className="flex">
          {this.props.children}
        </div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            this.handleClose();
          }}
          classes={{ paper: classes.paper }}
        >
          <div className="k_o_header">
            <h3>OTP Verification</h3>
            <IconButton
              className={classes.closeButton}
              onClick={() => {
                this.handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          {!this.state.getOtp ? (
            <div className="klapz">
              <div className="klapz_o_title flex">
                <p>
                  We will send you <b>One time password</b> on this number
                </p>
              </div>

              <div className="k_phone_input">
                <PhoneInput
                  country={"in"}
                  countryCodeEditable={false}
                  value={this.state.phone}
                  onChange={(phone) => this.setState({ phone })}
                />
              </div>
              <div id="sign"></div>
              <div className="klapz-actions-otp">
                <button
                  className="klapz-btn-filled flex flex-center"
                  type="submit"
                  onClick={this.state.showProgress ? undefined : this.handleSubmit}
                  disabled={this.state.sendOtpButtonDisabled}
                >
                  {this.state.showProgress ? <CircularProgress className={classes.loader} /> : "Get OTP"}
                </button>
              </div>
            </div>
          ) : (
            <div className="klapz">
              <div className="klapz_o_title flex">
                <p>
                  Enter the OTP sent to <b>+{this.state.phone}</b>
                </p>
              </div>
              {this.state.error && (
                <div className="k_o_error">
                  <WarningRoundedIcon />
                  <p>Verification code invalid</p>
                </div>
              )}
              <div className="k_otp_input">
                <section>
                  {this.state.otp.map((data, index) => {
                    return (
                      <input
                        className={`${this.state.error ? "otp_error" : ""}`}
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={(e) => this.handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        autoComplete="off"
                      />
                    );
                  })}
                </section>
              </div>
              {/* <div className="k_o_resend">
                <p>
                  Didn’t get the code yet?<span onClick={this.resendOtp}> RESEND OTP</span>
                </p>
              </div> */}
              <div className="klapz-actions">
                <button
                  className="klapz-btn-filled flex flex-center"
                  onClick={this.state.showProgress ? undefined : this.verifyOtp}
                >
                  {this.state.showProgress ? <CircularProgress className={classes.loader} /> : "Proceed"}
                </button>
              </div>
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(Klapz);
