function viewOtherField(e, number) {
    if (e.target.value === '2') {
        number.style.display = "none";
    } else {
        number.style.display = "block";
    }
}

function addErrorField(form, inner) {
    let error = document.createElement('div');
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
            if (forms[i - 1].elements[0].value !== '2') {
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

function checkEditFormValidation(forms) {
    let errorFlag = false;
    for (let i = 1; i < forms.length - 8; i++) {
        if (i === 3 && forms[i].elements[0].value === "") {
            if (forms[i - 1].elements[0].value !== '2') {
                addErrorField(forms[i], "Заполните поле!");
                errorFlag = true;
            }
        } else if (i === 8) {
            // notification pass
        } else if (i > 9 && i < forms.length - 8) {
            if (forms[i].elements[0].value === "") {
                addErrorField(forms[i], "Заполните поле: Наименование устройства!");
                errorFlag = true;
            }
        } else if (forms[i].elements[0].value === "") {
            addErrorField(forms[i], "Заполните поле!");
            errorFlag = true;
        }
    }

    if (forms[forms.length - 2].elements[0].value !== '0') {
        for (let i = forms.length - 8; i < forms.length - 1; i++) {
            if(i === forms.length - 3) {
                // note pass
            } else if (forms[i].elements[0].value === "") {
                addErrorField(forms[i], "Заполните поле!");
                errorFlag = true;
            }
        }
        if(errorFlag) {
            addErrorField(forms[forms.length - 2], "Для завершения работы, заполните обязательные поля!");
        }
    }

    return errorFlag;
}