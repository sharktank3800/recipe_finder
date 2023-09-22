var heroEl = document.querySelector('.hero-body');
var mealsEl = document.querySelector('#meals');

// var header = document.querySelector('.')
const headers = {
  "X-Api-Key": 'gF3CYb8qvTBIBHse8onGdQ==BKVsjSYgIPJqB3iw'
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

function fetchMeals() {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`)
    .then(function (response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      mealsEl.innerHTML = '';
      data.meals.forEach(function(meal) {
        
        var div = document.createElement('div');
        var imgTag = document.createElement('img');
        var h4 = document.createElement('h4');

        imgTag.src = meal.strMealThumb + '/preview';
        imgTag.alt = 'Meal Image';

        var mealName = document.createTextNode(meal.strMeal);
        h4.innerText = meal.strMeal;

        div.className = 'is-flex is-flex-direction-column is-align-items-center mx-3'
        imgTag.className = 'image is-128x128'
        h4.className = 'is-size-8'

        // div.append(imgTag, mealName);
        // Adjusting to h4 because textNode cannot be styled
        div.append(imgTag, h4);

        mealsEl.append(div);
    });
  });
}

window.addEventListener('load', fetchMeals);
console.log('Hello');
setInterval(getQuote, 30000);

// function hidePage() {
   // header.classlist.add("hide")
  //  section.classlist.add)("hide")
  

