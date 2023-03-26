document.getElementById('ModelEditingReason').addEventListener('change', (e) => {
    let number = document.getElementById('ModelEditingReasonNumber');
    viewOtherField(e, number);
});

document.getElementById('ModelEditingAdd').addEventListener('click', () => {
    let device = document.getElementById("deviceEdit");
    addWriteRow(device);
});

window.addEventListener("load", async () => {
    const modelRows = document.getElementById("modelRows");
    const type = document.getElementById("modelType");
    sendRequest("/manufacture/models/" + type.innerHTML, 'GET')
        .then((result) => {
            console.log(result);
            for (let i of result) {
                let modelSpanNumber = document.createElement("span");
                modelSpanNumber.style = "color: var(--bs-white);font-family: 'Abril Fatface', serif;font-size: 33px;";
                modelSpanNumber.innerHTML = "Модель № " + i.id;

                let modelImg = document.createElement("img");
                modelImg.className = "rounded img-fluid border-warning fit-cover";
                modelImg.style = "height: 200px;";
                modelImg.src = "data:image/jpeg;base64," + i.image;
                modelImg.height = 200;
                modelImg.width = 431;

                let modelSpanDate = document.createElement("span");
                modelSpanDate.style = "color: var(--bs-white);font-family: 'Abril Fatface', serif;font-size: 33px;";
                modelSpanDate.innerHTML = i.date;

                let modelButton = document.createElement("button");
                modelButton.className = "btn btn-light text-center";
                modelButton.setAttribute('type', "button");
                modelButton.setAttribute('id', "modalView");
                modelButton.style = "margin-left: -1px;font-size: 41px;background: var(--bs-border-color-translucent);";
                modelButton.onclick = function () {
                    sendRequest("/manufacture/" + i.id, "GET").then((result) => {
                        $('#modalViewModel').modal('show');
                        document.getElementById('modelViewNumber').innerHTML = "№ " + result.id;
                        document.getElementById('modelViewStatus').innerHTML = result.done ? "Завершена" : "В работе";

                        let reasonType = ["\"Журнал\"", "\"Служебная записка\"", "\"Иное\""];
                        document.getElementById('modelViewReason').innerHTML = reasonType[result.reason];
                        document.getElementById('modelViewReasonNumber').innerHTML =
                            result.reason === 2 ? "-" : ("\"" + result.reasonNumber + "\"");

                        if (result.note !== null) {
                            document.getElementById('ModelViewNote').innerHTML = result.note;
                        }

                        document.getElementById('modelViewInWorkDateBegin').innerHTML = "Принято в работу: " + result.interactionBegin.date;
                        document.getElementById('modelViewMemberBegin').innerHTML = result.interactionBegin.member.name;
                        document.getElementById('modelViewSubdivisionMemberBegin').innerHTML = result.interactionBegin.member.subdivision;
                        document.getElementById('modelViewDepartmentMemberBegin').innerHTML = result.interactionBegin.member.department;

                        document.getElementById('modelViewDealerBegin').innerHTML = result.interactionBegin.dealer.name;
                        document.getElementById('modelViewSubdivisionDealerBegin').innerHTML = result.interactionBegin.dealer.subdivision;
                        document.getElementById('modelViewDepartmentDealerBegin').innerHTML = result.interactionBegin.dealer.department;


                        document.getElementById('modelViewInWorkDateEnd').innerHTML = "Передано заказчику: " + result.interactionEnd.date;
                        document.getElementById('modelViewMemberEnd').innerHTML = result.interactionEnd.member.name;
                        document.getElementById('modelViewSubdivisionMemberEnd').innerHTML = result.interactionEnd.member.subdivision;
                        document.getElementById('modelViewDepartmentMemberEnd').innerHTML = result.interactionEnd.member.department;

                        document.getElementById('modelViewDealerEnd').innerHTML = result.interactionEnd.dealer.name;
                        document.getElementById('modelViewSubdivisionDealerEnd').innerHTML = result.interactionEnd.dealer.subdivision;
                        document.getElementById('modelViewDepartmentDealerEnd').innerHTML = result.interactionEnd.dealer.department;

                        document.getElementById('imageModelView').src = "data:image/jpeg;base64," + result.image;


                        $("#tableDescription").find("tr:gt(0)").remove();

                        const table = document.getElementById('tableDescription');
                        let tableBody = table.getElementsByTagName('tbody')[0];
                        for (let description of result.descriptions) {
                            let newRow = tableBody.insertRow();
                            newRow.className = "text-break";

                            let newCell = newRow.insertCell();
                            newCell.className = "text-break";
                            newCell.style = "color: var(--bs-modal-bg);";
                            newCell.innerHTML = description.device;

                            newCell = newRow.insertCell();
                            newCell.className = "text-break";
                            newCell.style = "color: var(--bs-modal-bg);";
                            newCell.innerHTML = description.serialNumber;

                            newCell = newRow.insertCell();
                            newCell.className = "text-break";
                            newCell.style = "color: var(--bs-modal-bg);";
                            newCell.innerHTML = description.inventoryNumber;

                            newCell = newRow.insertCell();
                            newCell.className = "text-break";
                            newCell.style = "color: var(--bs-modal-bg);";
                            newCell.innerHTML = description.remark;
                        }

                        // Edit
                        document.getElementById('ModelEditingNumber').innerHTML = "№ " + result.id;
                        document.getElementById("ModelEditingDeviceType").selectedIndex = result.deviceType;
                        document.getElementById('ModelEditingReason').selectedIndex = result.reason;
                        if (result.reason === 2) {
                            document.getElementById('ModelEditingReasonNumber').style.display = "none";
                            document.getElementById('ModelEditingReasonNumber').value = "";
                        } else {
                            document.getElementById('ModelEditingReasonNumber').style.display = "block";
                            document.getElementById('ModelEditingReasonNumber').value = result.reasonNumber;
                        }

                        document.getElementById('ModelEditingNameBegin').value = result.interactionBegin.dealer.name;
                        document.getElementById('ModelEditingSubdivisionBegin').value = result.interactionBegin.dealer.subdivision;
                        document.getElementById('ModelEditingDepartmentBegin').value = result.interactionBegin.dealer.department;
                        document.getElementById('ModelEditingDateBegin').value = result.interactionBegin.date;

                        if (result.notification !== null) {
                            document.getElementById('ModelEditingNotification').value = result.notification;
                        }
                        document.getElementById('ModelEditingMemberBegin').value = result.interactionBegin.member.name;

                        delAllRows();
                        for (let i = 0; i < result.descriptions.length - 1; i++) {
                            let device = document.getElementById("deviceEdit");
                            addWriteRow(device);
                        }

                        let i = 10;
                        const forms = document.getElementsByTagName("form");
                        for (let description of result.descriptions) {
                            forms[i].elements[0].value = description.device;
                            forms[i].elements[1].value = description.serialNumber;
                            forms[i].elements[2].value = description.inventoryNumber;
                            forms[i].elements[3].value = description.remark;
                            i++;
                        }

                        document.getElementById('ModelEditingNote').value = result.note;

                        if (result.done) {
                            document.getElementById('ModelEditingDealerEnd').value = result.interactionEnd.dealer.name;
                            document.getElementById('ModelEditingSubdivisionEnd').value = result.interactionEnd.dealer.subdivision;
                            document.getElementById('ModelEditingDepartmentEnd').value = result.interactionEnd.dealer.department;
                            document.getElementById('ModelEditingDateEnd').value = result.interactionEnd.dealer.date;
                            document.getElementById('ModelEditingMemberEnd').value = result.interactionEnd.member.name;
                            document.getElementById('ModelEditingDone').selectedIndex = 1;
                        } else {
                            document.getElementById('ModelEditingDealerEnd').selectedIndex = -1;
                            document.getElementById('ModelEditingSubdivisionEnd').selectedIndex = -1;
                            document.getElementById('ModelEditingDepartmentEnd').selectedIndex = -1;
                            document.getElementById('ModelEditingDateEnd').selectedIndex = -1;
                            document.getElementById('ModelEditingMemberEnd').value = -1;
                            document.getElementById('ModelEditingDone').selectedIndex = 0;
                        }
                    });
                };

                let modelDivCol = document.createElement("div");
                modelDivCol.id = i.id;
                modelDivCol.className = "col";
                let modelDivPy = document.createElement("div");
                modelDivCol.className = "py-4";
                let modelDiv = document.createElement("div");

                modelButton.appendChild(modelSpanNumber);
                modelButton.appendChild(modelImg);
                modelButton.appendChild(modelSpanDate);
                modelDivPy.appendChild(modelButton);
                modelDiv.appendChild(modelDivPy);
                modelDivCol.appendChild(modelDiv);
                modelRows.appendChild(modelDivCol);
            }
        });
});

