import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import axios from "axios";
import FroalaEditor from "froala-editor";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/plugins/align.min.js";
import IframeResizer from "iframe-resizer-react";
import { Steps } from "intro.js-react";
import React, { Component, lazy, Suspense } from "react";
import "react-magic-slider-dots/dist/magic-dots.css";
import Dropdown from "react-multilevel-dropdown";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import SliderDots from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import swal from "sweetalert";
import { exploreCourses, getBestCourses, getSiteMatrix, getUserBadges } from "../../actions/browseActions";
import "../../assets/css/Home/homepage.css";
import { Get, Post } from "../common/common";
import MetaHelmet from "../common/MetaHelmet";
import { Format } from "../common/videocommon";
import { HomeActivityNode } from "../User/Profile/profile";
// import Matomo from "../common/Matomo";
import BestChannel from "./BestChannel/BestChannel";
import Search from "./Search";
import { CreateCourse, CreateCourseMobile, TutorialSteps } from "./TutorialSteps.js";

var jsonData = require("./home.json");

const useStyles = (theme) => ({
  expandMoreIcon: {
    marginLeft: "5px",
    "@media (max-width:1024px)": {
      display: "none",
    },
  },
  keyboardArrowRightIcon: {
    "@media (max-width:968px)": {
      fontSize: "16px",
    },
  },
});

const Collaborate = lazy(() => import("./Collaborate"));
const HelpCard = lazy(() => import("./HelpCard"));
const Tabs = lazy(() => import("./Tabs.js"));

class HomeScreen extends Component {
  state = {
    term: "",
    isOpen: false,
    createCourseOpen: false,
    dialogOpen: false,
    actionItem: false,
    currentPath: "",
    model: false,
    isEditorOpen: false,
  };
  tutorialClick = false;
  whiteLabel = true;
  closeWhiteLabel = false;
  isWhiteLabelActive = false;
  type = null;

