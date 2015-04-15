// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.factory("Beacon", function(){
        var beacon = {};

        beacon.beaconRegion = null;
        beacon.delegate = null;
        beacon.status = 0;

        beacon.helloWorld = function(){
            console.log("HELLO WORLD!");
        };

        beacon.startedMonitoring = function(plugin){

        };

        beacon.getStatus = function(){
            return beacon.status;
        };

        beacon.didEnterRegion = function(plugin){
            console.log("Hello, from beacon!");
            beacon.status = 1;
        };

        beacon.didExitRegion = function(plugin){
            console.log("Goodbye, from beacon!");
            beacon.status = 0;
        };

        return beacon;
    })



.run(function(Beacon,$ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }


var delegate = new cordova.plugins.locationManager.Delegate();

      delegate.didDetermineStateForRegion = function (pluginResult) {

          cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
          + JSON.stringify(pluginResult));
      };

      delegate.didStartMonitoringForRegion = function (pluginResult) {
          Beacon.startedMonitoring(pluginResult);
      };

      delegate.didRangeBeaconsInRegion = function (pluginResult) {
          console.log("In Region");
          console.log(JSON.stringify(pluginResult));
      };

      delegate.didEnterRegion = function(pluginResult) {
          Beacon.didEnterRegion(pluginResult);
      };

      delegate.didExitRegion = function(pluginResult){
          Beacon.didExitRegion(pluginResult);
      };

      var uuid = '2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6'; // mandatory
      var identifier = 'flyer'; // mandatory
      var minor = 1; // optional, defaults to wildcard if left empty
      var major = 1; // optional, defaults to wildcard if left empty

      // throws an error if the parameters are not valid
      var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);

      cordova.plugins.locationManager.setDelegate(delegate);



      cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
          .fail(console.error)
          .done();

      /*
       cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
       .fail(console.error)
       .done();
       */
  });

})

.controller('control',function($scope,Beacon,$interval){
        /*
         $scope.button = {
         text: "Start Monitoring",
         status: 0, //0 for off, 1 for on
         icon: "ion-eye",
         };
         */


        $scope.showAd = false;

        $scope.checkBeacon = function(){
            if(Beacon.getStatus() == 1){
                $scope.showAd = true;
            }
            else{
                $scope.showAd = false;
            }
        };

})



//states

 .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.adds', {
      url: "/adds",
      views: {
        'menuContent': {
          templateUrl: "templates/adds.html",
          controller: 'AddsCtrl'
        }
      }
    })

  .state('app.add', {
    url: "/adds/:addId",
    views: {
      'menuContent': {
        templateUrl: "templates/add.html",
        controller: 'AddCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/app/adds');
});


