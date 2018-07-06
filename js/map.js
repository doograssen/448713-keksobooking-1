'use strict';

var MAIN_PIN_HEIGHT = 83;
var MAIN_PIN_HALF_WIDTH = 32;
var TOP_BOUNDARY = 130;
var BOTTOM_BOUNDARY = 630;


var mapElement = document.querySelector('.map');
var pinMainElement = document.querySelector('.map__pin--main');
var advertFormElement = document.querySelector('.ad-form');
var advertAddressElement = advertFormElement.querySelector('#address');

var pinsMapElement = mapElement.querySelector('.map__pins');

var onPinsMapClick = function (evt) {
  var target = evt.target;
  var index;

  while (target.tagName !== 'DIV') {
    if ((target.tagName === 'BUTTON') && (!target.classList.contains('map__pin--main'))) {
      index = target.dataset.index;
      window.card.setCard(window.data.advertsArray[index]);
      return;
    }
    target = target.parentNode;
  }
};

/* ---- Начальное состояние ----- */

pinMainElement.addEventListener('mouseup', function (evt) {
  var currentElement = evt.currentTarget;
  if (mapElement.classList.contains('map--faded')) {
    mapElement.classList.remove('map--faded');
    advertFormElement.classList.remove('ad-form--disabled');
    window.pin.drawPinElements(pinsMapElement);
    advertAddressElement.value = currentElement.offsetLeft + MAIN_PIN_HALF_WIDTH + ', ' + (currentElement.offsetTop + MAIN_PIN_HEIGHT);
    window.card.cloneCard();
    pinsMapElement.addEventListener('click', onPinsMapClick);
  }
});

/* ---- Перетаскивание метки ---- */


var getPinXCoordinate = function () {
  return pinMainElement.offsetLeft + MAIN_PIN_HALF_WIDTH;
};

var checkPinXCoordinate = function (max, shift) {
  var x = getPinXCoordinate() - shift;
  return (x >= 0) && (x <= max);
};

var checkCursorXCoordinate = function (x, min, max) {
  return (x >= min) && (x <= max);
};

var setPinXCoordinate = function (x, shift, min, max) {
  if (checkPinXCoordinate(max, shift) && checkCursorXCoordinate(x, min, min + max)) {
    pinMainElement.style.left = (pinMainElement.offsetLeft - shift) + 'px';
  } else if (x < min) {
    pinMainElement.style.left = -MAIN_PIN_HALF_WIDTH + 'px';
  } else if (x > min + max) {
    pinMainElement.style.left = max - MAIN_PIN_HALF_WIDTH + 'px';
  }
};


var getPinYCoordinate = function () {
  return pinMainElement.offsetTop + MAIN_PIN_HEIGHT;
};

var checkPinYCoordinate = function (min, max, shift) {
  var y = getPinYCoordinate() - shift;
  return (y >= min) && (y <= max);
};

var checkCursorYCoordinate = function (y, min, max) {
  return (y >= min) && (y <= max);
};

var setPinYCoordinate = function (y, shift) {
  if (checkPinYCoordinate(TOP_BOUNDARY, BOTTOM_BOUNDARY, shift) && checkCursorYCoordinate(y, TOP_BOUNDARY - MAIN_PIN_HEIGHT, BOTTOM_BOUNDARY)) {
    pinMainElement.style.top = (pinMainElement.offsetTop - shift) + 'px';
  } else if (y < TOP_BOUNDARY - MAIN_PIN_HEIGHT) {
    pinMainElement.style.top = TOP_BOUNDARY - MAIN_PIN_HEIGHT + 'px';
  } else if (y > BOTTOM_BOUNDARY) {
    pinMainElement.style.top = BOTTOM_BOUNDARY - MAIN_PIN_HEIGHT + 'px';
  }
};
pinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var leftBoundary = mapElement.offsetLeft;
  var mapWidth = mapElement.clientWidth;

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    setPinYCoordinate(startCoords.y, shift.y);
    setPinXCoordinate(startCoords.x, shift.x, leftBoundary, mapWidth);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    advertAddressElement.value = getPinXCoordinate(upEvt.currentTarget) + ', ' + getPinYCoordinate(upEvt.currentTarget);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
