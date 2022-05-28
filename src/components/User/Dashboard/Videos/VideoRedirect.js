import React from "react";
import { Redirect, useParams } from "react-router-dom";

const VideoRedirect = () => {
  let { id } = useParams();
  if (id) {
    return <Redirect to={`/dashboard/videos/${id}`} />;
  }
};
export default VideoRedirect;
