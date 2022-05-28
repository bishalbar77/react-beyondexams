import React from "react";
import { Rating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import styles from "./YoutubeFeatures.module.css";

const RightChannelCard = ({ channel, id }) => {
  return (
    <div className={styles.rightChannelCard}>
      <div className={styles.rightChannelCard__head}>
        <img
          className={styles.banner}
          src={channel.channel_banner}
          alt="banner"
        />
        <img className={styles.icon} src={channel.channel_icon} alt="icon" />
      </div>
      <div className={styles.rightChannelCard__content}>
        <h4>{channel.channel_name}</h4>
        <Rating
          readOnly
          size="small"
          name="star-rating"
          value={channel.channel_ratings}
          precision={0.25}
          icon={<StarRoundedIcon fontSize="inherit" />}
          emptyIcon={
            <StarBorderIcon fontSize="inherit" style={{ color: "#febe16" }} />
          }
        />
        <p>{channel.channel_subscribers} Subscribers</p>
      </div>
    </div>
  );
};

export default RightChannelCard;
