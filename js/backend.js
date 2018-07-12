
'use strict';

(function () {

  var STATUS_OK = 200;
  var DELAY = 10000;
  var ESC_KEY_CODE = 27;
  var sendURL = 'https://js.dump.academy/keksobooking';
  var dataURL = 'https://js.dump.academy/keksobooking/data';

  var createMessageBlock = function (container, message) {
    var messageBlock = document.createElement('div');
    var messageText = document.createElement('p');
    var closeBtn = document.createElement('button');
    closeBtn.classList.add('popup__close');
    messageBlock.appendChild(closeBtn);
    messageBlock.appendChild(messageText);
    messageBlock.classList.add('error__message');
    messageText.textContent = message;
    container.insertAdjacentElement('afterbegin', messageBlock);

    var onMessageEscPress = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        closeMessage(messageBlock);
      }
    };

    var closeMessage = function () {
      document.body.removeChild(messageBlock);
      document.removeEventListener('keydown', onMessageEscPress);
    };

    closeBtn.addEventListener('click', function () {
      closeMessage(messageBlock);
    });
    document.addEventListener('keydown', onMessageEscPress);
  };
  /* --------------функция  с общими данными для создания запроса --------------*/
  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = DELAY; // 10s
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) { // Загрузка данных
      var xhr = setupXHR(onLoad, onError);
      xhr.open('GET', dataURL);
      xhr.send();
    },
    save: function (data, onLoad, onError) { // отпрвка данных
      var xhr = setupXHR(onLoad, onError);

      xhr.open('POST', sendURL);
      xhr.send(data);
    },
    serverError: function (errorMessage) { // функция обратного вызова возникновения ошибки  при выполнении запроса
      createMessageBlock(document.body, errorMessage);
    }
  };
})();
