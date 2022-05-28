import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import styles from "./CourseDetail.module.css";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CloseIcon from "@material-ui/icons/Close";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/CourseDetail.css";
import "../../../../assets/css/User/Profile/profile_dialog.css";

import delivery from "../../../../assets/images/icons/delivery.png";
import duration from "../../../../assets/images/icons/duration.png";
import modules from "../../../../assets/images/icons/modules.png";
import BenefitOpenBG from "../../../../assets/images/icons/benefitOpenBG.png";
import { ReactComponent as Edit } from "../../../../assets/images/icons/edit.svg";
import { ReactComponent as EndorseTick } from "../../../../assets/images/icons/endorse_tick.svg";

// import Untitled13 from "../../../../assets/images/icons/Untitled-13.png";
// import Untitled14 from "../../../../assets/images/icons/Untitled-14.png";
// import Whatsapp from "../../../../assets/images/icons/whatsapp.png";
// import InfoIcon from "../../../../assets/images/icons/alert-circle.svg";
// import DeleteIcon from "../../../../assets/images/icons/deleteIcon.png";
// import Certi from "../../../../assets/images/icons/certi.png";
// import PlusCircle from "../../../../assets/images/icons/plus_circle.png";
// import ProfileUpload from "../../../../assets/images/icons/profile-upload.png";
// import Arrow from "../../../../assets/images/icons/solid-bottom-arrow.svg";
// import TagClock from "../../../../assets/images/icons/tag_clock.png";
// import TagLayers from "../../../../assets/images/icons/tag_layers.png";

// new layout import

// import TagVideos from "../../../../assets/images/icons/tag_videos.png";
// import XIcon from "../../../../assets/images/icons/x.svg";
// import benefitBG1 from "../../../../assets/images/images/benefitBG1.png";
// import benefitBG2 from "../../../../assets/images/images/benefitBG2.png";
// import benefitBG3 from "../../../../assets/images/images/benefitBG3.png";
// import Untitled15 from "../../../../assets/images/icons/refer.png";
// import CourseCompleteImg from "../../../../assets/images/images/course-complete.svg";

import baseDomain from "../../../common/baseDomain";
import { getLocal } from "../../../common/localStorageAccess";
import MetaHelmet from "../../../common/MetaHelmet";
import InputField from "../Browse/InputField";
import AdvancedDrop from "../Browse/NewCourse/CoursePlacement/AdvancedDrop/AdvancedDrop";
import SelectDrop from "../Browse/SelectDrop";
import TextArea from "../Browse/TextArea";
import Share from "../Videos/Share";
import BreadCrumbs from "./BreadCrumbs";
import Testimonial from "./Testimonial/Testimonial";
import Module from "./Module";
import Rate from "./Rate/Rate";
import Review from "./Review/Review";
import CourseCard from "../../../Home/Tabs";
import { Post, Get, NotificationPermission, swalWithAuth } from "../../../common/common";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import firebase from "../../../common/init-fcm";
import { connect } from "react-redux";
import Project from "./Project/Project";
import Checkbox from "@material-ui/core/Checkbox";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { notify } from "../../Navbar/notify";
import TopBar from "./TopBar/TopBar";
import ProcessKeys from "./ProcessKeys/ProcessKeys";
import RequestCourse from "./RequestCourse/RequestCourse";
import { Link } from "react-router-dom";
import ForumOutlinedIcon from "@material-ui/icons/ForumOutlined";
import { COURSE_ENROLL_KEYS, RATE_KEYS } from "./globalData";
import GoLive from "./GoLive/GoLive";
import GoLiveBar from "./GoLive/GoLiveBar";
import Syllabus from "./Syllabus/Syllabus";

// import * as jsonData from "./course.json";
var jsonData = require("./course.json");

