/**
 * Created by wangshuai on 2016/12/21.
 */
(function () {

    angular.module('WeServices')
        .provider('ActivityService', function () {
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
                  //添加活动
                  addActivity: function (activity) {
                    return RequestService.get(
                      makeUrl('/activity/update'),
                        activity
                    );
                  },
                  //删除活动
                  delActivity: function (activityId) {
                    return RequestService.get(
                      makeUrl('/activity/del'),
                      {activityId:activityId}
                    );
                  },
                  //获取活动区域下拉列表（省市）
                  getAreaList: function (provinceId) {
                    return RequestService.get(
                      makeUrl('/activity/queryArea'),
                      {
                        provinceId: provinceId
                      }
                    );
                  },
                  //获取活动网点下拉列表
                  getStoreList: function (provinceId,cityId,type) {
                    return RequestService.get(
                      makeUrl('/activity/queryStation'),
                      {
                        provinceId: provinceId,
                        cityId:cityId,
                        type:type
                      }
                    );
                  },
                  //活动车型添加
                  addSeries: function (activityId,series,seriesName,model,modelName,carOfflineStartDate,carOfflineEndDate,carSellingStartDate,carSellingEndDate,
                                       stdStartDate,stdEndDate
                   ) {
                     return RequestService.post(
                      makeUrl('/activity/addSeries'),
                      {
                        activityId: activityId,
                        series:series,
                        seriesName:seriesName,
                        model:model,
                        modelName:modelName,
                        carOfflineStartDate:carOfflineStartDate,
                        carOfflineEndDate:carOfflineEndDate,
                        carSellingStartDate:carSellingStartDate,
                        carSellingEndDate:carSellingEndDate,
                        stdStartDate:stdStartDate,
                        stdEndDate:stdEndDate
                       }
                    );
                  },
                  //活动车型删除
                  delSeries: function (activityId,series,model) {
                    return RequestService.post(
                      makeUrl('/activity/delSeries'),
                      {
                        activityId: activityId,
                        series:series,
                        model:model
                      }
                    );
                  },
                  //下发全部网点的查询
                  queryTotalStation: function (query) {
                    return RequestService.get(
                      makeUrl('/activity/queryTotalStation'),
                      angular.merge({

                      }, query)
                    );
                  },
                  //兑换全部网点的查询
                  queryTotalExchangeStation: function (query) {
                    return RequestService.get(
                      makeUrl('/activity/queryTotalExchangeStation'),
                      angular.merge({

                      }, query)
                    );
                  },
                  //发放已添加网点的查询
                  alreadyAddedGrantStation: function (activityId,query) {
                    return RequestService.get(
                      makeUrl('/activity/alreadyAddedGrantStation'),
                      angular.merge({
                        activityId:activityId
                      }, query)
                    );
                  },
                  //兑换已添加网点的查询
                  alreadyAddedExchangeStation: function (activityId,query) {
                    return RequestService.get(
                      makeUrl('/activity/alreadyAddedExchangeStation'),
                      angular.merge({
                        activityId:activityId
                      }, query)
                    );
                  },
                  //发放网点添加
                  addActivityGrant: function (activityId,stationId,provinceId,quota,cityId,stationType
                  ) {
                    return RequestService.get(
                      makeUrl('/activity/addActivityGrant'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                        provinceId:provinceId,
                        quota:quota,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  },
                  //活动详情发放网点添加
                  editActivityGrant: function (activityId,stationId,provinceId,quota,cityId,stationType
                  ) {
                    return RequestService.get(
                      makeUrl('/activity/editActivityGrant'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                        provinceId:provinceId,
                        quota:quota,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  },
                  //发放网点关键字添加
                  addKeyWordActivityGrant: function (activityId,keyWord,quota
                  ) {
                    return RequestService.get(
                      makeUrl('/activity/addKeyWordActivityGrant'),
                      {
                        activityId: activityId,
                        keyWord:keyWord,
                        quota:quota
                       }
                    );
                  },
                  //发放网点删除
                  delActivityGrant: function (activityId,stationId,provinceId,cityId,stationType) {
                    return RequestService.get(
                      makeUrl('/activity/delActivityGrant'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                        provinceId:provinceId,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  },
                  sendUpdateActivityGrant: function (activityId,keyWord,provinceId,cityId,stationId,stationType,flag) {
                    return RequestService.get(
                      makeUrl('/activity/sendUpdateActivityGrant'),
                      {
                        activityId: activityId,
                        keyWord: keyWord,
                        provinceId:provinceId,
                        cityId:cityId,
                        stationId:stationId,
                        stationType:stationType,
                        flag:flag
                      }
                    );
                  },
                  //兑换网点添加
                  addActivityExchange: function (activityId,stationId,provinceId,quota,cityId,stationType
                  ) {
                    return RequestService.get(
                      makeUrl('/activity/addActivityExchange'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                         provinceId:provinceId,
                        quota:quota,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  },
                  editActivityExchange: function (activityId,stationId,provinceId,quota,cityId,stationType
                  ) {
                    return RequestService.get(
                      makeUrl('/activity/editActivityExchange'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                        provinceId:provinceId,
                        quota:quota,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  }
                  ,
                  //兑换网点删除
                  delActivityExchange: function (activityId,stationId,provinceId,cityId,stationType) {
                    return RequestService.get(
                      makeUrl('/activity/delActivityExchange'),
                      {
                        activityId: activityId,
                        stationId:stationId,
                        provinceId:provinceId,
                        cityId:cityId,
                        stationType:stationType
                      }
                    );
                  },
                  sendUpdateActivityExchange: function (activityId,keyWord,provinceId,cityId,stationId,stationType,flag) {
                    return RequestService.get(
                      makeUrl('/activity/sendUpdateActivityExchange'),
                      {
                        activityId: activityId,
                        keyWord: keyWord,
                        provinceId:provinceId,
                        cityId:cityId,
                        stationId:stationId,
                        stationType:stationType,
                        flag:flag
                      }
                    );
                  }
                };
            };
        });
})();
