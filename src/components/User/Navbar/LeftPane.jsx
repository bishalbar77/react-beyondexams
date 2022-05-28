import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { getLocal, setLocal } from "../../common/localStorageAccess";
import axios from "axios";
import baseDomain from "../../common/baseDomain";
import { ReactComponent as CourseIcon } from "../../../assets/images/icons/nav-course.svg";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";
import { ReactComponent as ProfileSwitch } from "../../../assets/images/icons/switch-profile.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/images/icons/logout.svg";
import { ReactComponent as EditProfile } from "../../../assets/images/icons/edit.svg";
import { ReactComponent as ArrowLeftCricle } from "../../../assets/images/icons/arrow-left-circle.svg";
import { ReactComponent as UserCheck } from "../../../assets/images/icons/user-check.svg";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Feedback from "../../../assets/images/icons/feedback.svg";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withRouter } from "react-router-dom";
import "../../../assets/css/User/Navbar/LeftPane.css";
import firebase from "../../common/init-fcm";
import "firebase/auth";
import { withStyles } from "@material-ui/core/styles";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Post } from "../../common/common";
import { connect } from "react-redux";

// Logout backdrop circle
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import KeyIcon from "../../../assets/images/icons/key.svg";
import ShareIcon from "@material-ui/icons/Share";

var jsonData = require("./nav.json");

const styles = (theme) => ({
  accordian: {
    borderRadius: "10px !important",
    boxShadow: "none !important",
    backgroundColor: "white",
    margin: "0px !important",
  },
  accordianSummary: {
    margin: "0px !important",
    "& .MuiAccordionSummary-content": {
      margin: "0 0 0 4px !important",
    },
  },
  accordianDetails: {
    padding: "0px 5px 0px 5px !important",
    width: "100%",
  },
  LeftPaneContent: {
    background: "white",
    "&:hover": {
      background: "white",
    },
  },
  normalItem: {
    marginLeft: "19px !important",
  },
  hideArrow: {
    "& .MuiAccordionSummary-expandIcon": {
      display: "none !important",
    },
  },
  openedIcon: {
    margin: "0px 8px !important",
  },
  hoverClose: {
    "&:hover": {
      background: "white",
    },
  },
});

const useStyles2 = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

class UserLeftPane extends Component {
  state = {
    isCollapsed: false,
    open: false,
    name: null,
    email: null,
    message: null,
    role: "",
    activeTab: "",
    user: {
      avatar: "",
    },
    isDesktopBarOpened: false,
    boxOpen: false,
    classes: "",
    openLoading: false,
  };
  leftPaneNav = [
    {
      location: "/explore-by-topics",
      className: "",
      content: "Courses",
      imageSrc: <CourseIcon />,
    },
    localStorage.getItem("access_token")
      ? {
          location: "/dashboard/history",
          className: "",
          content: "Video History",
          imageSrc: <HistoryRoundedIcon style={{ fontSize: "18px" }} />,
        }
      : {},
    {
      location: "/create-your-own-course",
      className: "",
      content: "Create a course",
      imageSrc: <AddCircleOutlineIcon style={{ fontSize: "18px" }} />,
    },
  ];

  handleClose = () => {
    this.setState({ openLoading: false });
  };

  toggleDesktopProfile = () => {
    this.setState({ boxOpen: !this.state.boxOpen });
  };

