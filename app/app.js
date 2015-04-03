/**
 * Created by RoySelig on 4/1/15.
 */

(function () {
    angular.module( "app", [] )

        .factory( "CarPickerService", function ( $http, $q ) {


            /*
             * Public API
             * */

            return {
                getCarMakes: getCarMakes,
                getCarModels: getCarModels,
                getCarModelYears: getCarModelYears
            };

            /*
             * Public Methods
             * */

            function getCarMakes() {

                var request = $http.get( "data/car-makes.json" );

                return ( request.then( handleSuccess, handleError ) );

            }

            function getCarModels( filter ) {

                var request = $http.get( "data/car-models.json?filter=" + filter );

                return ( request.then( handleSuccess, handleError ) );

            }

            function getCarModelYears( modelYearFilter, callback ) {

                $http.get( "data/car-years.json?filter=" + modelYearFilter )
                    .success( callback );

            }

            /*
             * Private Methods
             * */
            function handleError( response ) {
                return ( $q.reject( response.data.message ) );
            }

            function handleSuccess( response ) {

                return ( response.data );

            }

        } )

        .controller( "main", [ "$scope", "CarPickerService", function ( $scope, CarPickerService ) {

            //reveal items to scope
            $scope.main = {
                carMake: "",
                carModel: "",
                carYear: "",
                makes: [],
                models: [],
                years: [],
                updateModels: updateModels,
                updateYears: updateYears,
                performCarSearch: performCarSearch
            };

            //here all our services callbacks assume happy paths
            CarPickerService.getCarMakes().then( function ( result ) {
                $scope.main.makes = result;
            } );

            function updateModels() {
                CarPickerService
                    .getCarModels( $scope.main.carMake )
                    .then( function ( result ) {

                        //for convenience we apply the filter here, though it would really be handled server-side
                        result.forEach( function ( m ) {
                            if ( m.name === $scope.main.carMake ) {
                                $scope.main.models = m.models;
                            }
                        } );

                    } );
            };

            function updateYears() {
                CarPickerService.getCarModelYears( $scope.main.carMake + "/" + $scope.carModel, function ( result ) {
                    $scope.main.years = result;
                } );
            }

            function performCarSearch() {
                //console.log( "The filter is: " + $scope.main.carMake + "/" + $scope.carModel + "/" + $scope.carYear );
            }

        }
        ] )

        .directive( "picker", function ( $timeout ) {

            return {
                restrict: "E",
                transclude: true,
                templateUrl: "app/picker.tpl.html",
                scope: {
                    model: "=",
                    options: "=",
                    label: "@",
                    onpick: "&",
                    type: "@",
                    progressive: "@"
                },
                link: function ( scope, element, attrs ) {

                    scope.select = function ( value ) {
                        scope.model = value;
                        scope.onpick();
                    };

                    scope.menu = false;

                    scope.show=function(){
                        scope.menu = true;
                    }

                    scope.hide = function () {

                        $timeout( function () {
                            scope.menu = false;
                        }, 100 )

                    }

                }

            };

        } );
})();
