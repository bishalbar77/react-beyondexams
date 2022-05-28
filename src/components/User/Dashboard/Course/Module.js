import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grow from "@material-ui/core/Grow";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import Youtube from "react-youtube";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/Module.css";
import { ReactComponent as Edit } from "../../../../assets/images/icons/edit.svg";
import store from "../../../../store";
import baseDomain from "../../../common/baseDomain";
import { Post } from "../../../common/common";
import { key, VideoById } from "../../../common/videocommon";
import { notify } from "../../Navbar/notify";
import { PROJECT_ADD_KEYS } from "./globalData";
import GoLive from "./GoLive/GoLive";
import styles from "./Module.module.css";
import ModuleProject from "./Project/ModuleProject";
import style from "./Syllabus/Accordion.module.css";
import { ReactComponent as PdfIcon } from "./Syllabus/asset/pdf.svg";
import { ReactComponent as Quiz } from "./Syllabus/asset/quiz.svg";
import { ReactComponent as Video } from "./Syllabus/asset/video.svg";
import VideoResult from "./VideoResult";
import VideoResultPlayer from "./VideoResultPlayer";

const useStyles = makeStyles((theme) => ({
  ModuleStart: {
    "& span": {
      fontWeight: 600,
    },
    borderRadius: "10px",
    boxShadow: "0px 7px 34px rgba(0, 0, 0, 0.09)",
    padding: "1.5rem 0",
    textAlign: "center",
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
  moduleDesc: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:hover": {
      cursor: "pointer",
    },
  },
  moduleDescHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "1rem 0",
  },
  moduleMetaData: {
    color: "#686868",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    display: "flex",
    position: "relative",
    "@media (max-width: 499px)": {
      padding: "0 8px",
    },
    txt: {
      width: 100,
    },
  },
  dialogBG: {
    width: "650px",
  },
}));

