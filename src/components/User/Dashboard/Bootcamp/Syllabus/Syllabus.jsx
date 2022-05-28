import React from "react";
import Accordion from "./Accordion";
import styles from "./Syllabus.module.css";
import Point from "../../../../../assets/images/icons/point.png";
// import { ReactComponent as Video } from "./asset/Video.svg";

export default function Syllabus({ modules }) {

  return (
    <div className={styles.root} id="bar_ref">
      <h2>Syllabus</h2>
      <p>
        Best course content delivered by leading faculty and industry experts in the form of On-Demand Videos and
        Projects.
      </p>
      <div className={styles.content}>
        {modules.map((e, i) => (
          <>
            {console.log(e)}

            <Accordion 
              index={i} 
              videos={e.videos} 
              title={e.title} 
              notes={e.notes}
              live_classes={e.live_classes}
              // icon={<Video />} 
            />

            {i != modules.length - 1 && <hr />}
          </>
        ))}
      </div>
    </div>
  );
}
