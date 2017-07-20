angular.module('NavDirective', ['firebase', 'ui.router'])

.directive('sideNav', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      dataset: '=' 
    }, 
    templateUrl: "nav/templates/side-nav.html"
	}; 
})

;