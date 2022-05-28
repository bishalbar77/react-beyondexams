import React from "react";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { getLocal } from "../../../../../common/localStorageAccess";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Editor } from "@tinymce/tinymce-react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #C4C4C4",
    minHeight: "42px",
    background: "#FAFAFA",
    flex: 1,
    overflow: "hidden",
  },

  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
    padding: "6px 0 4px",
    fontSize: "14px",
  },

  iconButtonDiv: {
    marginLeft: "38px",
    height: "36px",
    width: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2px",
    borderRadius: "50%",
    background: "#DDD4FE",
    "&:hover": {
      background: "var(--color1)",
      color: "white",
    },
    "&:hover svg": {
      background: "var(--color1)",
      color: "white",
    },
  },
  BgActive: {
    background: "var(--color1)",
  },
  IconButton: {
    padding: "6px 4px 6px 9px",
    "&:hover": {
      color: "white",
    },
  },
  IconButtonActive: {
    padding: "6px 4px 6px 9px",
    color: "white",
  },
  privacyIcon: {
    fontSize: "12px",
    width: "16px",
    height: "16px",
    marginRight: "5px",
    alignSelf: "baseline",
    marginTop: "1px",
    color: "var(--color1)",
  },
  privacyIcon2: {
    fontSize: "12px",
    marginRight: "8px",
    marginBottom: "2px",
    color: "var(--color1)",
    width: "16px",
    height: "16px",
  },
  // menu: {
  //   "&:hover svg": {
  //     color: "var(--color1)",
  //   },
  // },
  icon2: {
    fontSize: "12px",
    marginRight: "8px",
    marginBottom: "2px",
    width: "16px",
    height: "16px",
  },
}));

function InputBox(props)
{
  // const [input, setInput] = useState("");
  const classes = useStyles();

  return (
    <>
      {/* <p className="myName">{localStorage.getItem("name")}</p> */}

      <div className="note-input">
        <div className="note-profile-image">
          <img alt="" src={getLocal("avatar")} />
        </div>

        <Paper elevation={0} component="form" onSubmit={(e) => e.preventDefault()} className={`${ classes.root } ${ props.input ? classes.rootBgActive : classes.rootBg } `}>
          {/* <InputBase type="text" value={props.input} onChange={(e) => props.setInput(e.target.value)} required multiline className={classes.input} placeholder={props.placeholder} /> */}
          <CKEditor
          editor={ ClassicEditor }
          data="<p>Enter your question</p>"
          onReady={ editor => {
              // You can store the "editor" and use when it is needed.
              console.log( 'Editor is ready to use!', editor );
          } }
          onChange={ ( event, editor ) => {
              const data = props.setInput(editor.getData());
              console.log( { event, editor, data } );
          } }
          onBlur={ ( event, editor ) => {
              console.log( 'Blur.', editor );
          } }
          onFocus={ ( event, editor ) => {
              console.log( 'Focus.', editor );
          } }
      />
          {/* <Editor
            onInit={(evt, editor) => props.editorRef.current = editor}
            initialValue={`<p>${ props.placeholder }</p>`}
            init={{
              width: "65vw",
              height: 200,
              menubar: false,
              toolbar: 'undo redo | formatselect | ' +
                'bold italic | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          /> */}
          <div className={`${ classes.iconButtonDiv } ${ props.input ? classes.BgActive : "" }`}>
            <IconButton type="submit" onClick={props.onSubmit} className={props.input ? classes.IconButtonActive : classes.IconButton}>
              <SendRoundedIcon fontSize="small" style={{ fontSize: "18px" }} />
            </IconButton>
          </div>
        </Paper>
      </div>
    </>
  );
}

export default InputBox;
