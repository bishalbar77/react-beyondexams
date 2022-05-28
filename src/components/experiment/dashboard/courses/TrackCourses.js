import React, { useEffect, useState } from 'react';
import "./TrackCourses.css";
import { Tabs, Tab } from "@material-ui/core";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CoursesCard from './CoursesCard';
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function TrackCourses() {

  const [tabIndex, setTabIndex] = useState(0);

  const [courseInProgress, setCourseInProgress] = useState([]);
  const [courseCompleted, setCourseCompleted] = useState([]);

  const userSlug = localStorage.getItem("slug");

    useEffect(() => {
        axios
        .get(`${baseDomain.route}${baseDomain.subRoute}/get_user_learning_courses`, {params: {slug: userSlug}})
        .then((res) => {
            console.log(res.data.data)
            setCourseInProgress(res.data.data.in_progress)
            setCourseCompleted(res.data.data.course_completed)
        })
        .catch((e) => {
            console.log(e);
            // swal("Error", e.response.data.message, "error");
        });
    }, []);

  return (
    <div className="trackCourses">
        <div className="trackCoursesCard">
            <Tabs
                value={tabIndex}
                onChange={(e, val) => setTabIndex(val)}
                className="cardTabs"
                // centered
                scrollButtons="off"
                >
                    <Tab label="In Progress" />
                    <Tab label="Completed" />
            </Tabs>

            {tabIndex === 0 ? (
                <>
                    {courseInProgress.map && courseInProgress.map((course, id) => {
                        return (
                            <div key={id}>
                                <CoursesCard 
                                    name={course.category.title}
                                    video={`${course.category.video_count} Videos`}
                                    time="70 Min."
                                    enroll="99 Students enrolled"
                                    color="#FEBE16"
                                    percentage={course.progress}
                                />
                                <hr style={{ color: "#e0e0e088" }}/>
                            </div>
                        )
                    })}
                </>
            ) : undefined}

            {tabIndex === 1 ? (
                <>
                    {courseCompleted.map && courseCompleted.map((course, id) => {
                        return (
                            <div key={id}>
                                <CoursesCard 
                                    name={course.category.title}
                                    video={`${course.category.video_count} Videos`}
                                    time="70 Min."
                                    enroll="99 Students enrolled"
                                    color="#FEBE16"
                                    percentage={course.progress}
                                />
                                <hr style={{ color: "#e0e0e088" }}/>
                            </div>
                        )
                    })}
                </>
            ) : undefined}

            <div className="startCourseBtn">
                <AddOutlinedIcon fontSize="large" className="addBtn"/>
                <p>Start a new course</p>
            </div>
        </div>
    </div>
  )
}

export default TrackCourses;


{/* <CoursesCard 
    name="Microbiology"
    video="24 Videos"
    time="70 Min."
    enroll="99 Students enrolled"
    color="#FEBE16"
    percentage={66}
/>
<hr style={{ color: "#e0e0e088" }}/>
<CoursesCard 
    name="Zoology"
    video="24 Videos"
    time="70 Min."
    enroll="99 Students enrolled"
    color="#FEBE16"
    percentage={70}
/> */}