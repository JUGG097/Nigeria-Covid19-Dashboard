(function (global) {

    var dc = {};
    
    var tableHtml = "snippet/table-snippet.html";

    var iframeHTML = "snippet/iframe-snippet.html";

    var foliumURL = "https://folium-choropleth-map.herokuapp.com";

    var tableUrl = "https://covidnigeria.herokuapp.com/api/";

    var summaryHTML = "snippet/total-snippet.html"
    
    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
    
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
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
              var summaryViewHtml =
                buildSummaryViewHtml(categories,
                                        summaryHTML);
              insertHtml("#summary", summaryViewHtml);
            },
            false);
    }

    function buildSummaryViewHtml(categories,
        summaryHTML) {
        
        
        var html = summaryHTML;
        var confirmedcases = "" + categories.data.totalConfirmedCases;
        var activecases = categories.data.totalActiveCases;
        var totaldeath = categories.data.death;
        var totaldischarged = categories.data.discharged;
        html = insertProperty(html, "total_cases", confirmedcases);
        html = insertProperty(html, "total_active_cases", activecases);
        html = insertProperty(html, "total_death", totaldeath);
        html = insertProperty(html, "total_discharged", totaldischarged);

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
              var categoriesViewHtml =
                buildCategoriesViewHtml(categories,
                                        tableHtml);
              insertHtml("#tabledata", categoriesViewHtml);
            },
            false);
    }

    function buildCategoriesViewHtml(categories,
        tableHtml) {
        
        var finalHtml = "<table class='table table-striped table-bordered table-hover text-center'> <caption>Case Distribution per State</caption>";
        finalHtml += "<thead> <tr> <th scope='col' class='tileshead'>State</th> <th scope='col' class='tilesorangehead'>Cases</th> <th scope='col' class='tilesgreenhead'>Discharged</th> <th scope='col' class='tilesredhead'>Deaths</th>  </tr> </thead> <tbody>"
        // Loop over categories
        for (var i = 0; i < categories.data.states.length; i++) {
        // Insert category values
        var html = tableHtml;
        var state = "" + categories.data.states[i].state;
        var cases = categories.data.states[i].confirmedCases;
        var death = categories.data.states[i].death;
        var discharged = categories.data.states[i].discharged;
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
            var iframeViewHtml =
              buildIframeViewHtml(
                                      iframeHTML);
            insertHtml("#folium-map", iframeViewHtml);
          },
          false);
    

    function buildIframeViewHtml(
        iframeHTML) {
        
        
        var html = iframeHTML;
        var site = foliumURL;
        
        html = insertProperty(html, "site_name", site);
        return html;
    }



});
global.$dc = dc;

})(window);