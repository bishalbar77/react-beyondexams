import React, { Component } from "react";
import axios from "axios";
import Footer from "../../../common/Footer";
import baseDomain from "../../../common/baseDomain";
import "../../../../assets/css/User/Dashboard/browse.css";
import MetaHelmet from "../../../common/MetaHelmet";
import CourseCard from "./CourseCard";
import { connect } from "react-redux";
import { Steps } from "intro.js-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import BreadCrumbsComponent from "./BreadCrumbs";
import CourseClassification from "./CourseClassification";
import { CreateCourse } from "./TutorialSteps.js";
import AddPurple from "../../../../assets/images/icons/plus-circle-purple.svg";
import { getLocal } from "../../../common/localStorageAccess";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import { Content } from "../../../Home/Tabs";
import { Get, Post } from "../../../common/common";

var jsonData = require("./browse.json");

class Browse extends Component {
  constructor(props) {
    super(props);
    this.cocClick = false;
  }
  state = {
    browseTour: false,
    isOpen: false, // create your own course

    loading: true,

    selectedExplore: "classes",
    relatedCourses: [],
    nextRelatedCourses: null,
    courses: [],
    nextCourses: null,
    nextTopicCourse: null,

    courseRef: React.createRef(),
    isCourseCalling: false,
    isCategoryCalling: false,
    breadCrumbs: [],

    coursePageNumber: 2,

    parent: 0,
    level: 0,

    isCourseByMe: false,
    resizeEle: React.createRef(),
    cardNumbers: 0,
    cardHeight: 0,
    editPosition: false,
  };
  cocClick = false;

  getCourses = async () => {
    let level, parent, type;
    if (window.location.pathname == "/explore-by-topics") {
      level = 1;
      parent = 0;
      type = "topics";
    } else if (window.location.pathname == "/explore-by-classes") {
      level = 1;
      parent = 0;
      type = "classes";
    } else {
      const query = new URLSearchParams(this.props.location.search);
      level = query.get("level");
      parent = query.get("parent");
      type = query.get("type");
    }
    let url = `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.getMoreCourses}?level=${level}&parent_id=${parent}&page=${this.state.coursePageNumber}`;
    let coursePageNumber = this.state.coursePageNumber + 1;
    try {
      this.setState({ isCourseCalling: true });
      if (this.state.nextCourses !== null) {
        const response = await axios.get(url);
        console.log(response);
        if (response.status === 200) {
          let nextCourses = response.data.data.courses.next_page_url ?? null;
          let courses = [...this.state.courses];

          if (Array.isArray(response.data.data.courses.data))
            courses = [...courses, ...response.data.data.courses.data];

          this.setState({
            nextCourses,
            courses,
            coursePageNumber,
          });
        }
      }
    } catch (error) {
    } finally {
      if (this.state.isCourseCalling) {
        this.setState({ isCourseCalling: false });
      }
    }
  };

  getTopics = async () => {
    let level, parent, type;
    if (window.location.pathname == "/explore-by-topics") {
      level = 1;
      parent = 0;
      type = "topics";
    } else if (window.location.pathname == "/explore-by-classes") {
      level = 1;
      parent = 0;
      type = "classes";
    } else {
      const query = new URLSearchParams(this.props.location.search);
      level = query.get("level");
      parent = query.get("parent");
      type = query.get("type");
    }
    let url = `${jsonData.api.getTopics}?level=${level}&parent_id=${parent}&page=${this.state.coursePageNumber}`;
    let coursePageNumber = this.state.coursePageNumber + 1;
    try {
      this.setState({ isCourseCalling: true });
      if (this.state.nextCourses !== null) {
        const response = await Get(1, url);
        console.log(response);
        if (response.status === 200) {
          let nextCourses = response.data.data.next_page_url ?? null;
          let courses = [...this.state.courses];
          if (level == 1) {
            if (Array.isArray(response.data.data.data)) {
              courses = [...courses, ...response.data.data.data];
            }
          } else if (Array.isArray(response.data.data.topics.data)) {
            courses = [...courses, ...response.data.data.topics.data];
          }

          this.setState({
            nextCourses,
            courses,
            coursePageNumber,
          });
        }
      }
      if (this.state.nextTopicCourse !== null) {
        const response = await axios.get(this.state.nextTopicCourse + `&level=${level}&parent_id=${parent}`);
        console.log(response);
        if (response.status === 200) {
          let nextTopicCourse = response.data.data.next_page_url ?? null;
          let courses = [...this.state.courses];

          if (Array.isArray(response.data.data.topics.data)) courses = [...courses, ...response.data.data.topics.data];

          this.setState({
            nextTopicCourse,
            courses,
          });
        }
      }
    } catch (error) {
    } finally {
      if (this.state.isCourseCalling) {
        this.setState({ isCourseCalling: false });
      }
    }
  };

