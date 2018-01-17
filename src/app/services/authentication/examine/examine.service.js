/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('ExamineService', function () {
      var serviceUrl = '';
      var EX_RESULTS;
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
           * 初始化人工审核/查看页数据
           * @returns {Promise.<*[]>}
           */
          initExaminePage: function (carId) {
            return RequestService.get(
              makeUrl('/review/queryManualReviewInfo'),
              {
                carId: carId,
                userId: '1'

              }
            );

          },
          /**
           *
           * @param params
           * @returns {*}
           */
          addExamine: function (params) {
            return RequestService.post(
              makeUrl('/review/manualReview'),
              params
            );
          },
          /**
           * 获取审核结果列表
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
          }

        };
      };
    });
})();
