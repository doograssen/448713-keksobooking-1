'use strict';

(function () {

  var PriceRange = {
    'middle': {
      'MIN': 10000,
      'MAX': 50000
    },
    'low': {
      'MIN': 0,
      'MAX': 10000
    },
    'high': {
      'MIN': 50000
    }
  };

  var filtersContainerElement = document.querySelector('.map__filters');
  var typeSelectElement = filtersContainerElement.querySelector('#housing-type');
  var priceSelectElement = filtersContainerElement.querySelector('#housing-price');
  var roomsSelectElement = filtersContainerElement.querySelector('#housing-rooms');
  var guestsSelectElement = filtersContainerElement.querySelector('#housing-guests');


  var simpleSelectFilter = function (elem, attr) {
    return function (item) {
      var filterValue = elem.value;
      var advertValue = String(item.offer[attr]);
      return (filterValue !== 'any') ? advertValue === filterValue : true;
    };
  };

  var guestsSelectFilter = function (item) {
    var filterValue = guestsSelectElement.value;
    var advertValue = item.offer.guests;
    return (filterValue !== 'any') ? (Number(advertValue) <= Number(filterValue)) : true;
  };

  var checkPriceFilter = function (item) {
    var advertPrice = item.offer.price;
    var filterValue = priceSelectElement.value;
    switch (filterValue) {
      case 'middle':
      case 'low':
        return (advertPrice >= PriceRange[filterValue].MIN) && (advertPrice <= PriceRange[filterValue].MAX);
      case 'high':
        return (advertPrice >= PriceRange[filterValue].MIN);
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
      return dataArray
        .filter(simpleSelectFilter(typeSelectElement, 'type'))
        .filter(checkPriceFilter)
        .filter(simpleSelectFilter(roomsSelectElement, 'rooms'))
        .filter(guestsSelectFilter)
        .filter(checkFeaturesFilter);
    }
  };
})();
