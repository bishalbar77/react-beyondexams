import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React, { useState } from "react";
import store from "../../../../../store";
import { Post, swalWithAuth } from "../../../../common/common";
import styles from "../../Browse/NewCourse/AboutCourse/AboutCourse.module.css";
const useStyles = makeStyles((theme) => ({
  dialogBG: {
    width: "450px",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    marginTop: "8px",
    background: "#fafafa",
    border: "1px solid #686868",
    borderRadius: "20px",
    width: "100%",
    padding: "8.5px 15px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1d1d1d",
  },
  items: {
    display: "inline-block",
    marginRight: "5px",
    cursor: "pointer",
  },
  inputKeyword: {
    outline: "none",
    border: "none",
    fontSize: "14px",
    width: "100%",
    backgroundColor: "#fafafa",
  },
  tag: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 8px",
    background: "#E8E8E8",
    borderRadius: "38px",
    height: "30px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1D1D1D",
    margin: "3px 0px",
  },
}));

export default function RequestCourse({ course }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = React.useState([]);
  const [input, setInput] = React.useState("");

  const [keyError, setKeyError] = React.useState("");
  const handleRequestCourse = () => {
    if (localStorage.getItem("access_token")) {
      setOpen(true);
    } else {
      swalWithAuth("Please Login before requesting a course", 1);
    }
  };
  const handleRemoveItem = (index) => {
    return () => {
      setKeywords(keywords.filter((word, i) => i !== index));
    };
  };
  const handleInputChange = (evt) => {
    setInput(evt.target.value);
    // validated();
  };

  const handleInputKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      const { value } = evt.target;

      setKeywords([...keywords, value]);
      setKeyError("");
      setInput("");
    }

    if (keywords.length && evt.keyCode === 8 && !input.length) {
      setKeywords(keywords.slice(0, keywords.length - 1));
    }
  };
  const validated = () => {
    if (keywords.length === 0) {
      window.scrollTo(0, 100);
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
      setKeyError("Please provide at least one course title (Please press ENTER key to submit title) 😊");
    } else setKeyError("");
  };
  const submit = () => {
    validated();
    if (keywords.length === 0) return;
    console.log(keywords.join());
    console.log(course);
    Post(1, "add_course_request", { course_slug: course.slug, topic: keywords.join() }).then(() => {
      setOpen(false);
      setKeywords([]);
      setInput("");
      store.dispatch({ type: "SHOW_SUCCESS", message: "Course request added!" });
    });
  };
  return (
    <>
      <div className="spacing-2" />
      <p>
        Uh oh! "
        <span className="color-blue">{course.is_playlist ? course.channel.channel_title : course.creator.name}</span>"
        is still working on new courses! Let them know what you want to learn
      </p>
      <div className="spacing-1" />
      <button onClick={handleRequestCourse} className="watchBtn">
        Request a course
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} classes={{ paper: classes.dialogBG }}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Request Course</Box>
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="add-video-div">
            <div data-tut="keyword">
              <label className={styles.label + " margin-left-unset"}>
                Which topics do you want {course.is_playlist ? course.channel.channel_title : course.creator.name} to
                create new courses on?
                {/* <span>*</span>
                <Tooltip enterTouchDelay={1} title="Add course title (Please press ENTER key to submit course title) " arrow>
                  <InfoOutlinedIcon fontSize="small" style={{ marginLeft: "5px" }} />
                </Tooltip> */}
              </label>

              <label>
                <ul className={classes.container}>
                  {Array.isArray(keywords) &&
                    keywords?.map((item, i) => (
                      <li key={i} className={classes.items} onClick={handleRemoveItem(i)}>
                        <div className={classes.tag}>
                          <span>{item}&nbsp;</span>
                          <CancelRoundedIcon style={{ fontSize: "0.8rem" }} />
                        </div>
                      </li>
                    ))}
                  <input
                    className={classes.inputKeyword}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={keywords.length === 0 ? "eg Content Writing" : ""}
                  />
                </ul>
              </label>
              {keyError !== "" && (
                <div className={styles.error}>
                  <span className="margin-left-unset">{keyError}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => submit()} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
