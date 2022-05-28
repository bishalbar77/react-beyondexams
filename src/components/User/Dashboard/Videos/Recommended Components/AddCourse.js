import React, { useState, useEffect } from "react";
import { Modal, Backdrop, Dialog, Button, DialogTitle, Box, DialogContent, DialogActions } from "@material-ui/core";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Typography from "@material-ui/core/Typography";
import styles from "./AddCourse.module.css";
import { getLocal } from "../../../../common/localStorageAccess";
import swal from "sweetalert";
import baseDomain from "../../../../common/baseDomain";
import axios from "axios";
import CourseCard from "../../Browse/CourseCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

const AddCourse = (props) => {
  const [level, setLevel] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModule, setShowModule] = useState(false);
  const [openAddModule, setOpenAddModule] = useState(false);
  const [addModuleTitle, setAddModuleTitle] = useState("");
  const [course, setCourse] = useState();
  const [modules, setModules] = useState([]);

  const getCourse = async (level) => {
    setLoading(true);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_user_created_courses?level=${level}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        let courses = Array.isArray(res) ? res : [];
        setCourses(courses);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    setLoading(false);
  };

  const handleModule = async (id) => {
    setLoading(true);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_modules?category_id=${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        setModules(res);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    setLoading(false);
  };

  const submitAddModule = () => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_new_module`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        category_id: course.id,
        title: addModuleTitle,
        // description: moduleDescription,
      },
    })
      .then((data) => {
        swal("success", "Module is added successfully", "success");
        setOpenAddModule(false);
        handleModule(course.id);
        setAddModuleTitle("");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const submitVideoUpload = async (moduleId) => {
    console.log(props.video);
    setLoading(true);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_to_module`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        // category_id: props.parentId,
        module_id: moduleId,
        video_url: props.video.url,
        // start_time: t ? t : 0,
        // ordering: -1,
      },
    })
      .then((data) => {
        props.closeIsShow();
        swal("success", "Video is added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    setLoading(false);
  };

  useEffect(() => {
    getCourse(1);
  }, []);

  return (
    <div>
      <Modal
        open={props.isShow}
        onClose={props.closeIsShow}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        BackdropProps={{
          timeout: 300,
        }}
        BackdropComponent={Backdrop}
        className={styles.modal}
      >
        <div className={styles.container}>
          <div className={styles.title}>
            {level === 1 ? (
              <Typography>Add To Course</Typography>
            ) : (
              <ArrowBackOutlinedIcon
                className={styles.tool}
                onClick={() => {
                  if (showModule) getCourse(level);
                  else {
                    setLevel(level - 1);
                    getCourse(level - 1);
                  }
                  setShowModule(false);
                }}
              />
            )}
            <ClearOutlinedIcon className={styles.tool} onClick={props.closeIsShow} />
          </div>
          <div className={styles.content}>
            {loading ? (
              <CircularProgress size={20} className={styles.loader} />
            ) : showModule ? (
              <div className={styles.moduleContainer}>
                <div>Select a module</div>
                <Button
                  onClick={() => {
                    setOpenAddModule(true);
                  }}
                  className={styles.addModuleButton}
                >
                  Add New Module
                </Button>
                <div className={styles.modules}>
                  {modules.map((e, i) => (
                    <div
                      className={styles.module}
                      onClick={() => {
                        console.log(e);
                        submitVideoUpload(e.id);
                      }}
                      key={i}
                    >
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.cardContainer}>
                {courses.map((e) => (
                  <CourseCard
                    course={e}
                    key={e.id}
                    openProfile={() => {}}
                    redirect={() => {
                      if (e.num_categories === null) {
                        setShowModule(true);
                        handleModule(e.id);
                        setCourse(e);
                      } else {
                        setLevel(e.level + 1);
                        getCourse(e.level + 1);
                      }
                    }}
                    class={styles.courseCard}
                    bottomClass={styles.bottomClass}
                    isActive={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
        <DialogTitle
          disableTypography
          style={{
            paddingRight: "5px",
            paddingBottom: "0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="div">
            <Box fontWeight={500}>Add New Module</Box>
          </Typography>
          <IconButton onClick={() => setOpenAddModule(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="add-video-div">
            <div className="flex add-video-title-div">
              <p className="add-module-title">Module Title</p>
              <InfoOutlinedIcon />
            </div>
            <div className="flex">
              <input
                type="text"
                className="add-video-input"
                value={addModuleTitle}
                onChange={(e) => {
                  setAddModuleTitle(e.target.value);
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModule(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => submitAddModule()} color="primary" disabled={!addModuleTitle}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCourse;
