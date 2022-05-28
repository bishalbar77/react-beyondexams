import React, { useEffect, useState } from 'react';
import styles from "./Courses.module.css";
import CourseCard from "../../../User/Dashboard/Browse/CourseCard";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CoursesIcon from "../asset/coursesPurple.svg";
import TrackCourses from "./TrackCourses";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Trophy from "../asset/trophy.png";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function Courses() {

    const [courseInProgress, setCourseInProgress] = useState([]);
    const userSlug = localStorage.getItem("slug");

    useEffect(() => {
        axios
        .get(`${baseDomain.route}${baseDomain.subRoute}/get_user_learning_courses`, {params: {slug: userSlug}})
        .then((res) => {
            console.log(res.data.data.in_progress);
            setCourseInProgress(res.data.data.in_progress);
        })
        .catch((e) => {
            console.log(e);
            // swal("Error", e.response.data.message, "error");
        });
    }, [])

  return (
    <div className={styles.courses}>
        {courseInProgress.length > 0 ? (
            <>
                <div className={styles.coursesHeading}>
                    <div className={styles.myCourses}>
                        <img src={CoursesIcon} alt="icon" />
                        <p>My Courses</p>
                    </div>
                    <div className={styles.newCourse}>
                        <p>New Course</p>
                        <AddOutlinedIcon fontSize="small" style={{ backgroundColor: "#6646E7", color: "white", borderRadius: "100px" }} />
                    </div>
                </div>

                <TrackCourses />

                <div className={styles.coursesSuccess}>
                    <img src={Trophy} alt="" />
                    <p>Success! Take a look at your certificates</p>
                    <ChevronRightIcon style={{ color: '#6646e7' }} />
                </div>
            </>
        ) : (
            <>
                <div className={styles.coursesLearning}>
                    <h3>Hey! <span>{localStorage.getItem("name")}</span></h3>
                    <p>Start Learning Today</p>
                </div>

                <div className={styles.coursesCatagory}>
                    <h4>Categories</h4>
                    <div className={styles.category}>
                        <p>Computer Science</p>
                        <p>Math & Logic</p>
                        <p>Data Science</p>
                    </div>
                    <div className={styles.courseCard}>
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                        <CourseCard
                            course="Course Name"
                            key={1}
                            type="Course"
                            openProfile={true}
                            redirect={true}
                            isActive={true}
                        />
                    </div>
                </div>

            </>
        )}


    </div>
  )
}

export default Courses;