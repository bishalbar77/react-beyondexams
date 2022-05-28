import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../common/baseDomain";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  searchIcon: {
    color: "#FFF",
    width: "30px",
    height: "30px",
    marginTop: "5px",
    "@media (max-width: 600px)": {
      width: "22px",
      height: "22px",
    },
  },
});

class Search extends Component {
  state = {
    term: "",
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.term) {
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/add_search_term`,
        method: "POST",
        data: {
          search_term: this.state.term,
        },
      }).catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
      this.props.history.push(
        "/dashboard/search?q=" +
        encodeURIComponent(this.state.term).replace(/%20/g, "+")
      );
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="home-search-input"
          className="home-search-input"
          placeholder="What do you want to learn today?"
          autoComplete="off"
          value={this.state.term}
          onChange={(e) => {
            this.setState({ term: e.target.value });
          }}
        />
        <button type="submit" className={this.state.term ? "bg-color-blue" : ""}>
          <SearchIcon className={classes.searchIcon} />
        </button>
      </form>
    );
  }
}
export default withRouter(withStyles(useStyles)(Search));
