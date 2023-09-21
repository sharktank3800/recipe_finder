var heroEl = document.querySelector('.hero-body');
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

window.addEventListener('load', getQuote);

setInterval(getQuote, 30000);

// function hidePage() {
   // header.classlist.add("hide")
  //  section.classlist.add)("hide")
  

