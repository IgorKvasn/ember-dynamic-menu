import Ember from 'ember';
import layout from '../templates/components/dynamic-menu-item';

export default Ember.Component.extend({
  layout,

  classNames: ['dynamic-menu-item'],
  classNameBindings: ['notShowItem:hidden'],
  priority: 0, //higher priority means, it will stay visible longer
  showItem: true,

  notShowItem: Ember.computed.not('showItem'),

  initVisibilityListener: Ember.on('didInsertElement', function(){
    let $showItemCheck = Ember.$(this.element).find('.dynamic-menu-item-input');
    $showItemCheck.on('change', ()=>{
      Ember.run.schedule('actions', () => {
        this.set('showItem', $showItemCheck.prop('checked'));
      });

    });
  })
});
