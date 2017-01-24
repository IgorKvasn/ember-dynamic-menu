import Ember from 'ember';
import layout from '../templates/components/dynamic-menu';
import {findItemsToHide} from '../utils/dynamic-menu-util';


function getScrollBarWidth () {
    var $outer = Ember.$('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = Ember.$('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
}

export default Ember.Component.extend({
  layout,

  classNameBindings: ['isPositionBottom:bottom-position:top-position'],
  classNames: ['dynamic-menu'],

  dropdownVisible: false,
  itemWidth: 0, //in pixels
  dropdownButtonWidth: 50, //in pixels
  hiddenItems: [],
  position: 'bottom', //top/bottom
  enableAutoSpacing: true,
  dropdownTitle: null,

  initComponent: Ember.on('didInsertElement', function(){

    this.set('scrollbarWidth', getScrollBarWidth());

    Ember.$(window).resize(()=>{
      Ember.run.debounce(this, this.hideItems, 200);
    });

    this.hideDropdownMenu();
    this.hideItems();
  }),

  isPositionBottom: Ember.computed('position', function(){
    return this.get('position') === 'bottom';
  }),

  hideDropdownMenu(){
    if (this.get('isPositionBottom')){
      Ember.$('#dynamic-dropdown').css('bottom', `${Ember.$(this.element).height()-Ember.$(this.element).find('.dynamic-menu-container').height()}px`);
    }else{
      Ember.$('#dynamic-dropdown').css('top', `-${Ember.$(this.element).find('.dynamic-menu-container').height()}px`);
    }
  },

  showDropdownMenu(){
    if (this.get('isPositionBottom')){
      Ember.$('#dynamic-dropdown').css('bottom', `${Ember.$(this.element).find('.dynamic-menu-container').height()}px`).removeClass('hidden');
    }else{
      Ember.$('#dynamic-dropdown').css('top', `${Ember.$(this.element).find('.dynamic-menu-container').height()}px`).removeClass('hidden');
    }
  },

  hideItems: function(){
    let $container = Ember.$(this.element).find('.dynamic-menu-container');
    $container.css('overflow-x', 'scroll');

    let allItems = Ember.$(this.element).find('.dynamic-menu-item-input');
    allItems.each((index, item)=>{
      Ember.$(item).prop('checked',true).trigger('change');
    });

    Ember.run.scheduleOnce('afterRender', this, function() {
      let itemsDefinition = this.createItemsDefinition();

      let itemsToHide = findItemsToHide(
        $container[0].scrollWidth,
        $container.width(),
        itemsDefinition,
        this.get('dropdownButtonWidth'),
        this.get('scrollbarWidth'),
        this.get('itemWidth')
      );
      if (itemsToHide.length > 0){
        Ember.$(this.element).find('.dropdown-button').removeClass('hidden');
      }else{
        Ember.$(this.element).find('.dropdown-button').addClass('hidden');
      }

      $container.css('overflow-x', 'hidden');
      //now hide those items!
      itemsToHide.forEach((item)=>{
        item.inputElem.prop('checked',false).trigger('change');
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
  createItemsDefinition: function(){
    let items = Ember.$(this.element).find('.dynamic-menu-item-input').map((index, elem)=>{
      let $elem = Ember.$(elem);
      return {
        inputElem: $elem,
        priority: parseInt($elem.data('priority'), 10) || 0
      };
    });

    //group by priority
    let grouppedItems = {};
    items.each((index, item)=> {
      if (grouppedItems[item.priority]){
        grouppedItems[item.priority].push(item);
      }else{
        grouppedItems[item.priority] = [item];
      }
    });

    //btw. grouppedItems are sorted by priority (object's key) as well
    return grouppedItems;
  },

  actions: {
    toggleDropdown(){
      this.toggleProperty('dropdownVisible');
      if (this.get('dropdownVisible')){
        this.showDropdownMenu();
      } else {
        this.hideDropdownMenu();
      }
    }
  }
});
