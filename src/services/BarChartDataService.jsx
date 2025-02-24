
const useBarChartDataService = ({dataBarChart}) => {
    const getAllDatesOfThisMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-based index (0 = January, 11 = December)
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);

        const daysInMonth = new Date(year, month + 1, 0).getDate();
      
        const dates = [];
        const colors = [];
    
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
            dates.push(date.toLocaleDateString("en-CA").split("-")[2]); // Extract day part
            colors.push(dayOfWeek === 0 || dayOfWeek === 6 ? "red" : "black");
        }
    
        return { dates, colors, monthName, year };
    };

      

    const { dates, colors, monthName, year } = getAllDatesOfThisMonth()

    const setLineChartYellowData = () => {
        const data = {
            labels: dates,
            datasets: [
                {
                    type: 'bar',
                    label: '',
                    data: 0,
                    backgroundColor: "transparent",
                    borderColor: 'transparent'
                },
                {
                    type: 'line',
                    label: 'Rec. Qty (NOT COMPLETED)',
                    data: dates.map((date)=>{
                        const matchesDate = dataBarChart.find((data)=>data.incomingDate.split("-")[2] === date)
                        if(matchesDate){
                            return matchesDate.partialCount
                        } else{
                            return 0
                        }
                    }),
                    backgroundColor: 'white',
                    borderColor: 'rgb(255, 204, 0)',
                    stack: "group2"
                  }, 
                {
                    type: 'bar',
                    label: '',
                    data: 0,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent'
                  },
            ]
        }
        return data
    }

    const getLineChartYellowOptions = () => {
        const data = setLineChartYellowData()
        const config = {
            type: 'scatter',
            maintainAspectRatio: false,
            data: data,
            scales: {
                x: {
                    ticks: {
                        display: false 
                    }
                },
                y: {
                    beginAtZero: true
                },
            },
            interaction: {
                intersect: false,
                mode: 'index',
              },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start', 
                },        
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; 
                      },
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                  },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const day = tooltipItems[0].label.padStart(2, "0"); // Ensure "01", "02", etc.
                            return `${day} ${monthName} ${year}`; // Format: "01 February 2025"
                        }
                    }
                }
            }
        };

        return config
    }

    const setLineChartRedData = () => {
        const data = {
            labels: dates,
            datasets: [
                {
                    type: 'bar',
                    label: '',
                    data: 0,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent'
                  },
                {
                    type: 'line',
                    label: 'Rec. Qty (NOT DELIVERED)',
                    data: dates.map((date)=>{
                        const matchesDate = dataBarChart.find((data)=>data.incomingDate.split("-")[2] === date)
                        if(matchesDate){
                            return matchesDate.notDeliveredCount
                        } else{
                            return 0
                        }
                    }),
                    fill: false,
                    backgroundColor: "white",
                    borderColor: 'rgb(231, 63, 63)'
                },
                {
                    type: 'bar',
                    label: '',
                    data: 0,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent'
                  },
            ]
        }
        return data
    }

    const getLineChartRedOptions = () => {
        const data = setLineChartRedData()
        const config = {
            type: 'scatter',
            maintainAspectRatio: false,
            data: data,
            scales: {
                x: {
                    ticks: {
                        display: false 
                    }
                },
                y: {
                    beginAtZero: true
                },
            },
            interaction: {
                intersect: false,
                mode: 'index',
              },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start', 
                },        
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if value is 0
                      },
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                  },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const day = tooltipItems[0].label.padStart(2, "0"); // Ensure "01", "02", etc.
                            return `${day} ${monthName} ${year}`; // Format: "01 February 2025"
                        }
                    }
                }
            }
        };
        return config
    }

    const setBarChartData = () => {

        const data = {
            labels: dates,
            datasets: [
            {
              type: 'bar',
              label: 'Req. Qty',
              data: dates.map((date)=>{
                const matchesDate = dataBarChart.find((data)=>data.incomingDate.split("-")[2] === date)
                if(matchesDate){
                    return matchesDate.itemCount
                } else{
                    return 0
                }
              }),
              borderColor: 'rgb(0, 174, 255)',
              backgroundColor: 'rgba(0, 110, 255, 0.73)',
              stack: "group1",
            },
            {
                type: 'bar',
                label: 'Rec. Qty (COMPLETED)',
                // data: dataBarChart.map((data)=>data.completedCount),
                data: dates.map((date)=>{
                    const matchesDate = dataBarChart.find((data)=>data.incomingDate.split("-")[2] === date)
                    if(matchesDate){
                        return matchesDate.completedCount
                    } else{
                        return 0
                    }
                }),
                borderColor: 'rgb(153, 178, 248)',
                backgroundColor: 'rgba(0, 212, 113, 0.71)',
                stack: "group2"
              },  
            ]
          };

        return data
    }

    const getBarChartOptions = () => {
        const data = setBarChartData()
        const config = {
            type: 'scatter',
            maintainAspectRatio: false,
            data: data,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    stacked: true,
                    ticks: {
                        color: (context) => {
                            const index = context.index;
                            return colors[index]; // Use colors array to color each label
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
              },
            plugins: {
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if value is 0
                      },
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                  },
                legend: {
                    position: 'top',
                    align: 'start', 
                },
                tooltip: {
                    callbacks: {
                    title: function(tooltipItems) {
                        // tooltipItems[0] contains the hovered item
                        const day = tooltipItems[0].label.padStart(2, "0"); // Ensure "01", "02", etc.
                        return `${day} ${monthName} ${year}`; // Format: "01 February 2025"
                        }
                    }
                  }
            }
        };

        return config
    }

    return{
        setLineChartYellowData,
        getLineChartYellowOptions,
        setLineChartRedData,
        getLineChartRedOptions,
        setBarChartData,
        getBarChartOptions
    }
}

export default useBarChartDataService