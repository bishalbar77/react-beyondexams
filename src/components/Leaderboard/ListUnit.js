import React from "react";
import { Link } from "react-router-dom";

function ListUnit({
  name,
  img,
  courses,
  slug,
  index,
  educatorDetail,
  studentDetail,
  lastActive,
}) {
  const [color, setColor] = React.useState(null);

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
        <div className="c-flag c-place u-bg--transparent"># {index + 1}</div>
        <div className="c-media">
          <img
            className={`c-avatar c-media__img ${color ? color[0] : null} ${color ? color[1] : null
              } `}
            src={img}
            alt="avatar"
          />
          <div className="c-media__content">
            <div className="c-media__title">{name}</div>
            <Link
              to={{
                pathname: `/dashboard/profile/${slug}`,
              }}
              className="c-media__link u-text--small"
            >
              {/* <a
                className="c-media__link u-text--small"
                href="#"
                target="_blank"
              > */}
              @{slug}
              {/* <p>{title}</p> */}
              {/* </a> */}
            </Link>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{getTime()}</strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>
              {educatorDetail
                ? isNaN(educatorDetail.total_rating_sum / educatorDetail.total_times_rated) ? 0.0 : (educatorDetail.total_rating_sum /
                  educatorDetail.total_times_rated).toFixed(1)
                : studentDetail
                  ? studentDetail.num_courses_enrolled
                  : 0}
            </strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>
              {educatorDetail ? educatorDetail.num_students_enrolled : studentDetail
                ? studentDetail.num_courses_learning
                : 0}
            </strong>
          </div>
        </div>
        <div className={`u-text--left c-kudos ${color ? color[2] : null}`}>
          <div className="u-mt--8">
            <strong>{courses ? courses : studentDetail
              ? studentDetail.num_courses_completed
              : 0}</strong>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ListUnit;
