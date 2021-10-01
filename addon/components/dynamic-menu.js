import { isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import { debounce, scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import $ from 'cash-dom';
import layout from '../templates/components/dynamic-menu';
import { findItemsToHide } from '../utils/dynamic-menu-util';

function getScrollBarWidth() {
  var $outer = $('<div>')
      .css({
        visibility: 'hidden',
        width: 100,
        overflow: 'scroll',
      })
      .appendTo('body'),
    widthWithScroll = $('<div>')
      .css({
        width: '100%',
      })
      .appendTo($outer)
      .outerWidth();
  $outer.remove();
  return 100 - widthWithScroll;
}

export default Component.extend({
  layout,

  classNameBindings: ['isPositionBottom:bottom-position:top-position'],
  classNames: ['dynamic-menu'],

  dropdownVisible: false,
  dropdownButtonWidth: 50, //in pixels
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  hiddenItems: [],
  position: 'bottom', //top/bottom
  enableAutoSpacing: true,
  dropdownTitle: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('scrollbarWidth', getScrollBarWidth());

    $(window).on('resize', () => {
      debounce(this, this.hideItems, 200);
    });

    this.hideDropdownMenu();
    this.hideItems();
  },

  dropdownVisibleObserver: observer('dropdownVisible', function () {
    if (this.get('dropdownVisible')) {
      this.showDropdownMenu();
    } else {
      this.hideDropdownMenu();
    }
  }),

  isPositionBottom: computed('position', function () {
    return this.get('position') === 'bottom';
  }),

  hideDropdownMenu() {
    let $dropdown = $('.dynamic-dropdown');
    if (this.get('isPositionBottom')) {
      $dropdown.css(
        'bottom',
        `${
          $(this.element).height() -
          $(this.element).find('.dynamic-menu-container').height()
        }px`
      );
    } else {
      $dropdown.css(
        'top',
        `-${$(this.element).find('.dynamic-menu-container').height()}px`
      );
    }
  },

  showDropdownMenu() {
    let $dropdown = $('.dynamic-dropdown');
    if (this.get('isPositionBottom')) {
      $dropdown
        .css(
          'bottom',
          `${$(this.element).find('.dynamic-menu-container').height()}px`
        )
        .removeClass('hidden');
    } else {
      $dropdown
        .css(
          'top',
          `${$(this.element).find('.dynamic-menu-container').height()}px`
        )
        .removeClass('hidden');
    }
  },

  hideItems: function () {
    let $container = $(this.element).find('.dynamic-menu-container');
    $container.css('overflow-x', 'scroll');

    let allItems = $(this.element).find('.dynamic-menu-item-input');
    allItems.each((index, item) => {
      $(item).prop('checked', true).trigger('change');
    });

    scheduleOnce('afterRender', this, function () {
      if (isEmpty($container)) {
        //this element does not exist anymore - it was removed from DOM
        return;
      }

      let itemsDefinition = this.createItemsDefinition();

      let itemsToHide = findItemsToHide(
        $container[0].scrollWidth,
        $container.width(),
        itemsDefinition,
        this.get('dropdownButtonWidth'),
        this.get('scrollbarWidth')
      );
      if (itemsToHide.length > 0) {
        $(this.element).find('.dropdown-button').removeClass('hidden');
      } else {
        this.set('dropdownVisible', false);
        $(this.element).find('.dropdown-button').addClass('hidden');
      }

      $container.css('overflow-x', 'hidden');
      //now hide those items!
      itemsToHide.forEach((item) => {
        item.inputElem.prop('checked', false).trigger('change');
      });
      this.set('hiddenItems', itemsToHide);
    });
  },

  /**
   *
   * retuns definition of all menu items ordered from lowest to highest priority (higher priority means it will stay visible longer)
   *
   * returns a map, where key=priority and value = array of menu items
   * @return {[type]} [description]
   */
  createItemsDefinition: function () {
    let items = $(this.element)
      .find('.dynamic-menu-item-input')
      .map((index, elem) => {
        let $elem = $(elem);
        return {
          inputElem: $elem,
          priority: parseInt($elem.data('priority'), 10) || 0,
        };
      });

    //group by priority
    let grouppedItems = {};
    items.each((index, item) => {
      if (grouppedItems[item.priority]) {
        grouppedItems[item.priority].push(item);
      } else {
        grouppedItems[item.priority] = [item];
      }
    });

    //btw. grouppedItems are sorted by priority (object's key) as well
    return grouppedItems;
  },

  actions: {
    toggleDropdown() {
      this.toggleProperty('dropdownVisible');
    },
  },
});
