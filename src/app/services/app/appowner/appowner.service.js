/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('AppownerService', function () {
      var serviceUrl = '';
      function resolveBaseData(list) {
        return list.map(function (item) {
          return {
            key: item.value,
            value: item.name
          };
        });
      }

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
           * 初始化查看车主页信息
           * @returns {Promise.<*[]>}
           */
          initOwnerPage: function (userId) {
            return RequestService.get(
              makeUrl('/registedUser/registerUserDetailOwner'),
              {
                id: userId

              }
            );

          }




        };
      };
    });
})();
