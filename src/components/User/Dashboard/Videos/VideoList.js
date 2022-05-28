import React, { Component } from "react";
import VideoItem from "./VideoItem";

export default class VideoList extends Component {
  render() {
    return (
      <div className="list video-list">
        {this.props.videos.map((video, index) => (
          <VideoItem
            key={index}
            color={this.props.color}
            video={video}
            handleVideoSelect={this.props.handleVideoSelect}
            selectedVideo={this.props.selectedVideo}
            index={index}
            duration={this.props.duration}
            askifyLength={this.props.askifyLength}
            removeVideo={this.props.removeVideo}
            updateVideoList={this.props.updateVideoList}
            parentId={this.props.parentId}
          />
        ))}
      </div>
    );
  }
}