document.getElementById('ModelEditingSave').addEventListener('click', async () => {
    const forms = document.getElementsByTagName("form");
    removeValidation();
    if (checkEditFormValidation(forms)) {
        return;
    }
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    let id = document.getElementById('modelViewNumber').innerHTML;
    id = id.substring(2, id.length);

    console.log(forms);
    let descriptionsEdit = [];
    for (let i = 10; i < forms.length - 8; i++) {
        descriptionsEdit.push(Object.fromEntries(new Map([
            ["device", forms[i].elements[0].value],
            ["serialNumber", forms[i].elements[1].value],
            ["inventoryNumber", forms[i].elements[2].value],
            ["remark", forms[i].elements[3].value]
        ])));
    }

    const dealerBegin = new Map([
        ["name", forms[4].elements[0].value],
        ["subdivision", forms[5].elements[0].value],
        ["department", forms[6].elements[0].value]
    ]);

    const memberBegin = new Map([
        ["name", forms[9].elements[0].value],
        ["subdivision", '25'],
        ["department", 'Т']
    ]);

    const interactionBegin = new Map([
        ["date", forms[7].elements[0].value],
        ["dealer", Object.fromEntries(dealerBegin)],
        ["member", Object.fromEntries(memberBegin)]
    ]);

    const dealerEnd = new Map([
        ["name", forms[forms.length - 8].elements[0].value === '' ?
            '-' : forms[forms.length - 8].elements[0].value],
        ["subdivision", forms[forms.length - 7].elements[0].value === '' ?
            '-' : forms[forms.length - 7].elements[0].value],
        ["department", forms[forms.length - 6].elements[0].value === '' ?
            '-' : forms[forms.length - 6].elements[0].value]
    ]);

    const memberEnd = new Map([
        ["name", forms[forms.length - 4].elements[0].value === '' ?
            '-' : forms[forms.length - 4].elements[0].value],
        ["subdivision", (forms[forms.length - 4].elements[0].value === '' ? '-' : '25')],
        ["department", (forms[forms.length - 4].elements[0].value === '' ? '-' : 'Т')]
    ]);

    const interactionEnd = new Map([
        ["date", forms[forms.length - 5].elements[0].value === '' ?
            null : forms[forms.length - 5].elements[0].value],
        ["dealer", Object.fromEntries(dealerEnd)],
        ["member", Object.fromEntries(memberEnd)]
    ]);

    let postRequestObj = new Map;
    postRequestObj.set("id", Number(id));
    postRequestObj.set("deviceType", forms[1].elements[0].value);
    postRequestObj.set("reason", forms[2].elements[0].value);
    postRequestObj.set("reasonNumber", forms[2].elements[0].value === '2' ? "-" : forms[3].elements[0].value);
    postRequestObj.set("notification", forms[8].elements[0].value);

    postRequestObj.set("interactionBegin", Object.fromEntries(interactionBegin));
    postRequestObj.set("interactionEnd", Object.fromEntries(interactionEnd));

    postRequestObj.set("note", forms[forms.length - 3].elements[0].value);
    postRequestObj.set("done", forms[forms.length - 2].elements[0].value !== '0');
    postRequestObj.set("descriptions", descriptionsEdit);

    // add model image
    let img = null;
    if (document.getElementById('imageFile').files.length) {
        const file = document.getElementById('imageFile').files[0];
        img = (await toBase64(file)).split(',')[1];
    }
    postRequestObj.set("image", img);

    delAllRows();
    delValuesFromForms(forms);
    $('#ModelEditing').modal('hide');
    await sendBodyRequest("/manufacture/update", 'POST', postRequestObj);
    console.log(postRequestObj);
    console.log(JSON.stringify(Object.fromEntries(postRequestObj)));
});

// TODO Add action to doc button