import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React from "react";
import { Post } from "../../../common/common";
import store from "../../../../store";
import styles from "../Browse/NewCourse/AboutCourse/AboutCourse.module.css";
import { SUMMARISING_VIDEO } from "../Course/globalData";
import { notify } from "../../Navbar/notify";

const useStyles = makeStyles((theme) => ({
  dialogBG: {
    width: "450px",
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "white",
    zIndex: "2",
    boxShadow:
      "0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
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
    backgroundColor: "#fafafa",
    width: "100%",
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

function MostImportantLessonDialog({ open, setOpen, video }) {
  const classes = useStyles();

  const [input, setInput] = React.useState("");

  const handleInputChange = (evt) => {
    setInput(evt.target.value);
  };

  const submit = () => {
    Post(1, "add_predefined_query_answer", { video_url: video.url, title: input }).then(() => {
      setOpen(false);
      store.dispatch({ type: "SHOW_SUCCESS", message: "Your response is saved successfully!" });
      notify(`🔑 You got ${SUMMARISING_VIDEO} keys for summarising the video.`);
    });
  };
  return (
    open && (
      <div className={classes.dialogBG}>
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>What have you learnt so far?</Box>
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="add-video-div">
            <div data-tut="keyword">
              <label className={styles.label + " margin-left-unset"}>Earn 10 keys by summarising this video!</label>

              <label>
                <ul className={classes.container}>
                  <input
                    className={classes.inputKeyword}
                    value={input}
                    onChange={handleInputChange}
                    // placeholder="eg Content Writing"
                  />
                </ul>
              </label>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => submit()} color="primary" disabled={!input}>
            Submit
          </Button>
        </DialogActions>
      </div>
    )
  );
}

export default MostImportantLessonDialog;
