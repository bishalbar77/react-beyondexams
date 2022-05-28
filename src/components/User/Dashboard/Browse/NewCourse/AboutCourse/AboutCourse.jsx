import { Button } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import cx from "classnames";
import "cropperjs/dist/cropper.css";
import { Steps } from "intro.js-react";
import React, { useEffect } from "react";
import Cropper from "react-cropper";
import swal from "sweetalert";
import "../../../../../../assets/css/User/Profile/profile_dialog.css";
// import Advanced from "../../../../../../assets/images/icons/advanced.svg";
// import Info from "../../../../../../assets/images/icons/alert-circle-colored.svg";
// import Beginner from "../../../../../../assets/images/icons/beginner.svg";
// import Intermediate from "../../../../../../assets/images/icons/intermediate.svg";
// import ProfileUpload from "../../../../../../assets/images/icons/profile-upload.png";
import baseDomain from "../../../../../common/baseDomain";
import { getLocal } from "../../../../../common/localStorageAccess";
import styles from "./AboutCourse.module.css";
import { CreateCourseSteps } from "./TutorialSteps";

// import * as jsonData from "../newCourse.json";
var jsonData = require("../newCourse.json");


const useStyles2 = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "90vh",
    maxWidth: "90vw",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    width: "calc(100vw - 40px)",
    maxWidth: "447px",
  },
})((props) => (
  <Menu
    elevation={0}
    disableAutoFocusItem
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({}))((props) => <MenuItem {...props} />);

const useStyles = (theme) => ({
  paper: {
    borderRadius: "16px",
    width: "650px",
    padding: "5px",
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
  container: {
    marginTop: "8px",
    background: "#fafafa",
    border: "1px solid #686868",
    borderRadius: "20px",
    width: "100%",
    padding: "8.5px 15px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1d1d1d",
  },

  items: {
    display: "inline-block",
    marginRight: "5px",
    cursor: "pointer",
  },

  inputKeyword: {
    outline: "none",
    border: "none",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    width: "100%",
  },

  tag: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 8px",
    background: "#E8E8E8",
    borderRadius: "38px",
    height: "30px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1D1D1D",
    margin: "3px 0px",
  },
});

const AboutCourse = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectValue, setSelectValue] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [keywords, setKeywords] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [courseLevel, setCourseLevel] = React.useState(null);
  const { classes } = props;
  const [cropStatus, setCropStatus] = React.useState({
    open: false,
    img: "",
  });
  const [levelError, setLevelError] = React.useState("");
  const [keyError, setKeyError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState(true);
  const [nextClick, setNextClick] = React.useState(false);

  function handleImageUpload(img) {
    const newImg = URL.createObjectURL(img);
    setImage(img);
    setCropStatus({
      open: true,
      img: newImg,
    });
  }

  function handleCropClose(img) {
    setImage(img);
    setCropStatus({
      open: false,
      img: "",
    });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    setSelectValue(value);
    setAnchorEl(null);
  };

  const validated = () => {
    if (keywords.length === 0) {
      window.scrollTo(0, 100);
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
      setKeyError("Please provide at least one keyword (Please press ENTER key to submit keywords) 😊");
    } else setKeyError("");
    if (courseLevel === null) {
      setLevelError("Please select a level 😊");
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    } else setLevelError("");
  };

  const handleRoute = () => {
    if (courseLevel) {
      props.handleSetCourse("courseLevel", courseLevel);
    }
    if (keywords.length) {
      props.handleSetCourse("keywords", keywords);
    }
    if (image) props.handleSetCourse("image", image);
  };

  const handleCreate = async () => {
    if (isLoading) return;
    setNextClick(true);
    validated();
    if (keywords.length === 0 || courseLevel === null) return;
    setIsLoading(true);
    handleRoute();
    let formData = new FormData();
    formData.append("title", props.course?.title);
    formData.append("description", props.course?.description);
    if (image) {
      const myFile = await new File([image], `image-${props.title}.jpeg`);
      formData.append("image", myFile);
    }
    formData.append("course_level", courseLevel.toString());
    // formData.append("level", level);
    formData.append(props.course?.courseType === "classes" ? "parent_id" : "topic_id", props.course?.id.toString());
    keywords.forEach((e, i) => {
      formData.append(`keywords[${i}]`, e);
    });
    if (props.course?.courseId !== undefined) formData.append("course_id", props.course?.courseId);

    await axios({
      url:
        props.course?.courseId === undefined
          ? `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.addCourse}`
          : `${baseDomain.route}${baseDomain.subRoute}/${jsonData.api.editCourse}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: formData,
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        props.handleSetCourse("courseId", res.id);
        props.handleSetCourse("slug", res.slug);
        props.handleSetCourse("parent_id", res.parent_id);
        props.handleSetCourse("level", res.level);
        // swal("Success", "Course added successfully", "success");
        props.handleSetCourse("step", 4);
        // props.onNext();
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    setIsLoading(false);
  };

  const handleInputChange = (evt) => {
    setInput(evt.target.value);
    // validated();
  };

  const handleInputKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      const { value } = evt.target;

      setKeywords([...keywords, value]);
      setKeyError("");
      setInput("");
    }

    if (keywords.length && evt.keyCode === 8 && !input.length) {
      setKeywords(keywords.slice(0, keywords.length - 1));
    }
  };

  const handleRemoveItem = (index) => {
    return () => {
      setKeywords(keywords.filter((word, i) => i !== index));
    };
  };

  useEffect(() => {
    if (props.course && props.course.image) {
      setImage(props.course.image);
    }
    if (props.course?.courseLevel) setCourseLevel(props.course.courseLevel);
    if (props.course?.keywords) {
      console.log("innn");
      console.log(props.course);
      setKeywords(props.course?.keywords);
    }
    if (props.course?.courseLevel == "0") setSelectValue("Beginner");
    else if (props.course?.courseLevel == "1") setSelectValue("Intermediate");
    else if (props.course?.courseLevel == "2") setSelectValue("Advanced");
  }, [props.course]);

  useEffect(() => {
    if (localStorage.getItem("coc") === "true" && props.step === 3) {
      if (initial) {
        setTimeout(() => {
          setOpen(true);
          setInitial(false);
        }, 500);
      }
    }
  }, [props.step]);
  const closeTour = () => {
    setOpen(false);
    if (nextClick && localStorage.getItem("coc") === "true") {
      localStorage.setItem("coc", true);
    } else {
      localStorage.setItem("coc", false);
    }
  };
  return (
    <div
      className={cx(
        styles.container
        // props.step === 3 ? styles.slideIn : null,
        // props.step !== 3 ? styles.slideOut : null
      )}
    >
      <div className={styles.content}>
        <div className={styles.title}>{jsonData.heading.moreAboutCourse}</div>
        <div style={{ height: 10 }}></div>

        <div className={styles.inputContainer} data-tut="level">
          <label className={styles.label}>
            {jsonData.label.level}<span>*</span>
            <Tooltip
              enterTouchDelay={1}
              title={
                <div>
                  {jsonData.tooltip.beginner}
                  <br />
                  {jsonData.tooltip.intermediate}
                  <br />
                  {jsonData.tooltip.expert}
                </div>
              }
              arrow
            >
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
            </Tooltip>
          </label>
          <div onClick={handleClick} className={styles.selectInput}>
            {selectValue}
          </div>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={styles.drop}
          >
            <StyledMenuItem
              onClick={() => {
                handleSelect("Beginner");
                setCourseLevel(0);
                setLevelError("");
              }}
              // selected={courseLevel === 0}
            >
              <ListItemIcon>
                <img src={require(`../../../../../../assets/images/icons/${jsonData.images.beginner}`)} alt="" />
              </ListItemIcon>
              <ListItemText primary="Beginner" />
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => {
                handleSelect("Intermediate");
                setCourseLevel(1);
                setLevelError("");
              }}
              // selected={courseLevel === 1}
            >
              <ListItemIcon>
                <img src={require(`../../../../../../assets/images/icons/${jsonData.images.intermediate}`)} alt="" />
              </ListItemIcon>
              <ListItemText primary="Intermediate" />
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => {
                handleSelect("Advanced");
                setCourseLevel(2);
                setLevelError("");
              }}
              // selected={courseLevel === 2}
            >
              <ListItemIcon>
                <img src={require(`../../../../../../assets/images/icons/${jsonData.images.advanced}`)} alt="" />
              </ListItemIcon>
              <ListItemText primary="Advanced" />
            </StyledMenuItem>
          </StyledMenu>
          {levelError !== "" && (
            <div className={styles.error}>
              <span>{levelError}</span>
            </div>
          )}
        </div>
        <div className={styles.inputContainer} data-tut="keyword">
          <label className={styles.label}>
            {jsonData.label.keywords}<span>*</span>
            <Tooltip
              enterTouchDelay={1}
              title="Add keywords which give users an idea about what your course is about"
              arrow
            >
              <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
            </Tooltip>
          </label>

          <label>
            <ul className={classes.container}>
              {Array.isArray(keywords) &&
                keywords?.map((item, i) => (
                  <li key={i} className={classes.items} onClick={handleRemoveItem(i)}>
                    <div className={classes.tag}>
                      <span>{item}&nbsp;</span>
                      <CancelRoundedIcon style={{ fontSize: "0.8rem" }} />
                    </div>
                  </li>
                ))}
              <input
                className={classes.inputKeyword}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
              />
            </ul>
          </label>
          {keyError !== "" && (
            <div className={styles.error}>
              <span>{keyError}</span>
            </div>
          )}
        </div>
        <div className={styles.inputContainer} data-tut="thumbnail">
          <div>
            <label className="input-label" id="course">
              {jsonData.label.thumbnail}
              <Tooltip enterTouchDelay={1} title="Relevant images lead to more students enrolling." arrow>
                <img src={require(`../../../../../../assets/images/icons/${jsonData.images.info}`)} alt="" />
              </Tooltip>
            </label>
            <div
              className={cx(
                "certi-upload",
                "second-upload",
                "flex-column",
                "flex-center",
                "relative",
                styles.imageInput
              )}
            >
              <CropImage
                img={cropStatus.img}
                open={cropStatus.open}
                handleCropNvm={() => setCropStatus({ open: false, img: "" })}
                handleCropClose={handleCropClose}
              />
              {image ? (
                <>
                  <div className="certi_image_edit">
                    <IconButton onClick={(event) => setImage(null)}>
                      <CloseIcon className={classes.closeIconTwo} />
                    </IconButton>
                  </div>
                  <img src={URL?.createObjectURL(image)} alt="" />
                </>
              ) : (
                <div className="flex-column flex-center">
                  <input
                    accept="image/jpeg, image/png"
                    className={classes.input}
                    id="upload"
                    onChange={(event) => handleImageUpload(event.target.files[0])}
                    type="file"
                  />
                  <label htmlFor="upload">
                    <Button
                      size="large"
                      component="span"
                      className={classes.upload}
                      startIcon={<img src={require(`../../../../../../assets/images/icons/${jsonData.images.profileUpload}`)} alt="" />}
                    >
                      {jsonData.buttons.upload}
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.previousButton}
            onClick={() => {
              handleRoute();
              props.handleSetCourse("step", 2);
              // props.onPrevious();
            }}
          >
            {jsonData.buttons.previous}
          </button>
          <button
            data-tut="next3"
            className={styles.nextButton}
            onClick={handleCreate}
            style={
              courseLevel == null || keywords.length === 0
                ? { backgroundColor: "#686868", borderColor: "#686868" }
                : null
            }
          >
            {jsonData.buttons.next}
          </button>
        </div>
        <div style={{ height: 100 }}></div>
      </div>
      {props.step === 3 && (
        <Steps
          enabled={open}
          steps={CreateCourseSteps}
          initialStep={0}
          onExit={closeTour}
          options={{
            // disableInteraction: true,
            showStepNumbers: false,
            overlayOpacity: 0,
            doneLabel: "Got it",
            hidePrev: true,
            hideNext: true,
            nextLabel: "Next",
            tooltipClass: "myTooltipClass",
            highlightClass: "myHighlightClass",
            prevLabel: "back",
          }}
        />
      )}
    </div>
  );
};

export default withStyles(useStyles)(AboutCourse);

export function CropImage({ open, img, handleCropClose, handleCropNvm }) {
  const classes2 = useStyles2();
  const [croppedImg, setCroppedImg] = React.useState("");
  const cropperRef = React.useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    var imgData = cropper.getCroppedCanvas().toDataURL("image/jpeg").split(";base64,")[1];
    // var item_image = imgData.replace(/^data:image\/(png|jpg);base64,/, "")
    const blob = b64toBlob(imgData, "image/jpeg");
    // const blobUrl = URL.createObjectURL(blob);
    setCroppedImg(blob);
  };

  function b64toBlob(b64Data, contentType, sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes2.modal}
      open={open}
      // onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes2.paper}>
          <Cropper
            src={img}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            // Cropper.js options
            initialAspectRatio={16 / 9}
            guides={false}
            cropend={onCrop}
            onReady={onCrop}
            ref={cropperRef}
          />

          <div className="classes2.root">
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={croppedImg === "" || !croppedImg}
              onClick={() => handleCropClose(croppedImg)}
            >
              {jsonData.buttons.done}
            </Button>
            <Button color="primary" size="large" onClick={handleCropNvm}>
              {jsonData.buttons.cancel}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
