import React, { useState, useRef, useEffect } from "react";
import Youtube from "react-youtube";
import AudioIns from "./AudioIns";
import ArrRender from "./ArrRender";
import "./VideoDub.css";
import { VideoDubSteps } from "./VideoDubSteps";
import { Steps } from "intro.js-react";
import Slider from "@material-ui/core/Slider";

import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import ZoomInOutlinedIcon from "@material-ui/icons/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@material-ui/icons/ZoomOutOutlined";

import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";

// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
// import { ReactComponent as Reset } from "./asset/rotate-ccwrotate.svg";
// import { ReactComponent as Play } from "./asset/Vector.svg";
// import { ReactComponent as Pause } from "./asset/Group 866-big-pause.svg";
import { ReactComponent as Tube } from "./asset/youtubetube.svg";

import { ReactComponent as Forward } from "./asset/Forward.svg";
import { ReactComponent as Play } from "./asset/Play.svg";
import { ReactComponent as Pause } from "./asset/Pause.svg";
import { ReactComponent as Back } from "./asset/Back.svg";
import { ReactComponent as Rewind } from "./asset/Rewind.svg";
import { ReactComponent as Reset } from "./asset/Reset.svg";
import { ReactComponent as Record } from "./asset/Record.svg";
import { ReactComponent as Split } from "./asset/Split.svg";
import { ReactComponent as Cut } from "./asset/Cut.svg";
import { ReactComponent as Cut1 } from "./asset/Cut1.svg";

import { ReactComponent as Pause1 } from "./asset/Pause1.svg";
import { ReactComponent as Pause2 } from "./asset/Pause2.svg";
import { ReactComponent as Volume } from "./asset/Volume.svg";
import { ReactComponent as ZoomIn } from "./asset/Zoom-in.svg";
import { ReactComponent as ZoomOut } from "./asset/Zoom-out.svg";
import { ReactComponent as Forward1 } from "./asset/Forward1.svg";
import { ReactComponent as Rewind1 } from "./asset/Rewind1.svg";

