// Logout backdrop circle
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import "firebase/auth";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import swal from "sweetalert";
import { getAllCategories, getUserBadges, getUserKeys } from "../../../actions/browseActions";
import { getSchool } from "../../../actions/utilActions";
import "../../../assets/css/User/Navbar/dashboardNavBar.css";
import logo from "../../../assets/images/icons/beyond-exams-logo.svg";
import { ReactComponent as KeyIcon } from "../../../assets/images/icons/key.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/images/icons/logout.svg";
import Relieved from "../../../assets/images/icons/relieved_laughter.png";
import { ReactComponent as SwitchProfile } from "../../../assets/images/icons/switch-profile.svg";
import { ReactComponent as UserCheck } from "../../../assets/images/icons/user-check.svg";
import baseDomain from "../../common/baseDomain";
import { Post } from "../../common/common";
import firebase from "../../common/init-fcm";
import { getLocal, setLocal } from "../../common/localStorageAccess";
// import ActionItem from "./ActionItem";

var provider = new firebase.auth.GoogleAuthProvider();
var jsonData = require("./nav.json");

const useStyles2 = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

class UserNavbar extends Component {
  state = {
    user: {
      avatar: "",
    },
    isDesktopBarOpened: false,
    displayInput: false,
    search: "",
    words: [],
    open: false,
    actionItem: false,
    name: "",
    email: "",
    message: "",
    feedbackOpen: false,
  };

