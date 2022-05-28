import React from "react";
import styles from "./JobProspects.module.css";

export default function JobProspects() {
  return (
    <div className={styles.root}>
      <h2>
        Future Job <span>Prospects</span>
      </h2>
      <p>
        Look into yourself, get something in return as your achievement. Learn this skill for potential job
        opportunities
      </p>
      <div className={styles.main}>
        <ProspectsCard style={1} />
        <ProspectsCard style={2} />
        <ProspectsCard style={1} />
        <ProspectsCard style={2} />
        <ProspectsCard style={1} />
        <ProspectsCard style={2} />
      </div>
    </div>
  );
}
function ProspectsCard({ style }) {
  return (
    <div className={styles.card + " " + (style === 1 ? styles.cardOne : styles.cardTwo)}>
      <div className={styles.circle + " " + (style === 1 ? styles.circleOne : styles.circleTwo)}></div>
      <h3>IT consultant</h3>
      <p>
        An IT consultant is an experienced individual who provides expert advice for a fee. Such an individual may work
        as an independent contractor.
      </p>
    </div>
  );
}
