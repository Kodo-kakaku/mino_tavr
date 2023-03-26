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

    const dealerBegin = new Map([
        ["name", forms[3].elements[0].value],
        ["subdivision", forms[4].elements[0].value],
        ["department", forms[5].elements[0].value]
    ]);

    const memberBegin = new Map([
        ["name", forms[forms.length - 1].elements[0].value],
        ["subdivision", '25'],
        ["department", 'Т']
    ]);

    const interactionBegin = new Map([
        ["date", forms[6].elements[0].value],
        ["dealer", Object.fromEntries(dealerBegin)],
        ["member", Object.fromEntries(memberBegin)]
    ]);

    const dealerEnd = new Map([
        ["name", '-'], ["subdivision", '-'], ["department", '-']
    ]);

    const memberEnd = new Map([
        ["name", '-'], ["subdivision", '-'], ["department", '-']
    ]);

    const interactionEnd = new Map([
        ["date", null],
        ["dealer", Object.fromEntries(dealerEnd)],
        ["member", Object.fromEntries(memberEnd)]
    ]);


    let postRequestObj = new Map;
    postRequestObj.set("deviceType", forms[0].elements[0].value);
    postRequestObj.set("reason", forms[1].elements[0].value);
    postRequestObj.set("reasonNumber", forms[1].elements[0].value === '2' ? "-" : forms[2].elements[0].value);
    postRequestObj.set("interactionBegin", Object.fromEntries(interactionBegin));
    postRequestObj.set("interactionEnd", Object.fromEntries(interactionEnd));
    postRequestObj.set("notification", forms[forms.length - 2].elements[0].value);
    postRequestObj.set("descriptions", descriptions);

    delAllRows();
    delValuesFromForms(forms);

    $('#modalAdd').modal('hide');
    addModelId = await sendBodyRequest("/manufacture/add", 'POST', postRequestObj);
    $('#modalSaveTicket').modal('show');
});

let addModelId;
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

$('.noEnterSubmit').keypress(function (e) {
    if (e.which == 13) return false;
});

document.getElementById('addWrite').addEventListener('click', () => {
    let device = document.getElementById("device");
    addWriteRow(device);
});

document.getElementById('reason').addEventListener('change', (e) => {
    let number = document.getElementById('reasonNumber');
    viewOtherField(e, number);
});