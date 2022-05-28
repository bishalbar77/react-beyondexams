import Skeleton from "@material-ui/lab/Skeleton";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import KlapzPause from "./KlapzPause";
import TabMenu from "./TabMenu";

const styles = () => ({
  paper: {},
});

class VideoDetail extends Component {
  state = {
    open: false,
    isHover: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // getSnapshotBeforeUpdate = async (prevProps) => {
  //   if (prevProps.video.url !== this.props.video.url) {
  //     if (localStorage.getItem("access_token") && this.play) {
  //       console.log("Beforee ", prevProps.video.url, " ", this.props.video.url);
  //       await this.saveToHistory();
  //     }
  //   }
  // };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.props.loading ? (
          <>
            <TabMenu
              // key={this.props.video.url}
              playerRef={this.props.playerRef}
              time={this.props.time}
              video={this.props.video}
              share={this.props.share}
              handleTabSelect={this.props.handleTabSelect}
              tabSelected={this.props.tabSelected}
              handleStarChange={this.props.handleStarChange}
              slug={this.props.slug}
            />
            <KlapzPause open={this.state.open} handleClose={this.handleClose} />
          </>
        ) : (
          <div className="margin-top-10">
            <div className="video-tabs">
              {Array.from(Array(5).keys()).map(() => (
                <div className="video_tab_loader">
                  <Skeleton variant="rect" width={"100%"} height={"100%"} />
                </div>
              ))}
            </div>
            <div className="ui segment tab_main_loader">
              <Skeleton variant="rect" width={"100%"} height={300} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

VideoDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VideoDetail);
