import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams, Switch, Route, useLocation } from "react-router-dom";
import baseDomain from "../../../common/baseDomain";
import styles from "./PlayList.module.css";
import CoursePlacement from "./CoursePlacement/CoursePlacement";
import CourseInfo from "./CourseInfo/CourseInfo";
import { Post, swalWithAuth } from "../../../common/common";
import store from "../../../../store";
import swal from "sweetalert";
import { setLocal } from "../../../common/localStorageAccess";

const AddNewCourse = (props) => {
  const history = new useHistory();
  const location = new useLocation();
  const params = new useParams();
  const [stepIndex, setStepIndex] = useState(1);
  const [course, setCourse] = useState(null);

  const handleSetCourse = (key, value) => {
    setCourse((prevCourse) => ({ ...prevCourse, [key]: value }));
  };

  useEffect(() => {
    let step = params.step ?? 1;
    setStepIndex(step);
  }, []);

  useEffect(() => {
    if (course) {
      routeHandle(course.step);
    }
  }, [course]);
  useEffect(() => {
    if (localStorage.getItem("role_id") === "1") {
      swal({
        title: "Please Login as a teacher",
        text: "Are you sure that you want to switch your role?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          Post(0, "verifyFirebaseAccessToken", {
            access_token: localStorage.getItem("uid"),
            role_id: 2,
            // request_url: window.location.href,
          }).then((res) => {
            store.dispatch({
              type: "SHOW_SUCCESS",
              message: "You are now logged in as a teacher",
            });
            let data = res.data.data;
            setLocal("access_token", data.access_token);
            setLocal("refresh_token", data.refresh_token);
            setLocal("role_id", 2);
            setLocal("name", data.name);
            window.location.reload();
          });
        }
      });
    } else if (localStorage.getItem("role_id") !== "2") {
      swalWithAuth("Please Login as a teacher", 2);
    }
  }, []);

  const routeHandle = (step) => {
    setStepIndex(step);
    history.push(`/dashboard/playlist/${step}`);
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}></div>
      <Switch>
        <Route exact path="/dashboard/playlist/1">
          <CourseInfo
            // onNext={() => routeHandle(2)}
            step={stepIndex}
            course={course}
            handleSetCourse={handleSetCourse}
          />
        </Route>
        <Route exact path="/dashboard/playlist/2">
          <CoursePlacement step={stepIndex} course={course} handleSetCourse={handleSetCourse} />
        </Route>
      </Switch>
      <a href="https://www.notion.so/beyondexams/How-to-create-a-course-60dc4c795e3a4dcfb9399f4a0a036d66"></a>
    </div>
  );
};

export default AddNewCourse;
