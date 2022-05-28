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
import { Post, swalWithAuth } from "../../../../common/common";
import { notify } from "../../../Navbar/notify";
import "../../Search/Components/ReadingMaterial/readingmaterial.css";
import style from "../CourseDetail.module.css";
import { ReactProjects } from "../courses";
import { PROJECT_ADD_KEYS } from "../globalData";
import styles from "./Project.module.css";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upload: {
    color: "black",
    background: "white",
    borderRadius: "16px",
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
    width: "650px",
    padding: "5px",
  },
}));

function Project(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [projects, setProjects] = React.useState(ReactProjects);
  const [image, setImage] = React.useState(null);
  const [sendImage, setSendImage] = React.useState(null);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);

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
      // Get(1, "get_course_projects", {
      //   course_slug: props.course.slug,
      // }).then((res) => {
      //   console.log(res.data.data.projects);
      //   setProjects(res.data.data.projects);
      // });
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
  return (
    <div className="course_project">
      {localStorage.getItem("role_id") === "2" && (
        <>
          <button className={style.btnPrimary} onClick={() => setOpen(true)}>
            Add Project
          </button>
          <Dialog open={open} onClose={() => setOpen(false)} classes={{ paper: classes.paper }}>
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
                  <textarea
                    rows={6}
                    type="text"
                    className="add-video-input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    placeholder="For eg: Submit a pdf file containing details how to setup a ubuntu server."
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
        open={props.openViewProjects}
        classes={{ paper: classes.paper }}
        onClose={() => props.toggleOpenViewProjects(false)}
      >
        <DialogTitle
          disableTypography
          className={classes.dialogTitle}
          style={{ paddingRight: "5px", paddingBottom: "0" }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Projects</Box>
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
          <DialogContent>
            <div className={styles.root}>
              {projects.length > 0 ? (
                projects.map((e, i) => (
                  <div style={{ position: "relative" }}>
                    <div className={styles.project_view}>
                      <p>
                      { <div dangerouslySetInnerHTML={{ __html: e.title }} /> }
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p>
                    Congratulations🥳🎉 <br />
                    <br />
                    We are nearly done here, Request an assignment to test your knowledge and get the certificate.
                    <br />
                    <br /> (Don't forget to check you e-mail).
                  </p>
                  <div className="spacing-1"></div>
                  <button className="watchBtn bg-color-white" onClick={() => requestProject()}>
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
