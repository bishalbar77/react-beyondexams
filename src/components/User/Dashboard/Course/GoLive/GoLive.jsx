import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import styles from "./GoLive.module.css";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import { Post } from "../../../../common/common";
import moment from "moment";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  dialogBG: {
    width: "550px",
    paddingBottom: "30px",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "flex-end",
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

export default function GoLive({ course, handleClose, module }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [showLive, setShowLive] = useState(false);
  const [showSchedule, setShowSchedule] = useState(true);
  const [link, setLink] = useState("");
  let current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
  let followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
  followingDay.toLocaleDateString();
  const [selectedDate, setSelectedDate] = React.useState(followingDay);
  const [startTime, setStartTime] = React.useState("13:30");
  const [endTime, setEndTime] = React.useState("14:30");

  // const handleClick = () => {
  //   setOpen(true);
  //   setShowLive(false);
  //   setShowSchedule(false);
  // };
  // const handleLiveNow = () => {
  //   window.open(link, "_blank").focus();
  //   Post(1, "set_live_session", {
  //     course_slug: course.slug,
  //     meet_link: link,
  //   });
  //   setOpen(false);
  // };
  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };
  const handleStartTimeChange = (e) => {
    console.log(e.target.value);
    setStartTime(e.target.value);
  };
  const handleEndTimeChange = (e) => {
    console.log(e.target.value);
    setEndTime(e.target.value);
  };
  const handleScheduleNow = () => {
    Post(1, "add_live_class_to_module", {
      module_id: module.id,
      meet_link: link,
      start_time: startTime,
      end_time: endTime,
      date: moment(selectedDate).format("DD/MM/YYYY"),
    }).then(() => {
      // setOpen(false);
      handleClose();
      swal(
        "Meeting Scheduled",
        `Meeting Scheduled Successfully on ${moment(selectedDate).format("DD/MM/YYYY")} at ${startTime}`,
        "success"
      );
    });
  };

  return (
    localStorage.getItem("role_id") == 2 &&
    localStorage.getItem("phoenix_user_id") == course.creator.id && (
      <div>
        {/* <button onClick={handleClick} className="watchBtn">
          Go Live
        </button> */}

        <Dialog open={open} onClose={() => handleClose()} classes={{ paper: classes.dialogBG }}>
          <DialogTitle className={classes.dialogTitle} style={{ paddingRight: "5px", paddingBottom: "0" }}>
            <IconButton onClick={() => handleClose()}>
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ paddingTop: "0" }}>
            <div className={styles.root}>
              {/* {!(showLive || showSchedule) && (
                <>
                  <button className="enrollBtn" onClick={() => setShowLive(true)}>
                    Go Live Now
                  </button>
                  <button className="enrollBtn" onClick={() => setShowSchedule(true)}>
                    Schedule
                  </button>
                </>
              )} */}
              {/* {showLive && (
                <>
                  <input
                    type="text"
                    placeholder="Enter meeting link here"
                    className={styles.link}
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                  />
                  <button className="enrollBtn" onClick={handleLiveNow} disabled={!link}>
                    Go Live Now
                  </button>
                </>
              )} */}
              {showSchedule && (
                <>
                  <div className="schedule">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        disablePast
                        variant="inline"
                        // inputVariant="outlined"
                        format="dd/MM/yyyy"
                        id="date-picker-inline"
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={styles.date}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <div className={styles.time}>
                      <TextField
                        id="time"
                        label="Start Time"
                        type="time"
                        className={classes.textField}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                        onChange={handleStartTimeChange}
                        value={startTime}
                      />
                      {" - "}
                      <TextField
                        id="endTime"
                        label="End Time"
                        type="time"
                        className={classes.textField}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                        onChange={handleEndTimeChange}
                        value={endTime}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter meeting link here"
                    className={styles.link}
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                  />
                  <button
                    className="enrollBtn"
                    onClick={handleScheduleNow}
                    disabled={!link || selectedDate == "Invalid Date" || !startTime || !endTime}
                  >
                    Schedule
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
}
