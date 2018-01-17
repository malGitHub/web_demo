/**
 * 工单处理服务类
 * @Author wurui
 * @Date 2016/11/15 15:23
 */
(function() {
  angular.module("WeViews").provider("PublicService", function () {

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
        //司机查询
        queryDriver: function (phone) {
          return RequestService.get(
            makeUrl('tocapp/queryDriverInfo'),
            angular.merge({
              userTel:phone
            })
          )
        },
        //by wurui 数据字典 获得服务类型
        basedata: function (type,code) {
          return RequestService.get(
            makeUrl('operate/common/basedata'),
            {
              type:type,
              code:code
            }
          )
        },
        //by wurui 获取司机手机号
        queryDriverInfoList: function (vin) {
          return RequestService.get(
            makeUrl('tocapp/queryDriverInfoList'),
            {
              vin:vin
            }
          )
        }
      }
    }

  })


})();
