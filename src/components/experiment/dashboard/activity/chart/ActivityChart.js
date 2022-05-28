import React from 'react';
import './ActivityChart.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function ActivityChart() {

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
    };

    const labels = ['Nov', 'Dec', 'Jan', 'Feb'];

    const data = {
        labels,
        datasets: [
          {
            label: 'Courses',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
            backgroundColor: "#77AF44",
          },
          {
            label: 'Projects',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
            backgroundColor: "#FECA42",
          },
        ],
    };

    return (
        <div className="activityChart">
            <Bar options={options} data={data} />    
        </div>
    )
}

export default ActivityChart;
