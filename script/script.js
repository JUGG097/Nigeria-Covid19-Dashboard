(function (global) {

    var dc = {};
    
    var tableHtml = "snippet/table-snippet.html";

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

    const insertProperty = function (string, propName, propValue) {
        let propToReplace = "{{" + propName + "}}";
        string = string
          .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    document.addEventListener("DOMContentLoaded", function (event) {


    showLoading("#summary");
    $ajaxUtils.sendGetRequest(
    tableUrl,
    buildAndShowSummaryHTML);

    function buildAndShowSummaryHTML (categories) {

        $ajaxUtils.sendGetRequest(
            summaryHTML,
            function (summaryHTML) {
              let summaryViewHtml =
                buildSummaryViewHtml(categories,
                                        summaryHTML);
              insertHtml("#summary", summaryViewHtml);
            },
            false);
    }

    function buildSummaryViewHtml(categories,
        summaryHTML) {
        
        
        let html = summaryHTML;
        //let confirmedcases = categories.data.totalConfirmedCases;
        let confirmedcases = categories["summary"]["Confirmed Cases"];
        //var activecases = categories.data.totalActiveCases;
        let totaldeath = categories["summary"]["Death"];
        let totaldischarged = categories["summary"]["Discharged Cases"];
      
        html = insertProperty(html, "total_cases", confirmedcases);
        html = insertProperty(html, "total_death", totaldeath);
        html = insertProperty(html, "total_discharged", totaldischarged);

        return html

        }

    
        showLoading("#rate");
        $ajaxUtils.sendGetRequest(
        tableUrl,
        buildAndShowRateHTML);
    
        function buildAndShowRateHTML (categories) {
    
            $ajaxUtils.sendGetRequest(
                rateHTML,
                function (rateHTML) {
                  let rateViewHtml =
                    buildRateViewHtml(categories,
                                            rateHTML);
                  insertHtml("#rate", rateViewHtml);
                },
                false);
        }
    
        function buildRateViewHtml(categories,
            rateHTML) {
            
            
            let html = rateHTML;
            
            const ratedeath = Math.round((Number(categories["summary"]["Death"].replace(/,/g, ""))) / (Number(categories["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;
            const rateDischarged = Math.round((Number(categories["summary"]["Discharged Cases"].replace(/,/g, ""))) / (Number(categories["summary"]["Confirmed Cases"].replace(/,/g, ""))) * 1000) / 10;
            
            html = insertProperty(html, "rate_death", (ratedeath+"%"));
            html = insertProperty(html, "rate_discharge", (rateDischarged+"%"));
    
            return html
    
            }



    showLoading("#tabledata");
    $ajaxUtils.sendGetRequest(
    tableUrl,
    buildAndShowCategoriesHTML);

    function buildAndShowCategoriesHTML (categories) {

        $ajaxUtils.sendGetRequest(
            tableHtml,
            function (tableHtml) {
              let categoriesViewHtml =
                buildCategoriesViewHtml(categories,
                                        tableHtml);
              insertHtml("#tabledata", categoriesViewHtml);
            },
            false);
    }

    function buildCategoriesViewHtml(categories,
        tableHtml) {
        
        let finalHtml = "<table class='table table-striped table-bordered table-hover text-center'>";
        finalHtml += "<thead> <tr> <th scope='col' class='tileshead'>State</th> <th scope='col' class='tilesorangehead'>Cases</th> <th scope='col' class='tilesgreenhead'>Recovered</th> <th scope='col' class='tilesredhead'>Deaths</th>  </tr> </thead> <tbody>"
        // Loop over states
        for (statename of Object.keys(categories["states"])) {
            // Insert state values
            let html = tableHtml;
            let state = statename;
            let cases = categories["states"][statename][0]["confirmed"];
            let death = categories["states"][statename][0]["deaths"];
            let discharged = categories["states"][statename][0]["discharged"];
            html = insertProperty(html, "state", state);
            html = insertProperty(html, "cases", cases);
            html = insertProperty(html, "deaths", death);
            html = insertProperty(html, "discharged", discharged);

            finalHtml += html;
        }

        
        finalHtml += "</tbody> </table>";

        return finalHtml;
    }

    showLoading("#folium-map");
   

      $ajaxUtils.sendGetRequest(
          iframeHTML,
          function (iframeHTML) {
            let iframeViewHtml =
              buildIframeViewHtml(
                                      iframeHTML);
            insertHtml("#folium-map", iframeViewHtml);
          },
          false);
    

    function buildIframeViewHtml(
        iframeHTML) {
        
        
        //let html = iframeHTML;
        //const site = foliumURL;
        
        iframeHTML = insertProperty(iframeHTML, "site_name", foliumURL);
        return iframeHTML;
    }



});
global.$dc = dc;

})(window);