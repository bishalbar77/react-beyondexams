import React from "react";
import { Link } from "react-router-dom";

function SimComp({ img, title }) {
  return (
    <article className="SimComp">
      <div className="SimComp-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="SimComp-text-container">
        <Link to={{
            pathname: `/dashboard/experiment/simulation/${title}`,
            state: {iframe: "https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html"}
        }}>
          <p>{title}</p>
        </Link>
      </div>
    </article>
  );
}

export default SimComp;
