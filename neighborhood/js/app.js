/**Model Data**/
//Create array of locations
var locations = [
  {name: 'Tampa Bay History Center',
  address: '801 Old Water Street, Tampa, FL 33602',
  website: 'http://tampabayhistorycenter.org/',
  latitude: 27.9422083,
  longitude: -82.4497876,
  marker: '',
  },
  {name: 'Florida Aquarium',
  address: '701 Channelside Dr, Tampa, FL 33602',
  website: 'http://www.flaquarium.org',
  latitude: 27.9442871,
  longitude: -82.4451338,
  marker: ''
  },
  {name: 'Henry B. Plant Museum',
  address: '401 West Kennedy Boulevard, Tampa, FL 33602',
  website: 'http://www.ut.edu/plantmuseum',
  latitude: 27.946538,
  longitude: -82.464194,
  marker: ''
  },
  {name: 'Busch Gardens Tampa',
  address: ' 6600 North Ashley Drive, Tampa, FL 33602',
  website: 'https://seaworldparks.com/en/buschgardens-tampa',
  latitude: 28.0338742,
  longitude: -82.4209517,
  marker: ''
  },
  {name: 'Florida Museum of Photographic Arts',
  address: '400 N Ashley Drive, Cube 200, Tampa, FL 33602',
  website: 'http://fmopa.org/',
  latitude: 27.9472534,
  longitude: -82.4601495,
  marker: ''
  },
  {name: 'Lowry Park Zoo',
  address: '1101 W Sligh Ave, Tampa, FL 33604',
  website: 'http://www.lowryparkzoo.org',
  latitude: 28.012967,
  longitude: -82.46937,
  marker: '',
  },
  {name: 'Ybor City Museum State Park',
  address: '1818 E 9th Ave, Tampa, FL 33605',
  website: 'http://www.ybormuseum.org/',
  latitude: 27.965021,
  longitude: -82.435094,
  marker: ''
  },
  {name: 'Cracker Country',
  address: '4800 US-301, Tampa, FL 33610',
  website: 'http://www.crackercountry.org/',
  latitude: 27.987732,
  longitude: -82.363279,
  marker: ''
  },
  {name: 'Tampa Museum of Art',
  address: '120 W Gasparilla Plaza, Tampa, FL 33602',
  website: 'http://tampamuseum.org/',
  latitude: 27.949470,
  longitude: -82.462603,
  marker: ''
  },
  {name: "Glazer Children's Museum",
  address: '110 W Gasparilla Plaza, Tampa, FL 33602',
  website: 'http://glazermuseum.org/',
  latitude: 27.949577,
  longitude: -82.461494,
  marker: ''
  }
];

//Place constructor uses ko.observable so view is automatically updated
var Place = function (data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.website = ko.observable(data.website);
  this.latitude = ko.observable(data.latitude);
  this.longitude = ko.observable(data.longitude);
  this.marker = '';
};

/**View Model**/
function initMap () {
  var viewModel = function () {
    //Self alias provides lexical scope
    var self = this;
    //Center map on Tampa, FL
    var mapOptions = {
      zoom: 12,
      center: {lat: 27.960291, lng: -82.454174}
    };

    map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    //Resize map when window is resized
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

    //Create observable array of markers
    self.markerArray = ko.observableArray(locations);
    //Set flag
    var openedInfoWindow = null;

    //Create markers for each location
    self.markerArray().forEach(function(placeItem) {
      contentString = ' ';
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(placeItem.latitude, placeItem.longitude),
        map: map,
        title: placeItem.name,
        link: placeItem.website,
        animation: google.maps.Animation.DROP
      });
      placeItem.marker = marker;

      //Add bounce animation to markers
      placeItem.marker.addListener('click', toggleBounce);
      function toggleBounce() {
        if (placeItem.marker.getAnimation() !== null) {
          placeItem.marker.setAnimation(null);
        } else {
          placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ placeItem.marker.setAnimation(null); }, 2100);
        }
      }

      //Create variables for use in contentString
      var windowNames = placeItem.name;
      var windowWebsite = placeItem.website;
      var windowAddresses = placeItem.address;

      //Create new infowindow
      var infoWindow = new google.maps.InfoWindow({content: contentString});
      //Open infoWindow when marker is clicked

      google.maps.event.addListener(placeItem.marker, 'click', function() {
        //Use encodeURI method to replace symbols and spaces with UTF-8 encoding of character
        var formatName = encodeURI(placeItem.name);

        //Wikipedia API request URL
        var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + formatName + "&limit=1&redirects=return&format=json";
        var wikiRequestTimeout = setTimeout(function(){
           alert("Failed to get Wikipedia resource");
        }, 8000);

        $.ajax ({
          url: wikiUrl,
          dataType: "jsonp",
          jsonp: "callback",
          success: function (response){
            var articleList = response[1];
            //If no article is found alert user and supply location website URL
              if (articleList.length <= 0) {
                var url = windowWebsite;
                contentString = '<div id="content">' + windowNames + '<p>' + windowAddresses + '</p>' +  '<p>' + 'No articles found on Wikipedia'+ '</p>' + '<a href=" ' + url + '" target="_blank">' + url + '</a>' + '</div>';
                infoWindow.setContent(contentString);
                if (openedInfoWindow !== null) openedInfoWindow.close();
                infoWindow.open(map, placeItem.marker);
                openedInfoWindow = infoWindow;
                google.maps.event.addListener(infoWindow, 'closeclick', function() {
                  openedInfoWindow = null;
                });
              }
              //If an article is found, populate infowindow with response and location's website address
              else {
              for (var i=0; i<articleList.length; i++) {
                articleStr = articleList[i];
                var url = windowWebsite;
                contentString = '<div id="content">' + windowNames + '<p>' + windowAddresses + '</p>' + '<p>' + response[2] + '</p>' + '<a href=" ' + url + '" target="_blank">' + url + '</a>' + '</div>';
                infoWindow.setContent(contentString);
                }
                if (openedInfoWindow !== null) openedInfoWindow.close();
                infoWindow.open(map, placeItem.marker);
                openedInfoWindow = infoWindow;
                google.maps.event.addListener(infoWindow, 'closeclick', function() {
                  openedInfoWindow = null;
                });
              }
            clearTimeout(wikiRequestTimeout);
          }
        });
        return false;
      });
    });

    //Connect marker to list selection
    self.markerConnect = function(marker) {
      google.maps.event.trigger(this.marker, 'click');
    };

    //Make filter search input an observable
    self.query= ko.observable('');

    //ko.computed is used to filter and return items that match the query string input by users
    self.filteredPlaces = ko.computed(function(placeItem) {
      var filter = self.query().toLowerCase();
      //If searchbox empty return the full list and set all markers visible
      if (!filter) {
        self.markerArray().forEach(function(placeItem) {
          placeItem.marker.setVisible(true);
        });
        return self.markerArray();
      //Else use startsWith to compare search term to list and make visible those that match
      } else {
        return ko.utils.arrayFilter(self.markerArray(), function(placeItem) {
          searchTerm = strStartsWith(placeItem.name.toLowerCase(), filter);
          placeItem.marker.setVisible(false);
            if (searchTerm) {
              placeItem.marker.setVisible(true);
              return searchTerm;
            }
        });
      }
    }, self);

    var strStartsWith = function (string, startsWith) {
      string = string || "";
      if (startsWith.length > string.length) {
        return false;
      }
      return string.substring(0, startsWith.length) === startsWith;
    };

  };
  //Call the viewModel function
  ko.applyBindings(new viewModel());
}