

function getMeasureDataOfDevice(id) {
    id = Math.floor(id);
    if (id && id > 0) {
        fetch(`/web/api/getMeasureData?id=${id}`)
            .then(response => response.json())
            .then(data => console.log(data))
    } else if (id == undefined) {
        fetch(`/web/api/getMeasureData`)
            .then(response => response.json())
            .then(data => {
                //placeholder code
                data = data.map((item, index) => {
                    return item.measure;
                })
                console.table(data[1]);
            })
    } else {
        console.log("id is invalid");
    }
}
