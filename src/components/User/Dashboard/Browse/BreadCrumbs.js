import React from "react";
import RightArrow2 from "../../../../assets/images/icons/right-arrow2.svg";
import { Link } from "react-router-dom";

const BreadCrumbs = (props) => {
  // React.useEffect(() => {
  //   console.log(props);
  // });
  const handleClick = (event, e) => {
    props.redirect(event, e.level + 1, e.id, e.slug, e.video_count, e.num_categories);
  };
  return props.breadCrumbs?.length !== 0 ? (
    <div className="bread-crumbs">
      <div className="bread-crumb-item">
        <Link to={`/dashboard/browse?level=1&parent=0&type=${props.type === "classes" ? "classes" : "topics"}`}>
          <div style={{ color: "#686868" }}>
            {props.type === "classes" ? "Explore by classes" : "Explore by topics"}
          </div>
        </Link>
        <img src={RightArrow2} alt="" />
      </div>
      {props.breadCrumbs.map((e, i) => {
        if (e)
          return (
            <div key={i} className="bread-crumb-item" onClick={(event) => handleClick(event, e)}>
              <div style={i === props.breadCrumbs.length - 1 ? { color: "#6646E7" } : null}>
                {e.title ? e.title : ""}
              </div>

              {i !== props.breadCrumbs.length - 1 && <img src={RightArrow2} alt="" />}
            </div>
          );
      })}
    </div>
  ) : (
    <></>
  );
};

export default BreadCrumbs;
