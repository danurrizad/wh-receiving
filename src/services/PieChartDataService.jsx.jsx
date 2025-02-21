
const usePieChartDataService = ({dataPieChart}) => {
    const setPieChartData = () => {
        const data = {
            labels: [
                'Completed',
                'Not Completed',
                'Not Delivered',
            ],
            datasets: [{
              label: 'Material Received',
              data: [
                dataPieChart ? dataPieChart.completed : 0, 
                dataPieChart ? dataPieChart.notCompleted : 0, 
                dataPieChart ? dataPieChart.notDelivered : 0
              ],
              backgroundColor: [
                '#00DB42',
                '#FFD43B',
                '#FF0000',
              ],
              hoverOffset: 4
            }]
        }
        return data
      };
    
    const getPieChartOption = () => {
        const data = setPieChartData()
        const config = {
            type: 'pie',
            maintainAspectRatio: false,
            data: data,
            plugins: {
                legend: {
                    // display: false,
                    position: "right",
                },
                datalabels: {
                    color: "black", // Text color
                    formatter: (value, context) => {
                      // console.log("context: ", context.chart.data.datasets[0])
                      const dataset = context.chart.data.datasets[0].data[0] !== undefined ? context.chart.data.datasets[0].data : [0, 0, 0];
                      // console.log("dataset: ", dataset)
                      const total = dataset.reduce((acc, val) => acc + val, 0);
                      // console.log("total: ", total)
                      const percentage = ((value / total) * 100).toFixed(1) + "%"; // Format percentage
                      if(percentage !== `NaN%`){
                        return percentage;
                      }else{
                        return 'Data not found!'
                      }
                    },
                    font: {
                      weight: "bold",
                      size: 20,
                    },
                  },
            }
        }
        return config
    };

    return{
        setPieChartData,
        getPieChartOption
    }
}

export default usePieChartDataService