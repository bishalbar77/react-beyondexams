import React from 'react'
import styles from "./Landing.module.css";

const FeatureCard = ({ feature }) => (
  <div className={styles.featureCard + " " + styles["id-" + (feature.id % 2)]}>
    <img src={feature.img} alt="" className={styles.featureCard__img} />
    <div className={styles.featureCard__content}>
      <h3 className={styles.featureCard__head}>{feature.head}</h3>
      <p className={styles.featureCard__text}>{feature.text}</p>
    </div>
  </div>
);

export default FeatureCard;
