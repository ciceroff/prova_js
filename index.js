(function (DOM) {
  'use strict';
  var types = [];
  var numbers = [];
  var cartTotal = 0;
  var formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

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
              var $newBet = new DOM('[data-js="new-bet"]').get()[0];
              $newBet.innerHTML = `<strong>NEW BET</strong> FOR ${element.type.toUpperCase()}`;
              $newBet.style['color'] = '#707070';
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

              // ------------------------------------------------- CLEAR GAME
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
              // ------------------------------------------------- COMPLETE GAME
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

              // ------------------------------------------------- ADD TO CART
              var $addToCartButton = document.createElement('button');
              $addToCartButton.setAttribute('id', 'add-to-cart');
              $addToCartButton.setAttribute('class', 'material-icons');
              $addToCartButton.innerHTML =
                '<i class="material-icons" >shopping_cart</i> Add to cart';
              $addToCartButton.addEventListener(
                'click',
                function () {
                  if (numbers.length < element['max-number'])
                    return alert(
                      `Fill all the ${element['max-number']} numbers`,
                    );
                  var $cartBets = new DOM('[data-js="cart-bets"]').get()[0];
                  var $betDiv = document.createElement('div');
                  var $betDescriptionDiv = document.createElement('div');
                  var $typeGameDescription = document.createElement('div');
                  var $trashButton = document.createElement('button');
                  var $betPrice = document.createElement('p');
                  var $betType = document.createElement('span');

                  $cartBets.setAttribute('class', 'cart-bets');

                  $betDescriptionDiv.setAttribute(
                    'class',
                    'bet-description-cart',
                  );
                  $betDescriptionDiv.style['borderColor'] = element.color;

                  $typeGameDescription.setAttribute('class', 'bet-game-type');
                  $betDiv.setAttribute('class', 'bet');

                  $trashButton.setAttribute('class', 'trash-button');
                  $trashButton.innerHTML =
                    '<i class="material-icons">delete</i>';
                  // ------------------- DELETE BET
                  $trashButton.addEventListener(
                    'click',
                    function () {
                      $cartBets.removeChild(this.parentElement);
                      cartTotal -= element.price;
                      var $cartTotal = new DOM(
                        '[data-js="cart-total"]',
                      ).get()[0];
                      cartTotal > 0
                        ? ($cartTotal.innerHTML = `<strong>CART</strong> TOTAL: ${formatter.format(
                            cartTotal,
                          )}`)
                        : ($cartTotal.innerHTML =
                            '<strong>CART EMPTY</strong>');
                      console.log(cartTotal);
                    },
                    false,
                  );

                  $betDiv.appendChild($trashButton);
                  var x = numbers
                    .sort((a, b) => {
                      return a - b;
                    })
                    .toString();
                  var $p = document.createElement('p');
                  $p.style['overflow-wrap'] = 'break-word';
                  $p.style['maxInlineSize'] = '200px';
                  $betPrice.textContent = `${formatter.format(element.price)}`;
                  $betType.textContent = element.type;
                  $betType.style['color'] = element.color;
                  $betType.style['marginRight'] = '10px';

                  $p.innerHTML = x;

                  $typeGameDescription.appendChild($betType);
                  $typeGameDescription.appendChild($betPrice);
                  $betDescriptionDiv.appendChild($p);
                  $betDescriptionDiv.appendChild($typeGameDescription);

                  $betDiv.appendChild($betDescriptionDiv);
                  $cartBets.appendChild($betDiv);

                  numbers.forEach((e) => {
                    var $cleanButton = new DOM(`[data-js="${e}"]`).get()[0];
                    $cleanButton.setAttribute('class', 'bet-number-button');
                  });
                  numbers = [];
                  cartTotal += element.price;
                  var $cartTotal = new DOM('[data-js="cart-total"]').get()[0];

                  cartTotal > 0
                    ? ($cartTotal.innerHTML = `<strong>CART</strong> TOTAL: ${formatter.format(
                        cartTotal,
                      )}`)
                    : ($cartTotal.innerHTML = '<strong>CART EMPTY</strong>');
                  console.log(cartTotal);
                },
                // --------------------------------------------------------
                false,
              );
              var $completeClearButtonDiv = document.createElement('div');
              $completeClearButtonDiv.appendChild($completeButton);
              $completeClearButtonDiv.appendChild($clearButton);

              $resultButtons.appendChild($completeClearButtonDiv);
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
