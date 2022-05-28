import React, { useEffect } from "react";
import styles from "./NotFound.module.css";
import ArtBoard from "../../../../assets/images/icons/artboard.png";
import { Link } from "react-router-dom";

export default function NotFound({ text, btnText, btnLink }) {
  useEffect(() => {
    var i = 0;
    var txt = text;
    var speed = 30;
    let timeout;
    console.log("mouuntt");
    typeWriter();

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("text").innerHTML += txt.charAt(i);
        i++;
        timeout = setTimeout(typeWriter, speed);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  });
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <h3 id="text" />
        {btnLink && <Link to={btnLink}>{btnText}</Link>}
      </div>
      <div className={styles.right}>
        <img src={ArtBoard} width="416" height="328" />
      </div>
    </div>
  );
}
