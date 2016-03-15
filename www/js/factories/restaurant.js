angular.module("restaurant",[]) //define Authenticate module for user
.factory("RestaurantService",["$q","apiSvc",function($q,apiSvc){
	var ret = {
		getresinfos : function(lat,lng,setting){
			var deferred = $q.defer();

			apiSvc.post(urls.getresinfos,{
				lat : lat,
				lng : lng,
				setting : setting
			}).then(function(data){

				console.log("Catching getresinfos is success.");
				deferred.resolve(data);

			},function(err){

				console.log("Catching getresinfos is failed.");
				deferred.reject(err);
			});

			return deferred.promise;
		},

		getdetail : function(id){
			var deferred = $q.defer();

			apiSvc.post(urls.getresdetail,{
				id : id
			}).then(function(data){

				console.log("Catching getresinfos is success.");
				deferred.resolve(data);

			},function(err){

				console.log("Catching getresinfos is failed.");
				deferred.reject(err);
			});

			return deferred.promise;
		}
	};

	return ret;
}]);