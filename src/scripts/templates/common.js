const common = (
  type,
  state,
  content,
  name,
  time,
) => `<div class="chatbot__item chatbot__item_${type}">
            <div class="chatbot__content chatbot__content_${type}${state}">
             ${content} 
            </div>
            <div class="chatbot__info">
                <span class="chatbot__name">${name}</span>
                <span class="chatbot__time">${time}</span>
            </div>
           </div>`;

export default common;
