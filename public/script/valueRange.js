function ValueRange() {
    const mapTemp = document.querySelector('#mapTemp');
    const mapHumid = document.querySelector('#mapHumid');
    const mapAq = document.querySelector('#mapAq');
    const mapGas = document.querySelector('#mapGas');

    if (mapTemp) {
        function setBackgroundImage(element, imagePath) {
            element.parentElement.parentElement.style.backgroundImage = `url("${imagePath}")`;
        }

        function setBorderStyle(element) {
            element.parentElement.parentElement.style.border = '2px solid rgba(100, 100, 100, 0.1)';
        }

        function addRange() {
            console.log(mapTemp.innerText);
            console.log(mapHumid.innerText);
            if (mapTemp.innerText < 0) {
                setBackgroundImage(mapTemp, '../image/temp/excold.jpg');
            } else if (mapTemp.innerText < 10) {
                setBackgroundImage(mapTemp, '../image/temp/cold.jpg');
            } else if (mapTemp.innerText < 20) {
                setBackgroundImage(mapTemp, '../image/temp/cool.jpg');
            } else if (mapTemp.innerText < 30) {
                setBackgroundImage(mapTemp, '../image/temp/warm.jpg');
            } else if (mapTemp.innerText < 40) {
                setBackgroundImage(mapTemp, '../image/temp/hot.jpg');
            } else {
                setBackgroundImage(mapTemp, '../image/temp/exhot.jpg');
            }

            if (mapHumid.innerText < 40) {
                setBackgroundImage(mapHumid, '../image/hu/40.jpg');
            } else if (mapHumid.innerText < 60) {
                setBackgroundImage(mapHumid, '../image/hu/60.jpg');
            } else {
                setBackgroundImage(mapHumid, '../image/hu/100.jpg');
            }

            if (mapAq) {
                setBorderStyle(mapAq);
            }

            if (mapGas) {
                setBorderStyle(mapGas);
            }

            if (mapGas.innerText < 1) {
                mapGas.style.color = 'green';
            } else if (mapGas.innerText < 2) {
                mapGas.style.color = 'yellow';
            } else if (mapGas.innerText < 6) {
                mapGas.style.color = 'red';
            }
        }

        addRange();
    } else {
        console.log('mapTemp does not exist');
    }

}

// export default ValueRange;