  subscribe = async () => {
    if (localStorage.getItem("email")) {
      await axios({
        url: `${jsonData.api.subscribeNewsletter}${localStorage.getItem("email")}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e);
        });
      swal(`Hello ${localStorage.getItem("first_name")}!`, "You subscribed to our newsletter!", "success");
    } else {
      swal("Error", "Please login to continue", "error").then((ok) => {
        if (ok) {
          window.location.href = "/login";
        }
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.location !== this.props.location) {
      let path = window.location.pathname;
      if (path === "/create-your-own-course") {
        localStorage.setItem("show_home_tutorial", false);
        localStorage.setItem("show_dub_tutorial", false);
        localStorage.setItem("show_video_tutorial", false);
        localStorage.setItem("show_browse_tutorial", false);
        this.setState({ dialogOpen: true });
      }
    }
  };

  handleReset = () => {
    this.setState({
      isOpen: true,
    });
    this.props.setBrowseTour(true);
    localStorage.setItem("show_video_tutorial", true);
    localStorage.setItem("show_browse_tutorial", true);
  };

  handleCourseTutorial = () => {
    this.setState({
      isCourseTutorialOpen: true,
    });
    sessionStorage.setItem("show_course_tutorial", true);
  };

  checkWhiteLabelAndUpdate = async () => {
    let whiteLabel = await Get(1, "get_whitelabel_user_edit", {});
    console.log(whiteLabel.data.data);
    let data = whiteLabel.data.data;
    data.forEach((e) => {
      try {
        let element = document.querySelector(e.xpath);
        console.log(element);
        if (element.nodeName == "IMG") {
          element.setAttribute("src", e.image_url);
        } else {
          element.innerHTML = e.wysiwig;
        }
      } catch (e) {
        console.log(e);
      }
    });
  };

  componentDidMount = async () => {
    let path = window.location.pathname;
    if (path === "/create-your-own-course") {
      localStorage.setItem("show_home_tutorial", false);
      localStorage.setItem("show_dub_tutorial", false);
      localStorage.setItem("show_video_tutorial", false);
      localStorage.setItem("show_browse_tutorial", false);
      this.setState({ dialogOpen: true });
    }
    window.scrollTo(0, 0);
    if (window.screen.width >= 1025 && !this.props.exploreCourse) {
      this.props.exploreCourses();
    }
    if (!this.props.bestCourses.length) {
      this.props.getBestCourses();
    }
    if (!this.props.siteMatrix) {
      this.props.getSiteMatrix();
    }
    // if (!this.props.userBadges) {
    //   this.props.getUserBadges();
    // }

    setTimeout(() => {
      if (localStorage.getItem("show_home_tutorial") !== "false") {
        this.props.setBrowseTour(true);
        this.setState({ isOpen: true });
        localStorage.setItem("show_home_tutorial", false);
      }
    }, 1000);
  };
  browse = (level, parent) => {
    this.props.history.push("/dashboard/browse?level=" + level + "&parent=" + parent + "&type=classes");
  };
  handleLoginClick = () => {
    if (this.state.createCourseOpen) {
      this.tutorialClick = true;
    }
    this.props.history.push("/login");
  };
  handleDashboardClick = () => {
    if (this.state.createCourseOpen) {
      this.tutorialClick = true;
    }
    this.props.history.push("/explore-by-topics");
  };
  handleClick = () => {
    if (window.screen.width <= 1024) {
      this.props.history.push("/dashboard/browse?level=" + 1 + "&parent=" + 0 + "&type=topics");
    }
  };
  handleCreateCourseStart = () => {
    console.log("start");
    this.setState({ dialogOpen: false });
    this.props.setBrowseTour(true);
    localStorage.setItem("coc", true);
    if (!localStorage.getItem("access_token")) {
      swal({
        title: "Log in to continue",
        text: "Please login as a teacher to create your own course",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.tutorialClick = true;
          this.props.history.push("/login");
        } else {
          localStorage.setItem("coc", false);
        }
      });
    } else if (localStorage.getItem("role_id") === "1") {
      swal({
        title: "Logged in as a student",
        text: "Please login as a teacher to create your own course",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.tutorialClick = true;
          this.props.history.push("/login");
        } else {
          localStorage.setItem("coc", false);
        }
      });
    } else {
      this.tutorialClick = true;
      this.setState({ createCourseOpen: true });
    }
  };
  closeTour = () => {
    if (this.tutorialClick) {
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
    this.setState({
      isOpen: false,
      createCourseOpen: false,
    });
    this.props.setBrowseTour(false);
    let path = window.location.pathname;
    if (path === "/create-your-own-course") {
      this.props.history.push("/");
    }
  };
  redirect = (event, level, parent, slug, video_count, categories, type) => {
    event.stopPropagation();
    if (type === 0) {
      type = "topics";
    } else type = "classes";

    if (type === "classes") {
      if (!categories && !video_count && level <= 2) {
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        this.props.history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    } else {
      if (categories === undefined)
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      else if (!categories && !video_count && level <= 2) {
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        this.props.history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    }
  };

  handleClickOpen = () => {
    this.handleCreateCourseStart();
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
    this.props.history.push("/");
  };

  handleMouseOver = (e) => {
    if (this.whiteLabel) {
      e.target.style.border = "2px solid black";
      // e.target.setAttribute("contenteditable", "true");
    }
  };

  handleMouseOut = (e) => {
    if (this.closeWhiteLabel) {
      this.whiteLabel = true;
      this.closeWhiteLabel = false;
    } else if (this.whiteLabel) {
      e.target.style.border = "none";
      e.target.style.pointerEvents = "auto";
      // e.target.setAttribute("contenteditable", "false");
    }
  };
  handleMouseDown = (e) => {
    if (this.whiteLabel && this.isWhiteLabelActive) {
      function getDomPath(el) {
        if (!el) {
          return;
        }
        var stack = [];
        var isShadow = false;
        while (el.parentNode != null) {
          // console.log(el.nodeName);
          var sibCount = 0;
          var sibIndex = 0;
          // get sibling indexes
          for (var i = 0; i < el.parentNode.childNodes.length; i++) {
            var sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
              if (sib === el) {
                sibIndex = sibCount;
              }
              sibCount++;
            }
          }
          // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
          //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
          // } else
          var nodeName = el.nodeName.toLowerCase();
          if (isShadow) {
            nodeName += "::shadow";
            isShadow = false;
          }
          if (sibCount > 1) {
            stack.unshift(nodeName + ":nth-of-type(" + (sibIndex + 1) + ")");
          } else {
            stack.unshift(nodeName);
          }
          el = el.parentNode;
          if (el.nodeType === 11) {
            // for shadow dom, we
            isShadow = true;
            el = el.host;
          }
        }
        stack.splice(0, 1); // removes the html element
        return stack;
      }

      var path = getDomPath(e.target).join(" > ");
      localStorage.setItem("path", path);
      var old_element = e.target;
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      this.handleWhiteLabelClick(new_element);
    }
  };

  handleWhiteLabelClick = (e) => {
    if (this.whiteLabel) {
      if (e.nodeName.toLowerCase() == "img") {
        this.type = "img";
      } else {
        this.type = "text";
      }

      this.whiteLabel = false;
      let input = document.getElementById("color_input");
      input.style.display = "flex";
      input.style.top = window.scrollY + e.getBoundingClientRect().top - 50 + "px";
      input.style.left = e.getBoundingClientRect().right - 100 + "px";
      this.setState({ element: e });
    }
  };

  handleColorChange = (e) => {
    this.state.element.style.color = e.target.value;
    let path = this.state.currentPath;
    let whiteLabelData = JSON.parse(localStorage.getItem("whiteLabelData"));
    if (!whiteLabelData) {
      let data = [];
      data.push({ path, text: this.state.element.textContent, color: e.target.value, type: "text" });
      localStorage.setItem("whiteLabelData", JSON.stringify(data));
      console.log(data);
    } else {
      let i;
      for (i = 0; i < whiteLabelData.length; i++) {
        if (whiteLabelData[i].path === path) {
          whiteLabelData[i].text = this.state.element.textContent;
          whiteLabelData[i].color = e.target.value;
          whiteLabelData[i].type = "text";
          localStorage.setItem("whiteLabelData", JSON.stringify(whiteLabelData));
          break;
        }
      }
      if (i == whiteLabelData.length) {
        whiteLabelData.push({ path, text: this.state.element.textContent, color: e.target.value, type: "text" });
        localStorage.setItem("whiteLabelData", JSON.stringify(whiteLabelData));
      }
    }
  };

  handleImgChange = (e) => {
    this.url = URL.createObjectURL(e.target.files[0]);
    this.state.element.setAttribute("src", this.url);
    this.state.element.parentNode.style.resize = "both";
    this.state.element.parentNode.style.overflow = "auto";
    let data = new FormData();
    data.append("page_url", window.location.href);
    data.append("xpath", localStorage.getItem("path"));
    data.append("image", e.target.files[0]);
    Post(1, "add_whitelabel_user_edit", data);
  };

  initial = true;

  render() {
    try {
      let subDomain = window.location.host.split(".")[0];
      if (subDomain === "morethanmarks") {
        if (this.props.school) {
          setTimeout(() => {
            if (this.initial) {
              this.initial = false;
              this.checkWhiteLabelAndUpdate();
            }
          }, 500);
        }
      }
      const settings = {
        dots: true,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // appendDots: (dots) => {
        //   return <MagicSliderDots dots={dots} numDotsToShow={2} dotWidth={30} />;
        // },
      };
      const { classes, userBadges, siteMatrix, school } = this.props;
      const renderArrow = (data) => {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].video_count || data[i].num_categories) {
              return <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />;
            }
          }
        }
      };
      const renderTree = (data) => {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            return (
              <Dropdown.Submenu position="right" className="sub-menu">
                {data.map((e) => {
                  return (
                    <Dropdown.Item
                      className={`dropdown-item ${e.level}`}
                      key={e.id}
                      onClick={(event, index) => {
                        event.stopPropagation();
                        this.redirect(event, e.level + 1, e.id, e.slug, e.video_count, e.num_categories, e.type);
                      }}
                    >
                      {e.title}
                      {renderArrow(e.children)}
                      {renderTree(e.children)}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Submenu>
            );
          }
        }
      };

      return (
        <Suspense fallback={<></>}>
          <div
            onMouseDown={this.isWhiteLabelActive ? this.handleMouseDown : undefined}
            onMouseOver={this.isWhiteLabelActive ? this.handleMouseOver : undefined}
            onMouseOut={this.isWhiteLabelActive ? this.handleMouseOut : undefined}
            // onClick={this.isWhiteLabelActive ? this.handleWhiteLabelClick : undefined}
          >
            <div style={{ display: "none", position: "absolute", zIndex: "5" }} id="color_input" class="flex gap_8">
              {this.type != "img" ? (
                !this.state.isEditorOpen && (
                  <Button
                    size="small"
                    variant="outlined"
                    component="span"
                    className={classes.upload}
                    onClick={() => {
                      this.setState({ isEditorOpen: true });
                      let editor = new FroalaEditor(this.state.element, {
                        attribution: false,
                        charCounterCount: false,
                        events: {
                          contentChanged: function (e) {
                            let node = this.el.childNodes[0].outerHTML;
                            Post(1, "add_whitelabel_user_edit", {
                              page_url: window.location.href,
                              xpath: localStorage.getItem("path"),
                              wysiwig: node,
                            });
                          },
                        },
                      });
                      document.querySelector("#froala").addEventListener("click", function (e) {
                        e.preventDefault();
                        if (editor) {
                          editor.destroy();
                          editor = null;
                        }
                      });
                    }}
                  >
                    {jsonData.buttons.edit}
                  </Button>
                )
              ) : (
                <>
                  <input
                    type="file"
                    id="myFile"
                    name="filename"
                    accept="image/*"
                    onChange={this.handleImgChange}
                    className="none"
                  />
                  <label htmlFor="myFile">
                    <Button
                      size="small"
                      variant="outlined"
                      component="span"
                      className={classes.upload}
                      startIcon={
                        <img src={require(`../../assets/images/icons/${jsonData.images.profileUpload}`)} alt="" />
                      }
                    >
                      {jsonData.buttons.upload}
                    </Button>
                  </label>
                </>
              )}
              <CloseRoundedIcon
                style={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "50%", cursor: "pointer" }}
                id="froala"
                onClick={() => {
                  this.setState({ isEditorOpen: false });
                  let input = document.getElementById("color_input");
                  input.style.display = "none";
                  this.state.element.style.border = "none";
                  this.closeWhiteLabel = true;
                }}
              />
            </div>

            {subDomain !== "morethanmarks" ? (
              <>
                <MetaHelmet
                  title="BeyondExams"
                  description="Best educational videos on your fingertips. Start learning now!"
                />

                {/* <div className="home-action-item-root">
                <ClickAwayListener
                  onClickAway={() => {
                    this.setState({ actionItem: false });
                  }}
                >
                  <div className="home-action-item">
                    <div className="action-item h_a_i">
                      <div
                        className="a_i_main"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.setState({ actionItem: true });
                        }}
                      >
                        <div className="a_i_main_left">
                          <img
                            loading="lazy"
                            src={require(`../../assets/images/icons/${jsonData.images.relieved}`)}
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
                          <ExpandMoreIcon />
                        )}
                        {this.props.userBadges && (
                          <ActionItem actionItem={this.state.actionItem} data={this.props.userBadges} />
                        )}
                      </div>
                    </div>
                  </div>
                </ClickAwayListener>
              </div> */}
                <div className="home-root">
                  <div className="home-top-section">
                    <div className="home-container relative">
                      <div className="home-hero-section">
                        <p>{jsonData.tagline.title}</p>
                        <h1>
                          {/* “<span>Learn</span> anything you want, <span>Teach</span> everything you know” */}“
                          <span>{jsonData.tagline.textBold1}</span> {jsonData.tagline.text1},{" "}
                          <span>{jsonData.tagline.textBold2}</span> {jsonData.tagline.text2}”
                        </h1>
                        <div className="home-explore-search">
                          <div data-tut="browse" onClick={this.handleClick}>
                            <Dropdown
                              title={
                                <>
                                  {jsonData.dropdown.title} <ExpandMoreIcon className={classes.expandMoreIcon} />
                                </>
                              }
                              buttonClassName="home-dropdown-button"
                              menuClassName="home-dropdown-menu"
                              position="right"
                            >
                              {window.screen.width <= 1024 ? (
                                <></>
                              ) : (
                                <>
                                  <Dropdown.Item className="dropdown-item">
                                    {jsonData.dropdown.optionTopics}
                                    <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />
                                    <Dropdown.Submenu position="right" className="sub-menu">
                                      {this.props.exploreCourse &&
                                        this.props.exploreCourse[1].children.map((parent) => (
                                          <Dropdown.Item
                                            position="right"
                                            className="dropdown-item"
                                            key={parent.id}
                                            onClick={(event) => {
                                              this.redirect(
                                                event,
                                                parent.level + 1,
                                                parent.id,
                                                parent.slug,
                                                parent.video_count,
                                                parent.num_categories,
                                                parent.type
                                              );
                                            }}
                                          >
                                            {parent.title}
                                            {renderArrow(parent.children)}
                                            {renderTree(parent.children)}
                                          </Dropdown.Item>
                                        ))}
                                    </Dropdown.Submenu>
                                  </Dropdown.Item>
                                  <Dropdown.Item className="dropdown-item">
                                    {jsonData.dropdown.optionClasses}
                                    <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />
                                    <Dropdown.Submenu position="right" className="sub-menu">
                                      {this.props.exploreCourse &&
                                        this.props.exploreCourse[0].children.map((parent) => {
                                          return (
                                            <Dropdown.Item
                                              position="right"
                                              className="dropdown-item"
                                              key={parent.id}
                                              onClick={(event) => {
                                                this.redirect(
                                                  event,
                                                  parent.level + 1,
                                                  parent.id,
                                                  parent.slug,
                                                  parent.video_count,
                                                  parent.num_categories,
                                                  parent.type
                                                );
                                              }}
                                            >
                                              {parent.title}
                                              {renderArrow(parent.children)}
                                              {renderTree(parent.children)}
                                            </Dropdown.Item>
                                          );
                                        })}
                                    </Dropdown.Submenu>
                                  </Dropdown.Item>{" "}
                                </>
                              )}
                            </Dropdown>
                          </div>
                          <div className="home-search" data-tut="search">
                            <Search />
                          </div>
                        </div>
                        <div className="how-search-works">
                          <div className="flex">
                            <img
                              loading="lazy"
                              onClick={this.handleReset}
                              src={require(`../../assets/images/icons/${jsonData.images.info}`)}
                              alt=""
                              width="20"
                              height="21"
                            />
                            <span onClick={this.handleReset}>{jsonData.buttons.goThroughTutorial}</span>
                          </div>
                          <div className="flex">
                            <img
                              loading="lazy"
                              onClick={this.handleCreateCourseStart}
                              src={require(`../../assets/images/icons/${jsonData.images.info}`)}
                              alt=""
                              width="20"
                              height="21"
                            />
                            <span onClick={this.handleCreateCourseStart}>{jsonData.buttons.createCourse}</span>
                          </div>
                        </div>
                      </div>
                      <div className="home-top-illustration">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.homeTopIllustration}`)}
                          alt=""
                          width="304"
                          height="496"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-root-create">
                  <div className="home-matrix">
                    <section className="home_activity_section_big bg-color-blue" style={{ marginBottom: "50px" }}>
                      <HomeActivityNode
                        color={"#FFF"}
                        bgColor={"#6646e7"}
                        titleColor={"#FFF"}
                        title={jsonData.homeActivityNode.answers}
                        value={siteMatrix ? Format(siteMatrix.answers) + "+" : 0}
                      />
                      <HomeActivityNode
                        color={"#FFF"}
                        bgColor={"#6646e7"}
                        titleColor={"#FFF"}
                        title={jsonData.homeActivityNode.courses}
                        value={siteMatrix ? Format(siteMatrix.courses) + "+" : 0}
                      />
                      <HomeActivityNode
                        color={"#FFF"}
                        bgColor={"#6646e7"}
                        titleColor={"#FFF"}
                        title={jsonData.homeActivityNode.notes}
                        value={siteMatrix ? Format(siteMatrix.notes) + "+" : 0}
                      />
                      <HomeActivityNode
                        color={"#FFF"}
                        bgColor={"#6646e7"}
                        titleColor={"#FFF"}
                        title={jsonData.homeActivityNode.questions}
                        value={siteMatrix ? Format(siteMatrix.questions) + "+" : 0}
                      />
                      <HomeActivityNode
                        color={"#FFF"}
                        bgColor={"#6646e7"}
                        titleColor={"#FFF"}
                        title={jsonData.homeActivityNode.users}
                        value={siteMatrix ? Format(siteMatrix.users) + "+" : 0}
                      />
                    </section>
                    <section className="home_activity_section_small">
                      <SliderDots {...settings}>
                        <div className="node_container">
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.answers}
                            value={siteMatrix ? Format(siteMatrix.answers) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.courses}
                            value={siteMatrix ? Format(siteMatrix.courses) + "+" : 0}
                          />
                        </div>
                        <div className="node_container">
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.notes}
                            value={siteMatrix ? Format(siteMatrix.notes) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.questions}
                            value={siteMatrix ? Format(siteMatrix.questions) + "+" : 0}
                          />
                        </div>
                        <div className="node_container">
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.users}
                            value={siteMatrix ? Format(siteMatrix.users) + "+" : 0}
                          />
                        </div>
                      </SliderDots>
                    </section>
                  </div>
                </div>
                <div className="home-root">
                  <div className="home-top-section">
                    <div className="home-container relative">
                      <div className="home-help">{jsonData.sectionHeading.howBEHelp}</div>
                      <div className="home-help-hero">
                        <HelpCard
                          title={jsonData.sectionContent.helpCardTitle1}
                          description={jsonData.sectionContent.helpCardDesc1}
                          src={require(`../../assets/images/icons/${jsonData.images.help1}`)}
                        />
                        <HelpCard
                          title={jsonData.sectionContent.helpCardTitle2}
                          description={jsonData.sectionContent.helpCardDesc2}
                          src={require(`../../assets/images/icons/${jsonData.images.help2}`)}
                        />
                        <HelpCard
                          title={jsonData.sectionContent.helpCardTitle3}
                          description={jsonData.sectionContent.helpCardDesc3}
                          src={require(`../../assets/images/icons/${jsonData.images.help3}`)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="spacing-1" />
                <Collaborate />

                <div className="home-root">
                  <div className="home-courses">
                    <div className="h_c_top">
                      <h5>{jsonData.sectionHeading.bestCourses}</h5>
                      <Link to="/dashboard" className="h_c_hide">
                        {jsonData.buttons.exploreCourses}
                      </Link>
                    </div>
                    <div className="h_c_main">
                      <Tabs courses={this.props.bestCourses} />
                    </div>
                    <div className="h_c_bottom">
                      <Link to="/dashboard">{jsonData.buttons.exploreCourses}</Link>
                    </div>
                  </div>
                </div>
                <BestChannel />
                <div className="home-root">
                  <div className="home-why">
                    <div className="home-why-top">{jsonData.sectionHeading.whyBECourses}</div>
                    <div className="home-why-main">
                      <div className="home-why-card">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.fire}`)}
                          className="group-928"
                          alt=""
                          width="65"
                          height="74"
                        />
                        <p>{jsonData.sectionContent.eduContent}</p>
                      </div>
                      <div className="home-why-card">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.track}`)}
                          alt=""
                          width="59"
                          height="70"
                        />
                        <p>{jsonData.sectionContent.progress}</p>
                      </div>
                      <div className="home-why-card">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.party}`)}
                          alt=""
                          width="65"
                          height="74"
                        />
                        <p>{jsonData.sectionContent.certificate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-root-create">
                  <div className="home-create">
                    <div className="home-create-left">
                      <img
                        loading="lazy"
                        src={require(`../../assets/images/icons/${jsonData.images.teacher}`)}
                        alt=""
                        width="436"
                        height="416"
                      ></img>
                    </div>
                    <div className="home-create-right">
                      <div className="h_c_r">
                        <div className="home-create-teacher-img">
                          <img
                            loading="lazy"
                            src={require(`../../assets/images/icons/${jsonData.images.teacher}`)}
                            alt=""
                            width="436"
                            height="416"
                          ></img>
                        </div>
                        <h2>
                          {jsonData.sectionContent.createChange}
                          <img
                            loading="lazy"
                            src={require(`../../assets/images/icons/${jsonData.images.curlyArrow}`)}
                            className="home-create-arrow"
                            alt=""
                          ></img>
                          <div className="home-create-group555">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.youtube}`)}
                              alt=""
                            ></img>
                          </div>
                        </h2>
                      </div>
                      <p>
                        {jsonData.sectionContent.easyCourse1} <strong>{jsonData.sectionContent.easyContentBold}</strong>{" "}
                        {jsonData.sectionContent.easyContent2}
                      </p>
                      <Link to="/create-your-own-course">{jsonData.buttons.createCourse}</Link>
                    </div>
                  </div>
                </div>
                <div className="home-root">
                  <div className="home-top-section">
                    <div className="home-container relative">
                      <div className="spacing-5"> </div>
                      <div className="home-why-top">{jsonData.sectionHeading.usersSay}</div>
                      <div className="spacing-2"> </div>
                      <IframeResizer
                        src={jsonData.links.testimonial}
                        style={{ border: "none", width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="home-root">
                  <div className="home-join-container">
                    <div className="home-join">
                      <div className="home-join-left">
                        <p>{jsonData.sectionContent.vision}</p>
                        <h1>
                          {jsonData.sectionContent.joinUs}
                          <img
                            loading="lazy"
                            src={require(`../../assets/images/icons/${jsonData.images.happy}`)}
                            alt=""
                            width="38"
                            height="38"
                          ></img>
                        </h1>
                        <div className="h-j-l-bottom">
                          <a className="h-j-l-btn h-j-l-one" href={jsonData.links.involveLink}>
                            {jsonData.buttons.involve}
                          </a>
                          <a className="h-j-l-btn h-j-l-two" href={jsonData.links.meetTeamLink}>
                            {jsonData.buttons.meetTeam}
                          </a>
                        </div>
                      </div>
                      <div className="home-join-right">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.teamFrame}`)}
                          alt=""
                          width="452"
                          height="420"
                        ></img>
                      </div>
                      <div className="h-j-bg"></div>
                    </div>
                  </div>
                </div>

                <div className="home-root">
                  <div className="home-footer-section">
                    <div className="home-container relative">
                      {/* <div className="home-footer-illustration-one">
                <img loading="lazy" src={HomeFooterIllustrationOne} alt="" />
              </div> */}
                      <div className="home-footer-illustration-two">
                        <img
                          loading="lazy"
                          src={require(`../../assets/images/icons/${jsonData.images.homeFooterIllustration}`)}
                          alt=""
                          width="318"
                          height="292"
                        />
                      </div>
                      <div className="footer-hero-section">
                        <div className="home-footer-column-one">
                          <h2>{jsonData.footer.heading.contact}</h2>
                          <div className="footer-address">
                            <p>{jsonData.footer.address.line1}</p>
                            <p>{jsonData.footer.address.line2}</p>
                            <p>{jsonData.footer.address.line3}</p>
                            <p>{jsonData.footer.address.line4}</p>
                            <p>{jsonData.footer.address.line5}</p>
                            <div className="home-footer-social">
                              <a href={jsonData.links.instagram} target="_blank" rel="noopener noreferrer">
                                <img
                                  loading="lazy"
                                  src={require(`../../assets/images/icons/${jsonData.images.instagram}`)}
                                  alt=""
                                  width="30"
                                  height="29"
                                />
                              </a>
                              <a href={jsonData.links.facebook} target="_blank" rel="noopener noreferrer">
                                <img
                                  loading="lazy"
                                  src={require(`../../assets/images/icons/${jsonData.images.facebook}`)}
                                  alt=""
                                  width="30"
                                  height="29"
                                />
                              </a>
                              <a href={jsonData.links.linkedin} target="_blank" rel="noopener noreferrer">
                                <img
                                  loading="lazy"
                                  src={require(`../../assets/images/icons/${jsonData.images.linkedin}`)}
                                  alt=""
                                  width="30"
                                  height="29"
                                />
                              </a>
                              <a href={jsonData.links.twitter} target="_blank" rel="noopener noreferrer">
                                <img
                                  loading="lazy"
                                  src={require(`../../assets/images/icons/${jsonData.images.twitter}`)}
                                  alt=""
                                  width="30"
                                  height="29"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="home-footer-column-two">
                          <h2>{jsonData.footer.heading.about}</h2>
                          <a href={jsonData.links.aboutUs} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.aboutUs}
                          </a>
                          <a href={jsonData.links.team} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.team}
                          </a>
                        </div>
                        <div className="home-footer-column-three">
                          <h2>{jsonData.footer.heading.resource}</h2>
                          <Link to="/dashboard/contact-us">{jsonData.footer.linkTitle.contactUs}</Link>
                          {/* <Link to="/dashboard/recent-updates">Recent Updates</Link> */}
                          {/* <Link to="/dashboard/behind-the-scenes">Behind the scenes</Link> */}
                          <a href={jsonData.links.involve} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.involve}
                          </a>
                          <a href={jsonData.links.partner} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.partner}
                          </a>
                          <a href={jsonData.links.motive} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.motive}
                          </a>
                          <a href={jsonData.links.advisor} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.advisor}
                          </a>

                          <a href={jsonData.links.roadmap} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.roadmap}
                          </a>
                          <a href={jsonData.links.faq} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.faq}
                          </a>
                          <a href={jsonData.links.privacyPolicy} target="_blank" rel="noopener noreferrer">
                            {jsonData.footer.linkTitle.privacyPolicy}
                          </a>
                        </div>
                        <div className="home-footer-column-four">
                          <h3 style={{ marginTop: "25px", marginBottom: "20px" }}>
                            {jsonData.footer.heading.updates} <br /> {jsonData.footer.heading.newsletter}
                          </h3>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "white",
                              padding: "8px",
                              borderRadius: "10px",
                              width: "125px",
                              color: "#6646E8",
                              fontWeight: "500",
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                            }}
                            onClick={this.subscribe}
                          >
                            {jsonData.footer.linkTitle.subscribe}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="home-copyright-section">
                    <div className="home-container relative home-copyright">
                      <h4>{jsonData.footer.copyright.title}</h4>
                      <h4>
                        {jsonData.footer.copyright.fundedBy}{" "}
                        <a href={jsonData.links.fundraiser} target="_blank" rel="noopener noreferrer">
                          {jsonData.footer.copyright.fundraiser}
                        </a>
                      </h4>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              this.props.school && (
                <>
                  <>
                    <MetaHelmet
                      title="BeyondExams"
                      description="Best educational videos on your fingertips. Start learning now!"
                    />
                    <div className="white_label">
                      <button
                        className="h-j-l-btn h-j-l-one"
                        onClick={() => {
                          this.isWhiteLabelActive = true;
                          this.setState({ model: true });
                        }}
                      >
                        {this.isWhiteLabelActive ? "Activated" : "Activate WhiteLabel"}
                      </button>
                    </div>
                    <div className="home-action-item-root">
                      {/* <ClickAwayListener
                      onClickAway={() => {
                        this.setState({ actionItem: false });
                      }}
                    >
                      <div className="home-action-item">
                        <div className="action-item h_a_i">
                          <div
                            className="a_i_main"
                            onClick={(e) => {
                              e.stopPropagation();
                              this.setState({ actionItem: true });
                            }}
                          >
                            <div className="a_i_main_left">
                              <img
                                loading="lazy"
                                src={require(`../../assets/images/icons/${jsonData.images.relieved}`)}
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
                              <ExpandMoreIcon />
                            )}
                            {this.props.userBadges && (
                              <ActionItem actionItem={this.state.actionItem} data={this.props.userBadges} />
                            )}
                          </div>
                        </div>
                      </div>
                    </ClickAwayListener> */}
                    </div>
                    <div className="home-root">
                      <div className="home-top-section">
                        <div className="home-container relative">
                          <div className="home-hero-section">
                            <div id="froala-editor">
                              <p>{jsonData.tagline.title}</p>
                            </div>

                            <h1>“{school.data.title}”</h1>
                            <div className="home-explore-search">
                              <div data-tut="browse" onClick={this.handleClick}>
                                <Dropdown
                                  title={
                                    <>
                                      {jsonData.dropdown.title} <ExpandMoreIcon className={classes.expandMoreIcon} />
                                    </>
                                  }
                                  buttonClassName="home-dropdown-button"
                                  menuClassName="home-dropdown-menu"
                                  position="right"
                                >
                                  {window.screen.width <= 1024 ? (
                                    <></>
                                  ) : (
                                    <>
                                      <Dropdown.Item className="dropdown-item">
                                        {jsonData.dropdown.optionTopics}
                                        <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />
                                        <Dropdown.Submenu position="right" className="sub-menu">
                                          {this.props.exploreCourse &&
                                            this.props.exploreCourse[1].children.map((parent) => (
                                              <Dropdown.Item
                                                position="right"
                                                className="dropdown-item"
                                                key={parent.id}
                                                onClick={(event) => {
                                                  this.redirect(
                                                    event,
                                                    parent.level + 1,
                                                    parent.id,
                                                    parent.slug,
                                                    parent.video_count,
                                                    parent.num_categories,
                                                    parent.type
                                                  );
                                                }}
                                              >
                                                {parent.title}
                                                {renderArrow(parent.children)}
                                                {renderTree(parent.children)}
                                              </Dropdown.Item>
                                            ))}
                                        </Dropdown.Submenu>
                                      </Dropdown.Item>
                                      <Dropdown.Item className="dropdown-item">
                                        {jsonData.dropdown.optionClasses}
                                        <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />
                                        <Dropdown.Submenu position="right" className="sub-menu">
                                          {this.props.exploreCourse &&
                                            this.props.exploreCourse[0].children.map((parent) => {
                                              return (
                                                <Dropdown.Item
                                                  position="right"
                                                  className="dropdown-item"
                                                  key={parent.id}
                                                  onClick={(event) => {
                                                    this.redirect(
                                                      event,
                                                      parent.level + 1,
                                                      parent.id,
                                                      parent.slug,
                                                      parent.video_count,
                                                      parent.num_categories,
                                                      parent.type
                                                    );
                                                  }}
                                                >
                                                  {parent.title}
                                                  {renderArrow(parent.children)}
                                                  {renderTree(parent.children)}
                                                </Dropdown.Item>
                                              );
                                            })}
                                        </Dropdown.Submenu>
                                      </Dropdown.Item>{" "}
                                    </>
                                  )}
                                </Dropdown>
                              </div>
                              <div className="home-search" data-tut="search">
                                <Search />
                              </div>
                            </div>
                            <div className="how-search-works">
                              <div className="flex">
                                <img
                                  loading="lazy"
                                  onClick={this.handleReset}
                                  src={require(`../../assets/images/icons/${jsonData.images.info}`)}
                                  alt=""
                                  width="20"
                                  height="21"
                                />
                                <span onClick={this.handleReset}>{jsonData.buttons.goThroughTutorial}</span>
                              </div>
                              <div className="flex">
                                <img
                                  loading="lazy"
                                  onClick={this.handleCreateCourseStart}
                                  src={require(`../../assets/images/icons/${jsonData.images.info}`)}
                                  alt=""
                                  width="20"
                                  height="21"
                                />
                                <span onClick={this.handleCreateCourseStart}>{jsonData.buttons.createCourse}</span>
                              </div>
                            </div>
                          </div>
                          <div className="home-top-illustration">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.homeTopIllustration}`)}
                              alt=""
                              width="304"
                              height="496"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="home-root-create">
                      <div className="home-matrix">
                        <section className="home_activity_section_big bg-color-blue" style={{ marginBottom: "50px" }}>
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.answers}
                            value={siteMatrix ? Format(siteMatrix.answers) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.courses}
                            value={siteMatrix ? Format(siteMatrix.courses) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.notes}
                            value={siteMatrix ? Format(siteMatrix.notes) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.questions}
                            value={siteMatrix ? Format(siteMatrix.questions) + "+" : 0}
                          />
                          <HomeActivityNode
                            color={"#FFF"}
                            bgColor={"#6646e7"}
                            titleColor={"#FFF"}
                            title={jsonData.homeActivityNode.users}
                            value={siteMatrix ? Format(siteMatrix.users) + "+" : 0}
                          />
                        </section>
                        <section className="home_activity_section_small">
                          <SliderDots {...settings}>
                            <div className="node_container">
                              <HomeActivityNode
                                color={"#FFF"}
                                bgColor={"#6646e7"}
                                titleColor={"#FFF"}
                                title={jsonData.homeActivityNode.answers}
                                value={siteMatrix ? Format(siteMatrix.answers) + "+" : 0}
                              />
                              <HomeActivityNode
                                color={"#FFF"}
                                bgColor={"#6646e7"}
                                titleColor={"#FFF"}
                                title={jsonData.homeActivityNode.courses}
                                value={siteMatrix ? Format(siteMatrix.courses) + "+" : 0}
                              />
                            </div>
                            <div className="node_container">
                              <HomeActivityNode
                                color={"#FFF"}
                                bgColor={"#6646e7"}
                                titleColor={"#FFF"}
                                title={jsonData.homeActivityNode.notes}
                                value={siteMatrix ? Format(siteMatrix.notes) + "+" : 0}
                              />
                              <HomeActivityNode
                                color={"#FFF"}
                                bgColor={"#6646e7"}
                                titleColor={"#FFF"}
                                title={jsonData.homeActivityNode.questions}
                                value={siteMatrix ? Format(siteMatrix.questions) + "+" : 0}
                              />
                            </div>
                            <div className="node_container">
                              <HomeActivityNode
                                color={"#FFF"}
                                bgColor={"#6646e7"}
                                titleColor={"#FFF"}
                                title={jsonData.homeActivityNode.users}
                                value={siteMatrix ? Format(siteMatrix.users) + "+" : 0}
                              />
                            </div>
                          </SliderDots>
                        </section>
                      </div>
                    </div>
                    <div className="home-root">
                      <div className="home-top-section">
                        <div className="home-container relative">
                          <div className="home-help">How {school.data.name} helps</div>
                          <div className="home-help-hero">
                            <HelpCard
                              title={jsonData.sectionContent.helpCardTitle1}
                              description={jsonData.sectionContent.helpCardDesc1}
                              src={require(`../../assets/images/icons/${jsonData.images.help1}`)}
                            />
                            <HelpCard
                              title={jsonData.sectionContent.helpCardTitle2}
                              description={jsonData.sectionContent.helpCardDesc2}
                              src={require(`../../assets/images/icons/${jsonData.images.help2}`)}
                            />
                            <HelpCard
                              title={jsonData.sectionContent.helpCardTitle3}
                              description={jsonData.sectionContent.helpCardDesc3}
                              src={require(`../../assets/images/icons/${jsonData.images.help3}`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="home-root">
                      <div className="home-courses">
                        <div className="h_c_top">
                          <h5>{jsonData.sectionHeading.bestCourses}</h5>
                          <Link to="/dashboard" className="h_c_hide">
                            {jsonData.buttons.exploreCourses}
                          </Link>
                        </div>
                        <div className="h_c_main">
                          <Tabs courses={this.props.bestCourses} />
                        </div>
                        <div className="h_c_bottom">
                          <Link to="/dashboard">{jsonData.buttons.exploreCourses}</Link>
                        </div>
                      </div>
                    </div>

                    <div className="home-root">
                      <div className="home-why">
                        <div className="home-why-top">Why {school.data.name} courses?</div>
                        <div className="home-why-main">
                          <div className="home-why-card">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.fire}`)}
                              className="group-928"
                              alt=""
                              width="65"
                              height="74"
                            />
                            <p>{jsonData.sectionContent.eduContent}</p>
                          </div>
                          <div className="home-why-card">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.track}`)}
                              alt=""
                              width="59"
                              height="70"
                            />
                            <p>{jsonData.sectionContent.progress}</p>
                          </div>
                          <div className="home-why-card">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.party}`)}
                              alt=""
                              width="65"
                              height="74"
                            />
                            <p>{jsonData.sectionContent.certificate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="home-root-create">
                      <div className="home-create">
                        <div className="home-create-left">
                          <img
                            loading="lazy"
                            src={require(`../../assets/images/icons/${jsonData.images.teacher}`)}
                            alt=""
                            width="436"
                            height="416"
                          ></img>
                        </div>
                        <div className="home-create-right">
                          <div className="h_c_r">
                            <div className="home-create-teacher-img">
                              <img
                                loading="lazy"
                                src={require(`../../assets/images/icons/${jsonData.images.teacher}`)}
                                alt=""
                                width="436"
                                height="416"
                              ></img>
                            </div>
                            <h2>
                              {jsonData.sectionContent.createChange}
                              <img
                                loading="lazy"
                                src={require(`../../assets/images/icons/${jsonData.images.curlyArrow}`)}
                                className="home-create-arrow"
                                alt=""
                              ></img>
                              <div className="home-create-group555">
                                <img
                                  loading="lazy"
                                  src={require(`../../assets/images/icons/${jsonData.images.youtube}`)}
                                  alt=""
                                ></img>
                              </div>
                            </h2>
                          </div>
                          <p>
                            {jsonData.sectionContent.easyCourses1}{" "}
                            <strong>{jsonData.sectionContent.easyCoursesBold}</strong>{" "}
                            {jsonData.sectionContent.easyCourses2}
                          </p>
                          <Link to="/create-your-own-course">{jsonData.buttons.createCourse}</Link>
                        </div>
                      </div>
                    </div>

                    <div className="home-root">
                      <div className="home-footer-section">
                        <div className="home-container relative">
                          {/* <div className="home-footer-illustration-one">
                <img loading="lazy" src={HomeFooterIllustrationOne} alt="" />
              </div> */}
                          <div className="home-footer-illustration-two">
                            <img
                              loading="lazy"
                              src={require(`../../assets/images/icons/${jsonData.images.homeFooterIllustration}`)}
                              alt=""
                              width="318"
                              height="292"
                            />
                          </div>
                          <div className="footer-hero-section">
                            <div className="home-footer-column-one">
                              <h2>{jsonData.footer.heading.contact}</h2>
                              <div className="footer-address">
                                <p>{jsonData.footer.address.line1}</p>
                                <p>{jsonData.footer.address.line2}</p>
                                <p>{jsonData.footer.address.line3}</p>
                                <p>{jsonData.footer.address.line4}</p>
                                <p>{jsonData.footer.address.line5}</p>
                                <div className="home-footer-social">
                                  <a href={school.data.instagram_link} target="_blank" rel="noopener noreferrer">
                                    <img
                                      loading="lazy"
                                      src={require(`../../assets/images/icons/${jsonData.images.instagram}`)}
                                      alt=""
                                      width="30"
                                      height="29"
                                    />
                                  </a>
                                  <a href={school.data.facebook_link} target="_blank" rel="noopener noreferrer">
                                    <img
                                      loading="lazy"
                                      src={require(`../../assets/images/icons/${jsonData.images.facebook}`)}
                                      alt=""
                                      width="30"
                                      height="29"
                                    />
                                  </a>
                                  <a href={school.data.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <img
                                      loading="lazy"
                                      src={require(`../../assets/images/icons/${jsonData.images.linkedin}`)}
                                      alt=""
                                      width="30"
                                      height="29"
                                    />
                                  </a>
                                  <a href={school.data.twitter_url} target="_blank" rel="noopener noreferrer">
                                    <img
                                      loading="lazy"
                                      src={require(`../../assets/images/icons/${jsonData.images.twitter}`)}
                                      alt=""
                                      width="30"
                                      height="29"
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="home-footer-column-two">
                              <h2>{jsonData.footer.heading.about}</h2>
                              {school.data.footer_links.map((e) => (
                                <a href={e.link} target="_blank" rel="noopener noreferrer">
                                  {e.title}
                                </a>
                              ))}
                            </div>
                            <div className="home-footer-column-three">
                              <h2>{jsonData.footer.heading.resource}</h2>

                              {school.data?.resources?.length > 0 &&
                                school.data.resources.map((e) => (
                                  <a href={e.link} target="_blank" rel="noopener noreferrer">
                                    {e.title}
                                  </a>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="home-copyright-section">
                        <div className="home-container relative home-copyright">
                          <h4>{jsonData.footer.copyright.title}</h4>
                          <h4>
                            {jsonData.footer.copyright.fundedBy}{" "}
                            <a href="https://twitter.com/malpani" target="_blank" rel="noopener noreferrer">
                              {jsonData.footer.copyright.fundraiser}
                            </a>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </>
                </>
              )
            )}
            <Steps
              enabled={this.state.isOpen}
              steps={TutorialSteps}
              initialStep={0}
              onExit={this.closeTour}
              options={{
                showStepNumbers: false,
                overlayOpacity: 0,
                doneLabel: "Got it",
                hidePrev: true,
                hideNext: true,
                nextLabel: "Next",
                tooltipClass: "myTooltipClass",
                highlightClass: "myHighlightClass",
                prevLabel: "back",
              }}
            />
            <Steps
              enabled={this.state.createCourseOpen}
              steps={window.screen.width <= 1080 ? CreateCourseMobile : CreateCourse}
              initialStep={0}
              onExit={this.closeTour}
              options={{
                tooltipClass: "tour-tool-tip myTooltipClass",
                showStepNumbers: false,
                overlayOpacity: 0,
                highlightClass: "myHighlightClass",
                showBullets: false,
                keyboardNavigation: false,
                // skipLabel: "Got it",
                // showButtons: false,
              }}
            />

            <Dialog
              open={this.state.dialogOpen}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{jsonData.dialog.title}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {jsonData.dialog.content1} <b>{jsonData.dialog.content2}</b> {jsonData.dialog.content3}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClickOpen} color="primary">
                  {jsonData.dialog.actions.yes}
                </Button>
                <Button onClick={this.handleClose} color="primary">
                  {jsonData.dialog.actions.no}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Suspense>
      );
    } catch (e) {
      swal("OOPS some error occurred!", "We will fix this soon.", "warning");
      Post(0, "save_error_log", { subject: e.message, error_log: e.stack });
      return <></>;
    }
  }
}
const mapStatesToProps = (state) => {
  return {
    exploreCourse: state.browse.exploreCourse,
    bestCourses: state.browse.bestCourses,
    userBadges: state.browse.userBadges,
    siteMatrix: state.browse.siteMatrix,
    school: state.util.school,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    exploreCourses: () => dispatch(exploreCourses()),
    getBestCourses: () => dispatch(getBestCourses()),
    getUserBadges: () => dispatch(getUserBadges()),
    getSiteMatrix: () => dispatch(getSiteMatrix()),
  };
};
export default connect(mapStatesToProps, mapDispatchToProps)(withStyles(useStyles)(HomeScreen));
