/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('SubscribeService', function () {
            var serviceUrl = '';
            // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
            var templateUrl = {
                sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
                base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
            };

            var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

            function resolveBaseData(list) {
                if (list) {
                    return list.map(function (item) {
                        return {
                            key: item.value,
                            value: item.name
                        };
                    });
                } else {
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
                    SubscribeGetList: function (pageIndex, pageSize, query) {
                        return RequestService.get(
                            makeUrl('/appointment/itemPageList'),
                            angular.merge({
                                page_number: pageIndex,
                                page_size: pageSize
                            }, query)
                        )
                    }, addSubscribeItem: function (query) {
                        return RequestService.get(
                            makeUrl('/appointment/addItem'),
                            query
                        )
                    }, updateSubscribeItem: function (query) {
                        return RequestService.get(
                            makeUrl('/appointment/updateItem'),
                            query
                        )
                    }, deleteSubscribeItem: function (query) {
                        return RequestService.get(
                            makeUrl('/appointment/delItem'),
                            query
                        )
                    }
                };
            };
        });
})();
