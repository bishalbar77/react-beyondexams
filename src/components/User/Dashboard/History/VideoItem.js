import React from "react";
import { VideoDate } from "../../../common/videocommon.js";

const VideoItem = ({ video, handleVideoSelect }) => {
  return (
    <div onClick={() => handleVideoSelect(video)} className="item video-item">
      <img className="ui image" src={video.thumbnails} alt="" />
      <div className="content">
        <div className="headerText">
          {String(video.title)
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, "'")}
        </div>
        <div className="description">{video.channelTitle}</div>
        <div className="description">{VideoDate(video.publishedAt)}</div>
      </div>
    </div>
  );
};
export default VideoItem;
