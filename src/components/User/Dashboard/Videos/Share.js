import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
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
import "../../../../assets/css/User/Dashboard/share.css";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import Copy from "../../../../assets/images/icons/copy.png";

const styles = (theme) => ({
  paper: {
    background: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
  },
});

class Share extends Component {
  state = {
    open: false,
    isStartAt: false,
    startTime: "4:10",
    shareLink: this.props.share,
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

  handleStartTimeChange = (e) => {
    this.setState({ startTime: e.target.value });
  };
  render() {
    const { classes } = this.props;

    return (
      <>
        <div onClick={this.handleClick}>{this.props.children}</div>

        <Dialog
          open={this.props.open ? this.props.open : this.state.open}
          onClose={this.props.close ? this.props.close : this.shareClose}
          aria-labelledby="form-dialog-title"
          classes={{ paper: classes.paper }}
        >
          <DialogTitle id="form-dialog-title">Share Video</DialogTitle>
          <DialogContent>
            <div className="share_flex">
              <FacebookShareButton url={this.props.share} quote={this.props.title} className="share_icons">
                <div className="share_button_wrapper">
                  <div className="share_button">
                    <div className="shareIcon">
                      <FacebookIcon />
                    </div>
                  </div>
                  <span>Facebook</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={this.props.share} title={this.props.title} className="share_icons">
                <div className="share_button_wrapper">
                  <div className="share_button">
                    <div className="shareIcon">
                      <TwitterIcon />
                    </div>
                  </div>
                  <span>Twitter</span>
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url={this.props.share} className="share_icons">
                <div className="share_button_wrapper">
                  <div className="share_button">
                    <div className="shareIcon">
                      <LinkedinIcon />
                    </div>
                  </div>
                  <span>LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <TelegramShareButton url={this.props.share} title={this.props.title} className="share_icons">
                <div className="share_button_wrapper">
                  <div className="share_button">
                    <div className="shareIcon">
                      <TelegramIcon />
                    </div>
                  </div>
                  <span>Telegram</span>
                </div>
              </TelegramShareButton>
              <WhatsappShareButton
                url={this.props.share}
                title={this.props.title}
                separator=" :: "
                className="share_icons"
              >
                <div className="share_button_wrapper">
                  <div className="share_button">
                    <div className="shareIcon">
                      <WhatsappIcon />
                    </div>
                  </div>
                  <span>Whatsapp</span>
                </div>
              </WhatsappShareButton>
            </div>

            <div className="copy_box">
              <span>{this.props.share}</span>

              <div className="copy_icon" onClick={this.copyLink}>
                <img src={Copy} />
              </div>
            </div>

            {/* {
              this.props.isVideo &&
              <div className="startAt_box">
                <FormControlLabel control={<Checkbox color="primary" />} onChange={() => this.setState({ isStartAt: !this.state.isStartAt })} label="Start At : " />

                <input type="text" value={this.state.startTime} onChange={this.handleStartTimeChange} disabled={this.state.isStartAt ? false : true} />
              </div>
            } */}

            <DialogActions>
              <Button onClick={this.props.close ? this.props.close : this.shareClose} size="small">
                Cancel
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
