// Filter UI
let filterBtn = document.querySelectorAll('.listFilter > div[status]:not([status="shut"])');
let shutBtn = document.querySelector('.listFilter > div[status="shut"]');
console.log(filterBtn);

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