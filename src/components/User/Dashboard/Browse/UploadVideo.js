import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import swal from "sweetalert";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";
import { VideoById, key } from "../../../common/videocommon";
import DoneIcon from "@material-ui/icons/Done";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import RemoveIcon from "@material-ui/icons/Remove";

function UploadVideo(props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [addNewModuleOpen, setAddNewModuleOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState(null);
  const [moduleSelected, setModuleSelected] = useState(null);
  // const [keywords, setKeywords] = useState("");

  const getModules = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_modules`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      params: {
        category_id: props.parentId,
      },
    })
      .then((res) => {
        setModuleSelected(res.data.data[0]?.id);
        setModules(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
    getModules();
  };
  const submitVideoUpload = () => {
    setOpen(false);
    let youtubeId = new URL(id).searchParams.get("v");
    let t = parseInt(new URL(id).searchParams.get("t"));
    if (!youtubeId) {
      youtubeId = id.split("youtu.be/")[1].slice(0, 11);
    }
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_to_module`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        // category_id: props.parentId,
        module_id: moduleSelected,
        video_url: youtubeId,
        // start_time: t ? t : 0,
        // ordering: -1,
      },
    })
      .then((data) => {
        props.updateVideoList();
        swal("success", "Video is added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  const error = () => {
    setDisabled(true);
    swal("Please try again", "Some error occured while fetching the video", "error");
  };
  const handleChange = (e) => {
    setId(e.target.value);
    setDisabled(true);
  };
  const fetchVideo = async (e) => {
    try {
      let youtubeId = new URL(id).searchParams.get("v");

      if (!youtubeId) {
        youtubeId = id.split("youtu.be/")[1].slice(0, 11);
      }
      if (youtubeId) {
        let response = await VideoById(key[Math.floor(Math.random() * key.length)], youtubeId);
        if (response) {
          if (response.data.items.length > 0) {
            setDisabled(false);
            swal("Success", "Video fetched successfully", "success");
          } else {
            error();
          }
        }
      } else {
        error();
      }
    } catch (err) {
      error();
    }
  };
  const submitVideoRearrange = async () => {
    if (props.newOrder.length) {
      await props.updateVideoList();
      swal("success", "Video's rearranged successfully", "success");
      props.setOrder([]);
    }
    props.handleRearrange(false);
  };
  const submitAddNewModule = () => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_new_module`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: props.parentId,
        title: moduleName,
        description: moduleDescription,
      },
    })
      .then((data) => {
        swal("success", "Module is added successfully", "success");
        setAddNewModuleOpen(false);
        setLoading(true);
        getModules();
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  return (
    <div className="flex-column-start">
      {localStorage.getItem("role_id") === "2" &&
        ((props.filters && props.filters.length === 0) ||
          (props.videos && props.videos[0].user_id.toString() === localStorage.getItem("phoenix_user_id"))) && (
          <>
            {props.rearrange ? (
              <Button size="large" color="primary" onClick={submitVideoRearrange} startIcon={<DoneIcon />}>
                Done
              </Button>
            ) : (
              <>
                <Button size="large" color="primary" onClick={handleClickOpen} startIcon={<CloudUploadIcon />}>
                  Upload New Video
                </Button>
                {props.videos && (
                  <>
                    <Button
                      size="large"
                      color="primary"
                      onClick={() => props.handleRearrange(true)}
                      startIcon={<EditIcon />}
                    >
                      Rearrange Videos
                    </Button>
                    <Button
                      size="large"
                      color="primary"
                      onClick={() => props.handleRemove()}
                      startIcon={<RemoveIcon />}
                    >
                      Delete Videos
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setLoading(true);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload New Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload new video, please enter the youtube video url in the below input field.
          </DialogContentText>
          {loading ? (
            <div className="upload-video-loader">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  margin="dense"
                  label="Youtube Video Url"
                  type="text"
                  value={id}
                  onChange={handleChange}
                  fullWidth
                  style={{ flex: 1, paddingRight: "20px" }}
                />
                <Button onClick={fetchVideo} color="primary" size="small" variant="outlined">
                  Fetch Video
                </Button>
              </div>
              {/* <TextField
                margin="dense"
                label="Keywords"
                type="text"
                onChange={(e) => setKeywords(e.target.value)}
                fullWidth
                style={{ flex: 1, paddingRight: "20px" }}
              /> */}

              {modules.length > 0 && (
                <>
                  <p className="add-module-text">Add video to module :- </p>
                  <Select
                    id="select-module"
                    value={moduleSelected}
                    style={{ minWidth: "200px", marginTop: "10px" }}
                    variant="outlined"
                    onChange={(e) => setModuleSelected(e.target.value)}
                  >
                    {modules.map((module) => (
                      <MenuItem value={module.id}>{module.title}</MenuItem>
                    ))}
                  </Select>
                </>
              )}
              <div>
                <Button
                  onClick={() => setAddNewModuleOpen(!addNewModuleOpen)}
                  color="primary"
                  size="small"
                  variant="outlined"
                  style={{ marginTop: "20px" }}
                >
                  Add New Module
                </Button>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setLoading(true);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={submitVideoUpload}
            color="primary"
            disabled={
              disabled || !moduleSelected
              //  || !keywords
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <Dialog open={addNewModuleOpen} onClose={() => setAddNewModuleOpen(!addNewModuleOpen)} id="NewModule">
          <DialogTitle>Add New Module</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                margin="dense"
                label="Module Title"
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                fullWidth
                style={{ minWidth: "300px", marginTop: "-10px" }}
              />
            </div>
            <TextField
              margin="dense"
              label="Description"
              type="text"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddNewModuleOpen(!addNewModuleOpen)} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => submitAddNewModule()}
              color="primary"
              disabled={!(moduleName && moduleDescription)}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default UploadVideo;
