'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var TypeMinPrice = {
    'BUNGALO': 0,
    'FLAT': 1000,
    'HOUSE': 5000,
    'PALACE': 10000
  };
  var advertFormElement = document.querySelector('.ad-form');
  var addressFieldElement = advertFormElement.querySelector('#address');
  var titleFieldElement = advertFormElement.querySelector('#title');
  var typeFieldElement = advertFormElement.querySelector('#type');
  var priceFieldElement = advertFormElement.querySelector('#price');
  var checkinFieldElement = advertFormElement.querySelector('#timein');
  var checkoutFieldElement = advertFormElement.querySelector('#timeout');
  var roomsFieldElement = advertFormElement.querySelector('#room_number');
  var capacityFieldElement = advertFormElement.querySelector('#capacity');
  var fieldsetElements = advertFormElement.querySelectorAll('.ad-form__element');
  var messageElement = document.querySelector('.success');
  var featuresElement = advertFormElement.querySelector('.features');
  var resetFormElement = advertFormElement.querySelector('.ad-form__reset');

  var addInvalidStyle = function (elem) {
    if (!elem.classList.contains('invalid')) {
      elem.classList.add('invalid');
    }
  };

  var removeInvalidStyle = function (elem) {
    if (elem.classList.contains('invalid')) {
      elem.classList.remove('invalid');
    }
  };

  featuresElement.addEventListener('keypress', function (evt) {
    var currentElement = evt.target;
    if ((currentElement.tagName === 'INPUT') && (evt.keyCode === ENTER_KEYCODE)) {
      currentElement.checked = !currentElement.checked;
    }
  });

  // ---- Валидация поля ввода заголовка ----
  titleFieldElement.addEventListener('invalid', function (evt) {
    addInvalidStyle(evt.target);
    if (titleFieldElement.validity.tooShort) {
      titleFieldElement.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
    } else if (titleFieldElement.validity.tooLong) {
      titleFieldElement.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (titleFieldElement.validity.valueMissing) {
      titleFieldElement.setCustomValidity('Обязательное поле');
    } else {
      titleFieldElement.setCustomValidity('');
      removeInvalidStyle(evt.target);
    }
  });

  titleFieldElement.addEventListener('input', function (evt) {
    var target = evt.target;
    removeInvalidStyle(target);
  });

  // ---- Валидация поля ввода типа жилья ----
  typeFieldElement.addEventListener('change', function (evt) {
    var value = TypeMinPrice[evt.target.value.toUpperCase()];
    priceFieldElement.placeholder = value;
    priceFieldElement.min = value;
    removeInvalidStyle(priceFieldElement);
  });

  priceFieldElement.addEventListener('invalid', function (evt) {
    addInvalidStyle(evt.target);
  });

  priceFieldElement.addEventListener('input', function (evt) {
    removeInvalidStyle(evt.target);
  });

  // ---- Валидация поля въезда/выезда ----
  var validateTime = function (elem) {
    return function (evt) {
      elem.selectedIndex = evt.target.selectedIndex;
    };
  };

  checkinFieldElement.addEventListener('change', validateTime(checkoutFieldElement));

  checkoutFieldElement.addEventListener('change', validateTime(checkinFieldElement));

  // ----- валидация количества гостей -----
  var validateCapacity = function (evt) {
    var value = parseInt(evt.target.value, 10);
    var length = capacityFieldElement.options.length;
    var capacity;
    var option;
    for (var i = 0; i < length; i++) {
      option = capacityFieldElement.options[i];
      capacity = parseInt(option.value, 10);
      option.disabled = (value !== 100) ? (capacity > value || capacity === 0) : (capacity !== 0);
    }
    if (capacityFieldElement.options[capacityFieldElement.selectedIndex].disabled) {
      capacityFieldElement.setCustomValidity('Не валидное значение');
      addInvalidStyle(capacityFieldElement);
    } else {
      capacityFieldElement.setCustomValidity('');
      removeInvalidStyle(capacityFieldElement);
    }
  };

  roomsFieldElement.addEventListener('change', validateCapacity);

  capacityFieldElement.addEventListener('change', function (evt) {
    var target = evt.target;
    target.setCustomValidity('');
    removeInvalidStyle(target);
  });

  // ----- сброс формы -----
  var resetForm = function () {
    advertFormElement.reset();
    window.utils.setBlock(fieldsetElements, true);
    advertFormElement.classList.add('ad-form--disabled');
    var formInputElements = advertFormElement.querySelectorAll('.invalid');
    var length = formInputElements.length;
    for (var i = 0; i < length; i++) {
      removeInvalidStyle(formInputElements[i]);
    }
  };

  var setSuccessState = function () {
    resetForm();
    window.map.resetMap();
    addressFieldElement.value = window.map.fillAddress();
    window.utils.showPopup(messageElement);
  };

  advertFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(advertFormElement), setSuccessState, window.backend.serverError);
  });

  advertFormElement.addEventListener('keypress', function (evt) {
    if ((evt.target.tagName !== 'BUTTON') && (evt.keyCode === ENTER_KEYCODE)) {
      evt.preventDefault();
    }
  });

  resetFormElement.addEventListener('click', function () {
    resetForm();
    window.map.resetMap();
    addressFieldElement.value = window.map.fillAddress();
  });

  window.addEventListener('load', function () {
    var evt = new Event('change');
    roomsFieldElement.dispatchEvent(evt);
  });
})();
