import Tooltip from "@material-ui/core/Tooltip";
import cx from "classnames";
import { Steps } from "intro.js-react";
import React, { useEffect, useState } from "react";
// import Info from "../../../../../../assets/images/icons/alert-circle-colored.svg";
import styles from "./CourseInfo.module.css";
import { CreateCourseSteps } from "./TutorialSteps";

// import * as jsonData from "../newCourse.json";
var jsonData = require("../newCourse.json");

const CourseInfo = (props) => {
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nextClick, setNextClick] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("coc") === "true" && props.step === 1) {
      if (initial) {
        setTimeout(() => {
          setOpen(true);
          setInitial(false);
        }, 500);
      }
    }
  }, [props.step]);

  useEffect(() => {
    const title = props.course?.title ?? "";
    const description = props.course?.description ?? "";
    setTitle(title);
    setDescription(description);
  }, [props.course]);

  const validated = () => {
    if (title === "") setTitleError("Please provide a topic title 😊");
    else setTitleError("");
    if (description === "") setDescriptionError("Please write a description about your course 😊");
    else setDescriptionError("");
  };
  const onNext = () => {
    setNextClick(true);
    validated(title, description);
    if (title === "" || description === "") return;
    props.handleSetCourse("title", title);
    props.handleSetCourse("description", description);
    props.handleSetCourse("step", 2);
    // props.onNext();
  };
  const closeTour = () => {
    setOpen(false);
    if (nextClick && localStorage.getItem("coc") === "true") {
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
  };

  // useEffect(() => {
  //   validated();
  // }, [title, description]);

  return (
    <div
      className={cx(
        styles.container
        // props.step === 1 ? styles.slideIn : null,
        // props.step !== 1 ? styles.slideOut : null
      )}
    >
      <div className={styles.content}>
        <div className={styles.title}>{jsonData.heading.aboutCourse}</div>
        <div style={{ height: 10 }}></div>
        <div className={styles.inputContainer} data-tut="title">
          <label className={styles.label}>
            {jsonData.label.courseName}<span>*</span>
            <Tooltip title="Give your course a unique name users can relate to" arrow enterTouchDelay={1}>
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
            </Tooltip>
          </label>
          <input
            type="text"
            className={styles.textField}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value === "") {
                setTitleError("Please provide a topic title 😊");
              } else {
                if (titleError) setTitleError("");
              }
            }}
            placeholder="For eg: Content Writing, Public Speaking "
            maxLength="50"
          />
          {title.length > 0 && <p className={styles.word_limit}>{title.length}/50</p>}
          <div className="spacing-half"></div>
          {titleError !== "" && (
            <div className={styles.error}>
              <span>{titleError}</span>
            </div>
          )}
        </div>
        <div className={styles.inputContainer} data-tut="desc">
          <label className={styles.label}>
            {jsonData.label.courseDesc}<span>*</span>
            <Tooltip
              title="This is important! Most users don't open courses with empty description!"
              arrow
              enterTouchDelay={1}
            >
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
            </Tooltip>
          </label>
          <textarea
            type="text"
            className={cx(styles.textField, styles.textArea)}
            rows="4"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value === "") {
                setDescriptionError("Please write a description about your course 😊");
              } else {
                if (descriptionError) setDescriptionError("");
              }
            }}
            placeholder="For eg: At the end of this course, you'll be able to conceptualize, strategize and write content for blogs, social media easily."
          />
          {descriptionError !== "" && (
            <div className={styles.error}>
              <span>{descriptionError}</span>
            </div>
          )}
        </div>
        <div className={cx(styles.buttonContainer, styles.fit)} data-tut="next">
          <button
            className={styles.nextButton}
            onClick={onNext}
            style={title === "" || description === "" ? { backgroundColor: "#686868" } : null}
          >
            {jsonData.buttons.next}
          </button>
        </div>
        <div style={{ height: 100 }}></div>
      </div>
      <Steps
        enabled={open}
        steps={CreateCourseSteps}
        initialStep={0}
        onExit={closeTour}
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

export default CourseInfo;
