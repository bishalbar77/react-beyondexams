import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchInput from "./Components/SearchInput.js";
import SearchHeading from "./Components/SearchHeading.js";
import { connect } from "react-redux";
import { getBestCourses } from "../../../../actions/browseActions";
import Filters from "./Components/Filters/Filters";
import CourseCard from "../../../Home/Tabs.js";
import VideoCard from "./Components/Video/VideoCard";
import AskifyCard from "./Components/Video/AskifyCard";
import Note from "./Components/Notes/Note";
import ReadingMaterial from "./Components/ReadingMaterial/ReadingMaterial";
import QnA from "./Components/QnA/QnA";
import { Get, Post } from "../../../common/common";
import { CircularProgress } from "@material-ui/core";
import { Content } from "../../../Home/Tabs.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { withStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./search.css";
import swal from "sweetalert";

var jsonData = require("./search.json");

const initialState = {
  tabSelected: 0,
  data: {
    courses: { data: [], total: 0 },
    videos: { final_response: [], total: 0 },
    notes: { data: [], total: 0 },
    qna: { data: [], total: 0 },
    reading_materials: { data: [], total: 0 },
  },
  askifyResults: [],
  q: new URLSearchParams(window.location.search).get("q"),
  hasMoreCourses: true,
  loadCourses: false,
  hasMoreVideos: true,
  loadVideos: false,
  hasMoreNotes: true,
  loadNotes: false,
  hasMoreReadingMaterial: true,
  loadReadingMaterial: false,
  hasMoreQnA: true,
  loadQnA: false,
  coursesPage: 0,
  videosPageToken: null,
  notesPage: 0,
  readingMaterialPage: 0,
  qnaPage: 0,
  Courses: true,
  Videos: true,
  Notes: true,
  "Reading Material": true,
  "Q & A": true,
  topicIds: [],
  levelIds: [],
  loadingOverlay: false,
  topics: [],
  showFiltersMobileView: false,
  pauseVideos: false,
  url: null,
  loading: true,
};

