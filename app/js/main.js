"use strict";
class UserMenu {
  constructor() {
    this.$userMenu = document.querySelector('#userMenu');
    this.init();
  }

  init = () => {
    if (!this.$userMenu) return;
    this.$userMenuBtn = this.$userMenu.querySelector('[data-user-menu-btn]');
    this.$userMenuList = this.$userMenu.querySelector('[data-user-menu-list]');
    this.listeners();
  }


  open = () => {
    this.$userMenuList.classList.remove('user-menu__list_close');
    this.$userMenuList.dataset.userMenuList = 'open';
  }

  close = () => {
    this.$userMenuList.classList.add('user-menu__list_close');
    this.$userMenuList.dataset.userMenuList = 'close';
  }

  toggleUserMenu = () => {
    const statusMenu = this.$userMenuList.dataset.userMenuList;
    if (statusMenu === 'close') {
      this.open()
    } else {
      this.close()
    }
  }

  listeners = () => {
    this.$userMenuBtn.addEventListener('click', this.toggleUserMenu)
  }
}

class Select {
  constructor() {
    this.init();
  }

  init = () => {
    this.listeners();
  }

  open = ($content) => {
    const $list = $content.querySelector('[data-select-list]');
    const heightList = $list.getBoundingClientRect().height;
    $content.style.height = `${heightList}px`;
    $content.style.opacity = 1;
    $content.dataset.selectContent = 'open';
  }

  close = ($content) => {
    $content.style.height = '0px';
    $content.style.opacity = 0;
    $content.dataset.selectContent = 'close';
  }

  toggleList($target) {
    const $select = $target.closest('[data-select]');
    const $content = $select.querySelector('[data-select-content]');


    if ($content.dataset.selectContent === 'close') {
      this.open($content);
      return;
    }

    if ($content.dataset.selectContent === 'open') {
      this.close($content);
      return;
    }
  }

  changeTitle = ($input) => {
    const $select = $input.closest('[data-select]');
    const $content = $select.querySelector('[data-select-content]');
    const $selectTitle = $select.querySelector('[data-select-title]');
    const title = $input.dataset.name;
    $selectTitle.innerHTML = title;
    $selectTitle.classList.remove('select__title_inactive');
    this.close($content);
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-select-top]')) {
      this.toggleList(e.target);
    }
  }

  changeHandler = (e) => {
    if (e.target.closest('[data-select-input]')) {
      this.changeTitle(e.target);
    }
  }

  listeners = () => {
    document.addEventListener('click', this.clickHandler);
    document.addEventListener('change', this.changeHandler);
  }
}

const userMenu = new UserMenu();

const select = new Select()

