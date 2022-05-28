import React from 'react';
import styles from "./NewUser.module.css";
import LoginScreenIcon from "../asset/loginScreenIcon.svg";

function NewUser() {
  return (
    <div className={styles.newUser}>
        <h2>Join BE Community</h2>
        <p>You are just one step away !</p>
        <img src={LoginScreenIcon} alt="image" />
        <div className={styles.newUserBtns}>
            <button>Login</button>
            <p>or</p>
            <button>Sign Up</button>
        </div>
    </div>
  )
}

export default NewUser;