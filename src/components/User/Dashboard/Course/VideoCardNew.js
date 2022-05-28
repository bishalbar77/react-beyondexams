import React, { useEffect, useState } from "react";
import "../../../../assets/css/User/Dashboard/VideoCard.css";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "../../../../assets/images/icons/deleteIcon.png";
import { IconButton } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import YouTube from "react-youtube";

import YouTubeIcon from '@material-ui/icons/YouTube';
import { ReactComponent as VideoWatched } from './asset/videoWatched.svg'
import { ReactComponent as VideoNotWatched } from './asset/videoNotWatched.svg'


const useStyles = makeStyles((theme) => ({
  bookmark: {
    width: "42px",
  },
  icon: {
    marginRight: "4px",
  },
  videoIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '26px',
    width: '26px',
    backgroundColor: '#6646E7',
    borderRadius: '100px',
  },
  videoNotWatched: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '26px',
    width: '26px',
    backgroundColor: '#D7D4D4',
    borderRadius: '100px',
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
  check: {
    width: "30px",
    height: "30px",
    color: "var(--color3)",
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

function VideoCardNew({
  handleVideoDelete,
  video,
  module,
  ondragstart,
  count,
  moduleCount,
  lastVideo,
  lastModule,
  pauseAll,
}) {
  const [date, setDate] = useState();
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [fetchPlayer, setFetchPlayer] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const classes = useStyles();
  const player = React.useRef();
  let timeout;

  useEffect(() => {
    let date1 = new Date(video.created_at);
    const date2 = new Date();
    let diffTime = Math.floor((date2 - date1) / 1000);
    if (diffTime < 60) {
      diffTime === 1 ? setDate(`${diffTime} second ago`) : setDate(`${diffTime} seconds ago`);
    } else if (diffTime < 60 * 60) {
      diffTime = Math.floor(diffTime / 60);
      diffTime === 1 ? setDate(`${diffTime} minute ago`) : setDate(`${diffTime} minutes ago`);
    } else if (diffTime < 60 * 60 * 24) {
      diffTime = Math.floor(diffTime / (60 * 60));
      diffTime === 1 ? setDate(`${diffTime} hour ago`) : setDate(`${diffTime} hours ago`);
    } else if (diffTime < 60 * 60 * 24 * 30) {
      diffTime = Math.floor(diffTime / (60 * 60 * 24));
      diffTime === 1 ? setDate(`${diffTime} day ago`) : setDate(`${diffTime} days ago`);
    } else if (diffTime < 60 * 60 * 24 * 30 * 12) {
      diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30));
      diffTime === 1 ? setDate(`${diffTime} month ago`) : setDate(`${diffTime} months ago`);
    } else {
      diffTime = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
      diffTime === 1 ? setDate(`${diffTime} year ago`) : setDate(`${diffTime} years ago`);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [video]);
  const handleHover = async () => {
    setHover(true);
    // console.log("hover");
    if (ready) {
      player.current.internalPlayer.playVideo();
      timeout = setTimeout(() => {
        setShowPlayer(true);
      }, 400);
      pauseAll(video.url);
    }
  };
  const handleMouseLeave = async () => {
    setHover(false);
    if (ready) {
      timeout = setTimeout(() => {
        setShowPlayer(false);
        player.current.internalPlayer.pauseVideo();
      }, 400);
    }
  };
  const fetchVideoPlayer = async () => {
    pauseAll(video.url);
    setFetchPlayer(true);
    setHover(true);
  };
  const onReady = async (event) => {
    setReady(true);
    if (hover) {
      event.target.playVideo();
      timeout = setTimeout(() => {
        setShowPlayer(true);
      }, 400);
    }
  };
  const opts = {
    playerVars: {
      enablejsapi: 1,
      autoplay: 0,
      controls: 0,
      fs: 0,
      rel: 0,
      mute: 1,
      // modestbranding: 1,
      color: "white",
      // start: 20,
      //value in seconds
    },
  };
  return (
    <>
      <div
        className="videoCard"
        onDragStart={(e) => ondragstart(video.url, module.id)}
        draggable={
          localStorage.getItem("role_id") === "2" &&
          module.user_id.toString() === localStorage.getItem("phoenix_user_id")
            ? "true"
            : "false"
        }
        onMouseEnter={() => {
          fetchPlayer ? handleHover() : fetchVideoPlayer();
        }}
        onMouseLeave={() => {
          handleMouseLeave();
        }}
        onTouchStart={() => {
          fetchPlayer ? handleHover() : fetchVideoPlayer();
        }}
      >
        {/* <div className={lastModule && lastVideo ? "video_num_line" : "video_num_line_full"} /> */}
        <div className="video_num">
          <h3>
            {video.watched_status[0]?.has_watched === 1 ? (
                <div className={classes.videoIcon}><VideoNotWatched /></div>
            ) : (
                <div className={classes.videoNotWatched}><VideoNotWatched /></div>
            )}
          </h3>
        </div>
        {/* <div className="module_video_card_left">
          {fetchPlayer && (
            <div className="ui embed">
              <YouTube ref={player} opts={opts} key={video.url} videoId={video.url} id="myFrame" onReady={onReady} />
            </div>
          )}
          <img
            className=""
            src={video.thumbnails}
            alt=""
            style={{
              opacity: showPlayer && ready ? 0 : 1,
              position: showPlayer || fetchPlayer ? "absolute" : "relative",
            }}
          />
        </div> */}
        <div className="videoCardRight">
          <div className="videoTitle">
            {String(video.title)
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, "'")}

            <IconButton
              className={
                localStorage.getItem("role_id") === "2" &&
                String(module.user_id) === localStorage.getItem("phoenix_user_id")
                  ? "videoDelete"
                  : "introjs-overlay"
              }
              onClick={(e) => {
                e.stopPropagation();
                handleVideoDelete(video.url);
              }}
            >
              <img src={DeleteIcon} alt="" />
            </IconButton>
          </div>
          {/* <div className="videoCaption">{video.channelTitle}</div>
          <div className="videoRating">
            {video.total_rating_sum / video.total_times_rated > 0 && (
              <Rating
                icon={<StarRoundedIcon fontSize="inherit" />}
                emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
                name="read-only"
                value={video.total_rating_sum / video.total_times_rated}
                readOnly
                size="small"
              />
            )}
          </div>
          <div className="videoMeta">
            {video.total_view > 0 && <div>{video.total_view} Views&nbsp;&nbsp;&nbsp;&nbsp;</div>}
            <FiberManualRecordRoundedIcon className={classes.fishEye} />
            <div>{date}</div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default VideoCardNew;
