import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import styles from "./NotificationAlert.module.css";
import { makeStyles } from "@material-ui/core";
import Lottie from 'react-lottie';
// import animationData from './lotties/bell-lottie-animation.json'
import animationData from './lotties/Notify animation.json';
import { NotificationPermission } from "../../../common/common";

const useStyles = makeStyles(() => ({
    paper: {
        borderRadius: 20,
        position: "relative",
        transition: "all 0.2s ease"
    },
}));

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

function NotificationAlert({ isOpen, setIsOpen, handleNotify }) {

    const classes = useStyles();

    const handleCancel = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: classes.paper }}
                scroll="body"
            >
                <div className={styles.contentWrapper}>
                    <Lottie 
                        options={defaultOptions}
                        height={200}
                        width={200}
                    />
                    <h2>Get notified for all updates</h2>
                    <p>Choose one to allow the notifications<br /> from Beyond Exams</p>

                    <div className={styles.notifyBtns}>
                        <h4 onClick={handleCancel}>Naah</h4>
                        <h4 onClick={handleNotify}>Yeah</h4>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default NotificationAlert;
