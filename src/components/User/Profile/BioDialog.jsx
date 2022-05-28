import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import ProfileIcon from "../../../assets/images/icons/profile-about.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Group from "../../../assets/images/icons/Group_298.png";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import { getLocal } from "../../common/localStorageAccess";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../../assets/css/User/Profile/profile_dialog.css";
var data = require("./profile.json");

const useStyles = (theme) => ({
  paper: {
    borderRadius: "16px",
    width: "650px",
    // height: "450px",
    padding: "5px",
  },
  closeIcon: { color: "white" },
  closeIconTwo: { color: "black" },
});
class BioDialog extends Component {
  state = {
    bio: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserBio}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        bio: this.state.bio,
      },
    })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    await this.props.update();
    this.setState({ loading: false });
    this.props.handleClose("bio");
  };

  componentDidMount() {
    console.log(this.props);
    this.setState({ bio: this.props.bio ?? "" });
  }

  render() {
    const { classes } = this.props;
    const { open, handleClose } = this.props;

    return (
      <div id="profile-about-dialog">
        <Dialog
          open={open}
          onClose={() => handleClose("bio")}
          classes={{ paper: classes.paper }}
          maxWidth="lg"
          scroll="body"
        >
          <div className="flex-only p_d_div">
            <div className="p_d_content">
              <div className="flex space-between">
                <div className="flex">
                  <img
                    src={require(`../../../assets/images/icons/${data.images.profileAbout}`)}
                    className="p_d_img"
                    alt=""
                  />
                  <h3>{data.title.bio}</h3>
                </div>
                <IconButton onClick={() => handleClose("about")} className="p_d_close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="p_d_content_in">
                  <textarea
                    style={{ padding: 10, borderRadius: 10, width: "100%" }}
                    row="10"
                    value={this.state.bio}
                    onChange={(e) => this.setState({ bio: e.target.value })}
                  />

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
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="p_d_ill relative">
              <IconButton onClick={() => handleClose("bio")}>
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
export default withStyles(useStyles)(BioDialog);
