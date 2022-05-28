import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import styles from "./Testimonial.module.css";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "unset",
  },
  flexContainer: {
    gap: "40px",
  },
  ["@media only screen and (max-width: 900px)"]: {
    browseLink: {
      fontSize: "1rem",
    },
  },
}));

export default function Testimonial() {
  const classes = useStyles();
  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>
        Trusted by <span>Thousands</span> of Happy Students
      </h2>
      <p>These are the stories of our students who have joined us with great pleasure when using Beyond exams.</p>
      <div className="home-collaborate">
        <div className="h_c_main flex-center">
          <Tabs
            variant="scrollable"
            value={false}
            scrollButtons="on"
            textColor="primary"
            classes={{
              flexContainer: classes.flexContainer,
              root: classes.root,
            }}
          >
            <Tab
              classes={{
                root: classes.root,
              }}
              label={
                <iframe
                  src="https://drive.google.com/file/d/1oAaoAamDkKiFFF4eken_z2P5lIJ1gg7I/preview"
                  width="420"
                  height="240"
                  allow="autoplay"
                ></iframe>
              }
              component="div"
              disableRipple
            />
            <Tab
              classes={{
                root: classes.root,
              }}
              label={
                <iframe
                  src="https://drive.google.com/file/d/1pAimSVu46zzXgt_4BJNOgL_M83PEnFda/preview"
                  width="420"
                  height="240"
                  allow="autoplay"
                ></iframe>
              }
              component="div"
              disableRipple
            />
            <Tab
              classes={{
                root: classes.root,
              }}
              label={
                <iframe
                  src="https://drive.google.com/file/d/1oAaoAamDkKiFFF4eken_z2P5lIJ1gg7I/preview"
                  width="420"
                  height="240"
                  allow="autoplay"
                ></iframe>
              }
              component="div"
              disableRipple
            />
            <Tab
              classes={{
                root: classes.root,
              }}
              label={
                <iframe
                  src="https://drive.google.com/file/d/1vqnuFbTdMrGmVrf6rO2PiayAsz6yIzn_/preview"
                  width="420"
                  height="240"
                  allow="autoplay"
                ></iframe>
              }
              component="div"
              disableRipple
            />
            <Tab
              classes={{
                root: classes.root,
              }}
              label={
                <iframe
                  src="https://drive.google.com/file/d/1vQRfwfys2dHQQGSRBmTtmXZ4WnTG7Qd1/preview"
                  width="420"
                  height="240"
                  allow="autoplay"
                ></iframe>
              }
              component="div"
              disableRipple
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
