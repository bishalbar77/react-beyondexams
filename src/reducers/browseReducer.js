import {
  TOGGLE_OPEN,
  SET_TERM,
  GET_ALL_CATEGORIES,
  GET_BEST_COURSES,
  GET_BEST_CHANNELS,
  GET_USER_BADGES,
  GET_ALL_COURSES,
  EXPLORE_COURSES,
  GET_SITE_MATRIX,
  GET_USER_KEYS,
} from "../actions/actionTypes";

const intialState = {
  filters: [],
  open: false,
  term: null,
  videos: null,
  parentId: null,
  durations: null,
  showRemoveAndEdit: false,
  allCategories: [],
  allCourses: null,
  bestCourses: [],
  bestChannels: [],
  userBadges: null,
  exploreCourse: null,
  siteMatrix: null,
  keys: 0,
};

export default (state = intialState, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORIES: {
      return {
        ...state,
        allCategories: action.allCategories,
      };
    }
    case GET_ALL_COURSES: {
      return {
        ...state,
        allCourses: action.allCourses,
      };
    }
    case EXPLORE_COURSES: {
      return {
        ...state,
        exploreCourse: action.exploreCourse,
      };
    }
    case GET_BEST_COURSES: {
      return {
        ...state,
        bestCourses: action.bestCourses,
      };
    }
    case GET_BEST_CHANNELS: {
      return {
        ...state,
        bestChannels: action.bestChannels,
      };
    }
    case GET_SITE_MATRIX: {
      return {
        ...state,
        siteMatrix: action.siteMatrix,
      };
    }
    case GET_USER_BADGES: {
      return {
        ...state,
        userBadges: action.userBadges,
      };
    }
    case GET_USER_KEYS: {
      return {
        ...state,
        keys: action.keys,
      };
    }
    case TOGGLE_OPEN: {
      return {
        ...state,
        open: action.open,
      };
    }
    case SET_TERM: {
      return {
        ...state,
        term: action.term,
      };
    }
    default:
      return state;
  }
};
