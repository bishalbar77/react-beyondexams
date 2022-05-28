import Tooltip from "@material-ui/core/Tooltip";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import Info from "../../../../../assets/images/icons/alert-circle-colored.svg";
import styles from "./CourseInfo.module.css";
import { swalWithAuth } from "../../../../common/common";

const CourseInfo = (props) => {
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("");

  const validated = () => {
    if (title === "") setTitleError("Please provide a playlist title 😊");
    else setTitleError("");
    if (description === "") setDescriptionError("Please enter youtube playlist url 😊 😊");
    else setDescriptionError("");
  };
  const onNext = () => {
    if (localStorage.getItem("role_id") !== "2") {
      swalWithAuth("Please Login as a teacher", 2);
    } else {
      validated(title, description);
      if (title === "" || description === "") return;
      props.handleSetCourse("title", title);
      props.handleSetCourse("url", description);
      props.handleSetCourse("step", 2);
    }
  };

  return (
    <div className={cx(styles.container)}>
      <div className={styles.content}>
        <div className={styles.title}>Tell us about the playlist you are creating.</div>
        <div style={{ height: 10 }}></div>
        <div className={styles.inputContainer} data-tut="title">
          {/* <label className={styles.label}>
            Name of the Playlist<span>*</span>
            <Tooltip
              title="Give your playlist a unique name users can relate to"
              arrow
              enterTouchDelay={1}
            >
              <img src={Info} alt="" />
            </Tooltip>
          </label>
          <input
            type="text"
            className={styles.textField}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value === "") {
                setTitleError("Please provide a playlist title 😊");
              } else {
                if (titleError) setTitleError("");
              }
            }}
            placeholder="For eg: Content Writing, Public Speaking "
          /> */}
          <div style={{ marginTop: 5 }}></div>
          {titleError !== "" && (
            <div className={styles.error}>
              <span>{titleError}</span>
            </div>
          )}
        </div>
        <div className={styles.inputContainer} data-tut="desc">
          <label className={styles.label}>
            Youtube Playlist Url<span>*</span>
            <Tooltip title="Please enter youtube playlist url 😊" arrow enterTouchDelay={1}>
              <img src={Info} alt="" />
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
                setDescriptionError("Please enter youtube playlist url 😊");
              } else {
                if (descriptionError) setDescriptionError("");
              }
            }}
            maxLength="250"
            placeholder="For eg: https://www.youtube.com/watch?v=dyu3LmA4yJY&list=RDMMdyu3LmA4yJY&start_radio=1"
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
            Next
          </button>
        </div>
        <div style={{ height: 100 }}></div>
      </div>
    </div>
  );
};

export default CourseInfo;
