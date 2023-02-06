class Select {
  constructor(config = null) {
    this.selects = document.querySelectorAll('[data-select="wrapper"]');
    this.defaulOption = config.default_option || 0;
    this.closeByClickChoose = config.close_by_click_choose || false;
    this.hover = config.hover || false;
    this.clsActive = config.cls_option_active || 'active';

    if (this.selects.length === 0) {
      return false;
    }

    this.init();
  }

  init() {
    const { selects } = this;

    selects.forEach((select) => {
      this.handlers(select);

      this.setDefaultOption(select);
    });
  }

  handlers(select) {
    select.addEventListener('click', (e) => {
      const { target } = e;

      if (target.dataset.select === 'choose' && this.closeByClickChoose) {
        select.classList.toggle('active');
      } else {
        select.classList.toggle('active');
      }

      if (target.dataset.selectOption) {
        this.optionHandler(select, target);
      }
    });

    if (this.hover) {
      select.addEventListener('mouseover', () => this.switchActive(select, 1));
    }

    select.addEventListener('mouseleave', () => this.switchActive(select, 0));
  }

  switchActive(select, active = 1) {
    if (active === 1) {
      select.classList.add('active');
    } else {
      select.classList.remove('active');
    }
  }

  optionHandler(select, option) {
    if (!option.classList.contains(this.clsActive)) {
      this.updateChoose(select, option);
    }
  }

  setDefaultOption(select) {
    const defaultOption = select.querySelector(
      `[data-select-option="${this.defaulOption}"]`,
    );

    this.updateChoose(select, defaultOption);
  }

  updateChoose(select, option) {
    const choose = select.querySelector('[data-select="choose"]');
    const id = option.dataset.selectOption;

    choose.dataset.selectChooseOption = id;
    choose.innerHTML = option.textContent;

    this.switchOption(select, id);
  }

  switchOption(select, id) {
    const options = select.querySelectorAll('[data-select-option]');

    options.forEach((option) => {
      option.classList.remove(this.clsActive);
    });

    select
      .querySelector(`[data-select-option="${id}"]`)
      .classList.add(this.clsActive);
  }
}

export default Select;
