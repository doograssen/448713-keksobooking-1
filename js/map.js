'use strict';

var AD_IMAGE_TMP = 'img/avatars/user0';
var AD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var AD_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECKIN = ['12:00', '13:00', '14:00'];
var AD_CHECKOUT = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_AMOUNT = 8;
var PIN_HEIGHT = 70;
var HALF_PIN_WIDTH = 25;


var getRandomValue = function (max, min) {
  min = typeof min !== 'undefined' ? min : 0;
  return Math.round(Math.random() * (max - min)) + min;
};

var shuffleArray = function (arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};


var getAvatar = function (index) {
  return AD_IMAGE_TMP + index + '.png';
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


var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');


var templateElement = document.querySelector('template').content;
var cardTemplate = templateElement.querySelector('.map__card');
var imageTemplate = cardTemplate.querySelector('.popup__photo');
var pinTemplate = templateElement.querySelector('.map__pin');

var pinsMapElement = mapElement.querySelector('.map__pins');
var filterContainerElement = mapElement.querySelector('.map__filters-container');

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

pinsMapElement.appendChild(fillFragment());


var getCardType = function (type) {
  switch (type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
  }
  return false;
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
    if (features.indexOf(item) === -1) {
      var featureElement = featureListElement.querySelector('.popup__feature--' + item);
      featureListElement.removeChild(featureElement);
    }
  }
};

var image = function (photo) {
  var imageElement = imageTemplate.cloneNode(true);
  imageElement.src = photo;

  return imageElement;
};

var getCardPhotos = function (container, photos) {
  var fragment = document.createDocumentFragment();
  container.removeChild(container.querySelector('.popup__photo'));

  var length = photos.length;
  for (var i = 0; i < length; i++) {
    fragment.appendChild(image(photos[i]));
  }

  container.appendChild(fragment);
  return container;
};

var setCard = function (advert) {
  var cardElement = cardTemplate.cloneNode(true);
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
  return cardElement;
};

mapElement.insertBefore(setCard(advertsArray[0]), filterContainerElement);
