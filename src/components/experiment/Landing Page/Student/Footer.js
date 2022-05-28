import React from 'react'
import { Link } from "react-router-dom"
import Instagram from "../../../../assets/images/icons/footer-instagram-icon.svg";
import Facebook from "../../../../assets/images/icons/footer-facebook-icon.svg";
import LinkedIn from "../../../../assets/images/icons/footer-linkedin-icon.svg";
import Twitter from "../../../../assets/images/icons/footer-twitter-icon.svg";
import HomeFooterIllustrationTwo from "../../../../assets/images/icons/home-footer-illustration-two.webp";
import styles from "./Landing.module.css";

const Footer = () => {
    return (
        <div style={{padding: "1rem"}}>
          <div className="home-footer-section" style={{marginTop: 0}}>
            <div className="home-container relative">
              {/* <div className="home-footer-illustration-one">
                <img src={HomeFooterIllustrationOne} alt="" />
              </div> */}
              <div className="home-footer-illustration-two">
                <img src={HomeFooterIllustrationTwo} alt="" width="318" height="292" />
              </div>
              <div className={"footer-hero-section " + styles.footer__heroSection}>
                <div className="home-footer-column-one">
                  <h2>Contact US</h2>
                  <div className="footer-address">
                    <p>5th floor, SBS Road</p>
                    <p>Opp Sahakari Bhandar</p>
                    <p>Near Sassoon Dock Colaba Bus Depot,</p>
                    <p>Mumbai 400005</p>
                    <div className="home-footer-social">
                      <a href="https://www.instagram.com/beyondexams/" target="_blank" rel="noopener noreferrer">
                        <img src={Instagram} alt="" width="30" height="29" />
                      </a>
                      <a href="https://www.facebook.com/LearnwithY" target="_blank" rel="noopener noreferrer">
                        <img src={Facebook} alt="" width="30" height="29" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/learnwithyoutube/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={LinkedIn} alt="" width="30" height="29" />
                      </a>
                      <a href="https://twitter.com/Beyondexams_?s=08" target="_blank" rel="noopener noreferrer">
                        <img src={Twitter} alt="" width="30" height="29" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="home-footer-column-two">
                  <h2>About US</h2>
                  <a
                    href="https://beyondexams.notion.site/About-BeyondExams-34a9555c54504efd9e55f3672715e4dc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    About Us
                  </a>
                  <a
                    href="https://www.notion.so/6643b158b6474bc78e0e59a4fc9ad240"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Our team
                  </a>
                </div>
                <div className="home-footer-column-three">
                  <h2>Resources</h2>
                  <Link to="/dashboard/contact-us">Contact Us</Link>
                  <Link to="/dashboard/recent-updates">Recent Updates</Link>
                  {/* <Link to="/dashboard/behind-the-scenes">Behind the scenes</Link> */}
                  <a
                    href="https://www.notion.so/Beyond-Exams-Wiki-68051f0aa3ad4cd681ec95a113fa92fd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Involved
                  </a>
                  <a
                    href="https://www.notion.so/learnwithyoutube/Our-partners-b622336907d24cac94f1bb0ac76dd85e"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Our Partners
                  </a>
                  <a
                    href="https://www.notion.so/learnwithyoutube/Why-are-we-doing-this-28057e1d9538472c84278be23e3e8fee"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Why are we doing this?
                  </a>
                  <a
                    href="https://www.notion.so/25b852b57098436cbf3daa90a0223c72?v=caedbc71c54448d78169a08a01e4d64a"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Board of Advisors
                  </a>

                  <a
                    href="https://www.notion.so/learnwithyoutube/Roadmap-3c2f42d877e64b519a42119aeaef0ecd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Roadmap
                  </a>
                  <a
                    href="https://www.notion.so/learnwithyoutube/Frequently-Asked-Questions-b56296fa5a404123801ddd1bcd7912bc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FAQ
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1_eNr7v4pYKcXeCAJ7DSjaAgdrpLbuBSGrbbz5SHPfQE/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="home-copyright-section">
            <div className="home-container relative home-copyright">
              <h4>Copyright © 2021, Maslow Initiative. All Rights Reserved</h4>
              <h4>
                Funded by{" "}
                <a href="https://twitter.com/malpani" target="_blank" rel="noopener noreferrer">
                  Dr.Aniruddha Malpani
                </a>
              </h4>
            </div>
          </div>
        </div>

    )
}

export default Footer
