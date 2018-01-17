/**
 * Created by mal on 2016/12/21.
 */
(function () {

    angular.module('WeServices')
        .provider('CashService', function () {
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
                  //获取活动兑换列表查询
                  getExchangeList: function (keyword, pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryExchangeList'),
                      {
                        keyWord: keyword,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //获取活动兑换网点列表查询
                  getExchangeStationList: function (exchangeQuantitySort,restQuantitySort,activityId,keyword,exchangeQuotaSmall,exchangeQuotaBig,provinceId,cityId, pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryExchangeStationList'),
                      {
                        exchangeQuantitySort:exchangeQuantitySort,
                        restQuantitySort:restQuantitySort,
                        activityId:activityId,
                        keyWord: keyword,
                        exchangeQuotaSmall:exchangeQuotaSmall,
                        exchangeQuotaBig:exchangeQuotaBig,
                        provinceId: provinceId,
                        cityId: cityId,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //活动兑换网点兑换记录查询
                  getExchangeStationRecordList: function (stationId,activityId,stationType,keyWord,exchangeStartTime,exchangeEndTime,pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryExchangeStationRecordList'),
                      {
                        stationId:stationId,
                        activityId:activityId,
                        keyWord:keyWord,
                        exchangeStartTime:exchangeStartTime,
                        exchangeEndTime:exchangeEndTime,
                        page_number: pageIndex,
                        stationType:stationType,
                        page_size: pageSize
                      }
                    );
                  },

                  /*导出*/
                  getExeclLink: function (email,exchangeQuantitySort,restQuantitySort,activityId,keyword,exchangeQuotaSmall,exchangeQuotaBig,provinceId,cityId, pageIndex, pageSize) {
                return RequestService.get(
                  makeUrl('/activity/exportExchangeStationList'),
                  {
                    email:email,
                    exchangeQuantitySort:exchangeQuantitySort,
                    restQuantitySort:restQuantitySort,
                    activityId:activityId,
                    keyWord: keyword,
                    exchangeQuotaSmall: exchangeQuotaSmall,
                    exchangeQuotaBig: exchangeQuotaBig,
                    provinceId: provinceId,
                    cityId: cityId,
                    page_number: pageIndex,
                    page_size: pageSize
                  }
                );
              },
                  /*导出详细*/
                  getExeclLinkNext: function (email,stationId,activityId,stationType,keyWord,exchangeStartTime,exchangeEndTime,pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/exportExchangeStationRecordList'),
                      {
                        email:email,
                        stationId:stationId,
                        activityId:activityId,
                        keyWord:keyWord,
                        exchangeStartTime:exchangeStartTime,
                        exchangeEndTime:exchangeEndTime,
                        page_number: pageIndex,
                        stationType:stationType,
                        page_size: pageSize
                      }
                    );
                  }
                };
            };

        });
})();
