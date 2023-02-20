const chatTemplate = (name) => `<div class="chatbot__title">
              <span class="chatbot__name">${name}</span>
              <span class="chatbot__reset">↺</span>
              <span class="chatbot__close">&times;</span>
          </div>
          <div class="chatbot__wrapper">
            <div class="chatbot__items"></div>
          </div>
          <div class="chatbot__footer">
            <input class="chatbot__input" type="text" disabled placeholder="Reply to Geneva">
            <button class="chatbot__submit" type="button" disabled></button>
          </div>`;

export default chatTemplate;
