(function () {
    'use strict';


    angular
        .module('WeViews')
        .controller('TserviceSubscribeController', TserviceSubscribeController);

    /** @ngInject */
    function TserviceSubscribeController($uibModal, GetTemplateUrl, GetControllerName, Message, SubscribeService,$rootScope) {
        var vm = this;
        vm.moreobject = false;
        vm.total1 = 0;
        vm.pageIndex1 = 1;
        vm.pageSize1 = 10;
        vm.mydata1 = [];

        vm.total2 = 0;
        vm.pageIndex2 = 1;
        vm.pageSize2 = 10;
        vm.mydata2 = [];


        vm.query1 = {
            id: "",
            type: "1",
            searchKey: ""
        };

        vm.query2 = {
            id: "",
            type: "2",
            searchKey: ""
        };

        /**
         * ---------------------------------------------保养维护tab页面-----------------------------------
         */
        /**
         * 新增保养项
         */
        vm.add = function () {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.subscribe.repairedit'),
                controller: GetControllerName('tservice.subscribe.repairadd'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepadd',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                getList();
                Message.success('操作成功');
            });
        };


        /**
         * 修改保养项方法
         * @param obj
         */
        vm.edit = function (obj) {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.subscribe.repairedit'),
                controller: GetControllerName('tservice.subscribe.repairedit'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepedit',
                resolve: {        //传参
                    maintainObj: function () {
                        return obj
                    }
                },
                backdrop: false
            }).result.then(function () {//回传到父级页面
                getList();
                 Message.success('操作成功');
            });
        };


        /**
         * 删除保养项方法
         * @param id
         */
        vm.remove = function (id, symbol) {
            Message.confirm('确定要删除该项 ？', '删除')
                .then(function () {
                    var queryObj = {id:id};
                    SubscribeService.deleteSubscribeItem(queryObj)
                        .then(function () {
                            Message.success('删除成功');
                            if (symbol == 1) {
                                getList();
                            } else {
                                getRepairList();
                            }

                        })
                        .catch(function (err) {
                          $rootScope.catchError(err);
                        });
                });
        };

        /**
         * 获得保养项列表方法
         */
        function getList() {
            getCommonList(1);
        }



        /**
         * 获得列表方法
         */
        vm.commonQuery = {};//通用查询对象
        function getCommonList(symbol) {
            var pIndex ;
            var pSize ;
            if (symbol == 1) {
                pIndex = vm.pageIndex1;
                pSize = vm.pageSize1;
                vm.commonQuery = vm.query1;
            }else{
                pIndex = vm.pageIndex2;
                pSize = vm.pageSize2;
                vm.commonQuery = vm.query2;
            }
            SubscribeService.SubscribeGetList(pIndex, pSize, vm.commonQuery).then(function (data) {
                if (symbol == 1) {
                    vm.mydata1 = data.list;
                    vm.total1 = data.total;
                } else {
                    vm.mydata2 = data.list;
                    vm.total2 = data.total;
                }
            }).catch(function (err) {
              $rootScope.catchError(err);
            });
        }


        /**
         * 通用查询方法
         * @param searchKey
         * @param symbol
         */
        vm.commonSearch = commonSearch;
        function commonSearch(searchKey, symbol) {
            //查询时默认查询第一页
            if(symbol==1){
                vm.query1.searchKey = searchKey;
                vm.pageIndex1 = 1;
            }else{
                vm.query2.searchKey = searchKey;
                vm.pageIndex2 = 1;
            }
            getCommonList(symbol);
        }

        /**
         * -----------------------------------------------维修项目tab页-----------------------------------------------------------
         */
        /**
         * 新增方法
         */
        vm.addRepair = function () {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.subscribe.upkeepedit'),
                controller: GetControllerName('tservice.subscribe.upkeepadd'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepadd',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                getRepairList();
                Message.success('操作成功');
            });
        }

        /**
         * 修改修理项
         * @param obj
         */
        vm.editRepair = function (obj) {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.subscribe.upkeepedit'),
                controller: GetControllerName('tservice.subscribe.upkeepedit'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepedit',
                resolve: {        //传参
                    maintainObj: function () {
                        return obj
                    }
                },
                backdrop: false
            }).result.then(function () {//回传到父级页面
                getRepairList();
                Message.success('操作成功');
            });
        };


        /**
         * 保养页脚点击方法
         * @param pageIndex
         */
        vm.flip1 = function (pageIndex) {
            vm.pageIndex1 = pageIndex;
            getList();
        };

        /**
         * 维修页脚点击方法
         * @param pageIndex
         */
        vm.flip2 = function (pageIndex) {
            vm.pageIndex2 = pageIndex;
            getRepairList();
        };

        /**
         * 获得列表方法
         */
        function getRepairList() {
            getCommonList(2);
        }

        /**
         * 页面加载刷新
         */
        getRepairList();
        getList();

    }

})();

