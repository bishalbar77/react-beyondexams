import React from 'react';
import styles from "./InviteCard.module.css";
import BEIcon from "../asset/beIcon.svg";
import Connect from "../asset/connect.svg";

function InviteCard() {
  return (
    <div className={styles.inviteCard}>
        <div className={styles.inviteCardContainer}>
            <h3>Invite your Friends</h3>
            <p>Refer your friends and win</p>

            <div className={styles.inviteContainer}>
                <div>
                    <div className={styles.inviteTshirt}>
                        <img src={BEIcon} alt="" />
                        <p>T-shirts!</p>
                    </div>
                    <button className={styles.inviteBtn}>INVITE</button>
                </div>

                <img src={Connect} alt="" />
            </div>
        </div>
    </div>
  )
}

export default InviteCard;