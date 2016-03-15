angular.module('app.controllers') //login controlller
.controller("loginCtrl", function($cordovaFile,$scope,$rootScope,AuthenticateService,$state,$ionicPopup,$ionicLoading){

	//define local variables of login controller
	$scope.loginFormData = {};
	$scope.loginFormData.username = '';
	$scope.loginFormData.password = '';


	//define doLogin function called when clicking login button
	$scope.doLogin = function(){

		//check if email/phone and password is valid
		if($scope.loginFormData.username.trim() == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter Email/Phone."
			});
		}else if($scope.loginFormData.password == ''){
			$ionicPopup.alert({
				title : "Error",
				template : "please enter Password."
			});
		}else{

			//show circle progress bar 
			$ionicLoading.show({
				content : "<i class=\"ion-loading-c\"></i>",
				animation: 'fade-in',
				showBackdrop : true,
				maxWidth:80
			});
			console.log("doLogin function is called.");

			//do login by calling login function of Authenticate Factory
			AuthenticateService.login($scope.loginFormData.username , $scope.loginFormData.password)
			.then(function(ret){

				//if login is success, please hide circle progress bar
				$ionicLoading.hide();
				console.log("user login is success : return data = " + JSON.stringify(ret));
				//check status of user login
				if(ret.err){
					//if there are some errors when user login, show alert.
					$ionicPopup.alert({
						title : "Login Error",
						template : ret.err[0].msg
				    });
				}else{
					$rootScope.user = ret;
					//$cordovaFile.writeFile(cordova.file.documentsDirectory,"userinfo",JSON.stringify($rootScope.user),true);
					$state.go("tabsController.map"); //go to map page
				}			
			},function(err){

				//if login have errors, please show alert.
				$ionicLoading.hide();
				console.log(err);
				$ionicPopup.alert({
					title : "Network Error",
					template : "please check network connection."
				});
			});

		}	
	}

});

