const useChartData = ({currentItems}) => {
    const color = {
        yellow: "#FFBB00",
        red: "#F64242",
        green: "#35A535"
    }

    const setChartData = () => {
        const labelsVendor = currentItems.map((data)=>data.vendor_name)
        // Generate time range (hourly labels)
        const timeLabels = [];
        for (let hour = 7; hour <= 18; hour++) {
            timeLabels.push(`${hour.toString().padStart(2, "0")}:00`);
        }

        const dataSchedulePlan = {
            from : currentItems.map((data)=>data.schedule_from),
            to : currentItems.map((data)=>data.schedule_to)
        }
        const dataArrivalTime = currentItems.map((data)=>data.arrival_time)

        const data = {
            labels: labelsVendor,
            datasets: [
                {
                    // backgroundColor: 'red',
                    xAxisId: "x-arrival",
                    label: "Arrival On Schedule",
                    data: currentItems.map((data) => ({
                        x: [
                            parseInt(data.arrival_time.split(":")[0], 10) + parseInt(data.arrival_time.split(":")[1], 10) / 60,
                            parseInt(data.arrival_time.split(":")[0], 10) + parseInt(data.arrival_time.split(":")[1], 10) / 60 + 0.5,
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
                            parseInt(data.schedule_from.split(":")[0], 10) + parseInt(data.schedule_from.split(":")[1], 10) / 60,
                            parseInt(data.schedule_to.split(":")[0], 10) + parseInt(data.schedule_to.split(":")[1], 10) / 60,
                        ],
                        y: data.vendor_name,
                    })),
                   
                    backgroundColor:[
                        'rgba(255, 187, 0, 0.29)',
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
            scales: {
                x: {
                    position: "top",
                    // type: "linear",
                    min: 7,
                    max: 18,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 10, // Ukuran font kecil
                        },
                        callback: (value) => `${value}:00`,
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: false,
                    ticks: {
                        font: {
                            size: 9, // Ukuran font kecil untuk sumbu-y
                            
                        },
                    },
                },
            },
            elements: {
                bar: {
                    borderWidth: 2,

                },
            },
            responsive: true,
            plugins: {
                backgroundColor: {
                    color: 'black',
                  },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)", // Latar belakang tooltip semi-transparan
                    callbacks: {
                        label: (context) => {
                            const dataIndex = context.dataIndex; // Get the index of the data point
            
                            // Use your `currentItems` array to get the schedule details
                            const schedule = currentItems[dataIndex]; 
                            if(context.dataset.label === "Arrival On Schedule"){
                                return `Arrival Time: ${schedule.arrival_time}`;
                            } else {
                                return `Schedule Plan: ${schedule.schedule_from} - ${schedule.schedule_to}`;
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
                    text: 'Scheduling Time Vendor',
                },
            },
            
          };
        return config
    }
    return {
        setChartData,
        getChartOption
    }
}

export default useChartData