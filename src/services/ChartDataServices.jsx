import { useState,useEffect} from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import useDashboardReceivingService from '../services/DashboardService'

const useChartData = ({dataChartSchedules, handleClickOpenMaterials}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const setChartData  = () => {
        // console.log("Current Items Data:", dataChartSchedules); // Debugging awal
        const labelsVendor = dataChartSchedules?.map((data) => data.vendorName);
        // console.log("dataChartSchedules :", dataChartSchedules)

        const data = {
            labels: labelsVendor,
            datasets: [
                {
                    xAxisId: "x-arrival",
                    borderSkipped: false,
                    label: "Arrival On Schedule",
                    data: dataChartSchedules.map((data) => {
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
                            x: [arrivalHour + arrivalMinute, departureHour + departureMinute + 0.25],
                            y: data.vendorName,
                        };
                    }),
                    backgroundColor: dataChartSchedules.map((data) =>
                        data.status === "overdue" ? "rgba(251, 197, 80, 1)" : data.status === "on schedule" ? "rgba(53, 165, 53, 1)" : ""
                    ),
                    borderColor: dataChartSchedules.map((data) =>
                        data.status === "overdue" ? "rgba(251, 197, 80, 1)" : data.status === "on schedule" ? "rgba(53, 165, 53, 1)" : ""
                    ),
                    borderWidth: 1,
                    categoryPercentage: 0.5, // Reduce spacing between bars (default is 0.8)

                    // barThickness: 20,
                    // maxBarThickness: 20,
                },
                {
                    xAxisId: "x-plan",
                    borderSkipped: false,
                    label: "Arrival Plan",
                    data: dataChartSchedules.map((data) => {
                        const planHour = data.arrivalPlanTime
                            ? parseInt(data.arrivalPlanTime.split(":")[0], 10)
                            // : !data.arrivalPlanTime ? parseInt(data.arrivalPlanTime.split(":")[0], 10)
                            : 0;
                        const planMinute = data.arrivalPlanTime
                            ? parseInt(data.arrivalPlanTime.split(":")[1], 10) / 60
                            // : !data.arrivalPlanTime ? parseInt(data.arrivalPlanTime.split(":")[1], 10) / 60
                            : 0;
                        const departHour = data.departurePlanTime
                            ? parseInt(data.departurePlanTime.split(":")[0], 10)
                            // : !data.departurePlanTime ? parseInt(data.departurePlanTime.split(":")[0], 10)
                            : 0;
                        const departMinute = data.departurePlanTime
                            ? parseInt(data.departurePlanTime.split(":")[1], 10) / 60
                            // : !data.departurePlanTime ? parseInt(data.departurePlanTime.split(":")[1], 10) / 60
                            : 0;

                        return {
                            x: [planHour + planMinute, departHour + departMinute],
                            y: data.vendorName,
                        };
                    }),
                    backgroundColor: dataChartSchedules.map((data)=>
                        data.status === "on schedule" ? "rgba(110, 156, 255, 1)" : 
                        data.status === "overdue" ? "rgba(110, 156, 255, 1)" :
                        data.status === "scheduled" ? "transparent" :
                        data.status === "delayed" ? "rgba(246, 66, 66, 1)" :
                        "transparent" 
                    ), 
                    borderColor: dataChartSchedules.map((data)=>
                        data.status === "on schedule" ? "rgba(110, 156, 255, 1)" : 
                        data.status === "overdue" ? "rgba(110, 156, 255, 1)" :
                        data.status === "scheduled" ? "rgba(110, 156, 255, 1)" :
                        data.status === "delayed" ? "rgba(246, 66, 66, 1)" :
                        "transparent" 
                    ),
                    borderWidth: 3,
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
                        gap: 0
                        
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
                            const schedule = dataChartSchedules[dataIndex];

                            if (context.dataset.label === "Arrival On Schedule") {
                                return `Arrival Date: ${schedule.arrivalActualDate} 
                                        Arrival Time: ${schedule.arrivalActualTime}`
                                        // Departure Time: ${schedule.departureActualTime}
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

                    handleClickOpenMaterials(dataChartSchedules[firstPoint.index])
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
