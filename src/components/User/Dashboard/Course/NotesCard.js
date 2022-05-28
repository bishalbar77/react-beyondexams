import React, { useEffect, useState } from "react";
import "../../../../assets/css/User/Dashboard/VideoCard.css";
import { makeStyles } from "@material-ui/core/styles";
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';

import { ReactComponent as PdfIcon } from './asset/Pdf.svg'


const useStyles = makeStyles((theme) => ({
  bookmark: {
    width: "42px",
  },
  icon: {
    marginRight: "4px",
  },
  videoIcon: {
    color: "gray",
    height: '20px'
  },
  videoIconWatched: {
    color: "#6646e7",
    height: '20px'
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

function NotesCard({
  handleNoteDelete,
  note,
  module,
  ondragstart,
  count,
  moduleCount,
  lastNote,
  lastModule,
  pauseAll,
  url
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
    let date1 = new Date(note.created_at);
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
  }, [note]);
  const handleHover = async () => {
    setHover(true);
    // console.log("hover");
    if (ready) {
      player.current.internalPlayer.playVideo();
      timeout = setTimeout(() => {
        setShowPlayer(true);
      }, 400);
      pauseAll(note.url);
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
    pauseAll(note.url);
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
        onDragStart={(e) => ondragstart(note.url, module.id)}
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
            {note.total_pages === 5 ? (
                <PdfIcon />
            ) : (
                <PdfIcon />
            )}
          </h3>
        </div>

        <div className="videoCardRight">
          <a href={url} target="_blank"><div className="videoTitle">
            {String(note.title)
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, "'")}
          </div></a>
        </div>
      </div>
    </>
  );
}

export default NotesCard;
