import { getUserKeys } from "../../../actions/browseActions";
import store from "../../../store";

export const notify = (message) => {
  store.dispatch(getUserKeys());
  const notifyBox = document.getElementById("notificationBox");
  const notifyText = document.getElementById("notificationText");

  notifyText.innerText = message;
  notifyBox.style.display = "flex";

  setTimeout(() => {
    notifyBox.style.display = "none";
  }, 5000);
  return;
};
