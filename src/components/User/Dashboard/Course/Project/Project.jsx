import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import swal from "sweetalert";
import Incomplete from "../../../../../assets/images/icons/incomplete.png";
import Complete from "../../../../../assets/images/icons/complete.png";
import ProfileUpload from "../../../../../assets/images/icons/profile-upload.png";
import { Get, Post, swalWithAuth } from "../../../../common/common";
import { notify } from "../../../Navbar/notify";
import "../../Search/Components/ReadingMaterial/readingmaterial.css";
import { PROJECT_ADD_KEYS } from "../globalData";
import styles from "./Project.module.css";
import Slider from "@material-ui/core/Slider";
import Submission from "./Submission";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import style from "../CourseDetail.module.css";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import baseDomain from "../../../../common/baseDomain";
import { getLocal } from "../../../../common/localStorageAccess";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upload: {
    color: "black",
    background: "white",
    borderRadius: "8px",
    height: "39px",
    paddingLeft: "15px",
    paddingRight: "15px",
    textTransform: "capitialize",
  },
  closeIcon: { color: "white" },
  closeIconTwo: { color: "black" },
  input: {
    display: "none",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 99999,
    color: "#fff",
  },
  paper: {
    borderRadius: "16px",
    width: "850px",
    padding: "5px",
  },
}));

