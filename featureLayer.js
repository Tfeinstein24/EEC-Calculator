require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "dojo/domReady!"
      ],
      function(
        Map, MapView,
        FeatureLayer
      ) {

        var map = new Map({
          basemap: "dark-gray"
        });

        var view = new MapView({
          container: "sceneDiv",
          map: map,
          center: [-73.950, 40.702],
          zoom: 11,
          padding: {
            right: 300
          }
        });

        var listNode = document.getElementById("nyc_graphics");

        /********************
         * Add feature layer
         ********************/

        // Create the PopupTemplate
        var popupTemplate = {
          title: "Marriage in NY, Zip Code: {ZIP}",
          content: "<p><b> Marriage Rate: {MARRIEDRATE}% </b></p>" +
            "<p> Married: {MARRIED_CY}</p>" +
            "<p> Never Married: {NEVMARR_CY}</p>" +
            "<p> Divorced: {DIVORCD_CY}</p>"
        };

        // Create the FeatureLayer using the popupTemplate
        var featureLayer = new FeatureLayer({
          url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NYCDemographics1/FeatureServer/0",
          outFields: ["*"],
          popupTemplate: popupTemplate
        });
        map.add(featureLayer);

        var graphics;

        view.whenLayerView(featureLayer).then(function(lyrView) {
          lyrView.watch("updating", function(val) {
            if (!val) { // wait for the layer view to finish updating

              // query all the features available for drawing.
              lyrView.queryFeatures().then(function(results) {

                graphics = results;

                var fragment = document.createDocumentFragment();

                results.forEach(function(result, index) {
                  var attributes = result.attributes;
                  var name = attributes.ZIP + " (" +
                    attributes.PO_NAME + ")"

                  // Create a list zip codes in NY
                  var li = document.createElement("li");
                  li.classList.add("panel-result");
                  li.tabIndex = 0;
                  li.setAttribute("data-result-id", index);
                  li.textContent = name;

                  fragment.appendChild(li);
                });
                // Empty the current list
                listNode.innerHTML = "";
                listNode.appendChild(fragment);
              });
            }
          });
        });

        // listen to click event on the zip code list
        listNode.addEventListener("click", onListClickHandler);

        function onListClickHandler(event) {
          var target = event.target;
          var resultId = target.getAttribute("data-result-id");

          // get the graphic corresponding to the clicked zip code
          var result = resultId && graphics && graphics[parseInt(resultId,
            10)];

          if (result) {
            // open the popup at the centroid of zip code polygon
            // and set the popup's features which will populate popup content and title.
            view.popup.open({
              features: [result],
              location: result.geometry.centroid
            });
          }
        }

      });