function Module({ course, module, count, level, update, course_slug, dragStart, changeOrder, lastModule, modules }) {
  const classes = useStyles();
  const history = useHistory();
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [openAddModule, setOpenAddModule] = useState(false);
  const [addModuleTitle, setAddModuleTitle] = useState(module.title);

  const [searchBtn, setSearchBtn] = useState(false);

  const [searchQuery, setSeachQuery] = useState("");
  const [searchVideos, setSearchVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);

  const [fetchLoading, setFetchLoading] = useState(false);

  const [moduleTime, setModuleTime] = useState("");

  const [videoResultClickVideo, setVideoResultClickVideo] = useState("");

  const [expanded, setExpanded] = React.useState(count == 1 ? "panel1" : "");
  const [openTimeDialog, setOpenTimeDialog] = React.useState(false);
  const [max, setMax] = React.useState(0);
  const [dontAskAgain, setDontAskAgain] = React.useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [startHour, setStartHour] = useState(0);
  const [startMin, setStartMin] = useState(0);
  const [startSec, setStartSec] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [endMin, setEndMin] = useState(0);
  const [endSec, setEndSec] = useState(0);
  const [pauseVideos, setPauseVideos] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [link, setLink] = React.useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const playerRef = useRef();
  const [showMore, setShowMore] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [openViewProjects, setOpenViewProjects] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropDownText, setDropDownText] = useState("Add Content");
  const [openAddProject, setOpenAddProject] = useState(false);
  const [title, setTitle] = useState("");
  const [projects, setProjects] = useState([]);

  const pauseAll = (url) => {
    setPauseVideos(true);
    setVideoUrl(url);
  };

  // const [active, setActive] = useState(false);
  // const handleClick = () => {
  //   setActive((prevActive) => setActive(!prevActive));
  // };

  const [activeVideo, setActiveVideo] = useState(false);
  const handleClickVideo = () => {
    setActiveVideo((prevActive) => setActiveVideo(!prevActive));
    // setActiveSearchVideo(true)
    setSearchBtn(false);

    setActiveNotes(false);
    setActiveGoLive(false);
    setActiveQuiz(false);
  };

  const [activeIndexVideos, setActiveIndexVideos] = useState({});
  const handleClickIndexVideos = (index) => () => {
    setActiveIndexVideos((state) => ({
      //...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  const [activeNotes, setActiveNotes] = useState(false);
  const handleClickNotes = () => {
    setActiveNotes((prevActive) => setActiveNotes(!prevActive));

    setActiveVideo(false);
    setActiveGoLive(false);
    setActiveQuiz(false);
  };

  const [activeIndexNotes, setActiveIndexNotes] = useState({});
  const handleClickIndexNotes = (index) => () => {
    setActiveIndexNotes((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  const [activeGoLive, setActiveGoLive] = useState(false);
  const handleClickGoLive = () => {
    setActiveGoLive((prevActive) => setActiveGoLive(!prevActive));

    setActiveVideo(false);
    setActiveNotes(false);
    setActiveQuiz(false);
  };

  const [activeQuiz, setActiveQuiz] = useState(false);
  const handleClickQuiz = () => {
    setActiveQuiz((prevActive) => setActiveQuiz(!prevActive));

    setActiveVideo(false);
    setActiveNotes(false);
    setActiveGoLive(false);
  };

  const [activeIndexQuiz, setActiveIndexQuiz] = useState({});
  const [activeProjectIndex, setActiveProjectIndex] = useState({});
  const handleClickProjectIndex = (index) => () => {
    setActiveProjectIndex((state) => ({
      ...state,
      [index]: !state[index],
    }));
  };
  const handleClickIndexQuiz = (index) => () => {
    setActiveIndexQuiz((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  const [activeScheduleLive, setActiveScheduleLive] = useState(true);

  // const [activeSearchVideo, setActiveSearchVideo] = useState(true);

  const [quiz, setQuiz] = useState([]);
  const [quizUrl, setQuizUrl] = useState("");

  const [file, setFile] = useState([]);

  //   const QuizHandleChange = (i, event) => {
  //     const values = [...quiz];
  //     values[i].value = event.target.value;
  //     setQuiz(values);
  // }

  const addQuiz = async () => {
    Post(1, "add_quiz_to_module", {
      module_id: module.id,
      quiz_link: quizUrl,
    }).then(async (data) => {
      if (data) {
        setQuizUrl("");
        await update();
        store.dispatch({ type: "SHOW_SUCCESS", message: "Quiz added successfully" });
      }
    });
  };

  const fetchReadingMaterial = (e) => {
    let data = new FormData();
    data.append("module_id", module.id);
    data.append("pdf_file", e.target.files[0]);
    Post(1, "add_reading_material_to_module", data).then(async (data) => {
      console.log(data);
      store.dispatch({ type: "SHOW_SUCCESS", message: "reading material added successfully" });
      await update();
    });
  };

  const handleUpload = (e) => {
    // setFile(e.target.files[0]);

    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      // add an "id" property to each File object
      setFile((prevState) => [...prevState, newFile]);
      console.log(newFile);
    }
  };

  const handleCardClick = (video) => {
    // history.push(
    //   "/dashboard/videos/" +
    //     video.url +
    //     "?course=" +
    //     encodeURIComponent(course_slug) +
    //     "&start=" +
    //     (video.pivot?.start_time ?? 0) +
    //     (parseInt(video.pivot?.end_time ?? 0) > 0 ? "&end=" + video.pivot.end_time : "")
    // );
  };

  // const clickGoLive = () => {
  //   history.push(
  //     "https://www.pages.beyondexams.org/schedule-live-classes/schedule-live-classes" +
  //       "?course=" +
  //       "how-to-start-a-startup-3e748" +
  //       "&profile=" +
  //       "pankaj-baranwal-b884b"
  //   );
  //   // console.log(module)
  // }

  const error = () => {
    swal("Please try again", "Some error occured while fetching the video", "error");
  };

  const fetchVideo = async (e) => {
    setFetchLoading(true);
    try {
      let youtubeId = new URL(url).searchParams.get("v");
      if (!youtubeId) {
        let tempURL = url.split("youtu.be/")[1];
        if (tempURL) {
          youtubeId = tempURL.slice(0, 11);
        } else if (!youtubeId) {
          // youtubeId = new URL(url).searchParams.get("id");
          let BeUrl = url.split("videos/")[1];
          if (BeUrl) {
            youtubeId = BeUrl.slice(0, 11);
          } else {
            let Url = new URL(url);
            let BeUrl = Url.split("/")[1];
            if (BeUrl) {
              youtubeId = BeUrl.slice(0, 11);
            }
          }
        }
      }
      if (youtubeId) {
        let response = await VideoById(key[Math.floor(Math.random() * key.length)], youtubeId);

        if (response) {
          if (response.data.items.length > 0) {
            setVideoId(youtubeId);
            if (dontAskAgain) {
              axios({
                url: `${baseDomain.route}${baseDomain.subRoute}/add_video_to_module`,
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                  Accept: "application/json;charset=UTF-8",
                },
                data: {
                  // end_time: endTime,
                  module_id: module.id,
                  video_url: youtubeId,
                  // start_time: startTime,
                  // ordering: -1,
                },
              })
                .then(async (data) => {
                  await update();
                  setUrl("");
                  setVideoId("");
                  setOpenTimeDialog(false);
                  setStartHour(0);
                  setStartMin(0);
                  setStartSec(0);
                  setEndHour(0);
                  setEndMin(0);
                  setEndSec(0);
                  setFetchLoading(false);
                  store.dispatch({ type: "SHOW_SUCCESS", message: "Video added successfully" });
                })
                .catch((e) => {
                  console.log(e);
                  setFetchLoading(false);
                  swal("Error", e.response.data.message, "error");
                });
            } else {
              setOpenTimeDialog(true);
            }
          } else {
            setFetchLoading(false);
            error();
          }
        }
      } else {
        setFetchLoading(false);
        error();
      }
    } catch (err) {
      setFetchLoading(false);
      error();
    }
  };

  const editModule = () => {
    if (
      localStorage.getItem("role_id") === "2" &&
      module.user_id.toString() === localStorage.getItem("phoenix_user_id")
    ) {
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/edit_module`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: {
          module_id: module.id,
          title: addModuleTitle,
        },
      })
        .then((data) => {
          swal("Updated", "Module updated successfully", "success");
          setOpenAddModule(false);
          update();
          setAddModuleTitle("");
        })
        .catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });
    }
  };

  const handleVideoDelete = (url) => {
    if (
      localStorage.getItem("role_id") === "2" &&
      module.user_id.toString() === localStorage.getItem("phoenix_user_id")
    ) {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this video?",
        icon: "warning",
        buttons: ["NO", "YES"],
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/remove_video_from_module`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              Accept: "application/json;charset=UTF-8",
            },
            data: {
              module_id: module.id,
              video_url: url,
            },
          })
            .then((data) => {
              update();
              swal("Video Deleted", "Video Deleted Successfully", "success").then((ok) => {});
            })
            .catch((e) => {
              console.log(e);
              swal("Error", e.response.data.message, "error");
            });
        }
      });
    }
  };
  const handleReadingMaterialDelete = (slug) => {
    if (
      localStorage.getItem("role_id") === "2" &&
      module.user_id.toString() === localStorage.getItem("phoenix_user_id")
    ) {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete ?",
        icon: "warning",
        buttons: ["NO", "YES"],
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          Post(1, "remove_reading_material_from_module", { module_id: module.id, reading_material_slug: slug })
            .then((data) => {
              update();
              swal("Reading Material Deleted", "Reading Material Deleted Successfully", "success").then((ok) => {});
            })
            .catch((e) => {
              console.log(e);
              swal("Error", e.response.data.message, "error");
            });
        }
      });
    }
  };
  const handleQuizDelete = (slug) => {
    if (
      localStorage.getItem("role_id") === "2" &&
      module.user_id.toString() === localStorage.getItem("phoenix_user_id")
    ) {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete ?",
        icon: "warning",
        buttons: ["NO", "YES"],
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          Post(1, "remove_quiz_from_module", { module_id: module.id, quiz_slug: slug })
            .then((data) => {
              update();
              swal("Quiz Deleted", "Quiz Deleted Successfully", "success").then((ok) => {});
            })
            .catch((e) => {
              console.log(e);
              swal("Error", e.response.data.message, "error");
            });
        }
      });
    }
  };

  const fetchSearchResults = () => {
    if (searchQuery) {
      setLoading(true);
      axios({
        method: "GET",
        url: `${baseDomain.route}${baseDomain.subRoute}/youtube_search_data`,
        params: {
          search: searchQuery,
        },
      })
        .then((res) => {
          if (res.data && res.data.final_response) {
            setSearchVideos(res.data.final_response);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          swal("Error", error.message, "error");
        });
    }
  };

  const handleCopy = (vid_url) => {
    setSearchBtn(false);
    // setActiveSearchVideo(true);
    setSeachQuery("");
    setSearchVideos([]);
    setVideoResultClickVideo("");
    let lcl_url = "https://youtube.com/watch?v=" + vid_url;
    setUrl(lcl_url);
  };

  const handleSubmit = async (id) => {
    setOpenTimeDialog(false);
    setSubmitLoading(true);
    let startTime = parseInt(startSec) + 60 * parseInt(startMin) + 60 * 60 * parseInt(startHour);
    let endTime = parseInt(endSec) + 60 * parseInt(endMin) + 60 * 60 * parseInt(endHour);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_to_module`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        end_time: endTime,
        module_id: module.id,
        video_url: videoId,
        start_time: startTime,
        // ordering: -1,
      },
    })
      .then(async (data) => {
        await update();
        setUrl("");
        setVideoId("");
        setOpenTimeDialog(false);
        setStartHour(0);
        setStartMin(0);
        setStartSec(0);
        setEndHour(0);
        setEndMin(0);
        setEndSec(0);
        setFetchLoading(false);
        setSubmitLoading(false);
        store.dispatch({ type: "SHOW_SUCCESS", message: "Video added successfully" });
      })
      .catch((e) => {
        console.log(e);
        setFetchLoading(false);
        setSubmitLoading(false);
        swal("Error", e.response.data.message, "error");
      });
  };

  useEffect(() => {
    module.videos.sort(function (a, b) {
      return a.pivot.ordering - b.pivot.ordering;
    });
    setVideos(module.videos);

    module.notes.sort(function (a, b) {
      return a.pivot.ordering - b.pivot.ordering;
    });
    setFile(module.notes);

    module.quizzes.sort(function (a, b) {
      return a.pivot.ordering - b.pivot.ordering;
    });
    setQuiz(module.quizzes);
    setProjects(module.projects);

    //duration logic
    let lcl_tt = Math.ceil(module.duration / 60);
    if (lcl_tt < 60) {
      setModuleTime(lcl_tt + " minutes");
    } else {
      let lcl_tt_h = Math.floor(lcl_tt / 60);
      let lcl_tt_m = lcl_tt % 60;
      if (lcl_tt_m !== 0) {
        lcl_tt_h === 1
          ? lcl_tt_m === 1
            ? setModuleTime(lcl_tt_h + " hour " + lcl_tt_m + " minute")
            : setModuleTime(lcl_tt_h + " hour " + lcl_tt_m + " minutes")
          : lcl_tt_m === 1
          ? setModuleTime(lcl_tt_h + " hours " + lcl_tt_m + " minute")
          : setModuleTime(lcl_tt_h + " hours " + lcl_tt_m + " minutes");
      } else {
        lcl_tt_h === 1 ? setModuleTime(lcl_tt_h + " hour") : setModuleTime(lcl_tt_h + " hours");
      }
    }
  }, [module]);
  useEffect(() => {
    setTimeout(() => {
      let element = document.getElementById("video_des");
      if (element) {
        if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
          setShowMoreButton(true);
        } else {
          setShowMoreButton(false);
        }
      }
    }, 10);
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const setStart = async () => {
    let time = await playerRef.current.internalPlayer.getCurrentTime();
    let hour = parseInt(time / (60 * 60));
    time = time % (60 * 60);
    let min = parseInt(time / 60);
    time = time % 60;
    let sec = parseInt(time);
    setStartHour(hour);
    setStartMin(min);
    setStartSec(sec);
  };
  const setEnd = async () => {
    let time = await playerRef.current.internalPlayer.getCurrentTime();
    let hour = parseInt(time / (60 * 60));
    time = time % (60 * 60);
    let min = parseInt(time / 60);
    time = time % 60;
    let sec = parseInt(time);
    setEndHour(hour);
    setEndMin(min);
    setEndSec(sec);
  };
  const handleClose = () => {
    setUrl("");
    setVideoId("");
    setOpenTimeDialog(false);
    setStartHour(0);
    setStartMin(0);
    setStartSec(0);
    setEndHour(0);
    setEndMin(0);
    setEndSec(0);
    setFetchLoading(false);
    setDontAskAgain(false);
  };
  const handleLiveNow = () => {
    window.open(link, "_blank").focus();
    Post(1, "add_live_class_to_module", {
      module_id: module.id,
      meet_link: link,
    });
  };
  const handleDropDownClose = (index) => {
    setOpen(null);
  };
  const handleDropDownClick = (e, index) => {
    switch (index) {
      case 1: {
        setDropDownText("Youtube Video");
        handleClickVideo();
        break;
      }
      case 2: {
        setDropDownText("Reading Material");
        handleClickNotes();
        break;
      }
      case 3: {
        setDropDownText("Go Live");
        window
          .open(
            `https://www.pages.beyondexams.org/schedule-live-classes?module_id=${
              module.id
            }&profile=${localStorage.getItem("slug")}`
          )
          .focus();
        break;
      }
      case 4: {
        setDropDownText("Quiz");
        handleClickQuiz();
        break;
      }
      case 5: {
        setDropDownText("Project");
        setOpenAddProject(true);
        break;
      }
    }
    handleDropDownClose();
  };
  // const handleScheduleNow = () => {
  //   Post(1, "set_live_session", {
  //     course_slug: course.slug,
  //     meet_link: link,
  //     // start_time: startTime,
  //     // end_time: endTime,
  //     date: moment(selectedDate).format("DD/MM/YYYY"),
  //   }).then(() => {
  //     setOpen(false);
  //     swal(
  //       "Meeting Scheduled",
  //       `Meeting Scheduled Successfully on ${moment(selectedDate).format("DD/MM/YYYY")} at ${startTime}`,
  //       "success"
  //     );
  //   });
  // };
  const handleShowMoreClick = () => {
    setShowMore((prev) => !prev);
  };
  const handleProjectSubmit = async () => {
    await Post(1, "add_project_to_module", { module_id: module.id, title }).then(() => {
      // props.showSuccess("Project added successfully.");
      notify(`🔑 You got ${PROJECT_ADD_KEYS} keys for adding a project.`);
      setTitle("");
    });
    setOpenAddProject(false);
  };
  return (
    <div className="moduleSection">
      <div className="moduleStart">
        <Accordion className={classes.accordian} expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="expandMoreIcon" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.accordianSummary}
          >
            <div className="module_num">
              <h3>{count}</h3>
            </div>
            <div className="moduleHeader" data-tut="module">
              <div className="spacer"></div>
              <div className="moduleHeaderContent">
                <div className="moduleContentLeft">
                  <div className="moduleTitle">Module {count} :</div>
                  <div className="moduleTitleMain">
                    <div className="moduleTitleMainTitle moduleTitle">{module.title}</div>
                  </div>
                </div>
                {localStorage.getItem("role_id") === "2" &&
                module.user_id.toString() === localStorage.getItem("phoenix_user_id") ? (
                  <div className="moduleEnd">
                    <IconButton
                      className={classes.smallerEdit}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddModule(true);
                      }}
                    >
                      <Edit className="module-edit-icon" />
                    </IconButton>
                  </div>
                ) : null}
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails className={classes.moduleContent} id={module.id}>
            {localStorage.getItem("role_id") === "2" &&
              module.user_id.toString() === localStorage.getItem("phoenix_user_id") && (
                <div className="add-video-div addVideoDiv">
                  <div className={styles.dropDown}>
                    <div
                      className="notes-dropdown"
                      onClick={(e) => {
                        setOpen(e.currentTarget);
                      }}
                    >
                      <div className={"enrollBtn"}>
                        <p>{dropDownText}</p>
                        <ExpandMoreIcon style={{ fontSize: "18px" }} />
                      </div>
                    </div>
                    <Popper open={Boolean(open)} anchorEl={open} role={undefined} transition disablePortal>
                      {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                          <div className="drop-list">
                            <ClickAwayListener onClickAway={handleDropDownClose}>
                              <MenuList id="privacy-list">
                                <MenuItem onClick={(e) => handleDropDownClick(e, 1)}>Youtube Video</MenuItem>
                                <MenuItem onClick={(e) => handleDropDownClick(e, 2)}>Reading Material</MenuItem>
                                <MenuItem onClick={(e) => handleDropDownClick(e, 3)}>Go Live</MenuItem>
                                <MenuItem onClick={(e) => handleDropDownClick(e, 4)}>Quiz</MenuItem>
                                <MenuItem onClick={(e) => handleDropDownClick(e, 5)}>Project</MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </div>
                        </Grow>
                      )}
                    </Popper>
                  </div>
                  {/* <div className={styles.btns}>
                    <button class={activeVideo ? styles.active : ""} onClick={handleClickVideo}>
                      <p>+</p> Youtube video
                    </button>
                    <button class={activeNotes ? styles.active : ""} onClick={handleClickNotes}>
                      <p>+</p> Reading material
                    </button>
                    <a
                      href={`https://www.pages.beyondexams.org/schedule-live-classes?course=${encodeURIComponent(
                        course_slug
                      )}&profile=${localStorage.getItem("slug")}`}
                      target="_blank"
                    >
                      <button class={activeGoLive ? styles.active : ""}>
                        <p>+</p> Go live
                      </button>
                    </a>
                    <button class={activeQuiz ? styles.active : ""} onClick={handleClickQuiz}>
                      <p>+</p> Quiz
                    </button>
                  </div> */}

                  <div class={"flex videoFlex" + " " + (activeVideo ? styles.panelActive : "")}>
                    <>
                      <div className="inputInside" data-tut="url">
                        <input
                          type="text"
                          className="add-video-input addVideoModule"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                          }}
                          placeholder="https://www.youtube.com/watch?v=805ElUjEJ1I"
                        />
                        <button
                          className="fetch-btn videoFetchBtn"
                          // disabled={!url}
                          onClick={() => fetchVideo()}
                          // onClick={() => {
                          //   setOpenTimeDialog(true);
                          // }}
                        >
                          {fetchLoading ? <CircularProgress size={20} color="white" /> : "Fetch"}
                        </button>
                      </div>
                      <span style={{ marginRight: "20px", color: "gray", fontSize: "15px" }}>or</span>
                      <button
                        data-tut="s-icon"
                        className="searchBtn"
                        onClick={() => {
                          setSearchBtn(true);
                        }}
                        // onClick={() => setActiveSearchVideo(false)}
                      >
                        <SearchRoundedIcon />
                      </button>
                    </>
                  </div>

                  <div className={`${searchBtn ? "searchVisible" : ""} searchOverlay`}>
                    <div className="searchOverlayTop">
                      <form
                        className="searchQueryDiv"
                        onSubmit={(e) => {
                          e.preventDefault();
                          fetchSearchResults();
                        }}
                      >
                        <input
                          className="searchQueryInput"
                          type="text"
                          placeholder="Search a video"
                          value={searchQuery}
                          onChange={(e) => {
                            setSeachQuery(e.target.value);
                          }}
                        />
                        <button className="searchQueryBtn" type="submit">
                          <SearchRoundedIcon />
                        </button>
                      </form>
                      <IconButton
                        onClick={() => {
                          setSearchBtn(false);
                          // setActiveSearchVideo(true)
                          setSeachQuery("");
                          setSearchVideos([]);
                          setVideoResultClickVideo("");
                        }}
                        className="searchQueryCloseBtn"
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    </div>

                    {loading ? (
                      <div className="searchLoader">
                        <CircularProgress />
                      </div>
                    ) : (
                      <div className="searchOverlayBottom">
                        {videoResultClickVideo ? (
                          <VideoResultPlayer
                            video={videoResultClickVideo}
                            handleBack={() => {
                              setVideoResultClickVideo("");
                            }}
                            handleCopy={handleCopy}
                          />
                        ) : (
                          searchVideos.map((video, index) => (
                            <VideoResult
                              video={video}
                              handleCopy={handleCopy}
                              key={index}
                              handleVideoResultClick={(v) => {
                                setVideoResultClickVideo(v);
                              }}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* className={`${searchBtn ? "searchVisible" : ""} searchOverlay`} */}

                  <div class={"videoFlex" + " " + (activeNotes ? styles.panelActive : "")}>
                    <label for="reading_material">
                      <div className="inputInside" data-tut="url">
                        <p className="placeholder addVideoModule">Add DOC/PDF/JPEG/PNG</p>
                        <input
                          type="file"
                          id="reading_material"
                          accept="application/pdf, application/vnd.ms-excel"
                          onChange={fetchReadingMaterial}
                          className={styles.none}
                        />
                        <div className="fetch-btn videoFetchBtn">Browse</div>
                      </div>
                    </label>
                  </div>

                  <div class={"goLive" + " " + (activeGoLive ? styles.panelActive : "")}>
                    {activeScheduleLive ? (
                      <>
                        {/* <button>Go Live Now</button> */}
                        <div className={styles.goLiveInput}>
                          <input
                            placeholder="Enter a meet link"
                            onChange={(e) => {
                              setLink(e.target.value);
                            }}
                          />
                          <button onClick={handleLiveNow} disabled={!link}>
                            Go Live Now
                          </button>
                        </div>
                        <button
                          onClick={() => setShowSchedule(true)}
                          // onClick={() => setActiveScheduleLive(false)}
                        >
                          Schedule Live
                        </button>
                        {showSchedule && (
                          <GoLive course={course} handleClose={() => setShowSchedule(false)} module={module} />
                        )}
                      </>
                    ) : (
                      <div className={styles.scheduleLive}>
                        <input placeholder="Topic name here" />
                        <div className={styles.scheduleLiveTiming}>
                          <HourglassEmptyIcon style={{ color: "#6646E8" }} />
                          <p>
                            Feb 4, 2022 <br /> 12 - 1 PM
                          </p>
                        </div>
                        <button>Go Live</button>
                        <DeleteOutlinedIcon
                          onClick={() => setActiveScheduleLive(true)}
                          style={{ color: "#6646E8", cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </div>

                  <div class={"videoFlex" + " " + (activeQuiz ? styles.panelActive : "")}>
                    {/* <div className={styles.quizInput}>
                        <input
                          placeholder="Enter a quiz link"
                        />
                        <button>Add Quiz</button>
                      </div> */}
                    <div className="inputInside" data-tut="url">
                      <input
                        type="text"
                        className="add-video-input addVideoModule"
                        placeholder="Enter a quiz link"
                        value={quizUrl}
                        onChange={(e) => setQuizUrl(e.target.value)}
                      />
                      <button className="fetch-btn videoFetchBtn" onClick={() => addQuiz()}>
                        Add Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}
            {localStorage.getItem("role_id") === "2" &&
              module.user_id.toString() === localStorage.getItem("phoenix_user_id") && (
                <>
                  <ReactSortable
                    group="groupName"
                    animation={300}
                    delayOnTouchStart={true}
                    delay={2}
                    list={videos}
                    setList={setVideos}
                    onEnd={changeOrder}
                  >
                    {videos.map((video, index) => (
                      <Grid
                        item
                        className={classes.moduleDesc}
                        key={index}
                        onClick={() => handleCardClick(video, module.category_id)}
                      >
                        <div
                          className={styles.pdfTitle}
                          onDragStart={() => dragStart(video.url, module.id)}
                          draggable={
                            localStorage.getItem("role_id") === "2" &&
                            module.user_id.toString() === localStorage.getItem("phoenix_user_id")
                              ? "true"
                              : "false"
                          }
                        >
                          {video.title ? (
                            <h5>
                              <Video />
                            </h5>
                          ) : null}
                          <p
                            class={activeIndexVideos[index] ? styles.active : ""}
                            onClick={handleClickIndexVideos(index)}
                          >
                            {video.title}
                          </p>

                          <DeleteOutlineIcon
                            style={{ marginLeft: "10px", color: "gray", fontSize: "20px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoDelete(video.url);
                            }}
                          />
                        </div>

                        <div class={styles.actionBox + " " + (activeIndexVideos[index] ? styles.actionBoxActive : "")}>
                          <>
                            <div className={styles.actionBoxContent}>
                              <div className={styles.actionBoxContentHeading}>
                                <h5> {video.title}</h5>
                              </div>
                              <p
                                className={style.description + " " + (showMore ? style.showMoreActive : "")}
                                id="video_des"
                              >
                                {video.description}
                              </p>
                              {showMoreButton && (
                                <Button
                                  color="primary"
                                  size="small"
                                  className={style.showMore}
                                  onClick={handleShowMoreClick}
                                >
                                  {showMore ? "SHOW LESS" : "SHOW MORE"}
                                </Button>
                              )}
                            </div>

                            <div className={styles.actionBoxBtn}>
                              <p
                                onClick={() => {
                                  history.push(
                                    "/dashboard/videos/" +
                                      video.url +
                                      "?course=" +
                                      encodeURIComponent(course_slug) +
                                      "&start=" +
                                      (video.pivot?.start_time ?? 0) +
                                      (parseInt(video.pivot?.end_time ?? 0) > 0 ? "&end=" + video.pivot.end_time : "")
                                  );
                                }}
                              >
                                Watch Video
                              </p>
                            </div>
                          </>
                        </div>
                      </Grid>
                    ))}
                  </ReactSortable>
                  {file.map((file, index) => {
                    return (
                      <Grid
                        item
                        className={classes.moduleDesc}
                        key={index}
                        // onClick={() => handleCardClick(video, module.category_id)}
                      >
                        <div class={styles.pdfTitle}>
                          {file.title ? (
                            <h5>
                              <PdfIcon />
                            </h5>
                          ) : null}
                          {/* <p class={activeIndexNotes[index] ? styles.active : ""} onClick={handleClickIndexNotes(index)}> */}
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.title}
                          </a>
                          {/* </p> */}
                          <DeleteOutlineIcon
                            style={{ marginLeft: "10px", color: "gray", fontSize: "20px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadingMaterialDelete(file.slug);
                            }}
                          />
                        </div>

                        {/* <div class={styles.actionBox + " " + (activeIndexNotes[index] ? styles.actionBoxActive : "")}>
                        <>
                          <div className={styles.actionBoxContent}>
                            <div className={styles.actionBoxContentHeading}>
                              <h5>Engineering</h5>
                            </div>
                            <p>
                              Engineering Semper nisl magna amet eu hac dui netus. Libero condimentum aliquam eros, at
                              arcu cursus in est.
                            </p>
                          </div>

                          <div className={styles.actionBoxBtn}>
                            <p>
                              <a href={file.url} target="_blank">
                                Read notes
                              </a>
                            </p>
                          </div>
                        </>
                      </div> */}
                      </Grid>
                    );
                  })}
                  {quiz.map((item, index) => (
                    <Grid
                      item
                      className={classes.moduleDesc}
                      key={index}
                      // onClick={() => handleCardClick(video, module.category_id)}
                    >
                      <div className={styles.pdfTitle}>
                        {item.url ? (
                          <h5>
                            <Quiz />
                          </h5>
                        ) : null}
                        <a href={item.url ?? ""} target="_blank" rel="noopener noreferrer">
                          {/* <p
                            class={activeIndexQuiz[index] ? styles.active : ""}
                            onClick={handleClickIndexQuiz(index)}
                          > */}
                          Time for a quiz!
                          {/* </p> */}
                        </a>
                        <DeleteOutlineIcon
                          style={{ marginLeft: "10px", color: "gray", fontSize: "20px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuizDelete(item.slug);
                          }}
                        />
                      </div>

                      {/* <div class={styles.actionBox + " " + (activeIndexQuiz[index] ? styles.actionBoxActive : "")}>
                        <>
                          <div className={styles.actionBoxContent}>
                            <div className={styles.actionBoxContentHeading}>
                              <h5>Engineering</h5>
                            </div>
                            <p>
                              Engineering Semper nisl magna amet eu hac dui netus. Libero condimentum aliquam eros, at
                              arcu cursus in est.
                            </p>
                          </div>

                          <div className={styles.actionBoxBtn}>
                            <p>
                              <a href={item.url} target="_blank">
                                View Quiz
                              </a>
                            </p>
                          </div>
                        </>
                      </div> */}
                    </Grid>
                  ))}
                  {projects.map((file, index) => {
                    return (
                      <Grid
                        item
                        className={classes.moduleDesc}
                        key={index}
                        // onClick={() => handleCardClick(video, module.category_id)}
                      >
                        <div class={styles.pdfTitle}>
                          <h5>
                            <Quiz />
                          </h5>

                          <p
                            class={activeProjectIndex[index] ? styles.active : ""}
                            onClick={handleClickProjectIndex(index)}
                          >
                            Complete a project!
                          </p>

                          {/* <DeleteOutlineIcon
                            style={{ marginLeft: "10px", color: "gray", fontSize: "20px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadingMaterialDelete(file.slug);
                            }}
                          /> */}
                        </div>

                        <div class={styles.actionBox + " " + (activeProjectIndex[index] ? styles.actionBoxActive : "")}>
                          <>
                            <div className={styles.actionBoxContent}>
                              <div className={styles.actionBoxContentHeading}>
                                <h5>Final Step : Hands on projects</h5>
                              </div>
                              <p>
                                Learning is more than just watching videos or scoring marks. Do a project to make sure
                                you can implement what you have learnt!
                              </p>
                            </div>

                            <div className={styles.actionBoxBtn}>
                              {/* <p>View Projects</p> */}
                              <ModuleProject
                                projects={projects}
                                course={course}
                                module={module}
                                openViewProjects={openViewProjects}
                                toggleOpenViewProjects={(bool) => {
                                  setOpenViewProjects(bool);
                                }}
                              />
                            </div>
                          </>
                        </div>
                      </Grid>
                    );
                  })}
                </>
              )}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="moduleDetail"></div>
      <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Edit Module</Box>
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
          <Button onClick={editModule} color="primary" disabled={!addModuleTitle}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTimeDialog} onClose={handleClose} classes={{ paper: classes.dialogBG }}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Set start time & end time</Box>
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="ui embed">
            <Youtube
              videoId={videoId}
              ref={playerRef}
              onReady={async (e) => {
                let maxTime = await e.target.getDuration();
                setMax(maxTime);
                console.log(maxTime);
                let hour = parseInt(maxTime / (60 * 60));
                maxTime = maxTime % (60 * 60);
                let min = parseInt(maxTime / 60);
                maxTime = maxTime % 60;
                let sec = maxTime;
                setEndHour(hour);
                setEndMin(min);
                setEndSec(sec);
              }}
            />
          </div>
          <div className="spacing-1"></div>
          <div className="add-video-div">
            <div className="flex add-video-title-div">
              <Button variant="outlined" color="primary" size="small" onClick={setStart}>
                Set Start Time
              </Button>
            </div>
            <div className="flex gap_10 m_video_time">
              <TextField
                id="start_hour"
                type="number"
                size="small"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                placeholder="Hour"
                inputProps={{
                  step: 1,
                  min: 0,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Hr</InputAdornment>,
                }}
              />
              <TextField
                id="start_min"
                type="number"
                size="small"
                value={startMin}
                onChange={(e) => setStartMin(e.target.value)}
                placeholder="Min"
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 60,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Min</InputAdornment>,
                }}
              />
              <TextField
                id="start_sec"
                type="number"
                size="small"
                value={startSec}
                onChange={(e) => setStartSec(e.target.value)}
                placeholder="Sec"
                inputProps={{
                  step: 5,
                  min: 0,
                  max: 60,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Sec</InputAdornment>,
                }}
              />
            </div>
            <div className="spacing-1"></div>
            <div className="flex add-video-title-div">
              <Button variant="outlined" color="primary" size="small" onClick={setEnd}>
                Set End Time
              </Button>
            </div>

            <div className="flex gap_10 m_video_time">
              <TextField
                id="end_hour"
                type="number"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">Hr</InputAdornment>,
                }}
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                placeholder="Hour"
                inputProps={{
                  step: 1,
                  min: 0,
                }}
              />
              <TextField
                id="end_min"
                type="number"
                size="small"
                value={endMin}
                onChange={(e) => setEndMin(e.target.value)}
                placeholder="Min"
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 60,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Min</InputAdornment>,
                }}
              />
              <TextField
                id="end_sec"
                type="number"
                size="small"
                value={endSec}
                onChange={(e) => {
                  setEndSec(e.target.value);
                }}
                placeholder="Sec"
                inputProps={{
                  step: 5,
                  min: 0,
                  max: 60,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Sec</InputAdornment>,
                }}
              />
            </div>
            <div className="spacing-1" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontAskAgain}
                  color="primary"
                  onChange={(e) => {
                    setDontAskAgain(e.target.checked);
                  }}
                />
              }
              label="Dont ask again for this course"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={!max}>
            {submitLoading ? <CircularProgress size={20} color="white" /> : <>Submit</>}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddProject} onClose={() => setOpenAddProject(false)} classes={{ paper: classes.paper }}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Add Project</Box>
          </Typography>
          <IconButton onClick={() => setOpenAddProject(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="add-video-div">
            <div className="flex">
              <textarea
                rows={6}
                type="text"
                className="add-video-input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="For eg: Submit a pdf file containing details how to setup a ubuntu server."
              />
            </div>

            <div className="key-info">
              <p style={{ textAlign: "center", fontSize: 12 }}>Earn {PROJECT_ADD_KEYS} bonus keys by adding project.</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddProject(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleProjectSubmit()} color="primary" disabled={!title}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Module;
