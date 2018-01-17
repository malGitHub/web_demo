/**
 * Created by songyx on 2016/11/7.
 */
(function () {

  angular.module('WeServices')
    .provider('dtpService', function () {
      var serviceUrl = '';
      // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
     /* var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };*/

      //var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

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
          //by songyx 部门管理表
          QueryList: function (pageIndex,pageSize,query) {
            return RequestService.get(
              makeUrl('/depart/list'),
              angular.merge({
                page_number:pageIndex,
                page_size:pageSize
              },query)
            );
          },
          //by songyx 部门管理表增加一项
          AddDptInfo: function (pid,name,creatorId) {
            return RequestService.get(
              makeUrl('/depart/add'),
              {
                pid:pid,
                name:name,
                creatorId:creatorId
              }
            );

          },
          //by songyx 编辑部门管理
          EditDptInfo: function (query) {
            return RequestService.get(
              makeUrl('/depart/update'),
              query
            );
          },
          //by songyx 部门管理表删除一项
          DeleteDptInfo: function (id) {
            return RequestService.get(
              makeUrl('/depart/delete'),
              {
                id: id
              }
            );
          },
          //by songyx 上级部门下拉取得
          GetDptList: function () {
            return RequestService.post(
              makeUrl('/common/queryDept4List')
            );
          },
          //by songyx 创建人下拉取得
          GetPerList: function () {
            return RequestService.post(
              makeUrl('/common/queryCreator4List'),
            {
              type: 'C'
            }
            );
          },
            //by wurui 获取下一级下拉
            QueryExpandDept4List: function (id) {
                return RequestService.post(
                    makeUrl('/common/queryExpandDept4List'),
                    {
                        id: id
                    }
                );
            }
        };
      };
    });
})();
