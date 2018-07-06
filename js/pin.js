'use strict';

(function () {
  var PIN_HEIGHT = 70;
  var HALF_PIN_WIDTH = 25;

  var templateElement = document.querySelector('template').content;
  var pinTemplate = templateElement.querySelector('.map__pin');

  window.pin = {
    setPin: function (advert, index) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinImageElement = pinElement.querySelector('img');
      pinElement.dataset.index = index;
      pinImageElement.src = advert.author.avatar;
      pinImageElement.alt = advert.offer.title;
      pinElement.style.left = advert.location.x - HALF_PIN_WIDTH + 'px';
      pinElement.style.top = advert.location.y - PIN_HEIGHT + 'px';

      return pinElement;
    }
  };
})();
