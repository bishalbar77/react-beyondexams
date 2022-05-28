import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListUnit from "./ListUnit";
import Matomo from "../common/Matomo";
import { Get } from "../common/common";
import { getLocal } from "../common/localStorageAccess";
import axios from "axios";
import "./Leaderboard.css";

function Leaderboard({ type }) {
  const [userData, setUserData] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    async function fetchTeacherData() {
      const data = await Get(true, "get_leaderboard_educators");
      console.log(data.data);
      setUserData(data.data.data.leaderboard.data);

      setNextPage(data.data.data.leaderboard.next_page_url);
      if (data.data.data.leaderboard.current_page === data.data.data.leaderboard.last_page) setIsLast(true);
    }

    async function fetchStudentData() {
      const data = await Get(true, "get_leaderboard_students");
      console.log(data.data.data.data);
      setUserData(data.data.data.data);
      setNextPage(data.data.data.next_page_url);
      if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
    }

    if (type === "teacher") fetchTeacherData();

    if (type === "student") fetchStudentData();
  }, []);

  async function handleFetchMore() {
    axios({
      url: nextPage,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((data) => {
        console.log(data);
        if (type === "teacher") {
          var newUserData = userData;
          data.data.data.leaderboard.data.forEach((data) => newUserData.push(data));
          setUserData(newUserData);
          setNextPage(data.data.data.leaderboard.next_page_url);
          if (data.data.data.leaderboard.current_page === data.data.data.leaderboard.last_page) setIsLast(true);
        } else {
          var newUserData = userData;
          data.data.data.data.forEach((data) => newUserData.push(data));
          setUserData(newUserData);
          setNextPage(data.data.data.next_page_url);
          if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Matomo pageTitle={type === "teacher" ? "Teacher-Leaderboard" : "Student-Leaderboard"}>
      <main className="Leaderboard-main">
        <div className="l-wrapper">
          <div className="c-header">
            {/* <img
            className="c-logo"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/813538/km-logo-color.svg"
            draggable="false"
            alt="logo"
          />
          <button className="c-button c-button--primary">Educator LeaderBoard</button> */}
            <h1 className="c-title">{type === "teacher" ? "Our Course Creators" : "Our Students"}</h1>
          </div>
          <div className="l-grid">
            {/* <div className="l-grid__item l-grid__item--sticky">
            <div className="c-card u-bg--light-gradient u-text--dark">
              <div className="c-card__body">
                <div className="u-display--flex u-justify--space-between">
                  <div className="u-text--left">
                    <div className="u-text--small">My Rank</div>
                    <h2>--- Place</h2>
                  </div>
                  <div className="u-text--left">
                    <div className="u-text--small">My Score</div>
                    <h2>---</h2>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
            <div className="l-grid__item">
              <div className="c-card">
                {/* <div className="c-card__header">
                <h3>Received Kudos</h3>
                <select className="c-select">
                  <option selected="selected">
                    Sunday, Feb. 23 - Sunday, Feb. 30
                  </option>
                </select>
              </div> */}
                <div className="c-card__body">
                  <ul className="c-list" id="list">
                    <li className="c-list__item">
                      <div className="c-list__grid">
                        <div className="u-text--left u-text--small u-text--medium">Rank</div>
                        <div className="u-text--left u-text--small u-text--medium">{type === "teacher" ? "Educator" : "Student"}</div>
                        <div className="u-text--left u-text--small u-text--medium">Last Active</div>
                        <div className="u-text--left u-text--small u-text--medium">{type === "teacher" ? "Avg Rating" : "# Courses Enrolled"}</div>
                        <div className="u-text--left u-text--small u-text--medium">{type === "teacher" ? "# of Students Enrolled" : "# Courses Learning"}</div>
                        <div className="u-text--left u-text--small u-text--medium">{type === "teacher" ? "# of Courses" : "# Courses Completed"}</div>
                      </div>
                    </li>
                    <InfiniteScroll dataLength={userData.length} hasMore={!isLast} next={handleFetchMore}>
                      {userData.length > 0
                        ? type === "student"
                          ? userData.map((teacher, index) => (
                              <ListUnit
                                name={teacher.user.name}
                                img={teacher.user.avatar}
                                courses={teacher.user.num_courses || null}
                                slug={teacher.user.slug}
                                lastActive={teacher.updated_at}
                                educatorDetail={teacher.user.educator_details ? teacher.user.educator_details : null}
                                studentDetail={teacher.user.student_details ? teacher.user.student_details : null}
                                index={index}
                                key={teacher.user_id}
                              />
                            ))
                          : userData.map((teacher, index) => (
                              <ListUnit
                                name={teacher.creator.name}
                                img={teacher.creator.avatar}
                                courses={teacher.creator.num_courses || null}
                                slug={teacher.creator.slug}
                                lastActive={teacher.updated_at}
                                educatorDetail={teacher.creator.educator_details ? teacher.creator.educator_details : null}
                                studentDetail={teacher.creator.student_details ? teacher.creator.student_details : null}
                                index={index}
                                key={teacher.user_id}
                              />
                            ))
                        : null}
                    </InfiniteScroll>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Matomo>
  );
}

export default Leaderboard;
