var heroEl = document.querySelector(".hero-body");
var homePageEl = document.querySelector("#home-page");
var mealsPageEl = document.querySelector("#meals-page");
var recipePageEl = document.querySelector("#recipe-page");
var categorySearch = document.querySelector("#categories");
var searchButton = document.querySelector("#search-button");
var searchInput = document.querySelector("#search-input");
var modalEl = document.querySelector(".modal");
var modalCloseButton = document.querySelector(".modal-close");
var homePage = document.querySelector("#logo");

var dropdownButton = document.querySelector("#dropdown-button");
var recentDropDown = document.querySelector("#recent-dropdown");
var recentItemEl = document.querySelector(".recentItemEl");

const mealFilter = "search.php?s=";
const categoryFilter = "filter.php?c=";
const idFilter = "lookup.php?i=";

const baseURL = "https://www.themealdb.com/api/json/v1/1/";
const headers = {
    "X-Api-Key": "gF3CYb8qvTBIBHse8onGdQ==BKVsjSYgIPJqB3iw",
};

function displayHomePage() {
    homePageEl.classList.remove("hide");
    mealsPageEl.classList.add("hide");
    recipePageEl.classList.add("hide");
}

var isMealFetched = 0;
function displayMealPage() {
    isMealFetched++;
    mealsPageEl.classList.remove("hide");
    homePageEl.classList.add("hide");
    recipePageEl.classList.add("hide");
}

function displayRecipePage() {
    recipePageEl.classList.remove("hide");
    homePageEl.classList.add("hide");
    mealsPageEl.classList.add("hide");
    recentDropDown.classList.add("hide");
}

function getQuote() {
    fetch("https://api.api-ninjas.com/v1/quotes?category=food", { headers })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            heroEl.innerHTML = "";

            var p = document.createElement("p");
            var h4 = document.createElement("h4");

            p.className = "is-size-4 has-text-centered px-6";
            h4.className = "is-size-5 has-text-centered";
            p.innerText = `"${data[0].quote}"`;
            h4.innerText = data[0].author;

            heroEl.append(p, h4);
        });
}

function displayRecipe(data) {
    displayRecipePage();

    recipePageEl.innerHTML = "";

    // var ingredientsArray = [];
    var recipeSlot = data.meals[0];

    var headerDiv = document.createElement("div");
    var icon = document.createElement("i");
    var h1 = document.createElement("h1");
    var div = document.createElement("div");
    var aside = document.createElement("aside");
    var section = document.createElement("section");
    var imgTag = document.createElement("img");
    var pDiv = document.createElement("div");

    var header = document.createTextNode(data.meals[0].strMeal);
    var instruction = document.createTextNode(data.meals[0].strInstructions);

    imgTag.src = data.meals[0].strMealThumb + "/preview";
    imgTag.alt = "meal photo";
    aside.append(imgTag);

    for (let i = 1; i <= 20; i++) {
        var p = document.createElement("p");
        var ingredientsKey = `strIngredient${i}`;
        var measurementKey = `strMeasure${i}`;
        var ingredientValue = recipeSlot[ingredientsKey];
        var measurementValue = recipeSlot[measurementKey];

        if (!ingredientValue == "" && !measurementValue == "") {
            var ingredients = document.createTextNode(
                "- " + `${measurementValue}    ${ingredientValue}`
            );

            p.append(ingredients);
            pDiv.append(p);
            aside.append(pDiv);
        } else {
            break;
        }
    }

    headerDiv.className = "is-flex is-flex-direction-row is-align-items-center";
    icon.className = "fa-solid fa-arrow-left fa-3x mr-6 pr-6 clickable";
    h1.className = "is-size-1 my-5";
    aside.className = "is-flex is-flex-direction-column flex-1 ml-6 py-4 mt-5";
    section.className = "flex-2 is-size-5 ";
    div.className = "is-flex is-flex-direction-row is-align-items-center mx-6";
    pDiv.className =
        "is-flex is-align-items-flex-start is-flex-direction-column is-size-5";
    imgTag.className = "mb-6";

    section.setAttribute("id", "cookingInstructions");
    headerDiv.setAttribute("id", "recipe-header");
    icon.setAttribute("id", "recipe-arrow");

    h1.append(header);
    section.append(instruction);
    div.append(aside, section);
    headerDiv.append(icon, h1);
    recipePageEl.append(headerDiv, div);

    meal = {
        name: data.meals[0].strMeal,
        id: data.meals[0].idMeal,
    };

    addItemToStorage(meal);
}

