import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import Info from "../../../assets/images/icons/profile-info.jpg";
// import Save from "../../../assets/images/icons/profile-save.png";
// import Add from "../../../assets/images/icons/profile-plus-circle.jpg";
// import ProfileCertificates from "../../../assets/images/icons/profile-certificates.jpg";
// import CertificateIcon from "../../../assets/images/icons/profile-certificates-one.jpg";
// import ProfileUpload from "../../../assets/images/icons/profile-upload.png";
// import Group from "../../../assets/images/icons/Group_298.png";
import Button from "@material-ui/core/Button";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import { getLocal } from "../../common/localStorageAccess";
import CircularProgress from "@material-ui/core/CircularProgress";

// modal for certi-image
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

// Cropper
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
// import imageToBlob from "image-to-blob";
var data = require("./profile.json");

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
    textTransform: "capitalize",
  },
  closeIcon: { color: "white" },
  closeIconTwo: { color: "black" },
  input: {
    display: "none",
  },
});

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
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

class CertiDialog extends Component {
  state = {
    certificates: JSON.parse(JSON.stringify(this.props.profile.certificates)),
    initial_length: JSON.parse(JSON.stringify(this.props.profile.certificates.length)),
    imageFiles: [],
    cropStatus: {
      open: false,
      img: "",
    },
    loading: false,
  };

  handleUploadChange = (event, index, id) => {
    console.log("handleUploadChange id", id);
    const values = [...this.state.certificates];
    if (id) {
      values[index].update = 1;
      values[index].image_update = 1;
    }
    console.log("image file in upload", event.target.files[0]);
    values[index].image = URL.createObjectURL(event.target.files[0]);
    let image_file_arr = this.state.imageFiles;
    image_file_arr[index] = event.target.files[0];
    // this.handleCropOpen(values, image_file_arr)
    this.setState({ certificates: values, imageFiles: image_file_arr });
    this.setState({ cropStatus: { open: true, img: URL.createObjectURL(event.target.files[0]) } });
  };

  handleCropClose = (image, index, id) => {
    console.log("handleCropClose id", id);
    const values = [...this.state.certificates];
    if (id) {
      values[index].update = 1;
      values[index].image_update = 1;
    }
    // const img= URL.createObjectURL(image);
    values[index].image = URL.createObjectURL(image);
    let image_file_arr = this.state.imageFiles;
    image_file_arr[index] = image;
    this.setState({ certificates: values, imageFiles: image_file_arr });
    this.setState({ cropStatus: { open: false, img: "" } });
  };

  handleCropRe = (index, id) => {
    const values = [...this.state.certificates];
    const image = values[index].image;
    // if(id){
    //   imageToBlob( image, (err, data)=>{
    //     console.log("image to blob data",data)
    //     this.setState({cropStatus:{open:true, img:data}});
    //   } )

    // }else{

    // const blob = new Blob([image], {type: "image/jpeg"})
    console.log("handle crop re image", image);
    // fetch(image).then(res=> res.blob()).then(data=>this.setState({cropStatus:{open:true, img:data}}))
    // convertImgToBase64URL(image, function(base64Img){
    //   this.setState({cropStatus:{open:true, img:base64Img}})
    // });
    this.setState({ cropStatus: { open: true, img: image } });
    console.log("handle crop re fired");
    // }
  };

  imageEdit = (event, index) => {
    const values = JSON.parse(JSON.stringify(this.state.certificates));
    values[index].image = "";
    this.setState({ certificates: values });
  };

