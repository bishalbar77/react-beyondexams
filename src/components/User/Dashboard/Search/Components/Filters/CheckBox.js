import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';

export default class CheckBox extends Component {
    render() {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        // checked={state.checkedB}
                        checked={this.props.selected}
                        onChange={(e) => { this.props.handleChange(e, this.props.type, this.props.id) }}
                        // name="checkedB"
                        name={this.props.title}
                        color="primary"
                        icon={<CircleUnchecked className="filter_icon" />}
                        checkedIcon={<CircleChecked className="filter_icon" />}
                    />
                }
                label={<div className={"filter_name " + (this.props.selected ? "color-blue" : "")}>{this.props.title} {this.props.num > 0 && <span>({this.props.num})</span>}</div>}
            />
        )
    }
}
