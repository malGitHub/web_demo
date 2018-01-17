/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('AuthenticationService', function () {
      var serviceUrl = '';
      var EX_STATUS;
      var EX_RESULTS;
      var EX_SYS_RESULTS;
      var EX_SYS_STATUSES;

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

          //车主认证审核-人工审核列表
          authenticationList: function (pageIndex, pageSize, provinceIdOne, cityIdOne, fliters) {
            return RequestService.post(
              makeUrl('/review/queryManualReviewList'),
              angular.merge({
                page_number: pageIndex || 0,
                page_size: pageSize || 20,
                provinceId:provinceIdOne,
                cityId:cityIdOne
              }, fliters)
            );
          },
          //车主认证审核-系统审核列表
          authenticationSysList: function (pageIndex, pageSize,provinceIdTwo,cityIdTwo, fliters) {
            return RequestService.post(
              makeUrl('/review/reviewList'),
              angular.merge({
                page_number: pageIndex || 0,
                page_size: pageSize || 20,
                provinceId:provinceIdTwo,
                cityId:cityIdTwo
              }, fliters)
            );
          },

          //车主认证审核-人工审核导出
          getExcelManual: function (email,pageIndex, pageSize, provinceIdOne, cityIdOne, fliters) {
            return RequestService.post(
              makeUrl('/review/exportManualReviewList'),
              angular.merge({
                page_number: pageIndex || 0,
                page_size: pageSize || 20,
                email:email,
                provinceId:provinceIdOne,
                cityId:cityIdOne
              }, fliters)
            );
          },
          //车主认证审核-系统审核导出
          getExcelSystem: function (email,pageIndex, pageSize,provinceIdTwo,cityIdTwo, fliters) {
            return RequestService.post(
              makeUrl('/review/exportReviewList'),
              angular.merge({
                page_number: pageIndex,
                page_size: pageSize,
                email:email,
                provinceId:provinceIdTwo,
                cityId:cityIdTwo
              }, fliters)
            );
          },

          /**
           * 人工-获取审核状态列表
           * @returns {Promise.<*[]>}
           */
          getExamineStatuses: function () {
            return EX_STATUS ?
              $q.when(EX_STATUS) :
              RequestService.get(
                makeUrl('/common/basedata'),
                {code: 'A001', type: 'A'}
              )
                .then(function (data) {
                  return EX_STATUS = resolveBaseData(data.list);
                });
          },
          /**
           * 系统-获取审核状态列表
           * @returns {Promise.<*[]>}
           */
          getSysExamineStatuses: function () {
            return EX_SYS_STATUSES ?
              $q.when(EX_SYS_STATUSES) :
              RequestService.get(
                makeUrl('/common/basedata'),
                {code: 'A009', type: 'A'}
              )
                .then(function (data) {
                  return EX_SYS_STATUSES = resolveBaseData(data.list);
                });
          },
          /**
           * 获取人工审核结果列表
           * @returns {Promise.<*[]>}
           */
          getExamineResults: function () {
            return EX_RESULTS ?
              $q.when(EX_RESULTS) :
              RequestService.get(
                makeUrl('/common/basedata'),
                {code: 'A002', type: 'A'}
              )
                .then(function (data) {
                  return EX_RESULTS = resolveBaseData(data.list);
                });
          },
          /**
           * 获取系统审核结果列表
           * @returns {Promise.<*[]>}
           */
          getSysExamineResults: function () {
            return EX_SYS_RESULTS ?
              $q.when(EX_SYS_RESULTS) :
              RequestService.get(
                makeUrl('/common/basedata'),
                {code: 'A002', type: 'B'}
              )
                .then(function (data) {
                  return EX_SYS_RESULTS = resolveBaseData(data.list);
                });
          }

        };
      };
    });
})();
