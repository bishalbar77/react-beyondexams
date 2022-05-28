import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

export default function SkeletonMUI() {
  return (
    <div className="Recommended-container">
      <div className="videoImg-container">
        <Skeleton variant="rect" width={"100%"} height={"100%"} />
      </div>
      <div className="videoInfo-container">
        <div className="videoInfo-main">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      </div>
    </div>
  );
}
