import React, { Component } from "react";
import { Link } from "react-router-dom";
import Instagram from "../../assets/images/icons/footer-instagram-icon.svg";
import Facebook from "../../assets/images/icons/footer-facebook-icon.svg";
import LinkedIn from "../../assets/images/icons/footer-linkedin-icon.svg";
import Twitter from "../../assets/images/icons/footer-twitter-icon.svg";
// import HomeFooterIllustrationOne from "../../assets/images/icons/home-footer-illustration.svg";
import HomeFooterIllustrationTwo from "../../assets/images/icons/home-footer-illustration-two.webp";
import swal from "sweetalert";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

// import * as jsonData from "./footer.json";
var jsonData = require("./footer.json");

const useStyles = (theme) => ({
  linksIcon: {
    color: "#0f0f0f",
    fontSize: "10px",
    display: "inline-block",
  },
});

class Footer extends Component {

  subscribe = async() => {
    if (localStorage.getItem("email")) {
      await axios({
        url: `${jsonData.api.subscribeNewsletter}${localStorage.getItem("email")}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
      })
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
      swal(`Hello ${localStorage.getItem('first_name')}!`, "You subscribed to our newsletter!", "success");
    } else {
      swal("Error", "Please login to continue", "error").then((ok) => {
        if (ok) {
          window.location.href = "/login";
        }
      });
    }
  }

  render() {
    // const { classes } = this.props;
    return (
      <>
        <div className="home-footer-section">
          <div className="home-container relative">
            {/* <div className="home-footer-illustration-one">
                  <img src={HomeFooterIllustrationOne} alt="" />
                </div> */}
            <div className="home-footer-illustration-two">
              <img src={require(`../../assets/images/icons/${jsonData.images.homeFooterIllustration}`)} alt="" width="318" height="292" />
            </div>
            <div className="footer-hero-section">
              <div className="home-footer-column-one">
                <h2>{jsonData.footer.heading.contact}</h2>
                <div className="footer-address">
                  <p>{jsonData.footer.address.line1}</p>
                  <p>{jsonData.footer.address.line2}</p>
                  <p>{jsonData.footer.address.line3}</p>
                  <p>{jsonData.footer.address.line4}</p>
                  <p>{jsonData.footer.address.line5}</p>
                  <div className="home-footer-social">
                    <a href={jsonData.links.instagram} target="_blank" rel="noopener noreferrer">
                      <img src={require(`../../assets/images/icons/${jsonData.images.instagram}`)} alt="" width="30" height="29" />
                    </a>
                    <a href={jsonData.links.facebook} target="_blank" rel="noopener noreferrer">
                      <img src={require(`../../assets/images/icons/${jsonData.images.facebook}`)} alt="" width="30" height="29" />
                    </a>
                    <a
                      href={jsonData.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={require(`../../assets/images/icons/${jsonData.images.linkedin}`)} alt="" width="30" height="29" />
                    </a>
                    <a href={jsonData.links.twitter} target="_blank" rel="noopener noreferrer">
                      <img src={require(`../../assets/images/icons/${jsonData.images.twitter}`)} alt="" width="30" height="29" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="home-footer-column-two">
                <h2>{jsonData.footer.heading.about}</h2>
                <a
                  href={jsonData.links.aboutUs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.aboutUs}
                </a>
                <a
                  href={jsonData.links.team}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.team}
                </a>
              </div>
              <div className="home-footer-column-three">
                <h2>{jsonData.footer.heading.resource}</h2>
                <Link to="/dashboard/contact-us">{jsonData.footer.linkTitle.contactUs}</Link>
                <Link to="/dashboard/recent-updates">{jsonData.footer.linkTitle.updates}</Link>
                {/* <Link to="/dashboard/behind-the-scenes">Behind the scenes</Link> */}
                <a
                  href={jsonData.links.involve}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.involve}
                </a>
                <a
                  href={jsonData.links.partner}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.partner}
                </a>
                <a
                  href={jsonData.links.motive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.motive}
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={jsonData.links.advisor}
                >
                  {jsonData.footer.linkTitle.advisor}
                </a>

                <a
                  href={jsonData.links.roadmap}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.roadmap}
                </a>
                <a
                  href={jsonData.links.faq}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.faq}
                </a>
                <a
                  href={jsonData.links.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jsonData.footer.linkTitle.privacyPolicy}
                </a>
              </div>
              <div className="home-footer-column-four">
                  <h3 style={{ marginTop: '25px', marginBottom: '20px' }}>{jsonData.footer.heading.updates} <br/> {jsonData.footer.heading.newsletter}</h3>
                  <button 
                    style={{ 
                      border: 'none', 
                      backgroundColor: 'white', 
                      padding: '8px', 
                      borderRadius: '10px',
                      width: '125px',
                      color: '#6646E8',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
                    }}
                    onClick={this.subscribe}
                  >
                    {jsonData.footer.linkTitle.subscribe}
                  </button>
                </div>
            </div>
          </div>
        </div>
        <div className="home-copyright-section">
          <div className="home-container relative home-copyright">
            <h4>{jsonData.footer.copyright.title}</h4>
            <h4>
            {jsonData.footer.copyright.fundedBy}{" "}
              <a href={jsonData.links.fundraiser} target="_blank" rel="noopener noreferrer">
              {jsonData.footer.copyright.fundraiser}
              </a>
            </h4>
          </div>
        </div>
      </>
    );
  }
}
export default withStyles(useStyles)(Footer);
