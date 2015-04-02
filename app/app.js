/**
 * Created by RoySelig on 4/1/15.
 */

(function () {
    angular.module( "app", [] )

        .factory( "CarPickerService", function ( $http ) {

            function getCarMakes() {
                return $http.get( "data/car-makes.json" )
                    .success( function ( data ) {


                        return data;
                    } )
            }

            return {
                getCarMakes: getCarMakes
            }

        } )

        .controller( "main", function ( $scope, CarPickerService ) {

            $scope.makes = CarPickerService.getCarMakes();

        } );
})();
