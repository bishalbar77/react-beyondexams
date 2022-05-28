import React from "react";

// accordion
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// checkbox
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

function SimFilter() {
  const [expanded, setExpanded] = React.useState("panel1");

  const classes = useStyles();
  const [subject, setSubject] = React.useState({
    Physics: false,
    Chemistry: false,
    Biology: false,
    Earth_Science: false,
    Maths: false,
  });
  const [grade, setGrade] = React.useState({
    elementry: false,
    middle: false,
    high: false,
    university: false,
  });

  const handleChangeSubject = (event) => {
    setSubject({ ...subject, [event.target.name]: event.target.checked });
  };

  const handleChangeGrade = (event) => {
    setGrade({ ...grade, [event.target.name]: event.target.checked });
  };

  const { Physics, Chemistry, Biology, Maths, Earth_Science } = subject;
  const { elementry, middle, high, university } = grade;

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Subjects</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Physics}
                    onChange={handleChangeSubject}
                    name="Physics"
                  />
                }
                label="Physics"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Chemistry}
                    onChange={handleChangeSubject}
                    name="Chemistry"
                  />
                }
                label="Chemistry"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Biology}
                    onChange={handleChangeSubject}
                    name="Biology"
                  />
                }
                label="Biology"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Maths}
                    onChange={handleChangeSubject}
                    name="Maths"
                  />
                }
                label="Maths"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Earth_Science}
                    onChange={handleChangeSubject}
                    name="Earth_Science"
                  />
                }
                label="Earth Science"
              />
            </FormGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Grade</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={elementry}
                    onChange={handleChangeGrade}
                    name="elementry"
                  />
                }
                label="Elementry"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={middle}
                    onChange={handleChangeGrade}
                    name="middle"
                  />
                }
                label="Middle School"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={high}
                    onChange={handleChangeGrade}
                    name="high"
                  />
                }
                label="High School"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={university}
                    onChange={handleChangeGrade}
                    name="university"
                  />
                }
                label="University"
              />
            </FormGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default SimFilter;
