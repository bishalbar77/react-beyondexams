import React, { Component } from "react";
import styles from "./TopBar.module.css";
import Share from "../../Videos/Share";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

export default class TopBar extends Component {
  state = { showBar: false };
  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
  }
  listenScrollEvent = (e) => {
    let v = window.scrollY + document.querySelector("#bar_ref").getBoundingClientRect().top - 170;
    if (window.scrollY > v) {
      if (!this.state.showBar) this.setState({ showBar: true });
    } else {
      if (this.state.showBar) this.setState({ showBar: false });
    }
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenScrollEvent);
  }
  render() {
    const {
      course,
      handleNotificationClick,
      handleNotificationOffClick,
      handleUnEndorse,
      handleEndorse,
      handleUnEnroll,
      handleEnroll,
    } = this.props;
    return (
      <div className={styles.root + " " + (this.state.showBar ? styles.show_bar : "")} id="bar">
        <div className={styles.left}>
          <div className="courseIconBG">
            <img className="courseIcon" src={this.props.course.image_url} alt="course" />
          </div>
          <p>{course.title}</p>
        </div>
        <div className={styles.right}>
          {localStorage.getItem("access_token") &&
            (course.user_actions[0]?.pivot?.notification === 0 ? (
              <button className="notificationBtn" onClick={handleNotificationClick}>
                <NotificationsOffIcon />
              </button>
            ) : (
              <button className="NotificationsActiveBtn" onClick={handleNotificationOffClick}>
                <NotificationsActiveIcon fontSize="inherit" />
              </button>
            ))}
          <Share
            share={window.location.href}
            title={course.title
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, "'")}
          >
            <button className="watchBtn">Share</button>
          </Share>
          {localStorage.getItem("role_id") === "2" ? (
            course.user_actions[0]?.pivot?.has_endorsed ? (
              <button onClick={handleUnEndorse} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
                Endorsed
              </button>
            ) : (
              <button onClick={handleEndorse} className="enrollBtn">
                Endorse
              </button>
            )
          ) : course.user_actions[0]?.pivot?.is_enrolled === 1 ? (
            <button onClick={handleUnEnroll} className="enrollBtn" style={{ backgroundColor: "#77AF44" }}>
              Enrolled
            </button>
          ) : (
            <button onClick={handleEnroll} className="enrollBtn">
              Enroll
            </button>
          )}
        </div>
      </div>
    );
  }
}
