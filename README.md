# Ember-dynamic-menu

[![Build Status](https://travis-ci.org/AnnotationSro/ember-dynamic-menu.svg?branch=master)](https://travis-ci.org/AnnotationSro/ember-dynamic-menu)

Mobile friendly horizontal menu - on wide enough screens it shows all the menu items side-by-side, but once the screen (window width) is not able to show all the menu items, dropdown button is show.
You can assign a priority to each menu item - menu item with the lowest priority will be hidden first.

## Install
```
ember install ember-dynamic-menu
```

## Usage
```
{{#dynamic-menu itemWidth=50 dropdownButtonWidth=50 position='bottom' dropdownIconClasses='fa fa-caret-down' dropdownTitle='more'}}

  {{#dynamic-menu-item priority=5}}
    {{!-- any template you want for a menu item --}}
    <div class="my-menu-item">
      Press me!
    </div>
  {{/dynamic-menu-item}}

  {{#dynamic-menu-item priority=1}}
    {{!-- any template you want for a menu item --}}
    <div class="my-menu-item">
      Press me #2!
    </div>
  {{/dynamic-menu-item}}

{{/dynamic-menu}}  
```

Note that each menu item *must* have the same width (specified by `itemWidth` property - see example above). To specify dropdown button width use `dropdownButtonWidth` property (see example above).
You can also specify position of the menu, using property `position` which can be either `top` or `bottom` (default).
To customize the dropdown button, you can add any CSS classes to the dropdown button using property `dropdownIconClasses` - you can add FontAwesome, glypicons, Icomoon icons or whatever you like. You can also add aditional text that will be show under the icon using `dropdownTitle` property.
To make space between menu items equally distributed, you can use `enableAutoSpacing` (true|false) to enable it (true by default) - just beware: your browser must support flexbox.

## Styling
```

<!-- container element that holds all menu items that are visible -->
.dynamic-menu-container{
    background-color: red;
}

<!-- well, dropdown button... -->
.dropdown-button{
  width: 50px;
  height: 50px;
  background-color: blue;
  display: inline-block;
}

<!-- container element that holds all menu items that are visible after user clicks on dropdown button -->
#dynamic-dropdown{
  background-color: orange;
}

```
