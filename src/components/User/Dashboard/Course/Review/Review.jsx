import React from "react";
import styles from "./Review.module.css";
import Rating from "@material-ui/lab/Rating";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import "../../Search/Components/Notes/note.css";
import { Link } from "react-router-dom";
import { renderDate } from "../../Browse/CourseCard";

export default function Review({ reviews, course, stats }) {
  return (
    reviews.length > 0 && (
      <div className="course-review">
        <h3>Course Reviews & Feedback</h3>

        <div className={styles.rate}>
          <div className={styles.rate_left}>
            <h1>{(course.rating_sum / course.rated_user).toFixed(1)}</h1>
            <div>
              {" "}
              <Rating
                value={course.rating_sum / course.rated_user}
                readOnly
                precision={0.5}
                // className={classes.rating}
                icon={<StarRoundedIcon fontSize="inherit" style={{ color: "var(--color1)" }} />}
                emptyIcon={<StarBorderRoundedIcon style={{ color: "var(--color1)" }} fontSize="inherit" />}
              />
              <p>Course ratings</p>
            </div>
          </div>
          <div className={styles.rate_right}>
            {[5, 4, 3, 2, 1].map((e, i) => (
              <div className={styles.juiceContainer} key={i}>
                <div className={styles.juiceDiv}>
                  <div className={styles.progress} style={{ width: stats[e][1].toFixed(0) + "%" }}></div>
                </div>
                <Rating
                  value={e}
                  readOnly
                  fontSize="small"
                  // className={classes.rating}
                  className={styles.rating}
                  icon={<StarRoundedIcon fontSize="inherit" style={{ color: "var(--color1)" }} />}
                  emptyIcon={<StarBorderRoundedIcon style={{ color: "var(--color1)" }} fontSize="inherit" />}
                />
                <p>{stats[e][1].toFixed(0) + "%"}</p>
              </div>
            ))}
          </div>
        </div>

        <h3>Reviews</h3>
        <div className={styles.reviews}>
          {reviews.map((e, i) => (
            <div className="flex" key={i}>
              <div className="notes_list" style={{ marginBottom: "20px" }}>
                <div className="notes-list-left clear-img">
                  <Link to={"/dashboard/profile/" + encodeURIComponent(e.user.slug)}>
                    <div className="note_profile_image_two">
                      <img alt="" src={e.user.avatar} />
                    </div>
                  </Link>
                </div>

                <div className="notes-list-right">
                  <div className="note-head">
                    <h6 className="">{e.user.name}</h6>
                  </div>
                  <div className={styles.review_rate}>
                    <Rating
                      value={e.rating}
                      fontSize="small"
                      readOnly
                      icon={<StarRoundedIcon fontSize="inherit" />}
                      emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                    />
                    <p>{renderDate(e.updated_at)}</p>
                  </div>

                  <p className={styles.info}>{e.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
