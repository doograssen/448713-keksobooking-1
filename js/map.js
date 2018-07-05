'use strict';

var ESC_KEYCODE = 27;

var AD_IMAGE_TMP = 'img/avatars/user';
var AD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var AD_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECKIN = ['12:00', '13:00', '14:00'];
var AD_CHECKOUT = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_AMOUNT = 8;
var PIN_HEIGHT = 70;
var HALF_PIN_WIDTH = 25;
var MAIN_PIN_HEIGHT = 83;
var MAIN_PIN_HALF_WIDTH = 32;
var typeMinPrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var mapElement = document.querySelector('.map');
var pinMainElement = document.querySelector('.map__pin--main');
/* -- Элементы формы -- */
var advertFormElement = document.querySelector('.ad-form');
var titleFieldElement = advertFormElement.querySelector('#title');
var typeFieldElement = advertFormElement.querySelector('#type');
var priceFieldElement = advertFormElement.querySelector('#price');
var checkinFieldElement = advertFormElement.querySelector('#timein');
var checkoutFieldElement = advertFormElement.querySelector('#timeout');
var roomsFieldElement = advertFormElement.querySelector('#room_number');
var capacityFieldElement = advertFormElement.querySelector('#capacity');
/* -- Вспомогательные функции --*/

var getRandomValue = function (max, min) {
  min = typeof min !== 'undefined' ? min : 0;
  return Math.round(Math.random() * (max - min)) + min;
};

var shuffleArray = function (arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};

/* ---   Функции для заполнения данными объекта ---- */

var getAvatar = function (index) {
  var fileName = (index < 10) ? '0' + index + '.png' : index + '.png';
  return AD_IMAGE_TMP + fileName;
};

var getTitle = function (index) {
  return AD_TITLE[index];
};

var getFeatures = function () {
  return AD_FEATURES.filter(function () {
    return (Math.random() - 0.4 > 0);
  });
};

var getLocation = function () {
  return {
    'x': getRandomValue(1200),
    'y': getRandomValue(560, 60)
  };
};

var getRandomElement = function (arr) {
  var length = arr.length - 1;
  return arr[getRandomValue(length)];
};

var getAdvert = function (index) {
  var location = getLocation();
  return {
    'author': {
      'avatar': getAvatar(index + 1),
    },
    'offer': {
      'title': getTitle(index),
      'address': location.x + ',' + location.y,
      'price': getRandomValue(1000000, 1000),
      'type': getRandomElement(AD_TYPE),
      'rooms': getRandomValue(5, 1),
      'guests': getRandomValue(10, 1),
      'checkin': getRandomElement(AD_CHECKIN),
      'checkout': getRandomElement(AD_CHECKOUT),
      'features': getFeatures(),
      'description': '',
      'photos': shuffleArray(AD_PHOTOS)
    },
    'location': location
  };
};

var getAdvertsArray = function () {
  var arr = [];
  for (var i = 0; i < AD_AMOUNT; i++) {
    arr[i] = getAdvert(i);
  }
  return arr;
};

var advertsArray = getAdvertsArray();


var templateElement = document.querySelector('template').content;
var cardTemplate = templateElement.querySelector('.map__card');
var imageTemplate = cardTemplate.querySelector('.popup__photo');
var pinTemplate = templateElement.querySelector('.map__pin');
var pinsMapElement = mapElement.querySelector('.map__pins');
var filterContainerElement = mapElement.querySelector('.map__filters-container');

/* ---- Расстановка маркеров на карте ---- */

var setPin = function (advert, index) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImageElement = pinElement.querySelector('img');
  pinElement.dataset.index = index;
  pinImageElement.src = advert.author.avatar;
  pinImageElement.alt = advert.offer.title;
  pinElement.style.left = advert.location.x - HALF_PIN_WIDTH + 'px';
  pinElement.style.top = advert.location.y + PIN_HEIGHT + 'px';

  return pinElement;
};

function fillFragment() {
  var fragment = document.createDocumentFragment();
  var length = advertsArray.length;
  for (var i = 0; i < length; i++) {
    fragment.appendChild(setPin(advertsArray[i], i));
  }

  return fragment;
}


/* --- Функции заполнения карточки объявления ---- */

var getCardType = function (type) {
  switch (type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
  }
  return '';
};

var getCardCapacity = function (rooms, guests) {
  return rooms + ' комнаты для ' + guests + ' гостей';
};

var getCardTime = function (checkin, checkout) {
  return 'Заезд после ' + checkin + ', ' + 'выезд до ' + checkout;
};

var getCardFeatures = function (parentElement, features) {
  var length = AD_FEATURES.length;
  var featureListElement = parentElement.querySelector('.popup__features');

  for (var i = 0; i < length; i++) {
    var item = AD_FEATURES[i];
    var featureElement = featureListElement.querySelector('.popup__feature--' + item);
    if (features.indexOf(item) === -1) {
      featureElement.classList.add('hidden');
    } else {
      featureElement.classList.remove('hidden');
    }
  }
};

