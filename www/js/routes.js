angular.module('app.routes', []) // module name app.routes

.config(function($stateProvider, $urlRouterProvider) {
///that is configuration of app.routes module.
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider        
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })    
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })  
        
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })    
      
    .state('tabsController', {
      url: '/page5',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })   
        
    .state('tabsController.map', {
      url: '/map',
      views: {
        'tab4': {
          templateUrl: 'templates/map.html',
          controller: 'mapCtrl'
        }
      }
    })     
        
    .state('list', {
      url: '/list', 
      templateUrl: 'templates/list.html',
      controller: 'listCtrl'
       
    })      
        
    .state('tabsController.reservation', {
      url: '/reservation',
      cache: false,
      views: {
        'tab6': {
          templateUrl: 'templates/reservation.html',
          controller: 'reservationCtrl'
        }
      }
    })     
        
    .state('tabsController.profile', {
      url: '/profile',
      views: {
        'tab7': {
          templateUrl: 'templates/profile.html',
          controller: 'profileCtrl'
        }
      }
    })      
        
    .state('detail', {
      url: '/detail:id',
      templateUrl: 'templates/detail.html',
      controller: 'pageCtrl'
    })
   ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});