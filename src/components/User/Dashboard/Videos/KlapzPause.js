import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import "../../../../assets/css/User/Dashboard/klapz.css";
import Klapz from "../../../../assets/images/icons/klapz-logo.jpg";
import Hands from "../../../../assets/images/icons/hands.jpg";

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

class KlapzPause extends Component {
  render() {
    const { classes } = this.props;

    return (
      <>
        <Dialog open={this.props.open} onClose={this.props.handleClose} classes={{ paper: classes.paper }}>
          <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}></DialogTitle>
          <div className="klapz">
            <div className="klapz-title flex">
              <img src={Klapz} alt="Klapz"></img>
            </div>
            <div className="klapz-pause-content">
              Would you like to appreciate the the content creator by making a small contribution?
            </div>
            <div className="klapz-actions">
              <button onClick={this.props.handleClose} className="klapz-btn-outlined flex flex-center">
                Later
              </button>
              <button className="klapz-btn-filled flex flex-center">Sure</button>
            </div>
            <div className="klapz-bottom">
              <img src={Hands} alt="hands"></img>
              <p>Your contribution can be as small as 1 Rs</p>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(KlapzPause);
