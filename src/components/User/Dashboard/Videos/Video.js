import React, { Component } from "react";
import "../../../../assets/css/User/Dashboard/videos.css";
import RecommendedList from "./Recommended Components/RecommendedList";
import VideoDetail from "./VideoDetail";
import MetaHelmet from "../../../common/MetaHelmet";
import { Steps } from "intro.js-react";
import Footer from "../../../common/Footer";
import { fetchVideoSearch, updateComponent } from "../../../../actions/videoActions";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import Matomo from "../../../common/Matomo";
import Skeleton from "./Skeleton";
import { Post } from "../../../common/common";
import Module from "../Course/Module";
import MostImportantLessonDialog from "./MostImportantLessonDialog";

import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import baseDomain from "../../../common/baseDomain";
import axios from "axios";
import swal from "sweetalert";
import Accordion from "../Course/Syllabus/Accordion";
// import QuizLoader from "./QuizLoader/QuizLoader";

class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.autoPlay = 0;
    this.slug = { note_slug: null, qna_slug: null, rm_slug: null };
    this.player = React.createRef();
    this.play = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.duration = 0;
    this.opts = {
      playerVars: {
        enablejsapi: 1,
        autoplay: new URLSearchParams(this.props.location.search).get("autoPlay") ? 1 : 0,
        start: new URLSearchParams(this.props.location.search).get("start") ?? 0,
        //value in seconds
      },
    };
  }

  state = {
    tabSelected: 0,
    videoTour: false,
    starArr: [],
    loading: true,
    course: null,
    openMostImportantLessonDialog: false,
    count: 0,
    isCopyright: true,
  };
  componentDidMount = async () => {
    window.scrollTo(0, 0);
    window.addEventListener("unload", this.handleUnload);
    const query = new URLSearchParams(this.props.location.search);
    const parent = query.get("parent");
    const level = query.get("level");
    let token = query.get("q");
    if (token === "null") {
      token = null;
    }
    let videoId;
    if (this.props.match.params.id) videoId = this.props.match.params.id;
    else videoId = query.get("id");
    const autoPlay = query.get("autoPlay");
    const tab = query.get("tab");
    const course_slug = query.get("course");
    const recommended = query.get("recommended");
    this.slug.note_slug = query.get("note_slug");
    this.slug.qna_slug = query.get("qna_slug");
    this.slug.rm_slug = query.get("rm_slug");
    if (course_slug) {
      let url = `${baseDomain.route}${baseDomain.subRoute}/get_final_course_details?course_slug=${course_slug}`;
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
          this.setState({ course: data.course });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    await this.props.fetchVideoSearch(parent, level, token, videoId, autoPlay, course_slug, recommended);

    if (tab === "1") {
      this.setState({ tabSelected: 1, loading: true });
    } else if (tab === "2") {
      this.setState({ tabSelected: 2, loading: true });
    } else if (tab === "3") {
      this.setState({ tabSelected: 3, loading: true });
    } else {
      this.setState({ loading: true });
    }

    setTimeout(() => {
      if (localStorage.getItem("show_video_tutorial") !== "false") {
        this.setState({ videoTour: true });
        localStorage.setItem("show_video_tutorial", false);
      }
    }, 1000);
    const starAr = this.props.videos.map((star) => {
      return {
        id: star.id,
        stars: star.total_rating_sum / star.total_times_rated || 0,
      };
    });
    this.setState({ starArr: starAr, loading: false });
  };
  handleUnload = () => {
    if (this.play) {
      console.log("unload");
      if (localStorage.getItem("access_token")) {
        this.saveToHistory(this.props.match.params.id, this.startTime, this.endTime);
      }
    }
  };

  handleVideoSelect = async (e, video, index, autoPlayAskify) => {
    e.stopPropagation();
    window.scrollTo(0, 0);
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get("q");
    const course_slug = query.get("course");
    const tab = query.get("tab");
    this.autoPlay = 0;
    if (course_slug) {
      this.props.history.push(
        "/dashboard/videos/" +
          video.url +
          "?course=" +
          course_slug +
          (tab ? "&tab=" + tab : "") +
          "&start=" +
          (video.pivot?.start_time ?? 0) +
          (parseInt(video.pivot?.end_time ?? 0) > 0 ? "&end=" + video.pivot.end_time : "")
      );
    } else if (autoPlayAskify) {
      this.autoPlay = 1;

      this.props.history.push(
        "/dashboard/videos/" +
          video.url +
          "?q=" +
          encodeURIComponent(token).replace(/%20/g, "+") +
          "&autoPlay=" +
          autoPlayAskify +
          (tab ? "&tab=" + tab : "")
      );
    } else if (!token) {
      this.props.history.push("/dashboard/videos/" + video.url + (tab ? "?tab=" + tab : ""));
    } else
      this.props.history.push(
        "/dashboard/videos/" +
          video.url +
          "?q=" +
          encodeURIComponent(token).replace(/%20/g, "+") +
          (tab ? "&tab=" + tab : "")
      );
  };

  handleAutoPlay = async (index, autoPlay) => {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get("q");
    const course_slug = query.get("course");
    const tab = query.get("tab");
    if (index < this.props.videos.length - 1) {
      // this.props.handleAutoPlay(autoPlay);
      this.autoPlay = autoPlay;
      if (course_slug) {
        this.props.history.push(
          "/dashboard/videos/" +
            this.props.videos[index + 1].url +
            "?course=" +
            course_slug +
            (tab ? "&tab=" + tab : "")
        );
      } else {
        this.props.history.push(
          "/dashboard/videos/" +
            this.props.videos[index + 1].url +
            "?q=" +
            encodeURIComponent(token).replace(/%20/g, "+") +
            (tab ? "&tab=" + tab : "")
        );
      }
    }
  };

  handleStarChange = (id, value, oldValue) => {
    const newArr = this.state.starArr.map((e) => {
      if (e.id === id) {
        return {
          id: id,
          stars: e.stars - oldValue + value,
        };
      } else {
        return e;
      }
    });
    this.setState({ starArr: newArr });
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      const prevQuery = new URLSearchParams(prevProps.location.search);
      let prevVideoId = prevProps.match.params.id;
      const query = new URLSearchParams(this.props.location.search);
      const parent = query.get("parent");
      const level = query.get("level");
      const token = query.get("q");
      let videoId;
      if (this.props.match.params.id) videoId = this.props.match.params.id;
      else videoId = query.get("id");
      const autoPlay = query.get("autoPlay");
      const start = query.get("start");
      const tab = query.get("tab");
      const course_slug = query.get("course");
      if (prevVideoId !== videoId) {
        let index;
        for (let i = 0; i < this.props.videos.length; i++) {
          if (videoId === this.props.videos[i].url) {
            index = i;
            break;
          }
        }
        this.opts = {
          playerVars: {
            enablejsapi: 1,
            autoplay: new URLSearchParams(this.props.location.search).get("autoPlay") ? 1 : 0,
            start: new URLSearchParams(this.props.location.search).get("start") ?? 0,
            //value in seconds
          },
        };
        if (index >= 0) {
          this.props.updateComponent(index, this.autoPlay, token);
        } else {
          this.props.fetchVideoSearch(parent, level, token, videoId, autoPlay, course_slug);
        }
        if (tab === "1") {
          this.setState({ tabSelected: 1, loading: true });
        } else if (tab === "2") {
          this.setState({ tabSelected: 2, loading: true });
        } else if (tab === "3") {
          this.setState({ tabSelected: 3, loading: true });
        } else {
          this.setState({ loading: true, tabSelected: 0 });
        }
        clearInterval(this.interval);
        this.play = 0;
        this.setState({ loading: false, count: 0 });
      }
    }
  }

  handleTabSelect = (value) => {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get("q");
    const course_slug = query.get("course");
    if (course_slug) {
      if (value === 0) {
        this.props.history.replace("/dashboard/videos/" + this.props.selectedVideo.url + "?course=" + course_slug);
      } else {
        this.props.history.replace(
          "/dashboard/videos/" + this.props.selectedVideo.url + "?course=" + course_slug + "&tab=" + value
        );
      }
    } else if (value === 0) {
      this.props.history.replace(
        "/dashboard/videos/" + this.props.selectedVideo.url + "?q=" + encodeURIComponent(token).replace(/%20/g, "+")
      );
    } else {
      this.props.history.replace(
        "/dashboard/videos/" +
          this.props.selectedVideo.url +
          "?q=" +
          encodeURIComponent(token).replace(/%20/g, "+") +
          "&tab=" +
          value
      );
    }
  };

  closeVideoTour = () => {
    this.setState({
      videoTour: false,
    });
  };

  onReady = async (e) => {
    let duration = await e.target.getDuration();
    this.duration = duration;
    console.log(duration / 2);
    this.startTime = 0;
    this.endTime = 0;
  };

  onPlay = (event) => {
    this.play = 1;
    this.startTime = event.target.getCurrentTime();
    this.endTime = event.target.getCurrentTime();
  };

  onPause = (event) => {
    if (localStorage.getItem("access_token")) {
      this.endTime = event.target.getCurrentTime();
      this.saveToHistory(this.props.match.params.id, this.startTime, this.endTime);
      this.startTime = event.target.getCurrentTime();
      this.endTime = event.target.getCurrentTime();
    }
  };

  changeState = (event) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.endTime = Math.trunc(event.target.getCurrentTime());
      if (parseInt(event.target.getCurrentTime()) === parseInt(this.duration / 2)) {
        if (this.state.count === 0) {
          event.target.pauseVideo();
          this.setState({ openMostImportantLessonDialog: true, count: 1 });
        }
      }
    }, 500);
  };

  onEnd = async (event, index) => {
    console.log("end");
    await this.saveToHistory(this.props.match.params.id, this.startTime, this.endTime);
    this.handleAutoPlay(index, 1);
  };

  saveToHistory = async (url, startTime, endTime) => {
    // let time = await this.player.current.internalPlayer.getCurrentTime();
    let saveHistory;
    if (this.props.courseId) {
      saveHistory = {
        video_url: url,
        start_time: Math.trunc(startTime),
        end_time: Math.trunc(endTime),
        category_id: this.props.courseId,
      };
    } else {
      saveHistory = {
        video_url: url,
        start_time: Math.trunc(startTime),
        end_time: Math.trunc(endTime),
      };
    }
    await Post(1, "save_to_watch_history", saveHistory);
  };
  componentWillUnmount = async () => {
    clearInterval(this.interval);
    if (localStorage.getItem("access_token") && this.play) {
      console.log("unmount");
      await this.saveToHistory(this.props.match.params.id, this.startTime, this.endTime);
    }
    window.removeEventListener("unload", this.handleUnload);
  };

  render() {
    try {
      const { index, initial, liked, startTime, token, askifyLength, selectedVideo, videos, courseId, course } =
        this.props;
      const videoTourSteps = [
        {
          element: `[data-tut="notes"]`,
          intro: `<span>✍</span>Add annotations to videos! This will help you remember stuff better! You can also help your colleagues find relevant parts in these videos!`,
        },
        {
          element: '[data-tut="videos"]',
          intro: `<span>😎</span>You are also recommended videos you should watch next to improve your learning!`,
        },
        {
          element: '[data-tut="keyword"]',
          intro: "<span>😊</span>Help us determine what the video is about. Add keywords relevant to the video!",
          tooltipClass: "myTooltipClass customTooltipClass",
        },
        // {
        //   element: '[data-tut="share"]',
        //   intro: "Liked a video? Share it with your friends and learning groups over social media!",

        // },
      ];
      const query = new URLSearchParams(this.props.location.search);
      const course_slug = query.get("course");

      const colors = ["green", "dark-red"];
      if (!this.state.loading) {
        let channel = this.props.selectedVideo.channelTitle?.toLowerCase().includes("byju");
        let title = this.props.selectedVideo.title?.toLowerCase().includes("byju");
        if (channel || title) {
          swal({
            title: "Copyright protected content",
            icon: "warning",
            text: "Click on the button below to learn something new",
            button: {
              text: "Learn something new!",
            },
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then((ok) => {
            if (ok) {
              window.location.href = "/";
            }
          });
        } else {
          if (this.state.isCopyright) this.setState({ isCopyright: false });
        }
      }
      return (
        <Matomo pageTitle="Video Page">
          <div className="outer-div">
            {/* { this.state.loading && <QuizLoader />} */}
            {/* <QuizLoader isLoading={this.state.loading} /> */}

            <div className="video_container">
              {!this.state.loading ? (
                <>
                  <MetaHelmet
                    title={selectedVideo.title}
                    description={selectedVideo.description}
                    image={selectedVideo.thumbnails}
                  />
                  <Steps
                    enabled={this.state.videoTour}
                    steps={videoTourSteps}
                    initialStep={0}
                    onExit={this.closeVideoTour}
                    options={{
                      showStepNumbers: false,
                      overlayOpacity: 0,
                      doneLabel: "Got it",
                      hidePrev: true,
                      hideNext: true,
                      nextLabel: "Next",
                      tooltipClass: "myTooltipClass",
                      highlightClass: "myHighlightClass",
                      prevLabel: "back",
                    }}
                  />
                </>
              ) : (
                // <div className="loader">
                //   <CircularProgress />
                // </div>
                <></>
              )}
              <div className="ui grid">
                <div className="ui row">
                  <div id="video-section" className="video-section">
                    <div className="ui embed">
                      {!this.state.isCopyright && (
                        <YouTube
                          videoId={this.props.match.params.id}
                          key={this.props.match.params.id}
                          ref={this.player}
                          opts={this.opts}
                          onPlay={this.onPlay}
                          onPause={this.onPause}
                          onEnd={(e) => this.onEnd(e, index)}
                          onReady={this.onReady}
                          onStateChange={this.changeState}
                        />
                      )}
                      <MostImportantLessonDialog
                        open={this.state.openMostImportantLessonDialog}
                        setOpen={(bool) => {
                          this.setState({
                            openMostImportantLessonDialog: bool,
                          });
                        }}
                        video={selectedVideo}
                      />
                    </div>
                    <VideoDetail
                      video={selectedVideo}
                      initial={initial}
                      index={index}
                      share={window.location.href}
                      handleAutoPlay={this.handleAutoPlay}
                      handleTabSelect={this.handleTabSelect}
                      tabSelected={this.state.tabSelected}
                      handleStarChange={this.handleStarChange}
                      courseId={courseId}
                      slug={this.slug}
                      loading={this.state.loading}
                      url={this.props.match.params.id}
                      playerRef={this.player}
                    />
                  </div>

                  <div className="video-list-section">
                    {localStorage.getItem("access_token") && course_slug ? (
                      <div className="course-progress-box">
                        <div className="circular-progress">
                          <Box sx={{ position: "relative", display: "inline-flex" }}>
                            <CircularProgress
                              variant="determinate"
                              value={this.state.course?.user_actions[0]?.pivot?.progress}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                style={{ fontSize: 9 }}
                              >
                                {`${
                                  this.state.course?.user_actions[0]?.pivot?.progress >= 100
                                    ? 100
                                    : this.state.course?.user_actions[0]?.pivot?.progress == undefined
                                    ? "0"
                                    : this.state.course?.user_actions[0]?.pivot?.progress
                                }%`}
                              </Typography>
                            </Box>
                          </Box>
                        </div>

                        <div className="progress-text">
                          <h3>Course Progress</h3>
                          {/* <p>3 Days Left</p> */}
                        </div>
                      </div>
                    ) : null}

                    {/* <div className="course-target">
                    <p>Target</p>

                    <div className="course-target-days">

                      {Array(20).fill().map((item, indx) => (
                        <div className="course-target-day">
                          <div className={`target-bar ${ colors[Math.floor(Math.random() * 2)] }`}></div>
                          <div className="target-data">
                            <p className="target-date">
                              {indx + 1}Aug
                            </p>
                            <p className="target-day">
                              Sun
                            </p>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div> */}

                    <h3>{course_slug ? "Course Videos" : "Recommended"}</h3>
                    {!this.state.loading ? (
                      course ? (
                        <div className="courseModules" data-tut="videos">
                          {course.modules.map((e, i) => (
                            // <Module
                            //   parent={course.parent_id}
                            //   level={course.level}
                            //   course_slug={course.slug}
                            //   key={module.id}
                            //   count={index + 1}
                            //   module={module}
                            //   // update={update}
                            //   // dragStart={dragStart}
                            //   // changeOrder={changeOrder}
                            //   lastModule={course.modules.length - 1 === index}
                            //   totalCount={course.modules.length}
                            // />
                            <>
                              <Accordion
                                index={i}
                                videos={e.videos}
                                title={e.title}
                                quizzes={e.quizzes}
                                notes={e.notes}
                                live_classes={e.live_classes}
                                course_slug={course.slug}
                                videoPage={true}
                              />
                              {i != course.modules.length - 1 && <hr />}
                            </>
                          ))}
                        </div>
                      ) : (
                        <RecommendedList
                          handleVideoSelect={this.handleVideoSelect}
                          selectedVideo={selectedVideo}
                          color={true}
                          videos={videos}
                          askifyLength={askifyLength}
                          starArr={this.state.starArr}
                        />
                      )
                    ) : (
                      <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </Matomo>
      );
    } catch (e) {
      swal("OOPS some error occurred!", "We will fix this soon.", "warning");
      Post(0, "save_error_log", { subject: e.message, error_log: e.stack });
      return <></>;
    }
  }
}
const mapStatesToProps = (state) => {
  return {
    index: state.video.index,
    initial: state.video.initial,
    loading: state.video.loading,
    liked: state.video.liked,
    startTime: state.video.startTime,
    autoPlay: state.video.autoPlay,
    token: state.video.token,
    askifyLength: state.video.askifyLength,
    selectedVideo: state.video.selectedVideo,
    videos: state.video.videos,
    courseId: state.video.courseId,
    course: state.video.course,
    termVideos: state.search.termVideos,
    searchTerm: state.search.term,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVideoSearch: (parent, level, token, videoId, autoPlay, course_slug, recommended) =>
      dispatch(fetchVideoSearch(parent, level, token, videoId, autoPlay, course_slug, recommended)),
    updateComponent: (videoId, index, autoPlay) => dispatch(updateComponent(videoId, index, autoPlay)),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(VideoSearch);