var setImage = function (photo) {
  var imageElement = imageTemplate.cloneNode(true);
  imageElement.src = photo;

  return imageElement;
};

var getCardPhotos = function (container, photos) {
  var fragment = document.createDocumentFragment();

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  var length = photos.length;
  for (var i = 0; i < length; i++) {
    fragment.appendChild(setImage(photos[i]));
  }

  container.appendChild(fragment);
  return container;
};

/* ----- Функции взаимодействия ---- */

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  var cardElement = mapElement.querySelector('.map__card');
  cardElement.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

/* ------- */
var setCard = function (advert) {
  var cardElement = mapElement.querySelector('.map__card');
  var imageContainerElement = cardElement.querySelector('.popup__photos');
  cardElement.querySelector('.popup__avatar').src = advert.author.avatar;
  cardElement.querySelector('.popup__title').textContent = advert.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getCardType(advert.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = getCardCapacity(advert.offer.rooms, advert.offer.guests);
  cardElement.querySelector('.popup__text--time').textContent = getCardTime(advert.offer.checkin, advert.offer.checkout);
  getCardFeatures(cardElement, advert.offer.features);
  cardElement.querySelector('.popup__description').textContent = advert.offer.description;
  getCardPhotos(imageContainerElement, advert.offer.photos);
};

var onPinsMapClick = function (evt) {
  var target = evt.target;
  var index;
  var cardElement = mapElement.querySelector('.map__card');
  var closeButtonElement = cardElement.querySelector('.popup__close');
  while (target.tagName !== 'DIV') {
    if ((target.tagName === 'BUTTON') && (!target.classList.contains('map__pin--main'))) {
      index = target.dataset.index;
      setCard(advertsArray[index]);
      if (cardElement.classList.contains('hidden')) {
        cardElement.classList.remove('hidden');
        document.addEventListener('keydown', onPopupEscPress);
        closeButtonElement.addEventListener('click', closePopup);
      }
      return;
    }
    target = target.parentNode;
  }
};

/* ---- Начальное состояние ----- */

pinMainElement.addEventListener('mouseup', function (evt) {
  var advertAddressElement = advertFormElement.querySelector('#address');
  var currentElement = evt.currentTarget;
  if (mapElement.classList.contains('map--faded')) {
    mapElement.classList.remove('map--faded');
    advertFormElement.classList.remove('ad-form--disabled');
    pinsMapElement.appendChild(fillFragment());
    advertAddressElement.value = currentElement.offsetLeft + MAIN_PIN_HALF_WIDTH + ', ' + (currentElement.offsetTop + MAIN_PIN_HEIGHT);

    var cardElement = cardTemplate.cloneNode(true);
    cardElement.classList.add('hidden');
    mapElement.insertBefore(cardElement, filterContainerElement);
    pinsMapElement.addEventListener('click', onPinsMapClick);
  }
});

/* ----   Валидация формы ---- */
titleFieldElement.addEventListener('invalid', function () {
  if (titleFieldElement.validity.tooShort) {
    titleFieldElement.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
  } else if (titleFieldElement.validity.tooLong) {
    titleFieldElement.setCustomValidity('Заголовок не должен превышать 100 символов');
  } else if (titleFieldElement.validity.valueMissing) {
    titleFieldElement.setCustomValidity('Обязательное поле');
  } else {
    titleFieldElement.setCustomValidity('');
  }
});

typeFieldElement.addEventListener('change', function (evt) {
  var value = typeMinPrice[evt.target.value];
  priceFieldElement.placeholder = value;
  priceFieldElement.min = value;
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
    if (value !== 100) {
      option.disabled = (capacity > value) || (capacity === 0);
    } else {
      option.disabled = (capacity !== 0);
    }
  }
  if (capacityFieldElement.options[capacityFieldElement.selectedIndex].disabled) {
    capacityFieldElement.setCustomValidity('Не валидное значение');
  } else {
    capacityFieldElement.setCustomValidity('');
  }
};

roomsFieldElement.addEventListener('change', validateCapacity);

capacityFieldElement.addEventListener('change', function (evt) {
  evt.target.setCustomValidity('');
});

window.addEventListener('load', function () {
  var evt = new Event('change');
  roomsFieldElement.dispatchEvent(evt);
});


/* ---- Перетаскивание метки ---- */

pinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startZIndex = evt.currentTarget.style.zIndex;

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  evt.currentTarget.style.zIndex = 100;

  var dragged = false;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    pinMainElement.style.top = (pinMainElement.offsetTop - shift.y) + 'px';
    pinMainElement.style.left = (pinMainElement.offsetLeft - shift.x) + 'px';

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    /*
        if (dragged) {
          var onClickPreventDefault = function (evt) {
            evt.preventDefault();
            dialogHandler.removeEventListener('click', onClickPreventDefault);
          };
          dialogHandler.addEventListener('click', onClickPreventDefault);
        }*/

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
