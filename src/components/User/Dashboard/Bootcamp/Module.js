import React, { useEffect, useState, useRef } from "react";
import VideoCard from "./VideoCard";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Youtube from "react-youtube";
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
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Edit } from "../../../../assets/images/icons/edit.svg";
import TagVideos from "../../../../assets/images/icons/tag_videos.png";
import TagClock from "../../../../assets/images/icons/tag_clock.png";
import { useHistory } from "react-router-dom";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import swal from "sweetalert";
import { VideoById, key } from "../../../common/videocommon";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";
import "../../../../assets/css/User/Dashboard/Module.css";
import VideoResult from "./VideoResult";
import VideoResultPlayer from "./VideoResultPlayer";
import TextField from "@material-ui/core/TextField";
import { ReactSortable } from "react-sortablejs";
import InputAdornment from "@material-ui/core/InputAdornment";
import store from "../../../../store";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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

function Module({ module, count, level, update, course_slug, dragStart, changeOrder, lastModule }) {
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
  const playerRef = useRef();

  const pauseAll = (url) => {
    setPauseVideos(true);
    setVideoUrl(url);
  };

  const handleCardClick = (video) => {
    history.push(
      "/dashboard/videos/" +
        video.url +
        "?course=" +
        encodeURIComponent(course_slug) +
        "&start=" +
        (video.pivot?.start_time ?? 0) +
        (parseInt(video.pivot?.end_time ?? 0) > 0 ? "&end=" + video.pivot.end_time : "")
    );
  };

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
                  ordering: -1,
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
        ordering: -1,
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
            <div
              className={
                !expanded
                  ? lastModule
                    ? count === 1
                      ? ""
                      : "module_expanded_last"
                    : count === 1
                    ? "module_expanded_line"
                    : "module_expanded_line_full"
                  : count === 1
                  ? "module_num_line"
                  : "module_num_line_full"
              }
            />
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
                    <div className="moduleDownContent">
                      <div className="moduleTitleVideos">
                        <span>
                          <img src={TagVideos} alt="Tag Videos" />
                          &nbsp;&nbsp;
                          {module.num_videos === 1 ? "1 Video" : `${module.num_videos} Videos`}
                        </span>
                      </div>
                      <div className="moduleTitleDuration">
                        {moduleTime ? (
                          <span>
                            <img src={TagClock} alt="Tag Clock" />
                            &nbsp;&nbsp;{moduleTime}
                          </span>
                        ) : null}
                      </div>
                    </div>
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
                  <div className="flex add-video-title-div addVideoTitle">
                    <p className="add-video-title">Add Video URL</p>
                    <InfoOutlinedIcon />
                  </div>
                  <div className="flex videoFlex">
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
                    <button
                      data-tut="s-icon"
                      className="searchBtn"
                      onClick={() => {
                        setSearchBtn(true);
                      }}
                    >
                      <SearchRoundedIcon />
                    </button>
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
                </div>
              )}
            {localStorage.getItem("role_id") === "2" &&
            module.user_id.toString() === localStorage.getItem("phoenix_user_id") ? (
              <ReactSortable
                group="groupName"
                animation={300}
                delayOnTouchStart={true}
                delay={2}
                list={videos}
                setList={setVideos}
                onEnd={(e) => {
                  changeOrder(e);
                }}
              >
                {videos.map((video, index) => (
                  <Grid
                    item
                    className={classes.moduleDesc}
                    key={index}
                    onClick={() => handleCardClick(video, module.category_id)}
                  >
                    <VideoCard
                      handleVideoDelete={handleVideoDelete}
                      video={video}
                      module={module}
                      ondragstart={dragStart}
                      count={index + 1}
                      moduleCount={count}
                      lastVideo={index === videos.length - 1}
                      lastModule={lastModule}
                      pauseAll={pauseAll}
                      url={videoUrl}
                    />
                  </Grid>
                ))}
              </ReactSortable>
            ) : (
              videos.map((video, index) => (
                <Grid
                  item
                  className={classes.moduleDesc}
                  key={index}
                  onClick={() => handleCardClick(video, module.category_id)}
                >
                  <VideoCard
                    handleVideoDelete={handleVideoDelete}
                    video={video}
                    module={module}
                    ondragstart={dragStart}
                    count={index + 1}
                    moduleCount={count}
                    lastVideo={index === videos.length - 1}
                    lastModule={lastModule}
                    pauseAll={pauseAll}
                    url={videoUrl}
                  />
                </Grid>
              ))
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
    </div>
  );
}

export default Module;
