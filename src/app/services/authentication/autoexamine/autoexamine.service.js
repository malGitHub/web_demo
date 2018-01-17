/**
 * Created by linyao on 2016/3/11.
 */
(function () {
  'use strict';

  angular.module('WeServices')
    .provider('AutoExamineService', function () {
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
           * 初始化系统审核查看页数据
           * @returns {Promise.<*[]>}
           */
          initPage: function (reviewId) {
            return RequestService.get(
              makeUrl('/review/reviewDetail'),
              {
                reviewId: reviewId

              }
            );

          },
          /**
           *
           * @param params
           * @returns {*}
           */
          save: function (params) {
            return RequestService.post(
              makeUrl('/review/editReview'),
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
                {code: 'A002', type: 'B'}
              )
                .then(function (data) {
                  return EX_RESULTS = resolveBaseData(data.list);
                });
          }

        };
      };
    });
})();
