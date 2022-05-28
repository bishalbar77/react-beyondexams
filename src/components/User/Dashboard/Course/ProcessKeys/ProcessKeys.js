import React, { useState, useEffect } from "react";
import styles from "./ProcessKeys.module.css";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import bgImg from "../../../../../assets/images/images/keysBg.svg";
import keyImg from "../../../../../assets/images/icons/key-2.svg";

import { notify } from "../../../Navbar/notify";
import baseDomain from "../../../../common/baseDomain";
import axios from "axios";

import { COURSE_ENROLL_KEYS } from "../globalData";

const useStyles = makeStyles(() => ({
    paper: {
        borderRadius: 20,
        height: "600px",
        width: "485px",
        position: "relative",
        transition: "all 0.2s ease"
    },
}));

function ProcessKeys({ isOpen, setIsOpen, handleEnroll, course, activeStep, setActiveStep })
{
    const classes = useStyles();
    const [userKeys, setUserKeys] = useState("");

    const handleCancel = () =>
    {
        setIsOpen(false);
    }

    const handleNext = () =>
    {
        setActiveStep(activeStep + 1);

        const isEnrolled = handleEnroll();
        console.log("this", isEnrolled)

        setActiveStep(activeStep + 1);
    }

    useEffect(() =>
    {
        if (localStorage.getItem("access_token") && localStorage.getItem("slug"))
        {
            axios
                .get(`${ baseDomain.route }${ baseDomain.subRoute }/get_user_key_transactions`, {
                    params: {
                        slug: localStorage.getItem("slug"),
                    },
                })
                .then((response) =>
                {
                    const data = response.data.data;
                    setUserKeys(data.user_key.keys_available);
                })
                .catch((err) =>
                {
                    console.log(err);
                });
        }
    }, []);

    return (
        <div className="keys_wrapper">
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={styles.setTargetDialog}
                classes={{ paper: classes.paper }}
                scroll="body"
            >
                <div className={styles.contentWrapper}>
                    {activeStep === 0 && (
                        <div className={styles.dialogStep0}>
                            <img src={bgImg} className={styles.bgImg} alt="bg" />

                            <div className={styles.keyBox_outer}>
                                <div className={styles.keyBox_mid}>
                                    <div className={styles.keyBox_inner}>
                                        <img src={keyImg} className={styles.keyImg} alt="key" />
                                    </div>
                                </div>
                            </div>

                            <h2 className={styles.toPay}>
                                Spend <strong> {COURSE_ENROLL_KEYS} keys</strong> to get enrolled in the course.
                            </h2>

                            <p className={styles.moreInfo}>
                                The course “{course}” will cost you {COURSE_ENROLL_KEYS} keys.
                            </p>

                            <div className={styles.buttonsRow}>
                                <button
                                    className={`enrollBtn ${ styles.mt1 }`}
                                    onClick={handleNext}
                                >
                                    Continue to Enroll
                                </button>
                                <button className={`watchBtn ${ styles.mt1 }`} onClick={handleCancel}>Cancel</button>
                            </div>

                            <p className={styles.keySystem}>
                                You currently have {userKeys} keys
                                <br />
                                Understand our{" "}
                                <span className={styles.highlight}> Keys System.</span>
                            </p>
                        </div>
                    )}

                    {activeStep === 1 && (
                        <div className={styles.dialogStep1}>
                            <div className={styles.topHeading}>
                                {localStorage.getItem("name")}, we appreciate your decision. 🤗
                            </div>

                            <div className={styles.keyCenter}>
                                <div className={`${ styles.keyBox_outer } ${ styles.keyBox_outer_larger }`}>
                                    <div className={`${ styles.keyBox_mid } ${ styles.keyBox_mid_larger }`}>
                                        <div className={`${ styles.keyBox_inner } ${ styles.keyBox_inner_larger }`}>
                                            <img src={keyImg} className={`${ styles.keyImg } ${ styles.keyImg_larger } `} alt="key" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className={styles.status}>{activeStep === 1 ? "Processing keys..." : activeStep === 2 && "Done!"}</p>

                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default ProcessKeys;
