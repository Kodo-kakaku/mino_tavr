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

window.addEventListener("load", async () => {
   sendRequest("/manufacture/records", 'GET')
        .then((result) => {
            const all = document.getElementById("IndexAllDone");
            const making = document.getElementById("IndexMakingDone");
            all.innerHTML = result.all;
            making.innerHTML = result.models;
            //TODO when repair is over add counter for Index.html display
            //const repair = document.getElementById("");
            //repair.innerHTML = result.repair;
        });
});