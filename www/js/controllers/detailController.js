angular.module('app.controllers') //login controlller
.controller("pageCtrl", function($scope,$rootScope , $state, $stateParams,$ionicModal,ReserveService,$ionicLoading,$ionicPopup,$timeout){
	$scope.id = $stateParams.id;
   
  now = new Date();
  now.setMinutes(0);  

  now1 = new Date();
  now1.setMinutes(0);

  $scope.mOrder = {
      persons : 2,
      date : now1     
  };     

  console.log($scope.mOrder);
	
	$ionicModal.fromTemplateUrl('datetimedlg',{
		scope : $scope,
		animation : 'slide-in-up'
	}).then(function(modal){
		$scope.modal  = modal;		
	});

	$scope.onswipeleft = function(){
		$state.go('list');
	}
  	
  	$scope.showDateTimeDlg = function($event){
  		$scope.modal.show();
  	}

  	$scope.closeDateTimeDlg = function(){
  		$scope.modal.hide();
  	}

  	$scope.setOrderDateTime = function(value){
  		date = new Date($scope.mOrder.date.getTime() + value);
  		if(date > now){
  			$scope.mOrder.date  = date;
  		}
  	}
  	
  	$scope.reserve = function(){         
        console.log($scope.mOrder.persons);        
    		$ionicLoading.show({
  				content : "<i class=\"ion-loading-c\"></i>",
  				animation: 'fade-in',
  				showBackdrop : true,
  				maxWidth:80
  			});

    		var str = $scope.mOrder.date.getUTCFullYear().toString() + "/" +
            ($scope.mOrder.date.getUTCMonth() + 1).toString() +
            "/" + $scope.mOrder.date.getUTCDate() + " " + $scope.mOrder.date.getUTCHours() +
            ":" + $scope.mOrder.date.getUTCMinutes() + ":" + $scope.mOrder.date.getUTCSeconds();
        data = {
          res_id : $rootScope.results[$scope.id].id,
          scheduled_datetime : str,
          size : $scope.mOrder.persons,
          user_id : $rootScope.user.id
        };

    		ReserveService.create(data).then(function(ret){
    			$ionicLoading.hide();
    			$state.go('tabsController.reservation');
    		},function(err){
    			$ionicLoading.hide();
    			console.log(err);
    			$ionicPopup.alert({
  					title : "Reservation Error",
  					template : err[0].msg
  			   });
    		});
  	}
})

.directive('clickForOptions', ['$ionicGesture', function($ionicGesture) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $ionicGesture.on('tap', function(e){

        // Grab the content
        var content = element[0].querySelector('.item-content');

        // Grab the buttons and their width
        var buttons = element[0].querySelector('.item-options');

        if (!buttons) {
          console.log('There are no option buttons');
          return;
        }
        var buttonsWidth = buttons.offsetWidth;

        ionic.requestAnimationFrame(function() {
          content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

          if (!buttons.classList.contains('invisible')) {
            console.log('close');
            content.style[ionic.CSS.TRANSFORM] = '';
            setTimeout(function() {
              buttons.classList.add('invisible');
            }, 250);        
          } else {
            buttons.classList.remove('invisible');
            content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
          }
        });   

      }, element);
    }
  };
}])