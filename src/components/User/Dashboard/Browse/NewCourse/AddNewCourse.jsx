import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams, Switch, Route, useLocation } from "react-router-dom";
// import Info from "../../../../../assets/images/icons/alert-circle.svg";
import baseDomain from "../../../../common/baseDomain";
import AboutCourse from "./AboutCourse/AboutCourse";
import styles from "./AddNewCourse.module.css";
import CourseContent from "./CourseContent/CourseContent";
import CourseInfo from "./CourseInfo/CourseInfo";
import CoursePlacement from "./CoursePlacement/CoursePlacement";
import Stepper from "./Stepper/Stepper";

import { ADD_COURSE_KEYS } from "../../Course/globalData";

// import * as jsonData from "./newCourse.json";
var jsonData = require("./newCourse.json");

const AddNewCourse = (props) =>
{
  const history = new useHistory();
  const location = new useLocation();
  const params = new useParams();
  const [stepIndex, setStepIndex] = useState(1);
  const [course, setCourse] = useState(null);

  const handleSearchQuery = () =>
  {
    const query = new URLSearchParams(location.search);
    query.forEach((value, key) =>
    {
      if (key === "keywords" && typeof value == "string")
      {
        value = value.split(",");
        handleSetCourse(key, value);
      } else
        handleSetCourse(key, value);
    });
  };

  useEffect(() =>
  {
    handleSearchQuery();
  }, []);

  const handleSetCourse = (key, value) =>
  {
    setCourse((prevCourse) => ({ ...prevCourse, [key]: value }));
  };

  const deleteCourse = async () =>
  {
    await axios({
      url: `${ baseDomain.route }${ baseDomain.subRoute }/${jsonData.api.removeCatagory}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${ localStorage.getItem("access_token") }`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: course.courseId,
      },
    })
      .then(() =>
      {
        // swal("Course Removed", "course is removed successfully", "success");
        // history.push("/dashboard");
      })
      .catch((e) =>
      {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };
  useEffect(() =>
  {
    let step = params.step ?? 1;
    setStepIndex(step);
    return () =>
    {
      localStorage.setItem("coc", false);
    };
  }, []);

  const createQuery = () =>
  {
    let query = "?";
    for (var key in course)
    {
      if (course.hasOwnProperty(key))
      {
        query += `${ key }=${ encodeURIComponent(course[key]) }&`;
      }
    }
    return query.slice(0, -1);
  };
  useEffect(() =>
  {
    if (course)
    {
      routeHandle(course.step)
    }
  }, [course]);

  const routeHandle = (step) =>
  {
    setStepIndex(step);
    history.push(`/add-new-course/${ params.parent }/${ params.level }/${ params.type }/${ step }${ createQuery() }`);
  };

  return (
    <div>
      {/* <div className={styles.headerContainer}>
        <Link to="/">
          <div className={styles.mainLogo}></div>
        </Link>
        <div className={styles.headerTitle}>Create a course</div>
        <div className={styles.headerUser}>
          <div style={{ backgroundImage: `url(${avatar})` }}></div>
        </div>
      </div> */}
      <div className={styles.content}>
        <Stepper
          crossTo={`/dashboard/browse?level=${ params.level }&parent=${ params.parent }&type=${ params.type }`}
          step={stepIndex}
          deleteCourse={deleteCourse}
          courseId={course?.courseId}
        />
      </div>
      <Switch>
        <Route exact path="/add-new-course/:parent/:level/:type/1">
          <CourseInfo
            // onNext={() => routeHandle(2)}
            step={stepIndex}
            course={course}
            handleSetCourse={handleSetCourse}
          />
        </Route>
        <Route exact path="/add-new-course/:parent/:level/:type/2">
          <CoursePlacement
            // onNext={() => routeHandle(3)}
            step={stepIndex}
            // onPrevious={() => routeHandle(1)}
            course={course}
            handleSetCourse={handleSetCourse}
          />
        </Route>
        <Route exact path="/add-new-course/:parent/:level/:type/3">
          <AboutCourse
            step={stepIndex}
            // onNext={() => routeHandle(4)}
            // onPrevious={() => routeHandle(2)}
            course={course}
            handleSetCourse={handleSetCourse}
          />
        </Route>
        <Route exact path="/add-new-course/:parent/:level/:type/4">
          <CourseContent
            // onPrevious={() => routeHandle(3)}
            // onNext={() =>
            //   history.push(`/dashboard/browse?level=${params.level}&parent=${params.parent}&type=${params.type}`)
            // }
            step={stepIndex}
            course={course}
            handleSetCourse={handleSetCourse}
          />
        </Route>
      </Switch>
      <div className={styles.bottomBar}>
        <a className={styles.bottomInfo} href="https://www.notion.so/beyondexams/How-to-create-a-course-60dc4c795e3a4dcfb9399f4a0a036d66">
          <img src={require(`../../../../../assets/images/icons/${jsonData.images.info2}`)} alt="" />
          <div>{jsonData.footer.info}</div>
        </a>

        <div className="key-info">
          <p style={{ textAlign: "center", fontSize: 12 }}>{jsonData.footer.earn} {ADD_COURSE_KEYS} {jsonData.footer.keys}</p>
        </div>
      </div>
    </div>
  );
};

export default AddNewCourse;
