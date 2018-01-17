/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('AppService', function () {
      var serviceUrl = '';
      var ROLES;
      var BRANDS;
      var SERISE;
      var MODELS;

      function resolveBrandData(list) {
        return list.map(function (item) {
          return {
            key: item.brandId,
            value: item.brandName
          };
        });
      }

      function resolveSeriseData(list) {
        return list.map(function (item) {
          return {
            key: item.seriseId,
            value: item.seriseName
          };
        });
      }


      function resolveModelData(list) {
        return list.map(function (item) {
          return {
            key: item.modelId,
            value: item.modelName
          };
        });
      }

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


          //注册用户管理列表
          registerUserList: function (pageIndex, pageSize, fliters) {
            return RequestService.post(
              makeUrl('/registedUser/registerUserList'),
              angular.merge({
                page_number: pageIndex || 0,
                page_size: pageSize || 10
              }, fliters)
            );
          },
          /**
           * 获取角色列表
           * @returns {Promise.<*[]>}
           */
          getRoles: function () {
            return ROLES ?
              $q.when(ROLES) :
              RequestService.get(
                makeUrl('/common/basedata'),
                {code: 'A004', type: 'A'}
              )
                .then(function (data) {
                  return ROLES = resolveBaseData(data.list);
                });
          },
          /**
           * 获取品牌列表
           * @returns {Promise.<*[]>}
           */
          getbrands: function () {
            return BRANDS ?
              $q.when(BRANDS) :
              RequestService.get(
                makeUrl('/common/brandList')
              )
                .then(function (data) {
                  return BRANDS = resolveBrandData(data);
                });
          },

          /**
           * 获取车系下拉列表
           * @returns {Promise.<*[]>}
           */
          getSeriseList: function (brandId) {

            return RequestService.get(
              makeUrl('/common/seriseList'),
              {brandId: brandId}
            )
              .then(function (data) {
                return SERISE = resolveSeriseData(data);
              });
          },
          /**
           * 获取车型下拉列表
           * @returns {Promise.<*[]>}
           */
          getModelList: function (seriseId) {

            return RequestService.post(
              makeUrl('/common/activityModelList'),
              {seriseId: seriseId}
            )
              .then(function (data) {
                return MODELS = resolveModelData(data);
              });
          },
          /**
           * 导出
           * @returns {url}
           */
          getExeclLink: function (pageIndex, pageSize,email, fliters) {
            return RequestService.post(
              makeUrl('/exportAppUserManagementInfoList'),
              angular.merge({
                page_number: pageIndex || 0,
                page_size: pageSize || 10,
                email:email||''
              }, fliters)
            )}


        };
      };
    });
})();
