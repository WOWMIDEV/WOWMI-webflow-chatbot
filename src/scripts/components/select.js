import Select from '../plugins/Select';

const CONFIG_SELECT = {
  default_option: 1,
  hover: true,
  close_by_click_choose: true,
  cls_option_active: 'select__option--active',
  active_option: 1,
};
const select = new Select(CONFIG_SELECT);

export { CONFIG_SELECT };
