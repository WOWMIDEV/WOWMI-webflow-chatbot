import chatTemplate from '../templates/chat';
import contentTemplate from '../templates/content';
import buttonTemplate from '../templates/button';
import commonTemplate from '../templates/common';
import chatName from '../config/chatName';
import timeDate from '../helpers/timeDate';
import time from '../helpers/time';

// полифилл для matches
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}
// полифилл для closest
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

/*
  btn - селектор для выбора кнопки
  key - ключ для хранения отпечатка браузера
  replicas - реплики чат-бота
  root - корневой элемент
  url - URL chatbot.php
*/
function SimpleChatbot(config) {
  if (config.root) {
    this._$root = config.root;
  } else {
    throw 'SimpleChatbot: ключ root должен присутствовать в передаваемых данных';
  }
  if (config.replicas) {
    this._replicas = config.replicas;
  } else {
    throw 'SimpleChatbot: ключ replicas должен присутствовать в передаваемых данных';
  }
  this._url = config.url ? config.url : '';
  this._key = config.key ? config.key : 'fingerprint';
  this._delay = 1000; // 500
  // индекс текущей реплики bot
  this._botIndex = 0;

  this._contentIndex = 1;
  this._start = true;
  // переменные чат-бота
  this._params = {};
  this._active = false;
  this._scriptId = this._replicas.id;
  this._addEventListener();
}

// init
SimpleChatbot.prototype.init = function () {
  if (this._active) {
    return;
  }
  this._active = true;
  const replicasJson = localStorage.getItem('chatbot');

  if (replicasJson) {
    const replicas = JSON.parse(replicasJson);
    // получим переменные чат-бота из LocalStorage
    this._params = replicas.params;
    // установим индекс текущей реплики бота
    this._botIndex = replicas.botIndex;

    // формируем html из реплик LocalStorage
    const html = [];
    let i = 0;
    while (i < replicas.data.length) {
      html.push(SimpleChatbot.templateItem(replicas.data[i]));
      i++;
    }
    const $container = this._$root.querySelector('.chatbot__items');
    $container.insertAdjacentHTML('beforeend', html.join(''));

    this._outputContent(0);
  } else {
    this._outputContent(this._delay);
  }
};

SimpleChatbot.prototype.reset = function () {
  SimpleChatbot.resetTemplate();
  this._botIndex = 0;
  this._contentIndex = 1;
  this._start = true;
  this._params = {};
  this._active = false;
  localStorage.removeItem('chatbot');
  this.init();
};

// общий шаблон
SimpleChatbot.prototype._template = function (type, content, state) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return commonTemplate(type, state, content, chatName(), time());
};

// шаблон кнопки
SimpleChatbot.prototype._templateBtn = function (botIndex, content) {
  return buttonTemplate(botIndex, content);
};

// получить данные
SimpleChatbot.prototype._getData = function (target, id) {
  const chatObj = this._replicas[target];

  return chatObj[id] ? chatObj[id.toString()] : true;
};

