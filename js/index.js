// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list');
const shuffleButton = document.querySelector('.shuffle__btn');
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time');
const sortChangeButton = document.querySelector('.sort__change__btn');
const sortActionButton = document.querySelector('.sort__action__btn');
const kindInput = document.querySelector('.kind__input');
const colorInput = document.querySelector('.color__input');
const weightInput = document.querySelector('.weight__input');
const addActionButton = document.querySelector('.add__action__btn');
const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let allFruits = JSON.parse(fruitsJSON);
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/


const display = () => {
  // Очищаем fruitsList от вложенных элементов
  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);
  }

  for (let i = 0; i < fruits.length; i++) {
    // Создаем элемент <li>
    const li = document.createElement('li');
    li.className = 'fruit__item';
    
    // Добавляем класс в зависимости от цвета
    const colorClass = fruits[i].color.replace(/\s+/g, '-').toLowerCase();
    li.classList.add(`fruit_${colorClass}`);
    
    // Создаем элемент для информации о фрукте
    const fruitInfo = document.createElement('div');
    fruitInfo.className = 'fruit__info';
    
    // Создаем и добавляем информацию
    const indexDiv = document.createElement('div');
    indexDiv.textContent = `index: ${i}`;
    
    const kindDiv = document.createElement('div');
    kindDiv.textContent = `kind: ${fruits[i].kind}`;
    
    const colorDiv = document.createElement('div');
    colorDiv.textContent = `color: ${fruits[i].color}`;
    
    const weightDiv = document.createElement('div');
    weightDiv.textContent = `weight (кг): ${fruits[i].weight}`;
    
   
    fruitInfo.appendChild(indexDiv);
    fruitInfo.appendChild(kindDiv);
    fruitInfo.appendChild(colorDiv);
    fruitInfo.appendChild(weightDiv);
    li.appendChild(fruitInfo);
    fruitsList.appendChild(li);
  }
};


display();

/*** ПЕРЕМЕШИВАНИЕ ***/


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const shuffleFruits = () => {
  const currentFruits = [...fruits]; 
    let result = [];
  let tempFruits = [...fruits];

  while (tempFruits.length > 0) {
    const randomIndex = getRandomInt(0, tempFruits.length - 1);
    const randomFruit = tempFruits.splice(randomIndex, 1)[0];
    result.push(randomFruit);
  }


  let isSameOrder = true;
  if (currentFruits.length === result.length) {
    for (let i = 0; i < currentFruits.length; i++) {
      if (currentFruits[i].kind !== result[i].kind || 
          currentFruits[i].color !== result[i].color || 
          currentFruits[i].weight !== result[i].weight) {
        isSameOrder = false;
        break;
      }
    }
  } else {
    isSameOrder = false;
  }

  if (isSameOrder) {
    alert('Порядок фруктов не изменился после перемешивания!');
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  allFruits = [...fruits]; 
  display();
});

/*** ФИЛЬТРАЦИЯ ***/


const filterFruits = () => {
  const minWeight = parseInt(minWeightInput.value) || 0;
  const maxWeight = parseInt(maxWeightInput.value) || 100;
  
 
  if (!minWeightInput.value && !maxWeightInput.value) {
    fruits = [...allFruits];
    return;
  }
  

  fruits = allFruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight;
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort';
let sortTime = '-';


const colorPriority = [
  'красный', 'розово-красный', 'оранжевый', 'желтый', 
  'зеленый', 'голубой', 'синий', 'фиолетовый',
  'коричневый', 'светло-коричневый', 'черный', 'белый'
];

const comparationColor = (a, b) => {
  const indexA = colorPriority.indexOf(a.color);
  const indexB = colorPriority.indexOf(b.color);
  
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;
  
  return a.color.localeCompare(b.color);
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const array = [...arr];
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(array[j], array[j + 1]) > 0) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
      }
    }
    return array;
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    
    for (let element of arr) {
      const cmp = comparation(element, pivot);
      if (cmp < 0) {
        left.push(element);
      } else if (cmp > 0) {
        right.push(element);
      } else {
        equal.push(element);
      }
    }
    
    return [...this.quickSort(left, comparation), ...equal, ...this.quickSort(right, comparation)];
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    const sortedArray = sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    return sortedArray;
  },
};


sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
  sortTimeLabel.textContent = '-';
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  
  setTimeout(() => {
    const sort = sortKind === 'bubbleSort' ? sortAPI.bubbleSort : sortAPI.quickSort;
    fruits = sortAPI.startSort(sort, fruits, comparationColor);
    allFruits = [...fruits]; 
        display();
    sortTimeLabel.textContent = sortTime;
  }, 100);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseInt(weightInput.value);


  if (!kind || !color || isNaN(weight)) {
    alert('Пожалуйста, заполните все поля!');
    return;
  }


  if (weight <= 0) {
    alert('Вес должен быть положительным числом!');
    return;
  }


  const newFruit = {
    kind: kind,
    color: color,
    weight: weight
  };
  

  fruits.push(newFruit);
  allFruits.push(newFruit);
  
  const currentFruits = JSON.parse(fruitsJSON);
  currentFruits.push(newFruit);
  fruitsJSON = JSON.stringify(currentFruits);
  

  kindInput.value = '';
  colorInput.value = '';
  weightInput.value = '';
  

  display();
  
  alert('Фрукт успешно добавлен!');
});