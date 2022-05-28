import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import "../../../../../../assets/css/User/Dashboard/CourseDetail.css";
import BenefitOpenBG from "../../../../../../assets/images/icons/benefitOpenBG.png";
import PlusCircle from "../../../../../../assets/images/icons/plus_circle.png";
import baseDomain from "../../../../../common/baseDomain";
import { getLocal } from "../../../../../common/localStorageAccess";
import Module from "../../../Course/Module";
import styles from "./CourseContent.module.css";
import { Steps } from "intro.js-react";
import { CreateCourseSteps } from "./TutorialSteps";
import { notify } from "../../../../Navbar/notify";
import { ADD_COURSE_KEYS } from "../../../Course/globalData";
import { NotificationPermission } from "../../../../../common/common";
import { useDispatch, useSelector } from "react-redux";
import NotificationAlert from "../../../NotificationAlert/NotificationAlert";

// import * as jsonData from "../newCourse.json";
var jsonData = require("../newCourse.json");


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
}));

const CourseContent = (props) => {
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
  const [loading, setLoading] = useState(true);
  const [openAddModule, setOpenAddModule] = useState(false);
  const [addModuleTitle, setAddModuleTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = React.useState(true);
  const [draggedVideo, setDraggedVideo] = useState(null);
  const [dragModule, setDragModule] = useState(null);
  const classes = useStyles();
  const history = new useHistory();
  const dispatch = useDispatch();

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleModule = async (slug) => {
    console.log(slug);
    await axios({
      // url: `${baseDomain.route}${baseDomain.subRoute}/get_modules?category_id=${id}`,
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.courseDetails}?course_slug=${encodeURIComponent(slug)}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data.course;
        console.log(res);
        setCourse(res);
        if (response.data.data.course?.modules?.length === 0 && initial) {
          submitAddModule();
        }
        setInitial(false);
        if (localStorage.getItem("coc") === "true" && props.step === 4) {
          if (initial) {
            setTimeout(() => {
              setOpen(true);
            }, 500);
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const submitAddModule = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.addModule}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: props.course.courseId,
        title: initial ? "Name of the module" : addModuleTitle,
        // description: moduleDescription,
      },
    })
      .then((data) => {
        if (!initial) {
          swal("success", "Module is added successfully", "success");
        }
        setOpenAddModule(false);
        handleModule(props.course.slug);
        setAddModuleTitle("");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  useEffect(() => {
    if (props.course !== null) {
      if (props.course.slug) {
        handleModule(props.course.slug);
      }
    }
  }, [props.course]);

  const handleNotify = () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    if (localStorage.getItem("access_token") && course_slug) {
      NotificationPermission(course_slug);
    }
    this.setState({ isNotificationModalOpen: false });
  };
  const dragStart = (video_url, module_id) => {
    setDraggedVideo(video_url);
    setDragModule(module_id);
  };

  const changeOrder = (e) => {
    let new_module = parseInt(e.to.parentElement.id);
    let new_order = e.newIndex + 1;
    let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.changeVideoOrder}`;
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
          handleModule(props.course.slug);
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
          handleModule(props.course.slug);
        });
    }
  };

  return (
    <div className={styles.container}>
      <NotificationAlert
        isOpen={isNotificationModalOpen}
        setIsOpen={setIsNotificationModalOpen}
        handleNotify={handleNotify}
      />
      <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>{jsonData.heading.addModule}</Box>
          </Typography>
          <IconButton onClick={() => setOpenAddModule(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="add-video-div">
            <div className="flex add-video-title-div">
              <p className="add-module-title">{jsonData.heading.moduleTitle}</p>
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
            {jsonData.buttons.cancel}
          </Button>
          <Button onClick={() => submitAddModule()} color="primary" disabled={!addModuleTitle}>
            {jsonData.buttons.submit}
          </Button>
        </DialogActions>
      </Dialog>

      <div className={styles.title}>{jsonData.heading.addContent}</div>

      {loading ? (
        <div style={{ textAlign: "center" }}>{jsonData.heading.loading}</div>
      ) : (
        <div>
          {course.modules.map((module, index) => {
            return (
              <Module
                parent={props.course.parent_id}
                level={props.course.level}
                key={module.id}
                count={index + 1}
                module={module}
                update={() => handleModule(course.slug)}
                dragStart={dragStart}
                changeOrder={changeOrder}
              />
            );
          })}

          <div className="addModule" onClick={() => setOpenAddModule(true)}>
            <div className="addModuleContent">
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.plusCircle}`)} alt="" />
              <span className="moduleTitle">&nbsp;&nbsp; {jsonData.heading.addModule}</span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button
          className={styles.previousButton}
          onClick={() => {
            props.handleSetCourse("step", 3);
            // props.onPrevious();
          }}
        >
          {jsonData.buttons.previous}
        </button>
        <button
          className={styles.nextButton}
          onClick={async () => {
            notify(`🔑 You got ${ADD_COURSE_KEYS} keys for adding a new course.`);
            setTimeout(() => {
              setIsNotificationModalOpen(true);
            }, 3000);
            history.push(`/dashboard/course/${encodeURIComponent(props.course.slug)}?new=true`);
            if (course.video_count > 0) {
              dispatch({
                type: "SHOW_SUCCESS",
                message: "Videos are being processed and will be added to the course in the next 24 hours!",
              });
            }
          }}
        >
          {jsonData.buttons.next}
        </button>
      </div>
      <Steps
        enabled={open}
        steps={CreateCourseSteps}
        initialStep={0}
        onExit={() => {
          setOpen(false);
          localStorage.setItem("coc", false);
        }}
        options={{
          // disableInteraction: true,
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
    </div>
  );
};

export default CourseContent;
