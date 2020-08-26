(function () {

    let iframeHTML = "snippet/iframe-snippet.html";

    const foliumURL = "https://folium-choropleth-map.herokuapp.com";

    const tableUrl = "https://ng-covid-19-api.herokuapp.com/";

    const summaryHTML = "snippet/total-snippet.html";

    const rateHTML = "snippet/rate-snippet.html";
    
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

    // const insertProperty = function (string, propName, propValue) {
    //     let propToReplace = "{{" + propName + "}}";
    //     string = string
    //       .replace(new RegExp(propToReplace, "g"), propValue);
    //     return string;
    // };

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

    document.addEventListener("DOMContentLoaded", function (event) {


    showLoading("#summary");
    // $ajaxUtils.sendGetRequest(
    // tableUrl,
    // buildAndShowSummaryHTML);

    // function buildAndShowSummaryHTML (categories) {

    //     $ajaxUtils.sendGetRequest(
    //         summaryHTML,
    //         function (summaryHTML) {
    //           let summaryViewHtml =
    //             buildSummaryViewHtml(categories,
    //                                     summaryHTML);
    //           insertHtml("#summary", summaryViewHtml);
    //         },
    //         false);
    // }

    // function buildSummaryViewHtml(categories,
    //     summaryHTML) {
        
        
    //     let html = summaryHTML;
    //     //let confirmedcases = categories.data.totalConfirmedCases;
    //     let confirmedcases = categories["summary"]["Confirmed Cases"];
    //     //var activecases = categories.data.totalActiveCases;
    //     let totaldeath = categories["summary"]["Death"];
    //     let totaldischarged = categories["summary"]["Discharged Cases"];
      
    //     html = insertProperty(html, "total_cases", confirmedcases);
    //     html = insertProperty(html, "total_death", totaldeath);
    //     html = insertProperty(html, "total_discharged", totaldischarged);

    //     return html

    //     }

    
        showLoading("#rate");
        // $ajaxUtils.sendGetRequest(
        // tableUrl,
        // buildAndShowRateHTML);
    
        // function buildAndShowRateHTML (categories) {
    
        //     $ajaxUtils.sendGetRequest(
        //         rateHTML,
        //         function (rateHTML) {
        //           let rateViewHtml =
        //             buildRateViewHtml(categories,
        //                                     rateHTML);
        //           insertHtml("#rate", rateViewHtml);
        //         },
        //         false);
        // }
    
        // function buildRateViewHtml(categories,
        //     rateHTML) {
            
            
        //     let html = rateHTML;
            
        //     const ratedeath = Math.round((Number(categories["summary"]["Death"].replace(/,/g, ""))) / (Number(categories["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;
        //     const rateDischarged = Math.round((Number(categories["summary"]["Discharged Cases"].replace(/,/g, ""))) / (Number(categories["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;
            
        //     html = insertProperty(html, "rate_death", (ratedeath+"%"));
        //     html = insertProperty(html, "rate_discharge", (rateDischarged+"%"));
    
        //     return html
    
        //     }



    showLoading("#tabledata");
    fetch(tableUrl).then(function(response) {
      console.log(response.status) 
      return response.json()}).then(function(wholeJson) {
        
        loadTable(wholeJson);
        loadSummary(wholeJson);
      }).catch(function(error) {
        console.log(error);
        loadError(error, "#tabledata")
      });
   
    showLoading("#folium-map");
   

    //   $ajaxUtils.sendGetRequest(
    //       iframeHTML,
    //       function (iframeHTML) {
    //         let iframeViewHtml =
    //           buildIframeViewHtml(
    //                                   iframeHTML);
    //         insertHtml("#folium-map", iframeViewHtml);
    //       },
    //       false);
    

    // function buildIframeViewHtml(
    //     iframeHTML) {
        
        
    //     //let html = iframeHTML;
    //     //const site = foliumURL;
        
    //     iframeHTML = insertProperty(iframeHTML, "site_name", foliumURL);
    //     return iframeHTML;
    // }



});


})();