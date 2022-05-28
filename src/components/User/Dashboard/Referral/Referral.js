import React, { useEffect, useState } from "react";
import styles from "./Referral.module.css";
import image from "../../../../assets/images/images/referral.svg";
import { IconButton } from "@material-ui/core";
import FacebookIcon from "../../../../assets/images/icons/Referral/facebook.png";
import LinkedinIcon from "../../../../assets/images/icons/Referral/linkedin.png";
import TwitterIcon from "../../../../assets/images/icons/Referral/twitter.png";
import WhatsappIcon from "../../../../assets/images/icons/Referral/whatsapp.png";
import TelegramIcon from "../../../../assets/images/icons/Referral/telegram.png";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";

import baseDomain from "../../../common/baseDomain";
import { getLocal } from "../../../common/localStorageAccess";
import { useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

import DoneIcon from "../../../../assets/images/icons/Referral/done.svg";

function Referral() {
  const history = useHistory();

  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState([]);

  console.log(referrals);

  useEffect(() => {
    if (!getLocal("access_token")) {
      history.replace("/login");
    } else {
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/get_user_referrals`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
      })
        .then((response) => {
          const data = response.data.data;
          setReferralCode(data.user.referral_code);
          setReferrals(data.referrals);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [getLocal("access_token")]);

  return (
    <div className={styles.container}>
      <div className={styles.referral_top}>
        <div className={styles.top_left}>
          <img src={image} className={styles.img} alt="image" />
          <h1>EDUCATION IS EVOLVING</h1>
        </div>
        <div className={styles.top_right}>
          <p className={styles.subhead}>DON’T LEAVE YOUR FRIENDS BEHIND!</p>
          <h1 className={styles.heading}>
            INVITE FRIENDS AND <br /> LEARN TOGETHER
          </h1>
          <p className={styles.text}>
            {" "}
            Share your unique link and via Email and twitter and get free E-book
            for each friend who signs up
          </p>

          <div className={styles.inputBox}>
            <div>{referralCode}</div>

            <IconButton
              className={styles.copyBtn}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.hostname}/login?referral_code=${referralCode}`
                );
                swal("Success", "Link copied successfully.", "success");
              }}
            >
              {/* <CopyIcon /> */}
              <i className="far fa-copy"></i>
            </IconButton>
          </div>

          <div className={styles.shareBox}>
            <FacebookShareButton
              quote="Join BeyondExams and Learn things in awesome way."
              url={`${window.location.hostname}/login?referral_code=${referralCode}`}
            >
              <div className={styles.social_icon}>
                <img src={FacebookIcon} alt="social_icon" />
              </div>
            </FacebookShareButton>

            <TwitterShareButton
              title="Join BeyondExams and Learn things in awesome way."
              url={`${window.location.hostname}/login?referral_code=${referralCode}`}
            >
              <div className={styles.social_icon}>
                <img src={TwitterIcon} alt="social_icon" />
              </div>
            </TwitterShareButton>

            <LinkedinShareButton
              title="Join BeyondExams and Learn things in awesome way."
              url={`${window.location.hostname}/login?referral_code=${referralCode}`}
            >
              <div className={styles.social_icon}>
                <img src={LinkedinIcon} alt="social_icon" />
              </div>
            </LinkedinShareButton>

            <TelegramShareButton
              title="Join BeyondExams and Learn things in awesome way."
              url={`${window.location.hostname}/login?referral_code=${referralCode}`}
            >
              <div className={styles.social_icon}>
                <img src={TelegramIcon} alt="social_icon" />
              </div>
            </TelegramShareButton>

            <WhatsappShareButton
              title="Join BeyondExams and Learn things in awesome way."
              url={`${window.location.hostname}/login?referral_code=${referralCode}`}
              separator=" :: "
            >
              <div className={styles.social_icon}>
                <img src={WhatsappIcon} alt="social_icon" />
              </div>
            </WhatsappShareButton>
          </div>
        </div>
      </div>
      <div className={styles.referral_bottom}>
        <h1 className={styles.bottomHead}>WHAT DO YOU GET</h1>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div
              className={`${styles.number} ${
                referrals?.length >= 1 && styles.done
              }`}
            >
              {referrals?.length >= 1 ? <img src={DoneIcon} alt="icon" /> : "1"}
            </div>
            <div
              className={`${styles.dashed_line} ${styles.line1} ${
                referrals?.length >= 1 && styles.ok
              }`}
            ></div>
            <p>1 Friend: Thank you email!</p>
          </div>

          <div className={styles.step}>
            <div
              className={`${styles.number} ${
                referrals?.length >= 5 && styles.done
              }`}
            >
              {referrals?.length >= 5 ? <img src={DoneIcon} alt="icon" /> : "2"}
            </div>
            <div
              className={`${styles.dashed_line} ${styles.line2} ${
                referrals?.length >= 5 && styles.ok
              }`}
            ></div>
            <p>5 Friends: Shoutout on social media!</p>
          </div>

          <div className={styles.step}>
            <div
              className={`${styles.number} ${
                referrals?.length >= 10 && styles.done
              }`}
            >
              {referrals?.length >= 10 ? (
                <img src={DoneIcon} alt="icon" />
              ) : (
                "3"
              )}
            </div>
            <p>10 Friends: BeyondExams T-Shirt</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Referral;
