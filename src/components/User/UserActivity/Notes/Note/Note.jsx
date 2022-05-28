import React from "react";
import UpArrow from "../../../../../assets/images/icons/upvote.svg";
import DownArrow from "../../../../../assets/images/icons/downvote.svg";
import "./Note.css";

const Note = ({ note }) => {
  const formatTime = (secs) => {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    return [hours, minutes, seconds]
      .map((v) => ("" + v).padStart(2, "0"))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <div className="note_flex align_top note_container">
      <div className="note_time">{formatTime(note?.video_timestamp ?? 0)}</div>
      <div>
        <p className="note_text">
          {note.annotation}
          <span>2d</span>
        </p>
        {/* <div className="note_flex vote_container">
          <img src={UpArrow} />
          <p>323</p>
          <img src={DownArrow} />
        </div> */}
        <p className="details">{note?.video?.title}</p>
        {/* <div className="note_flex">
          <p className="details">Geography</p>
          <div className="note_dot"></div>
          <p className="details">Module 1</p>
        </div> */}
      </div>
    </div>
  );
};

export default Note;
