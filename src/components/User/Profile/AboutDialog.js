import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import ProfileDob from "../../../assets/images/icons/profile-dob.jpg";
// import ProfileIcon from "../../../assets/images/icons/profile-about.jpg";
// import Location from "../../../assets/images/icons/profile-location.jpg";
// import Contact from "../../../assets/images/icons/profile-contact.jpg";
// import Info from "../../../assets/images/icons/profile-info.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Group from "../../../assets/images/icons/Group_298.png";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getLocal } from "../../common/localStorageAccess";
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
class AboutDialog extends Component {
  state = {
    date: this.props.profile.date,
    month: this.props.profile.month,
    year: this.props.profile.year,
    phone: this.props.profile.phone,
    country: this.props.profile.country_id,
    state: this.props.profile.state,
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let { date, month, year, phone, country, state } = this.state;
    if (date.length === 1) date = "0" + date;
    let dob = date + "-" + month + "-" + year;
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserProfile}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        ...(dob ? { date_of_birth: dob } : {}),
        ...(parseInt(country) ? { country: parseInt(country) } : {}),
        ...(state ? { state: state } : {}),
        ...(parseInt(phone) ? { phone: parseInt(phone) } : {}),
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
    this.props.handleClose("about");
  };

  render() {
    const { classes } = this.props;
    const { open, handleClose } = this.props;

    return (
      <div id="profile-about-dialog">
        <Dialog
          open={open}
          onClose={() => handleClose("about")}
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
                  <h3>{data.title.about}</h3>
                </div>
                <IconButton onClick={() => handleClose("about")} className="p_d_close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="p_d_content_in">
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.profileDOB}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.dob}</p>
                  </div>
                  <div className="flex">
                    <select
                      className="p_d_select p_d_width_half"
                      name="month"
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.month}
                    >
                      <option value="">Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">November</option>
                    </select>

                    <input
                      type="number"
                      className="p_d_select p_d_width_quarter"
                      min="1"
                      max="31"
                      placeholder="Date"
                      name="date"
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.date}
                    />
                    <input
                      type="number"
                      className="p_d_select p_d_width_quarter"
                      name="year"
                      placeholder="Year"
                      defaultValue={this.props.profile.year}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.location}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.location}</p>
                  </div>
                  <div className="flex">
                    <select
                      className="p_d_select p_d_width_half"
                      name="country"
                      defaultValue={this.props.profile.country_id}
                      onChange={this.handleChange}
                    >
                      <option value="">Country</option>
                      {this.props.profile.allCountries.map((elmt) => (
                        <option key={elmt.code} id={elmt.code} value={elmt.id}>
                          {elmt.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="p_d_select p_d_width_half"
                      placeholder="State"
                      name="state"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="p_d_img"
                      src={require(`../../../assets/images/icons/${data.images.contact}`)}
                      alt=""
                    />
                    <p className="p_d_title">{data.inputLabel.contact}</p>
                  </div>
                  <div className="flex relative">
                    <div className="flex p_d_number ">+91</div>
                    <input
                      type="text"
                      className="p_d_select p_d_width_half"
                      placeholder="xxxxxxxxxxxxx"
                      name="phone"
                      title="10 digit mobile number"
                      pattern={this.state.phone ? "[0-9]{10}" : ""}
                      onChange={this.handleChange}
                      defaultValue={this.props.profile.phone}
                      style={{ paddingLeft: "15px" }}
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
              <IconButton onClick={() => handleClose("about")}>
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
export default withStyles(useStyles)(AboutDialog);