  handleClose = () => {
    this.setState({ open: false });
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
          this.setState({ open: true });
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
                // this.setState({open:false})
              })
              .catch(function (e) {
                // An error happened.
                // this.setState({open:false})
              });
            window.location.href = "/";
          });
        }
      });
    } else {
      this.props.history.push("/login");
    }
  };

  toggleDesktopProfile = () => {
    this.setState((prevState) => ({
      isDesktopBarOpened: !prevState.isDesktopBarOpened,
    }));
  };

  showDesktopProfile = () => {
    this.setState({ isDesktopBarOpened: true });
  };

  hideDesktopProfile = () => {
    this.setState({ isDesktopBarOpened: false });
  };

  async componentDidMount() {
    axios
      .get(`${baseDomain.route}${baseDomain.subRoute}/get_daily_top_searched_results`)
      .then((res) => {
        let response = res.data.data;
        this.setState({ words: response.slice(0, 9) });
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });

    if (localStorage.getItem("access_token") && localStorage.getItem("slug")) {
      this.props.getUserKeys();
    }
    let subDomain = window.location.host.split(".")[0];
    let condition = subDomain === "morethanmarks";
    if (!this.props.school && condition) {
      this.props.getSchool();
    }
  }

  handleClickAway = () => {
    if (this.state.displayInput) {
      this.setState({
        displayInput: false,
      });
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    if (!this.state.displayInput) {
      document.getElementById("nav-search").focus();
      this.setState({
        displayInput: true,
      });
    } else {
      if (this.state.search) {
        axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/add_search_term`,
          method: "POST",
          data: {
            search_term: this.state.search,
          },
        }).catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });
        this.props.history.push("/dashboard/search?q=" + encodeURIComponent(this.state.search).replace(/%20/g, "+"));
        this.setState({
          displayInput: false,
        });
      }
    }
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
        feedbackOpen: false,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  bgColor = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "bg-color-green";
    } else if (num === 1) {
      return "bg-color-blue";
    } else if (num === 2) {
      return "bg-color-yellow";
    }
    // else return "bg-color-red";
  };

  color = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "color-green";
    } else if (num === 1) {
      return "color-blue";
    } else if (num === 2) {
      return "color-yellow";
    }
    // else return "color-red";
  };

  redirect = (word) => {
    this.props.history.push("/dashboard/search?q=" + encodeURIComponent(word).replace(/%20/g, "+"));
    this.setState({
      displayInput: false,
    });
  };

  userSwitch = () => {
    swal({
      title: "Switch your role",
      text: "Are you sure that you want to switch your role?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ open: true });
        Post(0, "verifyFirebaseAccessToken", {
          access_token: localStorage.getItem("uid"),
          role_id: localStorage.getItem("role_id") === "1" ? 2 : 1,
          // request_url: window.location.href,
        }).then((res) => {
          this.setState({ open: false });
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

  handleCreateCourse = () => {
    if (localStorage.getItem("role_id") === "1") {
      swal({
        title: "Login as a teacher",
        text: "You need to login as a teacher to continue creating a course",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.setState({ open: true });
          Post(0, "verifyFirebaseAccessToken", {
            access_token: localStorage.getItem("uid"),
            role_id: 2,
            // request_url: window.location.href,
          }).then((res) => {
            this.setState({ open: false });
            localStorage.setItem("coc", true);
            this.props.showSuccess("You are now logged in as a teacher");
            let data = res.data.data;
            setLocal("access_token", data.access_token);
            setLocal("refresh_token", data.refresh_token);
            setLocal("role_id", 2);
            setLocal("name", data.name);
            window.location.href = "/add-new-course/0/1/topics/1";
          });
        }
      });
    } else {
      swal({
        title: "Log in to continue",
        text: "You need to login as a teacher to continue creating a course",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
              setLocal("access_specifier", "google");
              setLocal("uid", result.user.uid);
              setLocal("google_access_token", result.credential.accessToken);
              setLocal("first_name", result.additionalUserInfo.profile.given_name);
              setLocal("last_name", result.additionalUserInfo.profile.family_name);
              setLocal("email", result.user.email);
              setLocal("unique_id", result.additionalUserInfo.profile.id);
              setLocal("avatar", result.user.photoURL);
              this.setState({ open: true });
              Post(0, "verifyFirebaseAccessToken", {
                access_token: result.user.uid,
                role_id: 2,
                // request_url: window.location.href,
              }).then((res) => {
                this.setState({ open: false });
                localStorage.setItem("coc", true);
                this.props.showSuccess("You are now logged in as a teacher");
                let data = res.data.data;
                setLocal("access_token", data.access_token);
                setLocal("refresh_token", data.refresh_token);
                setLocal("role_id", 2);
                setLocal("name", data.name);
                window.location.href = "/add-new-course/0/1/topics/1";
              });
            });
        }
      });
    }
  };

  removeNotification = (e) => {
    e.target.style.display = "none";
  };

  render() {
    let input = this.state.displayInput;
    const { userBadges, school } = this.props;
    let subDomain = window.location.host.split(".")[0];
    let condition = subDomain !== "morethanmarks";

    return (
      <>
        <LoadingLogout handleClose={this.handleClose} open={this.state.open} />
        <Dialog
          open={this.state.feedbackOpen}
          onClose={() => {
            this.setState({ feedbackOpen: false });
          }}
          aria-labelledby="form-dialog-title"
        >
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
              id="message"
              label="Feedback"
              type="text"
              name="message"
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ feedbackOpen: false });
              }}
              color="primary"
            >
              {jsonData.dialog.actions.cancel}
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              {jsonData.dialog.actions.submit}
            </Button>
          </DialogActions>
        </Dialog>
        {input && <div className="nav-overlay" onClick={this.handleClickAway} />}

        <div className={`navbar ${this.props.browseTourActive ? " nav-relative" : ""}`}>
          <div className="notificationBox animateNotify" id="notificationBox" onClick={this.removeNotification}>
            <p id="notificationText"></p>
          </div>

          {!input && (
            <div className="respNav" onClick={this.props.toggleLeftNav}>
              <MenuIcon />
            </div>
          )}
          <div className="nav-logo">
            <Link to="/">
              {condition ? (
                <div className="navbar-logo justify-center" style={{ backgroundImage: `url(${logo})` }}></div>
              ) : (
                school && (
                  <div
                    className="navbar-logo justify-center"
                    style={{ backgroundImage: `url(${school.data.logo})` }}
                  ></div>
                )
              )}
            </Link>
          </div>
          {!input && (
            <div className={this.state.displayInput ? "nav-logo-m-inactive" : "nav-logo-m"}>
              <Link to="/">
                <div className="navbar-logo-m justify-center"></div>
              </Link>
            </div>
          )}

          <div className={this.state.displayInput ? "Nav-div-active" : "Nav-div"}>
            <div className={`Nav-search ${localStorage.getItem("access_token") ? "Nav-search-authorised" : ""}`}>
              <form
                onSubmit={this.handleClick}
                className={input ? " searchForm searchForm-active" : "searchForm"}
                data-tut="search"
              >
                <div className={`searchBox ${input ? "searchBox-active" : ""}`}>
                  <input
                    className={`searchInput ${input ? "searchInput-active" : ""}`}
                    type="text"
                    name="search"
                    id="nav-search"
                    autoComplete="off"
                    placeholder="What do you want to learn today?"
                    onChange={this.handleChange}
                  />

                  <IconButton
                    onClick={this.handleClickAway}
                    className={this.state.displayInput ? "" : "hide-on-collapse"}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  <button type="submit" className="searchButton" onClick={this.handleClick}>
                    <SearchIcon />
                  </button>
                </div>
              </form>
              {!this.state.displayInput && (
                <>
                  <Link to="/explore-by-topics" className="nav_course nav_link nav_signup" data-tut="dashboard">
                    {jsonData.buttons.courses}
                  </Link>
                  <div className="action-item"></div>
                  {/* <div className="action-item">
                    <div
                      className="a_i_main"
                      onMouseEnter={() => {
                        this.setState({ actionItem: true });
                      }}
                      onMouseLeave={() => {
                        this.setState({ actionItem: false });
                      }}
                    >
                      <div className="a_i_main_left">
                        <img
                          src={require(`../../../assets/images/icons/${jsonData.images.relieved}`)}
                          alt=""
                          width="18"
                          height="18"
                        ></img>
                        <p className="nav_link">
                          {localStorage.getItem("access_token")
                            ? localStorage.getItem("role_id") === "1"
                              ? userBadges?.student.student_details.badge.badge
                              : userBadges?.educator.educator_details.badge.badge
                            : userBadges?.student.student_details.badge.badge}
                        </p>
                      </div>
                      {this.state.actionItem ? (
                        <ExpandLessIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({ actionItem: false });
                          }}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({ actionItem: true });
                          }}
                        />
                      )}
                       {this.props.userBadges && (
                        <ActionItem actionItem={this.state.actionItem} data={this.props.userBadges} />
                      )} 
                    </div>
                  </div> */}
                  <div className="nav-right">
                    {localStorage.getItem("role_id") === "2" ? (
                      <Link
                        to="/add-new-course/0/1/topics/1"
                        className="nav_course nav_link"
                        onClick={() => {
                          localStorage.setItem("coc", true);
                        }}
                      >
                        {jsonData.buttons.createCourse}
                      </Link>
                    ) : (
                      <p className="nav_course nav_link" onClick={this.handleCreateCourse}>
                        {jsonData.buttons.createCourse}
                      </p>
                    )}

                    {!localStorage.getItem("access_token") && (
                      <>
                        <a
                          href="https://www.notion.so/Beyond-Exams-Wiki-68051f0aa3ad4cd681ec95a113fa92fd"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nav_course nav_link"
                        >
                          {jsonData.buttons.involve}
                        </a>
                        <Link to="/login" className="nav_course nav_link" data-tut="login">
                          {jsonData.buttons.login}
                        </Link>
                        <Link to="/login" className="nav_course nav_link nav_signup">
                          {jsonData.buttons.signup}
                        </Link>
                      </>
                    )}
                    {/* <Link to="/explore-by-classes" className="nav_link">
                      My Dashboard
                    </Link> */}
                  </div>
                </>
              )}
            </div>
            {getLocal("access_token") && (
              <ClickAwayListener
                onClickAway={() => {
                  if (this.state.isDesktopBarOpened) this.hideDesktopProfile();
                }}
              >
                <div
                  className="Nav"
                  onMouseLeave={this.hideDesktopProfile}
                  onClick={this.showDesktopProfile}
                  onMouseEnter={this.showDesktopProfile}
                >
                  <div className={`profileNavBtn ${this.state.isDesktopBarOpened ? "profileNavBtnBack" : ""}`}>
                    <div
                      className="profile-nav-grid"
                      style={{
                        border: getLocal("role_id") === "1" ? "0.1em solid #6646E7" : "0.1em solid #FF0000",
                      }}
                    >
                      <div
                        className="navbar-profile-image"
                        style={{
                          backgroundImage: getLocal("access_token")
                            ? `url(${getLocal("avatar")})`
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
                  <div className={`DesktopProfileViewer ${!this.state.isDesktopBarOpened ? "displayNone" : ""}`}>
                    {getLocal("access_token") && (
                      <>
                        {getLocal("role_id") === "1" ? (
                          <div className="nav-profile-bg nav-profile-student">
                            <div className="nav-profile">{jsonData.profile.student}</div>
                          </div>
                        ) : (
                          <div className="nav-profile-bg nav-profile-teacher">
                            <div className="nav-profile">{jsonData.profile.teacher}</div>
                          </div>
                        )}
                        <Link
                          to={
                            localStorage.getItem("slug")
                              ? "/dashboard/profile/" + localStorage.getItem("slug")
                              : "/dashboard/profile/"
                          }
                        >
                          <div className="nav-profile-info DesktopProfileBtn">
                            <div className="nav-profile-item">
                              <div className={`profile-nav-grid ${getLocal("role_id") === "1" ? "bo_blue" : "bo_red"}`}>
                                <div
                                  className="navbar-profile-image"
                                  style={{
                                    backgroundImage: getLocal("access_token")
                                      ? `url(${getLocal("avatar")})`
                                      : `url(https://cdn0.iconfinder.com/data/icons/social-media-network-4/48/male_avatar-512.png)`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="nav-profile-item">
                              <div className="nav-profile-info-right">
                                <div className="nav-profile-info-name">Hi {localStorage.getItem("name")}!</div>
                                <div className="nav-profile-info-email">{jsonData.profile.goToDashboard}</div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="nav-hr"></div>

                        <a
                          href="https://beyondexams.notion.site/BeyondExam-Keys-d5e9f46aa96e4406a53e4bdf04c34366"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="DesktopProfileBtn">
                            <div className="nav-normal-icon">
                              <div className="profile-desktop-navbar-image">
                                <KeyIcon />
                              </div>
                            </div>
                            <div className="nav-normal-item keys">
                              <h2>
                                {this.props.keys} {jsonData.profile.keys}
                              </h2>
                              <p>{jsonData.profile.unlock}</p>
                            </div>
                          </div>
                        </a>

                        {/* refer a friend  */}

                        {localStorage.getItem("access_token") && (
                          <>
                            <div className="nav-hr"></div>
                            <Link to="/refer-a-friend">
                              <div className="DesktopProfileBtn">
                                <div className="nav-normal-icon">
                                  <div className="profile-desktop-navbar-image">{/* <ShareIcon size="small" /> */}</div>
                                </div>
                                <div className="nav-normal-item">{jsonData.profile.referFriend}</div>
                              </div>
                            </Link>
                          </>
                        )}

                        <div className="nav-hr"></div>
                        <div className="DesktopProfileBtn" onClick={this.userSwitch}>
                          <div className="nav-normal-icon">
                            <div className="profile-desktop-navbar-image">
                              <SwitchProfile />
                            </div>
                          </div>
                          <div className="nav-normal-item">{jsonData.profile.switchRole}</div>
                        </div>
                        <div className="nav-hr"></div>
                        <Link to="/dashboard/history">
                          <div className="DesktopProfileBtn">
                            <div className="nav-normal-icon">
                              <div className="profile-desktop-navbar-image">
                                <HistoryRoundedIcon style={{ fontSize: "18px" }} />
                              </div>
                            </div>
                            <div className="nav-normal-item">{jsonData.profile.videoHistory}</div>
                          </div>
                        </Link>
                      </>
                    )}

                    <Link to="/create-your-own-course">
                      <div className="DesktopProfileBtn">
                        <div className="nav-normal-icon">
                          <div className="profile-desktop-navbar-image">
                            <AddCircleOutlineIcon style={{ fontSize: "18px" }} />
                          </div>
                        </div>
                        <div className="nav-normal-item">{jsonData.profile.createCourse}</div>
                      </div>
                    </Link>
                    <div className="nav-hr"></div>
                    <div
                      className="DesktopProfileBtn"
                      onClick={() => {
                        this.setState({ feedbackOpen: true });
                      }}
                    >
                      <div className="nav-normal-icon">
                        <div className="profile-desktop-navbar-image">
                          <HelpOutlineIcon style={{ fontSize: "18px" }} />
                        </div>
                      </div>
                      <div className="nav-normal-item">{jsonData.profile.helpDesk}</div>
                    </div>
                    <a
                      href="https://www.notion.so/Beyond-Exams-Wiki-68051f0aa3ad4cd681ec95a113fa92fd"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="DesktopProfileBtn">
                        <div className="nav-normal-icon">
                          <div className="profile-desktop-navbar-image">
                            <UserCheck />
                          </div>
                        </div>
                        <div className="nav-normal-item">{jsonData.profile.involve}</div>
                      </div>
                    </a>
                    <div className="nav-hr"></div>

                    <div className="DesktopProfileBtn" onClick={this.logout}>
                      <div className="nav-normal-icon">
                        <div className="profile-desktop-navbar-image">
                          <LogoutIcon />
                        </div>
                      </div>
                      <div className="nav-normal-item">{getLocal("access_token") ? "Logout" : "Login"}</div>
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            )}
          </div>
        </div>

        {input && (
          <div className="nav-most-search">
            <p>{jsonData.searchInput.topSearch}</p>
            <div className="most-searched" data-tut="popular">
              {this.state.words.map((word, index) => (
                <div
                  key={index}
                  className="flex"
                  onClick={() => {
                    this.redirect(word.search_term.search_term);
                  }}
                >
                  <div className={this.bgColor(index) + " most-searched-word"}>{word.search_term.search_term}</div>
                  <div className={this.color(index) + " most-searched-count"}>
                    <p>{word.count}</p>
                    <p>{jsonData.searchInput.searchers}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
}
const mapStatesToProps = (state) => {
  return {
    allCategories: state.browse.allCategories,
    userBadges: state.browse.userBadges,
    keys: state.browse.keys,
    school: state.util.school,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCategories: () => dispatch(getAllCategories()),
    getUserBadges: () => dispatch(getUserBadges()),
    getUserKeys: () => dispatch(getUserKeys()),
    getSchool: () => dispatch(getSchool()),
    showSuccess: (message) =>
      dispatch({
        type: "SHOW_SUCCESS",
        message,
      }),
  };
};
export default connect(mapStatesToProps, mapDispatchToProps)(withRouter(UserNavbar));

function LoadingLogout({ handleClose, open }) {
  const classes = useStyles2();

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
