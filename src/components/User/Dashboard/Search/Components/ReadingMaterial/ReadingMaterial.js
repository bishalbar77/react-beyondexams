import React, { Component } from "react";
import { Link } from "react-router-dom";
import Group203 from "../../../../../../assets/images/icons/Group203.png";
import { renderDate } from "../../../Browse/CourseCard";
import moment from "moment";
import "./readingmaterial.css";

export default class ReadingMaterial extends Component {
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
              "/dashboard/videos/" + data.video.url + "?q=" + encodeURIComponent(q) + "&rm_slug=" + data.id + "&tab=2"
            }
            className="flex-grow"
          >
            <div className="notes-list-right">
              <div className="note-head">
                <h6 className="">{data.user.name}</h6>
                {/* <div className="video_card_circle" />
                <p>{renderDate(data.updated_at)} </p> */}
              </div>
              <div className="reading-mid">
                <div className={"r-l " + this.bgColor(index)}>
                  <img src={Group203} alt="" width={20} height={25}></img>
                </div>
                <div className="r-m">
                  <h6>{data.title}</h6>
                  {/* {data.size && <p className="reading-text">{data.size}</p>} */}
                  <p className="reading-text">{renderDate(data.updated_at)} </p>
                </div>
                <div className="r-r">
                  <p className="reading-text">{moment(data.created_at).format("DD/MM/YYYY")}</p>
                  <p className="reading-text">{data.type}</p>
                </div>
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
