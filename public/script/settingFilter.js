// Switch UI
let switchBtn = document.querySelectorAll('#adminSwitch > div');
let adminManage = document.querySelector('#adminManage');
let adminRegister = document.querySelector('#adminRegister');
switchBtn.forEach(element => {
    element.addEventListener("click", () => {
        switchBtn.forEach(btn => {
            btn.setAttribute("status", btn.getAttribute("status") === "off" ? "on" : "off");
        });

        if (adminManage.style.display === "none") {
            adminManage.style.display = "block";
            adminRegister.style.display = "none";
        } else {
            adminManage.style.display = "none";
            adminRegister.style.display = "block";
        }
    });
});

// Filter UI
let filterBtn = document.querySelectorAll('.listFilter > div[status]:not([status="shut"])');
let shutBtn = document.querySelector('.listFilter > div[status="shut"]');

filterBtn.forEach(element => {
    element.addEventListener("click", () => {
        filterBtn.forEach(btn => {
            btn.setAttribute("status", btn === element && btn.getAttribute("status") === "off" ? "on" : "off");
        });

        if (element.getAttribute("status") === "on") {
            shutBtn.style.display = "block";
        }
    });
});

shutBtn.addEventListener("click", () => {
    filterBtn.forEach(btn => {
        btn.setAttribute("status", "off");
    });
    shutBtn.style.display = "none";
});