  getInitialData = async (level, parent) => {
    try {
      this.setState({ loading: true });
      const response = await axios.get(
        `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.getCourses}?level=${level}&parent_id=${parent}`
      );
      let courses = [];
      let relatedCourses = [];
      let nextRelatedCourses = null;
      let nextCourses = null;
      let breadCrumbs = [];
      if (response.status === 200) {
        courses = response.data.data?.courses.data ?? [];
        relatedCourses = response.data.data?.otherCourses.data ?? [];
        nextRelatedCourses = response.data.data?.otherCourses.next_page_url ?? null;
        nextCourses = response.data.data?.courses.next_page_url ?? null;
        breadCrumbs = response.data.data?.breadcrumbs[0]?.reverse() ?? [];
      }
      this.setState({
        courses,
        relatedCourses,
        nextRelatedCourses,
        nextCourses,
        breadCrumbs,
        coursePageNumber: 2,
      });
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  getInitialTopicData = async (level, parent) => {
    try {
      this.setState({ loading: true });
      const response = await Get(1, `${jsonData.api.getTopics}?level=${level}&parent_id=${parent}`);
      console.log(response.data.data);
      let courses = [];
      let nextCourses = null;
      let topicsCourses = [];
      let nextTopicCourse = null;
      if (level > 1) {
        let breadCrumbs = [];

        if (response.status === 200) {
          courses = response.data.data.topics?.data ?? [];
          topicsCourses = response.data.data.courses?.data ?? [];
          nextCourses = response.data.data.topics?.next_page_url ?? null;
          nextTopicCourse = response.data.data.courses?.next_page_url ?? null;
          breadCrumbs = response.data.data.breadcrumbs[0]?.reverse() ?? [];
        }
        this.setState({
          courses: [...courses, ...topicsCourses],
          nextCourses,
          coursePageNumber: 2,
          breadCrumbs,
          nextTopicCourse,
        });
      } else {
        if (response.status === 200) {
          courses = response.data.data?.data ?? [];
          nextCourses = response.data.data?.next_page_url ?? null;
        }
        this.setState({
          courses,
          nextCourses,
          coursePageNumber: 2,
          breadCrumbs: [],
        });
      }
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    let level, parent, type;
    if (window.location.pathname == "/explore-by-topics") {
      level = 1;
      parent = 0;
      type = "topics";
    } else if (window.location.pathname == "/explore-by-classes") {
      level = 1;
      parent = 0;
      type = "classes";
    } else {
      const query = new URLSearchParams(this.props.location.search);
      level = query.get("level");
      parent = query.get("parent");
      type = query.get("type");
    }
    if (type === "classes") {
      await this.getInitialData(level, parent);
    } else {
      await this.getInitialTopicData(level, parent);
    }
    this.setState({ loading: false, level, parent, selectedExplore: type });

    window.onscroll = () => {
      if (
        this.state.courseRef?.current?.clientHeight < window.scrollY + window.innerHeight &&
        !this.state.isCourseCalling
      ) {
        let type;
        if (window.location.pathname == "/explore-by-topics") {
          type = "topics";
        } else if (window.location.pathname == "/explore-by-classes") {
          type = "classes";
        } else {
          const query = new URLSearchParams(this.props.location.search);
          type = query.get("type");
        }
        if (type === "classes") this.getCourses();
        else this.getTopics();
      }
    };

    setTimeout(() => {
      if (localStorage.getItem("show_browse_tutorial") !== "false" && level === "1") {
        if (localStorage.getItem("coc") === "true") {
        } else {
          this.props.setBrowseTour(true);
          this.setState({ browseTour: true });
          localStorage.setItem("show_browse_tutorial", false);
        }
      }
    }, 500);

    setTimeout(() => {
      if (localStorage.getItem("coc") === "true") {
        this.setState({ isOpen: true });
      }
    }, 500);
  };
  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.location !== this.props.location) {
      window.scrollTo(0, 0);
      let level, parent, type;
      if (window.location.pathname == "/explore-by-topics") {
        level = 1;
        parent = 0;
        type = "topics";
      } else if (window.location.pathname == "/explore-by-classes") {
        level = 1;
        parent = 0;
        type = "classes";
      } else {
        const query = new URLSearchParams(this.props.location.search);
        level = query.get("level");
        parent = query.get("parent");
        type = query.get("type");
      }

      this.setState({
        level,
        parent,
        editPosition: false,
        selectedExplore: type,
      });

      if (!this.state.isCourseByMe) {
        if (type === "classes") await this.getInitialData(level, parent);
        else await this.getInitialTopicData(level, parent);
      } else this.handleCreatedByMe(level, parent);

      setTimeout(() => {
        if (localStorage.getItem("show_browse_tutorial") !== "false" && level === "1") {
          this.props.setBrowseTour(true);
          this.setState({ browseTour: true });
          localStorage.setItem("show_browse_tutorial", false);
        }
      }, 1000);
    }
  };

  closeBrowseTour = () => {
    this.setState({
      browseTour: false,
    });
    this.props.setBrowseTour(false);
  };

  redirect = (event, level, parent, slug, video_count, categories) => {
    let type;
    if (window.location.pathname == "/explore-by-topics") {
      type = "topics";
    } else if (window.location.pathname == "/explore-by-classes") {
      type = "classes";
    } else {
      const query = new URLSearchParams(this.props.location.search);
      type = query.get("type");
    }
    event.stopPropagation();
    if (type === "classes") {
      if (!categories && !video_count && level <= 2) {
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        this.props.history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    } else {
      if (categories === undefined)
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      else if (!categories && !video_count && level <= 2) {
        this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        this.props.history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else this.props.history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    }
  };

  openProfile = (event, slug) => {
    event.stopPropagation();
    this.props.history.push(`/dashboard/profile/${encodeURIComponent(slug)}`);
  };
  closeTour = () => {
    if (this.cocClick) {
      console.log("coc click");
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
    this.setState({
      isOpen: false,
    });
  };
  handleCreatedByMe = async (level, parent) => {
    this.setState({ loading: true });
    if (parent !== "0") this.getBreadCrumbs(parent);
    if (level === "1")
      this.setState({
        breadCrumbs: [],
      });

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.userCourses}?level=${level}&parent_id=${parent}&type=${this.state.selectedExplore}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        let courses = Array.isArray(res) ? [...res] : [];
        console.log(courses);
        let nextCourses = null;
        this.setState({
          courses,
          nextCourses,
        });
      })
      .catch((e) => {
        let message = e.response.data.message;

        if (message == "No courses found under classes" || message == "No courses found under topics") {
          this.setState({
            courses: [],
            nextCourses: null,
          });
        } else {
          swal("Error", e.response.data.message, "error");
        }
        // this.setState({ isCourseByMe: false });
      });

    this.setState({ loading: false });
  };

  getBreadCrumbs = async (id) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.courseBreadcrumbs}?parent_id=${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let breadCrumbs = response.data.data.breadcrumbs.reverse();
        console.log(breadCrumbs);

        this.setState({
          breadCrumbs,
        });
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  resizeObserver = new ResizeObserver(() => {
    if (this.state.resizeEle.current === null) return;
    let width = this.state.resizeEle.current.clientWidth;
    let num = 0;
    let height = 0;
    if (window.innerWidth > 550) {
      num = Math.floor(width / 210);
      height = 310;
    } else if (window.innerWidth > 440) {
      num = Math.floor(width / 190);
      height = 310;
    } else if (window.innerWidth > 370) {
      num = Math.floor(width / 160);
      height = 284;
    } else {
      num = 1;
      height = 330;
    }
    // console.log(width, num);

    this.setState({ cardNumbers: num, cardHeight: height });
  });

  onEditCoursePosition = (targetIndex, course) => {
    console.log(course, targetIndex);
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.courseOrdering}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        course_id: course.id,
        parent_id: course.parent_id,
        new_order: targetIndex,
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };

