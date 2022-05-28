import React, { useEffect, useState } from "react";
import illustration from "../../../../../assets/images/images/set-target.svg";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import nextIcon from "../../../../../assets/images/icons/target-next-icon.svg";
import EditIcon from "../../../../../assets/images/icons/editIcon.svg";
import clockIcon from "../../../../../assets/images/icons/clock.png";
import startIcon from "../../../../../assets/images/icons/start.png";
import targetImg from "../../../../../assets/images/images/target2.svg";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { timeOptions, getDay, schedule, goal, getDayInNo, findNextDate, sort_days } from "./utils";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import baseDomain from "../../../../common/baseDomain";
import { NotificationPermission } from "../../../../common/common";
import axios from "axios";
import { getLocal } from "../../../../common/localStorageAccess";
import moment from "moment";
import styles from "./SetTarget.module.css";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: 20,
    paddingTop: 36,
    paddingLeft: 38,
    paddingRight: 38,
    paddingBottom: 32,
    maxWidth: 600,
    minWidth: "40vw",
    height: "600px",
    width: "580px",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeDropdown: {
    boxShadow: "0px 0px 14px rgba(0, 0, 0, 0.25)",
    width: 150,
    maxHeight: 170,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  option: {
    width: "85%",
    marginLeft: 10,
    borderRadius: 2,
  },
}));

