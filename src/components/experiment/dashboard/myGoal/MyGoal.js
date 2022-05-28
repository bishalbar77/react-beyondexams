import React, { useEffect } from 'react';
import { useState } from "react";
import InviteCard from '../invite/InviteCard';
import styles from "./MyGoal.module.css";
import GoalIcon from "../asset/goalPurple.svg";
import Frame from "../asset/Frame.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ActivityScreenIcon from "../asset/activityScreenIcon.svg";
import Checked from "../asset/checkGreen.svg";
import UnChecked from "../asset/checkGray.svg";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StepsCard from "./StepsCard";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";


function MyGoal() {

  const [imageIndex, setImageIndex] = useState(0);
  const [details, setDetails] = useState([]);
  const [goal, setGoal] = useState(false);
  const [goalSelect, setGoalSelect] = useState(false);

  const percentage = 70;

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: 0,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  useEffect(() => {
    axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_top_level_courses`)
    .then((res) => {
        console.log(res.data.data);
        setDetails(res.data.data);
    })
    .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
    });
  }, [])

  const goalSelected = () => {
    setGoalSelect(true);
  }

  return (
    <div className={styles.goal}>
      {!goal ? (
          <>
            <div className={styles.goalImage}>
              <img src={ActivityScreenIcon} alt="" />
              <p>Start learning and track your learning activity</p>
              <div className={styles.goalBtn} onClick={() => setGoal(true)}>
                  <AddOutlinedIcon fontSize="large" className={styles.addBtn}/>
                  <p>Set your new goal </p>
              </div>
            </div>
          </>
      ) : (
        <>
          {!goalSelect ? (
            <>
              <div className={styles.goalHeading}>
                <img src={GoalIcon} alt="icon" />
                <p>My Goal</p>
              </div>

              <div className={styles.goalSelect}>
                <h3>Hey! <span>{localStorage.getItem("name")}</span></h3>
                <p>What you aspire to be...</p>
                <h4>Please select...</h4>
              </div>

              <div className={styles.goalCatagories}>
                <p>All</p>
                <p>Art</p>
                <p>Marketing</p>
                <p>Technical</p>
                <p>Non-Technical</p>
              </div>
              
              <div className={styles.trendBtn}>
                <button>Trending</button>
              </div>

              <div className={styles.slider}>
                <Slider {...settings}>
                  {details.map((detail) => (
                    <div className={detail.id === (imageIndex+1) ? `${styles.slide} ${styles.activeSlide}` : `${styles.slide}`}>
                      <img src={detail.image_url} alt="" />
                      <p onClick={goalSelected}>{detail.title}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          ) : (
            <>
              <div className={styles.goalHeading}>
                <img src={GoalIcon} alt="icon" />
                <p>My Goal</p>
              </div>

              <div className={styles.slider}>
                <Slider {...settings}>
                  {details.map((detail) => (
                    <div className={detail.id === (imageIndex+1) ? `${styles.slide} ${styles.activeSlide}` : `${styles.slide}`}>
                      <img src={detail.image_url} alt="" />
                      <p onClick={() => setGoalSelect(true)}>{detail.title}</p>
                    </div>
                  ))}
                </Slider>
              </div>

              <div className={styles.exploreBtn}>
                <button>Explore</button>
              </div>

              <div className={styles.goalSelected}>
                <StepsCard />
                <div className={styles.goalSteps}>
                  <div className={styles.goalProgress}>
                    <CircularProgressbar 
                        value={percentage} 
                        text={`${percentage}%`} 
                        styles={buildStyles({
                            textSize: '16px',
                            pathTransitionDuration: 0.5,
                            pathColor: "#FEBE16",
                            textColor: '#FEBE16',
                            trailColor: "#f1eeee",
                            backgroundColor: 'white',
                        })}
                      />

                      <button>Start</button>
                  </div>

                  <div className={styles.goalAchieved}>
                      <div className={styles.enrolled}>
                        <img src={Checked} alt="" />
                        <div className={styles.enrolledCourse}>
                          <h4>Enrolled for UX UI Designing</h4>
                          <p>Course Link: <span>eresult?search_query=laptop=</span></p>
                        </div>
                      </div>

                      <div className={styles.watchedVideo}>
                        <img src={Checked} alt="" />
                        <p>Watched One Video</p>
                      </div>

                      <div className={styles.sharedNotes}>
                        <img src={UnChecked} alt="" />
                        <p>Create & Share Notes</p>
                      </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <InviteCard />
    </div>
  )
}

export default MyGoal;