'use strict';

(function () {
  var advertFormElement = document.querySelector('.ad-form');
  var titleFieldElement = advertFormElement.querySelector('#title');
  var typeFieldElement = advertFormElement.querySelector('#type');
  var priceFieldElement = advertFormElement.querySelector('#price');
  var checkinFieldElement = advertFormElement.querySelector('#timein');
  var checkoutFieldElement = advertFormElement.querySelector('#timeout');
  var roomsFieldElement = advertFormElement.querySelector('#room_number');
  var capacityFieldElement = advertFormElement.querySelector('#capacity');
  // var advertAddressElement = advertFormElement.querySelector('#address');

  var typeMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

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

  typeFieldElement.addEventListener('change', function (evt) {
    var value = typeMinPrice[evt.target.value];
    priceFieldElement.placeholder = value;
    priceFieldElement.min = value;
  });

  priceFieldElement.addEventListener('invalid', function (evt) {
    addInvalidStyle(evt.target);
  });

  var validateTime = function (elem) {
    return function (evt) {
      elem.selectedIndex = evt.target.selectedIndex;
    };
  };

  checkinFieldElement.addEventListener('change', validateTime(checkoutFieldElement));

  checkoutFieldElement.addEventListener('change', validateTime(checkinFieldElement));

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
    }
  };

  roomsFieldElement.addEventListener('change', validateCapacity);

  capacityFieldElement.addEventListener('change', function (evt) {
    evt.target.setCustomValidity('');
  });


  var resetForm = function () {
    advertFormElement.reset();
  };

  advertFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(advertFormElement), resetForm, window.backend.serverError);
  });

  window.addEventListener('load', function () {
    var evt = new Event('change');
    roomsFieldElement.dispatchEvent(evt);
  });

})();
