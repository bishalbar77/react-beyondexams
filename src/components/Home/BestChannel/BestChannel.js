import React, { useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import { getBestChannels } from "../../../actions/browseActions";
// import Group1190 from "../../../assets/images/icons/Group-1190.png"
import Share from "./ShareChannel";
import Klapz from "../../User/Dashboard/Videos/Tab Components/Klapz";
import styles from "./BestChannel.module.css";

var jsonData = require("../home.json");

const BestChannel = () => {
  const dispatch = useDispatch(),
    bestChannels = useSelector((state) => state.browse.bestChannels),
    youtubePlayer = createRef(),
    youtubeOptns = {
      playerVars: {
        enablejsapi: 1,
        autoplay: 0,
        start: 0,
        //value in seconds
      },
    };
  useEffect(() => {
    // api here
    dispatch(getBestChannels());
    console.log(bestChannels?.[0]?.video?.title?.length);
  }, [bestChannels]);

  return (
    <div className="home-root">
      <div className={styles.channel}>
        <div className={styles.c_top}>
          <h5>{jsonData.sectionHeading.bestChannel}</h5>
          <Link to="/youtube-features" className={styles.c_hide}>
            Explore all
          </Link>
        </div>
        <div className={styles.c_main}>
          <div className={styles.c_main_left}>
            <div className={styles.c_main_left_top}>
              <a
                className={styles.c_icon}
                href={`https://www.youtube.com/channel/${bestChannels?.[0]?.channel_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={bestChannels?.[0]?.channel_icon} alt="channel-icon" />
              </a>
              <a
                className={styles.c_name}
                href={`https://www.youtube.com/channel/${bestChannels?.[0]?.channel_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>{bestChannels?.[0]?.channel_name}</h4>
              </a>
            </div>
            <p className={styles.c_desc}>{bestChannels?.[0]?.channel_description}</p>
            <div className={styles.c_actions}>
              <Share
                share={`https://www.youtube.com/channel/${bestChannels?.[0]?.channel_id}`}
                title={bestChannels?.[0]?.channel_name
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              >
                <div className={styles.video_tab}>Share</div>
              </Share>
              <Klapz id={bestChannels?.[0]?.video?.url}>
                <div style={{ textAlign: "center" }}>
                  <div className={styles.klapz_button}>
                    <img
                      src={require(`../../../assets/images/icons/${jsonData.images.klapz}`)}
                      className="klapz-icon"
                      alt=""
                    />
                    <p>Klapz</p>
                  </div>
                  <p className={styles.klapz_text}>{bestChannels?.[0]?.channel_name}</p>
                </div>
              </Klapz>
            </div>
          </div>
          <div className={styles.c_main_right}>
            <h5>{jsonData.sectionContent.popularChannel}</h5>
            <YouTube
              containerClassName={styles.c_player_parent}
              className={styles.c_player}
              videoId={bestChannels?.[0]?.video?.url}
              key={bestChannels?.[0]?.video?.url}
              ref={youtubePlayer}
              opts={youtubeOptns}
            />
            <div className={styles.c_video_details}>
              <h5 className={styles.c_video_title}>{bestChannels?.[0]?.video?.title}</h5>
              <p>
                {bestChannels?.[0]?.video?.views} {jsonData.sectionContent.views}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.c_bottom}>
          <Link to="/youtube-features">{jsonData.sectionContent.exploreChannel}</Link>
        </div>
      </div>
    </div>
  );
};

export default BestChannel;
