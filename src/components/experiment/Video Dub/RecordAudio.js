import React, { useRef } from 'react';
import { useState } from 'react';
import { ReactComponent as Record } from "./asset/Record.svg";
import MicRecorder from "mic-recorder-to-mp3";
import swal from "sweetalert";
import { Post } from "../../common/common";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function RecordAudio({ max, value, playerRef, handleAudioObj, handlePosition, handleTime, handleValueTime, paused, statePlayer, id, language }) {


    // const [value, setValue] = useState(range);
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState({
      url: null,
      blob: null,
      startTime: 0,
      endTime: 0,
    });

    const [counter, setCounter] = useState(0);

    const [isMuted, setIsMuted] = useState(false);
    const [playedTill, setPlayedTill] = useState(null);

    const [playing, setPlaying] = useState({
      video: false,
      audio: false,
    });

    const audioRef = useRef();

    React.useEffect(() => {
      let timer;
      if (counter > 0) {
        timer = setTimeout(() => setCounter((c) => c - 1), 1000);
      }
  
      // if (paused) {
      //   audioRef.current.pause();
      //   setPlaying({ video: false, audio: false });
      // }
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

    return (
        <div className="recordAudio">
            <button onClick={isRecording ? stop : start} className={isRecording ? "recording" : "not-recording"} data-tut="record">
                {isRecording && counter !== 0 ? Math.round(counter) : <Record />}
            </button>

            <button className="recordAudio-save" data-tut="save" onClick={blobURL.url ? () => handleAudioSubmit() : () => swal("No recording", "Please record audio before saving", "error")}>
                Save
            </button>
        </div>
    )
}

export default RecordAudio;
