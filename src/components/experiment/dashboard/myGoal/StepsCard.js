import React from 'react';
import "./StepsCard.css";
import Slider from "@material-ui/core/Slider";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Fire from "../asset/fire.png";
import Period from "../asset/period.png";
import Lock from "../asset/lock.png";

function StepsCard() {

  const percentage = 80;
  const percentage1 = 100;
  const percentage2 = 0;

  return (
    <div className="stepsCard">
        <div className="stepsCardTop">
            <p>Just a few more steps left. <span>👇🏻</span></p>
        </div>

        <div className="stepsCardBottom">
            <div className="stepsProgressDiv">
                <div className="stepsProgress">
                    <CircularProgressbar value={percentage1} text={"Day 1"} styles={buildStyles({pathColor: "#FEBE16",textColor: '#FEBE16',trailColor: "#f1eeee",})} />
                    <div>
                        <img src={Fire} alt="" />
                    </div>
                </div>
                <div className="stepsProgress">
                    <CircularProgressbar value={percentage} text={"Day 2"} styles={buildStyles({pathColor: "#FEBE16",textColor: '#FEBE16',trailColor: "#f1eeee",})} />
                    <div>
                        <img src={Period} alt="" />
                    </div>
                </div>
                <div className="stepsProgress">
                    <CircularProgressbar value={percentage2} text={"Day 3"} styles={buildStyles({pathColor: "#FEBE16",textColor: '#FEBE16',trailColor: "#f1eeee",})} />
                    <div>
                        <img src={Lock} alt="" />
                    </div>
                </div>
                <div className="stepsProgress">
                    <CircularProgressbar value={percentage2} text={"Day 4"} styles={buildStyles({pathColor: "#FEBE16",textColor: '#FEBE16',trailColor: "#f1eeee",})} />
                    <div>
                        <img src={Lock} alt="" />
                    </div>
                </div>
                <div className="stepsProgress">
                    <CircularProgressbar value={percentage2} text={"Day 5"} styles={buildStyles({pathColor: "#FEBE16",textColor: '#FEBE16',trailColor: "#f1eeee",})} />
                    <div>
                        <img src={Lock} alt="" />
                    </div>
                </div>
            </div>

            <div className="slider">
                <Slider defaultValue={30} />
            </div>
        </div>
    </div>
  )
}

export default StepsCard;