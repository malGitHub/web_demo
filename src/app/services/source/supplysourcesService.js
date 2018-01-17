/**
 * Created by zhaosp on 2017/2/10.
 */

(function () {

  angular.module('WeServices')
    .provider('SupplysourceService', function () {
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
          //货源会员认证列表查询
          getData: function (query,manualSwitch,type,page_number,page_size){
             return RequestService.get(
              makeUrl('/queryGoodsMembers'),
               angular.merge({
                 type:type,
                 page_number:page_number,
                 page_size:page_size,
                 manualSwitch:manualSwitch
                },query)
            );
          },
          //by guodx 货源会员认证信息查看
          getGoodsMemberInfo: function (id,manualSwitch) {
            return RequestService.get(
              makeUrl('/getGoodsMemberInfo'),
              {
                id:id,
                manualSwitch:manualSwitch
              }
              )
          },
          //by guodx 货源会员信息审核
          reviewUserInfo: function (id,object) {
            return RequestService.get(
              makeUrl('/reviewUserInfo'),
              angular.merge({
                id:id
              },object)
            )
          },
          //导出
          getExeclLink: function (email,query,manualSwitch,type,page_number,page_size){
            return RequestService.get(
              makeUrl('/exportGoodsMembers'),
              angular.merge({
                email:email,
                type:type,
                page_number:page_number,
                page_size:page_size,
                manualSwitch:manualSwitch
              },query)
            );
          },
          //货车帮货源会员认证列表查询
          hcbAuthInfoList: function (query,manualSwitch,type,page_number,page_size){
            return RequestService.get(
              makeUrl('/hcbAuthInfoList'),
              angular.merge({
                type:type,
                page_number:page_number,
                page_size:page_size,
                sortType:type,
                manualSwitch:manualSwitch
              },query)
            );
          },
          //by mal 货车帮货源会员认证信息查看
          getHcbAuthInfoDetail: function (id) {
            return RequestService.get(
              makeUrl('/hcbAuthInfoDetail'),
              {
                id:id
              }
            )
          },
          //by mal 货车帮货源会员信息审核
          //reviewUserInfo: function (id,object) {
          //  return RequestService.get(
          //    makeUrl('operate/reviewUserInfo'),
          //    angular.merge({
          //      id:id
          //    },object)
          //  )
          //},
          //货车帮导出
          getHcbExeclLink: function (email,query,manualSwitch,type,page_number,page_size){
            return RequestService.get(
              makeUrl('/hcbAuthInfoExport'),
              angular.merge({
                email:email,
                type:type,
                page_number:page_number,
                page_size:page_size,
                manualSwitch:manualSwitch
              },query)
            );
          },
          //by wurui 火车帮货源会员信息审核
          hcbAuthInfoInput: function (id,object) {
            return RequestService.get(
              makeUrl('/hcbAuthInfoInput'),
              angular.merge({
                id:id
              },object)
            )
          }

        };


      };


    });

})();



