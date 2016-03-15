angular.module('app.controllers') //signup controller
.controller("homeCtrl", function($scope, $rootScope, AuthenticateService,$state,$ionicPopup,$ionicLoading,ngFB){

	$scope.fblogin = function(){
		ngFB.login({scope: 'email,publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {

            	$ionicLoading.show({
					content : "<i class=\"ion-loading-c\"></i>",
					animation: 'fade-in',
					showBackdrop : true,
					maxWidth:80
				});
                            
                ngFB.api({
                	path : '/me',
                	params : {fields : 'id,first_name,last_name,email'}
                }).then(function(user){
                	var data = {
                		fname : user.first_name,
                		lname : user.last_name,
                		email : user.email,
                		phone : '',
                		pass : ''
                	};
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
                },function(err){

                	$ionicLoading.hide();
                	$ionicPopup.alert({
						title : "FB Login Error",
						template : JSON.stringify(err)
					});
                });
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        });
	}

});