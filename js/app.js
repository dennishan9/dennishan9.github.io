//venues/search?client_id=NSP0OXOULK4MFPMFGZRNEGEPM0QQAN04YHSRZVYAMYXOQUAV&client_secret=KY2ZINTAT2VIVYMVBADH5Q04FHAWYJO2G454IT1RAMDOCQJA&v=20160629&m=foursquare&query=cafe&near=11225
//https://api.foursquare.com/v2/venues/search?client_id=NSP0OXOULK4MFPMFGZRNEGEPM0QQAN04YHSRZVYAMYXOQUAV&client_secret=KY2ZINTAT2VIVYMVBADH5Q04FHAWYJO2G454IT1RAMDOCQJA&v=20160629&m=foursquare&query=cafe&near=11225&oauth_token=OQHUEEGUNIWJ54G0YYZWQTQIKQJDD4KR0FNAPD5UALNQHYX1&v=20160629
//https://api.foursquare.com/v2/venues/search?client_id=NSP0OXOULK4MFPMFGZRNEGEPM0QQAN04YHSRZVYAMYXOQUAV&client_secret=KY2ZINTAT2VIVYMVBADH5Q04FHAWYJO2G454IT1RAMDOCQJA&v=20160629&m=foursquare&query=cafe&near=11225


// OUR MAIN STATE VARIABLE:

// This is the main data storage array for all the articles
// (often called "state")
// It will be available in closures everywhere in the code.
var articles = [];

// HELPER FUNCTIONS:

// function addScore(article) {
//   if (article.name === 'Cafe Mogador' || article.name === 'Cafe Tibet') {
//       article.score = 7;
//     } else if(article.name === 'Hard Rock Cafe New York' || article.name === 'Gratitude Cafe') {
//       article.score = 3;
//     } 
//     else {
//       article.score = 0;
//     }
// }

var restaurantNamesToScores = {
'Cafe Mogador': 7,
'Cafe Tibet': 7,
'Hard Rock Cafe New York': 3,
'Gratitude Cafe': 3,
'Café Regular du Nord': 8
}

function addScore(article) {
    article.score = (restaurantNamesToScores[article.name] || 0);
}

// `articleToHTML` renders an html string from
// an article object

function articleToHTML(article) {
  return '<article class="article">' +
         '  <section class="featuredImage">' +
        //  '    <img src="' + article.categories.icon.prefix + '90.png"' + ' alt="" />' +
         '  </section>' +
         '  <section class="articleContent">' +
         '    <a href="#"><h3>' + article.name + '</h3></a>' +
         '    <h6>' + article.location.formattedAddress + '</h6>' +
         '  </section>' +
         '  <section class="impressions">' +
              article.stats.checkinsCount +
         '  </section>' +
         '  <section class="score ' + article.class +'">' +
              article.score +
         '  </section>' +
         '  <div class="clearfix"></div>' +
         '</article>';         
}

// This `setView` function isolates 
// the confusion about what the `hidden`
// and `loader` classes mean for the popup,
// so you only have to puzzle through it in
// your head once.
function setView(viewType) {
  var $popup = $('#popUp');

  if (viewType === 'loader') {
    $popup.removeClass('hidden');
    $popup.addClass('loader');
  } 
  else if (viewType === 'detail') {
    $popup.removeClass('hidden');
    $popup.removeClass('loader');
  } 
  else if (viewType === 'feed') {
    $popup.addClass('hidden');
  } 
  else {
    // This `else` clause is optional but useful
    // if you (the programmer) forget the system 
    // of viewTypes that you worked out, and 
    // use a wrong one.
    throw new Error("Only acceptable arguments to setView " +
                    "are 'loader', 'detail' and 'feed'");
  }
}

function handleResponse(response) {
// console.log(response);
  // Grab the array from the JSON response
  var childrenFromResponse = response.response.venues;

  // Grab only the "data" property from each object
  // in the array.
  articles = childrenFromResponse.map(function(child) {
    return child;
  });

  // Remove existing articles from DOM
  $('#main.container').empty();

  articles.forEach(function (article) {
    addScore(article);
  });

  function compare(a, b) {
    if (a.score > b.score)
      return -1;
    if (a.score < b.score)
      return 1;
    return 0;
  }

  articles.sort(compare);

  articles.forEach(function (article) {
    
    if(article.score > 0) {
        article.class = 'high-score';
    } else {
      article.class = '';
    }
    
    if(article.score === 0) {
      article.score = '';
    }
    
    var renderedHTML = articleToHTML(article);

    $('#main.container').append(renderedHTML);
  });

  setView('feed');
}

// function handleError(error) {
//   alert("Something terrible has happened: " + 
//         error.status + " " + error.statusText);
// }

// SET EVENT LISTENERS:

// Go to article detail
$('#main.container').on('click', '.article a', function(event) {

  // Get the right article object, which we can do because the 
  // article elements in the feed in the DOM will be in the 
  // same order as the ones in the articles array.
  var index = $(this).index();
  
  var article = articles[index];

  // Render the article in the detail view.
  $('#popUp h1').html(article.name);
  // $('#popUp p').html(article.author);
  // $('#popUp a.popUpAction').attr('href', 'http://reddit.com' + article.permalink);

  setView('detail');
});

// Toggle search input box open or closed
// when clicking on the search icon
// and when submitting a search
// var toggleSearch = function() {
//   $('#search').toggleClass('active');
// }
// $('#search a').on('click', toggleSearch);
// $('#search input').on('keypress', function(event) {
//   if (event.which === 13) { // 13 is the code for the `enter` key
//     toggleSearch();
//   }
// })

// Go back to main feed when `X` is clicked in popup
$('.closePopUp').on('click', function(event) {
  setView('feed');
});


$('header .logo').on('click', function(event) {
  setView('feed');
});


var clientSecret = 'KY2ZINTAT2VIVYMVBADH5Q04FHAWYJO2G454IT1RAMDOCQJA';
var clientId = 'NSP0OXOULK4MFPMFGZRNEGEPM0QQAN04YHSRZVYAMYXOQUAV';
var userInput = function () {
  $('#message-form').on('submit', function (event) {
    event.preventDefault();
    var venue = $('#userQuery').val();
    var zipcode = $('#zipInput').val();
    console.log(venue);
    console.log(zipcode);
    $('#main').slideDown('slow');

    $.get(
      'https://api.foursquare.com/v2/venues/search?client_id=' + clientId +
      '&client_secret=' + clientSecret +
      '&v=20160629' +
      '&m=foursquare' +
      '&query=' + venue +
      '&near=' + zipcode, function (response) {
        handleResponse(response);
      });
  });
}
userInput();

// about tab
$('.drawer-tab').hover(function() {
  $(this).css({'height': '40px', 'font-size': '1.5em'})
}, function() {
  $(this).css({'height': '23px', 'font-size': '1em'})
});

$('.drawer-tab').on('click', function() {
  $('.drawer-body').slideDown('fast');
});

$(document).mouseup(function (v) {
  var container18 = $(".drawer-body");

  if (!container18.is(v.target) // if the target of the click isn't the container...
    && container18.has(v.target).length === 0) // ... nor a descendant of the container
  {
    container18.slideUp('fast');
  }
});