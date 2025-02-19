
const usePieChartDataService = ({dataPieChart}) => {
  console.log("service chart:", dataPieChart)
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
                Number(dataPieChart?.completed), 
                Number(dataPieChart?.notCompleted), 
                Number(dataPieChart?.notDelivered)
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
                      const dataset = context.chart.data.datasets[0].data;
                      const total = dataset.reduce((acc, val) => acc + val, 0);
                      const percentage = ((value / total) * 100).toFixed(1) + "%"; // Format percentage
                      return percentage;
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