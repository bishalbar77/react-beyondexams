import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "../../../assets/css/User/Profile/profile_dialog.css";
// import Info from "../../../assets/images/icons/profile-info.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Group from "../../../assets/images/icons/Group_298.png";
// import ProfileInsta from "../../../assets/images/icons/profile-insta.jpg";
// import ProfileFb from "../../../assets/images/icons/profile-fb.jpg";
// import ProfileTwitter from "../../../assets/images/icons/profile-twitter.jpg";
// import ProfileLinkedIn from "../../../assets/images/icons/profile-linkedin.jpg";
// import ProfileSocial from "../../../assets/images/icons/profile-social.jpg";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import { getLocal } from "../../common/localStorageAccess";
import CircularProgress from "@material-ui/core/CircularProgress";

var data = require("./profile.json");

const useStyles = (theme) => ({
  paper: {
    borderRadius: "16px",
    width: "650px",
    padding: "5px",
  },
  closeIcon: { color: "white" },
});

class SocialDialog extends Component {
  state = {
    facebook_link: this.props.profile.facebook_link,
    instagram_link: this.props.profile.instagram_link,
    twitter_link: this.props.profile.twitter_url,
    linkedin_link: this.props.profile.linkedin_url,
    loading: false,
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  isUrl = (str) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  handleCheck = async (website, link) => {
    if (
      link.indexOf("http:/") ||
      link.indexOf("https:/") ||
      link.indexOf("facebook.com") ||
      link.indexOf("instagram.com") ||
      link.indexOf("linkedin.com") ||
      link.indexOf("twitter.com") ||
      link.indexOf("facebook.in") ||
      link.indexOf("instagram.in") ||
      link.indexOf("linkedin.in") ||
      link.indexOf("twitter.in")
    ) {
      console.log("returning false");
      return false;
    }

    switch (website) {
      case "facebook":
        fetch(`https://www.facebook.com/${link}`).then((res) => {
          if (res >= 200 && res <= 299) return true;
          return false;
        });
        break;

      case "instagram":
        fetch(`https://www.instagram.com/${link}`).then((res) => {
          if (res >= 200 && res <= 299) return true;
          return false;
        });
        break;

      case "linkedin":
        fetch(`https://www.linkedin.com/in/${link}`).then((res) => {
          if (res >= 200 && res <= 299) return true;
          return false;
        });
        break;

      case "twitter":
        fetch(`https://twitter.com/${link}`).then((res) => {
          if (res >= 200 && res <= 299) return true;
          return false;
        });
        break;

      default:
        return false;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let { facebook_link, instagram_link, twitter_link, linkedin_link } = this.state;

    // let flag = false;
    // const errMsg = "Please enter your userhandle only; Links are not accepted";
    // const errMsgProfile = "Error for userhandle on social media :";

    // if (facebook_link) {
    //   if (this.isUrl(facebook_link)) {
    //     swal("Error", errMsg, "error");
    //     facebook_link = {};
    //   } else if (this.handleCheck("facebook", facebook_link)===false) {
    //     swal("Error", ` ${errMsgProfile} facebook`, "error");
    //     facebook_link = {};
    //   }
    // }
    // if (instagram_link) {
    //   if (this.isUrl(instagram_link)) {
    //     swal("Error", errMsg, "error");
    //     instagram_link = {};
    //   } else if (this.handleCheck("instagram", instagram_link)===false) {
    //     swal("Error", ` ${errMsgProfile} instagram`, "error");
    //     instagram_link = {};
    //   }
    // }
    // if (twitter_link) {
    //   if (this.isUrl(twitter_link)) {
    //     swal("Error", errMsg, "error");
    //     twitter_link = {};
    //   } else if (this.handleCheck("twitter", twitter_link)===false) {
    //     swal("Error", ` ${errMsgProfile} twitter`, "error");
    //     twitter_link = {};
    //   }
    // }
    // if (linkedin_link) {
    //   if (this.isUrl(linkedin_link)) {
    //     swal("Error", errMsg, "error");
    //     linkedin_link = {};
    //   } else if (this.handleCheck("linkedin", linkedin_link)===false) {
    //     swal("Error", ` ${errMsgProfile} linkedin`, "error");
    //     linkedin_link = {};
    //   }
    // }

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserProfile}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        ...(facebook_link ? { facebook_link: facebook_link } : {}),
        ...(instagram_link ? { instagram_link: instagram_link } : {}),
        ...(twitter_link ? { twitter_url: twitter_link } : {}),
        ...(linkedin_link ? { linkedin_url: linkedin_link } : {}),
      },
    })
      .then((data) => {
        // console.log("social dialog data after update: ", data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response) {
          swal("Error", e.response.data.message, "error");
        } else {
          swal("Error", e, "error");
        }
      });
    await this.props.update();
    this.setState({ loading: false });
    this.props.handleClose("social");
  };
  render() {
    const { classes } = this.props;
    const { open, handleClose } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => handleClose("social")}
          classes={{ paper: classes.paper }}
          maxWidth="lg"
          scroll="body"
        >
          <div className="flex-only p_d_div">
            <div className="p_d_content">
              <div className="flex space-between">
                <div className="flex">
                  <img
                    src={require(`../../../assets/images/icons/${data.images.profileSocial}`)}
                    className="p_d_img"
                    alt=""
                  />
                  <h3>{data.title.social}</h3>
                </div>
                <IconButton onClick={() => handleClose("social")} className="p_d_close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="p_d_content_in">
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.profileFb}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.facebook}</p>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="p_d_select p_d_width_full"
                      name="facebook_link"
                      placeholder="@facebook"
                      pattern="[a-z\d.]{5,}"
                      title="Please enter facebook username only"
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.facebook_link}
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.profileInsta}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.insta}</p>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="p_d_select p_d_width_full"
                      name="instagram_link"
                      placeholder="@instagram"
                      onChange={this.handleChange}
                      pattern="(?!.*\.\.)(?!.*\.$)[^\W][\w.]{1,29}"
                      title="Please enter instagram username only"
                      defaultValue={this.props.profile.instagram_link}
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.profileTwitter}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.twitter}</p>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="p_d_select p_d_width_full"
                      name="twitter_link"
                      placeholder="@twitter"
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.twitter_link}
                      pattern="^@?(\w){1,15}"
                      title="Please enter Twitter username only."
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.profileLinkedIn}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.linkedIn}</p>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="p_d_select p_d_width_full"
                      name="linkedin_link"
                      placeholder="@linkedin"
                      pattern="[a-zA-Z0-9-]{3,30}"
                      title="Please enter Linkedin username only."
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.linkedin_link}
                    />
                  </div>

                  <div className="flex p_d_info">
                    <img className="p_d_img" src={require(`../../../assets/images/icons/${data.images.info}`)} alt="" />
                    <p className="p_d_title">{data.title.info}</p>
                  </div>
                  <button className="p_d_save_btn" type="submit" disabled={this.state.loading}>
                    {this.state.loading ? (
                      <CircularProgress size={20} color="white" />
                    ) : (
                      <>
                        <img
                          className="p_d_img"
                          src={require(`../../../assets/images/icons/${data.images.save}`)}
                          alt=""
                        />
                        {data.buttons.save}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="p_d_ill relative">
              <IconButton onClick={() => handleClose("social")}>
                <CloseIcon className={classes.closeIcon} fontSize="small" />
              </IconButton>
              <img className="p_d_group" src={require(`../../../assets/images/icons/${data.images.group}`)} alt="" />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(useStyles)(SocialDialog);
