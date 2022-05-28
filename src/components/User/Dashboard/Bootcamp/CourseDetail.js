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
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/CourseDetail.css";
import "../../../../assets/css/User/Profile/profile_dialog.css";
import InfoIcon from "../../../../assets/images/icons/alert-circle.svg";
import BenefitOpenBG from "../../../../assets/images/icons/benefitOpenBG.png";
import Certi from "../../../../assets/images/icons/certi.png";
import DeleteIcon from "../../../../assets/images/icons/deleteIcon.png";
import delivery from "../../../../assets/images/icons/delivery.png";
import duration from "../../../../assets/images/icons/duration.png";
import { ReactComponent as Edit } from "../../../../assets/images/icons/edit.svg";
import { ReactComponent as EndorseTick } from "../../../../assets/images/icons/endorse_tick.svg";
import modules from "../../../../assets/images/icons/modules.png";
import PlusCircle from "../../../../assets/images/icons/plus_circle.png";
import ProfileUpload from "../../../../assets/images/icons/profile-upload.png";
import Untitled15 from "../../../../assets/images/icons/refer.png";
import Arrow from "../../../../assets/images/icons/solid-bottom-arrow.svg";
import TagClock from "../../../../assets/images/icons/tag_clock.png";
import TagLayers from "../../../../assets/images/icons/tag_layers.png";
import TagVideos from "../../../../assets/images/icons/tag_videos.png";
import Untitled13 from "../../../../assets/images/icons/Untitled-13.png";
import Untitled14 from "../../../../assets/images/icons/Untitled-14.png";
import Whatsapp from "../../../../assets/images/icons/whatsapp.png";
import XIcon from "../../../../assets/images/icons/x.svg";
import benefitBG1 from "../../../../assets/images/images/benefitBG1.png";
import benefitBG2 from "../../../../assets/images/images/benefitBG2.png";
import benefitBG3 from "../../../../assets/images/images/benefitBG3.png";
import CourseCompleteImg from "../../../../assets/images/images/course-complete.svg";
import baseDomain from "../../../common/baseDomain";
import { NotificationPermission, Post, swalWithAuth } from "../../../common/common";
import firebase from "../../../common/init-fcm";
import { getLocal } from "../../../common/localStorageAccess";
import MetaHelmet from "../../../common/MetaHelmet";
import CourseCard from "../../../Home/Tabs";
import { notify } from "../../Navbar/notify";
import InputField from "../Browse/InputField";
import AdvancedDrop from "../Browse/NewCourse/CoursePlacement/AdvancedDrop/AdvancedDrop";
import SelectDrop from "../Browse/SelectDrop";
import TextArea from "../Browse/TextArea";
import styles from "./CourseDetail.module.css";
import { DataScienceCourse, DataScienceModules, ReactCourse, WebModules } from "./courses";
import Faq from "./Faq/Faq";
import { BOOTCAMP_ENROLL_KEYS } from "./globalData";
import Module from "./Module";
import ProcessKeys from "./ProcessKeys/ProcessKeys";
import Project from "./Project/Project";
import Rate from "./Rate/Rate";
import Recruiters from "./Recruiters/Recruiters";
import Review from "./Review/Review";
import Syllabus from "./Syllabus/Syllabus";
import Testimonial from "./Testimonial/Testimonial";

