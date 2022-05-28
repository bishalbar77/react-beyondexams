import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import "../../../../../assets/css/User/Dashboard/klapz.css";
import Hands from "../../../../../assets/images/icons/hands.jpg";
import KlapzOtpVerification from "./KlapzOtpVerification";
import swal from "sweetalert";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: 600,
  },
  paper: {
    borderRadius: "16px",
    width: "763px",
    padding: "30px 0",
    "@media(max-width:600px)": {
      margin: "12px",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle {...other}>
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class Klapz extends Component {
  state = {
    open: false,
    openOtpVerification: false,
  };
  handleClick = (e) => {
    e.stopPropagation();
    let access = localStorage.getItem("access_token");
    if (!access) {
      swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        }
      });
    } else {
      this.setState({ open: true });
    }
  };
  handleClose = (e) => {
    e.stopPropagation();
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;

    return (
      <>
        <div onClick={this.handleClick} className="flex">
          {this.props.children}
        </div>
        {this.state.open && (
          <Dialog open={this.state.open} onClose={this.handleClose} classes={{ paper: classes.paper }}>
            <DialogTitle id="customized-dialog-title" onClose={this.handleClose}></DialogTitle>
            <div className="klapz">
              <div className="klapz-title flex">
                <img src={Hands} alt="hands"></img>
                <p>Appriciate the content creators</p>
                <img src={Hands} alt="hands"></img>
              </div>
              <div className="klapz-content">
                If you loved the content please appreciate the content creator by making a small contribution.
                <b> Your contribution can be as small as 1 Rs</b>, With these micro-fundings, the creators will be able
                to make meaningful earnings that they deserve. And the best part, you can fund more content & creators,
                after all, it doesn’t hurt your pocket anymore.
              </div>
              <div className="klapz-actions">
                <button onClick={this.handleClose} className="klapz-btn-outlined flex flex-center">
                  Not right now
                </button>
                <button
                  className="klapz-btn-filled flex flex-center"
                  onClick={() => {
                    this.setState({ openOtpVerification: true, open: false });
                  }}
                >
                  Klap this video
                </button>
              </div>
            </div>
          </Dialog>
        )}
        {this.state.openOtpVerification && (
          <KlapzOtpVerification
            open={this.state.openOtpVerification}
            handleClose={() => {
              this.setState({ openOtpVerification: false });
            }}
            id={this.props.id}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(Klapz);
