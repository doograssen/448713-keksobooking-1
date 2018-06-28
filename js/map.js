'use strict';

var AD_IMAGE_TMP = 'img/avatars/user0';
var AD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var AD_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECKIN = ['12:00', '13:00', '14:00'];
var AD_CHECKOUT = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_AMOUNT = 8;

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
    'y': getRandomValue(630, 130)
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
      'avatar': getAvatar(index),
    },
    'offer': {
      'title': getTitle(index),
      'address': location.x + ',' + location.y,
      'price': getRandomValue(1000000, 1000),
      'type': getRandomValue(AD_TYPE),
      'rooms': getRandomValue(5, 1),
      'guests': getRandomValue(10, 1),
      'checkin': getRandomElement(AD_CHECKIN),
      'checkout': getRandomElement(AD_CHECKOUT),
      'features': getFeatures(),
      'description': '',
      'photos': shuffleArray(AD_PHOTOS)
    },
    'location': location,
  };
};

var getAdvertsArray = function () {
  var arr = [];
  for (var i = 0; i < AD_AMOUNT; i++) {
    arr[i] = getAdvert(i);
  }
  return arr;
};

document.querySelector('.map').classList.remove('map--faded');

var advertsArray = getAdvertsArray();


