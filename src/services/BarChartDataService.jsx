import { plugins } from "chart.js";

const useBarChartDataService = ({dataChartSchedules}) => {
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

    const setBarChartData = () => {
        const dates = getAllDatesOfThisMonth()

        const randomData = dates.map(()=>Math.floor(Math.random() * 31) + 20)

        const data = {
            labels: dates,
            datasets: [
            {
                type: 'line',
                label: 'Fluctuation',
                data: randomData,
                fill: false,
                backgroundColor: "transparent",
                borderColor: 'rgb(255, 238, 0)'
            },
            {
              type: 'bar',
              label: 'Req. Qty',
              data: dates.map(()=>50),
              borderColor: 'rgb(0, 174, 255)',
              backgroundColor: 'rgba(0, 110, 255, 0.73)'
            },{
                type: 'bar',
                label: 'Rec. Qty',
                data: randomData,
                borderColor: 'rgb(153, 178, 248)',
                backgroundColor: 'rgba(0, 212, 113, 0.71)'
              } 
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
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
            },
            plugins: {
                datalabels: {
                    display: false
                  },
            }
        };

        return config
    }

    return{
        setBarChartData,
        getBarChartOptions
    }
}

export default useBarChartDataService