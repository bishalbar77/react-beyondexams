import React from 'react';
import styles from "./RankCard.module.css";

function RankCard({ rank, profile, name, email, score  }) {
  return (
    <div className={styles.rankCard}>
        <div className={styles.rankCardLeft}>
            <h4>{rank}</h4>
            <img src={profile} alt="" />
            <div className={styles.rankCardNames}>
                <h5>{name}</h5>
                <p>{email}</p>
            </div>
        </div>
        <div className={styles.rankCardRight}>
            <p>{score}</p>
        </div>
    </div>
  )
}

export default RankCard;