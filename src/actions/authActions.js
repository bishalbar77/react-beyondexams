import { TOGGLE_AUTHENTICATION, HANDLE_LOADER } from "./actionTypes";

export const toggleAuthentication = () => ({
  type: TOGGLE_AUTHENTICATION,
});

export const handleLoader = (bool) => ({ type: HANDLE_LOADER, bool: bool });
