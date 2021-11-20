(function (DOM) {
  'use strict';
  var types = [];
  function app() {
    return {
      init: function () {
        this.getGamesInfo();
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
      },

      getGamesInfo: function getGamesInfo() {
        var ajax = new XMLHttpRequest();

        ajax.open('GET', './games.json', true);
        console.log(ajax);
        ajax.send();
        ajax.addEventListener('readystatechange', this.handleGamesInfo, false);
      },

      handleGamesInfo: function handleGamesInfo() {
        if (!(this.readyState === 4 && this.status === 200)) return;
        var data = JSON.parse(this.responseText);
        types = data.types;
        console.log(types.length);
        app().addTypeButtons();
      },

      addTypeButtons: function addTypeButtons() {
        var $typeButtonsDiv = new DOM('[data-js="game-type-buttons"]').get()[0];
        types.forEach((element) => {
          console.log(element.type);
          var $button = document.createElement('button');
          $button.textContent = element.type;
          $button.setAttribute('class', 'game-type-buttons');
          $button.style.color = element.color;
          $button.style['border-color'] = element.color;
          console.log($typeButtonsDiv);
          $typeButtonsDiv.appendChild($button);
        });
      },
    };
  }

  app().init();
})(window.DOM);