  handleChange = (e, index, id) => {
    const values = JSON.parse(JSON.stringify(this.state.certificates));
    if (id) {
      values[index].update = 1;
    }
    if (e.target.name === "organization") {
      values[index].organization_update = 1;
      values[index].organization = e.target.value;
    } else if (e.target.name === "description") {
      values[index].description_update = 1;
      values[index].description = e.target.value;
    } else if (e.target.name === "certi_date") {
      values[index].certi_date = e.target.value;
    } else if (e.target.name === "certi_month") {
      values[index].certi_month = e.target.value;
    } else if (e.target.name === "certi_year") {
      values[index].certi_year = e.target.value;
    }
    this.setState({ certificates: values });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const values = JSON.parse(JSON.stringify(this.state.certificates));
    for (let i = this.state.initial_length; i < this.state.certificates.length; i++) {
      let formData = new FormData();
      formData.append("certificate_description", values[i].description);
      formData.append("certificate_image", this.state.imageFiles[i]);
      formData.append("certificate_organization", values[i].organization);

      if (values[i].certi_date.length === 1) {
        values[i].certi_date = "0" + values[i].certi_date;
      }
      let issuing_date = values[i].certi_date + "-" + values[i].certi_month + "-" + values[i].certi_year;
      formData.append("certificate_issuing_date", issuing_date);
      await axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.addCertificate}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json;charset=UTF-8",
        },
        data: formData,
      })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
          swal("Error", e.response.data.message, "error");
        });
    }

    for (let i = 0; i < this.state.initial_length; i++) {
      if (values[i].update === 1) {
        values[i].certi_date = values[i].issuing_date.slice(0, 2);
        values[i].certi_month = values[i].issuing_date.slice(3, 5);
        values[i].certi_year = values[i].issuing_date.slice(6, 10);
        let formData = new FormData();
        formData.append("certificate_id", values[i].id);
        if (values[i].description_update === 1) {
          formData.append("certificate_description", values[i].description);
        }
        if (values[i].image_update === 1) {
          formData.append("certificate_image", this.state.imageFiles[i]);
        }
        if (values[i].organization_update === 1) {
          formData.append("certificate_organization", values[i].organization);
        }
        if (values[i].certi_date.length === 1) {
          values[i].certi_date = "0" + values[i].certi_date;
        }
        let issuing_date = values[i].certi_date + "-" + values[i].certi_month + "-" + values[i].certi_year;
        formData.append("certificate_issuing_date", issuing_date);
        await axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.updateCertificate}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
          data: formData,
        })
          .then((data) => {
            console.log(data);
          })
          .catch((e) => {
            console.log(e);
            swal("Error", e.response.data.message, "error");
          });
      }
    }
    await this.props.update();
    this.setState({ loading: false });
    this.handleClose();
  };

  handleAdd = () => {
    const values = JSON.parse(JSON.stringify(this.state.certificates));
    values.push({
      idx: Math.random(),
      image: "",
      description: "",
      issuing_date: "",
      organization: "",
    });
    this.setState({ certificates: values });
  };

  handleRemove = async (e, i) => {
    swal("Delete", "Are you sure you want to delete this item ?", "warning", {
      buttons: true,
    }).then(async (ok) => {
      if (ok) {
        if (e) {
          await axios({
            url: `${baseDomain.route}${baseDomain.subRoute}/${data.api.deleteCertificate}=${e}`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${getLocal("access_token")}`,
              Accept: "application/json;charset=UTF-8",
            },
          })
            .then((data) => {
              console.log(data);
              this.props.update();
            })
            .catch((e) => {
              console.log(e);
              swal("Error", e.response.data.message, "error");
            });
        } else {
          let values = JSON.parse(JSON.stringify(this.state.certificates));
          values.splice(i, 1);
          this.setState({ certificates: values });
        }
      }
    });
  };

  componentDidMount = () => {
    if (this.props.profile.certificates.length === 0) {
      this.handleAdd();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.profile.certificates !== this.props.profile.certificates) {
      this.setState({
        certificates: this.props.profile.certificates,
        initial_length: this.props.profile.certificates.length,
      });
    }
  };

  handleClose = () => {
    if (this.props.profile.certificates.length > 0) {
      this.setState({
        certificates: this.props.profile.certificates,
        initial_length: this.props.profile.certificates.length,
      });
    }
    this.props.handleClose("certificate");
  };

  render() {
    const { classes } = this.props;
    const { open } = this.props;

    return (
      <div id="profile-about-dialog">
        <Dialog open={open} onClose={this.handleClose} classes={{ paper: classes.paper }} maxWidth="lg" scroll="body">
          <div className="flex-only p_d_div">
            <div className="p_d_content">
              <div className="flex space-between">
                <div className="flex">
                  <img
                    src={require(`../../../assets/images/icons/${data.images.profileCertificates}`)}
                    className="p_d_img"
                    alt=""
                  />
                  <h3>{data.title.certificate}</h3>
                </div>
                <IconButton onClick={this.handleClose} className="p_d_close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="p_d_content_in">
                  {this.state.certificates.map((e, index) => (
                    <div className="flex-only" key={e.id ? e.id : e.idx}>
                      <img
                        className="p_d_img certi-icon"
                        src={require(`../../../assets/images/icons/${data.images.certificateIcon}`)}
                        alt=""
                      />
                      <div>
                        <div className="certi-upload flex-column flex-center relative">
                          {/* <p onClick={()=>this.handleCropRe(index, e.id)}>Open the crop again</p> */}
                          <CropImage
                            img={this.state.cropStatus.img}
                            open={this.state.cropStatus.open}
                            handleCropNvm={() => this.setState({ cropStatus: { open: false, img: "" } })}
                            handleCropClose={this.handleCropClose}
                            index={index}
                            id={e.id}
                          />
                          {e.image ? (
                            <ImageCertificate
                              imageEdit={(event, ind) => this.imageEdit(event, ind)}
                              index={index}
                              img={e.image}
                              classes={classes}
                            />
                          ) : (
                            <div className="flex-column flex-center">
                              <input
                                accept="image/jpeg, image/png"
                                className={classes.input}
                                id="upload"
                                onChange={(event) => this.handleUploadChange(event, index, e.id)}
                                type="file"
                                required
                              />
                              <label htmlFor="upload">
                                <Button
                                  size="large"
                                  component="span"
                                  className={classes.upload}
                                  startIcon={
                                    <img
                                      src={require(`../../../assets/images/icons/${data.images.profileUpload}`)}
                                      alt=""
                                    />
                                  }
                                >
                                  {data.buttons.upload}
                                </Button>
                              </label>
                              <p className="upload-text">{data.buttons.uploadText}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="p_d_title">{data.inputLabel.certificateName}</p>
                          <input
                            defaultValue={e.description}
                            type="text"
                            className="p_d_select p_d_width_full"
                            placeholder="eg. Basics of Photoshop"
                            name="description"
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            required
                          />
                        </div>
                        <div>
                          <p className="p_d_title">{data.inputLabel.organizationName}</p>
                          <input
                            type="text"
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            name="organization"
                            defaultValue={e.organization}
                            className="p_d_select p_d_width_full"
                            placeholder="eg. Beyond exams"
                            required
                          />
                        </div>
                        <div>
                          <p className="p_d_title">{data.inputLabel.issuingDate}</p>
                          <select
                            className="p_d_select p_d_width_half"
                            name="certi_month"
                            defaultValue={e.issuing_date?.slice(3, 5)}
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            required
                          >
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>

                          <input
                            type="number"
                            className="p_d_select p_d_width_quarter"
                            min="1"
                            max="31"
                            placeholder="Date"
                            name="certi_date"
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            defaultValue={e.issuing_date?.slice(0, 2)}
                            required
                          />
                          <input
                            type="number"
                            className="p_d_select p_d_width_quarter"
                            placeholder="Year"
                            name="certi_year"
                            defaultValue={e.issuing_date?.slice(6, 10)}
                            onChange={(event) => this.handleChange(event, index, e.id)}
                            required
                          />
                          <p className="p_d_remove_cert" onClick={() => this.handleRemove(e.id, index)}>
                            {data.buttons.remove}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex p_d_info" style={{ marginBottom: "15px", marginTop: "10px" }}>
                    <img className="p_d_img" src={require(`../../../assets/images/icons/${data.images.info}`)} alt="" />
                    <p className="p_d_title">{data.title.info}</p>
                  </div>
                  <div className="flex">
                    <button className="p_d_add_btn" onClick={this.handleAdd} type="button">
                      <img
                        className="p_d_img"
                        src={require(`../../../assets/images/icons/${data.images.add}`)}
                        alt=""
                      />
                      {data.buttons.addField}
                    </button>
                    <button className="p_d_save_btn" type="submit" disabled={this.state.loading}>
                      {this.state.loading ? (
                        <CircularProgress size={20} color="white" />
                      ) : (
                        <>
                          <img
                            className="p_d_img"
                            src={require(`../../../assets/images/icons/${data.images.save}`)}
                            alt=""
                          />
                          {data.buttons.save}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="p_d_ill relative">
              <IconButton onClick={this.handleClose}>
                <CloseIcon className={classes.closeIcon} fontSize="small" />
              </IconButton>
              <img className="p_d_group" src={require(`../../../assets/images/icons/${data.images.group}`)} alt="" />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export function ImageCertificate({ imageEdit, classes, index, img }) {
  const classes2 = useStyles2();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="certi_image_edit">
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            imageEdit(event, index);
          }}
        >
          <CloseIcon className={classes.closeIconTwo} />
        </IconButton>
      </div>
      <img src={img} alt="certificate" onClick={handleOpen} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes2.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <img src={img} alt="certificate" className="certi-d-img" />
        </Fade>
      </Modal>
    </>
  );
}

export function CropImage({ open, img, handleCropClose, handleCropNvm, index, id }) {
  const classes2 = useStyles2();
  const [croppedImg, setCroppedImg] = React.useState("");
  const cropperRef = React.useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    console.log("cropper img", cropper.getCroppedCanvas().toDataURL("image/jpeg"));
    var imgData = cropper.getCroppedCanvas().toDataURL("image/jpeg").split(";base64,")[1];
    // var item_image = imgData.replace(/^data:image\/(png|jpg);base64,/, "")
    const blob = b64toBlob(imgData, "image/jpeg");
    // const blobUrl = URL.createObjectURL(blob);
    setCroppedImg(blob);
  };

  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    console.log("b64data", b64Data);
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
  console.log("img crop", img);

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
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
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
              onClick={() => handleCropClose(croppedImg, index, id)}
            >
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

export default withStyles(useStyles)(CertiDialog);
