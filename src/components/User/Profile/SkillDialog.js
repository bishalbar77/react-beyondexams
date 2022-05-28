import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import "../../../assets/css/User/Profile/profile_dialog.css";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import Info from "../../../assets/images/icons/profile-info.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Group from "../../../assets/images/icons/Group_298.png";
// import ProfileSkills from "../../../assets/images/icons/profile-skills.jpg";
// import ProfileStar from "../../../assets/images/icons/profile-star.jpg";
// import Add from "../../../assets/images/icons/profile-plus-circle.jpg";
import Slider from "@material-ui/core/Slider";
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
class SkillDialog extends Component {
  state = {
    domains: this.props.profile.domains,
    initial_length: this.props.profile.domains.length,
    loading: false,
  };
  componentDidMount = () => {
    if (this.props.profile.domains.length === 0) {
      this.handleAdd();
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let domain_arr = [];
    let experience_arr = [];
    for (let i = this.state.initial_length; i < this.state.domains.length; i++) {
      domain_arr.push(this.state.domains[i].name);
      experience_arr.push(parseInt(this.state.domains[i].pivot.experience));
    }

    if (domain_arr.length) {
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserProfile}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          skill_name: domain_arr,
          skill_experience: experience_arr,
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

    let domains = JSON.parse(JSON.stringify(this.state.domains));
    let skill_ids = [];
    let skill_names = [];
    let skill_experiences = [];
    for (let i = 0; i < domains.length; i++) {
      if (domains[i].update === 1) {
        skill_ids.push(this.state.domains[i].id);
        skill_names.push(this.state.domains[i].name);
        skill_experiences.push(parseInt(this.state.domains[i].pivot.experience));
      }
    }

    if (skill_ids.length) {
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateUserSkill}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          skill_ids: skill_ids,
          skill_names: skill_names,
          skill_experiences: skill_experiences,
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

  handleRemove = async (id, i) => {
    swal("Delete", "Are you sure you want to delete this item ?", "warning", { buttons: true }).then(async (ok) => {
      if (ok) {
        if (id) {
          //checks if a valid field by existence of id
          await axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.deleteSkill}=${id}`,
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
          //else if an empty field made by addd button
          let values = JSON.parse(JSON.stringify(this.state.domains));
          values.splice(i, 1);
          this.setState({ domains: values });
        }
      }
    });
  };

  handleAdd = () => {
    let values = JSON.parse(JSON.stringify(this.state.domains));
    values.push({ name: "", pivot: { experience: 3 }, idx: Math.random() });
    this.setState({ domains: values });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.profile.domains !== this.props.profile.domains) {
      this.setState({
        domains: this.props.profile.domains,
        initial_length: this.props.profile.domains.length,
      });
    }
  };

  handleChangeExp = (e, value, index, id) => {
    let values = JSON.parse(JSON.stringify(this.state.domains));
    values[index].pivot.experience = value;
    if (id) {
      values[index].update = 1;
    }
    this.setState({ domains: values });
  };
  handleChange = (e, index, id) => {
    let values = JSON.parse(JSON.stringify(this.state.domains));
    values[index].name = e.target.value;
    if (id) {
      values[index].update = 1;
    }
    this.setState({ domains: values });
  };
  labelFormat = (e) => {
    if (e === 1) {
      return "Novice";
    } else if (e === 2) return "Beginner";
    else if (e === 3) return "Intermediate";
    else if (e === 4) return "Awesome";
    else return "Expert";
  };
  handleClose = () => {
    if (this.props.profile.domains.length > 0) {
      this.setState({
        domains: this.props.profile.domains,
        initial_length: this.props.profile.domains.length,
      });
    }
    this.props.handleClose("skills");
  };

  render() {
    const { classes } = this.props;
    const { open } = this.props;
    return (
      this.state.domains && (
        <div>
          <Dialog open={open} onClose={this.handleClose} classes={{ paper: classes.paper }} maxWidth="lg" scroll="body">
            <div className="flex-only p_d_div">
              <div className="p_d_content">
                <div className="flex space-between">
                  <div className="flex">
                    <img
                      src={require(`../../../assets/images/icons/${data.images.profileSkills}`)}
                      className="p_d_img"
                      alt=""
                    />
                    <h3>{data.title.skills}</h3>
                  </div>
                  <IconButton onClick={this.handleClose} className="p_d_close">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
                <form onSubmit={this.handleSubmit}>
                  <div className="p_d_content_in">
                    {this.state.domains.map((e, index) => (
                      <div key={e.id ? e.id : e.idx}>
                        <div className="flex p_d_width_full">
                          <img
                            className="p_d_img"
                            src={require(`../../../assets/images/icons/${data.images.profileStar}`)}
                            alt=""
                          />
                          <p className="p_d_title">{`${data.inputLabel.skill} ` + (parseInt(index) + 1)}</p>
                          <p className="p_d_remove" onClick={() => this.handleRemove(e.id, index)}>
                            {data.buttons.remove}
                          </p>
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            className="p_d_select p_d_width_full"
                            defaultValue={e.name}
                            placeholder="eg. Photoshop"
                            name="name"
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            required
                          />
                        </div>
                        <div className="p_d_width_full" id="p_d_slider">
                          <Slider
                            key={index}
                            defaultValue={parseInt(e.pivot.experience)}
                            valueLabelDisplay="auto"
                            step={1}
                            min={1}
                            max={5}
                            className="p_d_slider_one"
                            name="experience"
                            onChange={(event, value) => this.handleChangeExp(event, value, index, e.id)}
                            valueLabelFormat={this.labelFormat}
                          />
                        </div>
                      </div>
                    ))}

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
export default withStyles(useStyles)(SkillDialog);
