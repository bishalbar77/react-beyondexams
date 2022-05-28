import React, { useRef, useState } from "react";
import "./AudioInsNew.css";
import { ReactComponent as Music } from "./asset/Music.svg";
import { ReactComponent as Video } from "./asset/Video.svg";
import Waveform from "./Waveform";
import SliderComp from "./SliderComp";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  audioContainerWaveform: {
    width: "100%",
    marginLeft: "10px",
    marginRight: "10px",
  },
  videoContainerWaveform: {
    width: "100%",
  },
  flexContainer: {
    display: "flex",
    position: "relative",
  },
}));

function AudioInsNew({
  max,
  value,
  playerRef,
  handleAudioObj,
  handlePosition,
  handleTime,
  secondsToHms,
  handleValueTime,
  paused,
  statePlayer,
  id,
  language,
  audioArr,
}) {
  const classes = useStyles();

  const [playing, setPlaying] = useState({
    video: false,
    audio: false,
  });

  const audioRef = useRef();

  const [isMuted, setIsMuted] = useState(false);
  const [playedTill, setPlayedTill] = useState(null);

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
  const color = (index) => {
    if (index % 3 == 0) {
      return "red";
    } else if (index % 3 == 1) {
      return "blue";
    } else return "green";
  };

  return (
    <div className="audioInsNew">
      <div className="audioInsNewAudio">
        <div className="audioContainer">
          <Music />
          <p>Audio</p>
        </div>
        <div className={classes.audioContainerWaveform}>
          <div className={classes.flexContainer}>
            {audioArr.map((e, i) => {
              console.log("gETTTTTTTT", e);
              return (
                <div
                  style={{
                    background: color(i),
                    width: ((e.endTime - e.startTime) * 100) / max + "%",
                    height: "30px",
                    position: "absolute",
                    left: (e.startTime * 100) / max + "%",
                    top: "-15px",
                  }}
                ></div>
              );
            })}
          </div>
          {/* <Waveform url='https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3' /> */}
        </div>
      </div>

      <div className="audioInsNewVideo">
        <div className="videoContainer">
          <Video />
          <p>Video</p>
        </div>
        <div className={classes.videoContainerWaveform}>
          {/* <Waveform url='https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3' /> */}
          <SliderComp
            title=""
            slideTime={value}
            type="video"
            max={max}
            handleSliderTime={handleValueTime}
            play={() => videoPlay()}
            pause={() => videoPause()}
            playing={playing.video}
          />
        </div>
      </div>
    </div>
  );
}

export default AudioInsNew;
