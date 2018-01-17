/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('OperateService', function () {
            var serviceUrl = '';

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
                  //by wurui 公共角色查询
                  queryRuleList: function (id) {
                    return RequestService.get(
                      makeUrl('/rule/queryRuleList'),
                      {
                        userId:id
                      }
                    )
                  },
                  //预约项目列表
                  itemList: function (type) {
                    return RequestService.get(
                      makeUrl('/appointment/itemList'),
                      {
                        type:type
                      }
                    )
                  }
                };
            };
        });
})();
