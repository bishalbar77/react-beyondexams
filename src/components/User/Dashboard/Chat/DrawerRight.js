import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ShareIcon from "@material-ui/icons/Share";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Get } from "../../../common/common";
import ShareChannel from "../../../Home/BestChannel/ShareChannel";
import styles from "./drawer.module.css";
import Audio from "./images/audio_file.png";
import Community from "./images/community.png";
import Doc from "./images/doc.png";
import Jpg from "./images/jpg.png";
import Pdf from "./images/pdf.png";
import Video from "./images/video_file.png";

export default function DrawerRight(props) {
  console.log(props.creator.chat);
  const [community, setCommunity] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    Get(1, "get_chat_enrolled_users", {
      category_id: props.creator.chat.category.id,
    }).then((res) => {
      console.log(res.data);
      setCommunity(res.data.data);
    });
    let element = document.getElementById("desc");
    if (element) {
      if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
        // your element has an overflow
        // show read more button
        setShowMoreButton(true);
      } else {
        // your element doesn't have overflow
        setShowMoreButton(false);
      }
    }
  }, [props.creator.chat.category.id]);
  const handleShowMoreClick = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className={styles.root}>
      <div className={styles.animate}>
        <section className={styles.header}>
          <IconButton onClick={props.handleDrawerClose}>
            <CloseRoundedIcon style={{ color: "#7C7C7C" }} />
          </IconButton>
          <h4>Course Info</h4>
        </section>
        <section className={styles.course}>
          <Link to={`/dashboard/course/${encodeURIComponent(props.creator.chat?.category?.slug ?? "")}`}>
            <img
              className={styles.course_img}
              src={
                props.creator.chat?.category?.image_url ?? "https://api.beyondexams.org/images/instgram%20profile.jpg"
              }
            />
          </Link>

          <h3>
            <Link to={`/dashboard/course/${encodeURIComponent(props.creator.chat?.category?.slug ?? "")}`}>
              {props.creator.chat?.category?.title ?? ""}
            </Link>
            <ShareChannel share={window.location.href} title={props.creator.chat?.category?.title ?? ""}>
              <ShareIcon style={{ color: "var(--color1)" }} />
            </ShareChannel>
          </h3>

          <Link to={`/dashboard/profile/${encodeURIComponent(props.creator.chat?.category?.creator?.slug)}`}>
            Course Created By - {props.creator.chat?.category?.creator?.name ?? ""}{" "}
            <img
              className={styles.course_creator_img}
              src={
                props.creator.chat?.category?.creator?.avatar ??
                "https://api.beyondexams.org/images/instgram%20profile.jpg"
              }
            />
          </Link>
        </section>
        <section className={styles.summary}>
          <h4>Summary</h4>
          <p id="desc" className={showMore ? styles.showMoreActive : ""}>
            {props.creator.chat?.category?.description ?? ""}
          </p>
          <span>
            {showMoreButton && (
              <Button color="primary" size="small" className={styles.showMore} onClick={handleShowMoreClick}>
                {showMore ? "SHOW LESS" : "SHOW MORE"}
              </Button>
            )}
          </span>
        </section>
        <section className={styles.media}>
          <h4>Course Media</h4>
          <div className={styles.media_icons}>
            <img src={Audio} />
            <img src={Doc} />
            <img src={Jpg} />
            <img src={Pdf} />
            <img src={Video} />
            <img src={Doc} />
            <img src={Video} />
            <KeyboardArrowRightIcon />
          </div>
        </section>
        <section className={styles.community}>
          <div className={styles.community_header}>
            <h4>
              <img src={Community} />
              Your Community
            </h4>
            <p>
              {community.length} {community.length > 1 ? "students" : "student"} enrolled
            </p>
          </div>
          <div className={styles.users}>
            {community.map((e) => (
              <Link to={`/dashboard/profile/${encodeURIComponent(e.user.slug)}`}>
                <img src={e.user?.avatar ?? "https://api.beyondexams.org/images/instgram%20profile.jpg"} />
                {e.user.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
