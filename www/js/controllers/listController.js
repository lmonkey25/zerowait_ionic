angular.module('app.controllers')
.controller("listCtrl", function($rootScope , $scope, $state ,$cordovaGeolocation, $ionicFilterBar , $timeout,$ionicNativeTransitions,$ionicModal,$ionicLoading,RestaurantService){
		$scope.no = 0;
		$scope.search  = '';		

		$scope.onClick = function(){			
			$ionicNativeTransitions.stateGo('tabsController.map', {}, {
			    "type": "flip",
			    "direction": "right",
			    "duration": 1000,
			});
		}

		$scope.getDetails =  function(){
 			$scope.no = 0;
			for(i = 0; i < $rootScope.results.length;i++){	    						    		
	    		var dest = new google.maps.LatLng($rootScope.results[i].lat, $rootScope.results[i].lng);
	    					    		
	    		var service = new google.maps.DistanceMatrixService();
	    		service.getDistanceMatrix({
	    			origins: [$rootScope.curPos],
	    			destinations: [dest],
	    			travelMode: google.maps.TravelMode.DRIVING
	    		},function(response, status){
	    				console.log(JSON.stringify(response));
	    				$rootScope.results[$scope.no].distance = response.rows[0].elements[0].distance.text;
	    				$rootScope.results[$scope.no].time = response.rows[0].elements[0].duration.text;
	    				$rootScope.results[$scope.no].no = $scope.no;
	    				$scope.no++;
	    				if($scope.no == $rootScope.results.length){	    					
	    					$scope.$apply();
	    				}
	    		});
			}
		}		

		$scope.getDetails();

		/*** Modal Dialog ***************************************/
		var date = new Date(); 

		$ionicModal.fromTemplateUrl('filterModal',{
			scope : $scope,
			animation : 'slide-in-up'
		}).then(function(modal){
			$scope.modal  = modal;		
		});

		$scope.showFilterDlg = function(){
			$scope.modal.show();
		}

		$scope.closeFilterDlg = function(){
		  date = new Date();
			if($rootScope.modalValue.mOpenCheck == true){
				$rootScope.modalValue.time = date.getHours();
			}
		  $scope.getResInfos($rootScope.modalValue);	
	      $scope.modal.hide();
	    }

	    $scope.changeModalValues = function(modalValue){
	    	$rootScope.modalValue = modalValue;
	    }

	    /********************************************************/

	    $scope.onSearch = function(){		
			date = new Date();
			if($rootScope.modalValue.mOpenCheck == true){
				$rootScope.modalValue.time = date.getHours();
			}
			$scope.getResInfos($rootScope.modalValue);
		}

		$scope.getResInfos = function(input){

			$ionicLoading.show({
				template : "Searching Restaurants..."
			});
			RestaurantService.getresinfos($rootScope.user.lat, $rootScope.user.lng,input).then(function(results){
				$rootScope.results = results;
				$scope.getDetails();
				$ionicLoading.hide();
			},function(err){
				console.log(err);
			});
		
		}

});
