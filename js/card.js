'use strict';

(function () {

  var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var mapElement = document.querySelector('.map');
  var templateElement = document.querySelector('template').content;
  var cardTemplate = templateElement.querySelector('.map__card');
  var imageTemplate = templateElement.querySelector('.popup__photo');
  var filterContainerElement = mapElement.querySelector('.map__filters-container');

  var getCardType = function (type) {
    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
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

  window.card = {
    setCard: function (advert) {
      var cardElement = mapElement.querySelector('.map__card');
      var closeButtonElement = cardElement.querySelector('.popup__close');
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
      window.utils.showPopup(cardElement);
      closeButtonElement.addEventListener('click', function () {
        window.utils.closePopup(cardElement);
      });
    },
    cloneCard: function () {
      var cardElement = cardTemplate.cloneNode(true);
      cardElement.classList.add('hidden');
      mapElement.insertBefore(cardElement, filterContainerElement);
    }
  };

})();
