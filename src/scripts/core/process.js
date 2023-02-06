import SimpleChatbot from '../plugins/chatbot';
import script from '../config/script';
import configChatbot from '../config/chabot';

/* * START CHAT * */
const startChat = (trigger) => {
  const scriptId = document.querySelector('[data-chat="script"]');

  configChatbot.replicas = script(scriptId.textContent);

  if (!trigger.classList.contains('active')) {
    trigger.classList.add('active');
    configChatbot.root.classList.add('active');
  } else {
    trigger.classList.remove('active');
    configChatbot.root.classList.remove('active');
  }

  if (configChatbot.chatbot) {
    return;
  }

  configChatbot.chatbot = new SimpleChatbot(configChatbot);
  configChatbot.chatbot.init();
};

/* * BUTTONS * */
const insertButtons = () => {
  const oldBtns = document.querySelectorAll('a[class*=drift]');

  if (oldBtns.length > 0) {
    // копируем контент и классы старых кнопок drift
    // получаем родителя
    // удаляем все кнопки
    // вставляем новые кнопки в конец родительского блока
    oldBtns.forEach((oldBtn) => {
      const content = oldBtn.textContent;
      const clsList = oldBtn.classList.value;
      const parent = oldBtn.parentNode;
      const htmlBtn = `<div class="${clsList} chatbot__btn-big" data-chat="trigger-big">${content}</div>`;

      oldBtn.remove();
      parent.insertAdjacentHTML('beforeend', htmlBtn);
    });
  }

  // добавляем кнопку чата перед </body>
  const body = document.querySelector('body');
  const htmlBtn = '<div class="chatbot__btn"></div>';

  body.insertAdjacentHTML('beforeend', htmlBtn);

  return true;
};

/* * EVENTS * */
const triggerEvents = () => {
  const trigger = document.querySelector('.chatbot__btn');
  const bigTrigger = document.querySelectorAll('.chatbot__btn-big');

  bigTrigger.forEach((btn) => {
    btn.addEventListener('click', () => {
      startChat(trigger);
    });
  });

  trigger.addEventListener('click', () => {
    startChat(trigger);
  });
};

const init = async () => {
  const promise = new Promise((resolve) => {
    insertButtons();
    resolve();
  });

  await promise
    .then(() => triggerEvents());

  return true;
};

init();
