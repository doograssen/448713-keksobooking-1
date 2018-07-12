'use strict';

(function () {

  var ESC_KEY_CODE = 27; // код клавиши esc
  var listener;

  // ---- Закрытие окна по нажатию ESC --------------------------------------------------------

  function setListenerToElem(elem, func) {
    return function onPopupEscPress(evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        func(elem);
      }
    };
  }

  window.utils = {
    // ------ Показ элемента --------------------------------------------------------
    showPopup: function (elem) {
      elem.classList.remove('hidden');
      listener = setListenerToElem(elem, this.closePopup);
      document.addEventListener('keydown', listener);
    },
    // ------ Закрытие  элемента ----------------------------------------------------
    closePopup: function (elem) {
      elem.classList.add('hidden');
      document.removeEventListener('keydown', listener);
      listener = null;
    },
    // ------ Блокировка элементов ----------------------------------------------------
    setBlock: function (elements, flag) {
      var length = elements.length;
      for (var i = 0; i < length; i++) {
        elements[i].disabled = flag;
      }
    }
  };
})();
