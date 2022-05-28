import React from 'react';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
    },
    accordian: {
        marginTop: "1rem",
        backgroundColor: "#c0c0c014",
    },
    heading: {
        color: "#000",
        fontWeight: "bold",
    },
    browseLink: {
        display: "inline-block",
        padding: "0.1rem 0.8rem",
        color: "#17323f",
        borderRight: "2px solid #6646e7",
        marginTop: "0.5rem",
        "&:hover": {
            textDecoration: "underline"
        }
    },
    ["@media only screen and (max-width: 900px)"]: {
        browseLink: {
            fontSize: "1rem"
        }
    }
}));


function LinksAccordian({ heading, links })
{
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState("panel1");

    const handleChange = (panel) => (event, newExpanded) =>
    {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <Accordion
            className={classes.accordian}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p className={classes.heading}>{heading}</p>
            </AccordionSummary>

            <AccordionDetails>

                <div>
                    {links.map(link => (
                        <a className={classes.browseLink} href={link.link}>{link.text}</a>
                    ))}
                </div>
            </AccordionDetails>

        </Accordion>
    )
}

export default LinksAccordian;

