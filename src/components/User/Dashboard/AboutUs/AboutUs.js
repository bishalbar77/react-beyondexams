import React from "react";
import "../../../../assets/css/User/Dashboard/aboutUs.css";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../../../common/Footer";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MetaHelmet from "../../../common/MetaHelmet";
import Matomo from "../../../common/Matomo";

const useStyles = makeStyles((theme) => ({
  outerDiv: {
    overflow: "scroll",
    overflowX: "hidden",
  },
  expansionBox: {
    display: "flex",
    height: "100%",
    padding: "0 1rem",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "-30px",
    minHeight: "650px",
    wordBreak: "break-word",
    "@media (max-width:360px)": {
      minHeight: "850px",
    },
  },

  root: {
    width: "50%",
    textAlign: "center",
    "@media (max-width:1150px)": {
      width: "60%",
    },
    "@media (max-width:750px)": {
      width: "80%",
    },
    "@media (max-width:550px)": {
      width: "100%",
    },
  },
  expansionBoxHeading: {
    marginBottom: "50px",
  },
}));

export default function ControlledAccordions(props) {
  const classes = useStyles();
  return (
    <Matomo pageTitle="About Us">
      <div className={classes.outerDiv}>
        <MetaHelmet
          title="BeyondExams"
          description="Best educational videos on your fingertips. Start learning now!"
        />
        <div className={classes.expansionBox}>
          <div className={classes.root}>
            <h1 className={classes.expansionBoxHeading}>About Us</h1>
            <div className="footer-info">
              <h3>BeyondExams</h3>
              <p>
                Our platform helps students discover the wealth of high quality
                educational content at YouTube.
                <br />
                <br />
                It is a labour of love and will always be free for students.
                <br />
                <br />
                It is still a work in progress. Videos being searched on the
                platform will soon be mapped to the curriculum followed by many
                Boards of education and several competitive exams as well. These
                learning journeys are being prepared keeping in mind the needs
                and interests of various student groups in different classes.
                <br /> <br />
                By ensuring that these students get the right, personalised
                educational content without the distractions of non-educational
                material available online, we help curious students of all ages
                and classes maximise the output of their learning in an
                interesting and intuitive manner!
                <br />
              </p>
              <div className="social-links mt-3">
                <a
                  className="twitter"
                  href="https://twitter.com/LeWiYo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon style={{ color: "white", fontSize: "18px" }} />
                </a>
                <a
                  className="facebook"
                  href="https://www.facebook.com/LearnwithY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon style={{ color: "white", fontSize: "18px" }} />
                </a>
                <a
                  className="linkedin"
                  href="https://www.linkedin.com/company/learnwithyoutube/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon style={{ color: "white", fontSize: "18px" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Matomo>
  );
}
