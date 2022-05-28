import React, { Component } from "react";
import Login from "./Login";

export default class AdminLogin extends Component {
  render() {
    return <Login admin={true} />;
  }
}
