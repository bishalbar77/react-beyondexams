import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Language";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import Alert from "@material-ui/lab/Alert";
import React, { Component } from "react";
import swal from "sweetalert";
import { ReactComponent as Delete } from "../../../../../assets/images/icons/delete.svg";
import { ReactComponent as Edit } from "../../../../../assets/images/icons/edit.svg";
import { ReactComponent as Private } from "../../../../../assets/images/icons/private.svg";
import { NotificationPermission, Post } from "../../../../common/common.js";
import { getLocal } from "../../../../common/localStorageAccess";
import { ChangePrivacy, DeleteVideoNote, GetVideoAnnotations } from "../../../../common/videocommon.js";
import { notify } from "../../../Navbar/notify";
import { NOTES_ADDITION_KEYS } from "../../Course/globalData";
import Share from "../Share";
import Note from "./Note";
import ShareIcon from "@material-ui/icons/Share";
import NotificationAlert from "../../NotificationAlert/NotificationAlert";

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
  },
});

class NotesTab extends Component {
  state = {
    notesText: "",
    isPublic: 1,
    open: null,
    id: null,
    content: "",
    annoArr: [],
    loading: true,
    time: 0,
    isOpen: true,
    isNotificationModalOpen: false,
  };

  editContent = async (id, content) => {
    this.setState({ id: id, content: content });
  };
  componentDidMount = async () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    const videoId = this.props.id;
    this.interval = setInterval(async () => {
      if (this.props.playerRef.current) {
        let t = await this.props.playerRef.current.internalPlayer.getCurrentTime();
        this.setState({
          time: Math.trunc(t),
        });
      }
    }, 500);

