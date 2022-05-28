import React, { useEffect, useState } from "react";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import { makeStyles } from "@material-ui/core/styles";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
  bookmark: {
    width: "42px",
  },
  icon: {
    marginRight: "4px",
  },
  fishEye: {
    marginRight: "3px",
    fontSize: "8px",
  },
  videoDesc: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "1.5rem 0",
  },
  "@media (min-width:960px)": {
    videoFont: {
      fontSize: "14px !important",
    },
    videoFontMeta: {
      fontSize: "13px !important",
    },
  },
  "@media (min-width:600px) and (max-width:959px)": {
    videoFont: {
      fontSize: "13px !important",
    },
    videoFontMeta: {
      fontSize: "12px !important",
    },
  },
  "@media (min-width:400px) and (max-width:599px)": {
    videoFont: {
      fontSize: "12px !important",
    },
    videoFontMeta: {
      fontSize: "11px !important",
    },
  },
  "@media (max-width:399px)": {
    videoFont: {
      fontSize: "10px !important",
    },
    videoFontMeta: {
      fontSize: "10px !important",
    },
  },
}));

function VideoResult({ video, handleCopy, handleVideoResultClick }) {
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const classes = useStyles();

  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (window.screen.width < 500) {
      setTitle(
        String(`${video.title}....`)
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, "'")
          .slice(0, 40)
      );
    } else if (window.screen.width < 639) {
      setTitle(
        String(`${video.title}....`)
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, "'")
          .slice(0, 60)
      );
    } else {
      setTitle(
        String(video.title)
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, "'")
      );
    }
    if (video.total_times_rated) {
      setRating(video.total_rating_sum / video.total_times_rated);
    }
  }, [video]);

  useEffect(() => {
    let date1 = new Date(video.publishedAt);
    const date2 = new Date();
    let diffTime = Math.floor((date2 - date1) / 1000);
    if (diffTime < 60) {
      setDate(`${diffTime} seconds ago`);
    } else if (diffTime < 60 * 60) {
      diffTime = Math.floor(diffTime / 60);
      setDate(`${diffTime} minutes ago`);
    } else if (diffTime < 60 * 60 * 24) {
      diffTime = Math.floor(diffTime / (60 * 60));
      setDate(`${diffTime} hours ago`);
    } else if (diffTime < 60 * 60 * 24 * 30) {
      diffTime = Math.floor(diffTime / (60 * 60 * 24));
      setDate(`${diffTime} days ago`);
    } else if (diffTime < 60 * 60 * 24 * 30 * 12) {
      diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30));
      setDate(`${diffTime} months ago`);
    } else {
      diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
      setDate(`${diffTime} years ago`);
    }
  }, [video]);

  return (
    <div className="videoResult videoCard">
      <div className="videoCardLeft" onClick={() => handleVideoResultClick(video)}>
        <img className="videoResultImg" src={video.thumbnails} alt="" />
        <div className="videoCardRight">
          <div className="videoResultTitle videoTitle">{title}</div>
          <div className="videoCaption">{video.channelTitle}</div>
          {rating > 0 && <div className="videoRating">
            <Rating
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={
                <StarBorderRoundedIcon
                  style={{ color: "#febe16" }}
                  fontSize="inherit"
                />
              }
              name="read-only"
              value={rating}
              readOnly
              size="small"
            />
          </div>}
          {video.total_view > 0 &&
            <div className="videoMeta">
              <div>{video.total_view} Views&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <FiberManualRecordRoundedIcon className={classes.fishEye} />
              <div>{date}</div>
            </div>}
        </div>
      </div>
      <div className="videoCardRight">
        <button onClick={() => handleCopy(video.url)} className="copyLinkBtn">
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default VideoResult;
