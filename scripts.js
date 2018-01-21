
  var mochaMap;
  var infoWindows = [];
  var markers = [];
  function initMap() {
      mochaMap = new google.maps.Map(document.getElementById('mochaMap'), {
        center: new google.maps.LatLng(39.708539, -104.983145),
        zoom: 5,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#523735"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#c9b2a6"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#dcd2be"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ae9e90"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#93817c"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#a5b076"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#447530"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#fdfcf8"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f8c967"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#e9bc62"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e98d58"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#db8555"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#806b63"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8f7d77"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#b9d3c2"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#92998d"
              }
            ]
          }
        ]
      });

      // fetch coffee shops from the database,
        // generate a marker and infoWindow for each
      getCoffeeShops();

      // set up search
      var input = document.getElementById('mapSearch');
      var autocomplete = new google.maps.places.Autocomplete(
          input, {placeIdOnly: true});
      autocomplete.bindTo('bounds', mochaMap);
      mochaMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      autocomplete.addListener('place_changed', function() {
        var placeID = autocomplete.getPlace().place_id;
        var infoWindow;
        if (infoWindows[placeID]) {
          infoWindow = infoWindows[placeID];
        }
        else {
          infoWindow = new google.maps.InfoWindow();
          infoWindows[placeID] = infoWindow;
        }
        generateMarkerAndInfoWindow(infoWindow, placeID, '', '');
      });
    }

    function generateMarkerAndInfoWindow(infoWindow, placeID, category, visitedDate) {

      var marker = new google.maps.Marker({ map: mochaMap });
      //markers.push(marker);
      var service = new google.maps.places.PlacesService(mochaMap);
      service.getDetails({ placeId: placeID }, function(place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          marker.setPlace({
            placeId: placeID,
            location: place.geometry.location
          });
          marker.setVisible(true);

          var streetNumber, streetName, city, state, zip;
          place.address_components.forEach(function(component) {
            switch (component.types[0]) {
              case 'street_number':
                streetNumber = component.short_name;
              case 'route':
                streetName = component.short_name;
              case 'locality':
                city = component.short_name;
              case 'administrative_area_level_1':
                state = component.short_name;
              case 'postal_code':
                zip = component.short_name;
            }
          });
          var placeName = place.name;
          var streetAddress = streetNumber + " " + streetName;
          var cityStateZip = city + ", " + state + " " + zip;
          var contentString = '<p><span class="bold">' + placeName + '</span><br>' + streetAddress + '<br>' + cityStateZip + '</p>';

          if (category == '' && visitedDate == '') {
            if (infoWindow.content === undefined) {
              contentString += '<div id="alertDiv" class="alert" role="alert"></div>' +
              '<p>Specify a category to add this coffee shop to your MochaMap.</p>' +
              '<div><form id="selectCategory" data-toggle="buttons">' +
              '<input type="hidden" id="placeID" value=' + placeID + '>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="visited">Mark as Visited</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="favorite">Mark as Favorite</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="bucketlist">Add to Bucket List</label></form>' +
              '<br><p>When did you visit?<br><input type="date" id="visitedDate"></p>' +
              '<input type="button" class="btn btn-outline-secondary" value="Add" onclick="addCoffeeShop()">' +
              '</div>';
              infoWindow.setContent(contentString);
            }
            mochaMap.setCenter(marker.place.location);
            mochaMap.setZoom(15);
            for (var index in infoWindows) {
              infoWindows[index].close();
            }
            infoWindow.open(mochaMap, marker);
          }
          else {
            var date = visitedDate.split('-');
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var month = months[parseInt(date[1])-1];
            if (category == 'bucketlist') {
              contentString += '<div id="alertDiv" class="alert" role="alert"></div>' +
              '<p>This coffee shop is on your bucket list.</p>' +
              '<div><form id="selectCategory" data-toggle="buttons">' +
              '<input type="hidden" id="placeID" value=' + placeID + '>' +
              '<label class="btn btn-primary active">' +
              '<input type="radio" name="category" id="bucketlist" checked>On your Bucket List</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="visited">Mark as Visited</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="favorite">Mark as Favorite</label></form>' +
              '<br><p>When did you visit?<br><input type="date" id="visitedDate"></p>' +
              '<input type="button" class="btn btn-outline-secondary" value="Update" onclick="updateCoffeeShop()">' +
              '</div>';
            } else if (category == 'favorite') {
              contentString += '<div id="alertDiv" class="alert" role="alert"></div>' +
              '<p>You visited this coffee shop on ' + month + ' ' + date[2] + ', ' + date[0] +
              '.<br>This is one of your favorite coffee shops.</p>' +
              '<div><form id="selectCategory" data-toggle="buttons">' +
              '<input type="hidden" id="placeID" value=' + placeID + '>' +
              '<label class="btn btn-primary active">' +
              '<input type="radio" name="category" id="favorite" checked>Favorite</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="visited">Remove from Favorites</label>' +
              '<br><br><input type="button" class="btn btn-outline-secondary" value="Update" onclick="updateCoffeeShop()">' +
              '</div>';
            } else {
              contentString += '<div id="alertDiv" class="alert" role="alert"></div>' +
              '<p>You visited this coffee shop on ' + month + ' ' + date[2] + ', ' + date[0] + '.</p>' +
              '<div><form id="selectCategory" data-toggle="buttons">' +
              '<input type="hidden" id="placeID" value=' + placeID + '>' +
              '<label class="btn btn-primary active">' +
              '<input type="radio" name="category" id="visited" checked>Visited</label>' +
              '<label class="btn btn-primary">' +
              '<input type="radio" name="category" id="favorite">Mark as Favorite</label>' +
              '<br><br><input type="button" class="btn btn-outline-secondary" value="Update" onclick="updateCoffeeShop()">' +
              '</div>';
            }
            infoWindow.setContent(contentString);
          }

          marker.addListener('click', function() {
            mochaMap.setCenter(marker.place.location);
            mochaMap.setZoom(15);
            for (var index in infoWindows) {
              infoWindows[index].close();
            }
            infoWindow.open(mochaMap, marker);
          });

        }

      });
    }

    function getCoffeeShops() {
      $.ajax({
        type: "POST",
        url: "queries.php?query=getCoffeeShops",
        success: function(result) {
          console.log(result);
          var coffeeShops = result.documentElement.getElementsByTagName('coffeeShop');
          Array.prototype.forEach.call(coffeeShops, function(coffeeShopElem) {
            var placeID = coffeeShopElem.getAttribute('placeID');
            var category = coffeeShopElem.getAttribute('category');
            var visitedDate = coffeeShopElem.getAttribute('visitedDate');
            var infoWindow = new google.maps.InfoWindow();
            infoWindows[placeID] = infoWindow;
            generateMarkerAndInfoWindow(infoWindow, placeID, category, visitedDate);
          });
        }
      });
    }

    function addCoffeeShop() {
      var category = getSelectedCategory(document.getElementById('selectCategory'), 'category');
      $.ajax({
        type: "POST",
        url: "queries.php?query=addCoffeeShop",
        data: "placeID=" + $("#placeID").val() + "&category=" + category + "&visitedDate=" + $("#visitedDate").val(),
        success: function(result) { alertResult(result); }
      });
    }

    function updateCoffeeShop() {
      var category = getSelectedCategory(document.getElementById('selectCategory'), 'category');
      $.ajax({
        type: "POST",
        url: "queries.php?query=updateCoffeeShop",
        data: "placeID=" + $("#placeID").val() + "&category=" + category + "&visitedDate=" + $("#visitedDate").val(),
        success: function(result) { alertResult(result); }
      });
    }

    function alertResult(result) {
      if (result.includes("Success")) {
        $("#alertDiv").addClass('alert-success');
        $("#alertDiv").removeClass('alert-danger');
      }
      else {
        $("#alertDiv").addClass('alert-danger');
        $("#alertDiv").removeClass('alert-success');
      }
      $("#alertDiv").html(result).show();
    }

    function getSelectedCategory(form, name) {
      var val;
      var radioCategories = form.elements[name];
      for (var i=0; i<radioCategories.length; i++) {
        if (radioCategories[i].checked) {
          val = radioCategories[i].id;
          break;
        }
      }
      return val;
    }
