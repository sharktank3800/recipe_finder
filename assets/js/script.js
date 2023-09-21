var heroEl = document.querySelector('.hero-body');

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

    console.log(data[0].author);
    console.log(data[0].quote);
  });

}


window.addEventListener('load', getQuote);

setInterval(getQuote, 30000);