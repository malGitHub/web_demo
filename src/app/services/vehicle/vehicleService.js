/**
 * Created by Administrator on 2017/3/6.
 */
(function () {

  angular.module('WeServices')
    .provider('VehicleService', function () {
      var serviceUrl = '';
      var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };

      function makeUrl(path) {
        return serviceUrl + path;
      }
      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, RequestService) {
        return {
           //by guodx 车辆信息查看
          vehicleCarInfoList: function (type,page_number,page_size,query) {
            return RequestService.post(
              makeUrl('/vehicle/carInfoList'),
              angular.merge({
                page_number:page_number,
                page_size:page_size,
                type:type
               },query)
             )
          }
         };


      };


    });

})();