function displayMeals(data) {
    displayMealPage();

    mealsPageEl.innerHTML = "";
    data.meals.forEach(function (meal) {
        var div = document.createElement("div");
        var imgTag = document.createElement("img");
        var h4 = document.createElement("h4");

        imgTag.src = meal.strMealThumb + "/preview";
        imgTag.alt = "Meal Image";

        imgTag.dataset.filter = idFilter;
        imgTag.dataset.search = meal.idMeal;

        h4.dataset.filter = idFilter;
        h4.dataset.search = meal.idMeal;

        var mealName = document.createTextNode(meal.strMeal.slice(0, 25));

        div.className =
            "is-flex is-flex-direction-column is-align-items-center mx-3";
        imgTag.className = "clickable image is-128x128";
        h4.className = "is-size-8";

        div.append(imgTag, mealName);

        mealsPageEl.append(div);
    });
}

function fetchData(filter, search) {
    fetch(`${baseURL}${filter}${search}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.meals != null) {
                if (filter === categoryFilter || filter === mealFilter) {
                    displayMeals(data);
                } else if (filter === idFilter) {
                    displayRecipe(data);
                }
            } else {
                modalEl.classList.add("is-active");
            }
        });
}

function searchMealDB(e) {
    if (e.target.dataset.filter && e.target.dataset.search) {
        fetchData(e.target.dataset.filter, e.target.dataset.search.toString());
    } else if (e.target.dataset.filter) {
        fetchData(e.target.dataset.filter, searchInput.value);
        searchInput.value = "";
    }
}

function addItemToStorage(item) {
    var itemsFromStorage = getItemsFromStorage();

    var itemFound = false;

    itemsFromStorage.forEach(function (storage) {
        if (storage.id === item.id) {
            itemFound = true;
        }
    });

    // ADJUSTED TO LIMIT LOCAL STORAGE TO 5 RECIPES
    if (!itemFound && itemsFromStorage.length < 5) {
        itemsFromStorage.push(item);
        localStorage.setItem("meals", JSON.stringify(itemsFromStorage));
    } else if (!itemFound && itemsFromStorage.length === 5) {
        itemsFromStorage.shift();
        itemsFromStorage.push(item);
        localStorage.setItem("meals", JSON.stringify(itemsFromStorage));
    }
}

function getItemsFromStorage() {
    return JSON.parse(localStorage.getItem("meals")) || [];
}

// DISPLAYS ITEM TO DROPDOWN
function addItemsToDropdown() {
    var index = getItemsFromStorage();

    for (var i = 0; i < index.length; i++) {
        var listItem = document.createElement("p");
        listItem.innerText = index[i].name;
        listItem.dataset.filter = idFilter;
        listItem.dataset.search = index[i].id;
        listItem.classList.add("recentItemEl");
        recentDropDown.append(listItem);
    }
}

function closeModal() {
    modalEl.classList.remove("is-active");
}

function recipeReturnArrow(e) {
    if (e.target.id === "recipe-arrow") {
        if (isMealFetched > 0) {
            recipePageEl.innerHTML = "";
            displayMealPage();
        } else if (isMealFetched === 0) {
            displayHomePage();
        }
    }
}

categorySearch.addEventListener("click", searchMealDB);
searchButton.addEventListener("click", searchMealDB);
mealsPageEl.addEventListener("click", searchMealDB);
recentDropDown.addEventListener("click", searchMealDB);
modalCloseButton.addEventListener("click", closeModal);
homePage.addEventListener("click", displayHomePage);
recipePageEl.addEventListener("click", recipeReturnArrow);

dropdownButton.addEventListener("click", function () {
    if (recentDropDown.classList.contains("hide")) {
        recentDropDown.innerHTML = "";
        addItemsToDropdown();
        recentDropDown.classList.remove("hide");
    } else {
        recentDropDown.classList.add("hide");
    }
});

window.onclick = function (event) {
    if (
        !event.target.matches(".recentItemEl") &&
        !event.target.matches("#dropdown-button")
    ) {
        recentDropDown.classList.add("hide");
    }
};

getQuote();
setInterval(getQuote, 30000);
