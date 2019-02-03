var NGTableApp = angular.module("NGTableApp", []);

NGTableApp.controller("NGTableAppController", ["$http", "$scope", "settings", function ($http, $scope, settings) {

    //Variables
    $scope.collection = [];
    $scope.predicate = 'date';
    $scope.reverse = false;

    //Functions
    $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

   

    // Load the json file and process the date
    $http.get(settings.json).success(function (data) {
        angular.forEach(data, function (value) {
            angular.forEach(value, function (value) {
                value.weeks = parseInt(value.weeks);
                $scope.collection.push(value);
            });
        });
    });

    

}]);

NGTableApp.directive("collectionItems", function () {
    return {
        restrict: "E",
        templateUrl: "/js/ng-bb-item-tmp.js",
        controllerAs: "item"
    }

});

NGTableApp.filter('safe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
