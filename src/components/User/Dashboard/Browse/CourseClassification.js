import React from "react";
import { useHistory } from "react-router-dom";

var jsonData = require("./browse.json");

const CourseClassification = (props) => {
  const history = new useHistory();
  return (
    props.parent == 0 && (
      <div className="course-explore-main-container">
        <div
          className="course-explore-container"
          // style={{ backgroundColor: "#e6e6e6" }}
        >
          <div
            className={`explore-button ${props.classification === "topics" ? "selected-explore" : ""}`}
            // style={{ color: "#a6a6a6" }}
            onClick={() => {
              props.setClassification("topics");
              history.push(`/explore-by-topics`);
            }}
          >
            {jsonData.buttons.exploreByTopics}
          </div>
          <div
            className={`explore-button ${props.classification === "classes" ? "selected-explore" : ""}`}
            onClick={() => {
              props.setClassification("classes");
              history.push(`/explore-by-classes`);
            }}
          >
            {jsonData.buttons.exploreByClass}
          </div>
        </div>
        {!props.isStudent && props.isCreatedByMe !== false && (
          <div
            className="self-course"
            onClick={() => {
              props.onViewToggle();
              history.push(`/dashboard/browse?level=1&parent=0&type=${props.classification}`);
              // if (props.isCourseByMe)
              //   history.push(
              //     `/dashboard/browse?level=${props.level}&parent=${props.parent}`
              //   );
              // else
              // history.push(`/dashboard/browse?level=${props.level}&parent=0`);
            }}
          >
            {!props.isCourseByMe ? `${jsonData.buttons.createdByMe}` : `${jsonData.buttons.exploreAllCourses}`}
          </div>
        )}
      </div>
    )
  );
};

export default CourseClassification;
