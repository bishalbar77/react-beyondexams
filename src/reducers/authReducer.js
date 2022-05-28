import { TOGGLE_AUTHENTICATION, HANDLE_LOADER } from "../actions/actionTypes";

const intialState = {
  isAuthenticated: false,
  loaderVisibility: false,
};

export default (state = intialState, action) => {
  switch (action.type) {
    case TOGGLE_AUTHENTICATION: {
      return {
        ...state,
        isAuthenticated: true,
      };
    }
    case HANDLE_LOADER:
      return {
        ...state,
        loaderVisibility: action.bool,
      };
    default:
      return state;
  }
};
