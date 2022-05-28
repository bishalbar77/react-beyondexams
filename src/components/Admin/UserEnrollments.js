import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListEnrollments from "./ListEnrollments";
import Matomo from "../common/Matomo";
import { Get } from "../common/common";
import { getLocal } from "../common/localStorageAccess";
import axios from "axios";
import "./UserCourses.css";
import baseDomain from "../../components/common/baseDomain";
import Tooltip from "@material-ui/core/Tooltip";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import InfoIcon from "../../assets/images/icons/alert-circle.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";

function UserEnrollments({ type }) {
  const [userData, setUserData] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");

  const useStyles = makeStyles((theme) => ({
    bookmark: {
      width: "42px",
    },
    icon: {
      marginRight: "3px",
      fontSize: "14px",
    },
    fishEye: {
      marginRight: "3px",
      fontSize: "8px",
    },
    topMiddle: {
      display: "flex",
      flexDirection: "column",
    },
    topRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    ["@media (max-width: 1050px)"]: {
      topRight: {
        display: "none",
      },
    },
    metaData: {
      "& svg": {
        fontSize: "12px",
      },
      "& img": {
        width: "12px",
        height: "auto",
      },
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    courseCompleteTitle: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    DialogGridItem: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    DialogGridCard: {
      textAlign: "center",
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: "14px",
      height: "100%",
      padding: "0 !important",
    },
    CardDesc: {
      color: "#686868",
      fontSize: "12px",
      marginTop: "0.5rem",
    },
    GridCard: {
      height: "100%",
      padding: "0 0.7rem",
    },
    CardContent: {
      padding: "10px !important",
    },
    cardMedia: {
      width: "100%",
      height: "auto",
      padding: "0.5rem 0.5rem 0 0.5rem",
    },
    dialog: {
      width: "650px",
    },
    clickableTopRight: {
      "&:hover": {
        cursor: "pointer",
      },
    },
    creatorAvatar: {
      height: "40px",
      width: "40px",
      borderRadius: "50%",
      padding: "2px",
      border: "3px solid #F1EDFF",
    },
    paper: {
      borderRadius: "16px",
      width: "650px",
      padding: "5px",
    },
    upload: {
      color: "black",
      background: "white",
      borderRadius: "16px",
      paddingLeft: "15px",
      paddingRight: "15px",
      textTransform: "capitialize",
    },
    closeIcon: { color: "white" },
    closeIconTwo: { color: "black" },
    input: {
      display: "none",
    },
    moduleContent: {
      display: "flex",
      flexDirection: "column",
    },
    accordian: {
      borderRadius: "10px !important",
      boxShadow: "none !important",
      backgroundColor: "#fafafa",
    },
    accordianSummary: {
      background: "#F1EDFF",
      borderRadius: "10px",
      alignItems: "flex-start",
    },
    container: {
      marginTop: "8px",
      background: "#fafafa",
      border: "1px solid #686868",
      borderRadius: "20px",
      width: "100%",
      padding: "8.5px 15px",
      fontSize: "14px",
      lineHeight: "21px",
      color: "#1d1d1d",
    },
  
    items: {
      display: "inline-block",
      marginRight: "5px",
      cursor: "pointer",
    },
  
    inputKeyword: {
      outline: "none",
      border: "none",
      fontSize: "14px",
      backgroundColor: "#fafafa",
      width: "100%",
    },
  
    tag: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 8px",
      background: "#E8E8E8",
      borderRadius: "38px",
      height: "30px",
      fontSize: "14px",
      lineHeight: "21px",
      color: "#1D1D1D",
      margin: "3px 0px",
    },
    description: {
      whiteSpace: "pre-line",
      wordBreak: "break-word",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "3",
      overflow: "hidden",
    },
    showMoreActive: {
      "-webkit-line-clamp": "unset",
    },
    topLeft: {
      marginRight: "10px",
    },
    endorseTick: {
      color: "var(--color3)",
      marginLeft: "8px",
      width: "20px",
      height: "20px",
      minWidth: "20px",
      minHeight: "20px",
      fill: "currentColor",
      verticalAlign: "middle",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    showMore: {
      alignSelf: "flex-start",
      marginLeft: "-5px",
    },
    checkbox: {
      fill: "red",
      "&$checked": {
        fill: "red",
        color: "#77AF44",
      },
    },
    checked: {},
    ["@media only screen and (max-width: 900px)"]: {
      title: {
        fontSize: "20px",
        marginTop: "10px",
      },
    },
  }));

  const classes = useStyles();
  useEffect(() => {

    async function fetchUserCoursesData() {
      const data = await Get(true, `get_course_enrollments`);
      console.log(data.data.data.data);
      setUserData(data.data.data.data);
      setNextPage(data.data.data.next_page_url);
      if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
    }
    fetchUserCoursesData();
  }, []);

  const handleInputChange = (evt) => {
    setInput(evt.target.value);
  };

  const handleRemoveItem = (index) => {
    return () => {
      setKeywords(keywords.filter((word, i) => i !== index));
    };
  };

  async function fetchCourseData(allKeywords) {
    const data = await Get(true, `get_course_enrollments?keywords=${allKeywords}`);
    console.log(data.data.data.data);
    setUserData(data.data.data.data);
    setNextPage(`${data.data.data.next_page_url}&keywords=${allKeywords}`);
    if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
  }

  const handleInputKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      const { value } = evt.target;
      if (value.length > 0) {
        setKeywords([...keywords, value]);
        setInput("");
        setUserData([]);
        console.log(keywords);
      }
      var allKeywords = keywords;
      allKeywords.push(value)
      fetchCourseData(allKeywords);
    }

    if (keywords.length && evt.keyCode === 8 && !input.length) {
      setKeywords(keywords.slice(0, keywords.length - 1));
    }
  };

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
        if (keywords.length > 0) {
          var newUserData = userData;
          data.data.data.data.forEach((data) => newUserData.push(data));
          setUserData(newUserData);
          setNextPage(`${data.data.data.next_page_url}&keywords=${keywords}`);
          if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
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
    <div>

      <Matomo pageTitle={"User courses"}>
        
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
              <h1 className="c-title">{"User Enrollments"}</h1>
            </div>
            <div style={{ padding:"20px",marginLeft:"60%",width:"40%"}}>
              <label className="input-label" id="course">
                Course Names
                <Tooltip
                  enterTouchDelay={1}
                  arrow
                  placement="right"
                  title="Add keywords"
                >
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </label>
              <label style={{  }}>
                <ul className={classes.container}>
                  {keywords.map((item, i) => (
                    <li key={i} className={classes.items} onClick={handleRemoveItem(i)}>
                      <div className={classes.tag}>
                        <span>{item}&nbsp; </span>
                        <CancelRoundedIcon style={{ fontSize: "1rem" }} />
                      </div>
                    </li>
                  ))}
                  <input
                    className={classes.inputKeyword}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                  />
                </ul>
              </label>
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
                          <div className="u-text--left u-text--small u-text--medium">#ID</div>
                          <div className="u-text--left u-text--small u-text--medium">Course Name</div>
                          <div className="u-text--left u-text--small u-text--medium">Creator Name</div>
                          <div className="u-text--left u-text--small u-text--medium">Enroller Name</div>
                          <div className="u-text--left u-text--small u-text--medium">Enrolled At</div>
                        </div>
                      </li>
                      <InfiniteScroll dataLength={userData.length} hasMore={!isLast} next={handleFetchMore}>
                        {userData.length > 0
                          ? userData.map((teacher, index) => (
                                <ListEnrollments
                                  name={teacher.category.title}
                                  img={teacher.category.image_url}
                                  creator={teacher.category.creator.name}
                                  creator_slug={teacher.category.creator.slug}
                                  user={teacher.user.name}
                                  user_slug={teacher.user.slug}
                                  courses={null}
                                  slug={teacher.category.slug}
                                  lastActive={teacher.created_at}
                                  educatorDetail={teacher.creator ? teacher.creator : null}
                                  studentDetail={teacher.user ? teacher.user : null}
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
    </div>
  );
}

export default UserEnrollments;
