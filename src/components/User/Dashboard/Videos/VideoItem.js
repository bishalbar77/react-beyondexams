import React from "react";
import { VideoDate } from "../../../common/videocommon.js";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../../common/baseDomain";

const VideoItem = ({
  video,
  handleVideoSelect,
  index,
  duration,
  color,
  askifyLength,
  parentId,
  removeVideo,
  updateVideoList,
  selectedVideo,
  reference,
}) => {
  const submitRemove = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/remove_video_from_learning_path`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: parentId,
        video_url: video.url,
      },
    })
      .then(() => {
        swal("Success", "Video removed successfully", "success");
        updateVideoList();
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
        return;
      });
  };

  return (
    <div className="flex">
      <div
        onClick={(e) => handleVideoSelect(e, video, index)}
        className={
          color
            ? selectedVideo.url === video.url
              ? "item video-item video-list-color relative"
              : "item video-item relative"
            : "item video-item relative"
        }
      >
        <div className="video-list-img">
          <img className="ui image" src={video.thumbnails} alt="" />
          {/* {duration && <div className="duration">{duration[index]}</div>} */}
        </div>

        <div className="content" style={{ marginTop: "5px" }}>
          <div className="headerText">
            {String(video.title)
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, "'")}
          </div>
          <div ref={reference} className="description">
            {video.channelTitle}
          </div>
          <div
            className="description video-list-flex-row"
            style={{ marginTop: !(askifyLength > index) ? "0" : "" }}
          >
            {VideoDate(video.publishedAt)}
            {askifyLength > index && (
              <Button
                style={{ fontSize: "11px", color: "#6646e7" }}
                onClick={(e) => handleVideoSelect(e, video, index, 1)}
                // 1 for autoplaying askify video
              >
                Go to Answer
              </Button>
            )}
          </div>
        </div>
      </div>
      {removeVideo && (
        <IconButton onClick={submitRemove}>
          <CloseIcon style={{ color: "black" }} fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};
export default VideoItem;
