import React, { Component } from "react";
import { Link } from "react-router-dom";
import { renderDate } from "../../../Browse/CourseCard";
import "./qna.css";

var jsonData = require("../../search.json");

export default class ReadingMaterial extends Component {
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

  render() {
    const { data, index } = this.props;
    const query = new URLSearchParams(window.location.search);
    const q = query.get("q");

    return (
      <div className="flex">
        <div className="notes_list">
          <div className="notes-list-left clear-img">
            <Link to={"/dashboard/profile/" + data.user.slug}>
              <div className={"note_profile_image_two " + this.borderBottom(index)}>
                <img alt="" src={data.user.avatar} />
              </div>
            </Link>
          </div>

          <Link
            to={
              "/dashboard/videos/" + data.video.url + "?q=" + encodeURIComponent(q) + "&qna_slug=" + data.id + "&tab=3"
            }
            className="flex-grow"
          >
            <div className="notes-list-right">
              <div className="note-head">
                <h6 className="">{data.user.name}</h6>
                <div className="video_card_circle" />
                <p>{renderDate(data.updated_at)} </p>
              </div>
              <div className="qna-mid">
                <h3>{data.title}</h3>
                <h5>{data.answers[0]?.title}</h5>
                <p>
                  {jsonData.results.answer} <span>({data.answers.length})</span>
                </p>
              </div>
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
