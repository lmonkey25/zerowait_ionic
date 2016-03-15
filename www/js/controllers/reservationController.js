angular.module('app.controllers')
.controller("reservationCtrl", function($scope, $rootScope,$ionicPopup,$ionicLoading,ReserveService,$timeout,$state,$ionicModal){   

   var date_lower = null;
   var date_upper = null;

	$scope.currentreservations = [];
	$scope.pastreservations = [];  

   $scope.mOrderChange = null;

   $ionicModal.fromTemplateUrl('editdlg',{
      scope : $scope,
      animation : 'slide-in-up'
   }).then(function(modal){
      $scope.modal  = modal;     
   });

   $scope.showEditDlg = function(index){     
      $scope.mOrderChange = {
         index :  index,
         scheduled_datetime : new Date($scope.currentreservations[index].scheduled_datetime),
         vid : $scope.currentreservations[index].vid,
         user_id : $scope.currentreservations[index].user_id
      };

      date_lower =  new Date($scope.currentreservations[index].scheduled_datetime);
      date_lower.setHours(0);
      date_lower.setMinutes(0);

      date_upper = new Date($scope.currentreservations[index].scheduled_datetime);
      date_upper.setHours(23);
      date_upper.setMinutes(59); 
      $scope.modal.show();
   }

   $scope.closeEditDlg = function(){
         var now =  $scope.mOrderChange.scheduled_datetime;
         var str = now.getUTCFullYear().toString() + "/" +
          (now.getUTCMonth() + 1).toString() +
          "/" + now.getUTCDate() + " " + now.getUTCHours() +
          ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds();

         $scope.mOrderChange.scheduled_datetime = str;
         ReserveService.edit($scope.mOrderChange).then(function(ret){            
            $scope.currentreservations[$scope.mOrderChange.index].scheduled_datetime = now;
            $ionicLoading.hide();
         },function(err){
            $ionicLoading.hide();
            console.log(err);
            $ionicPopup.alert({
               title : "Reservation Error",
               template : err[0].msg
            });
         });
      $scope.modal.hide();
   }

   $scope.setOrderDateTime = function(value){
      date = new Date($scope.mOrderChange.scheduled_datetime.getTime() + value);
      if(date >= date_lower && date < date_upper){
         $scope.mOrderChange.scheduled_datetime  = date;
      }
   }

   
   $scope.delete = function(index){
      $ionicPopup.confirm({
           title: 'Zerowait',
           template: 'Are you sure you want to exit?'
      }).then(function(res){
         if(res){
            $ionicLoading.show({
               content : "<i class=\"ion-loading-c\"></i>",
               animation: 'fade-in',
               showBackdrop : true,
               maxWidth:80
            });

            ReserveService.delete($scope.currentreservations[index].vid).then(function(ret){
               $ionicLoading.hide();
               $scope.currentreservations.splice(index,1);
            },function(err){
               console.log(err);
               $ionicLoading.hide();
            });           
         }
      });    
          
   }

   $ionicLoading.show({
		content : "<i class=\"ion-loading-c\"></i>",
		animation: 'fade-in',
		showBackdrop : true,
		maxWidth:80
	});

   $timeout(function() {
   		ReserveService.getCurrentReservation().then(function(ret){
   			$ionicLoading.hide();
   			$scope.currentreservations = ret; 
   			console.log(ret);  			
   		},function(err){
   			$ionicLoading.hide();  
   			console.log(err); 			
   			console.log("error");
   		});
   }, 10);
});