import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import swal from "sweetalert";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import "../../../assets/css/User/Dashboard/share.css";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import Copy from "../../../assets/images/icons/copy.png";

var jsonData = require("../home.json");

const styles = (theme) => ({
  paper: {
    background: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    maxWidth: "unset",
  },
});

class Share extends Component {
  state = {
    open: false,
  };
  handleClick = (e) => {
    e.stopPropagation();
    this.setState({ open: true });
  };
  shareClose = (e) => {
    e.stopPropagation();
    this.setState({ open: false });
  };
  copyLink = () => {
    navigator.clipboard.writeText(this.props.share);
    swal("Success", "Link Copied", "success");
  };
  render() {
    const { classes } = this.props;
    return (
      <>
        <div onClick={this.handleClick} className="flex pointer">
          {this.props.children}
        </div>

        <Dialog
          open={this.props.open ? this.props.open : this.state.open}
          onClose={this.props.close ? this.props.close : this.shareClose}
          aria-labelledby="form-dialog-title"
          classes={{ paper: classes.paper }}
        >
          <DialogTitle id="form-dialog-title">{jsonData.dialog.share}</DialogTitle>
          <DialogContent>
            <div className="share_flex">
              <FacebookShareButton url={this.props.share} quote={this.props.title} className="share_icons">
                <div className="share_button">
                  <div className="shareIcon">
                    <FacebookIcon />
                  </div>
                  {/* <span>{jsonData.dialog.facebook}</span> */}
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={this.props.share} title={this.props.title} className="share_icons">
                <div className="share_button">
                  <div className="shareIcon">
                    <TwitterIcon />
                  </div>
                  {/* <span>{jsonData.dialog.twitter}</span> */}
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url={this.props.share} className="share_icons">
                <div className="share_button">
                  <div className="shareIcon">
                    <LinkedinIcon />
                  </div>
                  {/* <span>{jsonData.dialog.linkedin}</span> */}
                </div>
              </LinkedinShareButton>

              <TelegramShareButton url={this.props.share} title={this.props.title} className="share_icons">
                <div className="share_button">
                  <div className="shareIcon">
                    <TelegramIcon />
                  </div>
                  {/* <span>{jsonData.dialog.telegram}</span> */}
                </div>
              </TelegramShareButton>
              <WhatsappShareButton
                url={this.props.share}
                title={this.props.title}
                separator=" :: "
                className="share_icons"
              >
                <div className="share_button">
                  <div className="shareIcon">
                    <WhatsappIcon />
                  </div>
                  {/* <span>{jsonData.dialog.whatsapp}</span> */}
                </div>
              </WhatsappShareButton>

              <div onClick={this.copyLink} style={{ position: "relative" }}>
                <div className="share_button cp">
                  <div className="shareIcon" style={{ position: "absolute", top: "10px", left: "15px" }}>
                    <img src={Copy} width="40" height="40" />
                  </div>
                  {/* <span>{jsonData.dialog.copy}</span> */}
                </div>
              </div>
            </div>

            <DialogActions>
              <Button onClick={this.props.close ? this.props.close : this.shareClose} size="small">
                {jsonData.dialog.cancel}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

Share.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Share);
