import React from "react";
import RecommendedVideo from "./RecommendedVideo";

const RecommendedList = (props) => {
  const [pauseVideos, setPauseVideos] = React.useState(false);
  const [url, setUrl] = React.useState(null);

  const pauseAll = (url) => {
    setPauseVideos(true);
    setUrl(url);
  };

  return (
    <div>
      {props.videos.map(
        (video, index) =>
          props.starArr.length &&
          video.title && (
            <RecommendedVideo
              key={index}
              color={props.color}
              video={video}
              handleVideoSelect={props.handleVideoSelect}
              selectedVideo={props.selectedVideo}
              index={index}
              duration={props.duration}
              askifyLength={props.askifyLength}
              removeVideo={props.removeVideo}
              updateVideoList={props.updateVideoList}
              parentId={props.parentId}
              stars={props.starArr}
              pauseAll={pauseAll}
              pauseVideos={pauseVideos}
              url={url}
            />
          )
      )}
    </div>
  );
};

export default RecommendedList;
