import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Like from "../../../../../../assets/images/icons/like.png";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { Link } from "react-router-dom";
import { renderDate } from "../../../Browse/CourseCard";
import { Format } from "../../../../../common/videocommon";

export default class AskifyCard extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div className="video_card">
        <Link
          to={
            "/dashboard/videos/" +
            data.videoDetails[0].url +
            "?q=" +
            encodeURIComponent(new URLSearchParams(window.location.search).get("q")).replace(/%20/g, "+") +
            "&start=" +
            Math.trunc(data.startTime / 1000) +
            "&autoPlay=1"
          }
          className="flex-grow"
        >
          <div className="video_card_left">
            <div className="video_card_left_img">
              <img src={data.videoDetails[0].thumbnails} alt=""></img>
            </div>
            <div className="video_card_main">
              <h4>
                {String(data.videoDetails[0].title)
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              </h4>
              <p>{data.videoDetails[0].channelTitle}</p>
              <div className="video_card_details">
                <div className="video_card_rating">
                  <img src={Like} width="14" height="14" alt=""></img>
                  <p className="video_card_p">{Format(data.videoDetails[0].likes_count)}</p>
                </div>
                <div className="video_card_circle" />
                <div className="video_card_views">
                  <VisibilityOutlinedIcon />
                  <p className="video_card_p">{data.videoDetails[0].total_view}</p>
                </div>
                <div className="video_card_circle" />
                <p className="video_card_p">{renderDate(data.videoDetails[0].updated_at)}</p>
              </div>
              <div className="video_card_answer_btn">
                <Link
                  to={
                    "/dashboard/videos/" +
                    data.videoDetails[0].url +
                    "?q=" +
                    encodeURIComponent(new URLSearchParams(window.location.search).get("q")).replace(/%20/g, "+") +
                    "&start=" +
                    Math.trunc(data.startTime / 1000) +
                    "&autoPlay=1"
                  }
                >
                  Go to answer
                </Link>
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
