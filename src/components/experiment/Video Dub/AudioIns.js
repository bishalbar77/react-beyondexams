import React, { useState, useRef } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import swal from "sweetalert";
import { Post } from "../../common/common";

import Button from "@material-ui/core/Button";
import SliderComp from "./SliderComp";
import { ReactComponent as Mic } from "./asset/Group 825micc.svg";
import { ReactComponent as Play } from "./asset/Vectorplay-white.svg";
import { ReactComponent as Pause } from "./asset/Group 866-big-pause.svg";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    display: "inline",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  },
}));

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const AudioIns = ({ max, value, playerRef, handleAudioObj, handlePosition, handleTime, secondsToHms, handleValueTime, paused, statePlayer, id, language }) => {
  const classes = useStyles();
  // const [value, setValue] = useState(range);
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState({
    url: null,
    blob: null,
    startTime: 0,
    endTime: 0,
  });
  const [playing, setPlaying] = useState({
    video: false,
    audio: false,
  });
  const [counter, setCounter] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playedTill, setPlayedTill] = useState(null);

  const audioRef = useRef();
  // console.log("audio duration", audioRef.current?audioRef.current.duration():"undef")

  React.useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter((c) => c - 1), 1000);
    }

    if (paused) {
      audioRef.current.pause();
      setPlaying({ video: false, audio: false });
    }
    if (!isRecording) {
      if (timer) {
        clearTimeout(timer);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter, paused, isRecording]);

  function start() {
    // console.log(value);
    console.log("recording staart outt");
    if (value[1] <= value[0]) {
      swal("Error", "You cannot record over already dubbed time", "error");
    } else if (value[0] < value[1]) {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          setCounter(value[1] - value[0]);
          playerRef.current.internalPlayer.mute();
          playerRef.current.internalPlayer.seekTo(value[0]);
          playerRef.current.internalPlayer.playVideo();
          setTimeout(() => {
            stop();
          }, (value[1] - value[0]) * 1000);
        })
        .catch((e) => console.error(e));
    }
  }

  function stop() {
    setIsRecording(false);
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // console.log("buffer data", buffer);
        // console.log("blob data", blob);
        playerRef.current.internalPlayer.pauseVideo();
        const blobUrl = URL.createObjectURL(blob);

        setBlobURL({
          url: blobUrl,
          blob,
          startTime: value[0],
          endTime: value[1],
        });
      })
      .catch((e) => console.log(e));
  }

  async function handleVideoPlayback() {
    await playerRef.current.internalPlayer.pauseVideo();
    await playerRef.current.internalPlayer.seekTo(blobURL.startTime);
    await playerRef.current.internalPlayer.mute();
    audioRef.current.currentTime = 0;
    await playerRef.current.internalPlayer.playVideo();
    await audioRef.current.play();
  }

  function handleVideoPlaybackPause() {
    playerRef.current.internalPlayer.pauseVideo();
    audioRef.current.pause();
  }

  async function handleAudioSubmit() {
    handleAudioObj({
      blobURL: blobURL.url,
      blob: blobURL.blob,
      startTime: blobURL.startTime,
      endTime: blobURL.endTime,
      duration: blobURL.endTime - blobURL.startTime,
      id: Math.floor(Math.random() * 1000) + 1,
    });
    try {
      var formdata = new FormData();
      formdata.append("video_url", id);
      formdata.append("language_id", language);
      formdata.append("start_time", parseInt(blobURL.startTime));
      formdata.append("end_time", parseInt(blobURL.endTime));
      formdata.append("audio_file", blobURL.blob, "no name");
      console.log(formdata);
      await Post(true, "add_video_dub", formdata);
      setBlobURL({
        url: null,
        blob: null,
        startTIme: 0,
        endTime: 0,
      });
      handlePosition(blobURL.endTime);
    } catch (error) {
      console.log(error);
    }
    // setValue([value[1], value[1] + 60 > max ? max : value[1] + 60]);
  }

  async function videoPlay() {
    const to = value[1];
    setPlaying({ ...playing, video: true });
    await playerRef.current.internalPlayer.pauseVideo();
    await playerRef.current.internalPlayer.seekTo(value[0]);
    audioRef.current.currentTime = 0;
    await playerRef.current.internalPlayer.playVideo();
    setTimeout(() => {
      if (value[1] >= to) {
        playerRef.current.internalPlayer.pauseVideo();
        setPlaying({ ...playing, video: false });
      } else {
        playerRef.current.internalPlayer.seekTo(to);
        playerRef.current.internalPlayer.pauseVideo();
      }
    }, to * 1000);
  }

  function videoPause() {
    playerRef.current.internalPlayer.pauseVideo();
    audioRef.current.pause();
    setIsMuted(false);
    playerRef.current.internalPlayer.getCurrentTime().then((data) => setPlayedTill(data));
    setPlaying({ ...playing, video: false });
  }

  async function audioPlay() {
    if (blobURL.url) {
      await playerRef.current.internalPlayer.seekTo(value[0]);
      audioRef.current.currentTime = 0;
      await playerRef.current.internalPlayer.mute();
      await playerRef.current.internalPlayer.playVideo();
      audioRef.current.play();
      setIsMuted(false);
      setPlaying({ ...playing, audio: true });
    } else {
      swal("No recording", "Please record audio before playing", "error");
    }
  }

  function audioPause() {
    audioRef.current.pause();
    setPlaying({ ...playing, audio: false });
  }
  const setCurrentTimeStamp = async () => {
    const timeTemp = await playerRef.current.internalPlayer.getCurrentTime();
    console.log("set to current timestamp: ", timeTemp);
    handleTime(timeTemp);
  };

  return (
    <div className="AudioIns-container">
      <div className="audioins-duration">
        <p>
          <TimeShow value={secondsToHms(value[0])} value2={Math.trunc(value[0])} handleChangeTime={(val) => handleValueTime([val, value[1]])} classes={classes} /> to{" "}
          <TimeShow value={secondsToHms(value[1])} value2={Math.trunc(value[1])} handleChangeTime={(val) => handleValueTime([value[0], val])} classes={classes} tut={true} />
        </p>

        <p
          onClick={() => {
            setCurrentTimeStamp();
          }}
        >
          set to current timestamp
        </p>
      </div>

      <p className="audioins-save" data-tut="save" onClick={blobURL.url ? () => handleAudioSubmit() : () => swal("No recording", "Please record audio before saving", "error")}>
        Save
      </p>

      <div className="audioins-record">
        <button onClick={isRecording ? stop : start} className={isRecording ? "mic-recording" : ""} data-tut="record">
          {isRecording && counter !== 0 ? Math.round(counter) : <Mic />}
        </button>
        <div>
          <SliderComp title="Source" slideTime={value} type="video" max={max} handleSliderTime={handleValueTime} play={() => videoPlay()} pause={() => videoPause()} playing={playing.video} />
          <SliderComp
            title="Voiceover"
            // slideTime={[blobURL.startTime,blobURL.endTime]}
            slideTime={blobURL.url ? [blobURL.startTime, blobURL.endTime] : [0, 0]}
            type="audio"
            max={max}
            play={() => audioPlay()}
            pause={() => audioPause()}
            playing={playing.audio}
          />
        </div>
      </div>

      <Button
        aria-label="play"
        styles={{ backgroundColor: "gray" }}
        // onClick={handleVideoPlayback}
        disabled={blobURL.url === null}
        onClick={statePlayer === 1 ? handleVideoPlaybackPause : handleVideoPlayback}
        data-tut="voiceover"
      >
        {statePlayer === 1 ? <Pause /> : <Play />}

        <audio
          src={blobURL.url}
          ref={audioRef}
          muted={isMuted}
          onEnded={() => {
            setPlaying({ ...playing, audio: false });
            if (playing.video === true && playedTill !== null) {
              setPlayedTill(null);
            }
            if (playerRef.current) {
              playerRef.current.internalPlayer.pauseVideo();
              playerRef.current.internalPlayer.unMute();
            }
          }}
        />
      </Button>
    </div>
  );
};

function TimeShow({ value, value2, classes, handleChangeTime, tut }) {
  const [changing, setChanging] = useState(false);
  const [valueInner, setValueInner] = useState(value2);

  React.useEffect(() => {
    setValueInner(value2);
  }, [changing, value2]);

  function timeChange(e) {
    e.preventDefault();
    handleChangeTime(valueInner);
    setChanging(false);
  }

  return !changing ? (
    <span onClick={() => setChanging(true)} data-tut={tut ? "duration" : undefined}>
      {value}
    </span>
  ) : (
    <form className={classes.container} noValidate onSubmit={timeChange}>
      <TextField
        id="number"
        type="number"
        size="small"
        value={valueInner}
        InputProps={{
          startAdornment: <InputAdornment position="start">Sec</InputAdornment>,
        }}
        onChange={(e) => setValueInner(e.target.value)}
        className={classes.textField}
        inputProps={{
          step: 5, // 5 min
          min: 0,
        }}
      />
    </form>
  );
}

export default AudioIns;
