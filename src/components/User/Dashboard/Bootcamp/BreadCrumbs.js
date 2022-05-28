import React from "react";
import RightArrow2 from "../../../../assets/images/icons/right-arrow2.svg";
import { Link } from "react-router-dom";

const BreadCrumbs = (props) => {
  return (
    <div className="bread-crumbs courseBreadcrumbs">
      <div className="bread-crumb-item">
        <Link to={`/dashboard/browse?level=1&parent=0&type=${props.type === "0" ? "topics" : "classes"}`}>
          <div style={{ color: "#686868" }}>Explore by {props.type === "0" ? "topics" : "classes"}</div>
        </Link>
        <img src={RightArrow2} alt="" />
      </div>
      {props.breadCrumbs.map((e, i) => {
        return (
          <div
            key={i}
            className="bread-crumb-item"
            onClick={(event) => props.redirect(event, e.level + 1, e.id, e.slug, e.video_count, e.num_categories)}
          >
            <div style={i === props.breadCrumbs.length - 1 ? { color: "#6646E7" } : null}>{e.title}</div>

            {i !== props.breadCrumbs.length - 1 ? <img src={RightArrow2} alt="" /> : <></>}
          </div>
        );
      })}
      <div className="bread-crumb-item">
        <div style={{ color: "#6646E7" }}>{props.courseTitle}</div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
