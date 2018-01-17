/**
 * Created by mal on 2016/12/21.
 */
(function () {

    angular.module('WeServices')
        .provider('GrantService', function () {
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
                  //获取活动发放列表查询
                  getGrantList: function (keyword, pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryGrantList'),
                      {
                        keyWord: keyword,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //活动发放网点列表查询
                  getGrantStationList: function (sendQuantitySort,restQuantitySort,activityId,keyword,sendQuantitySmall,sendQuantityBig,provinceId,cityId,pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryGrantStationList'),
                      {
                        sendQuantitySort:sendQuantitySort,
                        restQuantitySort:restQuantitySort,
                        activityId:activityId,
                        keyWord: keyword,
                        sendQuantitySmall:sendQuantitySmall,
                        sendQuantityBig:sendQuantityBig,
                        provinceId: provinceId,
                        cityId: cityId,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //活动发放网点发放记录查询
                  getGrantStationRecordList: function (stationId,activityId,stationType,keyWord,grantStartTime,grantEndTime,pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryGrantStationRecordList'),
                      {
                        stationId:stationId,
                        activityId:activityId,
                        stationType:stationType,
                        keyWord:keyWord,
                        grantStartTime:grantStartTime,
                        grantEndTime:grantEndTime,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //导出
                  getExeclLink: function (email,sendQuantitySort,restQuantitySort,activityId,keyword,sendQuantitySmall,sendQuantityBig,provinceId,cityId,pageIndex, pageSize) {
                    return RequestService.get(
                      makeUrl('/activity/queryGrantStationListExcel'),
                      {
                        email:email,
                        sendQuantitySort:sendQuantitySort,
                        restQuantitySort:restQuantitySort,
                        activityId:activityId,
                        keyWord: keyword,
                        sendQuantitySmall: sendQuantitySmall,
                        sendQuantityBig: sendQuantityBig,
                        provinceId: provinceId,
                        cityId: cityId,
                        page_number: pageIndex,
                        page_size: pageSize
                      }
                    );
                  },
                  //导出详情页
                  getExeclLinkNext: function (email,stationId,activityId,stationType,keyWord,grantStartTime,grantEndTime,pageIndex, pageSize) {
                return RequestService.get(
                  makeUrl('/activity/queryGrantStationRecordListExcel'),
                  {
                    email:email,
                    stationId:stationId,
                    activityId:activityId,
                    stationType:stationType,
                    keyWord:keyWord,
                    grantStartTime:grantStartTime,
                    grantEndTime:grantEndTime,
                    page_number: pageIndex,
                    page_size: pageSize
                  }
                );
              }
                };
            };
        });
})();
