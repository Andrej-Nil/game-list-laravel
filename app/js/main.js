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
    this.$selects = document.querySelectorAll('[data-select]');
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

  closeAll = (e) => {
    this.$selects.forEach(($select) => {
      if ($select === e.target.closest('[data-select]')) return;
      const $content = $select.querySelector('[data-select-content]');
      this.close($content);
    });
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

  setTitle = ($input) => {
    const $select = $input.closest('[data-select]');
    const $content = $select.querySelector('[data-select-content]');
    const $selectTitle = $select.querySelector('[data-select-title]');
    $selectTitle.innerHTML = $input.dataset.name;
    $selectTitle.classList.remove('select__title_inactive');
    this.close($content);
  }

  setMultiselectTitle = ($input) => {
    const $select = $input.closest('[data-select]');
    const $selectTitle = $select.querySelector('[data-select-title]');
    const inputsArr = Array.from($select.querySelectorAll('[data-select-input]'));

    const checkedInputsArr = inputsArr.filter(($input) => {
      return $input.checked
    })
    if (checkedInputsArr.length === 1) {
      $selectTitle.innerHTML = checkedInputsArr[0].dataset.name;
    } else {
      $selectTitle.innerHTML = `Выбранно ${checkedInputsArr.length}`;
    }

    $selectTitle.classList.remove('select__title_inactive');
  }

  changeTitle = ($input) => {
    const $select = $input.closest('[data-select]');

    if ($select.dataset.select === 'multiselect') {
      this.setMultiselectTitle($input);
    } else {
      this.setTitle($input);
    }
    //const $content = $select.querySelector('[data-select-content]');
    //const $selectTitle = $select.querySelector('[data-select-title]');
    //$selectTitle.innerHTML = this.getTitle($input);
    //$selectTitle.classList.remove('select__title_inactive');
    //this.close($content);
  }

  clickHandler = (e) => {
    this.closeAll(e)
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