const PrimaryRadio = withStyles({
  root: {
    color: "#000000",
    "&$checked": {
      color: "#6646E7",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

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
  ["@media (max-width: 1050px)"]: {
    topRight: {
      display: "none",
    },
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
  ["@media only screen and (max-width: 900px)"]: {
    title: {
      fontSize: "20px",
      marginTop: "10px",
    },
  },
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
  const [showBanner, setShowBanner] = useState(true);
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

  const [dailyStreak, setDailyStreak] = useState([0, 0, 0, 0, 0, 0, 0]);

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
        NotificationPermission(props.slug);
        await update();
      }
    }
    fetchData();
  }, [props.slug]);

  const handleEnroll = () => {
    // console.log("enroll");
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      let url = `${baseDomain.route}${baseDomain.subRoute}/add_category_enrollment?category_id=${course.id}`;
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
            notify(`🔑 You spent ${BOOTCAMP_ENROLL_KEYS} keys by enrolling in a course`);
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
          let url = `${baseDomain.route}${baseDomain.subRoute}/add_category_enrollment?category_id=${course.id}`;
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

  const handleWatch = () => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      history.push("/dashboard/videos/" + firstVideo + "?course=" + encodeURIComponent(course.slug));
    }
  };

  async function update() {
    // window.scrollTo(0, 0);
    // const query = new URLSearchParams(props.location.search);
    // const course = decodeURI(props.slug);
    let url = `${baseDomain.route}${baseDomain.subRoute}/get_final_course_details?course_slug=${props.slug}`;
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
                  ? setCourseTime(lcl_tt_h + " hour ")
                  : setCourseTime(lcl_tt_h + " hour ")
                : lcl_tt_m === 1
                ? setCourseTime(lcl_tt_h + " hours ")
                : setCourseTime(lcl_tt_h + " hours ");
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

    let dailyStreakURL = `${baseDomain.route}${baseDomain.subRoute}/get_daily_streaks?course_slug=${props.slug}`;
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
          url: `${baseDomain.route}${baseDomain.subRoute}/remove_category`,
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
      url: `${baseDomain.route}${baseDomain.subRoute}/edit_course`,
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
        if (oldType != type) await changeType();
        else {
          swal("Success", "Course added successfully", "success").then((ok) => {
            if (ok) {
              var queryParams = new URLSearchParams(window.location.search);
              // Set new or modify existing parameter value.
              queryParams.set("course", res.slug);
              // Replace current querystring with the new one.
              window.history.replaceState(null, null, "?" + queryParams.toString());
              window.history.pushState(null, null, "?" + queryParams.toString());
              window.location.reload();
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
      url: `${baseDomain.route}${baseDomain.subRoute}/move_course`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: data,
    }).then((response) => {
      let res = response.data.data;

      swal("Success", "Course added successfully", "success").then((ok) => {
        if (ok) {
          var queryParams = new URLSearchParams(window.location.search);
          // Set new or modify existing parameter value.
          queryParams.set("course", res.slug);
          // Replace current querystring with the new one.
          window.history.replaceState(null, null, "?" + queryParams.toString());
          window.history.pushState(null, null, "?" + queryParams.toString());
          window.location.reload();
        }
      });
    });
  };

  const submitAddModule = () => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_new_module`,
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
      url: `${baseDomain.route}${baseDomain.subRoute}/get_course_breadcrumbs?parent_id=${parentId}`,
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
      url: `${baseDomain.route}${baseDomain.subRoute}/get_topic_breadcrumbs?parent_id=${parentId}`,
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

  const handleRateClose = (Update) => {
    setOpenRateDialog(false);
    if (Update) {
      update();
    }
  };
  const handleShowMoreClick = () => {
    setShowMore((prev) => !prev);
  };
  const handleBootcampEnroll = () => {
    if (props.slug === "reactjs-babd7") {
      window.open("https://form.typeform.com/to/GR3A8DF0");
    } else {
      window.open("https://stud-net.typeform.com/DS-Registration");
    }
  };

  return loading ? (
    <div className="loader">
      <CircularProgress />
    </div>
  ) : (
    <>
      <div className="coursePage course_bootcamp">
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
        <div className="courseDetail">
          {showBanner && (
            <div className={styles.banner}>
              <p>You are eligible for paid internship on completing this course!</p>
              <marquee>You are eligible for paid internship on completing this course!</marquee>
              <IconButton onClick={() => setShowBanner(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </div>
          )}
          <Grid container>
            <Grid className={classes.topLeft + " topLeft"}>
              {course.image_url && (
                <div className="courseIconBG">
                  <img className="courseIcon" src={course.image_url} alt="course" />
                </div>
              )}
            </Grid>
            <div className="flex-grow course_details">
              <div className="class_details">
                <Box className={classes.topMiddle} mx={1}>
                  <Typography variant="h6" component="div">
                    <Box fontWeight={500} mb={1} className={classes.title}>
                      <p>
                        {props.slug === "reactjs-babd7"
                          ? "Frontend Web Development: Beginner to Expert"
                          : "Data Science: Beginner to Expert"}
                        {course.num_endorsements > 0 && (
                          <Tooltip
                            title={
                              <div className="endorsed_text">
                                {course.num_endorsements + " " + (course.num_endorsements > 1 ? "experts " : "expert ")}
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
                  <Grid item>
                    <Box mt={3}>
                      <Grid container alignItems="center" justify="flex-end">
                        {localStorage.getItem("role_id") === "2" &&
                          course.user_id.toString() === localStorage.getItem("phoenix_user_id") && (
                            <>
                              <IconButton onClick={() => setIsNewCourseFormShow(true)}>
                                <Edit className="module-edit-icon" />
                              </IconButton>
                              <IconButton onClick={() => removeCourse()}>
                                <img src={DeleteIcon} alt="" className="module-delete-icon" />
                              </IconButton>
                            </>
                          )}
                      </Grid>
                    </Box>
                  </Grid>
                  {/* <Box component="div" mt={2} borderColor="transparent">
                    <Rating
                      icon={<StarRoundedIcon fontSize="inherit" />}
                      emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                      value={courseRating}
                      onChange={(event, value) => {
                        setCourseRating(value);

                        setOpenRateDialog(true);
                      }}
                    />
                  </Box> */}
                  <Grid container direction="row" alignItems="center">
                    <StarRoundedIcon fontSize="inherit" className={classes.icon} style={{ color: "#febe16" }} />
                    <Typography variant="caption" component="div">
                      <Box fontSize={12} mr={2}>
                        {/* {courseRating.toFixed(1)} */}
                        {props.slug === "reactjs-babd7" ? 4.5 : 4.2}
                      </Box>
                    </Typography>
                    <VisibilityOutlinedIcon className={classes.icon} fontSize="inherit" />
                    <Typography variant="caption" component="div">
                      <Box fontSize={12} mr={2}>
                        {course.total_views} Views
                      </Box>
                    </Typography>
                  </Grid>
                </Box>

                <Grid className={classes.topRight} item>
                  <Box mt={3}>
                    <Grid container alignItems="center" justify="flex-end">
                      {localStorage.getItem("role_id") === "2" &&
                        course.user_id.toString() === localStorage.getItem("phoenix_user_id") && (
                          <>
                            <IconButton onClick={() => setIsNewCourseFormShow(true)}>
                              <Edit className="module-edit-icon" />
                            </IconButton>
                            <IconButton onClick={() => removeCourse()}>
                              <img src={DeleteIcon} alt="" className="module-delete-icon" />
                            </IconButton>
                          </>
                        )}
                    </Grid>
                  </Box>
                </Grid>
              </div>
            </div>

            <div className="enrollSection">
              <div className="enrollSection-btns">
                {/* {course.user_actions[0]?.pivot?.is_enrolled === 1 ? (
                  <button onClick={handleUnEnroll} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                    Enrolled
                  </button>
                ) : ( */}
                <div className="enrollBox">
                  <p>will cost you {BOOTCAMP_ENROLL_KEYS} keys</p>
                  <button onClick={handleBootcampEnroll} className="enrollBtn">
                    Enroll now
                  </button>
                </div>
                {/* ) */}

                {/* handleWatchEvent() */}
                <button className="enrollBtn" onClick={handleBootcampEnroll}>
                  Apply for scholarship
                </button>
              </div>
            </div>

            <div className="enrollSection_mobile">
              {/* {course.user_actions[0]?.pivot?.is_enrolled === 1 ? (
                <button onClick={handleUnEnroll} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                  Enrolled
                </button>
              ) : ( */}
              <div className="enrollBox">
                <p>will cost you {BOOTCAMP_ENROLL_KEYS} keys</p>
                <button onClick={handleBootcampEnroll} className="enrollBtn">
                  Enroll now
                </button>
              </div>
              {/* handleWatchEvent() */}
              <button className="enrollBtn" onClick={handleBootcampEnroll}>
                Apply for scholarship
              </button>
              {/* <Share
                share={window.location.href}
                title={course.title
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              >
                <button className="watchBtn">Share</button>
              </Share> */}
            </div>
            <div className="courseDetails_right course-wrapper">
              <div className="course_process">
                <div className="infoSection">
                  <InfoOutlinedIcon />
                  <span>
                    &nbsp;<u>Course completion process</u>
                  </span>
                </div>

                <div className="completion-process">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        color="primary"
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleChecked />}
                        classes={{ root: classes.checkbox, checked: classes.checked }}
                      />
                    }
                    label="Enroll"
                  />

                  <div className={`border border-bootcamp`}></div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        color="primary"
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleChecked />}
                        classes={{ root: classes.checkbox, checked: classes.checked }}
                      />
                    }
                    label="Complete online course"
                  />

                  <div className={`border border-bootcamp`}></div>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        color="primary"
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleChecked />}
                        classes={{ root: classes.checkbox, checked: classes.checked }}
                      />
                    }
                    label={<>Attend live classes</>}
                  />

                  <div className={`border border-bootcamp`}></div>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        color="primary"
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleChecked />}
                      />
                    }
                    label={<>Complete projects</>}
                    classes={{ root: classes.checkbox, checked: classes.checked }}
                  />
                  <div className={`border border-bootcamp `}></div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        color="primary"
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleChecked />}
                      />
                    }
                    label={<>Get internship</>}
                    classes={{ root: classes.checkbox, checked: classes.checked }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.career}>
              <div className={styles.careerLeft}>
                <h2>Want to know if this is the right career choice for you? </h2>
                <p>Get in touch with us for instant career advice!</p>
                <div className={styles.careerBtn}>
                  <button className={styles.careerWhatsapp}>
                    <a
                      href="https://api.whatsapp.com/send?phone=917897862663"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Whatsapp Us <img src={Whatsapp} />
                    </a>
                  </button>
                </div>
              </div>
              <div className={styles.finalRight + " " + styles.careerRight}>
                <img src={Untitled13} alt="" />
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.infoContainer}>
                <img src={duration} alt="" />
                <p>
                  Duration
                  <br />
                  {/* <span>{courseTime}</span> */}
                  <span>3 Months</span>
                </p>
              </div>
              <div className={styles.infoContainer}>
                <img src={delivery} alt="" />
                <p>
                  Delivery Mode
                  <br />
                  <span>Online + live + projects</span>
                </p>
              </div>
              <div className={styles.infoContainer}>
                <img src={modules} alt="" />
                <p>
                  Delivery Modules
                  <br />
                  {course.modules.length === 1 ? (
                    <span>{course.modules.length} Module</span>
                  ) : course.modules.length > 1 ? (
                    <span>{course.modules.length} Modules</span>
                  ) : null}
                </p>
              </div>
            </div>
          </Grid>
          <hr className="courseDivider" />
          <Syllabus modules={props.slug === "reactjs-babd7" ? WebModules : DataScienceModules} />
          <div className={styles.career}>
            <div className={styles.careerLeft}>
              <h2>Final Step : Hands on projects </h2>
              <p>
                Learning is more than just watching videos or scoring marks. Do a project to make sure you can implement
                what you have learnt!
              </p>
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
              <img src={Untitled14} alt="" />
            </div>
          </div>
          <Recruiters />
          <div className={styles.career + " " + styles.connect + " " + styles.touch}>
            <div className={styles.careerLeft}>
              <h2>Still have queries ?</h2>
              <p>Connect with us on whatsapp, let us help you on your carrier path.</p>
            </div>
            <div className={styles.careerRight}>
              <button className={styles.careerWhatsapp}>
                <a href="https://api.whatsapp.com/send?phone=917897862663" target="_blank" rel="noopener noreferrer">
                  Get in touch <img src={Whatsapp} alt="" width="25" height="25" className={styles.wImg} />
                </a>
              </button>
            </div>
          </div>
          <div className={styles.certificate}>
            <div className={styles.certiLeft}>
              <h2>Stand Out with BE’s Certificate</h2>
              <p>
                Complete all the modules successfully to obtain this certificate of recognition.
                <br />
                <br />
                ✓ BE’s certificates serve as a testament to the knowledge & skills you have gained.
                <br />
                <br />✓ Increase your credibility by adding it to your resume and sharing it with your LinkedIn network.
                (you need to complete all the modules successfully to obtain this certificate of recognition)
              </p>
            </div>
            <div className={styles.certiRight}>
              <img alt="" src={Certi} />
            </div>
          </div>
          <Testimonial />
          <div className={styles.career + " " + styles.connect}>
            <div className={styles.careerLeft}>
              <h2>Refer Your Friends To Us!</h2>
              <p>Share your love for BeyondExams and Unlock Huge Rewards for you and your friends.</p>
              <div className={styles.refer}>
                <button className={styles.btnPrimary}>
                  <Link to="/refer-a-friend">Start Referring</Link>
                </button>
              </div>
            </div>
            <div className={styles.finalRight + " " + styles.careerRight}>
              <img src={Untitled15} alt="" />
            </div>
          </div>
          <Faq course={course} />
          {reviews.length > 0 && <hr className="courseDivider" />}
          <Review reviews={reviews} course={course} stats={stats} slug={props.slug} />
          {/* <hr className="courseDivider" />
          <h2 className="more_courses">More courses with guaranteed internships</h2>
          <section className="h_c_main" style={{ background: "transparent" }}>
            <CourseCard
              courses={props.slug === "reactjs-babd7" ? DataScienceCourse : ReactCourse}
              slug={
                props.slug === "reactjs-babd7"
                  ? "/training-bootcamps/3-months-data-science-bootcamp"
                  : "/training-bootcamps/3-months-website-development-bootcamp"
              }
            />
          </section> */}
          <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
            <DialogTitle
              disableTypography
              className={classes.dialogTitle}
              style={{ paddingRight: "5px", paddingBottom: "0" }}
            >
              <Typography component="div">
                <Box fontWeight={500}>Add New Module</Box>
              </Typography>
              <IconButton onClick={() => setOpenAddModule(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="add-video-div">
                <div className="flex add-video-title-div">
                  <p className="add-module-title">Module Title</p>
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
                Cancel
              </Button>
              <Button onClick={() => submitAddModule()} color="primary" disabled={!addModuleTitle}>
                Submit
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
                <div>Edit Course</div>
                <img src={XIcon} alt="" onClick={courseEditModalClose} />
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
                        <img src={Arrow} alt="" />
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
                          <img src={InfoIcon} alt="" />
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
                          Upload a thumbnail
                          <Tooltip enterTouchDelay={1} title="Relevant images lead to more students enrolling." arrow>
                            <img src={InfoIcon} alt="" />
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
                                  startIcon={<img src={ProfileUpload} alt="" />}
                                >
                                  Upload
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
                <img src={InfoIcon} alt="" />
                <div>Learn how to create meaningful courses</div>
              </div>
            </div>
          </Modal>
          {isCompleted && (
            <>
              <div className="course-complete-box">
                <img src={CourseCompleteImg} alt="congratulations" />

                <h2>Congratulations!</h2>
                <p>
                  You have sucessfully completed <strong>{course.title}</strong>
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

                <Link to={`/course/${props.slug}/cirtificate`}>View your certificate</Link>
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
                <img src={CourseCompleteImg} alt="congratulations" />

                <h2>Congratulations!</h2>
                <p>
                  You have sucessfully completed <strong>{course.title}</strong>
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

                <Link to={`/course/${props.slug}/cirtificate`}>View your certificate</Link>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            classes={{ paper: classes.dialogBG }}
          >
            <DialogTitle disableTypography className={classes.dialogTitle}>
              <Typography component="div">
                <Box fontWeight={500}>Benefits of enrollment</Box>
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
                      <img src={benefitBG1} className={classes.cardMedia} alt="" />
                      <CardContent className={classes.CardContent}>
                        <Typography component="div">
                          <Box fontSize={14} fontWeight={500}>
                            Shareable certificates
                          </Box>
                        </Typography>
                        <Typography className={classes.CardDesc} component="div" varient="caption">
                          Get a shareable certificate after the completion of every course and show it to the world
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.DialogGridItem}>
                  <Grid container justify="center" className={classes.GridCard}>
                    <Card className={classes.DialogGridCard}>
                      <img src={benefitBG2} className={classes.cardMedia} alt="" />
                      <CardContent className={classes.CardContent}>
                        <Typography component="div">
                          <Box fontSize={14} fontWeight={500}>
                            Progress track
                          </Box>
                        </Typography>
                        <Typography className={classes.CardDesc} component="div" varient="caption">
                          Track your progress throughout the learning journey
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.DialogGridItem}>
                  <Grid container justify="center" className={classes.GridCard}>
                    <Card className={classes.DialogGridCard}>
                      <img src={benefitBG3} className={classes.cardMedia} alt="" />
                      <CardContent className={classes.CardContent}>
                        <Typography component="div">
                          <Box fontSize={14} fontWeight={500}>
                            Beyond Exam special
                          </Box>
                        </Typography>
                        <Typography className={classes.CardDesc} component="div" varient="caption">
                          Get a shareable certificate after the completion of every course and show it to the world
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
                <Box fontWeight={500}>Course completion process</Box>
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
