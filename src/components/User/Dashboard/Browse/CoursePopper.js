import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import ShareIcon from "@material-ui/icons/Share";
import Dots from "../../../../assets/images/icons/more.svg";
import ShareDialog from "../Videos/Share";
import store from "../../../../store";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { withRouter } from "react-router-dom";
import { Post } from "../../../common/common";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/browse.css";

const useStyles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #C4C4C4",
    borderRadius: "24px",
    minHeight: "42px",
    background: "#FAFAFA",
    flex: 1,
    overflow: "hidden",
  },

  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
    padding: "6px 0 4px",
    fontSize: "14px",
  },

  iconButtonDiv: {
    marginRight: "2px",
    height: "36px",
    width: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginBottom: "2px",
    borderRadius: "50%",
    background: "#DDD4FE",
    "&:hover": {
      background: "var(--color1)",
      color: "white",
    },
    "&:hover svg": {
      background: "var(--color1)",
      color: "white",
    },
  },
  BgActive: {
    background: "var(--color1)",
  },
  IconButton: {
    padding: "6px 4px 6px 9px",
    "&:hover": {
      color: "white",
    },
  },
  IconButtonActive: {
    padding: "6px 4px 6px 9px",
    color: "white",
  },
  privacyIcon: {
    fontSize: "12px",
    width: "16px",
    height: "16px",
    marginRight: "5px",
    alignSelf: "baseline",
    marginTop: "1px",
    color: "var(--color1)",
  },
  privacyIcon2: {
    fontSize: "12px",
    marginRight: "8px",
    marginBottom: "2px",
    color: "var(--color1)",
    width: "16px",
    height: "16px",
  },
  // menu: {
  //   "&:hover svg": {
  //     color: "var(--color1)",
  //   },
  // },
  icon2: {
    fontSize: "12px",
    marginRight: "8px",
    marginBottom: "2px",
    width: "16px",
    height: "16px",
    color: "black",
  },
  popWrapper: {
    transform: "translate3d(-80px, 0px, 0px)",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px #00000050",
    color: "black",
  },
});

class CoursePopper extends Component {
  state = { open: null, dialogOpen: false };
  openShareDialog = (e) => {
    e.stopPropagation();
    this.setState({
      dialogOpen: true,
    });
  };
  closeShareDialog = () => {
    this.setState({
      dialogOpen: false,
    });
  };
  shareURL = () => {
    if (this.props.course.video_count > 0) {
      return `${window.location.origin}/dashboard/course/${encodeURIComponent(this.props.course.slug)}`;
    } else
      return `${window.location.origin}/dashboard/browse?level=${this.props.course.level + 1}&parent=${
        this.props.course.id
      }&type=classes`;
  };
  handleReportClick = (e) => {
    e.stopPropagation();
    store.dispatch({ type: "SHOW_SUCCESS", message: "Course Reported" });
    this.setState({ open: false });
  };
  removeCourse = (e) => {
    e.stopPropagation();
    swal({
      title: "Remove Course",
      text: "Are you sure you want to remove this course?",
      icon: "warning",
      buttons: ["NO", "YES"],
      dangerMode: true,
    }).then((ok) => {
      if (ok) {
        Post(1, "remove_category", { category_id: this.props.course.id }).then(() => {
          store.dispatch({ type: "SHOW_SUCCESS", message: "Course Removed" });
          window.location.reload();
        });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={{ position: "relative" }}>
        <img
          className="studentsDots"
          src={Dots}
          alt=""
          onClick={(event) => {
            event.stopPropagation();
            this.setState({ open: event.currentTarget });
          }}
        />
        <Popper
          open={Boolean(this.state.open)}
          anchorEl={this.state.open}
          transition
          disablePortal
          placement="left-start"
          style={{ zIndex: 1 }}
          className={classes.popWrapper}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <div className="drop-list">
                <ClickAwayListener
                  onClickAway={(e) => {
                    e.stopPropagation();
                    this.setState({ open: null, dialogOpen: false });
                  }}
                >
                  <MenuList>
                    <MenuItem onClick={this.openShareDialog}>
                      <ShareIcon className={classes.icon2} />
                      Share
                      <ShareDialog
                        share={this.shareURL()}
                        title={this.props.course.title}
                        open={this.state.dialogOpen}
                        close={this.closeShareDialog}
                      />
                    </MenuItem>

                    <MenuItem onClick={(e) => this.handleReportClick(e)}>
                      <FlagOutlinedIcon className={classes.icon2} /> Report
                    </MenuItem>
                    {this.props.course.creator?.id.toString() === localStorage.getItem("phoenix_user_id") && (
                      <MenuItem onClick={(e) => this.removeCourse(e)}>
                        <DeleteOutlineIcon className={classes.icon2} />
                        Delete
                      </MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </div>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}
export default withStyles(useStyles)(withRouter(CoursePopper));
