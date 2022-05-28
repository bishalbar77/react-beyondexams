import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModuleProject from "../Project/ModuleProject";
import styles from "./Accordion.module.css";
import { ReactComponent as LiveClass } from "./asset/live-class.svg";
import { ReactComponent as PdfIcon } from "./asset/pdf.svg";
import { ReactComponent as Quiz } from "./asset/quiz.svg";
import { ReactComponent as VideoNotWatched } from "./asset/video.svg";

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

export default function Accordion({
  index,
  title,
  videos,
  notes,
  quizzes,
  live_classes,
  course_slug,
  videoPage,
  modules,
  module,
  projects,
  course,
}) {
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
  const [openViewProjects, setOpenViewProjects] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState({});
  const handleClickProjectIndex = (index) => () => {
    setActiveProjectIndex((state) => ({
      // ...state,
      [index]: !state[index],
    }));
  };
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
          <p className={videoPage ? styles.videoTitle : undefined} style={{ textAlign: "left" }}>
            {title}
          </p>
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
                  {e.watched_status[0]?.has_watched === 1 ? (
                    <div className={classes.videoIcon}>
                      <VideoNotWatched />
                    </div>
                  ) : (
                    <div className={classes.videoNotWatched}>
                      <VideoNotWatched />
                    </div>
                  )}
                </h3>
              </div>
              <p class={activeIndexVideos[index] ? styles.active : ""} onClick={handleClickIndexVideos(index)}>
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
                      console.log(encodeURIComponent(e.slug));
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

      {notes.map((e, index) => (
        <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
          <div>
            <div className={styles.title}>
              <div className={styles.icon}>
                <h3>
                  <PdfIcon />
                </h3>
              </div>
              {/* <p class={activeIndexNotes[index] ? styles.active : ""} onClick={handleClickIndexNotes(index)}> */}
              <a href={e.url} target="_blank" rel="noopener noreferrer">
                {e.title}
              </a>
              {/* </p> */}
            </div>

            {/* <div class={styles.actionBox + " " + (activeIndexNotes[index] ? styles.actionBoxActive : "")}>
              <>
                <div className={styles.actionBoxContent}>
                  <div className={styles.actionBoxContentHeading}>
                    <h5>Engineering</h5>
                  </div>
                  <p>
                    Engineering Semper nisl magna amet eu hac dui netus. Libero condimentum aliquam eros, at arcu cursus
                    in est. Platea amet, mauris, egestas varius nisl, commodo sed suspendisse pretium. Join live class
                  </p>
                </div>

                <div className={styles.actionBoxBtn}>
                  <p>
                    <a href={e.url} target="_blank">
                      Read notes
                    </a>
                  </p>
                </div>
              </>
            </div> */}
          </div>
        </div>
      ))}

      {live_classes.map((e, index) => (
        <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
          <div>
            <div
              class={styles.title + " " + (activeIndex[index] ? styles.active : "")}
              onClick={handleClickIndex(index)}
            >
              <div className={styles.icon}>
                <h3>
                  {!e.date ? (
                    <div className={classes.videoIcon}>
                      <LiveClass />
                    </div>
                  ) : (
                    <LiveClass />
                  )}
                </h3>
              </div>
              <a href={e.meet_link} target="_blank" rel="noopener noreferrer">
                {e.meet_link}
              </a>
            </div>

            {/* <div class={styles.actionBox + " " + (activeIndex[index] ? styles.actionBoxActive : "")}>
              <>
                <div className={styles.actionBoxContent}>
                  <div className={styles.actionBoxContentHeading}>
                    <h5>Engineering</h5>
                  </div>
                  <p>
                    Engineering Semper nisl magna amet eu hac dui netus. Libero condimentum aliquam eros, at arcu cursus
                    in est. Platea amet, mauris, egestas varius nisl, commodo sed suspendisse pretium. Join live class
                  </p>
                </div>

                <div className={styles.actionBoxBtn}>
                  <p><a href={e.meet_link} target="_blank">Join live class</a></p>
                </div>
              </>

              {/* <>
                  <div className={styles.liveClassContent}>
                    <div className={styles.liveClassContentHeading}>
                      <h5>January 28, 2022</h5>
                      <h5>12 - 1 PM</h5>
                      <h5>·</h5>
                      <h5>Engineering</h5>
                    </div>
                    <p>Engineering Semper nisl magna amet eu hac dui netus.
                      Libero condimentum aliquam eros, at arcu cursus in est. Platea amet, mauris, egestas varius nisl, 
                      commodo sed suspendisse pretium. Join live class
                    </p>
                  </div>

                  <div className={styles.liveClassBtn}>
                    <p><Bell /></p>
                  </div>
                </> */}

            {/* <>
                  <div className={styles.liveClassContent}>
                    <div className={styles.liveClassContentHeading}>
                      <h5>Engineering</h5>
                    </div>
                    <p>Engineering Semper nisl magna amet eu hac dui netus.
                      Libero condimentum aliquam eros, at arcu cursus in est. Platea amet, mauris, egestas varius nisl, 
                      commodo sed suspendisse pretium. Join live class
                    </p>
                  </div>

                  <div className={styles.liveClassTimer}>
                    <h4>Starts in: <span>20 : 20</span></h4>
                  </div>

                  <div className={styles.liveClassBtn}>
                    <p><Bell /></p>
                  </div>
                </> */}
          </div>
        </div>
      ))}

      {quizzes.map((e, index) => (
        <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
          <div>
            <div className={styles.title}>
              <div className={styles.icon}>
                <h3>{e.total_pages === 5 ? <Quiz /> : <Quiz />}</h3>
              </div>
              {/* <p class={activeIndexQuiz[index] ? styles.active : ""} onClick={handleClickIndexQuiz(index)}> */}
              <a href={e.url} target="_blank" rel="noopener noreferrer">
                {/* {e.title} */}
                Time for a quiz!
              </a>
              {/* </p> */}
            </div>

            {/* <div class={styles.actionBox + " " + (activeIndexQuiz[index] ? styles.actionBoxActive : "")}>
              <>
                <div className={styles.actionBoxContent}>
                  <div className={styles.actionBoxContentHeading}>
                    <h5>Engineering</h5>
                  </div>
                  <p>
                    Engineering Semper nisl magna amet eu hac dui netus. Libero condimentum aliquam eros, at arcu cursus
                    in est. Platea amet, mauris, egestas varius nisl, commodo sed suspendisse pretium. Join live class
                  </p>
                </div>

                <div className={styles.actionBoxBtn}>
                  <p>
                    <a href={e.url} target="_blank">
                      View Quiz
                    </a>
                  </p>
                </div>
              </>
            </div> */}
          </div>
        </div>
      ))}
      {projects?.length > 0 &&
        projects.map((e, index) => (
          <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
            <div>
              <div className={styles.title}>
                <div className={styles.icon}>
                  <h3>
                    <Quiz />
                  </h3>
                </div>
                <p class={activeProjectIndex[index] ? styles.active : ""} onClick={handleClickProjectIndex(index)}>
                  {/* {e.title} */}
                  Complete a project!
                </p>
              </div>

              <div class={styles.actionBox + " " + (activeProjectIndex[index] ? styles.actionBoxActive : "")}>
                <>
                  <div className={styles.actionBoxContent}>
                    <div className={styles.actionBoxContentHeading}>
                      <h5>Final Step : Hands on projects</h5>
                    </div>
                    <p>
                      Learning is more than just watching videos or scoring marks. Do a project to make sure you can
                      implement what you have learnt!
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
            </div>
          </div>
        ))}
    </>
  );
}

// e.thumbnails