function SetTarget(props)
{
  const [isOpen, setIsOpen] = useState();
  const classes = useStyles();
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(0);

  const [daysAWeek, setDaysAWeek] = useState(0);
  const [startTime, setStartTime] = useState("12:00 am");
  const [endTime, setEndTime] = useState("12:00 am");
  const [selectedDays, setSelectedDays] = useState([]);

  const [errorText, setErrorText] = useState("");

  const query = new URLSearchParams(props.location.search);
  const course_slug = query.get("course_slug");
  // console.log(selectedDays);

  useEffect(() =>
  {
    if (!localStorage.getItem("access_token"))
    {
      swal("Sorry", "You have to login first", "error").then((ok) =>
      {
        if (ok)
        {
          history.push("/login");
        }
      });
    } else if (!course_slug)
    {
      history.replace("/");
    }
  }, []);
  useEffect(() =>
  {
    if (localStorage.getItem("access_token") && course_slug)
    {
      NotificationPermission(course_slug);
    }
  }, []);

  const showError = (error) =>
  {
    setErrorText(error);

    setTimeout(() =>
    {
      setErrorText("");
    }, 3000);
  };

  const handleNext = () =>
  {
    if (activeStep === 0)
    {
      if (daysAWeek === "everyday")
      {
        setSelectedDays(schedule);
      }
    }
    if (activeStep === 1)
    {
      if (selectedDays.length < daysAWeek)
      {
        showError(`Please select ${ daysAWeek } days`);
        return;
      }
    }
    if (activeStep === 3 || daysAWeek === 0)
    {
      showError(`Please choose an option first.`);
      return;
    } else
    {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleSelectedDaysChange = (e) =>
  {
    const allCheckboxes = document.querySelectorAll(`.${ styles.dayCheckbox }:checked`);
    if (daysAWeek === "everyday")
    {
      return;
    }

    if (allCheckboxes.length > parseInt(daysAWeek))
    {
      return (e.target.checked = false);
    } else
    {
      if (e.target.checked)
      {
        setSelectedDays([...selectedDays, e.target.value]);
      } else
      {
        const index = selectedDays.findIndex((item) => item === e.target.value);
        const newArr = selectedDays;
        newArr.splice(index, 1);
        setSelectedDays(newArr);
      }
    }
  };

  const resetSteps = () =>
  {
    setStartTime("12:00 am");
    setEndTime("12:00 am");
    setSelectedDays([]);
    setActiveStep(0);
  };

  const handleSchedule = () =>
  {
    for (let i = 0; i < selectedDays.length; i++)
    {
      selectedDays[i] = getDayInNo(selectedDays[i]);
    }

    const data = {
      course_slug: course_slug,
      start_time: startTime,
      end_time: endTime,
      day: selectedDays,
    };

    axios({
      url: `${ baseDomain.route }${ baseDomain.subRoute }/schedule_course`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${ getLocal("access_token") }`,
        Accept: "application/json;charset=UTF-8",
      },
      data: data,
    })
      .then((response) =>
      {
        // console.log(response);
        setActiveStep(3);
      })
      .catch((e) =>
      {
        console.log(e);
      });
  };

  return (
    <div className={styles.setTarget}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.setTargetDialog}
        classes={{ paper: classes.paper }}
        scroll="body"
      >
        <div className={styles.contentWrapper}>
          {activeStep === 0 && (
            <div className={styles.dialogData}>
              <div className={styles.targetTitleWrapper}>
                <h1>Set a weekly goal</h1>
                <IconButton aria-label="close" onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className={styles.targetDialogContent}>
                <p>Set a goal to soomthly complete your course. you can always change it later.</p>

                <div className={styles.targetGoals}>
                  {goal.map((g, i) => (
                    <>
                      <input
                        key={i}
                        type="radio"
                        className={styles.goal}
                        name="goal"
                        value={g}
                        id={g}
                        onChange={(e) => setDaysAWeek(e.target.value)}
                      />
                      <label htmlFor={g} className={styles.labelContainer}>
                        <div>{g === "everyday" ? "Everyday" : `Learn ${ g } days a week`}</div>
                      </label>
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className={styles.dialogData}>
              <div className={styles.targetTitleWrapper}>
                <h1>Set your schedule</h1>
                <IconButton aria-label="close" onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className={styles.targetDialogContent}>
                <p>choose the day and time that works for you</p>

                <div className={styles.targetWeek}>
                  <div className={styles.weekTitle}>
                    <p>choose {daysAWeek} days a week</p>
                    <img src={EditIcon} alt="edit" onClick={resetSteps} />
                  </div>

                  <div className={styles.weekdays}>
                    {schedule.map((item, idx) => (
                      <div className="day" key={idx}>
                        <input
                          type="checkbox"
                          className={`${ styles.goal } ${ styles.dayCheckbox }`}
                          name="goal"
                          value={item}
                          id={item}
                          onChange={handleSelectedDaysChange}
                          checked={daysAWeek === "everyday" ? true : null}
                        />
                        <label htmlFor={item} className={`${ styles.labelContainer } ${ styles.darkGray }`}>
                          <div>{item}</div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className={styles.timing}>
                    <Autocomplete
                      id="startTimeInput"
                      options={timeOptions}
                      value={startTime}
                      onChange={(e, value) => setStartTime(value)}
                      classes={{
                        option: classes.option,
                        paper: classes.timeDropdown,
                      }}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            placeholder={startTime}
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            {...params.inputProps}
                          />
                        </div>
                      )}
                    />

                    <p>to</p>

                    <Autocomplete
                      id="endTimeInput"
                      options={timeOptions}
                      value={endTime}
                      onChange={(e, value) => setEndTime(value)}
                      classes={{
                        option: classes.option,
                        paper: classes.timeDropdown,
                      }}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            placeholder={endTime}
                            // className={classes.input}
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            {...params.inputProps}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className={styles.dialogData}>
              <div className={styles.targetTitleWrapper}>
                <h1>Your course schedule is ready!</h1>
                <IconButton aria-label="close" onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className={styles.targetDialogContent}>
                <div className={`${ styles.row } ${ styles.mt2 }`}>
                  <div className={styles.rowTitle}>
                    <img src={clockIcon} alt="time period" />
                    <p>Time period</p>
                  </div>

                  <p className={styles.rowD}>5 Days</p>
                </div>

                <div className={styles.row}>
                  <div className={styles.rowTitle}>
                    <img src={startIcon} alt="start" />
                    <p>Start</p>
                  </div>

                  <p className={styles.rowD}>{moment(findNextDate(selectedDays[0])).format("dddd MMMM Do YYYY")}</p>
                </div>

                <div className={styles.timePreviewBox}>
                  {sort_days(selectedDays).map((day, idx) => (
                    <div className={styles.timePreview} key={idx}>
                      <div className={styles.previewTop}>
                        <p className={styles.previewDay}>{getDay(day)}</p>
                        <p className={styles.previewDate}>{moment(findNextDate(day)).format("MMMM Do YYYY")}</p>
                      </div>

                      <h3 className={styles.previewTime}>
                        {startTime} - {endTime}
                      </h3>
                    </div>
                  ))}
                </div>
                <div className={`${ styles.buttons } ${ styles.mt5 }`}>
                  <button className={`${ styles.targetButton } ${ styles.outline }`} onClick={resetSteps}>
                    Edit schedule
                  </button>
                  <button className={styles.targetButton} onClick={handleSchedule}>
                    Schedule looks great!
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className={styles.dialogData}>
              <div className={styles.wrapper}>
                <div className={styles.imgBox}>
                  <img src={targetImg} alt="target_img" />
                </div>

                <div className={styles.content}>
                  <h2>
                    <strong>All set !</strong> you will recieve your schedule via e-mail.
                  </h2>
                  <p>
                    at <span className={styles.scheduleEmail}>{localStorage.getItem("email")} </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorText !== "" && (
            <span className={styles.errorBox}>
              <p>{errorText}</p>
            </span>
          )}

          <button className={styles.nextBtn} onClick={handleNext}>
            {activeStep === 0 ? "Next" : activeStep === 1 ? "Done" : null}
            {activeStep < 2 && <img src={nextIcon} alt="next" />}
          </button>
        </div>
      </Dialog>

      <div className={styles.setTargetTop}>
        <p>{localStorage.getItem("name")}, you have been successfully enrolled in the course. 🤗 </p>
      </div>
      <div className={styles.setTargetBottom}>
        <div className={styles.setTargetLeft}>
          <h1 className={styles.targetHeading}>Set a target for completing this course!</h1>

          <p className={styles.targetPara}>
            setting a target will help you develop a pattern for efficient and effective learning.
          </p>

          <div className={styles.setTargetButtons}>
            <button className={styles.targetButton} onClick={() => setIsOpen(true)}>
              Set a target
            </button>
            <button className={`${ styles.targetButton } ${ styles.outline }`} onClick={() => history.goBack()}>
              Not Now
            </button>
          </div>
        </div>
        <div className={styles.setTargetRight}>
          <img src={illustration} alt="illustration" />
        </div>
      </div>
    </div>
  );
}

export default SetTarget;
