async function sendRequest(url, method) {
    return await fetch(url, {method: method})
        .then(async response => {
            if (response.ok && method !== 'DELETE') {
                return response.json();
            }
            return response.status;
        })
}

window.addEventListener("load", async () => {
    const modelRows = document.getElementById("modelRows");
    const type = document.getElementById("modelType");
    const resp = sendRequest("/manufacture/models/" + type.innerHTML, 'GET')
        .then((result) => {
            for(let i of result) {
                let modelSpan = document.createElement("span");
                modelSpan.style = "color: var(--bs-white);font-family: 'Abril Fatface', serif;font-size: 33px;";
                modelSpan.innerHTML = "Модель № " + i.id;

                let modelImg = document.createElement("img");
                modelImg.className = "rounded img-fluid border-warning fit-cover";
                modelImg.style = "height: 200px;";
                modelImg.src = "data:image/jpeg;base64," + i.image;
                modelImg.height = 200;
                modelImg.width = 431;

                let modelButton = document.createElement("button");
                modelButton.className = "btn btn-light text-center";
                modelButton.setAttribute('type', "button");
                modelButton.setAttribute('id', "modalView");
                modelButton.style = "margin-left: -1px;font-size: 41px;background: var(--bs-border-color-translucent);";
                console.log(i);
                modelButton.onclick = function() {
                    sendRequest("/manufacture/" + i.id, "GET").then((result) => {
                        $('#modalViewModel').modal('show');
                        document.getElementById('modelViewNumber').innerHTML = "№ " + result.id;

                        let reason = () => {
                            let reasonType = ["СЛУЖЕБНАЯ ЗАПИСКА", "ЖУРНАЛ", "ИНОЕ"];
                            let reasonNumber = result.reason === 2 ? "" : " № " + result.reasonNumber;
                            return reasonType[result.reason] + reasonNumber;
                        };
                        
                        document.getElementById('modelViewReason').innerHTML = reason();
                        
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
                        
                        let table = ocument.getElementById('imageModelView');
                        // TODO ADD FUNCTION TO RESOLVE DATA IN FORM
                    
                    });
                };

                let modelDivCol = document.createElement("div");
                modelDivCol.className = "col";
                let modelDivPy = document.createElement("div");
                modelDivCol.className = "py-4";
                let modelDiv = document.createElement("div");

                modelButton.appendChild(modelImg);
                modelButton.appendChild(modelSpan);
                modelDivPy.appendChild(modelButton);
                modelDiv.appendChild(modelDivPy);
                modelDivCol.appendChild(modelDiv);
                modelRows.appendChild(modelDivCol);
            }
        });
});

let singleDataForModal;









