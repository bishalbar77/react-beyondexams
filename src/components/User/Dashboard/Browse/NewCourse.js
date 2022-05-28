import React, { useState } from "react";
import AddPurple from "../../../../assets/images/icons/plus-circle-purple.svg";
import { Modal, Backdrop, Radio, RadioGroup, FormControlLabel, FormControl, Button } from "@material-ui/core";
import XIcon from "../../../../assets/images/icons/x.svg";
import InfoIcon from "../../../../assets/images/icons/alert-circle.svg";
import { withStyles } from "@material-ui/core/styles";
import InputField from "./InputField";
import TextArea from "./TextArea";
import SelectDrop from "./SelectDrop";
import ProfileUpload from "../../../../assets/images/icons/profile-upload.png";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AdvancedSelectInput from "./AdvancedSelect";
import InputKeywords from "./InputKeywords";
import baseDomain from "../../../common/baseDomain";
import axios from "axios";
import { getLocal } from "../../../common/localStorageAccess";
import swal from "sweetalert";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

// modal for crop-image
import { makeStyles } from "@material-ui/core/styles";
// import Modal from "@material-ui/core/Modal";
// import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

// Cropper
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const PrimaryRadio = withStyles({
  root: {
    color: "#000000",
    "&$checked": {
      color: "#6646E7",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

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
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

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
});

const NewCourse = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState();
  const [courseLevel, setCourseLevel] = useState();
  const [type, setType] = useState(0);
  const [keys, setKeys] = useState([]);
  const [image, setImage] = useState();
  const [isNewCourseFormShow, setIsNewCourseFormShow] = useState(false);
  const [courseType, setCourseType] = useState("class");
  const { classes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [cropStatus, setCropStatus] = useState({
    open: false,
    img: ""
  })
  // const history = new useHistory();

  function handleImageUpload(img) {
    setImage(img)
    setCropStatus({
      open: true,
      img,
    });
  }

  function handleCropClose(img) {
    setCropStatus({
      open: false,
      img,
    });
  }

  const handleUpload = async (e) => {
    if (isLoading) return;
    setIsLoading(true);
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    formData.append("course_level", String(courseLevel));
    // formData.append("level", level);
    formData.append("parent_id", String(parentId));
    keys.forEach((e, i) => {
      formData.append(`keywords[${i}]`, e);
    });

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_new_course`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: formData,
    })
      .then((response) => {
        let res = response.data.data;
        setIsNewCourseFormShow(false);
        swal("Success", "Course added successfully", "success").then((ok) => {
          if (ok) {
            return (window.location.href = "/dashboard/browse?level=" + res.level + "&parent=" + res.parent_id) + "&type=classes";
          }
        });
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
    setIsLoading(false);
  };

  return localStorage.getItem("role_id") === "2" ? (
    <>
      <Modal
        open={isNewCourseFormShow}
        onClose={() => setIsNewCourseFormShow(false)}
        BackdropProps={{
          timeout: 300,
        }}
        closeAfterTransition
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        BackdropComponent={Backdrop}
        className="new-course-modal"
      >
        <div className="new-course-form-container">
          <div className="new-course-header">
            <div>Create a</div>
            <img src={XIcon} alt="" onClick={() => setIsNewCourseFormShow(false)} />
          </div>
          <div className="new-course-content">
            <div className="new-course-form">
              <form className="new-course-from-row" onSubmit={(e) => handleUpload(e)}>
                <div>
                  <FormControl component="fieldset" style={{ display: "block" }}>
                    {/* <FormLabel component="legend">Gender</FormLabel> */}
                    <RadioGroup
                      // aria-label="gender"
                      name="courseType"
                      value={courseType}
                      onChange={(e) => {
                        setCourseType(e.target.value);
                        setType(e.target.value === "topic" ? 0 : 1);
                      }}
                      className="new-course-radio-group"
                    >
                      <FormControlLabel
                        value="topic"
                        control={<PrimaryRadio size="small" />}
                        label="Topic based course"
                        className="new-course-radio-label"
                        disabled
                      />
                      <FormControlLabel
                        value="class"
                        control={<PrimaryRadio size="small" />}
                        label="Class based course"
                        className="new-course-radio-label"
                      />
                    </RadioGroup>
                  </FormControl>
                  <AdvancedSelectInput
                    label="Select a category for your course"
                    onValue={(level, parent) => {
                      // setCourseLevel(level);
                      setParentId(parent);
                    }}
                  />
                  <div className="spacing-1"></div>
                  <InputField onValue={(value) => setTitle(value)} />
                  <div className="spacing-1"></div>
                  <TextArea onValue={(value) => setDescription(value)} />
                  <div className="spacing-1"></div>
                  <SelectDrop onValue={(value) => setCourseLevel(value)} label="Level" value="" />
                  <div className="spacing-1"></div>
                  <InputKeywords onValue={(value) => setKeys(value)} />
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ marginLeft: "auto" }}>
                    <label className="input-label" id="course">
                      Upload a thumbnail
                      <Tooltip title="Relevant images lead to more students enrolling." arrow enterTouchDelay={1}>
                        <img src={InfoIcon} alt="" />
                      </Tooltip>
                    </label>
                    <div className="certi-upload second-upload flex-column flex-center relative">
                      <CropImage img={image} open={cropStatus.open} handleCropNvm={() => setCropStatus({ open: false, img: "" })} handleCropClose={handleCropClose} />
                      {image ? (
                        <>
                          <div className="certi_image_edit">
                            <IconButton onClick={(event) => setImage(null)}>
                              <CloseIcon className={classes.closeIconTwo} />
                            </IconButton>
                          </div>
                          <img src={URL.createObjectURL(image)} alt="" />
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
                              startIcon={<img src={ProfileUpload} alt="" />}
                            >
                              Upload
                            </Button>
                          </label>
                          {/* <p className="upload-text">
                          upload a jpeg, png of your certificate
                        </p> */}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="spacing-1"></div>
                  <div className="spacing-1"></div>
                  <div className="spacing-1"></div>
                  <div className="submit-container">
                    {isLoading && <CircularProgress size={20} color="#ffffff" style={{ marginRight: 5 }} />}
                    <input className="course-submit-button" type="submit" value="Create"></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="new-form-footer">
            <img src={InfoIcon} alt="" />
            <div>Learn how to create meaningful courses</div>
          </div>
        </div>
      </Modal>

      <div
        className="new-course-button"
        onClick={() => {
          props.onValue();
          setIsNewCourseFormShow(true);
        }}
      >
        <img src={AddPurple} alt="" />
        <div>
          Create a new
          <br />
          course
        </div>
      </div>
      {/* <div
        className="self-course"
        onClick={() => {
          props.onViewToggle();
          history.push(`/dashboard/browse?level=1&parent=0`);
          // if (props.isCourseByMe)
          //   history.push(
          //     `/dashboard/browse?level=${props.level}&parent=${props.parent}`
          //   );
          // else
          // history.push(`/dashboard/browse?level=${props.level}&parent=0`);
        }}
      >
        {!props.isCourseByMe ? "Created by me" : "Explore All Courses"}
      </div> */}
    </>
  ) : null;
};

export function CropImage({ open, img, handleCropClose, handleCropNvm }) {
  const classes2 = useStyles2();
  const [croppedImg, setCroppedImg] = React.useState("");
  const cropperRef = React.useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    console.log("cropper img", cropper.getCroppedCanvas().toDataURL("image/jpeg"))
    var imgData = cropper.getCroppedCanvas().toDataURL("image/jpeg").split(';base64,')[1];
    // var item_image = imgData.replace(/^data:image\/(png|jpg);base64,/, "")
    const blob = b64toBlob(imgData, "image/jpeg");
    const blobUrl = URL.createObjectURL(blob);
    setCroppedImg(blob);
  };

  function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    console.log("b64data", b64Data)
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
            style={{ width: "100%" }}
            // Cropper.js options
            initialAspectRatio={16 / 9}
            guides={false}
            cropend={onCrop}
            onReady={onCrop}
            ref={cropperRef}
          />

          <div className="classes2.root">
            <Button variant="contained" color="primary" size="large" disabled={croppedImg === "" || !croppedImg} onClick={() => handleCropClose(croppedImg)}>
              Done
            </Button>
            <Button color="primary" size="large" onClick={handleCropNvm}>
              Cancel
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default withStyles(useStyles)(NewCourse);
