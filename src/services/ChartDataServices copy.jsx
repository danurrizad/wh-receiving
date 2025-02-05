import { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import useDashboardReceivingService from '../services/DashboardService'

const useChartData = ({currentItems}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getChartReceiving } = useDashboardReceivingService()
    const color = {
        yellow: "#FFBB00",
        red: "#F64242",
        green: "#35A535"
    }

    const setChartData = () => {
        const labelsVendor = currentItems.map((data)=>data.supplierName)
        // Generate time range (hourly labels)
        const timeLabels = [];
        for (let hour = 7; hour <= 18; hour++) {
            timeLabels.push(`${hour.toString().padStart(2, "0")}:00`);
        }
        const data = {
            labels: labelsVendor,
            datasets: [
                {
                    // backgroundColor: 'red',
                    xAxisId: "x-arrival",
                    label: "Arrival On Schedule",
                    data: currentItems.map((data) => ({
                        x: [
                            parseInt(data.arrivalActualDate.split(":")[0], 10) + parseInt(data.arrivalActualDate.split(":")[1], 10) / 60,
                            parseInt(data.arrivalActualDate.split(":")[0], 10) + parseInt(data.arrivalActualDate.split(":")[1], 10) / 60 + 0.5,
                        ],
                        y: data.vendor_name,
                    })),
                    backgroundColor: currentItems.map((data)=> data.status === "Delayed" ? "#F64242" : "#35A535"),
                    borderColor: currentItems.map((data) => data.status === "Delayed" ? "rgb(240, 15, 15)" : "rgb(36, 173, 47)"), 
                    backgroundOpacity: [
                        '50%'
                    ],
                    borderWidth: 1,
                },
                {
                    xAxisId: "x-plan",
                    label: 'Arrival Plan',
                    data: currentItems.map((data) => ({
                        x: [
                            parseInt(data.arrivalPlanTime.split(":")[0], 10) + 
                            parseInt(data.arrivalPlanTime.split(":")[1], 10) / 60,
                            parseInt(data.departurePlanTime.split(":")[0], 10) + 
                            parseInt(data.departurePlanTime.split(":")[1], 10) / 60,
                        ],
                        y: data.supplierName,
                    })),
                   
                    backgroundColor:[
                        'rgba(255, 213, 0, 0.56)',
                    ],
                    borderColor: [
                        'rgb(255, 205, 86)',
                    ],
                    backgroundOpacity: [
                        '50%'
                    ],
                    borderWidth: 1,
                    
                },
            ],
        };
        return data;
    };
    

    const getChartOption = () => {
        const data = setChartData()
        const config = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            scales: {
                x: {
                    position: "top",
                    // type: "linear",
                    min: 7,
                    max: 18,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11, // Ukuran font kecil
                        },
                      
                        color: 'black', // Warna putih untuk label x
                        callback: (value) => `${value}:00`,
                    },
                    grid: {
                    color: "#F8FAFC"},       
                },
                y: {
                    stacked: true,
                    beginAtZero: false,
                    ticks: {
                        font: {
                            size: 10, // Ukuran font kecil untuk sumbu-y
                        },
                        color: 'black', // Warna putih untuk label x
                    },
                    grid: {
                        color: "#D9EAFD", // Warna putih untuk garis kotak-kotak di sumbu y
                    },
                },
            },
            elements: {
                bar: {
                    borderWidth: 3,

                },
            },
            responsive: true,
            plugins: {
                backgroundColor: {
                    color: 'white',
                  },
                tooltip: {
                    backgroundColor: "rgba(84, 70, 70, 0.7)", // Latar belakang tooltip semi-transparan
                    callbacks: {
                        label: (context) => {
                            const dataIndex = context.dataIndex; // Get the index of the data point
            
                            // Use your `currentItems` array to get the schedule details
                            const schedule = currentItems[dataIndex]; 
                            if(context.dataset.label === "Arrival On Schedule"){
                                return `Arrival Time: ${schedule.arrivalActualDate}`;
                            } else {
                                return `Schedule Plan: ${schedule.arrivalPlanTime} - ${schedule.departurePlanTime}`;
                            }
                        },
                    },
                },
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: true,
                    text: 'SCHEDULE VENDOR WAREHOUSE',
                    color: 'black', // Warna putih untuk label xx`x`
                },
            },
            onClick: (event, chartElements, chart) => {
                const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = chart.data.labels[firstPoint.index]; // Y-axis label
                    console.log(`Clicked on Y-axis label: ${label}`);
                    setSelectedVendor(label);
                    setIsModalOpen(true);
                }
            },
          };
        return config
    }
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