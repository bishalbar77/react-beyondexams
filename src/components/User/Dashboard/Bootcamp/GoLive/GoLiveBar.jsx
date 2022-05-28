import React, { useState, useEffect } from "react";
import styles from "./GoLiveBar.module.css";
import IconButton from "@material-ui/core/IconButton";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import moment from "moment";
import { Post, swalWithAuth } from "../../../../common/common";
import swal from "sweetalert";

export default function GoLiveBar({ course }) {
  const [open, setOpen] = useState(true);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval;
    if (course.live_sessions.length > 0) {
      let date = moment(course.live_sessions[0].date, "DD/MM/YYYY").valueOf();
      let startTime = course.live_sessions[0].start_time.split(":");
      let parsedDate = date + parseInt(startTime[0]) * 60 * 60 * 1000 + parseInt(startTime[1]) * 60 * 1000;

      interval = setInterval(() => {
        let today = moment().valueOf();
        let diff = (parsedDate - today) / 1000;
        if (diff >= 0) {
          setTime(convertHMS(diff));
        }
      }, 1000);
    }
    function convertHMS(value) {
      const sec = parseInt(value, 10); // convert value to number if it's string
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return { hours, minutes, seconds };
    }
    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleJoinNow = async () => {
    window.open(course.live_sessions[0].meet_link, "_blank").focus();
  };
  const handleRegisterNow = () => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swalWithAuth("Please Sign-in to continue", 1);
    } else {
      Post(1, "register_live_session_user", {
        live_session_id: course.live_sessions[0].id,
      }).then(() => {
        swal("Registered Successfully", "You will be notified via mail when the session is about to begin", "success");
      });
    }
  };

  return (
    course.live_sessions.length > 0 &&
    open && (
      <div className={styles.root}>
        {parseInt(time.hours) === 0 && parseInt(time.minutes) === 0 && parseInt(time.seconds) === 0 ? (
          <p>Course Instructor is Live Now</p>
        ) : (
          <p>Course Instructor Going Live In</p>
        )}
        {parseInt(time.hours) === 0 && parseInt(time.minutes) === 0 && parseInt(time.seconds) === 0 ? (
          <></>
        ) : (
          <div className={styles.time}>
            <p>
              {time.hours}
              <span>Hours</span>
            </p>
            <p>
              {time.minutes}
              <span>Minutes</span>
            </p>
            <p>
              {time.seconds}
              <span>Seconds</span>
            </p>
          </div>
        )}
        {parseInt(time.hours) === 0 && parseInt(time.minutes) === 0 && parseInt(time.seconds) <= 60 ? (
          <button className="enrollBtn" onClick={handleJoinNow}>
            Join
          </button>
        ) : course.live_sessions[0].live_session_users.length > 0 ? (
          <button className="enrollBtn" style={{ backgroundColor: "#77AF44", cursor: "unset" }}>
            Registered
          </button>
        ) : (
          <button className="enrollBtn" onClick={handleRegisterNow}>
            Register Now
          </button>
        )}
        <div className={styles.close} onClick={() => setOpen(false)}>
          <IconButton>
            <CloseRoundedIcon />
          </IconButton>
        </div>
      </div>
    )
  );
}
