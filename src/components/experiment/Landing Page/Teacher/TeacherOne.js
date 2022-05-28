import React from "react";
import logo from "../asset/logo-with-text.webp";
import img2 from "../asset/Group 1172.webp";
import styles from "./Landing.module.css";
import FeatureCard from "./FeatureCard";
import Footer from "../Student/Footer";
import "../LandingOne.css";
import details from "./page-details-one.json";
import useImage from "../Student/useImage";
import features from "./features.json";

function TeacherOne() {
  const { loading, image } = useImage(details.page_image);
  return (
    <div>
      <main id="landingOne">
        <div className="container-landing">
          <div className="left">
            <div className="eclipse"></div>
            <div>
              <img src={logo} alt="" className="logo" />
            </div>
            <div className="container-content">
              <div className="content">
                <h1>{details.page_heading}</h1>
                <p>{details.page_subheading}</p>
              </div>
            </div>
            <a className="button-container" href={details.button_link} target="_blank" rel="noopener noreferrer">
              <button>{details.button_text}</button>
            </a>
          </div>
          {!loading && <div className="right" style={{ backgroundImage: `url('${image}')` }} />}
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

export default TeacherOne;
