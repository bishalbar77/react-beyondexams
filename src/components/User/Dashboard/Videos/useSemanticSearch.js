import { useEffect, useState } from "react";
import { SemanticSearch } from "../../../common/videocommon";

function useSemanticSearch(query) {
  const [semanticVideos, setSemanticVideos] = useState([]);
  const [askifyLength, setAskifyLength] = useState(null);
  const [askify, setAskify] = useState(null);

  useEffect(() => {
    setSemanticVideos([]);
  }, [query]);

  useEffect(() => {
    if (query && query[query.length - 1] === "?") {
      let semantic_search,
        youtubeSearch = [],
        askifySearch,
        askifyLength = 0;
      semantic_search = SemanticSearch(query);
      semantic_search
        .then((res) => {
          console.log(res);
          askifyLength = res.askifyResults.length;
          askifySearch = res.askifyResults;
          for (let i = 0; i < askifyLength; i++) {
            youtubeSearch.unshift(askifySearch[i].videoDetails[0]);
          }
          setSemanticVideos(youtubeSearch);
          setAskify(true);
          setAskifyLength(askifyLength);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [query]);

  return { semanticVideos, askifyLength, askify };
}

export default useSemanticSearch;
