import React, { useEffect, useState } from "react";

const Module = (props) => {
  const [videos, setVideos] = useState([]);
  const [moduleTime, setModuleTime] = useState("");

  const sortVideos = () => {
    props.module.videos.sort(function (a, b) {
      return a.pivot.ordering - b.pivot.ordering;
    });
    console.log(props.module);
    setVideos([...props.module.videos]);
  };

  const calculateDuration = () => {
    let lcl_tt = Math.ceil(props.module.duration / 60);
    if (lcl_tt < 60) {
      setModuleTime(lcl_tt + " minutes");
    } else {
      let lcl_tt_h = Math.floor(lcl_tt / 60);
      let lcl_tt_m = lcl_tt % 60;
      if (lcl_tt_m !== 0) {
        lcl_tt_h === 1
          ? lcl_tt_m === 1
            ? setModuleTime(lcl_tt_h + " hour " + lcl_tt_m + " minute")
            : setModuleTime(lcl_tt_h + " hour " + lcl_tt_m + " minutes")
          : lcl_tt_m === 1
          ? setModuleTime(lcl_tt_h + " hours " + lcl_tt_m + " minute")
          : setModuleTime(lcl_tt_h + " hours " + lcl_tt_m + " minutes");
      } else {
        lcl_tt_h === 1
          ? setModuleTime(lcl_tt_h + " hour")
          : setModuleTime(lcl_tt_h + " hours");
      }
    }
  };

  useEffect(() => {
    // SORTING VIDEOS
    sortVideos();
    //duration logic
    calculateDuration();
  }, [props.module]);

  return <div>module</div>;
};

export default Module;
