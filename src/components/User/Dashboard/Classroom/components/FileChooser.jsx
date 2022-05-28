import React, { Component } from "react";
import ImageImg from "../../../../../assets/images/icons/image.svg";
import VideoImg from "../../../../../assets/images/icons/video.svg";
import MusicImg from "../../../../../assets/images/icons/music.svg";
import FileImg from "../../../../../assets/images/icons/pdf.svg";

class FileChooser extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="file-type-chooser">
          <div
            className="file-close-btn"
            onClick={() => this.props.handleFileType("", 0)}
          >
            {" "}
            &times;{" "}
          </div>
          <div className="file-type-chooser-container">
            <div
              className="file-type-choose-inner"
              onClick={() => this.props.handleFileType("image/*", 2)}
            >
              <img src={ImageImg} alt="jpg" />
              <div>Image</div>
            </div>
            <div
              className="file-type-choose-inner"
              onClick={() => this.props.handleFileType("video/*", 2)}
            >
              <img src={VideoImg} alt="mp4" />
              <div>Video</div>
            </div>
            <div
              className="file-type-choose-inner"
              onClick={() => this.props.handleFileType("audio/*", 2)}
            >
              <img src={MusicImg} alt="mp3" />
              <div>Audio</div>
            </div>
            <div
              className="file-type-choose-inner"
              onClick={() => this.props.handleFileType(".doc,.docx,.pdf", 2)}
            >
              <img src={FileImg} alt="pdf" />
              <div>Pdf/docs</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FileChooser;