function Project(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [projects, setProjects] = React.useState(null);
  // const [image, setImage] = React.useState(null);
  // const [sendImage, setSendImage] = React.useState(null);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [projectSelected, setProjectSelected] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [submissions, setSubmissions] = React.useState([]);
  const [maxScore, setMaxScore] = React.useState(0);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = React.useState(false);
  const [link, setLink] = React.useState("");

  const [isUploadFile, setIsUploadFile] = React.useState(false);
  const [uploadData, setUploadData] = React.useState({
    title: "",
    upPercent: 0,
  });

  const handleProjectSelect = (e) => {
    setProjectSelected(e.target.value);
  };
  const handleUpload = async (event) => {
    let file = event.target.files[0];
    dispatch({
      type: "SHOW_SUCCESS",
      message: "Uploading in progress",
    });

    setUploadData({
      title: file.name,
      upPercent: 0,
    });
    setIsUploadFile(true);

    let formData = new FormData();
    formData.append("title", file.name);
    formData.append("file", file);
    formData.append("project_slug", projects[projectSelected].slug);
    // setImage(URL.createObjectURL(event.target.files[0]));
    // setSendImage(event.target.files[0]);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_project_submission`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: formData,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        if (percent < 100) {
          setUploadData({
            title: file.name,
            upPercent: percent,
          });
        }
      },
    }).then(() =>
      dispatch({
        type: "SHOW_SUCCESS",
        message: "File Uploaded",
      })
    );

    setOpenBackDrop(true);
    handleClickOpenViewProjects();
    setIsUploadFile(false);
  };

  const handleSubmit = async () => {
    await Post(1, "add_project", { course_slug: props.course.slug, title }).then(() => {
      // props.showSuccess("Project added successfully.");
      notify(`🔑 You got ${PROJECT_ADD_KEYS} keys for adding a project.`);
      setTitle("");
    });
    setOpen(false);
  };
  useEffect(() => {
    if (props.openViewProjects) {
      props.toggleOpenViewProjects(false);
      handleClickOpenViewProjects();
    }
  }, [props.openViewProjects]);

  const handleClickOpenViewProjects = () => {
    if (localStorage.getItem("access_token")) {
      props.toggleOpenViewProjects(true);
      Get(1, "get_course_project_submission", {
        course_slug: props.course.slug,
      }).then((res) => {
        console.log(res.data.data);
        let projects = res.data.data.course;
        setProjects(projects);
        setMaxScore(res.data.data.max_score);
        let i;
        for (i = 0; i < projects.length; i++) {
          if (projects[i].submissions.length) {
          } else {
            setProjectSelected(i);
            setIsComplete(false);
            break;
          }
        }
        if (i == projects.length) {
          setProjectSelected(-1);
          setIsComplete(true);
        }
        setIsUploadOpen(false);
        setOpenBackDrop(false);
      });
    } else {
      swalWithAuth("Please Sign-in to continue", 1);
    }
  };
  const requestProject = async () => {
    if (localStorage.getItem("access_token")) {
      Post(1, "add_project_request", {
        course_slug: props.course.slug,
      }).then(() => {
        props.toggleOpenViewProjects(false);
        props.showSuccess("Project requested successfully.");
      });
    } else {
      swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        }
      });
    }
  };
  const handleClickViewSubmissions = () => {
    setOpenBackDrop(true);

    Get(1, "get_course_project_submissions", {
      course_slug: props.course.slug,
    }).then((res) => {
      setOpenBackDrop(false);
      setIsSubmissionOpen(true);
      console.log(res.data.data.data);
      setSubmissions(res.data.data.data);
    });
  };
  const handleClickAddLink = () => {
    setIsAddLinkDialogOpen(true);
  };
  const handleSubmitLink = async () => {
    let formData = new FormData();
    formData.append("submission_link", link);
    formData.append("project_slug", projects[projectSelected].slug);

    await Post(1, "add_project_submission", formData).then((res) => {
      if (res) {
        dispatch({
          type: "SHOW_SUCCESS",
          message: "Link Added Successfully",
        });
      }
    });
    setLink("");
    setOpenBackDrop(true);
    handleClickOpenViewProjects();
    setIsAddLinkDialogOpen(false);
  };
  const handleProjectDelete = async (e) => {
    await Post(1, "remove_project", { project_slug: e.slug }).then((res) => {
      if (res) {
        dispatch({
          type: "SHOW_SUCCESS",
          message: "Project removed successfully",
        });
      }
    });
    setLink("");
    setOpenBackDrop(true);
    handleClickOpenViewProjects();
  };
  return (
    <div className="course_project">
      {localStorage.getItem("role_id") === "2" && (
        <>
          <button className={style.btnPrimary} onClick={() => setOpen(true)}>
            Add Project
          </button>
          <Dialog open={open} onClose={() => setOpen(false)} classes={{ paper: classes.paper }} maxWidth="lg">
            <DialogTitle
              disableTypography
              className={classes.dialogTitle}
              style={{ paddingRight: "5px", paddingBottom: "0" }}
            >
              <Typography component="div">
                <Box fontWeight={500}>Add Project</Box>
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="add-video-div">
                {/* <div className="flex add-video-title-div">
                  <p className="add-module-title">Add Task</p>
                  <InfoOutlinedIcon />
                </div> */}
                <div className="flex">
                  {/* <textarea
                    rows={6}
                    type="text"
                    className="add-video-input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    placeholder="For eg: Submit a pdf file containin g details how to setup a ubuntu server."
                  /> */}
                  <CKEditor
                      editor={ ClassicEditor }
                      placeholder="For eg: Submit a pdf file containin g details how to setup a ubuntu server."
                      data=""
                      onReady={ editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log( 'Editor is ready to use!', editor );
                      } }
                      onChange={ ( event, editor ) => {
                        setTitle(editor.getData());
                      }}
                      onBlur={ ( event, editor ) => {
                          console.log( 'Blur.', editor );
                      } }
                      onFocus={ ( event, editor ) => {
                          console.log( 'Focus.', editor );
                      } }
                  />
                </div>

                <div className="key-info">
                  <p style={{ textAlign: "center", fontSize: 12 }}>
                    Earn {PROJECT_ADD_KEYS} bonus keys by adding project.
                  </p>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleSubmit()} color="primary" disabled={!title}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <button className={style.btnPrimary} onClick={handleClickOpenViewProjects}>
        View Projects
      </button>
      <Dialog
        maxWidth="lg"
        open={props.openViewProjects}
        classes={{ paper: classes.paper }}
        onClose={() => {
          props.toggleOpenViewProjects(false);
          setIsSubmissionOpen(false);
        }}
      >
        {!isSubmissionOpen ? (
          <>
            <DialogTitle
              disableTypography
              className={classes.dialogTitle}
              style={{ paddingRight: "5px", paddingBottom: "0" }}
            >
              <Typography component="div">
                <Box fontWeight={500} fontSize={18}>
                  Projects
                </Box>
              </Typography>
              <IconButton onClick={() => props.toggleOpenViewProjects(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
            {!projects ? (
              <div className="search_loader">
                <CircularProgress />
              </div>
            ) : (
              <DialogContent className="project_content">
                <div className={styles.root}>
                  {projects.length > 0 ? (
                    <>
                      {projects.map((e, i) => (
                        <div style={{ position: "relative" }}>
                          <div className={styles.project_view}>
                            <p>
                              {i + 1}. { <div style={{ marginLeft: "10px"}} dangerouslySetInnerHTML={{ __html: " " + e.title }} /> }
                              <DeleteOutlineIcon
                                style={{ marginLeft: "10px", color: "gray", fontSize: "20px", cursor: "pointer" }}
                                onClick={(event) => {
                                  handleProjectDelete(e);
                                }}
                              />
                            </p>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {localStorage.getItem("role_id") !== "2" ? (
                          <>
                            {!isComplete && (
                              <Button
                                size="small"
                                component="span"
                                variant="outlined"
                                className={classes.upload}
                                startIcon={<img src={ProfileUpload} alt="" />}
                                onClick={() => setIsUploadOpen(true)}
                              >
                                Add Sumbission
                              </Button>
                            )}

                            <img
                              style={{ marginLeft: "10px" }}
                              src={isComplete ? Complete : Incomplete}
                              alt="incomplete"
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={handleClickViewSubmissions}
                              size="small"
                              component="span"
                              variant="outlined"
                              className={classes.upload}
                              startIcon={<img src={ProfileUpload} alt="" style={{ transform: "rotate(180deg)" }} />}
                            >
                              View Submissions
                            </Button>
                          </>
                        )}
                      </div>

                      <hr className={styles.project_hrLine} />

                      <div className={styles.project_grades}>
                        <Typography>
                          <Box fontWeight={500} fontSize={30}>
                            Grades
                          </Box>
                        </Typography>
                        <div className={styles.project_gradesContainer}>
                          <p className={styles.project_gradesText}>
                            This represents the grade needed to pass this course.
                          </p>
                          <div className={styles.project_gradesInput}>
                            <Slider
                              value={maxScore ? maxScore : 60}
                              aria-labelledby="disabled-slider"
                              className="project_slider"
                            />
                            <output className={styles.bubble} style={{ left: "60%" }}>
                              60%
                            </output>
                            {maxScore > 0 && (
                              <output className={styles.bubble2 + " " + styles.bubble} style={{ left: maxScore + "%" }}>
                                {maxScore}%
                              </output>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        {/* Uh oh! Our course creators don't seem to have added a project to this course yet. Help them fix it!
                        Just click on the button below! */}
                        Congratulations🥳🎉 <br />
                        <br />
                        We are nearly done here, Request an assignment to test your knowledge and get the certificate.
                        <br />
                        <br /> (Don't forget to check you e-mail).
                      </p>
                      <div className="spacing-1"></div>
                      <button
                        className="watchBtn bg-color-white flex-center"
                        onClick={() => requestProject()}
                        style={{ alignSelf: "center" }}
                      >
                        Request a Project
                      </button>
                    </>
                  )}
                </div>
              </DialogContent>
            )}

            <DialogActions>
              <Button onClick={() => props.toggleOpenViewProjects(false)} color="primary">
                Cancel
              </Button>
              {/* <Button onClick={() => handleSubmit()} color="primary" disabled={!title}>
                Submit
              </Button> */}
            </DialogActions>
          </>
        ) : (
          <div className="course_submission">
            <div className={styles.submission}>
              <div className={classes.dialogTitle}>
                <h2>Submit Scores</h2>
                <IconButton
                  onClick={() => {
                    props.toggleOpenViewProjects(false);
                    setIsSubmissionOpen(false);
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </div>
              <div className={styles.submission_hero}>
                <div className={styles.submission_top}>
                  <p>VIEW SUBMISSION</p>
                  <p>AWARD MARKS</p>
                </div>
                {submissions.map((ele) =>
                  ele.submissions.reverse().map((e) => <Submission data={e} title={ele.title} />)
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        open={isUploadOpen}
        classes={{ paper: classes.paper }}
        onClose={() => {
          setIsUploadOpen(false);
        }}
      >
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500} fontSize={18}>
              Select Project
            </Box>
          </Typography>
          <IconButton
            onClick={() => {
              setIsUploadOpen(false);
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="project_content">
          <div className={styles.root}>
            {projects &&
              projects.map((e, i) => (
                <div style={{ position: "relative" }}>
                  <div className={styles.project_view}>
                    {e.submissions.length > 0 ? (
                      <>
                        <CheckCircleIcon className={styles.check} />
                        <label>{e.title}</label>
                      </>
                    ) : (
                      <>
                        <input
                          onChange={handleProjectSelect}
                          type="radio"
                          name="age"
                          value={i}
                          id={"project_" + i}
                          checked={i == projectSelected}
                        />
                        <label for={"project_" + i}>{e.title}</label>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {isUploadFile && (
            <div className={styles.fileContainer}>
              <div className={styles.fileName}>{uploadData.title}</div>
              <div className={styles.progressBar}>
                <div style={{ width: uploadData.upPercent + "%" }}></div>
              </div>
              {/* <ClearIcon
                className={styles.closeButton}
              /> */}
            </div>
          )}
          {projectSelected != -1 && (
            <div className={styles.upload_btn}>
              <Button
                size="small"
                component="span"
                variant="outlined"
                className={classes.upload}
                startIcon={<img src={ProfileUpload} alt="" />}
                onClick={handleClickAddLink}
              >
                Add link
              </Button>
              <input
                // accept="application/pdf"
                className={classes.input}
                id="upload"
                onChange={handleUpload}
                type="file"
              />
              <label htmlFor="upload">
                <Button
                  size="small"
                  component="span"
                  variant="outlined"
                  className={classes.upload}
                  startIcon={<img src={ProfileUpload} alt="" />}
                >
                  Upload File
                </Button>
              </label>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={isAddLinkDialogOpen}
        onClose={() => setIsAddLinkDialogOpen(false)}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Add Project Link</Box>
          </Typography>
          <IconButton onClick={() => setIsAddLinkDialogOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            value={link}
            placeholder="Project link"
            onChange={(e) => {
              setLink(e.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddLinkDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmitLink()} color="primary" disabled={!link}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (message) =>
      dispatch({
        type: "SHOW_SUCCESS",
        message,
      }),
  };
};

export default connect(null, mapDispatchToProps)(Project);
