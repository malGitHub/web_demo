/**
 * Created by ligj on 2015/9/25.
 */
(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('CommonService', function () {
            var serviceUrl = '';

            function makeUrl(path) {
                return serviceUrl + path ;
            }

            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };

            this.$get = function ($q, RequestService, SsoService) {
                return {

                    /**
                     * 获取用户信息
                     */
                    getDeveloperInfo : function (userInfo) {
                        return RequestService.get(
                            makeUrl('/user/auth?token=' + userInfo.key)
                        )
                    },

                    /**
                     * 获取用户信息(整合sso验证登陆)
                     */
                    getDeveloper: function (token) {
                        var $this = this;
	                    //todo 因为业务接口没有获取权限接口，暂时只调用sso接口
	                    return SsoService.logged(token);
	                    //todo 因为业务接口没有获取权限接口，暂时屏蔽
                        //return SsoService.logged().then(function (userInfo) {
                        //    return $this.getDeveloperInfo(userInfo);
                        //});
                    },

                    baseDataFirstBrand: function () {
                        return RequestService.get(
                          makeUrl('/operate/vehicleMonitor/queryFirstBrand')
                        )
                    },
                    baseDataThirdBrand: function (firstBrandId) {
                        return RequestService.get(
                          makeUrl('/operate/vehicleMonitor/querySubBrand'),
                            {
                                firstBrand : firstBrandId
                            }
                        )
                    },
                    baseDataArea: function (firstBrandId) {
                        return RequestService.get(
                          makeUrl('/baseData/area'),
                          //  "http://192.168.0.164:8088/baseData/area",
                            {
                                id : firstBrandId
                            }
                        )
                    }

                };
            };
        });
})();

