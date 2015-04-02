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

            $scope.carMake = "";
            $scope.carModel = "";
            $scope.carYear = "";

            //here all our services callbacks assume happy paths
            CarPickerService.getCarMakes().then( function ( result ) {
                $scope.makes = result;
            } );

            $scope.updateModels = function () {
                CarPickerService
                    .getCarModels( $scope.carMake )
                    .then( function ( result ) {

                        //for convenience we apply the filter here, though it would really be handled server-side
                       result.forEach(function( m ){
                            if ( m.name === $scope.carMake ) {
                                $scope.models = m.models;
                            }
                        });
                    } );
            }

            $scope.updateYears = function () {
                CarPickerService.getCarModelYears( $scope.carMake + "/" + $scope.carModel, function ( result ) {
                    $scope.years = result;
                } );
            }

            $scope.performCarSearch = function () {
                console.log( "The filter is: " + $scope.carMake + "/" + $scope.carModel + "/" + $scope.carYear );
            }

        }
        ] )

        .directive( "picker", function () {

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
                }

            };

        } );
})();
