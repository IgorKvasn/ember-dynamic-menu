import { schedule } from '@ember/runloop';
import $ from 'jquery';
import { not } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/dynamic-menu-item';

export default Component.extend({
  layout,

  classNames: ['dynamic-menu-item'],
  classNameBindings: ['notShowItem:hidden'],
  priority: 0, //higher priority means, it will stay visible longer
  showItem: true,

  notShowItem: not('showItem'),

  didInsertElement(){
    this._super(...arguments);
    let $showItemCheck = $(this.element).find('.dynamic-menu-item-input');
    $showItemCheck.on('change', ()=>{
      schedule('actions', () => {
        this.set('showItem', $showItemCheck.prop('checked'));
      });

    });
  }
});