    if (course_slug) {
      const getVideoAnnotations = await GetVideoAnnotations(videoId);
      this.setState({
        annoArr: getVideoAnnotations.data.data,
        loading: false,
      });
    } else {
      this.setState({ loading: false, annoArr: this.props.video.annotations });
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.id !== this.props.id) {
      clearInterval(this.interval);
      this.setState({ loading: true, time: 0 });
      const query = new URLSearchParams(window.location.search);
      const course_slug = query.get("course");
      const videoId = this.props.id;

      if (course_slug) {
        const getVideoAnnotations = await GetVideoAnnotations(videoId);
        this.setState({
          annoArr: getVideoAnnotations.data.data,
          loading: false,
        });
      } else {
        this.setState({ loading: false, annoArr: this.props.video.annotations });
      }
    }
  };
  componentWillUnmount = async () => {
    clearInterval(this.interval);
  };

  handleState = (obj) => {
    this.setState(obj);
  };

  handleDropDownClose = (index) => {
    this.setState({
      open: null,
    });
  };
  handleDropDownClick = (value) => {
    this.setState({ isPublic: value });
    this.handleDropDownClose();
  };

  handleChange = (e) => {
    this.setState({
      notesText: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
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
      let annoData = await Post(1, "add_video_annotations", {
        video_url: this.props.id,
        annotation: this.state.notesText,
        video_timestamp: this.state.time,
        is_public: this.state.isPublic,
      });
      // this.props.handleAnnotationChange();
      if (annoData) {
        const newArr = [...this.state.annoArr, annoData.data.data];
        this.setState({
          annoArr: newArr,
          notesText: "",
        });
        notify(`🔑 You got ${NOTES_ADDITION_KEYS} bonus keys for creating notes!`);

        setTimeout(() => {
          this.setState({ isNotificationModalOpen: true });
        }, 3000);

        // if(!newArr[1]){
        //   setTimeout(() => {
        //     this.setState({ isNotificationModalOpen: true })
        //   }, 3000);
        // }
      }
    }
  };
  formatTime(secs) {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    return [hours, minutes, seconds]
      .map((v) => ("" + v).padStart(2, "0"))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }
  seekVideo = (event, time) => {
    event.stopPropagation();
    this.props.playerRef.current.internalPlayer.seekTo(time);
    this.props.playerRef.current.internalPlayer.playVideo();
  };

  bgColor = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "bg-color-blue";
    } else if (num === 1) {
      return "bg-color-green";
    } else if (num === 2) {
      return "bg-color-yellow";
    }
  };

  handleNotify = () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    if (localStorage.getItem("access_token") && course_slug) {
      NotificationPermission(course_slug);
    }
    this.setState({ isNotificationModalOpen: false });
  };

  render() {
    const { classes } = this.props;
    return this.state.loading ? (
      <></>
    ) : (
      <>
        <div className="ui segment">
          <NotificationAlert
            isOpen={this.state.isNotificationModalOpen}
            setIsOpen={() => this.setState({ isNotificationModalOpen: false })}
            handleNotify={this.handleNotify}
          />
          <div className="post-comment-div">
            <div className="flex-column-start" style={{ marginLeft: "60px", zIndex: "2" }}>
              <div
                className="notes-dropdown"
                onClick={(e) => {
                  this.setState({ open: e.currentTarget });
                }}
              >
                <div className="flex">
                  {this.state.isPublic ? (
                    <LanguageIcon className={classes.privacyIcon} />
                  ) : (
                    <Private className={classes.privacyIcon} />
                  )}
                  <p style={{ fontSize: "12px" }}>{this.state.isPublic ? "Public" : "Private"}</p>
                  <ExpandMoreIcon style={{ fontSize: "18px" }} />
                </div>
              </div>

              <Popper
                open={Boolean(this.state.open)}
                anchorEl={this.state.open}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <div className="drop-list">
                      <ClickAwayListener onClickAway={this.handleDropDownClose}>
                        <MenuList id="privacy-list">
                          <MenuItem onClick={() => this.handleDropDownClick(1)}>
                            <LanguageIcon className={classes.privacyIcon2} />
                            Public
                          </MenuItem>
                          <MenuItem onClick={() => this.handleDropDownClick(0)}>
                            <Private className={classes.privacyIcon2} />
                            Private
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </div>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>

          <div className="key-info" style={{ transform: "translateX(62px)" }}>
            <p>Earn {NOTES_ADDITION_KEYS} bonus key.</p>
          </div>

          <div className="note-input">
            <div className="note-profile-image">
              <img
                alt=""
                src={
                  getLocal("avatar") && getLocal("access_token")
                    ? `${getLocal("avatar")}`
                    : `https://cdn0.iconfinder.com/data/icons/social-media-network-4/48/male_avatar-512.png`
                }
              />
            </div>
            <Paper
              elevation={0}
              component="form"
              onSubmit={this.handleSubmit}
              className={`${classes.root} ${this.state.notesText ? classes.rootBgActive : classes.rootBg}`}
            >
              <p className={this.state.notesText ? "note-time-with-input-show" : "note-time-with-input"}>
                {this.formatTime(this.state.time)}
              </p>
              <InputBase
                onChange={this.handleChange}
                multiline
                value={this.state.notesText}
                className={classes.input}
                placeholder={`Create a new note at ${this.formatTime(this.state.time)}`}
                required
              />
              <div className={`${classes.iconButtonDiv} ${this.state.notesText ? classes.BgActive : ""}`}>
                <IconButton
                  type="submit"
                  className={this.state.notesText ? classes.IconButtonActive : classes.IconButton}
                >
                  <SendRoundedIcon fontSize="small" style={{ fontSize: "18px" }} />
                </IconButton>
              </div>
            </Paper>
          </div>
          <div className="ui relaxed divided list">
            {this.state.annoArr.length === 0 ? (
              <p style={{ marginTop: "20px" }}>Notes Not available</p>
            ) : (
              this.state.annoArr.map((note, index) => (
                <Note
                  note={note}
                  index={index}
                  classes={classes}
                  annoArr={this.state.annoArr}
                  key={note.id}
                  handleSeek={(e) => this.seekVideo(e, note.video_timestamp)}
                  id={this.state.id}
                  handleState={this.handleState}
                  content={this.state.content}
                  formatTime={this.formatTime}
                  bgColor={this.bgColor}
                  handleAnnoDelete={(newArr) =>
                    this.setState({
                      annoArr: newArr,
                    })
                  }
                  onCLick={(e) => e.stopPropagation()}
                  slug={this.props.slug}
                  share={this.props.share}
                  title={this.props.video.title
                    .replace(/&#39;/g, "'")
                    .replace(/&amp;/g, "&")
                    .replace(/&quot;/g, "'")}
                />
              ))
            )}
          </div>
        </div>
        {this.state.time >= 10 && (
          <Snackbar
            open={this.state.isOpen}
            // autoHideDuration={4000}
            onClose={() => {
              this.setState({ isOpen: false });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              variant="filled"
              severity="success"
              className={classes.paper}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    this.setState({ isOpen: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" className="share-close-icon" />
                  <i className="fas fa-info share-open-icon"></i>
                </IconButton>
              }
            >
              <Share
                isVideo={true}
                share={this.props.share}
                title={this.props.video.title
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              >
                Did you like this video? Help your friends learn with you! <br />
                <p
                  style={{
                    fontSize: 10,
                    cursor: "pointer",
                    fontWeight: 300,
                    color: "rgb(255 255 255 / 88%)",
                    textTransform: "capitalize",
                    marginTop: 5,
                  }}
                >
                  Share with friends.
                </p>
              </Share>
            </Alert>
          </Snackbar>
        )}
      </>
    );
  }
}
export default withStyles(useStyles)(NotesTab);

class IsolatedMenu extends Component {
  state = { open: null, isOpen: false };
  deleteContent = async (id) => {
    swal("Note Delete", "Are you sure you want to delete this note?", "warning", {
      buttons: true,
      dangerMode: true,
    }).then(async (ok) => {
      if (ok) {
        await DeleteVideoNote(id);
        const newArr = this.props.annoArr.filter((e) => e.id !== id);
        this.props.handleAnnoDelete(newArr);
      }
    });
  };
  changePrivacy = async (value, id) => {
    if (value === 0)
      swal("Privacy Update", "Are you sure you want to make this note private?", "warning", {
        buttons: true,
        dangerMode: true,
      }).then(async (ok) => {
        if (ok) {
          await ChangePrivacy(value, id);
          const newArr = this.props.annoArr.map((e) => {
            if (e.id === id) return { ...e, is_public: value };
            else return e;
          });
          this.props.handleAnnoDelete(newArr);
        }
      });
    else
      swal("Privacy Update", "Are you sure you want to make this note public?", "warning", {
        buttons: true,
        dangerMode: true,
      }).then(async (ok) => {
        if (ok) {
          await ChangePrivacy(value, id);
          const newArr = this.props.annoArr.map((e) => {
            if (e.id === id) return { ...e, is_public: value };
            else return e;
          });
          this.props.handleAnnoDelete(newArr);
        }
      });
  };
  handleClick = (e) => {
    e.stopPropagation();

    this.setState({ isOpen: true });
  };
  render() {
    let note = this.props.note;
    let classes = this.props.classes;
    let url = new URL(window.location.href);
    url.searchParams.set("note_slug", note.id);
    let share = url.href;

    return (
      <div>
        <IconButton
          onClick={(e) => {
            this.setState({ open: e.currentTarget });
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Popper
          id={note.id}
          open={Boolean(this.state.open)}
          anchorEl={this.state.open}
          transition
          disablePortal
          placement="left-start"
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <div className="drop-list">
                <ClickAwayListener
                  onClickAway={() => {
                    this.setState({ open: null });
                  }}
                >
                  <MenuList>
                    <MenuItem onClick={this.handleClick} className={classes.menu}>
                      <ShareIcon className={classes.icon2} />
                      Share
                    </MenuItem>

                    {localStorage.getItem("phoenix_user_id") === note.user_id.toString() && (
                      <>
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            this.props.editContent(note.id, note.annotation);
                            this.setState({ open: null });
                          }}
                          className={classes.menu}
                        >
                          <Edit className={classes.icon2} />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            this.deleteContent(note.id);
                          }}
                          className={classes.menu}
                        >
                          <Delete className={classes.icon2} />
                          Delete
                        </MenuItem>
                        {!note.is_public ? (
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              this.changePrivacy(1, note.id);
                            }}
                            className={classes.menu}
                          >
                            <LanguageIcon className={classes.icon2} />
                            Make public
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              this.changePrivacy(0, note.id);
                            }}
                            className={classes.menu}
                          >
                            <Private className={classes.icon2} />
                            Make private
                          </MenuItem>
                        )}
                      </>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </div>
            </Grow>
          )}
        </Popper>
        {this.state.isOpen && (
          <Share
            share={share}
            title={this.props.title}
            open={this.state.isOpen}
            close={() => {
              this.setState({ isOpen: false });
            }}
          />
        )}
      </div>
    );
  }
}
export { IsolatedMenu };