class Search extends Component {
  state = initialState;

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    const tab = query.get("tab");
    this.setState({ q });
    if (q[q.length - 1] === "?") {
      Get(0, "get_askify_youtube_search_data?search=" + q).then((res) => {
        this.setState({ askifyResults: res.data.askifyResults });
      });
    }
    this.fetchMoreCourses();
    this.fetchMoreVideos();
    this.fetchMoreNotes();
    this.fetchMoreQnA();
    this.fetchMoreReadingMaterial();
    this.setState({ q, tabSelected: tab ? parseInt(tab) : 0 });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      const prevQuery = new URLSearchParams(prevProps.location.search);
      const prevQ = prevQuery.get("q");
      const prevTab = prevQuery.get("tab");
      const query = new URLSearchParams(this.props.location.search);
      const q = query.get("q");
      const tab = query.get("tab");
      if (prevQ !== q) {
        this.setState(initialState);
        console.log(this.state);
        this.setState({ tabSelected: tab ? parseInt(tab) : 0, q });
        this.componentDidMount();
      } else if (prevTab !== tab) {
        this.setState({ tabSelected: tab ? parseInt(tab) : 0 });
      }
    }
  };
  pauseAll = (url) => {
    this.setState({ pauseVideos: true, url });
  };

  handleChange = (event, newValue) => {
    let params = new URLSearchParams(window.location.search);
    if (newValue !== 0) {
      params.set("tab", newValue);
      this.props.history.replace("?" + params.toString());
    } else {
      params.delete("tab");
      this.props.history.replace("?" + params.toString());
    }
    this.setState({ tabSelected: newValue });
  };
  searchSubmit = async (q) => {
    let params = new URLSearchParams(window.location.search);
    params.set("q", q);
    this.props.history.push("/dashboard/search?" + params.toString());
  };
  fetchMoreCourses = async () => {
    this.setState({ loadCourses: true });
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    setTimeout(async () => {
      let res = await Get(0, "typesense_search_courses?search=" + q + "&page=" + (this.state.coursesPage + 1));
      let response = res.data;
      let stateData = JSON.parse(JSON.stringify(this.state.data));
      stateData.courses.total = response.total;
      stateData.courses.data = stateData.courses.data.concat(response.data);
      if (response.last_page === this.state.coursesPage + 1) {
        this.setState((prevState) => ({
          data: stateData,
          coursesPage: prevState.coursesPage + 1,
          hasMoreCourses: false,
          loadCourses: false,
          loading: false,
        }));
      } else {
        this.setState((prevState) => ({
          data: stateData,
          coursesPage: prevState.coursesPage + 1,
          hasMoreCourses: true,
          loadCourses: false,
          loading: false,
        }));
      }
    }, 1);
  };
  fetchMoreVideos = async () => {
    this.setState({ loadVideos: true });
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    setTimeout(async () => {
      let res = await Get(
        0,
        "youtube_search_data?search=" +
          q +
          (this.state.videosPageToken ? "&nextPageToken=" + this.state.videosPageToken : "")
      );
      let response = res.data;
      let stateData = JSON.parse(JSON.stringify(this.state.data));
      stateData.videos.final_response = stateData.videos.final_response.concat(response.final_response);
      stateData.videos.total = response.pageInfo.totalResults;
      if (response.nextPageToken) {
        this.setState((prevState) => ({
          data: stateData,
          videosPageToken: response.nextPageToken,
          hasMoreVideos: true,
          loadVideos: false,
        }));
      } else {
        this.setState((prevState) => ({
          data: stateData,
          videosPageToken: null,
          hasMoreVideos: false,
          loadVideos: false,
        }));
      }
    }, 1);
  };

  fetchMoreNotes = async () => {
    this.setState({ loadNotes: true });
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    setTimeout(async () => {
      let res = await Get(0, "typesense_search_notes?search=" + q + "&page=" + (this.state.notesPage + 1));
      let response = res.data;
      let stateData = JSON.parse(JSON.stringify(this.state.data));
      stateData.notes.data = stateData.notes.data.concat(response.data);
      stateData.notes.total = response.total;
      console.log(stateData);
      if (response.last_page === this.state.notesPage + 1) {
        this.setState((prevState) => ({
          data: stateData,
          notesPage: prevState.notesPage + 1,
          hasMoreNotes: false,
          loadNotes: false,
        }));
      } else {
        this.setState((prevState) => ({
          data: stateData,
          notesPage: prevState.notesPage + 1,
          hasMoreNotes: true,
          loadNotes: false,
        }));
      }
    }, 1);
  };
  fetchMoreQnA = async () => {
    this.setState({ loadQnA: true });
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    setTimeout(async () => {
      let res = await Get(0, "typesense_search_qna?search=" + q + "&page=" + (this.state.qnaPage + 1));
      let response = res.data;
      let stateData = JSON.parse(JSON.stringify(this.state.data));
      stateData.qna.data = stateData.qna.data.concat(response.data);
      stateData.qna.total = response.total;
      if (response.last_page === this.state.qnaPage + 1) {
        this.setState((prevState) => ({
          data: stateData,
          qnaPage: prevState.qnaPage + 1,
          hasMoreQnA: false,
          loadQnA: false,
        }));
      } else {
        this.setState((prevState) => ({
          data: stateData,
          qnaPage: prevState.qnaPage + 1,
          hasMoreQnA: true,
          loadQnA: false,
        }));
      }
    }, 1);
  };
  fetchMoreReadingMaterial = async () => {
    this.setState({ loadReadingMaterial: true });
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    setTimeout(async () => {
      let res = await Get(
        0,
        "typesense_search_reading_materials?search=" + q + "&page=" + (this.state.readingMaterialPage + 1)
      );
      let response = res.data;
      let stateData = JSON.parse(JSON.stringify(this.state.data));
      stateData.reading_materials.data = stateData.reading_materials.data.concat(response.data);
      stateData.reading_materials.total = response.total;
      if (response.last_page === this.state.readingMaterialPage + 1) {
        this.setState((prevState) => ({
          data: stateData,
          readingMaterialPage: prevState.readingMaterialPage + 1,
          hasMoreReadingMaterial: false,
          loadReadingMaterial: false,
        }));
      } else {
        this.setState((prevState) => ({
          data: stateData,
          readingMaterialPage: prevState.readingMaterialPage + 1,
          hasMoreReadingMaterial: true,
          loadReadingMaterial: false,
        }));
      }
    }, 1);
  };
  handleFeaturesChange = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  };
  handleFiltersChange = async (e, type, id) => {
    this.setState({ [e.target.name]: e.target.checked, loadingOverlay: true });
    let topicIds = JSON.parse(JSON.stringify(this.state.topicIds));
    let levelIds = JSON.parse(JSON.stringify(this.state.levelIds));
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    if (type === "topic") {
      if (e.target.checked) {
        topicIds.push(id);
      } else {
        let index = topicIds.indexOf(id);
        topicIds.splice(index, 1);
      }

      let data = { search: q, topic_id: topicIds, course_level: levelIds };
      let res = await Get(0, "search", data);
      this.setState({ data: res.data.data, topicIds, loadingOverlay: false });
      window.scrollTo(0, 0);
    } else if (type === "level") {
      if (e.target.checked) {
        levelIds.push(id);
      } else {
        let index = levelIds.indexOf(id);
        levelIds.splice(index, 1);
      }

      let data = { search: q, topic_id: topicIds, course_level: levelIds };
      let res = await Get(0, "search", data);
      this.setState({ data: res.data.data, levelIds, loadingOverlay: false });
      window.scrollTo(0, 0);
    } else {
      this.setState({ loadingOverlay: false });
    }
  };

  render() {
    try {
      const { tabSelected, data, Courses, Videos, Notes, loadingOverlay, topics, showFiltersMobileView } = this.state;
      const { classes } = this.props;
      const query = new URLSearchParams(this.props.location.search);
      const q = query.get("q");

      return (
        <div className="search_root">
          <div className="search_top">
            <div className="home-search search_div" data-tut="search">
              <SearchInput searchSubmit={this.searchSubmit} q={this.state.q} />
            </div>
            <Tabs
              value={tabSelected}
              onChange={this.handleChange}
              className="search_tab_header"
              variant="scrollable"
              scrollButtons="off"
            >
              <Tab label={jsonData.tabs.all} value={0} />
              {Courses && <Tab label={jsonData.tabs.courses} value={1} />}
              {Videos && <Tab label={jsonData.tabs.videos} value={2} />}
              {Notes && <Tab label={jsonData.tabs.notes} value={3} />}
              {this.state["Reading Material"] && <Tab label={jsonData.tabs.pdf} value={4} />}
              {this.state["Q & A"] && <Tab label={jsonData.tabs.qa} value={5} />}
            </Tabs>
          </div>
          {this.state.loading ? (
            <div className="loader">
              <CircularProgress />
            </div>
          ) : (
            <div className="search_mid">
              <div className={"search_left " + (!showFiltersMobileView ? "filter_slide_in" : "")}>
                <Filters
                  handleFeaturesChange={this.handleFeaturesChange}
                  handleChange={this.handleFiltersChange}
                  state={this.state}
                  topics={topics}
                />
              </div>

              <div className="search_right">
                {showFiltersMobileView && (
                  <div
                    className="search_filter_overlay"
                    onClick={() => {
                      this.setState({ showFiltersMobileView: false });
                    }}
                  ></div>
                )}
                <div
                  className="search_filter_mobile"
                  onClick={() => {
                    this.setState({ showFiltersMobileView: true });
                  }}
                >
                  <img
                    src={require(`../../../../assets/images/icons/${jsonData.images.filterIcon}`)}
                    width="18"
                    height="16"
                    alt=""
                  ></img>
                  <h3>{jsonData.filter.filterBy}</h3>
                </div>
                <div className="filter_divider"></div>
                <TabPanel value={tabSelected} index={0}>
                  <div className="search_all">
                    {Courses && (
                      <>
                        <div className="s_h_c">
                          <SearchHeading title={jsonData.tabs.courses} data={data.courses} showExploreAll={true} />
                        </div>

                        {data.courses.data.length > 0 ? (
                          <div className="h_c_main search_course_card">
                            <CourseCard courses={data.courses.data} />
                          </div>
                        ) : (
                          <div className="search_video_cards" style={{ marginTop: "20px" }}>
                            <p className="search_no_results">{jsonData.results.notFound}</p>
                          </div>
                        )}
                      </>
                    )}
                    {Videos && (
                      <>
                        <div className={"s_h_v " + (!Courses ? "add_margin_top" : "")}>
                          <SearchHeading title={jsonData.tabs.videos} data={data.videos} showExploreAll={true} />
                        </div>
                        <div className="search_video_cards">
                          {this.state.askifyResults.length > 0 &&
                            this.state.askifyResults.map((e, i) => <AskifyCard data={e} key={i} index={i} />)}
                          {data.videos.final_response.length > 0 ? (
                            data.videos.final_response.map((e, i) => (
                              <VideoCard
                                data={e}
                                key={i}
                                index={i}
                                pauseAll={this.pauseAll}
                                pauseVideos={this.state.pauseVideos}
                                url={this.state.url}
                              />
                            ))
                          ) : (
                            <p className="search_no_results">{jsonData.results.notFound}</p>
                          )}
                        </div>
                        {this.state.hasMoreVideos &&
                          (this.state.loadVideos ? (
                            <div className="search_loader">
                              <CircularProgress size={22} />
                            </div>
                          ) : (
                            <div
                              className="search_show_more"
                              onClick={() => {
                                this.fetchMoreVideos();
                              }}
                            >
                              <p>{jsonData.results.showMore}</p>
                              <ExpandMoreIcon />
                            </div>
                          ))}
                      </>
                    )}
                    {Notes && (
                      <>
                        <div className="s_h_n">
                          <SearchHeading title={jsonData.tabs.notes} data={data.notes} showExploreAll={true} />
                        </div>
                        <div className="search_video_cards">
                          {data.notes.data.length > 0 ? (
                            data.notes.data.map((e, i) => <Note data={e} key={i} index={i} />)
                          ) : (
                            <p className="search_no_results">{jsonData.results.notFound}</p>
                          )}
                        </div>
                        {this.state.hasMoreNotes &&
                          (this.state.loadNotes ? (
                            <div className="search_loader">
                              <CircularProgress size={22} />
                            </div>
                          ) : (
                            <div
                              className="search_show_more"
                              onClick={() => {
                                this.fetchMoreNotes();
                              }}
                            >
                              <p>{jsonData.results.showMore}</p>
                              <ExpandMoreIcon />
                            </div>
                          ))}
                      </>
                    )}
                    {this.state["Reading Material"] && (
                      <>
                        <div className="s_h_n">
                          <SearchHeading
                            title={jsonData.tabs.pdf}
                            data={data.reading_materials}
                            showExploreAll={true}
                          />
                        </div>
                        <div className="search_video_cards">
                          {data.reading_materials.data.length > 0 ? (
                            data.reading_materials.data.map((e, i) => <ReadingMaterial data={e} key={i} index={i} />)
                          ) : (
                            <p className="search_no_results">{jsonData.results.notFound}</p>
                          )}
                        </div>
                        {this.state.hasMoreReadingMaterial &&
                          (this.state.loadReadingMaterial ? (
                            <div className="search_loader">
                              <CircularProgress size={22} />
                            </div>
                          ) : (
                            <div
                              className="search_show_more"
                              onClick={() => {
                                this.fetchMoreReadingMaterial();
                              }}
                            >
                              <p>{jsonData.results.showMore}</p>
                              <ExpandMoreIcon />
                            </div>
                          ))}
                      </>
                    )}
                    {this.state["Q & A"] && (
                      <>
                        <div className="s_h_n">
                          <SearchHeading title={jsonData.tabs.qa} data={data.qna} showExploreAll={true} />
                        </div>
                        <div className="search_video_cards">
                          {data.qna.data.length > 0 ? (
                            data.qna.data.map((e, i) => <QnA key={i} data={e} index={i} />)
                          ) : (
                            <p className="search_no_results">{jsonData.results.notFound}</p>
                          )}
                        </div>
                        {this.state.hasMoreQnA &&
                          (this.state.loadQnA ? (
                            <div className="search_loader">
                              <CircularProgress size={22} />
                            </div>
                          ) : (
                            <div
                              className="search_show_more"
                              onClick={() => {
                                this.fetchMoreQnA();
                              }}
                            >
                              <p>{jsonData.results.showMore}</p>
                              <ExpandMoreIcon />
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value={tabSelected} index={1}>
                  <div className="search_all">
                    <div className="s_h_c">
                      <SearchHeading title={jsonData.tabs.courses} data={data.courses} />
                    </div>

                    {data.courses.data.length > 0 ? (
                      <InfiniteScroll
                        dataLength={data.courses.data.length}
                        next={this.fetchMoreCourses}
                        hasMore={this.state.hasMoreCourses}
                        loader={
                          <div className="search_loader">
                            <CircularProgress size={22} />
                          </div>
                        }
                      >
                        <div className="search_courses">
                          {data.courses.data.map((ele, i) => (
                            <Content
                              key={i}
                              course={ele}
                              image_url={
                                ele.image_url
                                  ? ele.image_url
                                  : "https://api.beyondexams.org/images/category_default_image.jpeg"
                              }
                              title={ele.title}
                              num_categories={ele.num_categories}
                              video_count={ele.video_count}
                              level={ele.level}
                              id={ele.id}
                              type={parseInt(ele.type)}
                              slug={ele.slug}
                              onRedirect={(e) => {
                                e.stopPropagation();
                                if (ele.num_categories) {
                                  this.props.history.push(
                                    `/dashboard/browse?level=${ele.level + 1}&parent=${ele.id}&type=${
                                      ele.type === "1" ? "classes" : "topics"
                                    }`
                                  );
                                } else {
                                  this.props.history.push(`/dashboard/course/${encodeURIComponent(ele.slug)}`);
                                }
                              }}
                            />
                          ))}
                        </div>
                      </InfiniteScroll>
                    ) : (
                      <div className="search_video_cards" style={{ marginTop: "20px" }}>
                        <p className="search_no_results">{jsonData.results.notFound}</p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value={tabSelected} index={2}>
                  <div className="search_all">
                    <div className="s_h_n">
                      <SearchHeading title={jsonData.tabs.videos} data={data.videos} />
                    </div>
                    {this.state.askifyResults.length > 0 &&
                      this.state.askifyResults.map((e, i) => (
                        <div className="search_video_cards">
                          <AskifyCard data={e} key={i} index={i} />
                        </div>
                      ))}
                    {data.videos.final_response.length > 0 ? (
                      <InfiniteScroll
                        dataLength={data.videos.final_response.length}
                        next={this.fetchMoreVideos}
                        hasMore={this.state.hasMoreVideos}
                        loader={
                          <div className="search_loader">
                            <CircularProgress size={22} />
                          </div>
                        }
                      >
                        {data.videos.final_response.map((e, i) => (
                          <div className="search_video_cards">
                            <VideoCard
                              data={e}
                              key={i}
                              index={i}
                              pauseAll={this.pauseAll}
                              pauseVideos={this.state.pauseVideos}
                              url={this.state.url}
                            />
                          </div>
                        ))}
                      </InfiniteScroll>
                    ) : (
                      <div className="search_video_cards">
                        <p className="search_no_results">{jsonData.results.notFound}</p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value={tabSelected} index={3}>
                  <div className="search_all">
                    <div className="s_h_n">
                      <SearchHeading title={jsonData.tabs.notes} data={data.notes} />
                    </div>

                    {data.notes.data.length > 0 ? (
                      <InfiniteScroll
                        dataLength={data.notes.data.length}
                        next={this.fetchMoreNotes}
                        hasMore={this.state.hasMoreNotes}
                        loader={
                          <div className="search_loader">
                            <CircularProgress size={22} />
                          </div>
                        }
                      >
                        <div className="search_video_cards">
                          {data.notes.data.map((e, i) => (
                            <Note data={e} key={i} index={i} />
                          ))}
                        </div>
                      </InfiniteScroll>
                    ) : (
                      <div className="search_video_cards">
                        <p className="search_no_results">{jsonData.results.notFound}</p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value={tabSelected} index={4}>
                  <div className="search_all">
                    <div className="s_h_n">
                      <SearchHeading title={jsonData.tabs.pdf} data={data.reading_materials} />
                    </div>
                    <div className="search_video_cards">
                      {data.reading_materials.data.length > 0 ? (
                        data.reading_materials.data.map((e, i) => <ReadingMaterial data={e} key={i} index={i} />)
                      ) : (
                        <p className="search_no_results">{jsonData.results.notFound}</p>
                      )}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value={tabSelected} index={5}>
                  <div className="search_all">
                    <div className="s_h_n">
                      <SearchHeading title={jsonData.tabs.qa} data={data.qna} />
                    </div>
                    <div className="search_video_cards">
                      {data.qna.data.length > 0 ? (
                        data.qna.data.map((e, i) => <QnA key={i} data={e} index={i} />)
                      ) : (
                        <p className="search_no_results">{jsonData.results.notFound}</p>
                      )}
                    </div>
                  </div>
                </TabPanel>
              </div>
            </div>
          )}
          <Backdrop className={classes.backdrop} open={loadingOverlay}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      );
    } catch (e) {
      swal("OOPS some error occurred!", "We will fix this soon.", "warning");
      Post(0, "save_error_log", { subject: e.message, error_log: e.stack });
      return <></>;
    }
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    value === index && (
      <div
        // role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        {...other}
      >
        <>{children}</>
      </div>
    )
  );
}

const mapStatesToProps = (state) => {
  return {
    bestCourses: state.browse.bestCourses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBestCourses: () => dispatch(getBestCourses()),
  };
};

const useStyles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#fff",
  },
});
export default connect(mapStatesToProps, mapDispatchToProps)(withStyles(useStyles)(Search));
