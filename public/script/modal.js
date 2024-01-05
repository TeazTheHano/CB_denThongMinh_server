// COMMON MODAL SECTION
function findAndCloseModal() {
    var closeModalButtons = document.querySelectorAll("[class^='modal-close-btn']");
    closeModalButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            closeDialog(button);
        });
    });

    function closeDialog(clickedElement) {
        let dialog = clickedElement.closest(".modal-background");
        dialog.setAttribute("closed", "");
        dialog.removeAttribute("open");
        console.log("close dialog");
    }

}
findAndCloseModal();

/* add index-info */
let indexInfoContent = `
<div class="modal-container">
    <h1 class="modal-container-h1" id="indexInfoModalH1">heeeheheh</h1>
    <div class="modal-container-content" id="indexInfoModalP">Lorem ipsum dolor sit amet, consectetur
        adipisicing elit.
        Exercitationem laborum repudiandae sunt perspiciatis nam officiis labore dicta
        obcaecati. Voluptate, ducimus quidem eligendi cum molestiae aliquam maxime temporibus
        delectus officia velit!</div>
    <div class="modal-close-btn-x">
        <span class="material-symbols-outlined">
            close
        </span>
    </div>
    <div class="modal-close-btn-bottom">Đóng</div>
</div>`;

let indexInfo = document.querySelectorAll(".index-info");
if (indexInfo.length > 0) {
    indexInfo.forEach(function (element) {
        element.addEventListener("click", function () {
            element.classList.add("btn-motion");
            let dialog = document.createElement("dialog");
            dialog.classList.add("modal-background");
            dialog.id = "indexInfoModal";
            dialog.innerHTML = indexInfoContent;
            element.parentElement.appendChild(dialog);

            dialog.removeAttribute("closed");
            dialog.setAttribute("open", "");
            findAndCloseModal();
        });
    });
}


// FIXME: NOTIFICATION SCRIPT SECTION

// prevent default for a tag with empty href
var aTagWithEmptyHref = document.querySelectorAll("a[href='']");
aTagWithEmptyHref.forEach(function (element) {
    element.addEventListener("click", function (event) {
        event.preventDefault();
    });
});


// TODO: Noti data here
let notiIcon = {
    newConnect: 'sensors',
    sensorsAlert: 'gpp_bad',
}

let notiData = [
    {
        notiTitle: "Thông báo 1111",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.sensorsAlert,
        notiColor: 'red'
    },
    {
        notiTitle: "ADMIN: Có kết nối từ thiết bị mới",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.newConnect,
        notiColor: 'green'
    },
    {
        notiTitle: "Thông báo",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.sensorsAlert,
        notiColor: 'red'
    },
    {
        notiTitle: "Thông báo",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.sensorsAlert,
        notiColor: 'red'
    },
    {
        notiTitle: "Thông báo",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.sensorsAlert,
        notiColor: 'red'
    },
    {
        notiTitle: "Thông báo",
        notiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed explicabo facilis ipsa culpa maxime harum adipisci, aut iure molestias, vel tenetur. Recusandae, harum molestias sint laboriosam provident velit corrupti vero.",
        notiIcon: notiIcon.sensorsAlert,
        notiColor: 'red'
    },
];

var notiCenter = document.querySelectorAll(".noti-center");

// Noti gen constructor
class NotiGen {
    constructor(notiTitle, notiContent, notiIcon, notiColor) {
        this.notiTitle = notiTitle;
        this.notiContent = notiContent;
        this.notiIcon = notiIcon;
        this.notiColor = notiColor;

        this.notiGen = function () {
            let noti = document.createElement("a");
            noti.classList.add("modal-noti-item");

            if (this.notiIcon == 'sensors') {
                noti.setAttribute("href", "/admin");
                console.log("sensor");
            } else {
                noti.setAttribute("href", "");
            }
            noti.innerHTML = `
        <div class="modal-noti-icon">
            <span class="material-symbols-outlined" style="color: ${this.notiColor}">
                ${this.notiIcon}
            </span>
        </div>
        <h2 class="modal-noti-h2">${this.notiTitle}</h2>
        <div class="modal-noti-content">${this.notiContent}</div>`;
            return noti;
        };

        this.notiGen();
    }
}

// noti gen
let notiGenArray = [];
notiData.forEach(function (element) {
    let noti = new NotiGen(element.notiTitle, element.notiContent, element.notiIcon, element.notiColor);
    notiGenArray.push(noti);
});

// noti center
if (notiCenter.length > 0) {
    notiCenter.forEach(function (element) {
        element.querySelector('div').addEventListener("click", function () {
            if (document.querySelectorAll(".modal-noti-background").length == 0) {
                let dialog = document.createElement("dialog");
                dialog.classList.add("modal-noti-background");
                dialog.id = "notiCenterModal";
                let notiHolder = document.createElement("div");
                notiHolder.classList.add("modal-noti");
                dialog.appendChild(notiHolder);

                notiGenArray.forEach(function (element) {
                    notiHolder.appendChild(element.notiGen());
                });
                element.appendChild(dialog);

                dialog.removeAttribute("closed");
                dialog.setAttribute("open", "");


                let notiCenterBackground = document.querySelector(".modal-noti-background");
                notiCenterBackground.addEventListener("click", function (event) {
                    if (event.target == notiCenterBackground) {
                        dialog.removeAttribute("open");
                        dialog.setAttribute("closed", "");
                        // remove dialog after animation
                        setTimeout(function () {
                            if (document.querySelector(".modal-noti-background").open == false) {
                                notiCenterBackground.remove();
                                console.log("remove dialog");
                            }
                        }, 5000);
                    }
                });
            } else {
                console.log("notiCenterBackground is already exist");
                let dialog1 = document.querySelector(".modal-noti-background");
                if (dialog1.open == false) {
                    dialog1.removeAttribute("closed");
                    dialog1.setAttribute("open", "");
                } else {
                    dialog1.removeAttribute("open");
                    dialog1.setAttribute("closed", "");
                }
            }
        }
        );
    }
    );
}
