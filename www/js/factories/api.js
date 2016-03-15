angular.module("api",[]) //define api module which do api call of backend
.factory("apiSvc", [ "$http" , "$q" , function($http, $q){
	var ret = {
		post : function(uri, data){ //define api request with post method
			console.log("backend api is called.");
			var deferred = $q.defer();

			$http({
				url : uri,
				method: "POST",
				data : data
			}).success(function(data){

				console.log("api call is success");
				deferred.resolve(data);

			}).error(function(err){

				console.log("api call is failed.");
				deferred.reject(err);

			});

			return deferred.promise;
		}
	};

	return ret;
}]);