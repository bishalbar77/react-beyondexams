import { SHOW_SUCCESS, CLOSE_SUCCESS, SHOW_WARNING, CLOSE_WARNING, GET_SCHOOL } from "../actions/actionTypes";

const initialState = {
  openSuccess: false,
  successMessage: "",
  openWarning: false,
  warningMessage: "",
  school: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SUCCESS:
      return {
        ...state,
        openSuccess: true,
        successMessage: action.message,
      };
    case CLOSE_SUCCESS:
      return {
        ...state,
        openSuccess: false,
      };
    case SHOW_WARNING:
      return {
        ...state,
        openWarning: true,
        warningMessage: action.message,
      };
    case GET_SCHOOL:
      return {
        ...state,
        school: action.school,
      };
    case CLOSE_WARNING:
      return {
        ...state,
        openWarning: false,
      };

    default:
      return state;
  }
};

export default searchReducer;
