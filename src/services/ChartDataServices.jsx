import { useState,useEffect} from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import useDashboardReceivingService from '../services/DashboardService'

const useChartData = ({currentItemDashboard}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
 

    const setChartData  = () => {
        const labelsVendor = currentItemDashboard?.map((data) => data.supplierName);
        console.log("Current Items Data:", currentItemDashboard); // Debugging awal

        const data = {
            labels: labelsVendor,
            datasets: [
                {
                    xAxisId: "x-arrival",
                    label: "Arrival On Schedule",
                    data: currentItemDashboard.map((data) => {
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
                    backgroundColor: currentItemDashboard.map((data) =>
                        data.status === "delayed" ? "#F64242" : "#35A535"
                    ),
                    borderColor: currentItemDashboard.map((data) =>
                        data.status === "delayed" ? "rgb(240, 15, 15)" : "rgb(36, 173, 47)"
                    ),
                    borderWidth: 1,
                },
                {
                    xAxisId: "x-plan",
                    label: "Arrival Plan",
                    data: currentItemDashboard.map((data) => {
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
                        font: { size: 10 },
                        color: "black",
                    },
                    grid: { color: "#D9EAFD" },
                },
            },
            elements: {
                bar: { borderWidth: 3 },
            },
            responsive: true,
            plugins: {
                tooltip: {
                    backgroundColor: "rgba(84, 70, 70, 0.7)",
                    callbacks: {
                        label: (context) => {
                            const dataIndex = context.dataIndex;
                            const schedule = currentItemDashboard[dataIndex];

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
                    setSelectedVendor(label);
                    setIsModalOpen(true);
                }
            },
        };

        return config;
    };
const ModalComponent = () => (
        <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <CModalHeader closeButton>Vendor Selected</CModalHeader>
            <CModalBody>
                <p>Vendor: {selectedVendor}</p>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setIsModalOpen(false)}>Close</CButton>
            </CModalFooter>
        </CModal>
    );
    return {
        setChartData,
        getChartOption,
        ModalComponent,
        selectedVendor
    }
}
export default useChartData
