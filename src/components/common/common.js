import { getLocal, setLocal } from "./localStorageAccess";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "./baseDomain";
import firebase from "./init-fcm";
import store from "../../store";

export const checkAuth = async () => {
  await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/check_auth`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${getLocal("access_token")}`,
      Accept: "application/json;charset=UTF-8",
    },
  })
    .then((response) => {
      // console.log(response.data);
    })
    .catch(async (error) => {
      console.log(error.response);
      console.log("not authenticated");
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/refreshFirebase`,
        method: "POST",
        data: {
          refresh_token: getLocal("refresh_token"),
          unique_id: getLocal("uid"),
        },
      })
        .then((response) => {
          setLocal("access_token", response.data.data.access_token);
          setLocal("refresh_token", response.data.data.refresh_token);
        })
        .catch(async () => {
          console.log("refresh token expired");
          await axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/verifyFirebaseAccessToken`,
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            data: {
              access_token: getLocal("uid"),
              role_id: parseInt(localStorage.getItem("role_id")),
              request_url: window.location.href,
            },
          })
            .then((response) => {
              let data = response.data.data;
              setLocal("access_token", data.access_token);
              setLocal("refresh_token", data.refresh_token);
              setLocal("email", data.email);
              setLocal("new", data.new);
              setLocal("unique_id", data.unique_id);
              setLocal("legacy_user_id", data.legacy_user_id);
              setLocal("phoenix_user_id", data.phoenix_user_id);
              setLocal("slug", data.slug);
            })
            .catch(() => {
              console.log("Unable to verify firebase access token");
              localStorage.clear();
            });
        });
    });
};
export const RefreshToken = async () => {
  return await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/refreshFirebase`,
    method: "POST",
    data: {
      refresh_token: getLocal("refresh_token"),
      unique_id: getLocal("uid"),
    },
  })
    .then((response) => {
      setLocal("access_token", response.data.data.access_token);
      setLocal("refresh_token", response.data.data.refresh_token);
      return true;
    })
    .catch(async () => {
      console.log("refresh token expired");
      return await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/verifyFirebaseAccessToken`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          access_token: getLocal("uid"),
          role_id: parseInt(localStorage.getItem("role_id")),
          request_url: window.location.href,
        },
      })
        .then((response) => {
          let data = response.data.data;
          setLocal("access_token", data.access_token);
          setLocal("refresh_token", data.refresh_token);
          setLocal("email", data.email);
          setLocal("new", data.new);
          setLocal("unique_id", data.unique_id);
          setLocal("legacy_user_id", data.legacy_user_id);
          setLocal("phoenix_user_id", data.phoenix_user_id);
          setLocal("slug", data.slug);
          return true;
        })
        .catch(() => {
          console.log("Unable to verify firebase access token");
          localStorage.clear();
          swal("Error", "Please login again to continue", "error").then((ok) => {
            if (ok) {
              window.location.href = "/login";
            }
          });
          return false;
        });
    });
};
export const Get = async (auth, url, params) => {
  let newData = { ...params, request_url: window.location.href };
  return await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/${url}`,
    method: "GET",
    ...(auth
      ? {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
        }
      : {}),
    params: newData,
  })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      if (e.response.data.message === "Unauthenticated.") {
        let res = await RefreshToken();
        if (res) {
          return Get(auth, url, params);
        }
      } else {
        swal("Error", e.response.data.message, "error");
        console.log(e.response);
      }
    });
};

export const Post = async (auth, url, data) => {
  let newData;
  try {
    if (data.entries()) {
      data.append("request_url", window.location.href);
      newData = data;
    }
  } catch (e) {
    newData = { ...data, request_url: window.location.href };
  }
  return await axios({
    url: `${baseDomain.route}${baseDomain.subRoute}/${url}`,
    method: "POST",
    ...(auth
      ? {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
        }
      : {
          headers: {
            Accept: "application/json",
          },
        }),
    data: newData,
  })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      if (e.response.data.message === "Unauthenticated.") {
        let res = await RefreshToken();
        if (res) {
          return Post(auth, url, data);
        }
      } else {
        swal("Error", e.response.data.message, "error");
        console.log(e.response);
      }
    });
};

var provider = new firebase.auth.GoogleAuthProvider();

export const swalWithAuth = async (message, role_id) => {
  swal("Unauthorized", message, "error", {
    buttons: true,
    dangerMode: true,
  }).then(async (ok) => {
    if (ok) {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          setLocal("access_specifier", "google");
          setLocal("uid", result.user.uid);
          setLocal("google_access_token", result.credential.accessToken);
          setLocal("first_name", result.additionalUserInfo.profile.given_name);
          setLocal("last_name", result.additionalUserInfo.profile.family_name);
          setLocal("email", result.user.email);
          setLocal("unique_id", result.additionalUserInfo.profile.id);
          setLocal("avatar", result.user.photoURL);
          await Post(0, "verifyFirebaseAccessToken", {
            access_token: localStorage.getItem("uid"),
            role_id: parseInt(role_id),
            // request_url: window.location.href,
          }).then((res) => {
            if (role_id == 1) {
              store.dispatch({ type: "SHOW_SUCCESS", message: "You are now logged in as a student" });
            } else {
              store.dispatch({ type: "SHOW_SUCCESS", message: "You are now logged in as a teacher" });
            }
            let data = res.data.data;
            setLocal("access_token", data.access_token);
            setLocal("refresh_token", data.refresh_token);
            setLocal("role_id", role_id);
            setLocal("name", data.name);
            setLocal("phoenix_user_id", data.phoenix_user_id);
            setLocal("email", data.email);
            setLocal("new", data.new);
            setLocal("unique_id", data.unique_id);
            setLocal("legacy_user_id", data.legacy_user_id);
            setLocal("slug", data.slug);
            window.location.reload();
          });
        });
    }
  });
};
export const NotificationPermission = async (slug) => {
  await Notification.requestPermission().then(async (res) => {
    console.log(res);
    if (res === "granted") {
      if (firebase.messaging.isSupported()) {
        store.dispatch({ type: "SHOW_SUCCESS", message: "Notifications turned ON !" });
        const messaging = firebase.messaging();
        const token = await messaging.getToken({
          vapidKey: "BOe6ho-vNFU10Ebh5JDvTgVuHKoO2mgvGOM7ttB0TPhSg5Sw7BWGOIWH46dF8SFxeSJ17Kg9yQXDd691_vZ5TeY",
        });
        console.log(token);
        Post(1, "save_token", { device_token: token });
        await Post(1, "add_category_notification", {
          course_slug: encodeURIComponent(slug),
        });
      } else {
        console.log("Firebase messaging not supported");
        store.dispatch({ type: "SHOW_WARNING", message: "Firebase messaging not supported" });
      }
    }
  });
};
