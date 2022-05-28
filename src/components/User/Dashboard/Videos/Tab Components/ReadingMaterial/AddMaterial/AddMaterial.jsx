import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Popper from "@material-ui/core/Popper";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import React from "react";
import swal from "sweetalert";
import baseDomain from "../../../../../../common/baseDomain";
import { getLocal } from "../../../../../../common/localStorageAccess";
import styles from "./AddMaterial.module.css";

import { READING_MATERIAL_ADDITION_KEYS } from "../../../../Course/globalData";
import { notify } from "../../../../../Navbar/notify";
import { NotificationPermission } from "../../../../../../common/common";
import NotificationAlert from "../../../../NotificationAlert/NotificationAlert";

const AddMaterial = (props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [isUploadLink, setIsUploadLink] = React.useState(false);
  const [isUploadFile, setIsUploadFile] = React.useState(false);
  const [uploadData, setUploadData] = React.useState({
    title: "",
    upPercent: 0,
  });
  const [link, setLink] = React.useState("");

  const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);

  const handleFileUpload = async (e) => {
    setOpen(false);
    let file = e.target.files[0];
    // const newFile = URL.createObjectURL(file);
    // console.log(newFile);
    // const myFile = new File([newFile], file.name);
    // console.log(file);
    setUploadData({
      title: file.name,
      upPercent: 0,
    });
    setIsUploadFile(true);

    let formData = new FormData();
    formData.append("video_url", props.video_url);
    formData.append("title", file.name);
    formData.append("pdf_file", file);
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/upload_video_material`,
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
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        swal("Success", "File successfully added", "success");
        props.getMaterial();
        notify(`🔑 You got ${READING_MATERIAL_ADDITION_KEYS} bonus keys for adding reading material!`);

        setTimeout(() => {
          setIsNotificationModalOpen(true);
        }, 2500);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      })
      .finally(() => {
        setIsUploadFile(false);
      });
  };

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const uploadLink = async () => {
    if (link === "") return;
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/upload_video_material`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        video_url: props.video_url,
        external_link: link,
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        setIsUploadLink(false);
        setLink("");
        swal("Success", "Link successfully added", "success");
        props.getMaterial();
        notify(`🔑 You got ${READING_MATERIAL_ADDITION_KEYS} bonus keys for adding reading material!`);

        setTimeout(() => {
          setIsNotificationModalOpen(true);
        }, 2500);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const handleNotify = () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    if (localStorage.getItem("access_token") && course_slug) {
      NotificationPermission(course_slug);
    }
    setIsNotificationModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <NotificationAlert
        isOpen={isNotificationModalOpen}
        setIsOpen={setIsNotificationModalOpen}
        handleNotify={handleNotify}
      />

      {/* ------------------------UPLOAD LINK--------------------- */}
      {isUploadLink && (
        <div className={styles.linkContainer}>
          <input
            type="text"
            placeholder="Add reading material link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button onClick={uploadLink} disabled={!link}>
            upload
          </button>
          <CancelIcon
            className={styles.closeButton}
            onClick={() => {
              setIsUploadLink(false);
              setLink("");
            }}
          />
        </div>
      )}
      {/* ------------------------UPLOAD FILE--------------------- */}
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

      {/* -----------------------KEY-INFO--------------------------- */}
      <div className="key-info">
        <p style={{ textAlign: "center" }}>Earn {READING_MATERIAL_ADDITION_KEYS} bonus keys.</p>
      </div>

      {/* -----------------------BUTTON--------------------------- */}
      <div className={styles.button} onClick={handleToggle} ref={anchorRef}>
        <AddCircleOutlineOutlinedIcon className={styles.addIcon} />
        <div>Reading Material</div>
      </div>

      {/* -------------------------DROPDOWN----------------------- */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom"
        style={{ marginTop: 10, zIndex: 1 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <div className="drop-list">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem className={styles.selectFile}>
                    <AddCircleOutlineOutlinedIcon className="menuIcon" /> Browse file from
                    <br />
                    your device
                    <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e)} />
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      setIsUploadLink(true);
                      handleClose(e);
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon className="menuIcon" /> Add external link
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default AddMaterial;
