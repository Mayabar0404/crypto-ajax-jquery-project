$(function () {

/* ************************** Navbar ************************** */

  $(".about").click( ()=> {
    $("#containerSection").empty();
    $("#containerSection").load("/html/about.html");
  });

  $(".liveReport").click( ()=> {
    $("#containerSection").empty();
    $("#containerSection").load("/html/liveReports.html");
  });

/* ************************** Home Page ***************************  */

// cards
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins",
    beforeSend: function () {$("#loadingProgressBar").show();},
    complete: function () {$("#loadingProgressBar").hide();},
    success: (response) => {displayCoins(response)},
    error: (err) => {alert("error: something went wrong ):", err)}
  });

  function displayCoins(response) {
    for (let i = 0; i < 50; i++) {
      const allTheCoins = `
      <div class="card" style="text-align: center;">

        <div class="card-body">
            <h5 class="card-title">${response[i].symbol.toUpperCase()}</h5>
            <p class="card-text">${response[i].id}</p>
        </div>

          <a id=${response[i].id} class="moreInfoBTN btn btn-primary" type="button" data-toggle="collapse"   data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample" style= "background-color:black ; border: 1px solid black; color:white;">More Info</a>

        <div class="collapse" id="collapseExample${i}">
          <div class="card moreInfoCard">
            <div class="card-body" id="${response[i].id}a">
            </div>
          </div>
        </div>
          
      </div>
          `;

          $("#coinsSection").append(allTheCoins);
        }
  }

  //Session Storage
  $(document).ajaxComplete(function (event, xhr, settings) {
    // if (settings.url === "https://api.coingecko.com/api/v3/coins") {
      $(".moreInfoBTN").on("click", moreInfo);
      // }
    });
    
    function moreInfo() {
      const thisCoinName = this.id;
      
      if (sessionStorage.getItem(thisCoinName) == null) {
      $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${thisCoinName}`,
        beforeSend: function () {$("#loadingProgressBar").show();},
        complete: function () {$("#loadingProgressBar").hide();},
        success: (response) => {moreData(response, thisCoinName)},
      });
      
    } else {
      getMoreData(thisCoinName);
    }
    
    function moreData(response, thisCoinName) {
      const img = response.image.small;
      const usdPrice = response.market_data.current_price.usd;
      const eurPrice = response.market_data.current_price.eur;
      const ilsPrice = response.market_data.current_price.ils;
      
      const infoToStore = JSON.stringify({
        image: img,
        usd: usdPrice,
        eur: eurPrice,
        ils: ilsPrice,
      });

      sessionStorage.setItem(thisCoinName, infoToStore);
      setTimeout(() => {
        sessionStorage.removeItem(thisCoinName);
      }, 5000);
      
      $(`#${thisCoinName}a`).html(`
      <img src="${img}"/> </br>
      USD: ${usdPrice} $ </br>
      EUR: ${eurPrice} € </br>
      ILS: ${ilsPrice} ₪ </br>
      `);
    }
    
    function getMoreData(thisCoinName) {
      const storedInfo = JSON.parse(sessionStorage.getItem(thisCoinName));
      $(`#${thisCoinName}a`).html(`
      <img src="${storedInfo.image}"/> </br>
      USD: ${storedInfo.usd} $ </br>
      EUR: ${storedInfo.eur} € </br>
      ILS: ${storedInfo.ils} ₪ </br>
      `);
      return;
    }
  }

// search
$("#searchBtn").on("click", function (e) {
  e.preventDefault();
  let searchValue = $("#searchCoinsInput").val();
  
  $("#coinsSection").html("");
  $("#searchValue").val("");
  
  $.ajax({
    url: `https://api.coingecko.com/api/v3/search?query=${searchValue}`,
    beforeSend: ()=> {$("#loadingProgressBar").show();},
    complete: ()=> {$("#loadingProgressBar").hide();},
    success: (response) => {
      displayCoin(response.coins.id)
      if (response.coins.length == 0) {
        alert("coin is not found, try searching a diffrent coin");
        return;
      }
      $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${response.coins[0].id}`,
        beforeSend: ()=> {$("#loadingProgressBar").show();},
        complete: ()=> {$("#loadingProgressBar").hide();},
        success: (response) => {displayCoin(response);},
        error: (err) => {alert("coin is not found, try searching a diffrent coin",err)},
      })
    },
    error: (err) => {alert("coin is not found, try searching a diffrent coin",err)},
  });
    
    function displayCoin(response) {
      $(response).each(function () {
        const theSearchedCoin = `
      <div class="card" style="text-align: center">

        <div class="card-body">
            <h5 class="card-title">${this.symbol.toUpperCase()}</h5>
            <p class="card-text">${this.id}</p>
        </div>

            <a id="${this.id}" class="moreInfoBTN btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample${this.id}" ara-expanded="false" ara-controls="collapseExample" style= "background-color:black ; border: 1px solid black; color:white;">More Info</a>

          <div class="collapse" id="collapseExample${this.id}">
            <div class="card moreInfoCard">
              <div class="card-body" id="${this.id}a">
              </div>
            </div>
          </div>

        </div>
        `;

        $("#coinsSection").append(theSearchedCoin);
      });
    }
  });

});