  onChange = (sourceId, sourceIndex, targetIndex, targetId) => {
    let oldCourses = [...this.state.courses];
    const courses = swap(oldCourses, sourceIndex, targetIndex);
    if (sourceIndex !== targetIndex) this.onEditCoursePosition(targetIndex + 1, courses[targetIndex]);
    this.setState({ courses });
  };

  showMoreCourse = () => {
    if (this.state.type === "classes") this.getCourses();
    else this.getTopics();
  };

  render() {
    try {
      let level, parent, type;
      if (window.location.pathname == "/explore-by-topics") {
        level = 1;
        parent = 0;
        type = "topics";
      } else if (window.location.pathname == "/explore-by-classes") {
        level = 1;
        parent = 0;
        type = "classes";
      } else {
        const query = new URLSearchParams(this.props.location.search);
        level = query.get("level");
        parent = query.get("parent");
        type = query.get("type");
      }
      const browseTourSteps = [
        {
          element: `[data-tut="search"]`,
          intro: `<span>🧐</span>Click on this button to search for something new to learn!`,
        },
        {
          element: '[data-tut="class"]',
          intro: "<span>😇</span>Select your favourite topic to start learning.",
          tooltipClass: "myTooltipClass customTooltipClass",
        },
      ];
      // resizeObserver.observe(document.getElementById("courseDiv"));
      if (this.state.resizeEle.current !== null) this.resizeObserver.observe(this.state.resizeEle.current);
      return this.state.loading ? (
        <div className="loader">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="rightPane">
            <MetaHelmet
              title="BeyondExams"
              description="Best educational videos on your fingertips. Start learning now!"
            />
            {/* <div
            style={{ position: "absolute", width: "100%" }}
            id="courseDiv"
            
          ></div> */}
            <div className="outer-container">
              <div className="spacing-1"></div>
              <div className="spacing-1"></div>

              <div>
                <div>
                  <CourseClassification
                    setClassification={(value) => this.setState({ selectedExplore: value })}
                    parent={this.state.parent}
                    classification={this.state.selectedExplore}
                    onCreatedByMe={this.handleCreatedByMe}
                    isCourseByMe={this.state.isCourseByMe}
                    onViewToggle={() =>
                      this.setState({
                        isCourseByMe: !this.state.isCourseByMe,
                      })
                    }
                    level={this.state.level}
                    isStudent={localStorage.getItem("role_id") === "1"}
                  />
                </div>

                {/* {localStorage.getItem("role_id") === "2" && !this.state.isCourseByMe && (
                <>
                  {this.state.editPosition ? (
                    <div className="editPositionButton" onClick={() => this.setState({ editPosition: false })}>
                      Finish
                    </div>
                  ) : (
                    <div className="editPositionButton" onClick={() => this.setState({ editPosition: true })}>
                      Edit Position
                    </div>
                  )}
                </>
              )} */}

                {!this.state.editPosition && (
                  <BreadCrumbsComponent
                    breadCrumbs={this.state.breadCrumbs}
                    redirect={this.redirect}
                    type={this.state.selectedExplore}
                  />
                )}

                {/* <div className="spacing-1"></div> */}

                <div
                  ref={this.state.resizeEle}
                  className="filterPageGrid"
                  style={localStorage.getItem("role_id") !== "2" ? { gridTemplateColumns: "unset" } : null}
                >
                  {this.state.editPosition ? (
                    <div ref={this.state.courseRef}>
                      <GridContextProvider onChange={this.onChange}>
                        <GridDropZone
                          id="items"
                          boxesPerRow={this.state.cardNumbers}
                          rowHeight={this.state.cardHeight}
                          style={{
                            height: `${
                              Math.ceil(this.state.courses.length / this.state.cardNumbers) * this.state.cardHeight
                            }px`,
                          }}
                        >
                          {this.state.courses.map((e) => {
                            let isBigCard = false;
                            let course = e;
                            if (e.hasOwnProperty("num_topics")) if (e.num_topics != null) isBigCard = true;
                            if (e.hasOwnProperty("num_categories"))
                              if (e.num_categories != 0 && e.num_categories != null) isBigCard = true;
                            if (this.state.selectedExplore === "topics" && !e.hasOwnProperty("num_topics"))
                              course = e.category;

                            return !isBigCard ? (
                              <GridItem key={e.id}>
                                <CourseCard
                                  type={this.state.selectedExplore === "classes" ? 1 : 0}
                                  course={e}
                                  key={e.id}
                                  openProfile={() => {}}
                                  redirect={() => {}}
                                  isActive={true}
                                />
                              </GridItem>
                            ) : (
                              <Content
                                classes={"l0_card"}
                                style={{ margin: "15px auto" }}
                                {...e}
                                key={e.id}
                                type={this.state.selectedExplore === "classes" ? 1 : 0}
                                course={e}
                                onRedirect={(event) => {
                                  this.redirect(event, e.level + 1, e.id, e.slug, e?.video_count, e.num_categories);
                                }}
                              />
                            );
                          })}
                        </GridDropZone>
                      </GridContextProvider>
                    </div>
                  ) : (
                    <>
                      {localStorage.getItem("role_id") === "2" ? (
                        <div className="LeftContainerGrid" ref={this.state.courseRef}>
                          <Link
                            to={`/add-new-course/${this.state.parent}/${this.state.level}/${this.state.selectedExplore}/1`}
                          >
                            <div
                              data-tut="course"
                              className="new-course-button"
                              onClick={() => {
                                if (localStorage.getItem("coc") === "true") {
                                  this.cocClick = true;
                                }
                                // props.onValue();
                                // setIsNewCourseFormShow(true);
                              }}
                            >
                              <img src={require(`../../../../assets/images/icons/${jsonData.images.addIcon}`)} alt="" />
                              <div>{jsonData.buttons.createCourse}</div>
                            </div>
                          </Link>
                          {Array.isArray(this.state.courses) &&
                            this.state.courses.map((e) => {
                              let isBigCard = false;
                              let course = e;
                              if (e.hasOwnProperty("num_topics")) if (e.num_topics != null) isBigCard = true;
                              if (e.hasOwnProperty("num_categories"))
                                if (e.num_categories != 0 && e.num_categories != null) isBigCard = true;
                              if (this.state.selectedExplore === "topics" && !e.hasOwnProperty("num_categories"))
                                course = e.category;

                              return isBigCard ? (
                                <Content
                                  classes={"l0_card"}
                                  style={{ margin: "15px auto" }}
                                  {...e}
                                  key={e.id}
                                  type={this.state.selectedExplore === "classes" ? 1 : 0}
                                  course={e}
                                  onRedirect={(event) => {
                                    this.redirect(event, e.level + 1, e.id, e.slug, e?.video_count, e.num_categories);
                                  }}
                                />
                              ) : (
                                <CourseCard
                                  course={course}
                                  key={e.id}
                                  type={this.state.selectedExplore === "classes" ? 1 : 0}
                                  openProfile={this.openProfile}
                                  redirect={this.redirect}
                                  isActive={e.num_categories !== null || e.video_count !== 0}
                                />
                              );
                            })}
                        </div>
                      ) : (
                        <div>
                          {parseInt(level) > 1 && <div className="spacing-2"></div>}
                          {/* --------------------------COURSE CARD START -------------------------------- */}

                          <div className="filterFullPageGrid">
                            <div className="LeftContainerGrid" ref={this.state.courseRef}>
                              {this.state.courses.map((e) => {
                                let isBigCard = false;
                                let course = e;
                                if (e.hasOwnProperty("num_topics")) if (e.num_topics != null) isBigCard = true;
                                if (e.hasOwnProperty("num_categories"))
                                  if (e.num_categories != 0 && e.num_categories != null) isBigCard = true;
                                if (this.state.selectedExplore === "topics" && !e.hasOwnProperty("num_topics"))
                                  course = e.category;

                                return isBigCard ? (
                                  <Content
                                    classes={"l0_card"}
                                    style={{ margin: "15px auto" }}
                                    {...e}
                                    key={e.id}
                                    type={this.state.selectedExplore === "classes" ? 1 : 0}
                                    course={e}
                                    onRedirect={(event) => {
                                      this.redirect(event, e.level + 1, e.id, e.slug, e?.video_count, e.num_categories);
                                    }}
                                  />
                                ) : (
                                  <CourseCard
                                    course={course}
                                    key={e.id}
                                    type={this.state.selectedExplore === "classes" ? 1 : 0}
                                    openProfile={this.openProfile}
                                    redirect={this.redirect}
                                    isActive={e.num_categories !== null || e.video_count !== 0}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {/* --------------------------COURSE CARD END -------------------------------- */}
                        </div>
                      )}
                      {/* <div className="browse-page-right-container">
                  <div className="flex-column-start" data-tut="course">
                    
                  </div>
                </div> */}
                    </>
                  )}
                </div>
                {this.state.nextCourses !== null && (
                  <div className={"show_more"}>
                    <div onClick={this.showMoreCourse}>Show More</div>
                  </div>
                )}
              </div>

              <Footer />
            </div>
          </div>
          <Steps
            enabled={this.state.browseTour}
            steps={browseTourSteps}
            initialStep={0}
            onExit={this.closeBrowseTour}
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
          <Steps
            enabled={this.state.isOpen}
            steps={CreateCourse}
            initialStep={0}
            onExit={this.closeTour}
            showStepNumbers={false}
            options={{
              tooltipClass: "tour-tool-tip myTooltipClass",
              showStepNumbers: false,
              overlayOpacity: 0,
              highlightClass: "myHighlightClass",
              showBullets: false,
              keyboardNavigation: false,
              // skipLabel: "Got it",
              // showButtons: false,
            }}
          />
        </>
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
    filters: state.browse.filters,
    open: state.browse.open,
    checked: state.browse.checked,
    category: state.browse.category,
    term: state.browse.term,
    videos: state.browse.videos,
    parentId: state.browse.parentId,
    durations: state.browse.durations,
    showRemoveAndEdit: state.browse.showRemoveAndEdit,
    category_id: state.browse.category_id,
  };
};

export default connect(mapStatesToProps, null)(Browse);
