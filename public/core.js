function namesController($scope) {
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
}

function comicsController($scope,$http) {
    $http.get("http://198.100.155.100:9001/comic")
    .success(function(response) {$scope.comics = response;});
}

function personController($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
	
	$scope.myVar = false;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };
}