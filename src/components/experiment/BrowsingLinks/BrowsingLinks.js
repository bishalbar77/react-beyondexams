import React from "react";
import Footer from "../../common/Footer";
import styles from "./BrowsingLinks.module.css";
import LinksAccordian from "./LinksAccordian";

import linksData from "./links.json";

function BrowsingLinks() {
  return (
    <>
      <div className={styles.browsingLinks}>
        <div className={styles.topContainer}>
          <h1>Explore by topic</h1>
          <p>
            Find new interests and advance career opportunities with courses in
            computer science, biology, engineering, architecture, data science
            and more.
          </p>
        </div>

        <div className={styles.browsingContent}>
          <h1>All Topics</h1>

          {linksData.map((item) => (
            <LinksAccordian heading={item.heading} links={item.data} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BrowsingLinks;
