const mapTemp = document.querySelector('#mapTemp')
const mapHumid = document.querySelector('#mapHumid')
const mapAq = document.querySelector('#mapAq')
const mapGas = document.querySelector('#mapGas')

if (mapTemp.innerText < 0) {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/excold.jpg")';
} else if (mapTemp.innerText < 10) {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/cold.jpg")';
} else if (mapTemp.innerText < 20) {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/cool.jpg")';
} else if (mapTemp.innerText < 30) {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/warm.jpg")';
} else if (mapTemp.innerText < 40) {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/hot.jpg")';
} else {
    mapTemp.parentElement.parentElement.style.backgroundImage = 'url("../image/temp/exhot.jpg")';
}

if (mapHumid.innerText < 40) {
    mapHumid.parentElement.parentElement.style.backgroundImage = 'url("../image/hu/40.jpg")';
} else if (mapHumid.innerText < 60) {
    mapHumid.parentElement.parentElement.style.backgroundImage = 'url("../image/hu/60.jpg")';
} else {
    mapHumid.parentElement.parentElement.style.backgroundImage = 'url("../image/hu/100.jpg")';
}

if (mapAq) {
    mapAq.parentElement.parentElement.style.border = '2px solid rgba(100, 100, 100, 0.1)';
}

if (mapGas) {
    mapGas.parentElement.parentElement.style.border = '2px solid rgba(100, 100, 100, 0.1)';
}