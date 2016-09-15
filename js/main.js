/**
 * Created by SergST on 12.09.2016.
 */

"use strict";

var testObj = {
  topic: 'Тест по программированнию',
  data: [{
    question: 'Какой формат передачи данных наиболее распостранен?',
    answers: ['SQL', 'XML', 'TXT', 'JSON'],
    right: [4]
  }, {
    question: 'С помощью какого метода можно сохранить данные в локальное хранилище?',
    answers: ['save()', 'saveToLocalStorage()', 'setItem()', 'saveItem()'],
    right: [3]
  }, {
    question: 'Какой объект для работы с JSON файлами втроен во все современные браузеры?',
    answers: ['JSON', 'JSONParser', 'Json', 'Такого объекта нет. Необходимо' +
    ' пользоваться внешними библиотеками.'],
    right: [1]
  }, {
    question: 'Какие цвета входят в модель RGB (3 варианта)',
    answers: ['синий', 'желтый', 'зеленый', 'белый', 'черный', 'красный'],
    right: [1, 3, 6]
  }]
};

localStorage.setItem('test', JSON.stringify(testObj));

$(function () {

  try {
    var test = localStorage.getItem('test');
    test = JSON.parse(test);
  } catch (e) {
    alert('Ошибка в данных')
  }

  // объект для отображения ошибок и результатов теста
  var resultsObj = {
    msg: '',
    answersLength: 0,
    correct: 0,
    incorrect: 0,
    error: false,
    errorMsg: ''
  };

  var rightAnswers = []; // массив правильных ответов из объекта test

  function render(id, obj, parent) {
    var tmpl = _.template($(id).html());
    var result = tmpl(obj);
    $(parent).append(result);
  }

// начало теста
  function startTest() {
    reset();
    render('#test', test, '.test-wrapper');
    $('.checkRes').click(checkResults);
  }

  // заполним массив правильными ответами в формате 'номер вопроса-верный ответ'
  function getRightAnswers() {
    rightAnswers = [];
    for (var i = 0; i < test.data.length; i++) {
      var str;
      test.data[i].right.forEach(function (item) {
        str = (i + 1) + '-' + item;
        rightAnswers.push(str);
      });
    }
    resultsObj.answersLength = rightAnswers.length;
  }

  // подсчет результатов и проверки
  function checkResults() {
    getRightAnswers();
    if (checkEmptyAnswer()) {
      showModal(resultsObj);
      resultsObj.error = false;
      return
    }
    // проверим все выбранные чекбоксы на присутствие их ID в массиве
    // правильных ответов и зададим соответствующие классы
    var $userAnswers = $('input:checked');

    $userAnswers.each(function () {
      var id = $(this).attr('id');
      if (_.include(rightAnswers, id)) {
        $(this).parent().addClass('correct');
        resultsObj.correct++;
      } else {
        $(this).parent().addClass('incorrect');
        resultsObj.incorrect++;
      }
    });

    // в случае одной ошибки тест - не засчитывается
    if (resultsObj.incorrect != 0) {
      resultsObj.msg = 'Тест не пройден'
    } // в случае не полных ответов тест не засчитан
    else if ($userAnswers.length < resultsObj.answersLength) {
      resultsObj.msg = 'Тест не пройден, ответ не полный'
    } else {
      resultsObj.msg = 'Тест пройден'
    }
    showModal(resultsObj);
  }

  //проверяет все ли вопросы с ответами
  function checkEmptyAnswer() {
    var str = '';
    $('.question').each(function (index) {
      if ($(this).find('input:checked').length == 0) {
        str += (+index + 1) + '; '
      }
    });
    if (str) {
      resultsObj.error = true;
      resultsObj.errorMsg = ('Не получены ответы на вопросы ' + str);
      return true;
    }
  }

  // отображает модальное окно
  function showModal(msgObj) {
    render('#modal-result', msgObj, '.test-wrapper');
    $('.errorOK').click(removeModal);
    $('.show-results').click(function () {
      removeModal();
      showResults();
    });
    $('.start-modal').click(startTest);
  }

  function removeModal() {
    $('.overlay').remove();
  }

  function showResults() {
    $('.correct').css('background-color', 'green');
    $('.incorrect').css('background-color', 'red');
    $('.checkRes').toggle();
    $('.start').toggle();
  }

  function reset() {
    resultsObj.msg = '';
    resultsObj.answersLenght = 0;
    resultsObj.correct = 0;
    resultsObj.incorrect = 0;
    resultsObj.error = false;
    resultsObj.errorMsg = '';
    $('.test-wrapper').html('');
  }

  $('.start').click(function () {
    startTest();
    $(this).hide();
  })
});



