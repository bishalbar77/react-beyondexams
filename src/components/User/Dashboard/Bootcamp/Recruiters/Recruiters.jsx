import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import styles from "./Recruiters.module.css";
import reliance from "../../../../../assets/images/icons/reliance.png";
import essar from "../../../../../assets/images/icons/essar.png";
import tata from "../../../../../assets/images/icons/tata.png";
import accenture from "../../../../../assets/images/icons/accenture.png";
import amazon from "../../../../../assets/images/icons/amazon.png";

export default function Recruiters() {
  return (
    <div className={styles.root}>
      <div className="home-collaborate">
        <h2 className={styles.heading}>Potential Recruiters</h2>
        <div className="h_c_main flex-center" style={{ height: "auto" }}>
          <Tabs variant="scrollable" value={false} scrollButtons="on" textColor="primary">
            <Tab label={<img src={reliance} alt=""></img>} component="div" disableRipple />
            <Tab label={<img src={essar} alt=""></img>} component="div" disableRipple />
            <Tab label={<img src={tata} alt=""></img>} component="div" disableRipple />
            <Tab label={<img src={accenture} alt=""></img>} component="div" disableRipple />
            <Tab label={<img src={amazon} alt=""></img>} component="div" disableRipple />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
