var heroEl = document.querySelector('.hero-body');
var homePageEl = document.querySelector('#home-page');
var mealsPageEl = document.querySelector('#meals-page');
var recipePageEl = document.querySelector('#recipe-page');
var categorySearch = document.querySelector('#categories');
var searchButton = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');

// var header = document.querySelector('.')
const baseURL = 'https://www.themealdb.com/api/json/v1/1/'
const headers = {
  "X-Api-Key": 'gF3CYb8qvTBIBHse8onGdQ==BKVsjSYgIPJqB3iw'
}

function displayMealPage() {
  mealsPageEl.classList.remove('hide');
  homePageEl.classList.add('hide');
  recipePageEl.classList.add('hide')
}

function displayRecipePage() {
  recipePageEl.classList.remove('hide');
  homePageEl.classList.add('hide');
  mealsPageEl.classList.add('hide')
}

function getQuote() {
  fetch('https://api.api-ninjas.com/v1/quotes?category=food', { headers })
  .then(function (response) {
    return response.json();
  }).then(function(data) {
    heroEl.innerHTML = '';

    var p = document.createElement('p');
    var h4 = document.createElement('h4');
    
    p.className = 'is-size-4 has-text-centered px-6';
    h4.className = 'is-size-5 has-text-centered';
    p.innerText = `"${data[0].quote}"`;
    h4.innerText = data[0].author;

    heroEl.append(p, h4);
  });

}

function displayRecipe(data) {
  console.log(data);
  displayRecipePage();

  recipePageEl.innerHTML = '';
      
  var ingredientsArray = [];
  var recipeSlot = data.meals[0];

  var h1 = document.createElement('h1');
  var div = document.createElement('div');
  var aside = document.createElement('aside');
  var section = document.createElement('section');
  var imgTag = document.createElement('img');
  var pDiv = document.createElement('div');

  var header = document.createTextNode(data.meals[0].strMeal);
  var instruction = document.createTextNode(data.meals[0].strInstructions);

  imgTag.src = data.meals[0].strMealThumb + '/preview';
  imgTag.alt = "meal photo";
  aside.append(imgTag);

  for(let i = 1; i <= 20; i++) {
    var p = document.createElement('p');
    var ingredientsKey = `strIngredient${i}`;
    var measurementKey = `strMeasure${i}`;
    var ingredientValue = recipeSlot[ingredientsKey];
    var measurementValue = recipeSlot[measurementKey]
        
    if(!ingredientValue == "" || !measurementValue == '') {
      var ingredients = document.createTextNode(`${measurementValue}    ${ingredientValue}`);
          
      p.append(ingredients);
      pDiv.append(p);
      aside.append(pDiv);
    } else {
      break;
    }

  }

  h1.append(header);
  section.append(instruction);
      
  h1.className = 'is-size-1 my-5';
  aside.className = 'is-flex is-flex-direction-column is-align-items-center flex-1 ml-6 py-4 mt-5';
  section.className = 'flex-2 is-size-4 ';
  div.className = 'is-flex is-flex-direction-row is-align-items-center mx-6';
  pDiv.className = 'is-flex is-align-items-flex-start is-flex-direction-column is-size-5';
  imgTag.className = 'mb-6';

  div.append(aside, section);
  recipePageEl.append(h1, div);

  meal = {
    name: data.meals[0].strMeal,
      id:  data.meals[0].idMeal
  }

  addItemToStorage(meal);
}

function displayMeals(data) {
  displayMealPage();
  console.log(data);

  mealsPageEl.innerHTML = '';
  data.meals.forEach(function(meal) {
        
    var div = document.createElement('div');
    var imgTag = document.createElement('img');
    var h4 = document.createElement('h4');

    imgTag.src = meal.strMealThumb + '/preview';
    imgTag.alt = 'Meal Image';

    imgTag.dataset.filter = 'lookup.php?i=';
    imgTag.dataset.search = meal.idMeal;

    h4.dataset.filter = 'lookup.php?i=';
    h4.dataset.search = meal.idMeal;

    // var mealName = document.createTextNode(meal.strMeal.slice(0, 25));
    h4.innerText = meal.strMeal.slice(0, 25);

    div.className = 'is-flex is-flex-direction-column is-align-items-center mx-3';
    imgTag.className = 'image is-128x128';
    h4.className = 'is-size-8';

    // div.append(imgTag, mealName);
    // Adjusting to h4 because textNode cannot be styled
    div.append(imgTag, h4);

    mealsPageEl.append(div);
  });
}

function fetchData(filter, search) {
  console.log(`${baseURL}${filter}${search}`);
  fetch(`${baseURL}${filter}${search}`)
    .then(function (response) {
      return response.json();
    }).then(function(data) {
      console.log('Fetch: ' + data);

      if(filter === 'filter.php?c=' || filter === 'search.php?s=') {
        displayMeals(data);
      } else if (filter === 'lookup.php?i=') {
        displayRecipe(data);
      }
      
  });
}

function searchMealDB(e) {
  console.log(e.target.dataset.filter, e.target.dataset.search);

  if(e.target.dataset.filter && e.target.dataset.search){
    fetchData(e.target.dataset.filter, e.target.dataset.search.toString())
  } else if(e.target.dataset.filter) {
    fetchData(e.target.dataset.filter, searchInput.value);
  }
  
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  if(!itemsFromStorage.includes(item)) {
    itemsFromStorage.push(item);

    localStorage.setItem('meals', JSON.stringify(itemsFromStorage));
  }
  
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('meals')) || [];
}

categorySearch.addEventListener('click', searchMealDB);
searchButton.addEventListener('click', searchMealDB);
mealsPageEl.addEventListener('click', searchMealDB);


getQuote();
setInterval(getQuote, 30000);


