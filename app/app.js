/**
 * Created by RoySelig on 4/1/15.
 */

(function () {
    angular.module( "app", [] )

        .factory( "CarPickerService", function ( $http ) {

            function getCarMakes( callback ) {

                $http.get( "data/car-makes.json" )
                    .success( callback );
            }

            function getCarModels( makeFilter, callback ) {

                $http.get( "data/car-models.json?filter=" + makeFilter )
                    .success( function ( data ) {

                        //we filter here for simplicity but it is actually the responsibility of the server
                        var make = data.filter( function ( m ) {
                            return m.name === makeFilter;
                        } )

                        var result = make[ 0 ];

                        callback.call( this, result.models );
                    }
                );
            }

            function getCarModelYears( modelYearFilter, callback ) {

                $http.get( "data/car-years.json?filter=" + modelYearFilter )
                    .success( callback );

            }

            return {
                getCarMakes: getCarMakes,
                getCarModels: getCarModels,
                getCarModelYears: getCarModelYears
            }

        } )

        .controller( "main", [ "$scope", "CarPickerService", function ( $scope, CarPickerService ) {

            CarPickerService.getCarMakes( function ( result ) {
                $scope.makes = result;
            } );
            CarPickerService.getCarModels( "Toyota", function ( result ) {
                $scope.models = result;
            } );
            CarPickerService.getCarModelYears( "Toyota+Corolla", function ( result ) {
                $scope.years = result;
            } );

        } ] );
})();