// вывод контента
SimpleChatbot.prototype._outputContent = function (interval) {
  const botData = this._getData('bot', this._botIndex);
  const humanIds = botData.human;
  const $container = this._$root.querySelector('.chatbot__items');
  let botContent = botData.content;

  if (Array.isArray(botContent)) {
    for (var i = 0, { length } = botContent; i < length; i++) {
      if (botContent[i].indexOf('{{') !== -1) {
        for (const key in this._params) {
          botContent[i] = botContent[i]
            .split('{{'.concat(key, '}}'))
            .join(this._params[key]);
        }
      }
    }
  } else if (botContent.indexOf('{{') !== -1) {
    for (const key in this._params) {
      botContent = botContent
        .split('{{'.concat(key, '}}'))
        .join(this._params[key]);
    }
  }

  const _this = this;
  const fn2 = function () {
    if (_this._getData('human', humanIds[0]).content === '') {
      _this._$root.querySelector('.chatbot__input').disabled = false;
      _this._$root.querySelector('.chatbot__input').dataset.name = _this._getData('human', humanIds[0]).name;
      _this._$root.querySelector('.chatbot__submit').disabled = true;
      _this._$root.querySelector('.chatbot__input').focus();
      _this._$root.querySelector('.chatbot__submit').dataset.botIndex = _this._getData('human', humanIds[0]).bot;
    } else {
      _this._$root.querySelector('.chatbot__input').value = '';
      _this._$root.querySelector('.chatbot__input').disabled = true;
      _this._$root.querySelector('.chatbot__submit').disabled = true;
      const $humanContent = humanIds.map((id) => {
        const humanData = _this._getData('human', id);
        return _this._templateBtn(humanData.bot, humanData.content);
      });
      const $humanContentWrapper = _this._template(
        'human',
        $humanContent.join(''),
      );
      $container.insertAdjacentHTML('beforeend', $humanContentWrapper);
      $container.scrollTop = $container.scrollHeight;
    }
  };
  if (interval) {
    let times = 1;
    if (Array.isArray(botContent)) {
      for (var i = 0, { length } = botContent; i < length; i++) {
        const $botContent = this._template('bot', botContent[i]);
        window.setTimeout(() => {
          $container.insertAdjacentHTML('beforeend', $botContent);
          $container.scrollTop = $container.scrollHeight;
        }, interval * times);
        times++;
      }
    } else {
      const $botContent = this._template('bot', botContent);
      window.setTimeout(() => {
        $container.insertAdjacentHTML('beforeend', $botContent);
        $container.scrollTop = $container.scrollHeight;
      }, interval * times);
      times++;
    }
    window.setTimeout(() => {
      fn2();
    }, interval * times);
  } else {
    if (Array.isArray(botContent)) {
      for (var i = 0, { length } = botContent; i < length; i++) {
        const $botContent = this._template('bot', botContent[i]);
        $container.insertAdjacentHTML('beforeend', $botContent);
        $container.scrollTop = $container.scrollHeight;
      }
    } else {
      const $botContent = this._template('bot', botContent);
      $container.insertAdjacentHTML('beforeend', $botContent);
      $container.scrollTop = $container.scrollHeight;
    }
    if (humanIds.length > 0) {
      fn2();
    }
  }
};

// перевод ответа пользователя в неактивный
SimpleChatbot.prototype._humanResponseToDisabled = function ($target) {
  const $container = $target.closest('.chatbot__content_human');
  const content = $target.innerHTML;
  $container.innerHTML = content;
  $container.classList.remove('chatbot__content_human');
  $container.classList.add('chatbot__content_human-disabled');
  return content;
};

SimpleChatbot.prototype._addToChatHumanResponse = function (humanContent) {
  const $container = this._$root.querySelector('.chatbot__items');
  const $humanContent = this._template('human', humanContent, '-disabled');
  $container.insertAdjacentHTML('beforeend', $humanContent);
  $container.scrollTop = $container.scrollHeight;
};

