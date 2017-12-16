;(function(){
    'use strict';

    var app = angular.module('calendar', ['ngclipboard', 'ngAnimate']);

    app.controller('EventController', function($scope){
        var getUrl = function(title, desc, locat, start, end){
            var uri = new URI('https://www.google.com/calendar/render');
            uri.search({
                action:  'TEMPLATE',
                text:    title,
                details: desc,
                location: locat,
                dates:   start + '/' + end
            });

            return uri.toString();
        };

        $scope.getUrl = function(){
            /* TODO Add form validation */
            $scope.copied = false;
            $scope.url    = getUrl($scope.title, $scope.desc, $scope.locat, $scope.start, $scope.end);
        };

        // You can still access the clipboard.js event
        $scope.onSuccess = function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            e.clearSelection();
            alert('複製成功！');
        };

        $scope.onError = function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
            alert('複製失敗！請手動選取再複製')
        }
    });

    app.directive('datetime', function($parse){
        var link = function(scope, element, attrs){
            var options = {
                format: 'DD/MM/YYYY HH:mm'
            };

            var dp    = $(element);
            var model = $parse(attrs.ngModel);

            dp.datetimepicker(options);
            dp.on('dp.change', function(){
                var date = dp.data('DateTimePicker')
                    .getDate()
                    .zone(0)
                    .format('YYYYMMDDTHHmmss')
                    + 'Z';

                scope.$apply(function(scope){
                    model.assign(scope, date);
                });
            });
        };

        return {
            restrict: 'A',
            link: link
        };
    });

    // app.directive('copyOnClick', function(){
    //     var link = function(scope, element, attrs){
    //         var client = new ZeroClipboard(element);

    //         client.on('ready', function(event){
    //             client.on('copy', function(event) {
    //                 event.clipboardData.setData('text/plain', scope.url);

    //                 scope.$apply(function(scope){
    //                     scope.copied = true;
    //                 });
    //             });
    //         });
    //     };

    //     return {
    //         restrict: 'A',
    //         link: link
    //     };
    // });
})();
