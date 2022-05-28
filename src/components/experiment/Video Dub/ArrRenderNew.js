import React, { useState, useRef, useEffect } from "react";

import Button from "@material-ui/core/Button";
import SliderComp from "./SliderComp";
import { ReactComponent as Play } from "./asset/Play.svg";
import { ReactComponent as Pause } from "./asset/Pause1.svg";

import "./ArrRenderNew.css";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Waveform from "./Waveform";

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
      <div className="edit">
        <div>{index + 1}</div>

        <div style={{ width: "250px" }}>
          <Waveform
            url={"https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3"}
            index={index}
          />
          {/* https://s3.ap-south-1.amazonaws.com/beyondexam/video_dub/164239989961e5089b7f64b.mp3 */}
          {/* https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3 */}
        </div>

        <div className="edit-time">
          <span>{secondsToHms(value[0])}</span> to <span>{secondsToHms(value[1])}</span>
        </div>

        <div className="edit-btns">
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
                console.log(blobUrl);
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

          <DeleteOutlineIcon className="edit-delete" onClick={() => handleDelete(index)} />
        </div>
      </div>
    );
  }
);

export default AudioIns;
