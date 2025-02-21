import { plugins } from "chart.js";

const useBarChartDataService = ({dataBarChart}) => {
    const getAllDatesOfThisMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-based index (0 = January, 11 = December)
      
        const daysInMonth = new Date(year, month + 1, 0).getDate();
      
        const dates = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);

          
          // Format the date as YYYY-MM-DD
          return date.toLocaleDateString("en-CA").split("-")[2]; // en-CA gives YYYY-MM-DD format
        });
      
        return dates;
      };

    const dates = getAllDatesOfThisMonth()
    // const randomData = dates.map(()=>Math.floor(Math.random() * 31) + 20)
    // const randomDifferenceData = dates.map((data, index)=>50-randomData[index])

    // const randomDataCompleted = randomData.map(value => Math.floor(value / 10) * 10);
    // const randomDataPartial = randomData.map((value, index) => value - randomDataCompleted[index]);

    const setLineChartYellowData = () => {
        const data = {
            labels: dates,
            datasets: [
                {
                    // type: 'line',
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
                    // type: 'bar',
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
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start', 
                    // labels: {
                    //     padding: {
                    //         top: "20"
                    //     }  
                    // }
                },        
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if value is 0
                      },
                    anchor: 'end',
                    align: 'top',
                    // color: data.datasets[0] ? "red" : "yellow",
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                  },
            }
        };

        return config
    }

    const setLineChartRedData = () => {
        const data = {
            labels: dates,
            datasets: [
                {
                    // type: 'bar',
                    label: '',
                    data: 0,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent'
                  },
                {
                    type: 'line',
                    label: 'Rec. Qty (NOT DELIVERED)',
                    // data: dataBarChart?.map((data)=>data.notDeliveredCount),
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
                    // type: 'bar',
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
        // console.log("data type:", data)
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
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start', 
                    // labels: {
                    //     padding: {
                    //         top: "20"
                    //     }  
                    // }
                },        
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if value is 0
                      },
                    anchor: 'end',
                    align: 'top',
                    // color: data.datasets[0] ? "red" : "yellow",
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                  },
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
            //   data: dataBarChart.map((data)=>data.itemCount),
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
            //   datalabels: {
            //     labels: {
            //         title: 'green'
            //     }
            //   }
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
                }
            },
            // options: {
            // },
            plugins: {
                datalabels: {
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if value is 0
                      },
                    anchor: 'end',
                    align: 'top',
                    // color: data.datasets[0] ? "red" : "yellow",
                    font: {
                        weight: 'bold',
                        size: 12
                        // size: function(context) {
                        //     console.log("context:", context)
                        //     const value = context.dataset.data[context.dataIndex];
                        //     return value > 0 ? 12 : 100; // Hide when value is 0
                        //   }
                    }
                  },
                legend: {
                    position: 'top',
                    align: 'start', 
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