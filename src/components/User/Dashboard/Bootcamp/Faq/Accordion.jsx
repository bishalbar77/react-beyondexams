import React, { useState } from "react";
import styles from "./Accordion.module.css";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
export default function Accordion({ question, answer }) {
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive((prevActive) => setActive(!prevActive));
  };
  return (
    <>
      <button class={styles.accordion + " " + (active ? styles.active : "")} onClick={handleClick}>
        <ArrowRightIcon fontSize="inherit" />
        <div>{question}</div>
      </button>

      <div class={styles.panel + " " + (active ? styles.panelActive : "")}>
        <p>{answer.replace(/\\n/g, "\n")}</p>
      </div>
    </>
  );
}
