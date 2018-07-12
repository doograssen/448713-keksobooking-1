'use strict';

(function () {

  window.utils = {
    setBlock: function (elements, flag) {
      var length = elements.length;
      for (var i = 0; i < length; i++) {
        elements[i].disabled = flag;
      }
    }
  };
})();
