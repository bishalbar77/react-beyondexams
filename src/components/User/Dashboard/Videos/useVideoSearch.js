import axios from "axios";
import { useEffect, useState } from "react";
import baseDomain from "../../../common/baseDomain";

function useVideoSearch(query, nextPageToken) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    setVideos([]);
  }, [query]);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(false);

      axios({
        method: "GET",
        url: `${baseDomain.route}${baseDomain.subRoute}/youtube_search_data`,
        params: nextPageToken
          ? {
              search: query,
              nextPageToken: nextPageToken,
            }
          : {
              search: query,
            },
      })
        .then((res) => {
          setVideos((prevVideos) => {
            return [...new Set([...prevVideos, ...res.data.final_response])];
          });
          setNextPage(res.data.nextPageToken);
          setHasMore(res.data.final_response.length > 0);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
        });
    }
  }, [query, nextPageToken]);
  return { loading, error, videos, hasMore, nextPage };
}

export default useVideoSearch;
