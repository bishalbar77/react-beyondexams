import React, { Component } from "react";
import swal from "sweetalert";
import axios from "axios";
import { getLocal } from "../../../../common/localStorageAccess";
import baseDomain from "../../../../common/baseDomain";
import CloudUploadIcon from "../../../../../assets/images/images/uploadCloud.png";
import CheckCircleOutlineIcon from "../../../../../assets/images/icons/checkIconMaterial.svg";
import "../../../../../assets/css/Mentors/Dashboard/dragDropFile.css";

class DragAndDrop extends Component {
  state = {
    inDropZone: false,
    showSuccess: false,
  };

  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ inDropZone: true });
  };
  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ inDropZone: false });
  };
  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    this.setState({ inDropZone: true });
  };
  handleFileCheck = (files, type) => {
    let type_val = 0;
    const formData = new FormData();
    // formData.append("role_id", "1");
    //formData.append("sender_id", localStorage.getItem("user_id"));
    formData.append("chat_id", parseInt(localStorage.getItem("chat_id")));
    // formData.append("sender_name", localStorage.getItem("username"));
    formData.append("file", files[0]);
    if (type === "image/*") {
      type_val = 2;
    } else if (type === "video/*") {
      type_val = 3;
    } else if (type === "audio/*") {
      type_val = 4;
    } else if (type === ".doc,.docx,.pdf") {
      type_val = 5;
    }
    console.log(type_val);
    formData.append("type_id", type_val);
    swal({
      title: "Send File!",
      text: "Want to send the current file?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.props.handleDropDown(3);
        axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/send_multimedia_message`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
          },
          data: formData,
        }).then((data) => {
          console.log(data);
          this.props.handleDropDown(0);
          swal("Uploaded Successfully", "", "success");
        });
      } else {
        this.setState({ showSuccess: true });
        return null;
      }
    });
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let Newfiles = [...e.dataTransfer.files];
    this.handleFileCheck(Newfiles, this.props.handleFileType);
    this.setState({ inDropZone: false });
  };

  render() {
    return (
      <>
        <div
          className={this.state.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"}
          onDrop={(e) => !this.state.showSuccess && this.handleDrop(e)}
          onDragOver={(e) => !this.state.showSuccess && this.handleDragOver(e)}
          onDragEnter={(e) => !this.state.showSuccess && this.handleDragEnter(e)}
          onDragLeave={(e) => !this.state.showSuccess && this.handleDragLeave(e)}
        >
          {!this.state.showSuccess ? (
            <div>
              <div>
                <img src={CloudUploadIcon} alt="Cloud Upload" style={{ fontSize: "5rem" }} />
              </div>
              <div>
                <input
                  accept={this.props.handleFileType}
                  type="file"
                  id="Dropfile"
                  onChange={(e) => {
                    this.handleFileCheck(e.target.files, this.props.handleFileType);
                  }}
                />

                <label className="Droplabel" htmlFor="Dropfile">
                  Choose a file
                </label>
                <span> or Drag file</span>
              </div>
            </div>
          ) : (
            <div>
              <img src={CheckCircleOutlineIcon} alt="Check" style={{ fontSize: "5rem" }} />
              <div>
                <span>Successfully Added</span>
              </div>
              <div>
                <button onClick={() => this.setState({ showSuccess: false })}>Try again</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default DragAndDrop;
