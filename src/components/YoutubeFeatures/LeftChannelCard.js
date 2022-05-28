import React from "react";
import { Rating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import styles from "./YoutubeFeatures.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  IconButton,
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/ShareOutlined";
import UpIcon from "@material-ui/icons/KeyboardArrowUp";
import DownIcon from "@material-ui/icons/KeyboardArrowDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDownOutlined";
import YouTube from "react-youtube";
import Group1190 from "../../assets/images/icons/Group-1190.png";
import Klapz from "../User/Dashboard/Videos/Tab Components/Klapz";

const LeftChannelCard = ({ channel, id }) => {
  const [expanded, setExpanded] = React.useState(false),
    [playerControl, setPlayerControl] = React.useState(null),
    youtubePlayer = React.createRef(),
    youtubeOptns = {
      playerVars: {
        enablejsapi: 1,
        autoplay: 0,
        start: 0,
        //value in seconds
      },
    };

  const collapseHandler = () => {
    setExpanded(false);
    if (playerControl) {
      playerControl.stopVideo();
    }
  };

  const displayDay = () => {
    const date = new Date();
    date.setDate(date.getDate() - id);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDate();

    if (date.getDate() === today) return "Today";
    else if (date.getDate() === today - 1) return "Yesterday";
    return days[date.getDay()];
  };

  return (
    <ClickAwayListener onClickAway={collapseHandler}>
      <div className={styles.leftChannelCard}>
        <h3>{displayDay()}</h3>
        <div className={styles.leftChannelCard__main} style={{backgroundColor: expanded ? "#c4c4c4" : "#f1edff"}}>
          <img src={channel.channel_icon} alt="icon" />
          <div className={styles.leftChannelCard__details}>
            <h4>{channel.channel_name}</h4>
            <Rating
              readOnly
              size="small"
              name="star-rating"
              value={channel.channel_ratings}
              precision={0.25}
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={
                <StarBorderIcon
                  fontSize="inherit"
                  style={{ color: "#febe16" }}
                />
              }
            />
            <p>{channel.channel_subscribers} Subscribers</p>
          </div>
          <div className={styles.leftChannelCard__actions}>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <div className={styles.leftChannelCard__upvote}>
              <UpIcon />
              <p>{channel.channel_upvotes}</p>
            </div>
          </div>
        </div>
        {!expanded && (
          <div
            onClick={() => setExpanded(true)}
            className={styles.leftChannelCard__dropdown__head}
          >
            <h5>Most popular video of this channel</h5>
            <DownIcon />
          </div>
        )}
        <Accordion
          expanded={expanded}
          style={{
            width: "90%",
            margin: "0 auto",
            marginTop: "-64px",
            borderRadius: "10px",
          }}
        >
          <AccordionSummary style={{ padding: 0 }} />
          <AccordionDetails className={styles.leftChannelCard__dropdown__main}>
            <YouTube
              containerClassName={styles.player_parent}
              className={styles.player}
              videoId={channel?.video?.url}
              key={channel?.video?.url}
              ref={youtubePlayer}
              opts={youtubeOptns}
              onReady={(event) => setPlayerControl(event.target)}
            />
            <div className={styles.dropdown__details}>
              <h4>{channel?.video?.title}</h4>
              <p>{channel?.video?.views} Views</p>

              <div className={styles.dropdown__actions}>
                <div>
                  <IconButton>
                    <ThumbUpIcon style={{ color: "#F3B921" }} />
                  </IconButton>
                  <IconButton>
                    <ThumbDownIcon />
                  </IconButton>
                </div>
                <Klapz id={channel?.video?.url}>
                  <div style={{ textAlign: "center" }}>
                    <div className={styles.klapz_button}>
                      <img src={Group1190} className="klapz-icon" alt="" />
                      <p>Klapz</p>
                    </div>
                  </div>
                </Klapz>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </ClickAwayListener>
  );
};

export default LeftChannelCard;
