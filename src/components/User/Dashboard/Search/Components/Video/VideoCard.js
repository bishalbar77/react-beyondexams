import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Like from "../../../../../../assets/images/icons/like.png";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { Link } from "react-router-dom";
import { renderDate } from "../../../Browse/CourseCard";
import { Format } from "../../../../../common/videocommon";
import YouTube from "react-youtube";
import "./videocard.css";

export default class VideoCard extends Component {
  constructor(props) {
    super(props);
    this.player = React.createRef();
  }
  state = {
    showPlayer: false,
    ready: false,
    fetchPlayer: false,
    hover: false,
  };
  handleHover = async () => {
    this.setState({ hover: true });
    if (this.state.ready) {
      this.player.current.internalPlayer.playVideo();
      setTimeout(() => {
        this.setState({ showPlayer: true });
      }, 400);
      this.props.pauseAll(this.props.data.url);
    }
  };

  handleMouseLeave = async () => {
    this.setState({ hover: false });
    if (this.state.ready) {
      setTimeout(() => {
        this.setState({ showPlayer: false });
        this.player.current.internalPlayer.pauseVideo();
      }, 400);
    }
  };
  fetchVideoPlayer = async () => {
    this.props.pauseAll(this.props.data.url);
    this.setState({ hover: true, fetchPlayer: true });
  };
  onReady = async (event) => {
    this.setState({ ready: true });
    if (this.state.hover) {
      event.target.playVideo();
      setTimeout(() => {
        this.setState({ showPlayer: true });
      }, 400);
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.url !== this.props.url) {
      if (this.props.pauseVideos) {
        if (this.state.fetchPlayer) {
          if (this.props.url !== this.props.data.url) await this.player.current.internalPlayer.pauseVideo();
          this.setState({ showPlayer: false });
        }
      }
    }
  };
  render() {
    const { data } = this.props;
    const { showPlayer, ready, hover, fetchPlayer } = this.state;
    const opts = { playerVars: { enablejsapi: 1, autoplay: 0, controls: 0, fs: 0, rel: 0, mute: 1 } };
    const query = new URLSearchParams(window.location.search);
    const q = query.get("q");
    return (
      <div
        className="video_card"
        onMouseEnter={() => {
          fetchPlayer ? this.handleHover() : this.fetchVideoPlayer();
        }}
        onMouseLeave={() => {
          this.handleMouseLeave();
        }}
        onTouchStart={() => {
          fetchPlayer ? this.handleHover() : this.fetchVideoPlayer();
        }}
      >
        <Link to={"/dashboard/videos/" + data.url + "?q=" + q} className="flex-grow">
          <div className="video_card_left">
            <div className="video_card_left_img">
              {fetchPlayer && (
                <div className="ui embed">
                  <YouTube
                    ref={this.player}
                    opts={opts}
                    key={data.url}
                    videoId={data.url}
                    id="myFrame"
                    onReady={this.onReady}
                  />
                </div>
              )}
              <img
                src={data.thumbnails}
                alt=""
                style={{
                  opacity: showPlayer && ready ? 0 : 1,
                  position: showPlayer || fetchPlayer ? "absolute" : "relative",
                }}
              />
            </div>
            <div className="video_card_main">
              <h4>
                {String(data.title)
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              </h4>
              <p>{data.channelTitle}</p>
              <div className="video_card_details">
                <div className="video_card_rating">
                  <img src={Like} width="14" height="14" alt=""></img>
                  <p className="video_card_p">{Format(data.likes_count)}</p>
                </div>
                <div className="video_card_circle" />
                <div className="video_card_views">
                  <VisibilityOutlinedIcon />
                  <p className="video_card_p">{data.total_view}</p>
                </div>
                <div className="video_card_circle" />
                <p className="video_card_p">{renderDate(data.updated_at)}</p>
              </div>
            </div>
          </div>
        </Link>
        <div className="video_card_right">
          <div className="video_card_dots">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}
