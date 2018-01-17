/**
 * Created by yaocy on 2016/11/24.
 */
(function () {

  angular.module('WeServices')
    .provider('WorkOrderService', function () {
      var serviceUrl = '';
      // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
      var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };

      var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

      function resolveBaseData(list) {
        if(list){
          return list.map(function (item) {
            return {
              key: item.value,
              value: item.name
            };
          });
        }else{
          return false;
        }
      }

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
          //查询车辆列表
          carInfoList: function (pageIndex,pageSize,query) {
            return RequestService.get(
              makeUrl('/carInfo/query'),
              angular.merge({
                page_number:pageIndex,
                page_size:pageSize
              },query)
            )
          },

          //新建工单
          workOrderAdd: function (opts) {
            return RequestService.get(
              makeUrl('/wo/add'),
              opts
            )
          },
          //工单号查询
          queryWoCode: function () {
            return RequestService.get(
              makeUrl('/wo/queryWoCode')
            )
          },
          //服务站查询
          query: function () {
            return RequestService.get(
              makeUrl('/query')
            )
          },
          /*查询司机手机号码*/
          queryDriverInfoList: function (vin) {
            return RequestService.get(
              makeUrl('/queryDriverInfoList'),
              {
                vin:vin
              }
            )
          }
        };
      };
    });
})();
