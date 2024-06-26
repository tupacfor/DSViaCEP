import * as addressService from '../services/address-service.js';
import Address from '../models/address.js';
import * as listController from './list-controller.js'; 

export function State() {
    this.address = new Address();

    this.btnSave = null;
    this.btnClear = null;

    this.inputCep = null;
    this.inputStreet = null;
    this.inputNumber = null;
    this.inputCity - null;

    this.errorCep = null;
    this.errorNumber = null;
}

const state = new State();

export function init() {
    state.inputCep = document.forms.newAddress.cep;
    state.inputStreet = document.forms.newAddress.street;
    state.inputNumber = document.forms.newAddress.number;
    state.inputCity = document.forms.newAddress.city;

    state.btnSave = document.forms.newAddress.btnSave;
    state.btnClear = document.forms.newAddress.btnClear;

    state.errorCep = document.querySelector('[data-error="cep"]');
    state.errorNumber = document.querySelector('[data-error="number"]');

    state.inputNumber.addEventListener('change', handleInputNumberChange);
    state.inputNumber.addEventListener('keyup', handleInputNumberKeyup);

    state.btnClear.addEventListener('click', handleBtnClearClick);
    state.btnSave.addEventListener('click', handleBtnSaveClick);

    state.inputCep.addEventListener('change', handleInputCepChange);


    
   

}

function handleInputNumberKeyup(event) {
    state.address.number = event.target.value;
}


async function handleInputCepChange(event) {
    
    try {
        const cep = event.target.value.toString();
    
        const address = await addressService.findByCep(cep.replace("-", ""));

        state.inputStreet.value = address.street;
        state.inputCity.value = address.city;
        state.address = address;

        setFormError("cep", "");
        state.inputNumber.focus();
    }
    catch(e) {
        state.inputStreet.value = "";
        state.inputCity.value = "";
        setFormError("cep", "informe um CEP válido");
        
    }

    
    
}

async function handleBtnSaveClick(event) {
    event.preventDefault();

    const errors = addressService.getErrors(state.address);

    const keys = Object.keys(errors);

    if(keys.length > 0) {

        keys.forEach(x => {
        setFormError(x, errors[x]);
       
    });
    } else {
        
        listController.addCard(state.address);
        clearForm();
    
    }

    

}

function handleInputNumberChange(event) {
    if (event.target.value == "") {
        setFormError("number", "Campo Requerido");
    } else {
        setFormError("number", "");
    }
}

function handleBtnClearClick(event) {
    event.preventDefault();
    clearForm();
}

function clearForm() {
    state.inputCep.value = "";
    state.inputCity.value = ""
    state.inputNumber.value = "";
    state.inputStreet.value = "";

    setFormError("cep", "");
    setFormError("number", "");

    state.inputCep.focus();
    state.address = new Address();
}

function setFormError(key, value) {
    const element = document.querySelector(`[data-error="${key}"]`);
    element.innerHTML = value;
}