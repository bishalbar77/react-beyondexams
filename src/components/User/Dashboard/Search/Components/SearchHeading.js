import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Format } from "../../../../common/videocommon";

var jsonData = require("../search.json");

export default class SearchHeading extends Component {
  redirect = (title) => {
    let params = new URLSearchParams(window.location.search);
    if (title === "Courses") {
      params.set("tab", 1);
      return "?" + params.toString();
    } else if (title === "Videos") {
      params.set("tab", 2);
      return "?" + params.toString();
    } else if (title === "Notes") {
      params.set("tab", 3);
      return "?" + params.toString();
    } else if (title === "Reading Material") {
      params.set("tab", 4);
      return "?" + params.toString();
    } else if (title === "Q & A") {
      params.set("tab", 5);
      return "?" + params.toString();
    }
  };

  render() {
    const { title, data, showExploreAll } = this.props;
    return (
      <div className="s_a_h flex space-between">
        <h3>
          {title} ({Format(data.total)} {jsonData.results.result}){" "}
          <span role="img" aria-label="point-down">
            👇
          </span>
        </h3>
        {showExploreAll && (
          <Link replace to={this.redirect(title)} className="color-blue">
            {jsonData.results.explore}
          </Link>
        )}
      </div>
    );
  }
}
