import React from "react";
import channelsData from "../../utils/channelsData";
import LeftChannelCard from "./LeftChannelCard";
import RightChannelCard from "./RightChannelCard";
import styles from "./YoutubeFeatures.module.css";

const YoutubeFeatures = () => {
  return (
    <div className={styles.features}>
      <div className={styles.features__left}>
        {channelsData.map((channel) => (
          <LeftChannelCard key={channel.id} channel={channel} id={channel.id} />
        ))}
      </div>
      <div className={styles.features__right}>
        <h3>Featured Youtube Channels</h3>
        <div className={styles.features__rightContainer}>
          {channelsData.map((channel) => (
            <RightChannelCard key={channel.id} channel={channel} id={channel.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default YoutubeFeatures;
