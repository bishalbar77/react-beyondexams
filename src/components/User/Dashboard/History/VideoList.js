import React, { Component } from "react";
import VideoItem from "./VideoItem";

class VideoList extends Component {
  render() {
    const renderedVideos =
      this.props.videos.length > 0 ? (
        this.props.videos.map((video, index) => {
          return (
            <VideoItem
              key={index}
              video={video}
              handleVideoSelect={this.props.handleVideoSelect}
            />
          );
        })
      ) : (
        <h3 className="history-heading">No Recently Watched Videos.</h3>
      );

    return <div className="ui relaxed divided list">{renderedVideos}</div>;
  }
}

export default VideoList;
