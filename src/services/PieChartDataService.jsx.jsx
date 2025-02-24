
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
            layout: {
              padding: 20
            },
            maintainAspectRatio: false,
            data: data,
            plugins: {
                legend: {
                    position: "right",
                },
                datalabels: {
                    display: 'auto',
                    color: "black", // Text color
                    // anchor: 'middle',
                    anchor: data.datasets[0].data[0] === undefined ? 'start' : 'middle',
                    align: 'bottom',
                    formatter: (value, context) => {
                      const dataset = context.chart.data.datasets[0].data[0] !== undefined ? context.chart.data.datasets[0].data : [0, 0, 0];
                      const total = dataset.reduce((acc, val) => acc + val, 0);
                      const percentage = ((value / total) * 100).toFixed(1) + "%"; // Format percentage
                      if(percentage !== `NaN%`){
                        if(percentage === '0.0%'){
                          return ''
                        }else{
                          return percentage;
                        }
                        // return percentage;
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