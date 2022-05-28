import authReducer from "./authReducer";
import videoReducer from "./videoReducer";
import browseReducer from "./browseReducer";
import { combineReducers } from "redux";
import searchReducer from "./searchReducer";
import utilReducer from "./utilReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  video: videoReducer,
  browse: browseReducer,
  search: searchReducer,
  util: utilReducer,
});

export default rootReducer;
