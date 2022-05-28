import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListYoutubeVideo from "./ListYoutubeVideo";
import Matomo from "../common/Matomo";
import { Get } from "../common/common";
import { getLocal } from "../common/localStorageAccess";
import axios from "axios";
import "./YoutubeVideo.css";
import baseDomain from "../../components/common/baseDomain";
import Tooltip from "@material-ui/core/Tooltip";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import InfoIcon from "../../assets/images/icons/alert-circle.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";

function YoutubeVideo({ type }) {
  const [userData, setUserData] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");
  const [url, setURL] = useState("get_youtube_videos?sortBy=0");

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
      const data = await Get(true, url);
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

  async function fetchCourseData() {
    const data = await Get(true, url);
    console.log(data.data.data.data);
    setUserData(data.data.data.data);
    setNextPage(data.data.data.next_page_url);
    if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
  }

  async function fetchCourseDataAgain(newURL) {
    const data = await Get(true, newURL);
    console.log(data.data.data.data);
    setUserData(data.data.data.data);
    setNextPage(data.data.data.next_page_url);
    if (data.data.data.current_page === data.data.data.last_page) setIsLast(true);
  }

  const handleSorting1 = () => {
    var newURL = "get_youtube_videos?sortBy=1";
    setURL(newURL)
    setUserData([]);
    fetchCourseDataAgain(newURL);
  };

  const handleSorting = () => {
    var newURL = "get_youtube_videos?sortBy=0";
    setURL(newURL)
    setUserData([]);
    fetchCourseDataAgain(newURL);
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
      <Matomo pageTitle={"XAINIK SUPERSTARS"}>
        
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
              <h1 className="c-title">{"XAINIK SUPERSTARS"}</h1>
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
                          <div className="u-text--left u-text--small u-text--medium">Video Details</div>
                          <div className="u-text--left u-text--small u-text--medium">Channel</div>
                          <div className="u-text--left u-text--small u-text--medium" onClick={() => handleSorting1()}>Total Views</div>
                          <div className="u-text--left u-text--small u-text--medium" onClick={() => handleSorting()}>Total Likes</div>
                          <div className="u-text--left u-text--small u-text--medium">Up Votes</div>
                        </div>
                      </li>
                      <InfiniteScroll dataLength={userData.length} hasMore={!isLast} next={handleFetchMore}>
                        {userData.length > 0
                          ? userData.map((teacher, index) => (
                                <ListYoutubeVideo
                                  name={teacher.title}
                                  img={teacher.thumbnails}
                                  creator={teacher.channelTitle}
                                  creator_slug={teacher.url}
                                  courses={null}
                                  submission={teacher.channelTitle}
                                  submission_link={teacher.channelTitle}
                                  slug={teacher.url}
                                  lastActive={teacher.created_at}
                                  likes={teacher.likes_count}
                                  views={teacher.youtube_view_count}
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
  );
}

export default YoutubeVideo;
