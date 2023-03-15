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
                modelButton.onclick = function() {
                    sendRequest("/manufacture/" + i.id, "GET").then((result) => {
                        $('#modal-1').modal('show');
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









