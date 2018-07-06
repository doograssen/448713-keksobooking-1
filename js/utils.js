'use strict';

(function () {

  window.utils = {
    getRandomValue: function (max, min) {
      min = typeof min !== 'undefined' ? min : 0;
      return Math.round(Math.random() * (max - min)) + min;
    },
    shuffleArray: function (arr) {
      return arr.sort(function () {
        return Math.random() - 0.5;
      });
    }
  };
})();
