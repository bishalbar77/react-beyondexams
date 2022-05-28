import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "./baseDomain";
import { getLocal } from "./localStorageAccess";
import BackIrregularImageBelow from "../../assets/images/images/backIrregularShapeBelow.svg";
import BackIrregularImageAfter from "../../assets/images/images/backIrregularShapeAbove.svg";
import logo from "../../assets/images/logo.svg";
import Translate from "./translate";
import "../../assets/css/common/EmptyPageLayout.css";
import * as firebase from "firebase/app";
import "firebase/auth";

class EmptyPageLayout extends Component {
  state = {};

  logout = () => {
    swal({
      title: "Logout",
      text: "Are You sure to end the current session?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/logout`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
        })
          .then(async () => {
            localStorage.clear();
            await firebase
              .auth()
              .signOut()
              .then(function () {
                // Sign-out successful.
              })
              .catch(function (error) {
                // An error happened.
              });
            window.location.href = "/";
          })
          .catch(() => {
            swal("Unauthorised Access", "You're not allowed to perform this action", "error").then(() => {
              localStorage.clear();
              window.location.href = "/";
            });
          });
      }
    });
  };

  render() {
    return (
      <>
        <img src={BackIrregularImageBelow} alt="Irregular Shape" className="irregular-shape irregular-shape-1" />
        <img src={BackIrregularImageAfter} alt="Irregular Shape" className="irregular-shape irregular-shape-2" />
        <div className="empty-layout-upper-bar notranslate">
          <div style={{ backgroundImage: `url(${logo})` }} className="empty-layout-logo"></div>
          <div className="justify-center">
            <div className="empty-page-logo-text">BeyondExams</div>
          </div>
          <div className="justify-center">
            <div className="empty-page-logout-btn justify-center" onClick={this.logout}>
              Logout
            </div>
          </div>
          <div>
            <Translate />
          </div>
        </div>
      </>
    );
  }
}

export default EmptyPageLayout;
