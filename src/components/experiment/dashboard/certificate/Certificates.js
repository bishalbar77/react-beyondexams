import React, { useEffect, useState } from 'react';
import styles from "./Certificates.module.css";
import CertificateIcon from "../asset/certificatePurple.svg";
import Certificate from "../asset/certificate.svg";
import Calendar from "../asset/calendar.svg";
import Facebook from "../asset/facebook.svg";
import Twitter from "../asset/twitter.svg";
import LinkedIn from "../asset/linkedIn.svg";
import Whatsapp from "../asset/whatsApp.svg";
import LinkIcon from "../asset/link.svg";
import ShareIcon from '@material-ui/icons/Share';
import CertificateScreenIcon from "../asset/activityScreenIcon.svg";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CourseCard from "../../../User/Dashboard/Browse/CourseCard";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function Certificates() {

  const [certificate, setCertificate] = useState([]);
  const [bestCourses, setBestCourses] = useState([]);

  const userSlug = localStorage.getItem("slug");

  useEffect(() => {
    axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_user_certificates`, {params: {slug: userSlug}})
    .then((res) => {
        console.log(res.data.data)
        setCertificate(res.data.data);
    })
    .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
    });
  }, []);

  useEffect(() => {
    axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_best_courses`)
    .then((res) => {
        console.log(res.data.data)
        // setCertificate(res.data.data);
    })
    .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
    });
  }, []);

  return (
    <div className={styles.certificates}>
      {!certificate.length === 0 ? (
        <>
          <div className={styles.certificatesHeading}>
              <img src={CertificateIcon} alt="icon" />
              <p>My Certificates</p>
          </div>

          <div className={styles.certificateImage}>
            <img src={Certificate} alt="" />
          </div>

          <div className={styles.certifiedCourse}>
            <div className={styles.courseHeading}>
              <h3>UI/UX Design for beginner</h3>
              <p><img src={Calendar} alt="" /> 16 Jan 2022</p>
            </div>

            <div className={styles.courseAchieve}>
              <p>Share your achievements with your contacts</p>
              <ShareIcon style={{ color: "#6646E7", cursor: "pointer" }} />
            </div>

            <div className={styles.socialShare}>
              <img src={LinkedIn} alt="" />
              <img src={Twitter} alt="" />
              <img src={Facebook} alt="" />
              <img src={Whatsapp} alt="" />
              <img src={LinkIcon} alt="" />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.activityImage}>
            <h5>Complete a Course to earn a BE <br />Certificate!</h5>
            <img src={CertificateScreenIcon} alt="" />
            <p>Start learning today to Earn BE certificates <br />and share with your contacts</p>
            <div className="activityBtn">
                <AddOutlinedIcon fontSize="large" className="addBtn"/>
                <p>Start a new course</p>
            </div>
        </div> 
      )}


        <hr style={{ color: "#E0E0E0", border: "1px solid #E0E0E0" }}/>

        <div className={styles.relatedCourses}>
          <h3>Start Learning Today and Level-up Your Knowledge</h3>
          <div className={styles.viewCourses}>
            <h4>{certificate.length === 0 ? "Popular Courses" : "Related Courses"}</h4>
            <p>View All</p>
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
          </div>
        </div>

    </div>
  )
}

export default Certificates;