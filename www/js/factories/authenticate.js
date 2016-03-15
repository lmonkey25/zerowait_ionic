angular.module("authenticate",[]) //define Authenticate module for user
.factory("AuthenticateService",["$q","apiSvc", "$cordovaGeolocation",function($q,apiSvc,$cordovaGeolocation){
	var ret = {
		login : function(username , password){ //login function
			var deferred = $q.defer();
			console.log("login authenticateService function is called.");

			var data = { pass : password };

			var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(emailPattern.test(username)){
            	data.email = username;
            }else{
            	data.phone = username;
            }
            //call post function of api module for api call.
			apiSvc.post(urls.login,data).then(function(data){

				console.log("login authenticate function is success.");
				deferred.resolve(data);

			},function(err){

				console.log("login authenticate function is failed.");
				deferred.reject(err);
			});

			return deferred.promise;
		},

		signup : function(data){ //signup function

			var deferred = $q.defer();

			var options = {
				timeout : 10000,
				enableHighAccuracy: false		
			};
		
			$cordovaGeolocation.getCurrentPosition(options).then(function(position){
				data.lat = position.coords.latitude;
				data.lng = position.coords.longitude;		

				 //call post function of api module for api call.
				apiSvc.post(urls.signup , data).then(function(ret){

					console.log("signup function is success");
					deferred.resolve(ret);

				},function(err){

					console.log("signup function is failed.");
					deferred.reject(err);
					
				});												

			},function(err){
				console.log("signup function is failed.");
				deferred.resolve({
					err : [{
						"msg" : "Please check location setting."
					}]
				});			
			});
			return deferred.promise;
		}
	};

	return ret;
}]);