import React from "react";
import logo from "../asset/logo-with-text.webp";
import img2 from "../asset/Group 1172.webp";
import styles from "./Landing.module.css";
import FeatureCard from "./FeatureCard";
import Footer from "../Student/Footer";
import details from "./page-details-three.json";
import useImage from "../Student/useImage";
import "../LandingThree.css";

import features from "./features.json";

function TeacherThree() {
  const { loading, image } = useImage(details.page_image);
  return (
    <div>
      <main id="landingThree">
        <div className="container-landing">
          <div className="container-logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <div className="content">
            <h1>{details.page_heading}</h1>
            <p>{details.page_subheading}</p>
            <a href={details.button_link} target="_blank" rel="noopener noreferrer">
              {details.button_text}
            </a>
          </div>
          <div className="bg-shapes"></div>
          <div className="image-div" style={{ backgroundImage: `url('${image}')` }}></div>
        </div>
      </main>
      <div className={styles.landing}>
        <div className={styles.landing__features_bg}>
          <div className={styles.features__side}>
            <FeatureCard feature={features[1]} />
            <FeatureCard feature={features[0]} />
          </div>
          <div className={styles.features__center}>
            <FeatureCard feature={features[2]} />
            <img src={img2} alt="" className={styles.fetures__image + " " + styles.bg_screen} />
          </div>
          <div className={styles.features__side}>
            <FeatureCard feature={features[3]} />
            <FeatureCard feature={features[4]} />
          </div>
        </div>
        <div className={styles.landing__features_sm}>
          {features.map((feature) => (
            <FeatureCard feature={feature} />
          ))}
        </div>
        <hr />
      </div>
      <Footer />
    </div>
  );
}

export default TeacherThree;
