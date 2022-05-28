import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/TabMenu.css";
import { GiveRate } from "../../../common/videocommon.js";
import Details from "./Tab Components/Details";
import NotesTab from "./Tab Components/NotesTab";
import QuesAns from "./Tab Components/QuesAns";
import ReadingMaterial from "./Tab Components/ReadingMaterial/ReadingMaterial";
import Share from "./Share";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <>{children}</>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginTop: 10,
  },
  icon: {
    marginRight: "4px",
  },
  fishEye: {
    marginRight: "3px",
    fontSize: "8px",
  },
  bookmark: {
    width: "42px",
  },
  black: {
    color: "black",
  },
}));

export default function FullWidthTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.tabSelected || 0);
  const [starsCount, setStarsCount] = React.useState(props.video.total_rating_sum / props.video.total_times_rated || 0);

  const handleChange = (newValue) => {
    props.handleTabSelect(newValue);
    setValue(newValue);
  };
  const giveRate = async (newValue) => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        }
      });
    } else {
      setStarsCount(newValue);
      await GiveRate(props.video.url, newValue);
      props.handleStarChange(props.video.id, newValue, starsCount);
    }
  };

  return (
    <div className={classes.root}>
      <div className="video-tabs">
        <VideoTabs title="Overview" value={0} onSelect={handleChange} selectedTab={value} />
        <VideoTabs
          title="Notes"
          value={1}
          onSelect={handleChange}
          selectedTab={value}
          notification={props.video.num_notes}
          datauTut="notes"
        />
        <VideoTabs
          title="Reading Material"
          value={2}
          onSelect={handleChange}
          selectedTab={value}
          notification={props.video.num_reading_material}
        />
        <VideoTabs
          title="Q&A"
          value={3}
          onSelect={handleChange}
          selectedTab={value}
          notification={props.video.num_qna}
        />

        <Share
          share={props.share}
          isVideo={true}
          title={props.video.title
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, "'")}
        >
          <div className={`video_tab`} data-tut="share">
            Share
          </div>
        </Share>
      </div>
      <TabPanel value={value} index={0}>
        <Details props={props} starsCount={starsCount} classes={classes} giveRate={giveRate} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NotesTab
          playerRef={props.playerRef}
          id={props.video.url}
          video={props.video}
          slug={props.slug}
          share={props.share}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReadingMaterial video={props.video} slug={props.slug} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <QuesAns
          playerRef={props.playerRef}
          id={props.video.url}
          video={props.video}
          classes={classes}
          slug={props.slug}
        />
      </TabPanel>
    </div>
  );
}

const VideoTabs = ({ title, value, onSelect, selectedTab, notification, datauTut }) => {
  return (
    <div
      className={`video_tab ${selectedTab === value ? "video_tab_selected" : ""}`}
      onClick={() => onSelect(value)}
      data-tut={datauTut ? datauTut : undefined}
    >
      {title}
      {notification !== 0 && notification != undefined && <div className="tab_notification">{notification}</div>}
    </div>
  );
};
