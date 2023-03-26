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
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(data);
            a.download = name;
            a.click();
        });
}

async function sendRequest(url, method) {
    return await fetch(url, {method: method})
        .then(async response => {
            if (response.ok && method !== 'DELETE') {
                return response.json();
            }
            return response.status;
        })
}