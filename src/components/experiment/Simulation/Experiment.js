import React from 'react'
import SimShow from './SimShow';
import SimFilter from './SimFilter';
import "./experiment.css"

function Experiment() {
    return (
        <section className="experiment">
            <SimShow />
            <SimFilter />
        </section>
    )
}

export default Experiment