  handleClickAway = () => {
    this.setState({ boxOpen: false });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/submit_feedback`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      },
    }).then(() => {
      swal("Success", "Feedback added successfully", "success");
      this.setState({
        open: false,
      });
    });
  };

  toggleCollapse = () => {
    this.props.toggleLeftNavCollapsed();
    setLocal("isCollapsed", !this.state.isCollapsed);
    this.setState({ isCollapsed: !this.state.isCollapsed });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  logout = () => {
    if (getLocal("access_token")) {
      swal({
        title: "Logout",
        text: "Are You sure to end the current session?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.setState({ openLoading: true });
          axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/logout`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${getLocal("access_token")}`,
              Accept: "application/json;charset=UTF-8",
            },
          }).then(async () => {
            let show_dub = localStorage.getItem("show_dub_tutorial");
            localStorage.clear();
            localStorage.setItem("show_home_tutorial", false);
            if (show_dub === "false") {
              localStorage.setItem("show_dub_tutorial", false);
            }
            localStorage.setItem("show_video_tutorial", false);
            localStorage.setItem("show_browse_tutorial", false);
            await firebase
              .auth()
              .signOut()
              .then(function () {
                // Sign-out successful.
              })
              .catch(function (e) {
                // An error happened.
              });
            window.location.href = "/";
          });
        }
      });
    } else {
      this.props.toggleLeftNav();
      this.props.history.push("/login");
    }
  };

  componentDidMount() {
    let bool = getLocal("isCollapsed") === "true" ? true : false;
    this.setState({ isCollapsed: bool });
    this.setState({ user: { avatar: localStorage.getItem("avatar") } });
    setTimeout(() => {
      this.props.LeftNavCollapsed(bool);
    }, 50);
    let role_id = getLocal("role_id");
    if (role_id === "1") {
      this.setState({ role: "Student" });
    } else if (role_id === "2") {
      this.setState({ role: "Teacher" });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoUrl !== this.props.videoUrl) {
      let lclTerm = this.props.searchTerm;
      if (lclTerm && lclTerm.slice(-1) === "?") {
        lclTerm = lclTerm.slice(0, -1);
      }
      this.setState({ videoQuery: lclTerm });
      this.setState({ videoURL: this.props.videoUrl });
    }
  }

  userSwitch = () => {
    swal({
      title: "Switch your role",
      text: "Are you sure that you want to switch your role?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ openLoading: true });
        Post(0, "verifyFirebaseAccessToken", {
          access_token: localStorage.getItem("uid"),
          role_id: localStorage.getItem("role_id") === "1" ? 2 : 1,
          // request_url: window.location.href,
        }).then((res) => {
          this.setState({ openLoading: false });
          this.props.toggleLeftNav();
          if (localStorage.getItem("role_id") === "1") {
            this.props.showSuccess("You are now logged in as a teacher");
          } else {
            this.props.showSuccess("You are now logged in as a student");
          }
          let data = res.data.data;
          setLocal("access_token", data.access_token);
          setLocal("refresh_token", data.refresh_token);
          setLocal("role_id", localStorage.getItem("role_id") === "1" ? 2 : 1);
          setLocal("name", data.name);
          window.location.reload();
        });
      }
    });
  };

  render() {
    let pageName = window.location.pathname;
    let activeTab = "";
    if (pageName === "/dashboard/browse") {
      activeTab = "Courses";
    } else if (pageName === "/dashboard/videos") {
      activeTab = "Browse";
    } else if (pageName === "/dashboard/history") {
      activeTab = "History";
    } else if (pageName.length >= 18 && pageName.slice(0, 18) === "/dashboard/profile") {
      activeTab = "Profile";
    }

    const { classes } = this.props;

    return (
      <>
        <LoadingLogout handleClose={this.handleClose} open={this.state.openLoading} />
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="feedback-form">{jsonData.dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{jsonData.dialog.contentText}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="E-mail"
              type="email"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="feedback"
              label="Feedback"
              type="text"
              name="message"
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {jsonData.dialog.actions.cancel}
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              {jsonData.dialog.actions.submit}
            </Button>
          </DialogActions>
        </Dialog>

        <div
          className={`LeftPaneContainer-back-overlay ${!this.props.leftNav.isOpened ? "displayNone" : ""}`}
          onClick={this.props.toggleLeftNav}
        />
        <div
          className={`LeftPaneContainer ${!this.props.leftNav.isOpened ? "leftnav-slide-in" : ""}  ${
            this.state.isCollapsed ? "LeftPaneContainer-collapsed scroll" : "scroll"
          }`}
        >
          <div className="LeftPane-content">
            <div>
              <div className="left-navbar-link-hover" onClick={this.toggleCollapse} style={{ margin: "5px 0px" }}>
                <div className="LeftPaneContent">
                  <div className="justify-center collapsingIcon">
                    <div className={`leftpane-content-image ${this.state.isCollapsed ? "minimizeSideBarBefore" : ""}`}>
                      <ArrowLeftCricle />
                    </div>
                  </div>
                </div>
                <div className="left-pane-hover-text">{jsonData.profile.maximize}</div>
              </div>

              {localStorage.getItem("access_token") ? (
                <div className="left-nav-element-display-none">
                  <Accordion className={classes.accordian}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      className={`${classes.accordianSummary} ${this.state.isCollapsed ? classes.hideArrow : ""}`}
                    >
                      <div
                        className={`LeftPaneContent ${activeTab === "Profile" ? "LeftPaneContentActive" : ""} ${
                          classes.LeftPaneContent
                        }`}
                        style={{
                          padding: "0px",
                          margin: "0px",
                        }}
                      >
                        <div className="justify-center">
                          <div
                            className="profile-nav-grid"
                            style={{
                              border: getLocal("role_id") === "1" ? "0.1em solid #6646E7" : "0.1em solid #FF0000",
                            }}
                          >
                            <div
                              className="navbar-profile-image"
                              style={{
                                backgroundImage:
                                  this.state.user.avatar && getLocal("access_token")
                                    ? `url(${this.state.user.avatar})`
                                    : `url(https://cdn0.iconfinder.com/data/icons/social-media-network-4/48/male_avatar-512.png)`,
                              }}
                            >
                              {getLocal("access_token") ? (
                                getLocal("role_id") === "1" ? (
                                  <div className="role-circle-bg">
                                    <div className="role-circle role-circle-student">S</div>
                                  </div>
                                ) : (
                                  <div className="role-circle-bg">
                                    <div className="role-circle role-circle-teacher">T</div>
                                  </div>
                                )
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`justify-center ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}
                          style={{ marginLeft: "3px" }}
                        >
                          {localStorage.getItem("first_name")}
                        </div>
                      </div>
                      <div className="left-pane-hover-text">{jsonData.profile.profile}</div>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordianDetails}>
                      <div style={{ width: "100%" }}>
                        {getLocal("access_token") && (
                          <>
                            <div className={`DesktopProfileBtn ${this.state.isCollapsed ? classes.hoverClose : ""}`}>
                              <div className={`nav-normal-icon ${this.state.isCollapsed ? classes.openedIcon : ""}`}>
                                <div className="profile-desktop-navbar-image">
                                  <img
                                    src={require(`../../../assets/images/icons/${jsonData.images.keyIcon}`)}
                                    alt="key"
                                  />
                                </div>
                              </div>
                              <div
                                className={`${classes.normalItem} ${
                                  this.state.isCollapsed ? "hide-on-collapse" : ""
                                } keys`}
                              >
                                <h2>
                                  {this.props.keys} {jsonData.profile.keys}
                                </h2>
                                <p>{jsonData.profile.unlock}</p>
                              </div>
                            </div>

                            <div
                              className={`DesktopProfileBtn ${this.state.isCollapsed ? classes.hoverClose : ""}`}
                              onClick={() => {
                                this.toggleDesktopProfile();
                                this.props.toggleLeftNav();
                                localStorage.getItem("slug")
                                  ? this.props.history.push("/dashboard/profile/" + localStorage.getItem("slug"))
                                  : this.props.history.push("/dashboard/profile/");
                              }}
                            >
                              <div className={`nav-normal-icon ${this.state.isCollapsed ? classes.openedIcon : ""}`}>
                                <div className="profile-desktop-navbar-image">
                                  <EditProfile />
                                </div>
                              </div>
                              <div
                                className={`${classes.normalItem} ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}
                              >
                                {/* Edit Profile */}
                                {jsonData.profile.dashboard}
                              </div>
                            </div>

                            <div
                              className={`DesktopProfileBtn ${this.state.isCollapsed ? classes.hoverClose : ""}`}
                              onClick={this.userSwitch}
                            >
                              <div className={`nav-normal-icon ${this.state.isCollapsed ? classes.openedIcon : ""}`}>
                                <div className="profile-desktop-navbar-image">
                                  <ProfileSwitch />
                                </div>
                              </div>
                              <div
                                className={`${classes.normalItem} ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}
                              >
                                {jsonData.profile.switchRole}
                              </div>
                            </div>

                            {/* Refer a friend  */}
                            <div
                              className={`DesktopProfileBtn ${this.state.isCollapsed ? classes.hoverClose : ""}`}
                              onClick={() => this.props.history.push("/refer-a-friend")}
                            >
                              <div className={`nav-normal-icon ${this.state.isCollapsed ? classes.openedIcon : ""}`}>
                                <div className="profile-desktop-navbar-image">{/* <ShareIcon /> */}</div>
                              </div>
                              <div
                                className={`${classes.normalItem} ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}
                              >
                                {jsonData.profile.referFriend}
                              </div>
                            </div>
                          </>
                        )}
                        <div
                          className={`DesktopProfileBtn ${this.state.isCollapsed ? classes.hoverClose : ""}`}
                          onClick={this.logout}
                        >
                          <div className={`nav-normal-icon ${this.state.isCollapsed ? classes.openedIcon : ""}`}>
                            <div className="profile-desktop-navbar-image">
                              <LogoutIcon />
                            </div>
                          </div>
                          <div className={`${classes.normalItem} ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}>
                            {getLocal("access_token") ? "Logout" : "Login"}
                          </div>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ) : (
                <>
                  <div className={`left-navbar-link-hover left-nav-element-display-none`} onClick={this.logout}>
                    <div className={`LeftPaneContent`}>
                      <div className="justify-center">
                        <div className="fill-gap-icon">
                          <LogoutIcon />
                        </div>
                      </div>
                      <div className={`justify-center fill-gap ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}>
                        {jsonData.buttons.login}
                      </div>
                    </div>
                  </div>
                  <div className={`left-navbar-link-hover left-nav-element-display-none`} onClick={this.logout}>
                    <div className="LeftPaneContent">
                      <div className="justify-center">
                        <div className="fill-gap-icon">
                          <LogoutIcon />
                        </div>
                      </div>
                      <div className={`justify-center fill-gap ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}>
                        {jsonData.buttons.signup}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {this.leftPaneNav.map(
                (elmt, index) =>
                  elmt?.content && (
                    <Link
                      to={elmt.location}
                      key={`leftPane-${index}`}
                      className={`left-navbar-link-hover ${elmt.className}`}
                      onClick={this.props.toggleLeftNav}
                    >
                      <div className={`LeftPaneContent ${activeTab === elmt.content ? "LeftPaneContentActive" : ""}`}>
                        <div className="fill-gap-icon">{elmt.imageSrc}</div>
                        <div className={`justify-center fill-gap ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}>
                          {elmt.content}
                        </div>
                      </div>
                    </Link>
                  )
              )}
              <a
                href="https://www.notion.so/Beyond-Exams-Wiki-68051f0aa3ad4cd681ec95a113fa92fd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="LeftPaneContent">
                  <div className="fill-gap-icon">
                    <UserCheck />
                  </div>
                  <div className={`justify-center fill-gap ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}>
                    {jsonData.buttons.involve}
                  </div>
                </div>
              </a>
            </div>

            <div
              onClick={this.handleClickOpen}
              className={`LeftNavPremium ${this.state.isCollapsed ? "hide-on-collapse" : ""}`}
            >
              <img alt="" src={require(`../../../assets/images/icons/${jsonData.images.feedback}`)} loading="lazy" />
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStatesToProps = (state) => {
  return {
    keys: state.browse.keys,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (message) =>
      dispatch({
        type: "SHOW_SUCCESS",
        message,
      }),
  };
};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withRouter(UserLeftPane)));

function LoadingLogout({ handleClose, open }) {
  const classes = useStyles2();

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
