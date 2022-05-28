import { FETCH_VIDEOS, UPDATE_COMPONENT, HANDLE_LOAD } from "./actionTypes";
import {
  GetVideoAnnotations,
  // ParseDuration,
  YoutubeSearch,
  SemanticSearch,
  GetVideoDetails,
} from "../components/common/videocommon.js";
import { Get } from "../components/common/common";

export const updateComponent = (index, autoPlay, token) => async (dispatch, getState) => {
  dispatch({
    type: HANDLE_LOAD,
  });
  dispatch({
    type: UPDATE_COMPONENT,
    index: index,
    liked: false,
    startTime: getState().video.videos[index].startTime ? getState().video.videos[index].startTime : 0,
    autoPlay: autoPlay ? autoPlay : 0,
    token: token,
  });
};

export const fetchVideoSearch = (parent, level, token, videoId, autoPlay, course_slug, recommended) => async (dispatch, getState) => {
  dispatch({
    type: HANDLE_LOAD,
  });
  if (course_slug && videoId) {
    await Get(1, "get_final_course_details", { course_slug: course_slug }).then((res_data) => {
      let course = res_data.data.data.course;
      let modules = res_data.data.data.course.modules;
      if (modules.length) {
        let lcl_videos = [];
        let selected = null;
        let index = null;
        let startTime = 0;
        let endTime;

        for (let i = 0; i < modules.length; i++) {
          let vids = modules[i].videos;
          for (let j = 0; j < vids.length; j++) {
            vids[j].startTime = vids[j]?.pivot?.start_time ? parseInt(vids[j].pivot.start_time) : 0;
            vids[j].endTime = vids[j]?.pivot?.end_time ? parseInt(vids[j].pivot.end_time) : null;
            lcl_videos = [...lcl_videos, vids[j]];
            if (vids[j].url === videoId) {
              index = j;
              selected = vids[j];
              startTime = vids[j].startTime;
              endTime = vids[j].endTime ? vids[j].endTime : null;
            }
          }
        }

        dispatch({
          type: FETCH_VIDEOS,
          index: index,
          loading: false,
          initial: false,
          startTime: startTime,
          endTime: endTime,
          token: "Recommended",
          selectedVideo: selected,
          videos: lcl_videos,
          courseId: res_data.data.data.course.id,
          course: course,
        });
      }
    });
  } else if ((videoId && !token) || recommended === "0") {
    let index, youtubeSearch;
    youtubeSearch = await YoutubeSearch("", videoId);
    for (let i = 0; i < youtubeSearch.length; i++) {
      if (videoId === youtubeSearch[i].url) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      if (youtubeSearch && youtubeSearch.length > 0) {
        dispatch({
          type: FETCH_VIDEOS,
          loading: false,
          initial: false,
          index: index,
          token: token,
          startTime: 0,
          endTime: null,
          selectedVideo: youtubeSearch[index],
          videos: youtubeSearch,
        });
      }
    } else {
      let videobyId = await GetVideoDetails([videoId]);
      youtubeSearch.unshift(videobyId[0]);

      dispatch({
        type: FETCH_VIDEOS,
        loading: false,
        initial: false,
        index: 0,
        token: "Recommended",
        startTime: 0,
        endTime: null,
        selectedVideo: youtubeSearch[0],
        videos: youtubeSearch,
      });
    }
  } else {
    let semantic_search,
      index,
      youtubeSearch,
      askifySearch,
      startTime = 0,
      askifyLength = 0;
    if (token && token[token.length - 1] === "?") {
      semantic_search = await SemanticSearch(token);
      youtubeSearch = semantic_search.youtubeResults.final_response;
      askifyLength = semantic_search.askifyResults.length;
      askifySearch = semantic_search.askifyResults;
      for (let i = 0; i < askifyLength; i++) {
        askifySearch[i].videoDetails[0].startTime = Math.trunc(askifySearch[i].startTime / 1000);
        youtubeSearch.unshift(askifySearch[i].videoDetails[0]);
      }
    } else {
      youtubeSearch = await YoutubeSearch(token);
    }

    for (let i = 0; i < youtubeSearch.length; i++) {
      if (videoId === youtubeSearch[i].url) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      if (semantic_search && index < askifyLength) {
        startTime = youtubeSearch[index].startTime;
      }
      if (youtubeSearch && youtubeSearch.length > 0) {
        dispatch({
          type: FETCH_VIDEOS,
          loading: false,
          initial: false,
          index: index,
          token: token,
          autoPlay: autoPlay ? 1 : 0,
          startTime: startTime,
          endTime: null,
          askifyLength: askifyLength,
          selectedVideo: youtubeSearch[index],
          videos: youtubeSearch,
        });
      }
    } else {
      let videobyId = await GetVideoDetails([videoId]);
      youtubeSearch.unshift(videobyId[0]);
      if (youtubeSearch && youtubeSearch.length > 0) {
        dispatch({
          type: FETCH_VIDEOS,
          loading: false,
          initial: false,
          index: 0,
          token: "Recommended",
          startTime: 0,
          endTime: null,
          selectedVideo: youtubeSearch[0],
          videos: youtubeSearch,
        });
      }
    }
  }
};

export const handleAnnotationChange = (id) => async (dispatch) => {
  const getVideoAnnotations = await GetVideoAnnotations(id);
  console.log(getVideoAnnotations);
  dispatch({
    type: "HANDLE_ANNOTATION_CHANGE",
    timeStampedNotes: getVideoAnnotations.data.data,
  });
};

// const formatDurationMethod = (response, combine) => {
//   var durationArray = [];
//   for (let i = 0; i < response.data.items.length; i++) {
//     var duration = combine.apiResponse.data.items[i].contentDetails.duration;
//     if (duration[1] === "1") {
//       durationArray[i] = ParseDuration(duration.replace("P1DT", "PT"));
//     } else durationArray[i] = ParseDuration(duration);
//   }
//   return durationArray;
// };
