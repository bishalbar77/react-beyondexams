import React from "react";
import FilterImg from "../../../../assets/images/images/filterImg.jpg";
import { ReactComponent as EndorseTick } from "../../../../assets/images/icons/endorse_tick.svg";
import CoursePopper from "./CoursePopper";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export const renderDate = (updated_at) => {
  let date1 = new Date(updated_at);
  const date2 = new Date();
  let diffTime = Math.floor((date2 - date1) / 1000);
  if (diffTime < 60) {
    return diffTime === 1 ? `${diffTime} second ago` : `${diffTime} seconds ago`;
  } else if (diffTime < 60 * 60) {
    diffTime = Math.floor(diffTime / 60);
    return diffTime === 1 ? `${diffTime} minute ago` : `${diffTime} minutes ago`;
  } else if (diffTime < 60 * 60 * 24) {
    diffTime = Math.floor(diffTime / (60 * 60));
    return diffTime === 1 ? `${diffTime} hour ago` : `${diffTime} hours ago`;
  } else if (diffTime < 60 * 60 * 24 * 30) {
    diffTime = Math.floor(diffTime / (60 * 60 * 24));
    return diffTime === 1 ? `${diffTime} day ago` : `${diffTime} days ago`;
  } else if (diffTime < 60 * 60 * 24 * 30 * 12) {
    diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30));
    return diffTime === 1 ? `${diffTime} month ago` : `${diffTime} months ago`;
  } else {
    diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
    return diffTime === 1 ? `${diffTime} year ago` : `${diffTime} years ago`;
  }
};
const useStyles = makeStyles((theme) => ({
  endorseTick: {
    color: "var(--color3)",
    marginLeft: "8px",
    width: "20px",
    height: "20px",
    minWidth: "20px",
    minHeight: "20px",
    fill: "currentColor",
    verticalAlign: "middle",
  },
}));

const CourseCard = (props) => {
  const classes = useStyles();
  const e = props.course;

  const renderText = () => {
    if (props.type === 1) {
      return e.num_categories ? e.num_categories + " Courses" : e.video_count + " videos";
    } else {
      return e.num_topics > 0 ? e.num_topics + " Courses" : e.video_count + " videos";
    }
  };

  if (props.course == undefined) return null;
  const handleClick = (event) => {
    event.stopPropagation();
    if (e.is_playlist === 1) {
      window.open("https://www.youtube.com/channel/" + e.channel?.channel_id, "_blank").focus();
    } else {
      props.openProfile(event, e.creator?.slug);
    }
  };

  return (
    <div
      className={`studentCourseCardContainer ${props.class}`}
      style={!props.isActive ? { backgroundColor: "#f0f0f0" } : null}
      onClick={(event) => {
        event.stopPropagation();
        if (props.isActive) props.redirect(event, e.level + 1, e.id, e.slug, e?.video_count, e.num_categories);
      }}
    >
      <div
        className={`LeftContainerBox studentCardImage`}
        style={{
          backgroundImage: `url(${e?.image_url ? e.image_url : FilterImg})`,
          filter: `grayscale(${props.isActive ? "0" : "1"})`,
        }}
      ></div>

      {e?.user_actions?.length > 0 && (
        <div className="juiceContainer">
          <div className="juice" style={{ width: e.user_actions[0].pivot.progress + "%" }}></div>
        </div>
      )}
      <div className="studentDetailsRow">
        <div
          style={{
            flex: "1 1 0",
            minWidth: 0,
          }}
        >
          <div className="studentCardTitleDiv">
            <div className="studentCardTitle" title={e.title}>
              {e.title}
            </div>
            {e.num_endorsements > 0 && (
              <Tooltip
                title={
                  <div className="endorsed_text">
                    {e.num_endorsements + " " + (e.num_endorsements > 1 ? "experts " : "expert ")}
                    <strong>endorsed </strong>
                    this course.
                  </div>
                }
                arrow
                enterTouchDelay={1}
              >
                <EndorseTick className={classes.endorseTick} />
              </Tooltip>
            )}
          </div>
          <div className="studentCardDescription" title={props.isActive ? e.description ?? "" : "Coming soon..."}>
            {props.isActive ? e.description ?? "" : "Coming soon..."}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <CoursePopper course={e} />
        </div>
      </div>

      <div className="card-course-details">{renderText()}</div>

      <div className={`card-post-details ${props.bottomClass}`}>
        <div className="course-info">
          {renderDate(e.updated_at)} <br />
          {e.total_views > 0 ? e.total_views + " views" : ""}
        </div>
        <div onClick={handleClick}>
          <div className="card-image-border">
            <img
              className="course-card-browse-profile-img"
              src={e.is_playlist === 1 ? e.channel?.avatar : e.creator?.avatar}
              alt="browse-profile"
              style={!props.isActive ? { filter: "grayscale(1)" } : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
