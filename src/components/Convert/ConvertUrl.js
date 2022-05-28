import React, { Component } from "react";
import { TextField, Button } from "@material-ui/core";
import swal from "sweetalert";
import { VideoById, key } from "../common/videocommon";
import IconButton from "@material-ui/core/IconButton";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import "./convert.css";

export default class convert extends Component {
  state = {
    url: "",
    converted: "",
  };
  copyLink = () => {
    navigator.clipboard.writeText(this.state.converted);
    swal("Success", "Link Copied", "success");
  };

  handleSubmit = async () => {
    let youtubeId = new URL(this.state.url).searchParams.get("v");
    if (!youtubeId) {
      let tempURL = this.state.url.split("youtu.be/")[1];
      if (tempURL) {
        youtubeId = tempURL.slice(0, 11);
      } else if (!youtubeId) {
        youtubeId = new URL(this.state.url).searchParams.get("id");
      }
    }
    if (youtubeId) {
      let response = await VideoById(key[Math.floor(Math.random() * key.length)], youtubeId);
      if (response) {
        if (response.data.items.length > 0) {
          // let query = response.data.items[0].snippet.channelTitle;
          // let converted = "https://www.beyondexams.org/dashboard/videos?q=" + encodeURIComponent(query).replace(/%20/g, "+") + "&id=" + youtubeId
          let converted = "https://beyondexams.org/" + youtubeId;
          navigator.clipboard.writeText(converted);
          this.setState({ converted: converted });
          swal("Success", "Link Copied", "success");
        } else {
          swal("Error", "URL Not Valid", "error");
        }
      }
    } else {
      swal("Error", "URL Not Valid", "error");
    }
  };
  render() {
    return (
      <div className="home-container">
        <div className="convert-div">
          <TextField
            label="Enter youtube url"
            onChange={(e) => {
              this.setState({ url: e.target.value });
            }}
          />
          <Button variant="contained" color="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>
        {this.state.converted && (
          <div className="convert-div-two">
            <h3>{this.state.converted}</h3>
            <IconButton onClick={this.copyLink}>
              <FileCopyOutlinedIcon style={{ fontSize: "32px", marginBottom: "2px" }} />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}
