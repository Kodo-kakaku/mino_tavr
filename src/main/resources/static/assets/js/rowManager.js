let rowId = 1;
function addWriteRow(device) {
    // remark
    let txtArea = document.createElement("textarea");
    txtArea.className = "form-control";
    txtArea.style.cssText = "background: rgb(45,44,56);margin-top: 17px;border-radius: 6px;" +
        "font-family: 'Abril Fatface', serif;font-size: 19px;color: var(--bs-modal-bg);";
    txtArea.placeholder = "Примичание";

    // inventoryNumber
    let inputInventoryNumber = document.createElement("input");
    inputInventoryNumber.className = "form-control";
    inputInventoryNumber.style.cssText = "font-family: 'Abril Fatface', serif;text-align: left;background: rgb(45,44,56);color: var(--bs-modal-bg);" +
        "font-size: 19px;margin-left: 1px;border-radius: 6px;margin-top: 7px;padding-bottom: 10px;margin-bottom: -8px;";
    inputInventoryNumber.placeholder = "Инвентарный номер устройства";
    inputInventoryNumber.type = "text";

    // serialNumber
    let inputSerialNumber = document.createElement("input");
    inputSerialNumber.className = "form-control";
    inputSerialNumber.style.cssText = "font-family: 'Abril Fatface', serif;text-align: left;background: rgb(45,44,56);" +
        "color: var(--bs-modal-bg);font-size: 19px;margin-left: 1px;border-radius: 6px;margin-top: 5px;margin-bottom: -8px;";
    inputSerialNumber.placeholder = "Серийный номер устройства";
    inputSerialNumber.type = "text";

    // deviceName
    let inputDeviceName = document.createElement("input");
    inputDeviceName.className = "form-control";
    inputDeviceName.type = "text";
    inputDeviceName.style.cssText = "font-family: 'Abril Fatface', serif;text-align: left;background: rgb(45,44,56);" +
        "color: var(--bs-modal-bg);font-size: 19px;margin-left: 1px;border-radius: 6px;margin-bottom: -7px;margin-top: 27px;";
    inputDeviceName.placeholder = "Наименование устройства";


    let divDeviceName = document.createElement("div");
    divDeviceName.className = "form-group mb-3";
    let divArea = document.createElement("div");
    divArea.className = "form-group mb-3";
    let divSerialNumber = document.createElement("div");
    divSerialNumber.className = "form-group mb-3";
    let divInventoryNumber = document.createElement("div");
    divInventoryNumber.className = "form-group mb-3";

    let form = document.createElement("form");
    form.style.cssText = "margin-top: 10px;background: rgb(45,44,56);color: var(--bs-modal-bg);";
    form.appendChild(inputDeviceName);
    form.appendChild(inputSerialNumber);
    form.appendChild(inputInventoryNumber);
    form.appendChild(txtArea);

    let divDeviceForm = document.createElement("div");
    divDeviceForm.appendChild(form);
    form.appendChild(divDeviceName);
    form.appendChild(divSerialNumber);
    form.appendChild(divInventoryNumber);
    form.appendChild(divArea);
    divDeviceName.appendChild(inputDeviceName);
    divSerialNumber.appendChild(inputSerialNumber);
    divInventoryNumber.appendChild(inputInventoryNumber);
    divArea.appendChild(txtArea);

    // Increment for ID
    let id = "deviceRowCounter_" + rowId;


    let iDevice = document.createElement("i");
    iDevice.style.cssText = "color: var(--bs-yellow);font-size: 16px;";
    iDevice.className = "fas fa-times";

    let button = document.createElement("button");
    button.style.cssText = "color: var(--bs-modal-bg);background: var(--bs-border-color-translucent);" +
        "margin-bottom: -24px;margin-top: -6px;font-family: 'Noto Sans', sans-serif;";
    button.type = "button";
    button.className = "btn btn-secondary";
    button.onclick = function () {
        document.getElementById(id).remove();
        addNumberRowField();
    };
    button.appendChild(iDevice);

    let pButton = document.createElement("p");
    pButton.style.cssText = "margin-bottom: 18px;margin-top: 7px;";
    pButton.className = "text-end";
    pButton.appendChild(button);


    let divDevice = document.createElement("div");
    divDevice.style.cssText = "border-radius: 6px;border: 1px solid var(--bs-modal-bg);margin-top: 14px;";
    divDevice.className = "col-lg-8";
    divDevice.appendChild(pButton);
    divDevice.appendChild(divDeviceForm);


    let pNumber = document.createElement("p");
    pNumber.style.cssText = "margin-bottom: 6px;font-family: 'Kaushan Script', serif;" +
        "color: var(--bs-yellow);margin-top: 125px;";
    pNumber.className = "fs-1 text-center";

    let divNumber = document.createElement("div");
    divNumber.className = "col-2";
    divNumber.appendChild(pNumber);


    let divCol = document.createElement("div");
    divCol.className = "col";

    let divMain = document.createElement("div");
    divMain.style.cssText = "margin-top: 1px;margin-bottom: 31px;";
    divMain.className = "row";
    divMain.id = id;
    divMain.appendChild(divNumber);
    divMain.appendChild(divDevice);
    divMain.appendChild(divCol);

    device.appendChild(divMain);
    addNumberRowField();
    rowId++;
}

function addNumberRowField() {
    let rowNumbers = document.getElementsByClassName("fs-1");
    for (let i = 0; i < rowNumbers.length; i++) {
        rowNumbers[i].textContent = (i + 1).toString();
    }
}
function delValuesFromForms(e) {
    for(let i = 0; i < e.length; i++) {
        e[i].reset();
    }
}

function delAllRows() {
    const descriptionRows = document.getElementsByClassName("row");
    for(let i = 0; i < descriptionRows.length; i++) {
        if (descriptionRows[i].id.indexOf("deviceRowCounter_") !== -1) {
            descriptionRows[i].remove();
            i--;
        }
    }
}