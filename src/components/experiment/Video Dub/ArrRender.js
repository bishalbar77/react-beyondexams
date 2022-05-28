import React, { useState, useRef, useEffect } from "react";

import Button from "@material-ui/core/Button";
import SliderComp from "./SliderComp";
import { ReactComponent as Play } from "./asset/Vectorplay-white.svg";
import { ReactComponent as Pause } from "./asset/Group 866-big-pause.svg";

const AudioIns = React.memo(
  ({
    max,
    value,
    playerRef,
    secondsToHms,
    blobUrl,
    index,
    paused,
    statePlayer,
    seriesPlay,
    handleSeriesEnd,
    handleDelete,
    length,
  }) => {
    const [playing, setPlaying] = useState({
      video: false,
      audio: false,
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playedTill, setPlayedTill] = useState(null);

    const audioRef = useRef();
    // console.log("audio duration", audioRef.current?audioRef.current.duration():"undef")

    useEffect(() => {
      if (paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      if (seriesPlay) {
        handleVideoPlayback();
        // setIsPlaying(false);
      }
    }, [paused, seriesPlay]);

    async function handleVideoPlayback() {
      // await playerRef.current.internalPlayer.pauseVideo();
      if (!seriesPlay || index === 0) {
        await playerRef.current.internalPlayer.seekTo(value[0]);
        await playerRef.current.internalPlayer.mute();
        await playerRef.current.internalPlayer.playVideo();
      }

      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
    }

    function handleVideoPlaybackPause() {
      playerRef.current.internalPlayer.pauseVideo();
      audioRef.current.pause();
      setIsPlaying(false);
    }

    async function videoPlay() {
      setPlaying({ ...playing, video: true });
      // await playerRef.current.internalPlayer.pauseVideo();
      // await playerRef.current.internalPlayer.seekTo(value[0]);
      // await playerRef.current.internalPlayer.playVideo();
      // setInterval(()=>{
      //     // playerRef.current.internalPlayer.seekTo(to);
      //     playerRef.current.internalPlayer.pauseVideo();
      // }, to*1000);
      // await playerRef.current.internalPlayer.pauseVideo();
      if (playedTill !== null) {
        await playerRef.current.internalPlayer.seekTo(playedTill);
      } else {
        await playerRef.current.internalPlayer.seekTo(value[0]);
      }
      // await playerRef.current.internalPlayer.mute();
      await playerRef.current.internalPlayer.playVideo();
      setIsMuted(true);
      await audioRef.current.play();
    }

    function videoPause() {
      audioRef.current.pause();
      playerRef.current.internalPlayer.pauseVideo();
      setIsMuted(false);
      playerRef.current.internalPlayer.getCurrentTime().then((data) => setPlayedTill(data));
      setPlaying({ ...playing, video: false });
    }

    async function audioPlay() {
      await playerRef.current.internalPlayer.seekTo(value[0]);
      await playerRef.current.internalPlayer.mute();
      await playerRef.current.internalPlayer.playVideo();
      audioRef.current.play();
      setIsMuted(false);
      setPlaying({ ...playing, audio: true });
    }

    function audioPause() {
      audioRef.current.pause();
      setPlaying({ ...playing, audio: false });
    }

    return (
      <div className="AudioIns-container">
        <div className="audioins-duration">
          <p>
            <span>{secondsToHms(value[0])}</span> to <span>{secondsToHms(value[1])}</span>
          </p>
        </div>

        <p className="audioins-save" onClick={() => handleDelete(index)}>
          Delete
        </p>

        <div className="audioins-record">
          <div>0{index + 1}</div>
          <div>
            <SliderComp
              title="Source"
              slideTime={value}
              type="video"
              sliderHide={true}
              max={max}
              handleSliderTime={(val) => console.log(val)}
              play={() => videoPlay()}
              pause={() => videoPause()}
              playing={playing.video}
            />
            <SliderComp
              title="Voiceover"
              slideTime={value}
              sliderHide={true}
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
          onClick={isPlaying ? handleVideoPlaybackPause : handleVideoPlayback}
          size="small"
        >
          {isPlaying ? <Pause /> : <Play />}
          <audio
            src={blobUrl}
            ref={audioRef}
            muted={isMuted}
            onEnded={() => {
              setPlaying({ video: false, audio: false });
              setIsMuted(false);
              if (playing.video === true && playedTill !== null) {
                setPlayedTill(null);
              }

              if (seriesPlay) {
                handleSeriesEnd();
                setIsPlaying(false);
                if (length - 1 === index) {
                  playerRef.current.internalPlayer.pauseVideo();
                  setIsPlaying(false);
                }
              } else {
                if (playerRef.current) {
                  playerRef.current.internalPlayer.pauseVideo();
                  playerRef.current.internalPlayer.unMute();
                  setIsPlaying(false);
                }
              }
            }}
          />
        </Button>
      </div>
    );
  }
);

export default AudioIns;
