import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../../../assets/css/User/Dashboard/videos.css";
import MetaHelmet from "../../../common/MetaHelmet";
import Footer from "../../../common/Footer";
import CircularProgress from "@material-ui/core/CircularProgress";
import VideoItem from "./VideoItem";
import useVideoSearch from "./useVideoSearch";
import useSemanticSearch from "./useSemanticSearch";

function SearchResults(props) {
  const [query, setQuery] = useState("");
  // const [sortValue, setSortValue] = useState("");
  // const [durations, setDurations] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const { semanticVideos, askifyLength } = useSemanticSearch(query);

  const { loading, error, videos, hasMore, nextPage } = useVideoSearch(query, nextPageToken);

  const observer = useRef();

  const lastVideoElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setNextPageToken(nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, nextPage]
  );

  // const sortbyDuration = async () => {
  //   let durationArray = [];
  //   let byDuration = await Sort(videos, durations);
  //   for (let i = 0; i < byDuration.length; i++) {
  //     durationArray[i] = byDuration[i].actualDuration;
  //   }

  //   setVideos(byDuration);
  //   setSortValue("duration");
  //   setDurations(durationArray);
  // };

  // const formatDuration = (response, combine) => {
  //   var durationArray = [];
  //   for (let i = 0; i < response.data.items.length; i++) {
  //     var duration = combine.apiResponse.data.items[i].contentDetails.duration;
  //     if (duration[1] === "1") {
  //       durationArray[i] = ParseDuration(duration.replace("P1DT", "PT"));
  //     } else durationArray[i] = ParseDuration(duration);
  //   }
  //   return durationArray;
  // };

  // const handleSearchChange = (e) => {
  //   setQuery(e.target.value);
  // };

  const handleVideoSelect = (e, video, index, autoPlay) => {
    e.stopPropagation();
    const query = new URLSearchParams(props.location.search);
    const token = query.get("q");
    if (autoPlay)
      props.history.push(
        "/dashboard/videos/" +
          video.url +
          "?q=" +
          encodeURIComponent(token).replace(/%20/g, "+") +
          "&autoPlay=" +
          autoPlay
      );
    else props.history.push("/dashboard/videos/" + video.url + "?q=" + encodeURIComponent(token).replace(/%20/g, "+"));
  };

  // const handleSortChange = (e) => {
  //   const query = new URLSearchParams(props.location.search);
  //   const token = query.get("q");
  //   props.history.push(
  //     "/dashboard/videos/searchresults?q=" +
  //       encodeURIComponent(token).replace(/%20/g, "+") +
  //       "&sort=" +
  //       e.target.value
  //   );
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    const query = new URLSearchParams(props.location.search);
    const token = query.get("q");
    setQuery(token);
  }, [props.location]);

  return (
    <div className="search-result-root">
      {videos.length > 0 ? (
        <>
          <div className="search-result-outer-div">
            <MetaHelmet
              title="BeyondExams"
              description="Best educational videos on your fingertips. Start learning now!"
            />
            <div className="video_container">
              <div className="spacing-1"></div>
              <div className="list video-list">
                {semanticVideos &&
                  semanticVideos.map((video, index) => (
                    <VideoItem
                      key={index}
                      color={false}
                      video={video}
                      handleVideoSelect={handleVideoSelect}
                      index={index}
                      askifyLength={askifyLength}
                    />
                  ))}
                {videos.map((video, index) => {
                  if (videos.length === index + 1) {
                    return (
                      <VideoItem
                        reference={lastVideoElement}
                        key={index}
                        color={false}
                        video={video}
                        handleVideoSelect={handleVideoSelect}
                        index={index}
                      />
                    );
                  } else {
                    return (
                      <VideoItem
                        key={index}
                        color={false}
                        video={video}
                        handleVideoSelect={handleVideoSelect}
                        index={index}
                      />
                    );
                  }
                })}
                {loading && (
                  <div className="loader" style={{ minHeight: 0, height: "20px" }}>
                    <CircularProgress />
                  </div>
                )}
                {error && <div>Error...</div>}
              </div>
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <div className="loader">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default SearchResults;
