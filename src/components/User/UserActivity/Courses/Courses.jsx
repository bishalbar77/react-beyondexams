import React from "react";
import CourseCard from "../../../Home/Tabs";
import { Content } from "../../../Home/Tabs";
import "./Courses.css";
import { useHistory } from "react-router-dom";

const Courses = ({ courses }) => {
  const history = new useHistory();

  const redirect = (event, level, parent, slug, video_count, categories, type) => {
    event.stopPropagation();
    if (type === "classes") {
      if (!categories && !video_count && level <= 2) {
        history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        history.push(`/dashboard/course/${encodeURIComponent(slug)}?type=${type}`);
      } else history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    } else {
      if (categories === undefined) history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      else if (!categories && !video_count && level <= 2) {
        history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
      } else if (video_count >= 0 && !categories) {
        history.push(`/dashboard/course${encodeURIComponent(slug)}?type=${type}`);
      } else history.push(`/dashboard/browse?level=${level}&parent=${parent}&type=${type}`);
    }
  };

  return (
    <>
      <div className="course_container">
        {courses.map((e) => (
          <Content
            classes={"l0_card"}
            style={{ margin: "15px 0" }}
            {...e}
            key={e.id}
            type={0}
            course={e}
            onRedirect={(event) => {
              redirect(event, e.level + 1, e.id, e.slug, e?.video_count, e.num_categories);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Courses;
