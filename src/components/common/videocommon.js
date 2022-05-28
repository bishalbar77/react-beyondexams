import axios from "axios";
import swal from "sweetalert";
import baseDomain from "./baseDomain";

export const key = [
  "AIzaSyB97XadhaRaVgSxIOADCLwJ4oYWD8g0c0g",
  "AIzaSyCHZ2zRjq2jZWWeZ-Jo2-ymFSAI1nm1iYs",
  "AIzaSyDiGudcVsTxNNv-vJ49CmlkNg1rV4fzVAs",
  "AIzaSyAHPb1590jwS4gTttowqDxKlH7JPaw-d2Q",
  "AIzaSyBh2tV4a2R9Q5pIh8e1v_e46LO3AYyKkIU",
  "AIzaSyCgT-OOgQjmFCk8eLn35FBF7GOe2_pdYHA",
  "AIzaSyCQg9v8YiABkUiypPHR7fS762OS2hT_euA",
  "AIzaSyDSk5JgRMSjYoU2ue1nS-DHrXXHmdR0Yq4",
];
export const API_KEY = key[Math.floor(Math.random() * key.length)];
export const MAX_RESULTS = 50;
export const NO_OF_COMMENTS = 50;
export const VideoDate = (videoDate) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const t = new Date(videoDate);
  return (videoDate = t.getDate() + "-" + monthNames[t.getMonth()] + "-" + t.getFullYear());
};
export const Format = (details) => {
  if (details > 999 && details < 1000000) {
    return Math.floor(details / 1000) + "K";
  } else if (details >= 1000000 && details < 1000000000) {
    return Math.floor(details / 1000000) + "M";
  } else if (details >= 1000000000) {
    return Math.floor(details / 1000000000) + "B";
  } else return details;
};
export const Sort = async (videos, duration) => {
  for (let i = 0; i < videos.length; i++) {
    videos[i].duration = parseInt(duration[i].replace(/:/g, ""));
    videos[i].actualDuration = duration[i];
  }
  var byDuration = videos.slice(0);
  byDuration.sort(function (a, b) {
    return a.duration - b.duration;
  });
  return byDuration;
};
export const ParseDuration = (PT, format) => {
  var output = [];
  var durationInSec = 0;
  var matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
  var parts = [
    {
      // years
      pos: 1,
      multiplier: 86400 * 365,
    },
    {
      // months
      pos: 2,
      multiplier: 86400 * 30,
    },
    {
      // weeks
      pos: 3,
      multiplier: 604800,
    },
    {
      // days
      pos: 4,
      multiplier: 86400,
    },
    {
      // hours
      pos: 5,
      multiplier: 3600,
    },
    {
      // minutes
      pos: 6,
      multiplier: 60,
    },
    {
      // seconds
      pos: 7,
      multiplier: 1,
    },
  ];

  for (var i = 0; i < parts.length; i++) {
    if (typeof matches[parts[i].pos] != "undefined") {
      durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
    }
  }
  var totalSec = durationInSec;
  // Hours extraction
  if (durationInSec > 3599) {
    output.push(parseInt(durationInSec / 3600));
    durationInSec %= 3600;
  }
  // Minutes extraction with leading zero
  output.push(("0" + parseInt(durationInSec / 60)).slice(-2));
  // Seconds extraction with leading zero
  output.push(("0" + (durationInSec % 60)).slice(-2));
  if (format === undefined) return output.join(":");
  else if (format === "sec") return totalSec;
};
export const Response = async (query, sortOrder, key) => {
  return axios
    .get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: query,
        part: "snippet",
        maxResults: MAX_RESULTS,
        key: key,
        type: "video",
        order: sortOrder ? sortOrder : "relevance",
        safeSearch: "strict",
      },
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status === 403) {
        swal("Error", "Youtube daily quota limit exceeded, please try again later.", "error");
      }
    });
};
export const VideoById = async (key, ids) => {
  return axios
    .get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        id: ids,
        part: "statistics,contentDetails,snippet",
        key: key,
      },
    })
    .catch((err) => {
      if (err.response.status === 403) {
        swal("Error", "Youtube daily quota limit exceeded, please try again later.", "error");
      }
    });
};
export const SaveHistory = async (videoId, startTime, endTime) => {
  await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/save_to_watch_history`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      video_url: videoId,
      start_time: Math.trunc(startTime),
      end_time: Math.trunc(endTime),
    },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const GetHistory = async (page_no) => {
  return axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/get_watch_history`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    params: { page: page_no.toString() },
  })
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const GetVideoAnnotations = async (videoId) => {
  return axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/get_video_annotations`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    params: { video_url: videoId },
  })
    .then((data) => {
      // console.log(data.data.data);
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const ChangePrivacy = async (value, id) => {
  await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/change_note_privacy`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      is_public: value,
      note_id: id,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const EditVideoNote = async (id, note) => {
  return axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/edit_video_note`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      note_id: id,
      note: note,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
      return "error";
    });
};
export const DeleteVideoNote = async (id) => {
  await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/delete_video_note`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      note_id: id,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const Vote = async (id, value) => {
  return axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/add_video_note_vote`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      note_id: id,
      vote: value,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
      return "error";
    });
};
export const YoutubeSearch = async (query, id) => {
  return await axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/youtube_search_data`, {
      params: {
        ...(query ? { search: query } : {}),
        ...(id ? { id: id } : {}),
      },
    })
    .then((response) => {
      // console.log(response.data.final_response);
      return response.data.final_response;
    })
    .catch((e) => {
      console.log(e);
      // swal("Error", e.response.data.message, "error");
    });
};
export const SemanticSearch = async (query) => {
  return await axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_askify_youtube_search_data`, {
      params: { search: query },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const GetVideoDetails = async (ids) => {
  return await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/get_video_all_details`,
    method: "GET",
    params: {
      video_urls: ids,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const GiveRate = async (url, rating) => {
  await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/rate_video`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
    data: {
      video_url: url,
      rating: rating,
    },
  })
    .then((data) => {
      swal("success", "Rating updated", "success");
      return data;
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
