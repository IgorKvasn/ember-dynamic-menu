import menuUtil from 'dummy/utils/dynamic-menu-util';
import { module, test } from 'qunit';

module('Unit | Utility | dynamic menu util');

test('renders all items when there is enough space for them', function(assert) {
  let containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth;
  containerScrollWidth = 100;
  containerWidth = 100;
  itemsDefinition = {
    1: [{inputElem: null, priority: 1}, {inputElem: null, priority: 1}, {inputElem: null, priority: 1}]
  };
  dropdownButtonWidth = 10;
  scrollbarWidth = 5;

  let result = menuUtil.findItemsToHide(containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('hides menu items with lowest priority because there is not enough space for them', function(assert) {
  let containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth;
  containerScrollWidth = 60;
  containerWidth = 40;
  itemsDefinition = {
    1: [{inputElem: null, priority: 1}, {inputElem: null, priority: 1}, {inputElem: null, priority: 1}],
    10: [{inputElem: null, priority: 10}, {inputElem: null, priority: 10}, {inputElem: null, priority: 10}]
  };
  dropdownButtonWidth = 10;
  scrollbarWidth = 5;

  let result = menuUtil.findItemsToHide(containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth);
  assert.ok(result);
  assert.equal(result.length, 3); //hides 2 menu items because they are overflowing + 1 more item to make speca for a dropdown button
  result.forEach((item)=>{
    assert.equal(item.priority, 1);
  });
});

test('hides menu items with across multiple priorities because there is not enough space for them', function(assert) {
  let containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth;
  containerScrollWidth = 60;
  containerWidth = 20;
  itemsDefinition = {
    1: [{inputElem: 'item1', priority: 1}, {inputElem: 'item2', priority: 1}, {inputElem: 'item3', priority: 1}],
    10: [{inputElem: 'item4', priority: 10}, {inputElem: 'item5', priority: 10}, {inputElem: 'item6', priority: 10}]
  };
  dropdownButtonWidth = 10;
  scrollbarWidth = 5;

  let result = menuUtil.findItemsToHide(containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth);
  assert.ok(result);
  assert.equal(result.length, 5); //hides 4 menu items because they are overflowing + 1 more item to make speca for a dropdown button

let lowestPriorityItems = ['item1', 'item2', 'item3'];

  let indexOf =0;

  lowestPriorityItems.forEach((itemName)=>{
    indexOf = findItemByInputElem(itemName, result);
    if (indexOf === -1){
      assert.ok(1===2, `"${itemName}" is not hidden (but it should be, because it has lowest priority)`);
    }else{
      result.splice(indexOf,1);
    }
  });

  //all the remaingin items should have higher priority
  assert.equal(result.length, 2);
  result.forEach((item)=>{
    assert.equal(item.priority, 10);
  });

  function findItemByInputElem(inputElem, items){
    for (let i=0;i<items.length;i++){
      if (items[i].inputElem === inputElem){
        return i;
      }
    }
    return -1;
  }
});
