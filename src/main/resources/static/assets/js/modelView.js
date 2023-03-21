async function sendRequest(url, method) {
    return await fetch(url, {method: method})
        .then(async response => {
            if (response.ok && method !== 'DELETE') {
                return response.json();
            }
            return response.status;
        })
}

document.getElementById('ModelEditingReason').addEventListener('change', function (e) {
    let number = document.getElementById('ModelEditingReasonNumber');
    number.style.display = e.target.value == 2 ? "none" : "block";
});

function addEditRows(descriptions) {
    for (let i = 0; i < descriptions.length - 1; i++) {
        let newDeviceRow = document.getElementById("deviceRowEdit").cloneNode(true);
        document.getElementById("deviceEdit").appendChild(newDeviceRow);
    }
    let rowNumbers = document.getElementsByClassName("fs-1");
    for (let i = 0; i < rowNumbers.length; i++) {
        rowNumbers[i].textContent = 1 + i;
    }
}

function removeEditRows() {
    const descriptionRows = document.getElementsByClassName("row");
    console.log(descriptionRows);
    for (let i = descriptionRows.length - 8; i > 9; i--) {
        descriptionRows[i].remove();
    }
}

window.addEventListener("load", async () => {
    const modelRows = document.getElementById("modelRows");
    const type = document.getElementById("modelType");
    const resp = sendRequest("/manufacture/models/" + type.innerHTML, 'GET')
        .then((result) => {
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

                        console.log(result);

                        let reasonType = ["\"Служебная записка\"", "\"Журнал\"", "\"Иное\""];
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
                        if (result.reason == 2) {
                            document.getElementById('ModelEditingReasonNumber').style.display = "none";
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

                        removeEditRows();
                        addEditRows(result.descriptions);

                        let i = 8;
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
    console.log("popo");
    console.log(forms);
});

