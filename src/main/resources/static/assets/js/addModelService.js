async function sendBodyRequest(url, method, body) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    return await fetch(url, {
        method: method,
        body: JSON.stringify(Object.fromEntries(body)),
        headers: headers
    }).then(async response => response.json()
        .catch(response => response.status))
}


async function downloadDocFile(url, method, name) {
return await fetch(url, {method: method}).then(res => res.blob())
        .then(data => {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(data);
            a.download = name;
            a.click();
        });
}

function addErrorField(form, inner) {
    var error = document.createElement('div');
    error.className = 'error';
    error.style = "text-align: center;color: red;";
    error.innerHTML = inner;
    form.parentElement.insertBefore(error, form.nextSibling);
}

function removeValidation() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.remove();
    });
}

function checkFormValidation(forms) {
    let errorFlag = false;
    for (let i = 0; i < forms.length; i++) {
        if (i === 2 && forms[2].elements[0].value === "") {
            if (forms[i - 1].elements[0].value === '0' || forms[i - 1].elements[0].value === '1') {
                addErrorField(forms[i], "Заполните поле!");
                errorFlag = true;
            }
        } else if (i > 6 && i < forms.length - 2) {
            if (forms[i].elements[0].value === "") {
                addErrorField(forms[i], "Заполните поле: Наименование устройства!");
                errorFlag = true;
            }
        } else if (i === forms.length - 2) {
            if(forms[i].elements[0].value !== "" && forms[6].elements[0].value !== "") {
                let notification = new Date(forms[i].elements[0].value);
                let makingStartDate = new Date(forms[6].elements[0].value);
                let dateDifferent = Math.round((notification - makingStartDate) / (1000 * 60 * 60 * 24));
                if(dateDifferent <= 0) {
                    addErrorField(forms[i], "Нельзя установить уведомление в прошлом или настоящем!");
                    errorFlag = true;
                }
            }
        } else if (forms[i].elements[0].value === "") {
            addErrorField(forms[i], "Заполните поле!");
            errorFlag = true;
        }
    }
    return errorFlag;
}

function addWriteRow() {
    let newDeviceRow = deviceRow.cloneNode(true);
    device.appendChild(newDeviceRow);

    let rowNumbers = document.getElementsByClassName("fs-1");
    for (let i = 0; i < rowNumbers.length; i++) {
        rowNumbers[i].textContent = 1 + i;
    }
}

function delWriteRow() {
    let deviceRowDel = document.getElementsByClassName("row");
    if (deviceRowDel.length > 8) {
        deviceRowDel[deviceRowDel.length - 6].remove();
    }
}

document.getElementById('reason').addEventListener('change', function (e) {
    let number = document.getElementById('reasonNumber');
    number.style.display = e.target.value == 2 ? "none" : "block";
});

document.getElementById("addButton").addEventListener("click", async () => {
    const forms = document.getElementsByTagName("form");
    removeValidation();
    if (checkFormValidation(forms)) {
        return;
    }

    let descriptions = [];
    for (let i = 7; i < forms.length - 2; i++) {
        descriptions.push(Object.fromEntries(new Map([
            ["device", forms[i].elements[0].value],
            ["serialNumber", forms[i].elements[1].value],
            ["inventoryNumber", forms[i].elements[2].value],
            ["remark", forms[i].elements[3].value]
        ])));
    }

    let dealer = new Map([
        ["name", forms[3].elements[0].value],
        ["subdivision", forms[4].elements[0].value],
        ["department", forms[5].elements[0].value]
    ]);

    let postRequestObj = new Map;
    postRequestObj.set("deviceType", forms[0].elements[0].value);
    postRequestObj.set("reason", forms[1].elements[0].value);
    postRequestObj.set("reasonNumber", forms[1].elements[0].value == 2 ? "-" : forms[2].elements[0].value);
    postRequestObj.set("dealer", Object.fromEntries(dealer));
    postRequestObj.set("date", forms[6].elements[0].value);
    postRequestObj.set("notification", forms[forms.length - 2].elements[0].value);
    postRequestObj.set("memberName", forms[forms.length - 1].elements[0].value);
    postRequestObj.set("descriptions", descriptions);

    // del rows after write in array
    const descriptionRows = document.getElementsByClassName("row");
    for (let i = descriptionRows.length - 6; i > 2; i--) {
        descriptionRows[i].remove();
    }

    // TODO How to delete text from input fields!!!
    forms[3].elements[0].value = "";

    $('#modalAdd').modal('hide');
    addModelId = await sendBodyRequest("/manufacture/add", 'POST', postRequestObj);
    $('#modalSaveTicket').modal('show');
});

document.getElementById("getDocTicket").addEventListener("click", () => {
    downloadDocFile("/manufacture/doc/1/" + addModelId["id"], 'GET', "Талон модели №" + addModelId["id"]);
});

document.getElementById("openAdd").addEventListener("click", () => {
    document.getElementById("memberName").selectedIndex = -1;
    document.getElementById("deviceType").selectedIndex = -1;
    document.getElementById("reason").selectedIndex = -1;
    document.getElementById("subdivision").selectedIndex = -1;
    document.getElementById("department").selectedIndex = -1;
    document.getElementById("reasonNumber").style.display = "none"
});

$('.noEnterSubmit').keypress(function(e){
    if ( e.which == 13 ) return false;
});

let addModelId;
let device = document.getElementById("device");
const deviceRow = document.getElementById("deviceRow");
document.getElementById('addWrite').addEventListener('click', addWriteRow);
document.getElementById('delWrite').addEventListener('click', delWriteRow);