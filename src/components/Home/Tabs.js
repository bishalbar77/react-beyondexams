import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import cx from "classnames";
import React from "react";
import { useHistory } from "react-router-dom";
import CoursePopper from "../User/Dashboard/Browse/CoursePopper";
import FilterImg from "../../assets/images/images/filterImg.jpg";

const HomeTabs = (props) => {
  const history = new useHistory();
  return (
    <Tabs variant="scrollable" value={false} scrollButtons="on" textColor="primary">
      {props.courses.map((ele, i) => (
        <Tab
          key={i}
          label={
            <Content
              course={ele}
              image_url={
                ele.image_url ? ele.image_url : "https://api.beyondexams.org/images/category_default_image.jpeg"
              }
              title={ele.title}
              num_categories={ele.num_categories}
              video_count={ele.video_count}
              level={ele.level}
              id={ele.id}
              type={parseInt(ele.type)}
              slug={ele.slug}
              onRedirect={(e) => {
                e.stopPropagation();
                if (props.slug) {
                  history.push(`${props.slug}`);
                  return;
                }
                if (ele.num_categories) {
                  history.push(
                    `/dashboard/browse?level=${ele.level + 1}&parent=${ele.id}&type=${
                      ele.type === "1" ? "classes" : "topics"
                    }`
                  );
                } else {
                  history.push(`/dashboard/course/${encodeURIComponent(ele.slug)}`);
                }
              }}
            />
          }
          component="div"
          disableRipple
        />
      ))}
    </Tabs>
  );
};
export default HomeTabs;

export const Content = ({
  image_url,
  title,
  num_categories,
  video_count,
  onRedirect,
  course,
  style,
  classes,
  type,
}) => {
  const renderText = () => {
    if (type === 1) {
      return num_categories ? num_categories + " Courses" : video_count + " videos";
    } else {
      return course.num_topics > 0 ? course.num_topics + " Courses" : course.video_count + " videos";
    }
  };
  return (
    <div className={cx("h_c_card", classes)} onClick={onRedirect} style={style} data-tut="class">
      <div className={`h_c_card_top`} style={{ backgroundImage: `url(${image_url ? image_url : FilterImg})` }}></div>
      <div className="h_c_card_mid">
        <p title={title}>{title}</p>
        <CoursePopper course={course} />
      </div>
      <div className="h_c_card_b">
        <p>{renderText()}</p>
      </div>
    </div>
  );
};
