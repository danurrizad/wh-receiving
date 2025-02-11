import { useState,useEffect} from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import useDashboardReceivingService from '../services/DashboardService'

const useChartData = ({dataSchedules, handleClickOpenMaterials}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const setChartData  = () => {
        // console.log("Current Items Data:", dataSchedules); // Debugging awal
        const labelsVendor = dataSchedules?.map((data) => data.supplierName);
        // console.log("dataSchedules :", dataSchedules)

        const data = {
            labels: labelsVendor,
            datasets: [
                {
                    xAxisId: "x-arrival",
                    label: "Arrival On Schedule",
                    data: dataSchedules.map((data) => {
                        const arrivalHour = data.arrivalActualTime
                            ? parseInt(data.arrivalActualTime.split(":")[0], 10)
                            : 0;
                        const arrivalMinute = data.arrivalActualTime
                            ? parseInt(data.arrivalActualTime.split(":")[1], 10) / 60
                            : 0;
                        const departureHour = data.departureActualTime
                            ? parseInt(data.departureActualTime.split(":")[0], 10)
                            : 0;
                        const departureMinute = data.departureActualTime
                            ? parseInt(data.departureActualTime.split(":")[1], 10) / 60
                            : 0;

                        return {
                            x: [arrivalHour + arrivalMinute, departureHour + departureMinute + 0.5],
                            y: data.supplierName,
                        };
                    }),
                    backgroundColor: dataSchedules.map((data) =>
                        data.status === "delayed" ? "#F64242" : "#35A535"
                    ),
                    borderColor: dataSchedules.map((data) =>
                        data.status === "delayed" ? "rgb(240, 15, 15)" : "rgb(36, 173, 47)"
                    ),
                    borderWidth: 1,
                    categoryPercentage: 0.8, // Reduce spacing between bars (default is 0.8)

                    // barThickness: 20,
                    // maxBarThickness: 20,
                },
                {
                    xAxisId: "x-plan",
                    label: "Arrival Plan",
                    data: dataSchedules.map((data) => {
                        const planHour = data.arrivalPlanTime
                            ? parseInt(data.arrivalPlanTime.split(":")[0], 10)
                            : 0;
                        const planMinute = data.arrivalPlanTime
                            ? parseInt(data.arrivalPlanTime.split(":")[1], 10) / 60
                            : 0;
                        const departHour = data.departurePlanTime
                            ? parseInt(data.departurePlanTime.split(":")[0], 10)
                            : 0;
                        const departMinute = data.departurePlanTime
                            ? parseInt(data.departurePlanTime.split(":")[1], 10) / 60
                            : 0;

                        return {
                            x: [planHour + planMinute, departHour + departMinute],
                            y: data.supplierName,
                        };
                    }),
                    backgroundColor: ["rgba(255, 213, 0, 0.56)"],
                    borderColor: ["rgb(255, 205, 86)"],
                    borderWidth: 1,
                    categoryPercentage: 0.8, 
                    // barThickness: 20,
                    // maxBarThickness: 20,
                },
            ],
        };

        return data;
    };

    const getChartOption = () => {
        const data = setChartData();

        const config = {
            indexAxis: "y",
            maintainAspectRatio: false,
            scales: {
                x: {
                    position: "top",
                    min: 7,
                    max: 18,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11 },
                        color: "black",
                        callback: (value) => `${value}:00`,
                    },
                    grid: { color: "#F8FAFC" },
                },
                y: {
                    stacked: true,
                    beginAtZero: false,
                    ticks: {
                        font: { size: 12 },
                        color: "black",
                        
                        
                    },
                    padding: 0,
                    barPercetage: 0.2,
                    grid: { color: "#D9EAFD" },
                },
            },
            elements: {
                bar: { 
                    borderWidth: 3,
                    // barPercentage: 1, // Adjust the actual bar width inside each category
                },
            },
            responsive: true,
            plugins: {
                tooltip: {
                    backgroundColor: "rgba(84, 70, 70, 0.7)",
                    callbacks: {
                        label: (context) => {
                            const dataIndex = context.dataIndex;
                            const schedule = dataSchedules[dataIndex];

                            if (context.dataset.label === "Arrival On Schedule") {
                                return `Arrival Date: ${schedule.arrivalActualDate} 
                                        Arrival Time: ${schedule.arrivalActualTime}`;
                            } else {
                                return `Plan Date: ${schedule.arrivalPlanDate} 
                                        Schedule Time: ${schedule.arrivalPlanTime} - ${schedule.departurePlanTime}`;
                            }
                        },
                    },
                },
                legend: {
                    position: "top",
                    display: false,
                },
                title: {
                    display: true,
                    text: "SCHEDULE VENDOR WAREHOUSE",
                    color: "black",
                },
            },
            onClick: (event, chartElements, chart) => {
                const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = chart.data.labels[firstPoint.index]; // Y-axis label
                    console.log(`Clicked on Y-axis label: ${label}`);
                    console.log(`Clicked on Data: ${firstPoint.index}`);

                    handleClickOpenMaterials(dataSchedules[firstPoint.index])
                    // setSelectedVendor(firstPoint.index);
                    // setIsModalOpen(true);
                }
            },
        };

        return config;
    };

    return {
        setChartData,
        getChartOption,
        // selectedVendor,
        // isModalOpen,
        // setIsModalOpen
    }
}
export default useChartData
