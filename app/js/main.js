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

const userMenu = new UserMenu();

