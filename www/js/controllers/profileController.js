angular.module('app.controllers')
.controller("profileCtrl", function($rootScope , $scope, $state,$ionicPopup){
	$scope.logout = function(){

		$ionicPopup.confirm({
		     title: 'Zerowait',
		     template: 'Are you sure you want to exit?'
		}).then(function(res){
			if(res){
				$rootScope = null;
				$state.go('home');			
			}
		});
	}
		
});