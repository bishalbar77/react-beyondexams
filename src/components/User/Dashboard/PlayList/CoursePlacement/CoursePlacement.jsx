import { Tooltip } from "@material-ui/core";
import axios from "axios";
import cx from "classnames";
import React, { useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import Info from "../../../../../assets/images/icons/alert-circle-colored.svg";
import Arrow from "../../../../../assets/images/icons/solid-bottom-arrow.svg";
import baseDomain from "../../../../common/baseDomain";
import { getLocal } from "../../../../common/localStorageAccess";
import AdvancedDrop from "./AdvancedDrop/AdvancedDrop";
import styles from "./CoursePlacement.module.css";

const CoursePlacement = (props) => {
  const params = new useParams();
  const location = new useLocation();
  const history = new useHistory();
  const inputRef = new React.createRef();
  const [value, setValue] = React.useState("");
  const [courseId, setCourseId] = React.useState();
  const [openSmallDrop, setOpenSmallDrop] = React.useState(false);
  const [selectedClassification, setSelectedClassification] = React.useState("topics");
  const [valueError, setValueError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState(true);

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
        setValue(value);
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
        setValue(value);
        setValueError("");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = async () => {
    if (value === "") {
      setValueError("Please select a course from our courses Super structure 😊");
    } else {
      let formData = new FormData();
      let url = new URL(props.course.url);
      let params = new URLSearchParams(url.search);
      let id = params.get("list");
      console.log(courseId);
      console.log(id);
      if (selectedClassification === "classes") {
        // formData.append("playlist_title", props.course?.title);
        formData.append("playlist_id", id);
        formData.append("parent_id", parseInt(courseId));
      } else {
        // formData.append("playlist_title", props.course?.title);
        formData.append("playlist_id", id);
        formData.append("topic_id", courseId);
      }
      await axios({
        url: `https://api.beyondexams.org/api/v1/add_course_from_playlist`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: formData,
      })
        .then((res) => {
          history.push(`/dashboard/course/${encodeURIComponent(res.data.data.slug)}`);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

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
          <div>I am creating a course for a </div>
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
              Topic
            </div>
            <div
              className={selectedClassification === "classes" ? styles.selected : null}
              onClick={() => {
                setValue("");
                setSelectedClassification("classes");
              }}
            >
              Class
            </div>
          </div>
        </div>
      </div>
      <div className={styles.fit}>
        <div className={styles.titleContainer}>
          <div>
            Place your playlist in our
            <br />
            courses Super structure
            <Tooltip
              title="Choose who is your target audience and which subject is your course related to."
              arrow
              enterTouchDelay={1}
            >
              <img src={Info} alt="" />
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
          <img src={Arrow} alt="" />
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
          Previous
        </button>
        <button
          className={styles.nextButton}
          onClick={handleSubmit}
          style={value === "" ? { backgroundColor: "#686868", borderColor: "#686868" } : null}
          data-tut="next2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CoursePlacement;
