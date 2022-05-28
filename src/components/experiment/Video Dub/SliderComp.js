import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import PauseIcon from "@material-ui/icons/Pause";
import IconButton from "@material-ui/core/IconButton";
// import {ReactComponent as Delete} from "./asset/Vectordelete.svg"
import { ReactComponent as Play } from "./asset/Vector-small-play.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "auto",
  },
}));

function SliderComp({
  title,
  slideTime,
  type,
  max,
  handleSliderTime,
  sliderHide,
  play,
  pause,
  playing,
}) {
  const classes = useStyles();
  // const [value, setValue] = React.useState(slideTime || [0,0]);

  const handleChange = (event, newValue) => {
    // setValue([value[0], newValue[1]]);
    if (type === "video") handleSliderTime(newValue);
  };

  slideTime = [Math.floor(slideTime[0]), Math.floor(slideTime[1])];

  return (
    <div className="SliderComp-container">
      <p>{title}</p>
      <div className={`${classes.root} slider-div-${type}`}>
        {sliderHide ? null : (
          <Slider
            value={slideTime}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={max}
          />
        )}
      </div>
      {/* <IconButton
        aria-label="play"
        className="makeStyles-margin-1"
        onClick={playing?pause:play}
      >
        {playing ? <PauseIcon fontSize="small" /> : <Play fontSize="small" />}
      </IconButton> */}
    </div>
  );
}

export default SliderComp;
