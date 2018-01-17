/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('BannerService', function () {
            var serviceUrl = '';
            // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
            var templateUrl = {
                sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
                base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
            };

            var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

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
                    //by wurui APP banner配置 - 查询（按照位置降序排列）
                  QueryBannerInfo: function (pageIndex,pageSize,query) {
                        return RequestService.get(
                            makeUrl('/BannerInfo/QueryBannerInfo'),
                            angular.merge({
                                page_number:pageIndex,
                                page_size:pageSize
                            },query)
                        )
                    },
                    //by wurui APP banner配置-新增
                  AddBannerInfo: function (filter) {
                        return RequestService.get(
                            makeUrl('/BannerInfo/AddBannerInfo'),
                            filter
                        );
                    },
                  //by wurui APP banner配置 - 修改
                  UpdateBannerInfo: function (filter) {
                    return RequestService.get(
                      makeUrl('/BannerInfo/UpdateBannerInfo'),
                      filter
                    );
                  },
                  //by wurui APP banner配置-删除
                  DelBannerInfo: function (id,status) {
                    return RequestService.get(
                      makeUrl('/BannerInfo/DelBannerInfo'),
                      {
                        id:id,
                        banner_status:status
                      }
                    );
                  },
                  //by wurui APP banner配置 - 排序
                  MoveBannerInfo: function (filter) {
                    return RequestService.get(
                      makeUrl('/BannerInfo/MoveBannerInfo'),
                      filter
                    );
                  },
                  //by wurui APP banner配置 - 在线状态更新
                  UpdateBannerOnline: function (id,status) {
                    return RequestService.get(
                      makeUrl('/BannerInfo/UpdateBannerOnline'),
                      {
                        id:id,
                        banner_status:status
                      }
                    );
                  }

                };
            };
        });
})();
