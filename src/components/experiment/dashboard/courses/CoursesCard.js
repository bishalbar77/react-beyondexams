import React from 'react';
import styles from "./CoursesCard.module.css";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import People from "../asset/people.svg";
import Time from "../asset/time.svg";
import Video from "../asset/video playlist.svg";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CoursesCard({ name, video, enroll, time, color, percentage}) {

//   const percentage = 66;

  return (
    <div className={styles.coursesCard}>
        <div className={styles.cardProgress}>
            <CircularProgressbar 
                value={percentage} 
                text={`${percentage}%`} 
                styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    // rotation: 0.25,
                
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    // strokeLinecap: 'butt',
                
                    // Text size
                    textSize: '16px',
                
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,
                
                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',
                
                    // Colors
                    // pathColor: "#FEBE16",
                    pathColor: `${color}`,
                    textColor: 'black',
                    trailColor: "#f1eeee",
                    backgroundColor: 'white',
                })}
            />
        </div>

        <div className={styles.cardContent}>
            <div className={styles.cardContentHeading}>
                <p>{name}</p>
                <ChevronRightIcon />
            </div>
            <div className={styles.cardContentDesc}>
                <img src={Video} alt="" />
                <p>{video}</p>
            </div>
            <div className={styles.cardContentDesc}>
                <img src={People} alt="" />
                <p>{enroll}</p>
            </div>
            <div className={styles.cardContentDesc}>
                <img src={Time} alt="" />
                <p>{time}</p>
            </div>
        </div>
    </div>
  )
}

export default CoursesCard;