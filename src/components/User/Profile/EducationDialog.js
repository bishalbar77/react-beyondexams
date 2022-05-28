import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import ProfileEducation from "../../../assets/images/icons/profile-education.jpg";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import Info from "../../../assets/images/icons/profile-info.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Add from "../../../assets/images/icons/profile-plus-circle.jpg";
// import Group from "../../../assets/images/icons/Group_298.png";
// import ProfileEducationTwo from "../../../assets/images/icons/profile-education-two.jpg";
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
class ProfileDialog extends Component {
  state = {
    education_standard: this.props.profile.education_standard,
    initial_length: this.props.profile.education_standard.length,
    loading: false,
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let institute_arr = [];
    let class_arr = [];
    for (let i = this.state.initial_length; i < this.state.education_standard.length; i++) {
      institute_arr.push(this.state.education_standard[i].institute_name.name);
      class_arr.push(this.state.education_standard[i].standard_name.name);
    }
    if (institute_arr.length) {
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserProfile}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          education_standard: class_arr,
          education_institute: institute_arr,
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });
    }
    let ids = [];
    let institute = [];
    let standard = [];
    const values = JSON.parse(JSON.stringify(this.state.education_standard));
    for (let i = 0; i < values.length; i++) {
      if (values[i].update === 1) {
        ids.push(values[i].institutes_id);
        institute.push(values[i].institute_name.name);
        standard.push(values[i].standard_name.name);
      }
    }
    if (ids.length) {
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateEducation}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          education_standard_ids: ids,
          education_standards: standard,
        },
      })
        .then((data) => {
          console.log("education standard update", data);
        })
        .catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });

      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateEduInstitute}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          education_institute_ids: ids,
          education_institutes: institute,
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });
    }
    await this.props.update();
    this.setState({ loading: false });
    this.handleClose();
  };

  handleAdd = () => {
    let values = JSON.parse(JSON.stringify(this.state.education_standard));
    console.log(values);
    values.push({
      idx: Math.random(),
      standard_name: { name: null },
      institute_name: { institute_name: null },
    });
    this.setState({ education_standard: values });
  };

  handleRemove = async (e, i) => {
    swal("Delete", "Are you sure you want to delete this item ?", "warning", { buttons: true }).then(async (ok) => {
      if (ok) {
        if (e) {
          await axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.deleteEducation}=${e}`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${getLocal("access_token")}`,
              Accept: "application/json;charset=UTF-8",
            },
          })
            .then((data) => {
              this.props.update();
            })
            .catch((e) => {
              console.log(e);
              swal("Error", e.response.data.message, "error");
            });
        } else {
          let values = JSON.parse(JSON.stringify(this.state.education_standard));
          values.splice(i, 1);
          this.setState({ education_standard: values });
        }
      }
    });
  };

  handleChange = (e, index, id) => {
    const values = JSON.parse(JSON.stringify(this.state.education_standard));
    if (id) {
      values[index].update = 1;
    }
    if (e.target.name === "class") {
      values[index].standard_name.name = e.target.value;
    } else {
      values[index].institute_name.name = e.target.value;
    }
    this.setState({ education_standard: values });
  };
  componentDidMount = () => {
    if (this.props.profile.education_standard.length === 0) {
      this.handleAdd();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.profile.education_standard !== this.props.profile.education_standard) {
      this.setState({
        education_standard: this.props.profile.education_standard,
        initial_length: this.props.profile.education_standard.length,
      });
    }
  };
  handleClose = () => {
    if (this.props.profile.education_standard.length > 0) {
      this.setState({
        education_standard: this.props.profile.education_standard,
        initial_length: this.props.profile.education_standard.length,
      });
    }
    this.props.handleClose("education");
  };
  render() {
    const { classes } = this.props;
    const { open } = this.props;
    return (
      this.state.education_standard && (
        <div>
          <Dialog open={open} onClose={this.handleClose} classes={{ paper: classes.paper }} maxWidth="lg" scroll="body">
            <div className="flex-only p_d_div">
              <div className="p_d_content">
                <div className="flex space-between">
                  <div className="flex">
                    <img
                      src={require(`../../../assets/images/icons/${data.images.profileEducation}`)}
                      className="p_d_img"
                      alt=""
                    />
                    <h3>{data.title.education}</h3>
                  </div>
                  <IconButton onClick={this.handleClose} className="p_d_close">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
                <form onSubmit={this.handleSubmit}>
                  <div>
                    <div className="p_d_content_in">
                      {this.state.education_standard.map((e, index) => (
                        <div key={e.id ? e.id : e.idx}>
                          <div className="flex">
                            <div>
                              <div className="flex">
                                <img
                                  className="p_d_img"
                                  src={require(`../../../assets/images/icons/${data.images.profileEducationTwo}`)}
                                  alt=""
                                />
                                <p className="p_d_title">{data.inputLabel.classOrDegree}</p>
                              </div>
                              <input
                                type="text"
                                name="class"
                                className="p_d_select p_d_edu_width_half"
                                placeholder="eg class 8"
                                defaultValue={e.standard_name.name}
                                onChange={(event) => this.handleChange(event, index, e.id)}
                                required
                              />
                            </div>
                            <div>
                              <div className="flex">
                                <p className="p_d_title">{data.inputLabel.schoolOrInstitute}</p>
                              </div>
                              <input
                                type="text"
                                name="school"
                                className="p_d_select p_d_edu_width_half"
                                placeholder="Xyz School"
                                defaultValue={e.institute_name.name}
                                onChange={(event) => this.handleChange(event, index, e.id)}
                                required
                              />
                            </div>
                          </div>
                          <p className="p_d_remove_cert" onClick={() => this.handleRemove(e.id, index)}>
                            {data.buttons.remove}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p_d_content_in">
                      <div className="flex p_d_info">
                        <img
                          className="p_d_img"
                          src={require(`../../../assets/images/icons/${data.images.info}`)}
                          alt=""
                        />
                        <p className="p_d_title">{data.title.info}</p>
                      </div>
                      <div className="flex">
                        <button className="p_d_add_btn" onClick={this.handleAdd} type="button">
                          <img
                            className="p_d_img"
                            src={require(`../../../assets/images/icons/${data.images.add}`)}
                            alt=""
                          />
                          {data.buttons.addField}
                        </button>
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
                    </div>
                  </div>
                </form>
              </div>

              <div className="p_d_ill relative">
                <IconButton onClick={this.handleClose}>
                  <CloseIcon className={classes.closeIcon} fontSize="small" />
                </IconButton>
                <img className="p_d_group" src={require(`../../../assets/images/icons/${data.images.group}`)} alt="" />
              </div>
            </div>
          </Dialog>
        </div>
      )
    );
  }
}
export default withStyles(useStyles)(ProfileDialog);
