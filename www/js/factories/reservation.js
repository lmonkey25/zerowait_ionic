angular.module("reservation",[]) //define Authenticate module for user
.factory("ReserveService",["$q","apiSvc", "$rootScope" , function($q,apiSvc,$rootScope){
	var ret = {
		create : function(data){
			var deferred = $q.defer();
			apiSvc.post(urls.reserve,data).then(function(data){
				if(data.err){
					deferred.reject(data.err);
				}else{
					deferred.resolve(data);
				}				
			},function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		},
		edit : function(data){
			var deferred = $q.defer();
			apiSvc.post(urls.reservedit,data).then(function(data){
				if(data.err){
					deferred.reject(data.err);
				}else{
					deferred.resolve(data);
				}				
			},function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		},
		getCurrentReservation : function(){
			var deferred = $q.defer();
			data  = {
				id : $rootScope.user.id
			};
			apiSvc.post(urls.getcurrentreservations,data).then(function(data){
				if(data.err){
					deferred.reject(data.err);
				}else{
					deferred.resolve(data);
				}				
			},function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		},
		delete : function(id){
			var deferred = $q.defer();
			data  = {
				id : id
			};
			apiSvc.post(urls.reservationdelete,data).then(function(data){
				if(data.err){
					deferred.reject(data.err);
				}else{
					deferred.resolve(data);
				}				
			},function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}
	}

	return ret;
}]);