import React, { use } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Chart = (props: any) => {
  //  let freq= props.freq;
  //   const [chartData, setChartData] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  //     const getChartData = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get("/scrapping/chart/" + freq);
  //         console.log("response: ", response.data);
  //         setChartData(response.data);
  //       } catch (error) {
  //         console.error("Error: ", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     getChartData();
  //   }, [freq]);
  //   if (!chartData) {
  //     return <div>Loading...</div>;
  //   }
  //   const labels = chartData.map((item) => item._id);
  //   const data = chartData.map((item) => item.count);
  //   const color = "black";
  //   const myChart = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: "$",
  //         data: data,
  //         backgroundColor: ["rgba(0,0,0, 1)"],
  //         borderWidth: 2,
  //         borderColor: "black",
  //         borderDash: [],
  //         borderShadow: 10,
  //         tension: 0.1,
  //         pointBackgroundColor: "white",
  //         pointBorderColor: "black",
  //       },
  //     ],
  //   };
  //   const options = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         color: color,
  //       },
  //     },
  //     x: {
  //       beginAtZero: true,

  //       ticks: {
  //         color: color,
  //       },
  //     },
  //   },

  //   plugins: {
  //     legend: {
  //         display: false,
  //     },

  //   },
  // };

  return (
    <div className="w-full ">
      {/* <Line data={myChart} options={options}/> */}
      chart
    </div>
  );
};

export default Chart;
