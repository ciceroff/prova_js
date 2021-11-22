(function (DOM) {
  'use strict';
  var types = [];
  var numbers = [];
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

        ajax.send();
        ajax.addEventListener('readystatechange', this.handleGamesInfo, false);
      },

      handleGamesInfo: function handleGamesInfo() {
        if (!(this.readyState === 4 && this.status === 200)) return;
        var data = JSON.parse(this.responseText);
        types = data.types;

        app().addTypeButtons();
      },

      addTypeButtons: function addTypeButtons() {
        var $typeButtonsDiv = new DOM('[data-js="game-type-buttons"]').get()[0];
        types.forEach((element) => {
          var $button = document.createElement('button');

          $button.textContent = element.type;
          $button.setAttribute('class', 'game-type-buttons');
          $button.style.color = element.color;
          $button.style['border-color'] = element.color;
          $button.addEventListener(
            'click',
            function () {
              var $panel = new DOM('[data-js="bet-panel"]').get()[0];
              $panel.innerHTML = '';
              numbers = [];
              var $description = document.createElement('div');
              $description.setAttribute('class', 'bet-description');
              $description.innerHTML = `<strong>Fill your Bet</strong><br>${element.description}`;
              var $numbers = document.createElement('div');
              $numbers.setAttribute('class', 'bet-numbers');
              for (let index = 1; index <= element.range; index++) {
                var $betNumberButton = document.createElement('button');
                $betNumberButton.setAttribute('class', 'bet-number-button');
                $betNumberButton.setAttribute('data-js', `${index}`);
                $betNumberButton.textContent = index;
                $betNumberButton.addEventListener(
                  'click',
                  function () {
                    if (numbers.indexOf(index) !== -1)
                      return alert('You already filled this number');
                    if (element['max-number'] == numbers.length)
                      return alert(
                        'You already filled in the maximum amount of numbers',
                      );
                    numbers.push(index);
                    this.setAttribute('class', 'selected-bet-number-button');
                  },
                  false,
                );
                $numbers.appendChild($betNumberButton);
              }

              var $resultButtons = document.createElement('div');
              $resultButtons.setAttribute('class', 'result-buttons');

              var $clearButton = document.createElement('button');
              $clearButton.textContent = 'Clear game';
              $clearButton.setAttribute('class', 'clear-complete-buttons');
              $clearButton.addEventListener(
                'click',
                function () {
                  numbers.forEach((e) => {
                    var $cleanButton = new DOM(`[data-js="${e}"]`).get()[0];
                    $cleanButton.setAttribute('class', 'bet-number-button');
                  });
                  numbers = [];
                },
                false,
              );

              var $completeButton = document.createElement('button');
              $completeButton.setAttribute('class', 'clear-complete-buttons');
              $completeButton.textContent = 'Complete game';
              $completeButton.addEventListener(
                'click',
                function () {
                  while (numbers.length < element['max-number']) {
                    var number = Math.floor(Math.random() * element.range) + 1;
                    if (numbers.indexOf(number) === -1) {
                      var $selectedButton = new DOM(
                        `[data-js="${number}"]`,
                      ).get()[0];
                      $selectedButton.setAttribute(
                        'class',
                        'selected-bet-number-button',
                      );
                      numbers.push(number);
                    }
                  }
                },
                false,
              );

              var $addToCartButton = document.createElement('button');
              $addToCartButton.setAttribute('class', 'add-to-cart-button');
              $addToCartButton.innerHTML = '<p></p> Add to Cart';

              $resultButtons.appendChild($clearButton);
              $resultButtons.appendChild($completeButton);
              $resultButtons.appendChild($addToCartButton);

              $panel.appendChild($description);
              $panel.appendChild($numbers);
              $panel.appendChild($resultButtons);
            },
            false,
          );
          $typeButtonsDiv.appendChild($button);
        });
      },
    };
  }

  app().init();
})(window.DOM);
