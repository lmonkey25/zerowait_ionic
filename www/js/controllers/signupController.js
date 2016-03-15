angular.module('app.controllers') //signup controller
.controller("signupCtrl", function($scope, $rootScope, AuthenticateService,$state,$ionicPopup,$ionicLoading){

	// define local variable of signup controller
	$scope.signupFormData = {};
	$scope.signupFormData.fname = '';
	$scope.signupFormData.lname = '';
	$scope.signupFormData.email = '';
	$scope.signupFormData.phone = '';
	$scope.signupFormData.password = '';

	//define doSignup function called when user click signup button
	$scope.doSignup = function(){

		console.log("signupController doSignup function is called.");

		//define email validation patter
		var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		//check validation of user validation
		if($scope.signupFormData.fname.trim() == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter First Name."
			});
		}else if($scope.signupFormData.lname.trim() == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter Last Name."
			});
		}else if($scope.signupFormData.email.trim() == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter Email."
			});
		}else if(!emailPattern.test($scope.signupFormData.email.trim())){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter valid Email."
			});
		}else if($scope.signupFormData.phone.trim() == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter Phone number."
			});
		}else if($scope.signupFormData.phone.trim().length > 15 || $scope.signupFormData.phone.trim().length < 10){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter valid Phone number."
			});
		}else if($scope.signupFormData.password.password == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter password."
			});
		}else if($scope.signupFormData.password.length < 6 || $scope.signupFormData.password.length > 11){
			$ionicPopup.alert({
				title : "Error",
				template : "Password must have 6 - 11 specifics."
			});
		}else{

			//if validation of user information is ok, please show circle progress bar
			$ionicLoading.show({
				content : "<i class=\"ion-loading-c\"></i>",
				animation: 'fade-in',
				showBackdrop : true,
				maxWidth:80
			});

			var data  = {
				fname : $scope.signupFormData.fname.trim(),
				lname : $scope.signupFormData.lname.trim(),
				email : $scope.signupFormData.email.trim(),
				phone : $scope.signupFormData.phone.trim(),
				pass : $scope.signupFormData.password
			};			

			//call signup function of Authenticate Service
			AuthenticateService.signup(data).then(function(ret){
				
				$ionicLoading.hide(); //hide circle progress				
				if(ret.err){	//if there are some errors, show alert
					$ionicPopup.alert({
						title : "Singup Error",
						template : ret.err[0].msg
				    });
				}else{
					$rootScope.user = ret;
					$state.go("tabsController.map");//go to map page
				}			

			},function(err){					
				$ionicLoading.hide(); //hide circle progress
				console.log(err);
				$ionicPopup.alert({
					title : "Network Error",
					template : "please check network connection."
				});

			});			
			
		}
	}	

});
