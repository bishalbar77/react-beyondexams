import {
  GET_ALL_CATEGORIES,
  GET_BEST_COURSES,
  GET_USER_BADGES,
  GET_ALL_COURSES,
  EXPLORE_COURSES,
  GET_SITE_MATRIX,
  GET_BEST_CHANNELS,
  GET_USER_KEYS,
} from "./actionTypes";
import swal from "sweetalert";
import axios from "axios";
import baseDomain from "../components/common/baseDomain.js";
import channelsData from "../utils/channelsData";
import { Get } from "../components/common/common";

export const getAllCategories = () => (dispatch) => {
  axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_all_categories_hierarchically`)
    .then((response) => {
      dispatch({
        type: GET_ALL_CATEGORIES,
        allCategories: response.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response?.data.message, "error");
    });
};
export const getBestCourses = () => (dispatch) => {
  axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/get_best_courses`,
    method: "GET",
  })
    .then((res) => {
      dispatch({
        type: GET_BEST_COURSES,
        bestCourses: res.data.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response.data.message, "error");
    });
};
export const getBestChannels = () => (dispatch) => {
  dispatch({
    type: GET_BEST_CHANNELS,
    bestChannels: channelsData,
  });
  // axios({
  //   url: `${baseDomain.route}${baseDomain.subRoute}/get_best_courses`,
  //   method: "GET",
  // })
  //   .then((res) => {
  //     dispatch({
  //       type: GET_BEST_COURSES,
  //       bestCourses: res.data.data.data,
  //     });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     swal("Error", e.response.data.message, "error");
  //   });
};
export const getUserBadges = () => (dispatch) => {
  axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/get_user_badge`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
  })
    .then((res) => {
      dispatch({
        type: GET_USER_BADGES,
        userBadges: res.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      // swal("Error", e.response.data.message, "error");
    });
};
export const getAllCourses = () => (dispatch) => {
  axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_all_courses`)
    .then((response) => {
      console.log(response);
      dispatch({
        type: GET_ALL_COURSES,
        allCourses: response.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response?.data.message, "error");
    });
};
export const exploreCourses = () => (dispatch) => {
  axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/explore_courses`)
    .then((response) => {
      dispatch({
        type: EXPLORE_COURSES,
        exploreCourse: response.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response?.data.message, "error");
    });
};
export const getSiteMatrix = () => (dispatch) => {
  axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_metrics_data`)
    .then((response) => {
      dispatch({
        type: GET_SITE_MATRIX,
        siteMatrix: response.data.data,
      });
    })
    .catch((e) => {
      console.log(e);
      swal("Error", e.response?.data.message, "error");
    });
};
export const getUserKeys = () => async (dispatch) => {
  await Get(1, "get_user_key_transactions", { slug: localStorage.getItem("slug") }).then((response) => {
    const data = response.data.data;
    dispatch({
      type: GET_USER_KEYS,
      keys: data.user_key.keys_available,
    });
  });
};
