window.addEventListener("load", async () => {
   sendRequest("/manufacture/records", 'GET')
        .then((result) => {
            document.getElementById("allEntries").innerHTML = result.all;
            document.getElementById("modelEntries").innerHTML = result.models;
            //TODO when repair is over add counter for Index.html display
            //document.getElementById("repairEntries").innerHTML = result.repair;
        });
});