const PrimaryRadio = withStyles({
  root: {
    color: "#000000",
    "&$checked": {
      color: "#6646E7",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const useStyles = makeStyles((theme) => ({
  bookmark: {
    width: "42px",
  },
  icon: {
    marginRight: "3px",
    fontSize: "14px",
  },
  fishEye: {
    marginRight: "3px",
    fontSize: "8px",
  },
  topMiddle: {
    display: "flex",
    flexDirection: "column",
  },
  topRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  metaData: {
    "& svg": {
      fontSize: "12px",
    },
    "& img": {
      width: "12px",
      height: "auto",
    },
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseCompleteTitle: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  DialogGridItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  DialogGridCard: {
    textAlign: "center",
    boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: "14px",
    height: "100%",
    padding: "0 !important",
  },
  CardDesc: {
    color: "#686868",
    fontSize: "12px",
    marginTop: "0.5rem",
  },
  GridCard: {
    height: "100%",
    padding: "0 0.7rem",
  },
  CardContent: {
    padding: "10px !important",
  },
  cardMedia: {
    width: "100%",
    height: "auto",
    padding: "0.5rem 0.5rem 0 0.5rem",
  },
  dialogBG: {
    backgroundImage: `url(${BenefitOpenBG})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "650px",
  },
  dialog: {
    width: "650px",
  },
  clickableTopRight: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  creatorAvatar: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    padding: "2px",
    border: "3px solid #F1EDFF",
  },
  paper: {
    borderRadius: "16px",
    width: "650px",
    padding: "5px",
  },
  upload: {
    color: "black",
    background: "white",
    borderRadius: "16px",
    paddingLeft: "15px",
    paddingRight: "15px",
    textTransform: "capitialize",
  },
  closeIcon: { color: "white" },
  closeIconTwo: { color: "black" },
  input: {
    display: "none",
  },
  moduleContent: {
    display: "flex",
    flexDirection: "column",
  },
  accordian: {
    borderRadius: "10px !important",
    boxShadow: "none !important",
    backgroundColor: "#fafafa",
  },
  accordianSummary: {
    background: "#F1EDFF",
    borderRadius: "10px",
    alignItems: "flex-start",
  },
  container: {
    marginTop: "8px",
    background: "#fafafa",
    border: "1px solid #686868",
    borderRadius: "20px",
    width: "100%",
    padding: "8.5px 15px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1d1d1d",
  },

  items: {
    display: "inline-block",
    marginRight: "5px",
    cursor: "pointer",
  },

  inputKeyword: {
    outline: "none",
    border: "none",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    width: "100%",
  },

  tag: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 8px",
    background: "#E8E8E8",
    borderRadius: "38px",
    height: "30px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1D1D1D",
    margin: "3px 0px",
  },
  description: {
    whiteSpace: "pre-line",
    wordBreak: "break-word",
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "3",
    overflow: "hidden",
  },
  showMoreActive: {
    "-webkit-line-clamp": "unset",
  },
  topLeft: {
    marginRight: "10px",
  },
  endorseTick: {
    color: "var(--color3)",
    marginLeft: "8px",
    width: "20px",
    height: "20px",
    minWidth: "20px",
    minHeight: "20px",
    fill: "currentColor",
    verticalAlign: "middle",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  showMore: {
    alignSelf: "flex-start",
    marginLeft: "-5px",
  },
  checkbox: {
    fill: "red",
    "&$checked": {
      fill: "red",
      color: "#77AF44",
    },
  },
  checked: {},
}));

function CourseDetail(props) {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = new React.createRef();
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [course, setCourse] = useState({
    id: "",
    creator: "",
    title: "",
    course_level: null,
    level: null,
    parent_id: null,
    created_at: null,
    updated_at: null,
    visibility: "",
    user_id: "",
    image_url: null,
    rating_sum: null,
    rated_user: null,
    video_count: null,
    total_time: null,
    description: null,
    slug: "",
    num_categories: null,
    num_modules: null,
    num_videos: null,
    modules: [],
    user_actions: [],
    keywords: [],
  });
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [courseRating, setCourseRating] = useState(0);
  const [firstVideo, setFirstVideo] = useState(null);
  const [openAddModule, setOpenAddModule] = useState(false);
  const [addModuleTitle, setAddModuleTitle] = useState("");
  const [courseTime, setCourseTime] = useState("");

  // Course Edit
  const [isNewCourseFormShow, setIsNewCourseFormShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState();
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");
  const [courseLevel, setCourseLevel] = useState();
  const [image, setImage] = useState();
  const [showImage, setShowImage] = useState();
  const [sendImage, setSendImage] = useState();
  const [courseType, setCourseType] = useState();
  const [parentId, setParentId] = useState();

  const [draggedVideo, setDraggedVideo] = useState(null);
  const [dragModule, setDragModule] = useState(null);

  const [courseId, setCourseId] = useState();
  const [dropBreadcrumbs, setDropBreadcrumbs] = useState("");
  const [openDrop, setOpenDrop] = React.useState(false);
  const [openSmallDrop, setOpenSmallDrop] = React.useState(false);
  const [oldType, setOldType] = useState();
  const [openHowToComplete, setOpenHowToComplete] = useState(false);
  const [openViewProjects, setOpenViewProjects] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [processActiveStep, setProcessActiveStep] = useState(0);

  const [isCompleted, setIsCompleted] = useState(course.user_actions[0]?.pivot?.is_completed ? true : false);
  const [isCompletedModal, setIsCompletedModal] = useState(course.user_actions[0]?.pivot?.is_completed ? true : false);

  const [courseSkills, setCourseSkills] = useState([]);
  const [dailyStreak, setDailyStreak] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [streakData, setStreakData] = useState({
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        label: "Daily Streak",
        data: dailyStreak,
        fill: false,
        backgroundColor: "#5133CC",
        borderColor: "rgba(82, 51, 204, 0.4)",
      },
    ],
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      window.scrollTo(0, 0);
      setLoading(true);
      await update();
      const query = new URLSearchParams(props.location.search);
      const new_course = query.get("new");
      if (new_course === "true") {
        NotificationPermission(props.match.params.slug);
        await update();
      }
    }
    fetchData();
  }, [props.match.params.slug]);

  const handleKeyProcess = () => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      setIsProcessModalOpen(true);
      // alert("hello")
    }
  };

  const handleEnroll = () => {
    // console.log("enroll");
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.addCatagory}?category_id=${course.id}`;
      axios({
        url: url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
        .then((response) => {
          setCourse({
            ...course,
            user_actions: response.data.data.user_actions,
          });

          history.push(`/set-target?course_slug=${course?.slug}`);

          setTimeout(() => {
            notify(`🔑 You spent ${COURSE_ENROLL_KEYS} keys by enrolling in a course`);
          }, 1000);
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oopss!!", "You do not have enough keys to enroll in the course.", "error");
          }
          setIsProcessModalOpen(false);
          setProcessActiveStep(0);
        });
    }
  };

  const courseEditModalClose = () => {
    setIsNewCourseFormShow(false);
    setTitle(course.title);
    setType(course.type);
    setCourseType(course.type === "0" ? "topic" : "class");
    setDescription(course.description);
    setCourseLevel(course.course_level);
    setImage(course.image_url);
    setShowImage(course.image_url);
    setParentId(course.parent_id);
    let lcl_keys = [];
    course.keywords.map((key) => (lcl_keys = [...lcl_keys, key.keyword]));
    setKeywords(lcl_keys);
  };

  const handleUnEnroll = () => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        }
      });
    } else {
      swal({
        title: "Unenroll Course",
        text: "Are you sure that you want to unenroll this course?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.addCatagory}?category_id=${course.id}`;
          axios({
            url: url,
            method: "POST",
            headers: {
              Authorization: `Bearer ${access}`,
            },
          })
            .then((response) => {
              setCourse({
                ...course,
                user_actions: response.data.data.user_actions,
              });
              swal("Enrollment Reverted", "", "success", {
                buttons: true,
                dangerMode: true,
              });
            })
            .catch((error) => console.log(error.message));
        }
      });
    }
  };

  const handleCourseRating = (value) => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.catagoryRating}?category_id=${course.id}&rating=${value}`;
      axios({
        url: url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
        .then((response) => {
          console.log(response.data);

          setCourse({
            ...course,
            rating_sum: response.data.data.rating_sum,
          });
          setCourse({
            ...course,
            rated_user: response.data.data.rated_user,
          });

          if (response.data.data.rated_user) {
            setCourseRating(response.data.data.rating_sum / response.data.data.rated_user);
          }

          // swal("Rating Updated", "", "success", {
          //   buttons: true,
          //   dangerMode: true,
          // });

          notify(`🔑 You got ${RATE_KEYS} keys for rating a course.`);
        })
        .catch((error) => console.log(error.message));
    }
  };

  const redirectProfile = () => {
    if (course.is_playlist) {
      window.open("https://www.youtube.com/channel/" + course.channel.channel_id, "_blank").focus();
    } else history.push(`/dashboard/profile/${encodeURIComponent(course.creator.slug)}`);
  };
  const handleWatch = () => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      history.push("/dashboard/videos/" + firstVideo + "?course=" + encodeURIComponent(course.slug));
    }
  };
  const handleWatchEvent = () => {
    if (localStorage.getItem("role_id") == 2) {
      return;
    }
    if (localStorage.getItem("role_id") == 1) {
      for (let i = 0; i < course.modules.length; i++) {
        let videos = course.modules[i].videos;
        for (let j = 0; j < videos.length; j++) {
          if (videos[j].watched_status.length === 0 && videos[j].watched_until.length === 0) {
            return (
              <Link
                to={"/dashboard/videos/" + videos[j].url + "?course=" + encodeURIComponent(course.slug)}
                className="watchBtn"
              >
                {i === 0 && j === 0 ? "Start Course" : "Continue watching"}
              </Link>
            );
          } else if (videos[j].watched_status.length === 0) {
            return (
              <Link
                to={
                  "/dashboard/videos/" +
                  videos[j].url +
                  "?course=" +
                  encodeURIComponent(course.slug) +
                  "&start=" +
                  (videos[j].watched_until[0]?.end_time ?? 0)
                }
                className="watchBtn"
              >
                {i === 0 && j === 0 ? "Start Course" : "Continue watching"}
              </Link>
            );
          }
        }
      }
    } else {
      return (
        <button onClick={handleEndorse} className="enrollBtn">
          Endorse
        </button>
      );
    }
  };

  async function update() {
    // window.scrollTo(0, 0);
    // const query = new URLSearchParams(props.location.search);
    // const course = decodeURI(props.match.params.slug);
    let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.getCourseDetails}?course_slug=${props.match.params.slug}`;
    setAddModuleTitle("");
    await axios({
      url: url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data.breadcrumbs.length) {
          let lclBreadcrumbs = response.data.data?.breadcrumbs[0].reverse();
          let currentBreadcrumb = {};
          lclBreadcrumbs = [...lclBreadcrumbs, currentBreadcrumb];
          setBreadcrumbs(lclBreadcrumbs);
        }
        if (response.data.data.course) {
          setCourse(response.data.data.course);
          setReviews(response.data.data.reviews);
          setStats(response.data.data.stats);

          if (response.data.data.course.modules[0]) {
            if (response.data.data.course.modules[0].videos[0]) {
              if (response.data.data.course.modules[0].videos[0].url) {
                setFirstVideo(response.data.data.course.modules[0].videos[0].url);
              }
            }
          }

          if (response.data.data.course.rated_user) {
            setCourseRating(response.data.data.course.rating_sum / response.data.data.course.rated_user);
          }

          let mod_course = response.data.data.course;

          setTitle(mod_course.title);
          setType(mod_course.type);
          // setCourseType(mod_course.type === "0" ? "topic" : "class");
          setCourseType(mod_course.type === "0" ? "topics" : "classes");
          setOldType(mod_course.type);
          setDescription(mod_course.description);
          setCourseLevel(mod_course.course_level);
          setImage(mod_course.image_url);
          setShowImage(mod_course.image_url);
          setParentId(mod_course.parent_id);
          let lcl_keys = [];
          mod_course.keywords.map((key) => (lcl_keys = [...lcl_keys, key.keyword]));
          setKeywords(lcl_keys);

          let value = "";
          response.data.data.breadcrumbs[0].reverse().forEach((e, i) => {
            if (i !== 0) value += " > ";
            value += e.title ?? "";
          });
          setDropBreadcrumbs(value);

          // if (mod_course.type === "0") {
          //   getTopicBreadCrumbs(mod_course.parent_id);
          // } else {
          //   getBreadCrumbs(mod_course.parent_id);
          // }

          //duration logic
          let lcl_tt = Math.ceil(response.data.data.course.total_time / 60);
          if (lcl_tt < 60) {
            setCourseTime(lcl_tt + " minutes");
          } else {
            let lcl_tt_h = Math.floor(lcl_tt / 60);
            let lcl_tt_m = lcl_tt % 60;
            if (lcl_tt_m !== 0) {
              lcl_tt_h === 1
                ? lcl_tt_m === 1
                  ? setCourseTime(lcl_tt_h + " hour " + lcl_tt_m + " minute")
                  : setCourseTime(lcl_tt_h + " hour " + lcl_tt_m + " minutes")
                : lcl_tt_m === 1
                ? setCourseTime(lcl_tt_h + " hours " + lcl_tt_m + " minute")
                : setCourseTime(lcl_tt_h + " hours " + lcl_tt_m + " minutes");
            } else {
              lcl_tt_h === 1 ? setCourseTime(lcl_tt_h + " hour") : setCourseTime(lcl_tt_h + " hours");
            }
          }

          // data logic
          let date1 = new Date(response.data.data.course.updated_at);
          const date2 = new Date();
          let diffTime = Math.floor((date2 - date1) / 1000);
          if (diffTime < 60) {
            diffTime === 1 ? setDate(`${diffTime} second ago`) : setDate(`${diffTime} seconds ago`);
          } else if (diffTime < 60 * 60) {
            diffTime = Math.floor(diffTime / 60);
            diffTime === 1 ? setDate(`${diffTime} minute ago`) : setDate(`${diffTime} minutes ago`);
          } else if (diffTime < 60 * 60 * 24) {
            diffTime = Math.floor(diffTime / (60 * 60));
            diffTime === 1 ? setDate(`${diffTime} hour ago`) : setDate(`${diffTime} hours ago`);
          } else if (diffTime < 60 * 60 * 24 * 30) {
            diffTime = Math.floor(diffTime / (60 * 60 * 24));
            diffTime === 1 ? setDate(`${diffTime} day ago`) : setDate(`${diffTime} days ago`);
          } else if (diffTime < 60 * 60 * 24 * 30 * 12) {
            diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30));
            diffTime === 1 ? setDate(`${diffTime} month ago`) : setDate(`${diffTime} months ago`);
          } else {
            diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
            diffTime === 1 ? setDate(`${diffTime} year ago`) : setDate(`${diffTime} years ago`);
          }
          setLoading(false);
          let element = document.getElementById("description");
          if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
            // your element has an overflow
            // show read more button
            setShowMoreButton(true);
          } else {
            // your element doesn't have overflow
            setShowMoreButton(false);
          }
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

    let dailyStreakURL = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.getStreaks}?course_slug=${props.match.params.slug}`;
    await axios({
      url: dailyStreakURL,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((res) => {
        const dailyData = res.data.data;
        let ds = dailyStreak;

        for (let i = 0; i < dailyData.length; i++) {
          ds[new Date(dailyData[i].date).getDay()] = 1;
        }

        setStreakData({
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: [
            {
              label: "Daily Streak",
              data: ds,
              fill: false,
              backgroundColor: "#5133CC",
              borderColor: "rgba(82, 51, 204, 0.4)",
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const removeCourse = async (id) => {
    swal({
      title: "Remove Course",
      text: "Are you sure you want to remove this course?",
      icon: "warning",
      buttons: ["NO", "YES"],
      dangerMode: true,
    }).then((ok) => {
      if (ok) {
        axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.removeCatagory}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
          data: {
            category_id: course.id,
          },
        })
          .then(() => {
            swal("Course Removed", "course is removed successfully", "success");
            history.push("/dashboard");
          })
          .catch((e) => {
            console.log(e);
            swal("Error", e.response.data.message, "error");
          });
      }
    });
  };

  const editCourse = async () => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image && image !== showImage) {
      formData.append("image", sendImage);
    }
    formData.append("course_level", courseLevel);
    console.log(courseLevel);
    formData.append("parent_id", parentId);
    keywords.forEach((e, i) => {
      formData.append(`keywords[${i}]`, e);
    });
    formData.append("course_id", course.id);

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.editCourse}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: formData,
    })
      .then(async (response) => {
        let res = response.data.data;
        console.log(res);
        setIsNewCourseFormShow(false);
        if (courseId) {
          await changeType();
        } else {
          swal("Success", "Course updated successfully", "success").then((ok) => {
            if (ok) {
              // var queryParams = new URLSearchParams(window.location.search);
              // Set new or modify existing parameter value.
              // queryParams.set("course", res.slug);
              // Replace current querystring with the new one.
              // window.history.replaceState(null, null, "?" + queryParams.toString());
              // window.history.pushState(null, null, "?" + queryParams.toString());
              window.history.replaceState(null, null, "/dashboard/course/" + res.slug);
              window.location.href = "/dashboard/course/" + res.slug;
            }
          });
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        swal("Error", e.response.data.message, "error");
      });
  };

  const changeType = async () => {
    let data = { course_id: course.id };
    if (type == "0") data["topic_id"] = courseId;
    else data["category_id"] = courseId;
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.moveCourse}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: data,
    }).then((response) => {
      let res = response.data.data;

      swal("Success", "Course updated successfully", "success").then((ok) => {
        if (ok) {
          // var queryParams = new URLSearchParams(window.location.search);
          // // Set new or modify existing parameter value.
          // queryParams.set("course", res.slug);
          // // Replace current querystring with the new one.
          // window.history.replaceState(null, null, "?" + queryParams.toString());
          // window.history.pushState(null, null, "?" + queryParams.toString());
          // window.location.reload();
          window.history.replaceState(null, null, "/dashboard/course/" + res.slug);
          window.location.href = "/dashboard/course/" + res.slug;
        }
      });
    });
  };

  const submitAddModule = () => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.addModule}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: course.id,
        title: addModuleTitle,
        // description: moduleDescription,
      },
    })
      .then((data) => {
        swal("Module Added", "Module is added successfully", "success");
        setOpenAddModule(false);
        update();
        setAddModuleTitle("");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const redirect = (event, level, parent, slug, video_count, categories) => {
    event.stopPropagation();
    // const query = new URLSearchParams(props.location.search);
    // const type = query.get("type");
    let type = course.type;
    if (type === "1") {
      type = "classes";
    } else {
      type = "topics";
    }
    event.stopPropagation();
    if (type === "classes") {
      if (!categories && !video_count && level <= 2) {
        history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    } else {
      if (categories === undefined) history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      else if (!categories && !video_count && level <= 2) {
        history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    }
  };

  const dragStart = (video_url, module_id) => {
    setDraggedVideo(video_url);
    setDragModule(module_id);
  };

  const changeOrder = (e) => {
    let new_module = parseInt(e.to.parentElement.id);
    let new_order = e.newIndex + 1;
    let url = `${baseDomain.route}${baseDomain.subRoute}/change_module_video_ordering`;
    let headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    // console.log(
    //   draggedVideo,
    //   dragModule,
    //   e.oldIndex,
    //   e.newIndex,
    //   e.to.parentElement.id
    // );

    if (new_module === dragModule && e.oldIndex !== e.newIndex) {
      axios({
        method: "POST",
        url: url,
        headers: headers,
        data: {
          module_id: dragModule,
          video_url: draggedVideo,
          new_order: new_order,
        },
      })
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
          swal("Error", error.message, "error");
          update();
        });
    } else if (new_module !== dragModule) {
      axios({
        method: "POST",
        url: url,
        headers: headers,
        data: {
          module_id: dragModule,
          video_url: draggedVideo,
          new_order: new_order,
          new_module: new_module,
        },
      })
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
          swal("Error", error.message, "error");
          update();
        });
    }
  };

  const handleInputChange = (evt) => {
    setInput(evt.target.value);
  };

  const handleInputKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      const { value } = evt.target;
      if (value.length > 0) {
        setKeywords([...keywords, value]);
        setInput("");
      }
    }

    if (keywords.length && evt.keyCode === 8 && !input.length) {
      setKeywords(keywords.slice(0, keywords.length - 1));
    }
  };

  const handleRemoveItem = (index) => {
    return () => {
      setKeywords(keywords.filter((word, i) => i !== index));
    };
  };

  const getBreadCrumbs = (parentId) => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.courseBreadcrumbs}?parent_id=${parentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        let value = "";
        setCourseId(parentId);
        res.breadcrumbs.reverse().forEach((e, i) => {
          if (i !== 0) value += " > ";
          value += e.title ?? "";
        });
        setDropBreadcrumbs(value);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getTopicBreadCrumbs = (parentId) => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.topicBreadcrumbs}?parent_id=${parentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        // console.log(res);
        let value = "";
        setCourseId(parentId);
        res.reverse().forEach((e, i) => {
          if (i !== 0) value += " > ";
          value += e.title ?? "";
        });
        setDropBreadcrumbs(value);
        // setValueError("");
      })
      .catch((e) => {
        // console.log(e);
      });
  };
  const handleEndorse = async () => {
    if (!localStorage.getItem("access_token")) {
      swalWithAuth("Please Sign-in to continue", 2);
    } else {
      setOpenRateDialog(true);
      await Post(1, "add_course_endorsement", {
        category_id: course.id,
        rating: 1,
      });
      update();
    }
  };
  const handleUnEndorse = async () => {
    await Post(1, "remove_course_endorsement", { category_id: course.id });
    update();
  };
  const handleRateClose = (Update) => {
    setOpenRateDialog(false);
    if (Update) {
      update();
    }
  };

  const handleNotificationClick = async () => {
    await NotificationPermission(course.slug);
    console.log(course.slug);
    // let course_updated = JSON.parse(JSON.stringify(course));
    // course_updated.user_actions[0].pivot.notification = 1;
    // console.log("Access token of email"+localStorage.getItem("email")+"is"+localStorage.getItem("access_token"));
    // setCourse(course_updated);
    await update();
  };
  const handleNotificationOffClick = async () => {
    if (firebase.messaging.isSupported()) {
      props.showSuccess("Notifications turned OFF !");
      await Post(1, "add_category_notification", {
        course_slug: encodeURIComponent(course.slug),
      });
      // console.log("Access token of email"+localStorage.getItem("email")+"is"+localStorage.getItem("access_token"));
      update();
    } else {
      console.log("Firebase messaging not supported");
      props.showWarning("Firebase messaging not supported");
    }
  };

  const handleShowMoreClick = () => {
    setShowMore((prev) => !prev);
  };
  const handleStartChat = async () => {
    history.push(`/chat/${course.title}/${course.id}`);
    // history.push("/dashboard");
  };
  try {
    return loading ? (
      <div className="loader">
        <CircularProgress />
      </div>
    ) : (
      <>
        <TopBar
          course={course}
          handleNotificationClick={handleNotificationClick}
          handleNotificationOffClick={handleNotificationOffClick}
          handleUnEndorse={handleUnEndorse}
          handleEndorse={handleEndorse}
          handleUnEnroll={handleUnEnroll}
          handleEnroll={handleKeyProcess}
        />
        <GoLiveBar course={course} />
        <div className="coursePage">
          <ProcessKeys
            isOpen={isProcessModalOpen}
            setIsOpen={setIsProcessModalOpen}
            handleEnroll={handleEnroll}
            course={course?.title}
            slug={course?.slug}
            activeStep={processActiveStep}
            setActiveStep={setProcessActiveStep}
          />

          <MetaHelmet
            title={course.title}
            description={course.description}
            image={course.image_url ? course.image_url : ""}
          />
          {openRateDialog && (
            <Rate
              open={openRateDialog}
              handleClose={handleRateClose}
              course={course}
              setLoading={() => {
                setLoading(true);
              }}
              value={courseRating}
            />
          )}
          <BreadCrumbs breadCrumbs={breadcrumbs} redirect={redirect} courseTitle={course.title} type={course?.type} />
          <div className="courseDetail" style={{ marginTop: "20px" }}>
            <Grid container>
              <Grid className={classes.topLeft}>
                {course.image_url && (
                  <div className="courseIconBG">
                    <img className="courseIcon" src={course.image_url} alt="course" />
                  </div>
                )}
              </Grid>
              <div className="flex-grow d-flex">
                <div className="class_details">
                  <Box className={classes.topMiddle} mx={1}>
                    <Typography variant="h6" component="div">
                      <Box fontWeight={500} mb={1} className={classes.title}>
                        <p>
                          {course.title}
                          {course.num_endorsements > 0 && (
                            <Tooltip
                              title={
                                <div className="endorsed_text">
                                  {course.num_endorsements +
                                    " " +
                                    (course.num_endorsements > 1 ? "experts " : "expert ")}
                                  <strong>endorsed </strong>
                                  this course.
                                </div>
                              }
                              arrow
                              enterTouchDelay={1}
                            >
                              {/* <CheckCircleIcon className={classes.endorseTick} /> */}
                              <EndorseTick className={classes.endorseTick} />
                            </Tooltip>
                          )}
                        </p>
                      </Box>
                    </Typography>
                    <Typography variant="caption" component="div">
                      <Box
                        fontSize={14}
                        color="#686868"
                        className={classes.description + " " + (showMore ? classes.showMoreActive : "")}
                        id="description"
                      >
                        {course.description}
                      </Box>
                    </Typography>
                    <div className="spacing-half"></div>
                    {showMoreButton && (
                      <Button color="primary" size="small" className={classes.showMore} onClick={handleShowMoreClick}>
                        {showMore ? "SHOW LESS" : "SHOW MORE"}
                      </Button>
                    )}
                    <div className="spacing-half"></div>
                    <Box component="div" mt={2} borderColor="transparent">
                      <Rating
                        icon={<StarRoundedIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                        value={courseRating}
                        onChange={(event, value) => {
                          setCourseRating(value);

                          setOpenRateDialog(true);
                        }}
                      />
                    </Box>
                    <Grid container direction="row" alignItems="center">
                      <VisibilityOutlinedIcon className={classes.icon} fontSize="inherit" />
                      <Typography variant="caption" component="div">
                        <Box fontSize={12} mr={2}>
                          {course.total_views} Views
                        </Box>
                      </Typography>
                      <FiberManualRecordRoundedIcon className={classes.fishEye} />
                      <Typography component="div">
                        <Box fontSize={12}>{date}</Box>
                      </Typography>
                    </Grid>
                  </Box>

                  <Grid className={classes.topRight} item>
                    <Grid
                      container
                      direction="column"
                      alignItems="flex-end"
                      onClick={redirectProfile}
                      className={classes.clickableTopRight}
                    >
                      {course.is_playlist ? (
                        <img src={course.channel.avatar} className={classes.creatorAvatar} alt="beyond exams" />
                      ) : (
                        <img src={course.creator.avatar} className={classes.creatorAvatar} alt="beyond exams" />
                      )}
                      <Typography variant="caption">
                        <Box mt={1} fontSize={10} textAlign="right">
                          {course.is_playlist ? "Playlist by" : "Created by"}
                        </Box>
                      </Typography>
                      <Typography variant="caption">
                        <Box fontSize={10} fontWeight={600} textAlign="right">
                          {course.is_playlist ? course.channel.channel_title : course.creator.name}
                        </Box>
                      </Typography>
                    </Grid>
                    <Box mt={3}>
                      <Grid container alignItems="center" justify="flex-end">
                        {localStorage.getItem("role_id") === "2" &&
                          course.user_id.toString() === localStorage.getItem("phoenix_user_id") && (
                            <>
                              <IconButton onClick={() => setIsNewCourseFormShow(true)}>
                                <Edit className="module-edit-icon" />
                              </IconButton>
                              <IconButton onClick={() => removeCourse()}>
                                <img
                                  src={require(`../../../../assets/images/icons/${jsonData.images.delete}`)}
                                  alt=""
                                  className="module-delete-icon"
                                />
                              </IconButton>
                            </>
                          )}
                      </Grid>
                    </Box>
                  </Grid>
                </div>

                {/* <div className="courseDetails_right">
                <div className="course_process">
                  <div className="infoSection">
                    <InfoOutlinedIcon />
                    <span>
                      &nbsp;<u>How to complete a course?</u>
                    </span>
                  </div>

                  <div className="completion-process">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={course.user_actions[0]?.pivot?.is_enrolled ? true : false}
                          color="primary"
                          icon={<CircleUnchecked />}
                          checkedIcon={<CircleChecked />}
                          onChange={!course.user_actions[0]?.pivot?.is_enrolled ? handleEnroll : undefined}
                          classes={{ root: classes.checkbox, checked: classes.checked }}
                        />
                      }
                      label="Enroll"
                      style={{ color: course.user_actions[0]?.pivot?.is_enrolled ? "#77af44" : undefined }}
                    />

                    <div className={`border ${course.user_actions[0]?.pivot?.is_enrolled && "done-course-obj"}`}></div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={course.user_actions[0]?.pivot?.is_completed ? true : false}
                          color="primary"
                          icon={<CircleUnchecked />}
                          checkedIcon={<CircleChecked />}
                          onChange={!course.user_actions[0]?.pivot?.is_completed ? handleWatch : undefined}
                          classes={{ root: classes.checkbox, checked: classes.checked }}
                        />
                      }
                      label="Watch all videos"
                      style={{ color: course.user_actions[0]?.pivot?.is_completed ? "#77af44" : undefined }}
                    />

                    <div className={`border ${course.user_actions[0]?.pivot?.is_completed && "done-course-obj"}`}></div>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review
                              ? true
                              : false
                          }
                          color="primary"
                          icon={<CircleUnchecked />}
                          checkedIcon={<CircleChecked />}
                          classes={{ root: classes.checkbox, checked: classes.checked }}
                          onChange={
                            !(course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review)
                              ? () => {
                                  if (localStorage.getItem("access_token")) {
                                    setOpenRateDialog(true);
                                  } else {
                                    swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((ok) => {
                                      if (ok) {
                                        return (window.location.href = "/login");
                                      }
                                    });
                                  }
                                }
                              : undefined
                          }
                        />
                      }
                      style={{
                        color:
                          course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review
                            ? "#77af44"
                            : undefined,
                      }}
                      label="Provide a rating and review of the course"
                    />

                    <div
                      className={`border ${
                        course.user_actions[0]?.pivot?.rating &&
                        course.user_actions[0]?.pivot?.review &&
                        "done-course-obj"
                      }`}
                    ></div>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={course.user_actions[0]?.pivot?.project_submitted ? true : false}
                          color="primary"
                          icon={<CircleUnchecked />}
                          checkedIcon={<CircleChecked />}
                        />
                      }
                      style={{
                        coloe: course.user_actions[0]?.pivot?.project_submitted ? "#77af44" : undefined,
                      }}
                      label="Submit a project for the course"
                      classes={{ root: classes.checkbox, checked: classes.checked }}
                      onChange={
                        !course.user_actions[0]?.pivot?.project_submitted
                          ? () => {
                              setOpenViewProjects(true);
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>

                {course.user_actions[0]?.pivot?.is_enrolled ? (
                  <div className="daily_streak">
                    <a href={`/set-target?course_slug=${course.slug}`} className="edit_schedule">
                      Edit Schedule
                    </a>
                    <Line data={streakData} options={options} />
                    <p className="daily_streak_para">Days</p>
                  </div>
                ) : (
                  <></>
                )}
              </div> */}
              </div>

              <div className="enrollSection">
                <div className="enrollSection-btns">
                  {localStorage.getItem("role_id") === "2" ? (
                    course.user_actions[0]?.pivot?.has_endorsed ? (
                      <button onClick={handleUnEndorse} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                        {jsonData.buttons.endorsed}
                      </button>
                    ) : (
                      <button onClick={handleEndorse} className="enrollBtn">
                        {jsonData.buttons.endorse}
                      </button>
                    )
                  ) : course.user_actions[0]?.pivot?.is_enrolled === 1 ? (
                    <button onClick={handleUnEnroll} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                      {jsonData.buttons.enrolled}
                    </button>
                  ) : (
                    <div className="enrollBox">
                      <p>will cost you {COURSE_ENROLL_KEYS} keys</p>
                      <button onClick={handleKeyProcess} className="enrollBtn">
                        {jsonData.buttons.enroll}
                      </button>
                    </div>
                  )}

                  {handleWatchEvent()}

                  {localStorage.getItem("access_token") && (
                    <button onClick={handleStartChat} className="watchBtn">
                      <ForumOutlinedIcon style={{ fontSize: "25px" }} />
                      {jsonData.buttons.chat}
                    </button>
                  )}
                  {/* <GoLive course={course} /> */}

                  {/* {localStorage.getItem("access_token") && (
                  <button
                    onClick={() => {
                      setOpenRateDialog(true);
                    }}
                    className="watchBtn"
                  >
                    <StarOutlineRoundedIcon style={{ fontSize: "25px" }} /> Rate
                  </button>
                )} */}

                  {localStorage.getItem("access_token") &&
                    (course.user_actions[0]?.pivot?.notification === 0 ? (
                      <button className="notificationBtn" onClick={handleNotificationClick}>
                        <NotificationsOffIcon />
                      </button>
                    ) : (
                      <button className="NotificationsActiveBtn" onClick={handleNotificationOffClick}>
                        <NotificationsActiveIcon fontSize="inherit" />
                      </button>
                    ))}

                  <Share
                    isVideo={false}
                    share={window.location.href}
                    title={course.title
                      .replace(/&#39;/g, "'")
                      .replace(/&amp;/g, "&")
                      .replace(/&quot;/g, "'")}
                  >
                    <button className="watchBtn">{jsonData.buttons.share}</button>
                  </Share>
                </div>
                {/* <div className="infoSection">
                <InfoOutlinedIcon />
                <span
                  onClick={() =>
                  {
                    setOpenHowToComplete(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  &nbsp;<u>Benefits of enrollment</u>
                  &nbsp;<u>How to complete a course?</u>
                </span>
              </div> */}
              </div>

              <div className="enrollSection_mobile">
                {localStorage.getItem("role_id") === "2" ? (
                  course.user_actions[0]?.pivot?.has_endorsed ? (
                    <button onClick={handleUnEndorse} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                      {jsonData.buttons.endorsed}
                    </button>
                  ) : (
                    <button onClick={handleEndorse} className="enrollBtn">
                      {jsonData.buttons.endorse}
                    </button>
                  )
                ) : course.user_actions[0]?.pivot?.is_enrolled === 1 ? (
                  <button onClick={handleUnEnroll} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                    {jsonData.buttons.enrolled}
                  </button>
                ) : (
                  <div className="enrollBox">
                    <p>will cost you {COURSE_ENROLL_KEYS} keys</p>
                    <button onClick={handleKeyProcess} className="enrollBtn">
                      {jsonData.buttons.enroll}
                    </button>
                  </div>
                )}
                <div className="infoSection">
                  <InfoOutlinedIcon />
                  <span
                    // onClick={handleClickOpen}
                    onClick={() => {
                      setOpenHowToComplete(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {/* &nbsp;<u>Benefits of enrollment</u> */}
                    &nbsp;<u>{jsonData.section.careerChoice.info}</u>
                  </span>
                </div>
                {/* <GoLive course={course} /> */}
                {handleWatchEvent()}
                {localStorage.getItem("access_token") && (
                  <button onClick={handleStartChat} className="watchBtn">
                    <ForumOutlinedIcon style={{ fontSize: "25px" }} /> {jsonData.buttons.chat}
                  </button>
                )}
                <Share
                  share={window.location.href}
                  title={course.title
                    .replace(/&#39;/g, "'")
                    .replace(/&amp;/g, "&")
                    .replace(/&quot;/g, "'")}
                >
                  <button className="watchBtn">{jsonData.buttons.share}</button>
                </Share>
                {/* <div className="rate_mobile_div">
                {localStorage.getItem("access_token") && (
                  <button
                    onClick={() => {
                      setOpenRateDialog(true);
                    }}
                    className="watchBtn"
                  >
                    <StarOutlineRoundedIcon style={{ fontSize: "25px" }} /> Rate
                  </button>
                )}
                {localStorage.getItem("access_token") &&
                  (course.user_actions[0]?.pivot?.notification === 0 ? (
                    <button className="notificationBtn" onClick={handleNotificationClick}>
                      <NotificationsOffIcon />
                    </button>
                  ) : (
                    <button className="NotificationsActiveBtn" onClick={handleNotificationOffClick}>
                      <NotificationsActiveIcon fontSize="inherit" />
                    </button>
                  ))}
              </div> */}
              </div>
            </Grid>

            <div className="course-skills-wrapper">
              {/* <h1>Skills you will gain </h1> */}

              <div className="course-skills">
                {courseSkills?.map((skill) => (
                  <div className="course-skill">{skill}</div>
                ))}
              </div>
            </div>
            <div className={styles.career}>
              <div className={styles.careerLeft}>
                <h2>{jsonData.section.careerChoice.title}</h2>
                <p>{jsonData.section.careerChoice.description}</p>
                <div className={styles.careerBtn}>
                  <button className={styles.careerWhatsapp}>
                    <a
                      href="https://api.whatsapp.com/send?phone=917897862663"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {jsonData.buttons.whatsapp}{" "}
                      <img src={require(`../../../../assets/images/icons/${jsonData.images.whatsapp}`)} />
                    </a>
                  </button>
                </div>
              </div>
              <div className={styles.finalRight + " " + styles.careerRight}>
                <img src={require(`../../../../assets/images/icons/${jsonData.images.careerChoice}`)} alt="" />
              </div>
            </div>

            <hr className="courseDivider" />

            {isCompleted && (
              <>
                <div className="course-complete-box">
                  <img
                    src={require(`../../../../assets/images/images/${jsonData.images.courseComplete}`)}
                    alt="congratulations"
                  />

                  <h2>{jsonData.dialog.greet}</h2>
                  <p>
                    {jsonData.dialog.CourseCompleted}
                    <strong>{course.title}</strong>
                  </p>

                  <Rating
                    icon={<StarRoundedIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                    name="read-only"
                    value={courseRating}
                    onChange={(event, value) => {
                      setCourseRating(value);
                      setOpenRateDialog(true);
                    }}
                  />

                  <Link to={`/course/${props.match.params.slug}/cirtificate`}>{jsonData.dialog.viewCertificate}</Link>
                </div>

                <hr className="courseDivider" />
              </>
            )}

            <Dialog
              open={isCompletedModal}
              onClose={() => {
                setIsCompletedModal(false);
              }}
              classes={{ paper: classes.dialog }}
            >
              <DialogTitle disableTypography className={classes.courseCompleteTitle}>
                <IconButton
                  onClick={() => {
                    setIsCompletedModal(false);
                  }}
                  style={{ float: "right" }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent
                style={{ padding: "0.5rem 1.5rem 2rem 1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <div className="course-complete-box">
                  <img
                    src={require(`../../../../assets/images/images/${jsonData.images.courseComplete}`)}
                    alt="congratulations"
                  />

                  <h2>{jsonData.dialog.greet}</h2>
                  <p>
                    {jsonData.dialog.CourseCompleted} <strong>{course.title}</strong>
                  </p>

                  <Rating
                    icon={<StarRoundedIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                    name="read-only"
                    value={courseRating}
                    onChange={(event, value) => {
                      setCourseRating(value);
                      setOpenRateDialog(true);
                    }}
                  />

                  <Link to={`/course/${props.match.params.slug}/cirtificate`}>{jsonData.dialog.viewCertificate}</Link>
                </div>
              </DialogContent>
            </Dialog>
            {localStorage.getItem("role_id") === "2" ? (
              <>
                {/* <div className="courseTag">
              <div className="courseTagHead" id="bar_ref">
                What you can find in this course?
              </div>
              <div className="courseTagTail">
                {course.video_count ? (
                  <span>
                    <img src={TagVideos} alt="Tag Videos" />
                    &nbsp; &nbsp; {course.video_count} Videos
                  </span>
                ) : null}
                {courseTime ? (
                  <span>
                    <img src={TagClock} alt="Tag Clock" />
                    &nbsp; &nbsp; {courseTime}
                  </span>
                ) : null}
                {course.modules.length === 1 ? (
                  <span>
                    <img src={TagLayers} alt="Tag Layers" />
                    &nbsp; &nbsp; {course.modules.length} Module
                  </span>
                ) : course.modules.length > 1 ? (
                  <span>
                    <img src={TagLayers} alt="Tag Layers" />
                    &nbsp; &nbsp; {course.modules.length} Modules
                  </span>
                ) : null}
              </div>
            </div> */}
                <div className="courseModules" id="bar_ref">
                  {course.user_id.toString() === localStorage.getItem("phoenix_user_id") ? (
                    <>
                      <h2 className={styles.he}>Syllabus</h2>
                      <p className={styles.pe}>
                        Best course content delivered by leading faculty and industry experts in the form of On-Demand
                        Videos and Projects.
                      </p>
                      {course.modules.map((module, index) => (
                        <Module
                          modules={course.modules}
                          course={course}
                          parent={course.parent_id}
                          level={course.level}
                          course_slug={course.slug}
                          key={module.id}
                          count={index + 1}
                          module={module}
                          update={update}
                          dragStart={dragStart}
                          changeOrder={changeOrder}
                          lastModule={course.modules.length - 1 === index}
                          totalCount={course.modules.length}
                        />
                      ))}
                    </>
                  ) : (
                    <Syllabus modules={course.modules} slug={course.slug} course={course} />
                  )}
                </div>
              </>
            ) : (
              <Syllabus modules={course.modules} slug={course.slug} />
            )}

            {localStorage.getItem("role_id") === "2" &&
            course.user_id.toString() === localStorage.getItem("phoenix_user_id") ? (
              <div className="addModule" onClick={() => setOpenAddModule(true)}>
                <div className="addModuleContent">
                  <img src={require(`../../../../assets/images/icons/${jsonData.images.plusCircle}`)} alt="" />
                  <span className="moduleTitle">&nbsp; &nbsp; {jsonData.dialog.addModule} </span>
                </div>
              </div>
            ) : null}

            <div className={styles.career}>
              <div className={styles.careerLeft}>
                <h2>{jsonData.section.finalStep.title}</h2>
                <p>{jsonData.section.finalStep.description}</p>
                <div>
                  <Project
                    course={course}
                    openViewProjects={openViewProjects}
                    toggleOpenViewProjects={(bool) => {
                      setOpenViewProjects(bool);
                    }}
                  />
                </div>
              </div>
              <div className={styles.finalRight + " " + styles.careerRight}>
                <img src={require(`../../../../assets/images/icons/${jsonData.images.finalStep}`)} alt="" />
              </div>
            </div>
            <div className={styles.career + " " + styles.connect + " " + styles.touch}>
              <div className={styles.careerLeft}>
                <h2>{jsonData.section.stillQueries.title}</h2>
                <p>{jsonData.section.stillQueries.description}</p>
              </div>
              <div className={styles.careerRight}>
                <button className={styles.careerWhatsapp}>
                  <a href="https://api.whatsapp.com/send?phone=917897862663" target="_blank" rel="noopener noreferrer">
                    {jsonData.buttons.getInTouch}{" "}
                    <img
                      src={require(`../../../../assets/images/icons/${jsonData.images.whatsapp}`)}
                      alt=""
                      width="25"
                      height="25"
                      className={styles.wImg}
                    />
                  </a>
                </button>
              </div>
            </div>
            <div className={styles.certificate}>
              <div className={styles.certiLeft}>
                <h2>{jsonData.section.certificate.title}</h2>
                <p>
                  {jsonData.section.certificate.descLine1}
                  <br />
                  <br />
                  {jsonData.section.certificate.descLine2}
                  <br />
                  <br />
                  {jsonData.section.certificate.descLine3}
                </p>
              </div>
              <div className={styles.certiRight}>
                <img alt="" src={require(`../../../../assets/images/icons/${jsonData.images.certificate}`)} />
              </div>
            </div>
            <Testimonial />
            <div className={styles.career + " " + styles.connect}>
              <div className={styles.careerLeft}>
                <h2>{jsonData.section.referFriends.title}</h2>
                <p>{jsonData.section.referFriends.description}</p>
                <div className={styles.refer}>
                  <button className={styles.btnPrimary}>
                    <Link to="/refer-a-friend">{jsonData.buttons.refer}</Link>
                  </button>
                </div>
              </div>
              <div className={styles.finalRight + " " + styles.careerRight}>
                <img src={require(`../../../../assets/images/icons/${jsonData.images.refer}`)} alt="" />
              </div>
            </div>

            {reviews.length > 0 && <hr className="courseDivider" />}
            <Review reviews={reviews} course={course} stats={stats} />
            <hr className="courseDivider" />
            <h2 className="more_courses">
              More courses from "<span>{course.is_playlist ? course.channel.channel_title : course.creator.name}</span>"
            </h2>
            {course.creator.user_courses.length > 0 ? (
              <section className="h_c_main" style={{ background: "transparent" }}>
                <CourseCard courses={course.creator.user_courses} />
              </section>
            ) : (
              <RequestCourse course={course} />
            )}

            <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
              <DialogTitle
                disableTypography
                className={classes.dialogTitle}
                style={{ paddingRight: "5px", paddingBottom: "0" }}
              >
                <Typography component="div">
                  <Box fontWeight={500}>{jsonData.dialog.addModule}</Box>
                </Typography>
                <IconButton onClick={() => setOpenAddModule(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <div className="add-video-div">
                  <div className="flex add-video-title-div">
                    <p className="add-module-title">{jsonData.dialog.moduleTitle}</p>
                    <InfoOutlinedIcon />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="add-video-input"
                      value={addModuleTitle}
                      onChange={(e) => {
                        setAddModuleTitle(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAddModule(false)} color="primary">
                  {jsonData.dialog.actions.cancel}
                </Button>
                <Button onClick={() => submitAddModule()} color="primary" disabled={!addModuleTitle}>
                  {jsonData.dialog.actions.submit}
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              open={isNewCourseFormShow}
              onClose={courseEditModalClose}
              BackdropProps={{
                timeout: 300,
              }}
              closeAfterTransition
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              BackdropComponent={Backdrop}
              className="new-course-modal"
            >
              <div className="new-course-form-container">
                <div className="new-course-header">
                  <div>{jsonData.modal.editCourse}</div>
                  <img
                    src={require(`../../../../assets/images/icons/${jsonData.images.xIcon}`)}
                    alt=""
                    onClick={courseEditModalClose}
                  />
                </div>
                <div className="new-course-content">
                  <div className="new-course-form">
                    <div className="new-course-from-row">
                      <div>
                        <FormControl component="fieldset" style={{ display: "block" }}>
                          <RadioGroup
                            name="courseType"
                            value={courseType}
                            onChange={(e) => {
                              setCourseType(e.target.value);
                              setType(e.target.value === "topics" ? "0" : "1");
                              setCourseId(null);
                              setDropBreadcrumbs("");
                            }}
                            className="new-course-radio-group"
                          >
                            <FormControlLabel
                              value="topics"
                              control={<PrimaryRadio size="small" />}
                              label="Topic based course"
                              className="new-course-radio-label"
                            />
                            <FormControlLabel
                              value="classes"
                              control={<PrimaryRadio size="small" />}
                              label="Class based course"
                              className="new-course-radio-label"
                            />
                          </RadioGroup>
                        </FormControl>
                        <div
                          data-tut="super"
                          ref={inputRef}
                          onClick={() => {
                            setOpenDrop(false);
                            setOpenSmallDrop(true);
                          }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 38,
                            border: "1px solid #686868",
                            fontSize: "14px",
                            fontWeight: "400",
                            display: "flex",
                            justifyContent: "space-between",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ height: 20 }}>{dropBreadcrumbs}</div>
                          <img src={require(`../../../../assets/images/icons/${jsonData.images.arrow}`)} alt="" />
                        </div>
                        <AdvancedDrop
                          inputRef={inputRef}
                          handleItemClick={(e) => {
                            if (courseType === "topics") getTopicBreadCrumbs(e.id);
                            else getBreadCrumbs(e.id);
                          }}
                          isSmall={openSmallDrop}
                          onSmallCLose={() => setOpenSmallDrop(false)}
                          classification={courseType}
                        />
                        <div className="spacing-1"></div>
                        <InputField value={title} onValue={(value) => setTitle(value)} />
                        <div className="spacing-1"></div>
                        <TextArea value={description} onValue={(value) => setDescription(value)} />
                        <div className="spacing-1"></div>
                        <SelectDrop value={courseLevel} onValue={(val) => setCourseLevel(val)} label="Level" setLevel />
                        <div className="spacing-1"></div>

                        <label className="input-label" id="course">
                          Keywords<span style={{ color: "#FF0000" }}>*</span>
                          <Tooltip
                            enterTouchDelay={1}
                            arrow
                            placement="right"
                            title="Add keywords which give users an idea about what your course is about"
                          >
                            <img src={require(`../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
                          </Tooltip>
                        </label>

                        <label>
                          <ul className={classes.container}>
                            {keywords.map((item, i) => (
                              <li key={i} className={classes.items} onClick={handleRemoveItem(i)}>
                                <div className={classes.tag}>
                                  <span>{item}&nbsp; </span>
                                  <CancelRoundedIcon style={{ fontSize: "1rem" }} />
                                </div>
                              </li>
                            ))}
                            <input
                              className={classes.inputKeyword}
                              value={input}
                              onChange={handleInputChange}
                              onKeyDown={handleInputKeyDown}
                            />
                          </ul>
                        </label>
                      </div>
                      <div style={{ position: "relative" }}>
                        <div style={{ marginLeft: "auto" }}>
                          <label className="input-label" id="course">
                            {jsonData.modal.thumbnail}
                            <Tooltip enterTouchDelay={1} title="Relevant images lead to more students enrolling." arrow>
                              <img src={require(`../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
                            </Tooltip>
                          </label>
                          <div className="certi-upload second-upload flex-column flex-center relative">
                            {image ? (
                              <>
                                <div className="certi_image_edit">
                                  <IconButton onClick={(event) => setImage(null)}>
                                    <CloseIcon className={classes.closeIconTwo} />
                                  </IconButton>
                                </div>
                                <img src={image} alt="" />
                              </>
                            ) : (
                              <div className="flex-column flex-center">
                                <input
                                  accept="image/jpeg, image/png"
                                  className={classes.input}
                                  id="upload"
                                  onChange={(event) => {
                                    setImage(URL.createObjectURL(event.target.files[0]));
                                    setSendImage(event.target.files[0]);
                                  }}
                                  type="file"
                                />
                                <label htmlFor="upload">
                                  <Button
                                    size="large"
                                    component="span"
                                    className={classes.upload}
                                    startIcon={
                                      <img
                                        src={require(`../../../../assets/images/icons/${jsonData.images.profileUpload}`)}
                                        alt=""
                                      />
                                    }
                                  >
                                    {jsonData.modal.upload}
                                  </Button>
                                </label>
                                {/* <p className="upload-text">
                          upload a jpeg, png of your certificate
                        </p> */}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="spacing-1"></div>
                        <div className="spacing-1"></div>
                        <div className="spacing-1"></div>
                        <div className="submit-container" onClick={editCourse}>
                          <input className="course-submit-button" type="button" value="Update" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="new-form-footer">
                  <img src={require(`../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
                  <div>{jsonData.modal.info}</div>
                </div>
              </div>
            </Modal>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              classes={{ paper: classes.dialogBG }}
            >
              <DialogTitle disableTypography className={classes.dialogTitle}>
                <Typography component="div">
                  <Box fontWeight={500}>{jsonData.dialog.benefits}</Box>
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent style={{ padding: "0.5rem 1.5rem 2rem 1.5rem" }}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={4} className={classes.DialogGridItem}>
                    <Grid container justify="center" className={classes.GridCard}>
                      <Card className={classes.DialogGridCard}>
                        <img
                          src={require(`../../../../assets/images/images/${jsonData.images.benefitBG1}`)}
                          className={classes.cardMedia}
                          alt=""
                        />
                        <CardContent className={classes.CardContent}>
                          <Typography component="div">
                            <Box fontSize={14} fontWeight={500}>
                              {jsonData.dialog.certificate}
                            </Box>
                          </Typography>
                          <Typography className={classes.CardDesc} component="div" varient="caption">
                            {jsonData.dialog.getCertificate}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} className={classes.DialogGridItem}>
                    <Grid container justify="center" className={classes.GridCard}>
                      <Card className={classes.DialogGridCard}>
                        <img
                          src={require(`../../../../assets/images/images/${jsonData.images.benefitBG2}`)}
                          className={classes.cardMedia}
                          alt=""
                        />
                        <CardContent className={classes.CardContent}>
                          <Typography component="div">
                            <Box fontSize={14} fontWeight={500}>
                              {jsonData.dialog.progress}
                            </Box>
                          </Typography>
                          <Typography className={classes.CardDesc} component="div" varient="caption">
                            {jsonData.dialog.trackProgress}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} className={classes.DialogGridItem}>
                    <Grid container justify="center" className={classes.GridCard}>
                      <Card className={classes.DialogGridCard}>
                        <img
                          src={require(`../../../../assets/images/images/${jsonData.images.benefitBG3}`)}
                          className={classes.cardMedia}
                          alt=""
                        />
                        <CardContent className={classes.CardContent}>
                          <Typography component="div">
                            <Box fontSize={14} fontWeight={500}>
                              {jsonData.dialog.bespecial}
                            </Box>
                          </Typography>
                          <Typography className={classes.CardDesc} component="div" varient="caption">
                            {jsonData.dialog.getCertificate}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>

            <Dialog
              open={openHowToComplete}
              onClose={() => {
                setOpenHowToComplete(false);
              }}
              aria-labelledby="form-dialog-title"
              classes={{ paper: classes.dialog }}
            >
              <DialogTitle disableTypography className={classes.dialogTitle}>
                <Typography component="div">
                  <Box fontWeight={500}>{jsonData.dialog.info}</Box>
                </Typography>
                <IconButton
                  onClick={() => {
                    setOpenHowToComplete(false);
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent
                style={{ padding: "0.5rem 1.5rem 2rem 1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={course.user_actions[0]?.pivot?.is_enrolled ? true : false}
                      color="primary"
                      icon={<CircleUnchecked />}
                      checkedIcon={<CircleChecked />}
                      onChange={!course.user_actions[0]?.pivot?.is_enrolled ? handleEnroll : undefined}
                    />
                  }
                  label="Enroll"
                  style={{ textDecoration: course.user_actions[0]?.pivot?.is_enrolled ? "line-through" : undefined }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={course.user_actions[0]?.pivot?.is_completed ? true : false}
                      color="primary"
                      icon={<CircleUnchecked />}
                      checkedIcon={<CircleChecked />}
                      onChange={!course.user_actions[0]?.pivot?.is_completed ? handleWatch : undefined}
                    />
                  }
                  label="Watch all videos"
                  style={{ textDecoration: course.user_actions[0]?.pivot?.is_completed ? "line-through" : undefined }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review ? true : false
                      }
                      color="primary"
                      icon={<CircleUnchecked />}
                      checkedIcon={<CircleChecked />}
                      onChange={
                        !(course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review)
                          ? () => {
                              if (localStorage.getItem("access_token")) {
                                setOpenRateDialog(true);
                              } else {
                                swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
                                  buttons: true,
                                  dangerMode: true,
                                }).then((ok) => {
                                  if (ok) {
                                    return (window.location.href = "/login");
                                  }
                                });
                              }
                            }
                          : undefined
                      }
                    />
                  }
                  style={{
                    textDecoration:
                      course.user_actions[0]?.pivot?.rating && course.user_actions[0]?.pivot?.review
                        ? "line-through"
                        : undefined,
                  }}
                  label="Provide a rating and review of the course"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={course.user_actions[0]?.pivot?.project_submitted ? true : false}
                      color="primary"
                      icon={<CircleUnchecked />}
                      checkedIcon={<CircleChecked />}
                    />
                  }
                  style={{
                    textDecoration: course.user_actions[0]?.pivot?.project_submitted ? "line-through" : undefined,
                  }}
                  label="Submit a project for the course"
                  onChange={
                    !course.user_actions[0]?.pivot?.project_submitted
                      ? () => {
                          setOpenHowToComplete(false);
                          setOpenViewProjects(true);
                        }
                      : undefined
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </>
    );
  } catch (e) {
    swal("OOPS some error occurred!", "We will fix this soon.", "warning");
    Post(0, "save_error_log", { subject: e.message, error_log: e.stack });
    return <></>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (message) =>
      dispatch({
        type: "SHOW_SUCCESS",
        message,
      }),
    showWarning: (message) =>
      dispatch({
        type: "SHOW_WARNING",
        message,
      }),
  };
};

export default connect(null, mapDispatchToProps)(CourseDetail);
