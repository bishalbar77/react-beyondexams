import React, { useState, useEffect } from "react";
import styles from "./Accordion.module.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Point from "../../../../../assets/images/icons/point.png";

import { ReactComponent as LiveClass } from "./asset/live-class.svg";
import { ReactComponent as VideoNotWatched } from "./asset/Video.svg";
import { ReactComponent as VideoWatched } from "./asset/videoWatched.svg";
import { ReactComponent as PdfIcon } from "./asset/pdf.svg";
import { ReactComponent as Quiz } from "./asset/quiz.svg";
import { ReactComponent as Bell } from "./asset/bell.svg";

import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  videoIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "26px",
    width: "26px",
    backgroundColor: "#6646E7",
    borderRadius: "100px",
  },
  videoNotWatched: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "26px",
    width: "26px",
    backgroundColor: "#D7D4D4",
    borderRadius: "100px",
  },
}));

export default function Accordion({ index, title, videos, notes, quizzes, live_classes, course_slug, videoPage }) {
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    let element = document.getElementById("video_desc");
    if (element) {
      if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
        // your element has an overflow
        // show read more button
        setShowMoreButton(true);
      } else {
        // your element doesn't have overflow
        setShowMoreButton(false);
      }
    }
  }, []);

  const [showMore, setShowMore] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const [active, setActive] = useState(index === 0 ? true : false);
  const handleClick = () => {
    setActive((prevActive) => setActive(!prevActive));
  };

  const [activeIndex, setActiveIndex] = useState({});
  const handleClickIndex = (index) => () => {
    setActiveIndex((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  const [activeIndexNotes, setActiveIndexNotes] = useState({});
  const handleClickIndexNotes = (index) => () => {
    setActiveIndexNotes((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  const [activeIndexVideos, setActiveIndexVideos] = useState({});
  const handleClickIndexVideos = (index) => () => {
    setActiveIndexVideos((state) => ({
      //...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };
  const handleShowMoreClick = () => {
    setShowMore((prev) => !prev);
  };

  const [activeIndexQuiz, setActiveIndexQuiz] = useState({});
  const handleClickIndexQuiz = (index) => () => {
    setActiveIndexQuiz((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

  // const handleCardClick = (video) => {
  //   history.push(
  //     "/dashboard/videos/" +
  //       video.url +
  //       "?course=" +
  //       encodeURIComponent(course_slug) +
  //       "&start=" +
  //       (video.pivot?.start_time ?? 0) +
  //       (parseInt(video.pivot?.end_time ?? 0) > 0 ? "&end=" + video.pivot.end_time : "")
  //   );
  // };

  return (
    <>
      <button class={styles.accordion + " " + (active ? styles.active : "")} onClick={handleClick}>
        <div>
          <span className={videoPage ? styles.videoNum : undefined}>{index + 1}</span>
          <p className={videoPage ? styles.videoTitle : undefined}>{title}</p>
        </div>
        <ExpandMoreIcon />
      </button>

      {videos.map((e, index) => (
        <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
          {/* <img src={<VideoNotWatched />} alt="point" /> */}
          <div>
            <div className={styles.title}>
              <div className={styles.icon}>
                <h3>
                  <div className={classes.videoNotWatched}>
                    <VideoNotWatched />
                  </div>
                </h3>
              </div>
              <p
                class={activeIndexVideos[index] ? styles.active : ""}
                // onClick={handleClickIndexVideos(index)}
              >
                {e.title}
              </p>
            </div>

            <div class={styles.actionBox + " " + (activeIndexVideos[index] ? styles.actionBoxActive : "")}>
              <>
                <div className={styles.actionBoxContent}>
                  <div className={styles.actionBoxContentHeading}>
                    <h5>{e.title}</h5>
                  </div>
                  <p className={styles.description + " " + (showMore ? styles.showMoreActive : "")} id="video_desc">
                    {e.description}
                  </p>
                  {showMoreButton && (
                    <Button color="primary" size="small" className={styles.showMore} onClick={handleShowMoreClick}>
                      {showMore ? "SHOW LESS" : "SHOW MORE"}
                    </Button>
                  )}
                </div>

                <div className={styles.actionBoxBtn}>
                  <p
                    onClick={() => {
                      history.push(
                        "/dashboard/videos/" +
                          e.url +
                          "?course=" +
                          encodeURIComponent(course_slug) +
                          "&start=" +
                          (e.pivot?.start_time ?? 0) +
                          (parseInt(e.pivot?.end_time ?? 0) > 0 ? "&end=" + e.pivot.end_time : "")
                      );
                    }}
                  >
                    Watch Video
                  </p>
                </div>
              </>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// e.thumbnails