// функция для обработки события click
SimpleChatbot.prototype._eventHandlerClick = function (e) {
  const $target = e.target;
  const { botIndex } = $target.dataset;
  const url = this._url;
  const data = {};
  let humanContent = '';
  let humanField = '';

  /*
    CUSTOM
    очищает поле ввода сообщения после отправки
   */
  if ($target.classList.contains('chatbot__submit')) {
    setTimeout(() => {
      this._$root.querySelector('.chatbot__input').value = '';
    }, 500);
  }

  if ($target.closest('.chatbot__submit')) {
    if ($target.closest('.chatbot__submit').disabled) {
      return;
    }
    $target.closest('.chatbot__submit').disabled = true;
    if (!this._$root.querySelector('.chatbot__input').value.length) {
      return;
    }
    this._botIndex = +$target.closest('.chatbot__submit').dataset.botIndex;
    humanContent = this._$root.querySelector('.chatbot__input').value;
    humanField = this._$root.querySelector('.chatbot__input').dataset.name;
    if (humanField) {
      this._params[humanField] = humanContent;
    }
    this._addToChatHumanResponse(humanContent);
    this._outputContent(this._delay);
  } else if (botIndex) {
    this._botIndex = +botIndex;
    // переводим ответ пользователя в неактивный
    humanContent = this._humanResponseToDisabled($target);
    // выводим следующий контент
    this._outputContent(this._delay);
  } else if ($target.classList.contains('chatbot__close')) {
    $target.closest('.chatbot').classList.remove('active');
    $target.closest('.chatbot').classList.add('inactive');
    document.querySelector('.chatbot__btn').classList.remove('active');
    return;
  } else if ($target.classList.contains('chatbot__reset')) {
    this.reset();
    return;
  } else {
    return;
  }
  e.preventDefault();
  // получаем последние сообщения бота
  const _this = this;
  const $botWrapper = document.querySelectorAll('.chatbot__item_bot');
  const $botWrapperLast = $botWrapper[$botWrapper.length - 1];
  let $prev = $botWrapperLast;
  let $first = $prev;
  while ($prev) {
    if (!$prev.classList.contains('chatbot__item_bot')) {
      break;
    }
    $first = $prev;
    $prev = $prev.previousElementSibling;
  }
  let $botContent = $first;
  while ($botContent) {
    if (!$botContent.classList.contains('chatbot__item_bot')) {
      break;
    }
    const $botItems = $botContent.querySelectorAll('.chatbot__content');
    for (let i = 0, { length } = $botItems; i < length; i++) {
      data[_this._contentIndex] = {
        type: 'bot',
        content: $botItems[i].innerHTML,
      };
      _this._contentIndex++;
    }
    $botContent = $botContent.nextElementSibling;
  }
  data[this._contentIndex] = {
    type: 'human',
    content: humanContent,
  };
  this._contentIndex++;

  const fromStorage = localStorage.getItem('chatbot');
  let dataToStorage = [];
  let paramsJSON = {};
  if (fromStorage) {
    dataToStorage = JSON.parse(fromStorage).data;
    paramsJSON = JSON.parse(fromStorage).params;
  }
  for (const key in data) {
    dataToStorage.push({
      type: data[key].type,
      content: data[key].content,
    });
  }
  if (humanField) {
    paramsJSON[humanField] = humanContent;
  }
  const dataToStorageJSON = JSON.stringify({
    botIndex: this._botIndex,
    data: dataToStorage,
    params: paramsJSON,
  });
  localStorage.setItem('chatbot', dataToStorageJSON);

  // данные для отправки
  const dataSend = JSON.stringify({
    id: localStorage.getItem(this._key),
    chat: data,
    start: this._start,
    date: timeDate(),
  });

  this._start = false;

  // отправляем данные на сервер
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 0 || request.readyState === 4) {
      if (request.status == 200) {
        // console.log(JSON.parse(request.responseText));
      } else {
        // console.log('error');
      }
    }
  };
  /*
    Если в конфиге `config.url` не указан урл для сохранения переписки чата,
    то сохранение не будет происходить
    Переписка сохранялась через в скрипте chatbot.js
   */
  if (url !== '') {
    request.open('POST', url);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(dataSend);
  }
};

// функция для обработки события change
SimpleChatbot.prototype._eventHandlerKeydown = function (e) {
  const $target = e.target;
  if (!$target.classList.contains('chatbot__input')) {
    return;
  }
  const btnSubmit = this._$root.querySelector('.chatbot__submit');
  if ($target.value.length > 0) {
    btnSubmit.disabled = false;
  } else {
    btnSubmit.disabled = true;
  }
};

// подключение обработчиков событий
SimpleChatbot.prototype._addEventListener = function () {
  this._$root.addEventListener('click', this._eventHandlerClick.bind(this));
  this._$root.addEventListener('input', this._eventHandlerKeydown.bind(this));
  this._$root.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('chatbot__input')) {
      const $submit = e.target
        .closest('.chatbot')
        .querySelector('.chatbot__submit');
      $submit.click();
    }
  });
};

// шаблон chatbot__item
SimpleChatbot.templateItem = function (replicas) {
  let html = contentTemplate();
  html = html.replace('{{type}}', replicas.type);
  html = html.replace('{{type}}', replicas.type);
  html = html.replace('{{state}}', replicas.type === 'bot' ? '' : '-disabled');
  html = html.replace('{{content}}', replicas.content);

  if (replicas.type === 'bot') {
    html = html.replace('{{name}}', chatName());
  } else {
    html = html.replace('{{name}}', '');
  }

  html = html.replace('{{time}}', time());

  return html;
};

// сброс основного шаблона
SimpleChatbot.resetTemplate = function () {
  const $root = document.querySelector('.chatbot');

  if (!$root) {
    return;
  }

  $root.innerHTML = chatTemplate(chatName());
};

// основной шаблон чат-бота
SimpleChatbot.createTemplate = function () {
  const $root = document.querySelector('.chatbot');

  if ($root) {
    return $root;
  }

  const $fragment = document.createElement('div');

  $fragment.className = 'chatbot';
  $fragment.innerHTML = chatTemplate(chatName());

  document.body.appendChild($fragment);

  return document.querySelector('.chatbot');
};

export default SimpleChatbot;
