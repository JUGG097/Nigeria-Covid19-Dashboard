(function () {

  const foliumURL = "https://folium-choropleth-map.herokuapp.com";

  const tableUrl = "https://ng-covid-19-api.herokuapp.com/";

  const loadError = function(error, selector) {
    let html = "<div class='text-center'>";
    html += `<p>Error Message: ${error}</p> </div>`
    insertHtml(selector, html);
  }
    
  // Convenience function for inserting innerHTML for 'select'
  const insertHtml = function (selector, html) {
      let targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
  };
    
  // Show loading icon inside element identified by 'selector'.
  const showLoading = function (selector) {
      let html = "<div class='col-12 text-center'>";
      html += "<img src='img/ajax_loader.gif'></div>";
      insertHtml(selector, html);
  };

  // helper function to turn API data into a table 
  const loadTable = function (wholeJson) {
      let finalHtml = "<table class='table table-striped table-bordered table-hover text-center'>";
      finalHtml += "<thead> <tr> <th scope='col' class='tileshead'>State</th> <th scope='col' class='tilesorangehead'>Cases</th> <th scope='col' class='tilesgreenhead'>Recovered</th> <th scope='col' class='tilesredhead'>Deaths</th>  </tr> </thead> <tbody>"
      // Loop over categories
      for (statename of Object.keys(wholeJson["states"])) {
        
        
        let state = statename;
        let cases = wholeJson["states"][statename][0]["confirmed"];
        let death = wholeJson["states"][statename][0]["deaths"];
        let discharged = wholeJson["states"][statename][0]["discharged"];
        let html = `<tr>
                      <td class="tiles">${state}</td>
                      <td class="tilesorange">${cases}</td>
                      <td class = "tilesgreen">${discharged}</td>
                      <td class="tilesred">${death}</td>
                    </tr>`
        finalHtml += html;
      }
      finalHtml += "</table>";
      //console.log(finalHtml)
      insertHtml("#tabledata", finalHtml); 
  }

  // helper function to turn API data into summary cards
  const loadSummary = function(wholeJson) {
      let confirmedcases = wholeJson["summary"]["Confirmed Cases"];
      let totaldeath = wholeJson["summary"]["Death"];
      let totaldischarged = wholeJson["summary"]["Discharged Cases"];

      let html = `<div class="col-sm-4 tileshead">
                    <p>T.CASES</p>
                    <p>${confirmedcases}</p>
                  </div>
                
                  <div class="col-sm-4 tilesgreenhead">
                      <p>T.RECOVERED</p>
                      <p>${totaldischarged}</p>
                  </div>
                  
                  <div class="col-sm-4 tilesredhead">
                      <p>T.DEATH</p>
                      <p>${totaldeath}</p>
                  </div>`

      insertHtml("#summary", html);
  }

  // helper function to turn API data into card showing the rates
  const loadRate = function (wholeJson) {
      const ratedeath = Math.round((Number(wholeJson["summary"]["Death"].replace(/,/g, ""))) / (Number(wholeJson["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;
      const rateDischarged = Math.round((Number(wholeJson["summary"]["Discharged Cases"].replace(/,/g, ""))) / (Number(wholeJson["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;

      let html = `<div class="col-sm-6 tilesgreenhead">
                    <p>RECOVERY RATE</p>
                    <p>${rateDischarged}%</p>
                  </div>

                  <div class="col-sm-6 tilesredhead">
                    <p>DEATH RATE</p>
                    <p>${ratedeath}%</p>
                  </div>`;

      insertHtml("#rate", html);
  }

  // helper function to help load map asynchronously
  const loadFolium = function () {
      let html = `<div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="${foliumURL}" allowfullscreen></iframe>
                  </div>`

      insertHtml("#folium-map", html);
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    
    showLoading("#rate");
    showLoading("#summary");
    showLoading("#tabledata");
    showLoading("#folium-map");

    fetch(tableUrl).then(response => response.json()).then(function(wholeJson) {
        
        loadTable(wholeJson);
        loadSummary(wholeJson);
        loadRate(wholeJson);
        loadFolium();
      }).catch(function(error) {
        console.log(error);
        loadError(error, "#tabledata");
        loadError(error, "#summary");
        loadError(error, "#rate");
        loadError(error, "#folium-map");
      });
   
    });

 })();