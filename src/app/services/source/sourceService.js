/**
 * Created by Administrator on 2017/2/10.
 */
(function () {

  angular.module('WeServices')
    .provider('SourceService', function () {
      var serviceUrl = '';
      // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
      var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };

      function makeUrl(path) {
        return serviceUrl + path;
        /*
         return 'http://10.30.10.137:8090/qingqi/' + path;
         */
      }

      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, RequestService) {
        return {
          //by guodx 货源会员信息审核
          reviewUserInfo: function (userId,object
          ) {
            return RequestService.get(
              makeUrl('/operate/reviewUserInfo'),
               angular.merge({
                userId:userId
              },object)
             )
          },
          //by guodx 货源会员认证信息查看
          getGoodsMemberInfo: function (userId,manualSwitch
          ) {
            return RequestService.get(
              makeUrl('/operate/getGoodsMemberInfo'),
              {
                userId:userId,
                manualSwitch:manualSwitch
              }


            )
          }

        };
      };
    });
})();
