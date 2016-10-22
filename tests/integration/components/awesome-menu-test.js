import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('awesome-menu', 'Integration | Component | awesome menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{awesome-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#awesome-menu itemWidth=10 dropdownButtonWidth=10}}
      {{#awesome-menu-item}}
        template block text
      {{/awesome-menu-item}}
    {{/awesome-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
