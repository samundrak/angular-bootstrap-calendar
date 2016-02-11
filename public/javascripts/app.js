var app = angular.module('app', ['mwl.calendar', 'ui.bootstrap'])
    .controller('test', ['$scope', 'NAME_OF_MONTHS', function($scope, NAME_OF_MONTHS) {
        $scope.next = function() {
            $scope.month = $scope.month + 1;
            if ($scope.month === 13) {
                $scope.month = 1;
                $scope.year += 1;
            }
            $scope.monthName = NAME_OF_MONTHS[$scope.month - 1];
        }

        $scope.previous = function() {
            $scope.month = $scope.month - 1;
            if ($scope.month === 0) {
                $scope.month = 12;
                $scope.year -= 1;
            }
            $scope.monthName = NAME_OF_MONTHS[$scope.month - 1];
        }

        $scope.present = function() {
            $scope.today = new Date();
            $scope.month = ($scope.today.getMonth() + 1)
            $scope.monthName = NAME_OF_MONTHS[$scope.month - 1];
            $scope.year = $scope.today.getFullYear();
        }
        $scope.present();
    }])
    .constant('NAME_OF_MONTHS', ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    .constant('NAME_OF_DAYS', ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    .constant('PUBLIC_HOLIDAYS', [{
        year: "2016",
        holiday: {
            "1": [1],
            "2": [1, 2, 23, 29],
            "3": [1, 2, 3],
            "4": [1, 2, 3, 4],
            "5": [1, 2, 3, 4, 5],
            "6": [1, 2, 3, 4, 5, 6],
            "7": [1, 2, 3, 4, 5, 6, 7],
            "8": [1, 2, 3, 4, 5, 6, 7, 8],
            "9": [1, 2, 3, 4, 5, 6, 7, 8, 9],
            "10": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "11": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            "12": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        }
    }])
    .service('getPublicHolidays', ['PUBLIC_HOLIDAYS', function(PUBLIC_HOLIDAYS) {
        return function(year, month) {
            year = year.toString();
            month = month.toString();
            var year = _.findWhere(PUBLIC_HOLIDAYS, {
                year: year
            });

            var holidays = [];
            if (year) {
                for (var key in year.holiday) {
                    if (key === month.toString()) {
                        holidays = year.holiday[key]
                    }
                }
            }
            return holidays;
        }

    }])
    .directive('daysName', ['NAME_OF_DAYS', 'getPublicHolidays', '$compile', function(NAME_OF_DAYS, getPublicHolidays, $compile) {
        return {
            scope: {
                year: "@",
                month: "@"
            },
            restrict: 'EA',
            link: function(scope, iElement, iAttrs) {
                scope.$watch("month", function(newValue, oldValue) {
                    //This gets called when data changes.
                    monthView();
                });

                function monthView() {
                    var days = NAME_OF_DAYS;
                    var html = '<table class="table table-bordered"><thead><tr>';
                    days.forEach(function(element, index) {
                        html += '<th>' + element + '</th>'
                    });
                    html += '</thead></tr>';

                    var getDaysArray = function(year, month) {
                        var names = NAME_OF_DAYS;
                        var date = new Date(year, month - 1, 1);
                        var result = [];
                        while (date.getMonth() == month - 1) {
                            result.push(names[date.getDay()]);
                            date.setDate(date.getDate() + 1);
                        }
                        return result;
                    }
                    html += '<tr >';
                    var allDays = (getDaysArray(scope.year, scope.month))
                    var firstDay = allDays[0];
                    var indexOfFirstDay = NAME_OF_DAYS.indexOf(firstDay);
                    for (i = 0; i < indexOfFirstDay; i++) {
                        html += '<td class="skc-days">  </td>'
                    }
                    var count = indexOfFirstDay;
                    var holiDayIndex = 6;
                    var publicHoliDayIndex = getPublicHolidays(scope.year, scope.month);

                    for (i = 0; i < allDays.length; i++) {

                        if (count === NAME_OF_DAYS.length) {
                            html += "</tr><tr class='skc-days'>"
                            count = 0;
                        }
                        var classes = '';
                        if (count === holiDayIndex || (publicHoliDayIndex.indexOf(i + 1) != -1)) {
                            classes = "skc-days holiday";
                        } else {
                            classes = 'skc-days';
                        }
                        if (i === new Date().getDate() - 1 && (scope.year === new Date().getFullYear().toString()) && (scope.month === (new Date().getMonth() + 1).toString())) {
                            classes += " today";
                        }
                        html += ' <td ng-click="daySpanClicked(' + (i + 1) + ')" class="' + classes + '"><span class="days-numbers">' + (i + 1) + "</span></td>";
                        count++;
                    }
                    html += '</tr></table>';
                    iElement.html(html)
                    $compile(iElement.contents())(scope);
                }
            },
            controller: function($scope) {
                angular.extend($scope, {
                    daySpanClicked: function(day) {
                        alert(day)
                    }
                });
            }
        };
    }])
