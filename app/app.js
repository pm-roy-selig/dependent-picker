/**
 * Created by RoySelig on 4/1/15.
 */

(function() {
    angular.module( "app", [] )

        .factory( "CarPickerService", function ( $http ) {



            function getCarMakes( callback ) {

                $http.get( "data/car-makes.json" )
                    .success( callback );
            }

            return {
                getCarMakes: getCarMakes
            }

        } )

        .controller( "main", ["$scope", "CarPickerService", function ( $scope, CarPickerService ) {



            CarPickerService.getCarMakes( function( data ){ $scope.makes = data; });

        } ]);
})();
