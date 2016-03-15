angular.module('app.controllers')
.controller("mapCtrl", function($rootScope , $scope, $state ,$cordovaGeolocation,RestaurantService,$ionicLoading,$ionicModal,$ionicNativeTransitions,$cordovaGeolocation,$ionicPopup){

	/*** Modal Dialog ***************************************/
	var date = new Date();

	$rootScope.modalValue = {
    	mOpenCheck : true,
    	mRatingCheck : true,
    	key:'',
    	time: date.getHours()
    };   

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

    /********************************************************/
	$scope.onClick = function(){
		$ionicNativeTransitions.stateGo('list', {}, {
		    "type": "flip",
		    "direction": "right",
		    "duration": 1000,
		});
	}

	$scope.onSearch = function(){
		console.log($rootScope.modalValue);		
		date = new Date();
		if($rootScope.modalValue.mOpenCheck == true){
			$rootScope.modalValue.time = date.getHours();
		}
		$scope.getResInfos($rootScope.modalValue);
	}

	$scope.setMyLocation = function(){
		$scope.map.setCenter($rootScope.curPos);
	}

	var options = {
		timeout : 10000,
		enableHighAccuracy: false		
	};

	$scope.$on('$ionicView.enter', function(){
		$cordovaGeolocation.getCurrentPosition(options).then(function(position){		
		   $rootScope.user.lat = position.coords.latitude;
		   $rootScope.user.lng = position.coords.longitude;		

			$scope.markers = [];
			var curPos = new google.maps.LatLng($rootScope.user.lat,$rootScope.user.lng);
			$rootScope.curPos = curPos; //rootscope
			
			$scope.iw = null;
			var mapOptions = {
				center : curPos,
				zoom : 16,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			};
			$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);	
			$scope.map.set('styles',
				[  
					{
						"featureType":"water",
						"stylers":
							[
								{"color":"#19a0d8"}
							]
					},
					{ 
						"featureType":"administrative",
						"elementType":"labels.text.stroke",
						"stylers":
							[
								{"color":"#ffffff"},
								{"weight":6}
							]
					},
					{
						"featureType":"administrative",
						"elementType":"labels.text.fill",
						"stylers":[{"color":"#e85113"}]
					},
					{
						"featureType":"road.highway",
						"elementType":"geometry.stroke",
						"stylers":[
							{"color":"#efe9e4"},
							{"lightness":-40}
							]
					},
					{
						"featureType":"road.arterial",
						"elementType":"geometry.stroke",
						"stylers":[
								{"color":"#efe9e4"},
								{"lightness":-20}
							]
					},
					{
						"featureType":"road",
						"elementType":"labels.text.stroke",
						"stylers":[
							{"lightness":100}]
					},
					{
						"featureType":"road",
						"elementType":"labels.text.fill",
						"stylers":[{"lightness":-100}]
					},
					{
						"featureType":"road.highway",
						"elementType":"labels.icon"
					},
					{
						"featureType":"landscape",
						"elementType":"labels",
						"stylers":[
							{"visibility":"off"}]
					},
					{
						"featureType":"landscape",
						"stylers":[
							{"lightness":20},
							{"color":"#efe9e4"}
							]
					},
					{
						"featureType":"landscape.man_made",
						"stylers":[{"visibility":"off"}]
					},
					{
						"featureType":"water", 
						"elementType":"labels.text.stroke",
						"stylers":[{"lightness":100}]
					},
					{
						"featureType":"water",
						"elementType":"labels.text.fill",
						"stylers":[{"lightness":-100}]
					},
					{
						"featureType":"poi",
						"elementType":"labels.text.fill",
						"stylers":[{"visibility":"off"}]
					},
					{
						"featureType":"poi",
						"elementType":"labels.text.stroke",
						"stylers":[{"visibility":"off"}]
					},
					{
						"featureType":"poi",
						"elementType":"labels.icon",
						"stylers":[
							{"visibility":"off"}
							]
					},
					{
						"featureType":"road.highway",
						"elementType":"geometry.fill",
						"stylers":[
							{"color":"#efe9e4"},
							{"lightness":-25}
							]
					},
					{
						"featureType":"road.arterial",
						"elementType":"geometry.fill",
						"stylers":[
							{"color":"#efe9e4"},
							{"lightness":-10}
							]
					},
					{
						"featureType":"poi",
						"elementType":"labels",
						"stylers":[
							{"visibility":"off"}
						]
					}]
			);			
			$scope.places = new google.maps.places.PlacesService($scope.map);		
			curMarker = new google.maps.Marker({
				position : curPos,
				icon : 'img/home.png'
			});
			curMarker.setMap($scope.map);			
				
			$scope.getResInfos = function(input){
				
				$ionicLoading.show({
					template : "Searching Restaurants..."
				});
				RestaurantService.getresinfos($rootScope.user.lat, $rootScope.user.lng,input).then(function(results){
					console.log(results);
					$rootScope.results = results;

					for(i = 0; i< $scope.markers.length;i++){
						$scope.markers[i].setMap(null);
					}
					$scope.markers = [];

					for (i = 0; i < results.length; i++) {
							date = new Date();
							var time = date.getHours();
							if(time >= results[i].open_hour && time <= results[i].close_hour){
								marker = new google.maps.Marker({
									position : {
										lat : results[i].lat,
										lng : results[i].lng
									},						
									icon : 'img/pin.png'
								});	
							}else{
								marker = new google.maps.Marker({
									position : {
										lat : results[i].lat,
										lng : results[i].lng
									},						
									icon : 'img/pin1.png'
								});	
							}
								

							$scope.markers.push(marker);

							marker.set('data',results[i]);
							google.maps.event.addListener(marker,'click',function(){
								var place = this.get('data');
								var content = '';
							    content += '<table>';
							    content += '<tr class="iw_table_row">';
							    content += '<td style="text-align: right"><img class="hotelIcon" src="/img/res.png"/></td>';
							    content += '<td><b><a>&nbsp;' + place.name + '</a></b></td></tr>';
							    content += '<tr class="iw_table_row"><td class="iw_attribute_name">Address:&nbsp;</td><td>' + place.address + '</td></tr>';
							    if (place.phone1) {
							      content += '<tr class="iw_table_row"><td class="iw_attribute_name">Telephone:&nbsp;</td><td>' + place.phone1 + '</td></tr>';     
							    }
							    if (place.rating) {
							      var ratingHtml = '';
							      for (var i = 0; i < 5; i++) {
							        if (place.rating < (i + 0.5)) {
							          ratingHtml += '&#10025;';
							        } else {
							          ratingHtml += '&#10029;';
							        }
							      }
							      content += '<tr class="iw_table_row"><td class="iw_attribute_name">Rating: &nbsp;</td><td><span id="rating">' + ratingHtml + '</span></td></tr>';
							    }
							    if (place.website) {					     
							      content += '<tr class="iw_table_row"><td class="iw_attribute_name">Website: &nbsp;</td><td><a href="' + place.website + '">' + place.website + '</a></td></tr>';
							    }
							    content += '</table>';
							    
								if($scope.iw){
									$scope.iw.close();
									$scope.iw = null;
								}
								$scope.iw = new google.maps.InfoWindow({
						         	content: content
						        });
						        $scope.iw.open($scope.map, this); 
							});

							marker.setMap($scope.map);						
					}
					$ionicLoading.hide();
				},function(err){
					console.log(err);
				});	
			}

			
			$rootScope.results = [];
			/*********** call getresinfos function *********************/
			$scope.getResInfos($rootScope.modalValue);

		},function(err){
	        $ionicPopup.alert({
				title : "Location Error",
				template : "Please check location setting."
			});
		});
	});
	
	
});