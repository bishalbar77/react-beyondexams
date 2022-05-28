import React from "react";
import {
  FormControlLabel,
} from "@material-ui/core";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import baseDomain from "../../components/common/baseDomain";
import axios from "axios";
import swal from "sweetalert";

function  ListUnit({
  name,
  img,
  courses,
  slug,
  index,
  user,
  user_slug,
  creator,
  creator_slug,
  educatorDetail,
  studentDetail,
  lastActive,
  certificate_link,
  rating,
  progress,
  num_videos,
  projects_count,
}) {
  const [color, setColor] = React.useState(null);
  const handleDisable = (slug) => {
    // console.log("enroll");
    
      let url = `${baseDomain.route}${baseDomain.subRoute}/update_category_visibility?slug=${slug}`;
      var actionButton = document.getElementById(slug);
      if(actionButton.innerText == "Disable") {
        actionButton.innerText ="Active";
        actionButton.className = 'unenrollBtn';
      } else {
        actionButton.innerText ="Disable";
        actionButton.className = 'enrollBtn';
      }
      axios({
        url: url,
        method: "POST",
      })
        .then((response) => {
          swal("Success!!", "Course updated successfully", "success");
        })
        .catch((error) => {
          swal("Oopss!!", "Something went wrong", "error");
        });
  };
  React.useEffect(() => {
    if (index + 1 === 1)
      setColor(["u-text--dark", "u-bg--yellow", "u-text--yellow"]);
    if (index + 1 === 2)
      setColor(["u-text--dark", "u-bg--teal", "u-text--teal"]);
    if (index + 1 === 3)
      setColor(["u-text--dark", "u-bg--orange", "u-text--orange"]);
  }, []);

  function getTime() {
    const date1 = new Date(lastActive.split(" ")[0]);
    const date2 = new Date();
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );
    if (Difference_In_Days === 0) return "today";
    if (Difference_In_Days === 1) return "yesterday";
    return `${Difference_In_Days} days ago`;
  }

  // const randomEmoji = () => {
  //   const emojis = ['👏','👍','🙌','🤩','💯'];
  //   if(index+1 === 1) return '🏆'
  //   if(index+1 === 2) return '🔥'
  //   if(index+1 === 3) return '⭐️'
  //   let randomNumber = Math.floor(Math.random() * emojis.length);
  //   return emojis[randomNumber]
  // }

  return (
    <li>
      <div className="c-list__grid">
        <div className="c-media">
          <div className="c-media__content">
            <Link
              to={{
                pathname: `/dashboard/profile/${creator_slug}`,
              }}
              className="c-media__link u-text--small"
            >
              {/* <a
                className="c-media__link u-text--small"
                href="#"
                target="_blank"
              > */}
              {creator}
              {/* <p>{title}</p> */}
              {/* </a> */}
            </Link>
          </div>
        </div>
        <div className="c-media">
          <div className="c-media__content">
            <Link
              to={{
                pathname: `/dashboard/course/${slug}`,
              }}
              className="c-media__link u-text--small"
            >
              {/* <a
                className="c-media__link u-text--small"
                href="#"
                target="_blank"
              > */}
              {name}
              {/* <p>{title}</p> */}
              {/* </a> */}
            </Link>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{num_videos}</strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{projects_count}</strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{progress}%</strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{rating}/5</strong>
          </div>
        </div>
        <div className="c-media">
        <Link
              to={{
                pathname: `${certificate_link}`,
              }} target="_blank"
              className="c-media__link u-text--small"
            >
          <img
            className={`c-avatar c-media__img ${color ? color[0] : null} ${color ? color[1] : null
              } `}
            src={certificate_link ? certificate_link : "https://us.123rf.com/450wm/koblizeek/koblizeek1902/koblizeek190200055/125337077-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-.jpg?ver=6"}
            alt="avatar"
          />
          </Link>
        </div>
      </div>
    </li>
  );
}

export default ListUnit;
