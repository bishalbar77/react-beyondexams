import React, { Component } from "react";
import "../../../../assets/css/User/Dashboard/videos.css";
import Footer from "../../../common/Footer";
import { GetHistory } from "../../../common/videocommon";
import "../../../../assets/css/User/Dashboard/history.css";
import VideoList from "./VideoList";
import swal from "sweetalert";
import { getLocal } from "../../../common/localStorageAccess";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@material-ui/core";
import MetaHelmet from "../../../common/MetaHelmet";
import Matomo from "../../../common/Matomo";

var last_page;
var current_page;
export default class History extends Component {
  state = {
    videos: null,
    hasMore: true,
  };
  componentDidMount = async () => {
    window.scrollTo(0, 0);
    let access = getLocal("access_token");
    if (!access) {
      swal("Watch history is not available when signed out", "Sign-in to continue", "info", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          this.props.history.push("/login");
        } else {
          this.props.history.push("/dashboard");
        }
      });
    } else {
      current_page = 1;
      const getHistory = await GetHistory(current_page);
      console.log(getHistory);
      current_page = current_page + 1;
      last_page = getHistory.last_page;
      if (last_page === 1) this.setState({ hasMore: false });
      if (getHistory.data.length) {
        this.setState({
          videos: getHistory.data,
        });
      } else {
        this.setState({ videos: [] });
      }
    }
  };

  fetchMoreData = async () => {
    const getHistory = await GetHistory(current_page);
    if (current_page === last_page) {
      this.setState({ hasMore: false });
    }
    current_page = current_page + 1;
    this.setState({
      videos: this.state.videos.concat(getHistory.data),
    });
  };
  handleVideoSelect = (video) => {
    this.props.history.push(
      "/dashboard/videos/" + video.url + "?q=" + encodeURIComponent(video.channelTitle).replace(/%20/g, "+")
    );
  };
  render() {
    return (
      <Matomo pageTitle="History">
        <div className="history-outer-div">
          <MetaHelmet
            title="BeyondExams"
            description="Best educational videos on your fingertips. Start learning now!"
          />
          <div className="history-video-box">
            <div className="history-root">
              <h1 className="history-heading">Watch History</h1>
              <div className="history-video-list">
                {this.state.videos ? (
                  <InfiniteScroll
                    dataLength={this.state.videos.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    // loader={<Loader />}
                    // height={500}
                    endMessage={
                      this.state.videos.length > 10 && (
                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                          <b>No more watched videos!</b>
                        </p>
                      )
                    }
                  >
                    <VideoList videos={this.state.videos} handleVideoSelect={this.handleVideoSelect} />
                  </InfiniteScroll>
                ) : (
                  <div className="loader">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </Matomo>
    );
  }
}
