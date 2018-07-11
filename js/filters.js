'use strict';

(function () {

  var filtersContainerElement = document.querySelector('.map__filters');
  var typeSelectElement = filtersContainerElement.querySelector('#housing-type');
  var priceSelectElement = filtersContainerElement.querySelector('#housing-price');
  var roomsSelectElement = filtersContainerElement.querySelector('#housing-rooms');
  var guestsSelectElement = filtersContainerElement.querySelector('#housing-guests');
  var priceRange = {
    'middle': {
      'min': 10000,
      'max': 50000
    },
    'low': {
      'min': 0,
      'max': 10000
    },
    'high': {
      'min': 50000
    }
  };

  var simpleSelectFilter = function (elem, attr) {
    return function (item) {
      var filterValue = elem.value;
      var advertValue = String(item.offer[attr]);
      return (filterValue !== 'any') ? advertValue === filterValue : true;
    };
  };

  var checkPriceFilter = function (item) {
    var advertPrice = item.offer.price;
    var filterValue = priceSelectElement.value;
    switch (filterValue) {
      case 'middle':
      case 'low':
        return (advertPrice > priceRange[filterValue].min) && (advertPrice < priceRange[filterValue].max);
      case 'high':
        return (advertPrice > priceRange[filterValue].min);
      case 'any':
        return true;
    }
    return false;
  };

  var checkFeaturesFilter = function (item) {
    var featuresElements = filtersContainerElement.querySelectorAll('.map__checkbox:checked');
    var check = true;
    for (var i = 0; i < featuresElements.length; i++) {
      if (item.offer.features.indexOf(featuresElements[i].value) === -1) {
        check = false;
        break;
      }
    }
    return check;
  };

  window.filters = {
    setFilters: function (dataArray) {
      console.log(dataArray
        .filter(simpleSelectFilter(typeSelectElement, 'type'))
        .filter(checkPriceFilter)
        .filter(simpleSelectFilter(roomsSelectElement, 'rooms'))
        .filter(simpleSelectFilter(guestsSelectElement, 'guests'))
        .filter(checkFeaturesFilter));
      return dataArray
        .filter(simpleSelectFilter(typeSelectElement, 'type'))
        .filter(checkPriceFilter)
        .filter(simpleSelectFilter(roomsSelectElement, 'rooms'))
        .filter(simpleSelectFilter(guestsSelectElement, 'guests'))
        .filter(checkFeaturesFilter);
    }
  };
})();
