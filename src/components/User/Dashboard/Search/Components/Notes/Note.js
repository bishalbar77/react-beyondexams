import React, { Component } from "react";
import { Link } from "react-router-dom";
import { renderDate } from "../../../Browse/CourseCard";
import "./note.css";

export default class Note extends Component {
  bgColor = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "bg-color-blue";
    } else if (num === 1) {
      return "bg-color-green";
    } else if (num === 2) {
      return "bg-color-yellow";
    }
  };
  borderBottom = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "border-bottom-blue";
    } else if (num === 1) {
      return "border-bottom-green";
    } else if (num === 2) {
      return "border-bottom-yellow";
    }
  };

  formatTime(secs) {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    return [hours, minutes, seconds]
      .map((v) => ("" + v).padStart(2, "0"))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }

  render() {
    const { data, index } = this.props;
    const query = new URLSearchParams(window.location.search);
    const q = query.get("q");
    return (
      <div className="flex">
        <div className="notes_list">
          <div className="notes-list-left">
            <Link to={"/dashboard/profile/" + data.user.slug}>
              <div className={"note_profile_image_two " + this.borderBottom(index)}>
                <img alt="" src={data.user.avatar} />
              </div>
            </Link>
            <Link
              to={
                "/dashboard/videos/" +
                data.video.url +
                "?q=" +
                encodeURIComponent(q) +
                "&note_slug=" +
                data.id +
                "&tab=1"
              }
            >
              <p className={"note_time " + this.bgColor(index)}>{this.formatTime(data.video_timestamp)}</p>
            </Link>
          </div>
          <Link
            to={
              "/dashboard/videos/" + data.video.url + "?q=" + encodeURIComponent(q) + "&note_slug=" + data.id + "&tab=1"
            }
            className="flex-grow"
          >
            <div className="notes-list-right">
              <div className="note-head">
                <h6 className="">{data.user.name}</h6>
                <div className="video_card_circle" />
                <p>{renderDate(data.updated_at)} </p>
              </div>
              <div className="note-mid">{data.annotation}</div>
              {/* <div className="note-bottom">
              Introduction to geography
            </div> */}
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
