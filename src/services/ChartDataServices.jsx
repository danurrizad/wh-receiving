const useChartData = () => {

    const setChartData = () => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']; // Replace Utils.months if necessary
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
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
            elements: {
                bar: {
                borderWidth: 2,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                position: 'right',
                },
                title: {
                display: true,
                text: 'Chart.js Horizontal Bar Chart',
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