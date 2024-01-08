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

let notiType = {
    newDevice: 'newDevice',
    newUser: 'newUser',
    alarm: 'alarm',
    normal: 'normal',
}


let notiData = [];

function fetchNoti() {
    fetch("/web/api/getNoti")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            notiData = data.noti;
            console.log(notiData);
            // noti gen
            notiData.forEach(function (element) {
                let noti = new NotiGen(element.title, element.content, element.time, element.type, element.isNotiNew, element.isRead);
                console.log(noti);
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
        })
}

let notiGenArray = [];
window.onload = fetchNoti();

var notiCenter = document.querySelectorAll(".noti-center");

// Noti gen constructor
class NotiGen {
    constructor(notiTitle, notiContent, notiTime, notiType, isNew, isRead) {
        this.notiTitle = notiTitle;
        this.notiContent = notiContent;
        this.notiTime = notiTime;
        this.notiType = notiType;
        this.isNew = isNew;
        this.isRead = isRead;

        this.notiGen = function () {
            let noti = document.createElement("a");
            noti.classList.add("modal-noti-item");
            console.log(this.notiType);
            if (this.notiType == 'newDevice') {
                noti.setAttribute("href", "/admin");
                console.log("sensor");
            } else {
                noti.setAttribute("href", "");
            }

            if (this.isNew) {
                noti.classList.add("noti-new");
            }
            if (this.isRead) {
                noti.classList.add("noti-read");
            }

            noti.innerHTML = `
        <div class="modal-noti-icon">
            <span class="material-symbols-outlined" style="color:
            ${this.notiType === 'newDevice' ? 'green' :
                    this.notiType === 'newUser' ? 'blue' :
                        this.notiType === 'sensorsAlert' ? 'red' :
                            'purple'}">
            ${this.notiType === 'newDevice' ? 'sensors' :
                    this.notiType === 'newUser' ? 'person_add' :
                        this.notiType === 'sensorsAlert' ? 'gpp_bad' :
                            'notifications'}
            </span>
        </div>
        <h2 class="modal-noti-h2">${this.notiTitle}</h2>
        <div class="modal-noti-content">${this.notiContent}</div>
        <div class="modal-noti-time">${this.notiTime}</div>
        `;
            return noti;
        };

        this.notiGen();
    }
}




