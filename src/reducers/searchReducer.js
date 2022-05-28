import { SET_SEARCH_TERM, SET_TERM_VIDEOS } from "../actions/actionTypes";

const initialState = {
  term: "",
  termVideos: {},
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        term: action.payload,
      };

    case SET_TERM_VIDEOS:
      return {
        ...state,
        termVideos: action.payload,
      };

    default:
      return state;
  }
};

export default searchReducer;
