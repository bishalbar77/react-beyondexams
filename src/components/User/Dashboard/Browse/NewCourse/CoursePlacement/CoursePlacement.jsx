import { Tooltip } from "@material-ui/core";
import axios from "axios";
import cx from "classnames";
import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Info from "../../../../../../assets/images/icons/alert-circle-colored.svg";
import Arrow from "../../../../../../assets/images/icons/solid-bottom-arrow.svg";
import baseDomain from "../../../../../common/baseDomain";
import { getLocal } from "../../../../../common/localStorageAccess";
import AdvancedDrop from "./AdvancedDrop/AdvancedDrop";
import styles from "./CoursePlacement.module.css";
import { Steps } from "intro.js-react";
import { CreateCourseSteps } from "./TutorialSteps";

// import * as jsonData from "../newCourse.json";
var jsonData = require("../newCourse.json");

const CoursePlacement = (props) => {
  const params = new useParams();
  const location = new useLocation();
  const inputRef = new React.createRef();
  const [value, setValue] = React.useState("");
  const [courseId, setCourseId] = React.useState();
  const [openSmallDrop, setOpenSmallDrop] = React.useState(false);
  const [selectedClassification, setSelectedClassification] = React.useState("topics");
  const [valueError, setValueError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState(true);
  const [nextClick, setNextClick] = React.useState(false);

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
        setValue(value);
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
        setValue(value);
        setValueError("");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleNext = () => {
    if (value === "") {
      setValueError("Please select a course from our courses Super structure 😊");
    } else {
      setNextClick(true);
      props.handleSetCourse("id", courseId);
      props.handleSetCourse("courseType", selectedClassification);
      props.handleSetCourse("step", 3);
      // props.onNext();
    }
  };

  useEffect(() => {
    let level = params.level;
    let parentId = params.parent;
    let type = params.type;

    const id = props.course?.id;
    const courseType = props.course?.courseType ?? type;
    console.log(courseType);
    setSelectedClassification(courseType);
    if (id) {
      if (courseType === "classes") getBreadCrumbs(id);
      else getTopicBreadCrumbs(id);
    } else if (level > 2) {
      if (courseType === "classes") getBreadCrumbs(parentId);
      else getTopicBreadCrumbs(parentId);
    }
  }, [props.course]);
  const closeTour = () => {
    setOpen(false);
    if (nextClick && localStorage.getItem("coc") === "true") {
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("coc") === "true" && props.step === 2) {
      if (initial) {
        setTimeout(() => {
          setOpen(true);
          setInitial(false);
        }, 500);
      }
    }
  }, [props.step]);

  return (
    <div
      className={cx(
        styles.container
        // props.step !== 2 ? styles.slideOut : null,
        // props.step === 2 ? styles.slideIn : null
      )}
    >
      <div className={styles.fit}>
        <div className={styles.titleContainer}>
          <div>{jsonData.heading.create} </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <div className={styles.CourseClassification} data-tut="classification">
            <div
              className={selectedClassification === "topics" ? styles.selected : null}
              onClick={() => {
                setValue("");
                setSelectedClassification("topics");
              }}
            >
              {jsonData.buttons.topic}
            </div>
            <div
              className={selectedClassification === "classes" ? styles.selected : null}
              onClick={() => {
                setValue("");
                setSelectedClassification("classes");
              }}
            >
              {jsonData.buttons.class}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.fit}>
        <div className={styles.titleContainer}>
          <div>
            {jsonData.heading.placeCourse}
            <br />
            {jsonData.heading.courseStr}
            <Tooltip
              title="Choose who is your target audience and which subject is your course related to."
              arrow
              enterTouchDelay={1}
            >
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
            </Tooltip>
          </div>
        </div>
        <div
          data-tut="super"
          className={styles.textField}
          ref={inputRef}
          onClick={() => {
            setOpen(false);

            setOpenSmallDrop(true);
          }}
        >
          <div>{value}</div>
          <img src={require(`../../../../../../assets/images/icons/${jsonData.images.arrow}`)} alt="" />
        </div>
        {valueError !== "" && (
          <div className={styles.error}>
            <span>{valueError}</span>
          </div>
        )}
        <AdvancedDrop
          inputRef={inputRef}
          handleItemClick={(e) => {
            if (selectedClassification === "topics") getTopicBreadCrumbs(e.id);
            else getBreadCrumbs(e.id);
          }}
          isSmall={openSmallDrop}
          onSmallCLose={() => setOpenSmallDrop(false)}
          classification={selectedClassification}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.previousButton}
          onClick={() => {
            props.handleSetCourse("id", courseId);
            props.handleSetCourse("courseType", selectedClassification);
            // props.onPrevious();
            props.handleSetCourse("step", 1);
          }}
        >
          {jsonData.buttons.previous}
        </button>
        <button
          className={styles.nextButton}
          onClick={handleNext}
          style={value === "" ? { backgroundColor: "#686868", borderColor: "#686868" } : null}
          data-tut="next2"
        >
          {jsonData.buttons.next}
        </button>
      </div>
      <div style={{ marginTop: 70 }}></div>
      {props.step === 2 && (
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
      )}
    </div>
  );
};

export default CoursePlacement;
