import React from "react";
import styles from "./Stepper.module.css";
// import Tick from "../../../../../../assets/images/icons/tick-plain.svg";
// import Cross from "../../../../../../assets/images/icons/x-white.svg";
// import ErrorIcon from "../../../../../../assets/images/icons/alert-triangle.svg";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

// import * as jsonData from "../newCourse.json";
var jsonData = require("../newCourse.json");

const Stepper = (props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const history = new useHistory();

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.content}>
        <div className={styles.stepperIndex}>
          <div>{jsonData.stepper.step}</div>
          <div>
            <span>0{props.step}</span>/04
          </div>
        </div>
        <div className={styles.expand}></div>
        <div className={styles.stepsContainer}>
          <div className={styles.stepsIndex}>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 1 ? styles.completeCheck : props.step == 1 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.aboutCourse}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 2 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 2 ? styles.completeCheck : props.step == 2 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.placement}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 3 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 3 ? styles.completeCheck : props.step == 3 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.addInfo}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 4 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 4 ? styles.completeCheck : props.step == 4 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.content}</div>
            </div>
          </div>
        </div>
        {/* <div className={styles.button}>Preview</div> */}
        <img src={require(`../../../../../../assets/images/icons/${jsonData.images.cross}`)} alt="" className={styles.close} onClick={() => setDialogOpen(true)} />
      </div>
      {/* ----------------------bottom--------------------- */}
      <div className={styles.bottomContainer}>
        <div className={styles.stepsContainerBottom}>
          <div className={styles.stepsIndex}>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 1 ? styles.completeCheck : props.step == 1 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.aboutCourse}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 2 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 2 ? styles.completeCheck : props.step == 2 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.placement}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 3 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 3 ? styles.completeCheck : props.step == 3 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.addInfo}</div>
            </div>
            <div className={cx(styles.dash, props.step >= 4 ? styles.completeDash : null)}></div>
            <div className={styles.checkContainer}>
              <img
                src={require(`../../../../../../assets/images/icons/${jsonData.images.tick}`)}
                alt=""
                className={cx(
                  styles.check,
                  props.step > 4 ? styles.completeCheck : props.step == 4 ? styles.currentCheck : styles.upcomingCheck
                )}
              />
              <div className={styles.stepTitle}>{jsonData.stepper.content}</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{ padding: 20 }}>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          {jsonData.stepper.dialog.title}
          </DialogTitle>

          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={() => setDialogOpen(false)} color="primary" className={styles.popButton}>
            {jsonData.stepper.dialog.no}
            </Button>
            <Button
              onClick={() => {
                if (props.courseId) props.deleteCourse();
                history.push(props.crossTo);
              }}
              color="primary"
              className={styles.popButton}
            >
            {jsonData.stepper.dialog.yes}
            </Button>
          </DialogActions>
          <DialogContent className={styles.exitInfo}>
            <img src={require(`../../../../../../assets/images/icons/${jsonData.images.errorIcon}`)} alt="" />
            <DialogContentText id="alert-dialog-description" className={styles.info}>
            {jsonData.stepper.dialog.content}
            </DialogContentText>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Stepper;
