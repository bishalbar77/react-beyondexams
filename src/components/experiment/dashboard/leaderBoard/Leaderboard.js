import React, { useEffect, useState } from 'react';
import styles from "./Leaderboard.module.css";
import LeaderIcon from "../asset/leaderPurple.svg";
import First from "../asset/first.svg";
import Second from "../asset/second.svg";
import Third from "../asset/third.svg";
import Crown from "../asset/crown.svg";
import RankCard from './RankCard';
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function Leaderboard() {

    const [details, setDetails] = useState([]);

    useEffect(() => {
        axios
        .get(`${baseDomain.route}${baseDomain.subRoute}/get_leaderboard_students`)
        .then((res) => {
            console.log(res.data.data.data);
            setDetails(res.data.data.data);
        })
        .catch((e) => {
            console.log(e);
            // swal("Error", e.response.data.message, "error");
        });
    }, []);

    // const splitName = (firstName) => {
    //     let studentName = firstName;
    //     var name = [];
    //     var name = studentName.split(' ');
    //     console.log(name[0]);
    // }

    // splitName("Pankaj Rohila")

  return (
    <div className={styles.leaderboard}>
        <div className={styles.leaderHeading}>
            <img src={LeaderIcon} alt="icon" />
            <p>Leaderboard</p>
        </div>

        <div className={styles.leaderEarned}>
            <p>Earned Badges</p>
            <h3>Earned certificates</h3>
            <p>Streak</p>
        </div>

        <div className={styles.leaderWin}>
            <div className={styles.leaderThird}>
                <img className={styles.thirdImage} src={details[2]?.user.avatar} alt="" />
                <div className={styles.leaderNumber}>
                    <h3>3</h3>
                </div>
                {/* <p>Prasad</p> */}
                <p>{details[2]?.user.name}</p>
                <img src={Third} alt="" />
            </div>

            <div className={styles.leaderFirst}>
                <div className={styles.crownImage}>
                    <img src={Crown} alt="" />
                </div>
                <div className={styles.firstImageDiv}>
                    <img className={styles.firstImage} src={details[0]?.user.avatar} alt="" />
                </div>
                <div className={styles.leaderNumber}>
                    <h3>1</h3>
                </div>
                <p>{details[0]?.user.name}</p>
                <img src={First} alt="" />
            </div>

            <div className={styles.leaderSecond}>
                <img className={styles.secondImage} src={details[1]?.user.avatar} alt="" />
                <div className={styles.leaderNumber}>
                    <h3>2</h3>
                </div>
                <p>{details[1]?.user.name}</p>
                <img src={Second} alt="" />
            </div>
        </div>

        <div className={styles.leaderRanks}>
            <p>Current Rank</p>
            <div className={styles.leaderRankCard}>
                {details.slice(3, 9).map((detail, index) => {
                    return (
                        <div key={index}>
                            <RankCard
                                rank={4}
                                profile={detail.user.avatar}
                                name={detail.user.name}
                                email={`${detail.user.name}@gmail.com`}
                                score="10" 
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Leaderboard;