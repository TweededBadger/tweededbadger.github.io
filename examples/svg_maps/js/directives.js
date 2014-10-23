angular.module('SvgMapApp').directive('svgMap', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        templateUrl: 'img/Blank_US_Map.svg',
        link: function (scope, element, attrs) {
            var paths = element.find('path');
            angular.forEach(paths, function (path, key) {
                var pathElement = angular.element(path);
                pathElement.attr("region", "");
                pathElement.attr("dummy-data", "dummyData");
                pathElement.attr("hover-region", "hoverRegion");
                $compile(pathElement)(scope);
            })
        }
    }
}]);
angular.module('SvgMapApp').directive('region', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        scope: {
            dummyData: "=",
            hoverRegion: "="
        },
        link: function (scope, element, attrs) {
            scope.elementId = element.attr("id");
            scope.regionMouseDown = function () {
                console.log(scope.elementId);
                console.log(scope.dummyData[scope.elementId]);
            };
            scope.regionMouseOver = function () {
                console.log(scope.elementId);
                scope.hoverRegion = scope.elementId;
            };
            element.attr("ng-attr-fill", "{{dummyData[elementId].value | map_colour}}");
            element.attr("ng-click", "regionMouseDown()");
            element.attr("ng-mouseover", "regionMouseOver()");
            element.attr("ng-class", "{hover:hoverRegion==elementId}");
            element.removeAttr("region");
            $compile(element)(scope);
        }
    }
}]);