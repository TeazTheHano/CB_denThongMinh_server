// Fetch data and create chart inside the fetch callback
function getDeviceData1() {
    fetch("/web/api/getData")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data[0].measure);

            // Extract labels dynamically from the API response
            var labels = data[0].measure.slice(-30).map(element => element.time.slice(11, 19));
            var temp = data[0].measure.slice(-30).map(element => element.temp);
            var humi = data[0].measure.slice(-30).map(element => element.humi);
            var dust = data[0].measure.slice(-30).map(element => element.dust);
            var mq7 = data[0].measure.slice(-30).map(element => element.mq7);

            // query
            document.getElementById('mapTemp').innerText = temp[temp.length - 1];
            document.getElementById('mapHumid').innerText = humi[humi.length - 1];
            document.getElementById('mapAq').innerText = dust[dust.length - 1];
            document.getElementById('mapGas').innerText = mq7[mq7.length - 1];
            
            var dataChart = {
                labels: labels,
                datasets: [
                    {
                        label: 'Nhiệt độ (˚C)',
                        data: temp,
                        borderColor: 'red',
                        borderWidth: 4,
                        fill: false
                    },
                    {
                        label: 'Độ ẩm (%)',
                        data: humi,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 4,
                        fill: false
                    },
                    {
                        label: 'Bụi (µm)',
                        data: dust,
                        borderColor: 'orange',
                        borderWidth: 4,
                        fill: false
                    },
                    {
                        label: 'Gas (µm)',
                        data: mq7,
                        borderColor: 'rgba(215, 12, 192, 1)',
                        borderWidth: 4,
                        fill: false
                    }
                ]
            };

            // Chart configuration
            var config = {
                type: 'line',
                data: dataChart,
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: dataChart.labels
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };

            // Get the canvas element and render the chart
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, config);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the function to fetch data and create the chart
getDeviceData1();

document.querySelector('#profileFetch').addEventListener('click', function () {
    // destroy the existed chart
    let chartFrame = document.querySelector('#chartFrame')
    chartFrame.querySelector('#myChart').remove()
    let newChart = document.createElement('canvas')
    newChart.id = 'myChart'
    chartFrame.appendChild(newChart)

    getDeviceData1()
})