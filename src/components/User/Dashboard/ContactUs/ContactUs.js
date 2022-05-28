import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../../../common/Footer";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import "../../../../assets/css/User/Dashboard/contactUs.css";
import MetaHelmet from "../../../common/MetaHelmet";
import Matomo from "../../../common/Matomo";

const useStyles = makeStyles((theme) => ({
  outerDiv: {
    overflow: "scroll",
    overflowX: "hidden",
  },
  expansionBox: {
    padding: "0 1rem",
    width: "100%",
    wordBreak: "break-word",
  },

  root: {
    width: "50%",
    textAlign: "center",
    margin: "auto",
    height: "100vh",
    justifyContent: "center",
    minHeight: "380px",
    display: "flex",
    flexDirection: "column",
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
  window.scrollTo(0, 0);
  return (
    <Matomo pageTitle="Contact Us">
      <div style={{ width: "100%", flex: "1" }}>
        <MetaHelmet
          title="BeyondExams"
          description="Best educational videos on your fingertips. Start learning now!"
        />
        <div className={classes.expansionBox}>
          <div className={classes.root}>
            <h1 className={classes.expansionBoxHeading}>Contact Us</h1>
            <div className="footer-info">
              <h3>BeyondExams</h3>
              <p>
                5th floor, SBS Road
                <br />
                Opp Sahakari Bhandar
                <br />
                Near Sassoon Dock Colaba Bus Depot, Mumbai 400005
                <br />
                <strong>Phone:</strong> +91 72899 26396
                <br />
                <strong>Email:</strong>
                learnwithyoutube@maslowinitiative.org
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
          <Footer />
        </div>
      </div>
    </Matomo>
  );
}