import { Get, Post } from "../../common/common";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import ArrRenderNew from "./ArrRenderNew";
import AudioInsNew from "./AudioInsNew";
import RecordAudio from "./RecordAudio";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "inline",
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function secondsToHms(seconds) {
  if (!seconds) return "00:00";

  let duration = seconds;
  let hours = duration / 3600;
  duration = duration % 3600;

  let min = parseInt(duration / 60);
  duration = duration % 60;

  let sec = parseInt(duration);

  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }

  if (parseInt(hours, 10) > 0) {
    return `${parseInt(hours, 10)}:${min}:${sec}`;
  } else if (min === 0) {
    return `00:${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

let languagesArr = [];

const VideoDub = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState(6);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [statePlayer, setStatePlayer] = useState(-1);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(0);
  const [audioArr, setAudioArr] = useState([]);
  const [max, setMax] = useState(100);
  const [id, setId] = useState("hdGsFpZ0J2E");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(0);
  const [valueTwo, setValueTwo] = useState(0);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popId = open ? "simple-popover" : undefined;

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      enablejsapi: 1,
      autoplay: 1,
    },
  };
  const playerRef = useRef();

  // useEffect(() => {
  //   // if (audioArr && audioArr.length > 0) {
  //   //   handleConcat();
  //   //   return
  //   // }
  //   // if(isPlaying && statePlayer===2) setIsPlaying(false)
  //   let timer;
  //   // if (statePlayer === 1) {
  //     timer = setInterval(() => setTime(playerRef.current.internalPlayer.getCurrentTime().then((data) => setTime(data))), 500);
  //   // }
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  // });

  useEffect(() => {
    handleGetAudio(6);
    handleGetLanguage();
    setTimeout(() => {
      if (localStorage.getItem("show_dub_tutorial") !== "false") {
        setIsOpen(true);
        localStorage.setItem("show_dub_tutorial", false);
      }
    }, 1000);
  }, [id]);
  const closeTour = () => {
    setIsOpen(false);
  };

  async function handleGetLanguage() {
    try {
      const data = await Get(true, "get_languages");
      console.log("get languages data", data);
      languagesArr = data.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetAudio(lang_id) {
    const data = await Get(true, `get_video_dub?video_url=${id}&language_id=${lang_id}`);
    let tempAudio = [];
    if (data && data.data.data) {
      data.data.data.forEach((aud) => {
        let obj = {
          blobURL: aud.audio_url,
          blob: null,
          startTime: parseInt(aud.start_time),
          endTime: parseInt(aud.end_time),
          duration: parseInt(aud.end_time) - parseInt(aud.start_time),
          id: aud.id,
        };
        tempAudio.push(obj);
      });
      setAudioArr(tempAudio);
    }
  }

  async function handleOnChange(e) {
    const pstate = await e.target.getPlayerState();
    console.log(pstate);
    if (ready) {
      if (pstate === 1) {
        e.target.pauseVideo();
        e.target.unMute();
        setReady(false);
      }
    }
    setStatePlayer(pstate);
  }

  const handleAudioObj = (obj) => {
    if (audioArr.length === 1) {
      if (audioArr[0].startTime > obj.startTime) {
        setAudioArr([obj, ...audioArr]);
        return;
      }
    }
    for (let i = 0; i < audioArr.length - 1; i++) {
      if (audioArr[i].endTime <= obj.startTime && obj.startTime <= audioArr[i + 1].startTime) {
        audioArr.splice(i + 1, 0, obj);
        setAudioArr(audioArr);
        return;
      }
    }

    setAudioArr([...audioArr, obj]);
  };

  function handleDubPlay() {
    setIsPlaying(true);
    setCurrentPlaying(0);
  }

  function handleSeriesEnd() {
    if (currentPlaying + 1 >= audioArr.length) {
      setIsPlaying(false);
      setCurrentPlaying(0);
    } else {
      setCurrentPlaying(currentPlaying + 1);
    }
  }

  function handleIdSubmit(e) {
    // e.preventDefault();
    console.log(e);
    var videoid = e.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoid != null) {
      console.log("video id = ", videoid[1]);
      setId(videoid[1]);
      setStatePlayer(-1);
      setTime(0);
      setPosition(0);
      setAudioArr([]);
      setMax(100);
      setAnchorEl(null);
      setIsPlaying(false);
      setValueTwo(0);
      setCurrentPlaying(0);
    } else {
      console.log("The youtube url is not valid.");
    }
  }

  async function playiframe() {
    await playerRef.current.internalPlayer.unMute();
    await playerRef.current.internalPlayer.playVideo();
  }

  async function handleDelete(ind) {
    var newAudioArr = [];
    var formdata = new FormData();
    try {
      for (let i = 0; i < audioArr.length; i++) {
        if (i == ind) {
          formdata.append("video_dub_id", audioArr[i].id);
          await Post(true, "remove_video_dub", formdata);
        }
        if (i != ind) newAudioArr.push(audioArr[i]);
      }
      setAudioArr(newAudioArr);
    } catch (error) {}
  }
  const handleValueTime = async (val) => {
    setPosition(val[0]);
    if (valueTwo !== val[1]) {
      setValueTwo(val[1]);
      setTime(val[1]);

      await playerRef.current.internalPlayer.playVideo();
      await playerRef.current.internalPlayer.seekTo(val[1]);
      await playerRef.current.internalPlayer.pauseVideo();
    } else {
      await playerRef.current.internalPlayer.playVideo();
      await playerRef.current.internalPlayer.seekTo(val[0]);
      await playerRef.current.internalPlayer.pauseVideo();
    }
  };
  const handlePlay = async () => {
    statePlayer === 2 || statePlayer === -1 ? await playiframe() : await playerRef.current.internalPlayer.pauseVideo();
  };
  const handleContinueRecording = () => {
    setPosition(audioArr[audioArr.length - 1].endTime);
    setTime(audioArr[audioArr.length - 1].endTime + 5);
  };

  return (
    <div className="videoDub">
      <div className="VideoDub-container">
        <div className="videodub-left">
          <div className="video-info">
            <Tube />
            <div>Translate Video to Local Language</div>
            <p onClick={handleClick}>change</p>
          </div>

          <div className="vidbox">
            <div className="ui embed">
              <Youtube
                opts={opts}
                videoId={id}
                ref={playerRef}
                onStateChange={handleOnChange}
                onReady={async (e) => {
                  let maxTime = await e.target.getDuration();
                  setMax(maxTime);
                  e.target.mute();
                  setReady(true);
                }}
              />
            </div>
            <div className="vidbox-button">
              <button
                onClick={handlePlay}
                className={statePlayer === 2 || statePlayer === -1 ? "" : "bg-purple"}
                data-tut="play"
              >
                {statePlayer === 2 || statePlayer === -1 ? <Play /> : <Pause1 />}
              </button>

              <div>
                <RecordAudio
                  max={max}
                  value={[position, time]}
                  playerRef={playerRef}
                  handleTime={(val) => setTime(val)}
                  handlePosition={(val) => setPosition(val)}
                  handleAudioObj={handleAudioObj}
                  id={id}
                  language={language}
                  statePlayer={statePlayer}
                  paused={statePlayer === 2 ? true : false}
                  handleValueTime={handleValueTime}
                />
              </div>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.getCurrentTime().then((data) => {
                    setTime(data - 5);
                    playerRef.current.internalPlayer.seekTo(data - 5);
                  });
                }}
              >
                <Rewind />
              </button>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.seekTo(0);
                  setTime(0);
                }}
              >
                <Back />
              </button>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.getCurrentTime().then((data) => {
                    setTime(data + 5);
                    playerRef.current.internalPlayer.seekTo(data + 5);
                  });
                }}
              >
                <Forward />
              </button>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.seekTo(0);
                  setTime(0);
                }}
              >
                <Cut1 />
              </button>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.seekTo(0);
                  setTime(0);
                }}
              >
                <Split />
              </button>

              <button
                onClick={() => {
                  playerRef.current.internalPlayer.seekTo(0);
                  setTime(0);
                }}
              >
                <Reset />
              </button>
            </div>
          </div>

          {/* <AudioIns
            max={max}
            position={position}
            value={[position, time]}
            playerRef={playerRef}
            handlePosition={(val) => setPosition(val)}
            handleTime={(val) => setTime(val)}
            handleAudioObj={handleAudioObj}
            secondsToHms={secondsToHms}
            handleValueTime={handleValueTime}
            paused={statePlayer === 2 ? true : false}
            statePlayer={statePlayer}
            id={id}
            language={language}
          /> */}
        </div>

        <div className="videodub-right">
          <div className="videodub-rightHeading">
            <h3>Recordings</h3>
          </div>
          <div className="audioarr-list">
            {audioArr.map((aud, index) => {
              return (
                // <ArrRender
                //   key={aud.blobURL}
                //   max={max}
                //   value={[aud.startTime, aud.endTime]}
                //   playerRef={playerRef}
                //   secondsToHms={secondsToHms}
                //   blobUrl={aud.blobURL}
                //   index={index}
                //   statePlayer={statePlayer}
                //   seriesPlay={isPlaying && currentPlaying === index ? true : false}
                //   handleSeriesEnd={handleSeriesEnd}
                //   handleDelete={handleDelete}
                //   length={audioArr.length}
                //   // ref={audioArrRef}
                //   paused={statePlayer === 2 ? true : false}
                // />
                <>
                  <ArrRenderNew
                    value={[aud.startTime, aud.endTime]}
                    playerRef={playerRef}
                    secondsToHms={secondsToHms}
                    handleDelete={handleDelete}
                    blobUrl={aud.blobURL}
                    index={index}
                    statePlayer={statePlayer}
                    seriesPlay={isPlaying && currentPlaying === index ? true : false}
                    handleSeriesEnd={handleSeriesEnd}
                    handleDelete={handleDelete}
                    length={audioArr.length}
                    // ref={audioArrRef}
                    paused={statePlayer === 2 ? true : false}
                  />
                  {/* <ArrRenderNew />
                <ArrRenderNew /> */}
                </>
              );
            })}
          </div>

          {/* <div className="voiceover-button">
            <div className="flex gap_10 wrap">
              <Button variant="contained" onClick={handleContinueRecording} disabled={statePlayer === 1 || !audioArr || audioArr.length <= 0}>
                Continue Recording
              </Button>
              <Button variant="contained" onClick={handleDubPlay} disabled={statePlayer === 1 || !audioArr || audioArr.length <= 0}>
                Play all Voiceovers
              </Button>
            </div>

            <p>
              This Video is being translated to:{" "}
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={openLanguage}
                  onClose={() => setOpenLanguage(false)}
                  onOpen={() => setOpenLanguage(true)}
                  value={language}
                  onChange={async (e) => {
                    await handleGetAudio(e.target.value);
                    setLanguage(e.target.value);
                  }}
                >
                  {languagesArr.map((lang, i) => (
                    <MenuItem key={i} value={lang.id}>
                      {lang.language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </p>
          </div> */}

          <div className="voiceover">
            <div className="voiceover-vol">
              <Volume />
              {/* <input type="range" /> */}
              <Slider className="slider" value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
            </div>

            <p>
              <span>Translated to: </span>{" "}
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={openLanguage}
                  onClose={() => setOpenLanguage(false)}
                  onOpen={() => setOpenLanguage(true)}
                  value={language}
                  onChange={async (e) => {
                    await handleGetAudio(e.target.value);
                    setLanguage(e.target.value);
                  }}
                  disableUnderline
                >
                  {languagesArr.map((lang, i) => (
                    <MenuItem key={i} value={lang.id}>
                      {lang.language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </p>

            <div className="voiceover-zoom">
              <ZoomIn />
              <p>100%</p>
              <ZoomOut />
            </div>
          </div>
        </div>

        <Popover
          id={popId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
        >
          <div style={{ padding: "2px" }}>
            <TextField
              id="filled-basic"
              label="Enter url"
              variant="filled"
              onKeyDown={(e) => {
                if (e.code === "Enter" || e.keyCode === 13) {
                  handleIdSubmit(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </Popover>
        <Steps
          enabled={isOpen}
          steps={VideoDubSteps}
          initialStep={0}
          onExit={closeTour}
          options={{
            // disableInteraction: true,
            showStepNumbers: false,
            overlayOpacity: 0,
            doneLabel: "Got it",
            hidePrev: true,
            hideNext: true,
            nextLabel: "Next",
            tooltipClass: "myTooltipClass",
            highlightClass: "myHighlightClass",
            prevLabel: "back",
          }}
        />
      </div>
      <AudioInsNew
        max={max}
        position={position}
        value={[position, time]}
        playerRef={playerRef}
        handlePosition={(val) => setPosition(val)}
        handleTime={(val) => setTime(val)}
        handleAudioObj={handleAudioObj}
        secondsToHms={secondsToHms}
        handleValueTime={handleValueTime}
        paused={statePlayer === 2 ? true : false}
        statePlayer={statePlayer}
        id={id}
        language={language}
        audioArr={audioArr}
      />
    </div>
  );
};

export default VideoDub;
