// script.js

    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute']);
	
	scotchApp.run(function($rootScope) {
		$rootScope.userName = 'place';
	})

    // configure our routes
    scotchApp.config(function($routeProvider, $locationProvider, $httpProvider) {

		$httpProvider.responseInterceptors.push(function($q, $location) {
			return function(promise) {
				return promise.then(
				// Success: just return the response
				function(response){
					return response;
				},
				// Error: check the error status to get only the 401
				function(response) {
					if (response.status === 401) $location.url('/login');
						return $q.reject(response);
				});
		}});
		
		var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();
			// Make an AJAX call to check if the user is logged in
			$http.get('/loggedin').success(function(user){
				// Authenticated
				if (user !== '0') {
					$rootScope.userName = user.local.email;
					$timeout(deferred.resolve, 0);
				}
				// Not Authenticated
				else {
					$rootScope.message = 'You need to log in.';
					$timeout(function(){deferred.reject();}, 0);
				
					$location.url('/login');
				}
			});
		};
		
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/comics.html',
                controller  : 'comicsController',
				resolve: {
					loggedin: checkLoggedin
				}
            })
			
			.when('/comic/:comicId', {
                templateUrl : 'pages/home.html',
                controller  : 'comicController',
				resolve: {
					loggedin: checkLoggedin
				}
            })

            // route for the about page
            .when('/comics', {
                templateUrl : 'pages/comics.html',
                controller  : 'comicsController',
				resolve: {
					loggedin: checkLoggedin
				}
            })

            // route for the contact page
            .when('/user', {
                templateUrl : 'pages/user.html',
                controller  : 'userController',
				resolve: {
					loggedin: checkLoggedin
				}
            })

            // route for the contact page
            .when('/users/:user_id', {
                templateUrl : 'pages/users.html',
                controller  : 'usersController',
				resolve: {
					loggedin: checkLoggedin
				}
            })
			
			.when('/marvel', {
                templateUrl : 'pages/marvel.html',
                controller  : 'marvelController',
				resolve: {
					loggedin: checkLoggedin
				}
            })
			
			.when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })
			
			.when('/signup', {
                templateUrl : 'pages/signup.html',
                controller  : 'signUpController'
            })
			
			.when('/logout', {
                templateUrl : 'pages/logout.html',
                controller  : 'logoutController'
            })
			
			.otherwise({
				redirectTo: '/'
			});
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    scotchApp.controller('signUpController', function($scope, $http, $location) {
		$scope.formData = {
				email: '',
				password: ''
			};
		
		$scope.signUp = function() {
			$http.post('http://198.100.155.100:9001/signup', $scope.formData)
				.success(function(data) {
					if(data.success == true) {
						$scope.loggedIn = true;
					} else {
						$scope.loggedIn = false;
					}
					$location.url('/comics');
				});
			$scope.emailError = 'name taken';
		};
    });

    scotchApp.controller('userController', function($scope, $rootScope, $http) {
        $http.get("http://198.100.155.100:9001/user/" + $rootScope.userName)
		.success(function(response) {$scope.userReviews = response;});
    });

    scotchApp.controller('usersController', function($scope, $http, $routeParams) {
        $http.get("http://198.100.155.100:9001/user/" + $routeParams.user_id)
		.success(function(response) {$scope.userReviews = response;});
    });
	
	scotchApp.controller('loginController', function($scope, $http, $rootScope, $location) {
		$scope.formData = {
				email: '',
				password: ''
			};
		
        $scope.login = function() {
			
			$http.post('http://198.100.155.100:9001/login', $scope.formData)
            .success(function(data) {
				if(data.success == true) {
					$scope.loggedIn = true;
				} else {
					$scope.loggedIn = false;
				}
				
                $scope.formData = {
					email: '',
					password: ''
				};
				$location.url('/comics');
            });
		};
    });
	
	scotchApp.controller('logoutController', function($scope, $http) {
			
		$http.post('http://198.100.155.100:9001/logout', {})
		.success(function(data) {
		});
    });
	
	//For a single comic
	scotchApp.controller('comicController', function($scope, $http, $routeParams, $rootScope, $route, $location) {
		$scope.formData = {
				user: $rootScope.userName,
				comicId: $routeParams.comicId,
				pubReview: '',
				privReview: '',
				read: false,
				planToRead: false
			};
		
		$http.get("http://198.100.155.100:9001/comic/" +  $routeParams.comicId)
			.success(function(response) {$scope.comic = response;});
			
		$http.get("http://198.100.155.100:9001/userReview/" +  $routeParams.comicId)
			.success(function(response) {$scope.userReviews = response;});
		
		$http.get('http://198.100.155.100:9001/userReview/' + $rootScope.userName + '/' +$routeParams.comicId)
			.success(function(response) {$scope.formData = response;});
	
		// when submitting the add form, send the text to the node API
		$scope.createReview = function() {
			
			$http.post('http://198.100.155.100:9001/userReview', $scope.formData)
            .success(function(data) {
                $scope.userReviews = data;
            });
		};
		
		// delete a todo after checking it
		$scope.deleteReview = function() {
			$http.delete('http://198.100.155.100:9001/userReview/' + $rootScope.userName + '/' +$routeParams.comicId)
				.success(function(data) {
					$route.reload();
				});
		};
	});
	
	//getting all the comics
	scotchApp.controller('comicsController', function($scope, $http, $route, $rootScope) {
		$http.get("http://198.100.155.100:9001/comic")
		.success(function(response) {$scope.comics = response;});
		
		$scope.searchMarvel = function() {
			$rootScope.marvelQuery = $scope.marvelQuery;
			
			$http.get("http://198.100.155.100:9001/marvel/" + $scope.marvelQuery)
			.success(function(response) {
				$scope.comics = response;
				$route.reload();});
		}
	});
	
	//getting all the comics
	scotchApp.controller('marvelController', function($scope, $http, $rootScope, $location) {
		$scope.searchMarvel = function() {
			$rootScope.marvelQuery = $scope.query;
			
			$http.get("http://198.100.155.100:9001/marvel/" + $scope.query)
			.success(function(response) {$scope.comics = response;});
			
			$location.url('/comics');
		}
	});