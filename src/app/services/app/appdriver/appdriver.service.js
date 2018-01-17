/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('AppdriverService', function () {
      var serviceUrl = '';

      function makeUrl(path, params) {
        if (params) {
          return serviceUrl + path + '?' + angular.element.param(params);
        } else {
          return serviceUrl + path;
        }

      }


      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, RequestService) {
        return {

          /**
           * 初始化查看司机页信息
           * @returns {Promise.<*[]>}
           */
          initDriverPage: function (userId) {
            return RequestService.get(
              makeUrl('/registedUser/registerUserDetailDriver'),
              {
                id: userId

              }
            );

          }




        };
      };
    });
})();
