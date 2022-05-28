import { Get } from "../components/common/common";
import { GET_SCHOOL } from "./actionTypes";

export const getSchool = () => async (dispatch) => {
  await Get(1, "get_school", {}).then((response) => {
    const data = response.data;
    dispatch({
      type: GET_SCHOOL,
      school: data,
    });
  });
};
