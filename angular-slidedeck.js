/**
 * @license angular-slidedeck
 * (c) 2015 André Gaul <andre@gaul.io>
 * License: MIT
 */
'use strict';



angular.module('ngSlideTemplates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('ngSlidedeck/slide.html','<div ng-if=\'selected\' ng-transclude class=\'slide\'></div>');

  $templateCache.put('ngSlidedeck/slides.html','<div class=\'slide\'></div><div ng-keydown=\'onKeypress($event)\' ng-transclude class=\'slides\'></div>');
}]);
angular.module('ngSlides', ['ngSlideTemplates', 'ngAnimate'])

  .directive('slides', function($document) {
    return {
      restrict: 'E',
      scope: {
      },
      transclude: true,
      templateUrl: 'ngSlidedeck/slides.html',
      controller: function($scope) {
        var slides = $scope.slides = [];

        var setSlideIndex = function(index, oldIndex) {
          if (index === undefined || index < 0 || index >= slides.length) {
            return;
          }
          if (oldIndex !== undefined) {
            slides[oldIndex].selected = false;
          }
          slides[index].selected = true;
          $scope.slideIndex = index;
        };
        $scope.$watch('slideIndex', setSlideIndex);

        this.addSlide = function(slide) {
          slides.push(slide);
          if (slides.length === 1) {
            setSlideIndex(0);
          }
        };

        $document.on('keyup', function(event) {
          // right
          if (event.keyCode === 39) {
            if ($scope.slideIndex + 1 < slides.length) {
              $scope.$apply(function() {
                $scope.slideIndex++;
              });
            }
          }
          // left
          if (event.keyCode === 37) {
            if ($scope.slideIndex > 0) {
              $scope.$apply(function() {
                $scope.slideIndex--;
              });
            }
          }
        });
      }
    };
  })

  .directive('slide', function() {
    return {
      restrict: 'E',
      require: '^slides',
      transclude: true,
      scope: {},
      templateUrl: 'ngSlidedeck/slide.html',
      link: function(scope, element, attrs, slidesCtrl) {
        slidesCtrl.addSlide(scope);
      },
    };
  })

  ;
