import React, { useState, useEffect, useRef } from "react";
import styles from "./Cirtificate.module.css";
import baseDomain from "../../../../common/baseDomain";
import axios from "axios";
import RightArrow from "../../../../../assets/images/icons/right-arrow2.svg";
import { Rating } from "@material-ui/lab";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import { useHistory } from "react-router-dom";
import CirtificateImg from "../../../../../assets/images/images/cirtificate.svg";
import { exportComponentAsJPEG } from "react-component-export-image";

function Cirtificate(props) {
  const [course, setCourse] = useState(null);
  const history = useHistory();
  const cirtificate = useRef();

  const getCourseData = async () => {
    let url = `${baseDomain.route}${baseDomain.subRoute}/get_final_course_details?course_slug=${props.match.params.course_slug}`;
    await axios({
      url: url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        const data = response.data.data;
        if (data.course) {
          setCourse(data.course);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(async () => {
    if (!localStorage.getItem("access_token")) {
      history.push("/login");
    } else {
      await getCourseData();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <p>Achievements</p>
        <img src={RightArrow} alt="arrow_right" />
        <p>Course Certificate</p>
      </div>

      <h1 className={styles.heading}>{course?.title}</h1>

      <div className={styles.cirtificateBox}>
        <div className={styles.cirtificateLeft}>
          <div className={styles.cirtificateDetails}>
            <div className={styles.userImgBox}>
              <img src={localStorage.getItem("avatar")} alt="avatar" />
            </div>

            <div className={styles.moreDetails}>
              <p className={styles.title}>
                Completed by{" "}
                <strong>
                  {localStorage.getItem("first_name")} {localStorage.getItem("last_name")}
                </strong>
              </p>

              <p className={styles.info}>August 11, 2021</p>
              <p className={styles.info}>Grade Achieved : 92.23%</p>

              <p className={styles.description}>
                {localStorage.getItem("first_name")} {localStorage.getItem("last_name")}’s account is verified.
                BeyondExams certifies their sucessful completion of <strong> {course?.title}</strong>
              </p>
            </div>
          </div>

          <div className={styles.courseDetails}>
            <div className={styles.courseImg}>
              <img src={course?.image_url} alt="course_image" />
            </div>

            <div className={styles.courseInfo}>
              <h1>{course?.title}</h1>
              <Rating
                icon={<StarRoundedIcon fontSize="inherit" />}
                emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                readOnly
                value={course?.rating_sum / course?.rated_user}
              />
            </div>
          </div>

          <div className={styles.courseSkillsBox}>
            <h1>Skills you have gained through this course</h1>

            <div className={styles.courseSkills}>
              <div className={styles.courseSkill}>Web interactivty</div>
              <div className={styles.courseSkill}>Jquery</div>
              <div className={styles.courseSkill}>Data Manipulation</div>
              <div className={styles.courseSkill}>JavaScript</div>
              <div className={styles.courseSkill}>Animations</div>
            </div>
          </div>
        </div>
        <div className={styles.cirtificateRight}>
          <div className={styles.cirtificate} ref={cirtificate}>
            <img src={CirtificateImg} alt="cirtificate" />
            <h1 className={styles.userName}>
              {localStorage.getItem("first_name")} {localStorage.getItem("last_name")}
            </h1>
            <p className={styles.courseName}>{course?.title}</p>
          </div>

          <button onClick={() => exportComponentAsJPEG(cirtificate)} className={styles.downloadBtn}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cirtificate;
