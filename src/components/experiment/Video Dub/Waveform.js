// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   useMemo
// } from "react";
// import { WaveSurfer, WaveForm, Region } from "wavesurfer-react";
// import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
// import "./Waveform.css";

// function Waveform({ url }) {
//   const [timelineVis, setTimelineVis] = useState(true);

//   const plugins = useMemo(() => {
//     return [
//       timelineVis && {
//         plugin: TimelinePlugin,
//         options: {
//           container: "#timeline",
//         }
//       }
//     ].filter(Boolean);
//   }, [timelineVis]);

//   const wavesurferRef = useRef();
//   const handleWSMount = useCallback(
//     waveSurfer => {
//       wavesurferRef.current = waveSurfer;
//       if (wavesurferRef.current) {
//         wavesurferRef.current.load(url);
//         if (window) {
//           window.surferidze = wavesurferRef.current;
//         }
//       }
//     },
//     []
//   );

//   return (
//     <div>
//       <WaveSurfer
//         plugins={plugins}
//         onMount={handleWSMount}
//       >
//         <WaveForm
//           id="waveform"
//         >
//         </WaveForm>
//         <div id="timeline" />
//       </WaveSurfer>
//     </div>
//   );
// }

// export default Waveform;

import { green } from "@material-ui/core/colors";
import React, { useRef, useEffect } from "react";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Waveform({ url, index }) {
  const waveformRef = useRef();
  const wavesurfer = useRef(null);

  const [playing, setPlay] = useState(false);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
    console.log("playing", url);
  };
  const getColor = () => {
    if (index % 3 == 0) {
      return "red";
    } else if (index % 3 == 1) {
      return "blue";
    } else return "green";
  };

  const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: getColor(),
    progressColor: "#6646e7",
    cursorColor: "transparent",
    barWidth: 5,
    barRadius: 3,
    responsive: true,
    height: 20,
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: true,
  });

  useEffect(() => {
    async function fetchData() {
      const options = formWaveSurferOptions(waveformRef.current);
      wavesurfer.current = WaveSurfer.create(options);
      await wavesurfer.current.load(url);
    }

    fetchData();
  }, []);

  return (
    <>
      <div ref={waveformRef}></div>
      {/* <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button> */}
    </>
  );
}
