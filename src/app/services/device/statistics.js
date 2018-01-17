/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('StatisticsService', function () {
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

                    //by wurui 车辆系列
                    getSeriseList: function (params) {
                      return RequestService.post(
                        makeUrl('/common/seriseList'),
                        {
                          brandId:params
                        }
                      );
                    },


                };
            };
        });
})();
