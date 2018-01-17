/**
 * Created by Administrator on 2016/11/7.
 */
(function () {

  angular.module('WeServices')
    .provider('TelService', function () {
      var serviceUrl = '';

      function makeUrl(path) {
        return serviceUrl + path;
      }

      this.$get = function ($q, RequestService) {
        return {
          //保险公司查询
          TelephoneList: function (pageIndex, pageSize, query) {
            return RequestService.get(
              makeUrl('/emergency/queryUrgentCall'),
              angular.merge({
                page_number: pageIndex,
                page_size: pageSize
              }, query)
            )
          },

          //by zhaosp 保养项目高级筛选车辆品牌
          getBrandList: function (params) {
            return RequestService.get(
              makeUrl('/common/basedata'),
              params
            );
          },

          //by zhaosp 保险公司添加一项
          addTelephoneBaseList: function (params){
            return RequestService.get(
              makeUrl('/emergency/add/urgentCall'),
              params

            );
          },
        //by zhaosp 保养项目删除一项
        DelTelephoneItem:function (maintainItemId) {
          return RequestService.get(
            makeUrl('/emergency/delUrgentCall'),
            {
              id: maintainItemId
            }
          );
        },
          /**
           * 编辑
           * @param params
           * @returns {*}
           */

          updTelephoneList: function (params){
            return RequestService.get(
              makeUrl('/emergency/updUrgentCall'),

                params

            );
          },
          /**
           * 排序
           * @param params
           * @returns {*}
           */
          getTelephoneSort: function (params){
            return RequestService.get(
              makeUrl('/emergency/sortUrgentCall'),

              params

            );
          }








        };


      };


    });

})();
