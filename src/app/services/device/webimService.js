/**
 * Created by ligj on 2016/3/11.
 */
(function () {

  angular.module('WeServices')
    .provider('WebimService', function () {
      var serviceUrl = '';
      // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
     /* var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };*/

      //var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

      /*function resolveBaseData(list) {
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
      }*/

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
          //by guodx 获取用户名时间
          customerDialogPageList: function (pageIndex,pageSize,object
          ) {
            return RequestService.get(
              makeUrl('crm/customerDialogPageList'),
              angular.merge({
                page_number:pageIndex,
                page_size:pageSize
              },object)
            )
          },
          //by guodx 查询用户客服会话id
          dialogSearchId:function(customerId,serviceUserId,page_number,page_size){
            return RequestService.get(
              makeUrl('crm/dialogSearch'),
              {
                customerId:customerId,
                serviceUserId:serviceUserId,
                page_number:page_number,
                page_size:page_size
              }
            );
          },
          //by guodx 回呼创建会话（tboss侧接口）
          createTboosDialog:function(serverUserId,customerId) {
            return RequestService.get(
              makeUrl('crm/createTboosDialog'),
              {
                serverUserId:serverUserId,
                customerId:customerId
              }
            )
          },
          //by guodx 获取对话详情
          dialogDetailAll:function(dialogId,userId) {
            return RequestService.get(
              makeUrl('crm/dialogDetail'),
              {
                dialogId: dialogId,
                userId:userId
              }
            )
          },

          //by wurui 云信获取用户token
          CrmQueryUserInfo:function(userId,type){
            return RequestService.get(
              makeUrl('crm/queryUserInfo'),
              {
                userId:userId,
                type:type
              }
            );
          },
          //by wurui 云信获取用户失败再次获取token
          RefreshToken:function(userId,type){
            return RequestService.get(
              makeUrl('crm/refreshToken'),
              {
                userId:userId,
                type:type
              }
            );
          },
          //by wurui 取消会话超时关闭
          cancelDialogTimeout:function(dialogId,state){
            return RequestService.get(
              makeUrl('crm/cancelDialogTimeout'),
              {
                dialogId:dialogId,
                state:state
              }
            );
          },
          //by wurui 结束会话
          closeDialog:function(dialogId){
            return RequestService.get(
              makeUrl('crm/closeDialog'),
              {
                dialogId:dialogId
              }
            );
          },
          //by wurui 用户、客服会话查询
          dialogSearch:function(customerId,serviceUserId,page_number,page_size){
            return RequestService.get(
              makeUrl('crm/dialogSearch'),
              {
                customerId:customerId,
                serviceUserId:serviceUserId,
                page_number:page_number,
                page_size:page_size
              }
            );
          },
          //by wurui 会话详情
          dialogDetail:function(dialogId,userId){
            return RequestService.get(
              makeUrl('crm/dialogDetail'),
              {
                dialogId:dialogId,
                userId:userId
              }
            );
          },
          serviceDialogList: function (serviceUserId) {
            return RequestService.post(
              makeUrl('crm/serviceDialogList'),
              {
                serviceUserId:serviceUserId
              }
            );
          }
        };
      };
    });
})();
