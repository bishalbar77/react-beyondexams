import React, { useEffect } from "react";
import { VideoDate } from "../../../../common/videocommon.js";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import YouTube from "react-youtube";
import "../../../../../assets/css/User/Dashboard/RecommendedVideo.css";

import Rating from "@material-ui/lab/Rating";

// following is stolen from material ui docs
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import AddCourse from "./AddCourse";

function RecommendedVideo({
  video,
  handleVideoSelect,
  index,
  duration,
  selectedVideo,
  color,
  askifyLength,
  stars,
  pauseAll,
  pauseVideos,
  url,
}) {
  const [open, setOpen] = React.useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = React.useState(false);
  const [videoAdd, setVideoAdd] = React.useState();
  const [starValue] = React.useState(stars[index]?.stars ?? 0);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [fetchPlayer, setFetchPlayer] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const anchorRef = React.useRef(null);
  const player = React.useRef();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  useEffect(() => {
    if (pauseVideos) {
      if (fetchPlayer) {
        if (url !== video.url) player.current.internalPlayer.pauseVideo();
        setShowPlayer(false);
      }
    }
  }, [url]);

  const handleHover = async () => {
    setHover(true);
    console.log("hover");
    if (ready) {
      player.current.internalPlayer.playVideo();
      setTimeout(() => {
        setShowPlayer(true);
      }, 400);
      pauseAll(video.url);
    }
    // await player.current.internalPlayer.seekTo(20);
    //   console.log(await player.current.internalPlayer.getIframe());
    //   // var iframe = document.getElementById("myFrame");
    //   // var elmnt = iframe.contentWindow.document.querySelector(".ytp-show-cards-title");
    //   // console.log(elmnt);
    //   // elmnt.style.display = "none";
  };
  const handleMouseLeave = async () => {
    setHover(false);
    if (ready) {
      setTimeout(() => {
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

  var str = String(video.title)
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "'");
  const onReady = async (event) => {
    setReady(true);
    if (hover) {
      event.target.playVideo();
      setTimeout(() => {
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
    <div
      className={"Recommended-container" + (video.url === selectedVideo.url ? " video-bg" : "")}
      data-tut="videos"
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
      <div className="videoImg-container" onClick={(e) => handleVideoSelect(e, video, index)}>
        {fetchPlayer && (
          <div className="ui embed">
            <YouTube ref={player} opts={opts} key={video.url} videoId={video.url} id="myFrame" onReady={onReady} />
          </div>
        )}
        <img
          src={video.thumbnails}
          alt={""}
          style={{
            opacity: showPlayer && ready ? 0 : 1,
            position: showPlayer || fetchPlayer ? "absolute" : "relative",
          }}
        />
        {/* {duration && <p>{duration[index]}</p>} */}
      </div>
      <div className="videoInfo-container">
        <div className="videoInfo-main" onClick={(e) => handleVideoSelect(e, video, index)}>
          <div className="videoInfo-main-top">
            <h3>
              {/* {str.split(" ").length >= 8 ? `${str.split(" ").splice(0, 7).join(" ")} ...` : str} */}
              {str}
            </h3>
            <p>{video.channelTitle}</p>
          </div>

          <div className="videoInfo-main-bottom">
            <div className="videoInfo-main-star">
              {/* <StarRoundedIcon className="starComp" />
              <StarRoundedIcon className="starComp" />
              <StarRoundedIcon className="starComp" />
              <StarRoundedIcon className="starComp" />
              <StarBorderIcon className="starComp" /> */}

              {starValue > 0 && (
                <Rating
                  name="star-rating"
                  value={starValue}
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  size="small"
                  readOnly
                  emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: "#febe16" }} />}
                />
              )}
            </div>
            <div className="videoInfo-main-data">
              <div>
                <RadioButtonUncheckedIcon className="dataCircle" />
                {VideoDate(video.publishedAt)}
              </div>
              {video.total_view > 0 && (
                <div>
                  <VisibilityOutlinedIcon className="dataEye" /> {video.total_view}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="videoInfo-opt">
          <MoreVertIcon
            className="dotComp"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          />
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            placement="left-start"
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <div className="drop-list">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      {askifyLength > index && (
                        <MenuItem onClick={(e) => handleVideoSelect(e, video, index, 1)}>Go to Answer</MenuItem>
                      )}
                      <MenuItem onClick={handleClose}>Share</MenuItem>
                      {localStorage.getItem("role_id") !== "1" && (
                        <MenuItem
                          onClick={() => {
                            setVideoAdd(video);
                            setShowAddCourseModal(true);
                            setOpen(false);
                          }}
                        >
                          Add to course
                        </MenuItem>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </div>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
      {showAddCourseModal && (
        <AddCourse isShow={showAddCourseModal} closeIsShow={() => setShowAddCourseModal(false)} video={videoAdd} />
      )}
    </div>
  );
}

export default RecommendedVideo;
