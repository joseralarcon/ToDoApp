let IdItem = 0; // Keep track of the current id item on the list
let localListArray; //Local List Array Storage

const list = new List();
list.checkDataLocalStorage; //Determines if theres data on local storage
list.addIconListener;
list.inputListener; //Add input listener
list.listListener; //Add list listener

function List() {
  const container_list = document.getElementById('container_list'); //Container List element
  let inputAddToDo = document.getElementById('add_todo'); //Store input value
  const addIcon = document.getElementById('add_icon');

 checkDataLocalStorage = function () {
    //Check Data LocalStorage
    const data = localStorage.getItem('ToDo'); //Store ToDo LocalStorage data

    if (data) { //If exists at least 1 element in the data
      //Data Exist in Local Storage
      localListArray = JSON.parse(data); //parse to store in the array

      localListArray.forEach(item => { //Loop through array for each element
        let myitem = new Item();
        myitem.addToList(container_list, item.task, item.id, item.done);
      });
    } else { //If data is empty
      //Data Doesn´t Exist in Local Storage
      localListArray = []; //Initialize Local List Array Storage empty 
      IdItem = 0; //Initialize IdItem with 0
    }
  }; //End checkDataLocalStorage

  addIconListener = function(){
    addIcon.addEventListener('click', function(){
      getInputValue();
    });
  }

  inputListener = function () {
    /*This function add an even listener to the input,
    then determines if the key was "Enter" = '13'
    */
    inputAddToDo.addEventListener('keyup', function (e) {
      if (e.keyCode == 13) {
        getInputValue();
      }
    });
  }; // End inputListener

  getInputValue = function(){
    const input_value = inputAddToDo.value;

    if (input_value) {
      if (localListArray.length == 0) {
        IdItem = 0;
      }

      let myitem = new Item();
      myitem.addToList(container_list, input_value, IdItem, false);

      fillListArray(input_value, IdItem, false);
      addToLocalStorage();

      inputAddToDo.value = "";
      IdItem++;
    }
  }

  listListener = function () {
    container_list.addEventListener('click', function (e) {
      const element = e.target;
      const elementStatus = element.getAttribute('status');
      let myItem;
      if (elementStatus == "complete" || elementStatus == "delete") {
        myItem = new Item();
      }

      if (elementStatus == "complete") {
        //Item Check-Uncheck
        myItem.itemCheckUncheck(element);
      } else if (elementStatus == "delete") {
        //Item Deleted
        myItem.removeItem(element);
      }
      addToLocalStorage();
    });
  }; // End listListener

  fillListArray = function (task, id, done) {
    localListArray.push({
      task,
      id,
      done
    });
  }; // End fillListArray

  addToLocalStorage = function () {
    localStorage.setItem('ToDo', JSON.stringify(localListArray));
  };

  Object.defineProperties(this, {
    'checkDataLocalStorage': {
      get: function(){
        return checkDataLocalStorage();
      }
    },
    'addIconListener': {
      get: function(){
        return addIconListener();
      }
    },
    'inputListener': {
      get: function () {
        return inputListener();
      }
    },

    'listListener': {
      get: function () {
        return listListener();
      }
    }
  });
}

function Item() {
  const check = 'fa-check-circle'; //Task Completed
  const uncheck = 'fa-circle-thin'; //Task Incompleted
  const line_through = 'lineThrough';

  let ItemStatus; //Store value of status of the task
  let Line;

  this.removeItem = function (element) {
    const removeItem = element.closest('.list-item');

    removeItem.remove();
    const number = parseInt(removeItem.id);
    localListArray = localListArray.filter(item => item.id !== number);
  }

  this.itemCheckUncheck = function (element) {
    if (element.classList.contains(uncheck)) {
      element.classList.remove(uncheck);
      element.classList.add(check);
    } else {
      element.classList.remove(check);
      element.classList.add(uncheck);
    }
    element.parentNode.querySelector('.text').classList.toggle(line_through);

    let id_element = element.closest('.list-item'); //Get id if the item
    id_element = parseInt(id_element.id); //Convert id to number
    const index = localListArray.map(e => e.id).indexOf(id_element); //Get index in the array base on the id
    localListArray[index].done = localListArray[index].done ? false : true; //Acces the array base on the index 
  };

  this.addToList = function (list, toDo, id, status) {
    determineItemStatus(status);
    determineLine(status);

    const list_element = `<div class="list-item active" id=${id}>
                      <i class="fa ${ItemStatus} co" status="complete"></i>
                      <p class="text ${Line}">${toDo}</p>
                      <i class="fa fa-trash-o de" status="delete"></i>
                    </div>`;

    list.insertAdjacentHTML('beforeend', list_element);
  };

  determineItemStatus = function (status) {
    ItemStatus = status ? check : uncheck;
  }

  determineLine = function (status) {
    Line = status ? line_through : "";
  }
}

