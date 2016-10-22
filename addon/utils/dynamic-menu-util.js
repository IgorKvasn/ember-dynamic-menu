export function findItemsToHide(containerScrollWidth, containerWidth, itemsDefinition, dropdownButtonWidth, scrollbarWidth, itemWidth){
    let overflowingSpace = containerScrollWidth - containerWidth;

    if (overflowingSpace > 0){
      overflowingSpace += dropdownButtonWidth;
      overflowingSpace -= scrollbarWidth;
    }
    let itemsToHide = [];

    for (let priority in itemsDefinition){

      if (overflowingSpace <= 0){
        //we are done - no need to hide any more item
        break;
      }

      for (let i=0;i<itemsDefinition[priority].length;i++){

        if (overflowingSpace <= 0){
          //we are done - no need to hide any more item
          break;
        }

        let item = itemsDefinition[priority][i];
        itemsToHide.push(item);
        overflowingSpace -= itemWidth;

      }
    }
    return itemsToHide;
  }
