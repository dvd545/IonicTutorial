angular.module('starter.controllers', ['starter.services'])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, Beacon) {

        localDB.sync(remoteDB, {live: true, retry: true})
            .on('error', function (err) {
                console.log("Syncing stopped in AppCtrl");
                console.log(err);
            })
            .on('paused', function () {
                console.log("Syncing paused in AppCtrl");
            })
            .on('active', function () {
                console.log("active in AppCtrl");
            })
            .on('denied', function (info) {
                console.log("User denied in AppCtrl");
                console.log(info);
            });


        // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})



    .controller('FlyersCtrl', function($scope, $interval, Beacon, FlyerService, PouchDBListener) {
        $scope.showAd = false;

        $scope.checkBeacon = function(){
            console.log("Checking beacon status");
            $scope.showAd = Beacon.getStatus() === 1;
        };
        $interval(function(){$scope.checkBeacon(), $scope.getBeaconStatus();}, 2000);

        $scope.getBeaconStatus = function(){
            $scope.beaconState = Beacon.getProximity();
        }

        $scope.$root.enableRight = false;

        $scope.$on('$stateChangeStart', function() {
            $scope.$root.enableRight = true;
        });

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;


        $scope.flyers = FlyerService.getFlyers();

        $scope.$on('add', function(event, flyer) {
            console.log('a ADD caught');
            FlyerService.addFlyer(flyer);
        });

        $scope.$on('delete', function(event, id) {
            console.log('a DELETE caught');
            FlyerService.deleteFlyer(id);
        });

        $scope.delete = function(task) {
            localDB.get(task._id, function (err, doc) {
                localDB.remove(doc, function (err, res) {});
            });
        };
    })

.controller('FlyerCtrl', function($scope, FlyerService, $stateParams) {
        $scope.flyer = FlyerService.getFlyer($stateParams.flyerId)
    })


    .controller('MapCtrl', function($scope, $ionicLoading, $compile) {
        function initialize() {
            var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });

            $scope.map = map;
        }
        google.maps.event.addDomListener(window, 'load', initialize);

        $scope.centerOnMe = function() {
            if(!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        };

    })




.controller('BeaconCtrl', function($scope, Beacon, $stateParams) {
        $scope.showAd = false;

        $scope.checkBeacon = function(){
            console.log("Checking beacon status");
            $scope.showAd = Beacon.getStatus() === 1;
        };
        $interval(function(){$scope.checkBeacon(), $scope.getBeaconStatus();}, 2000);

        $scope.getBeaconStatus = function(){
            $scope.beaconState = Beacon.getProximity();
 }});


