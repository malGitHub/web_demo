(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceUpkeepUpkeepaddController', TserviceUpkeepUpkeepaddController);
    function TserviceUpkeepUpkeepaddController($rootScope,$uibModalInstance,TbossService, Message,itemTotal) {
        var vm = this;
        vm.title="新增";
        vm.query={
            brand:'',
            serise:'',
            modelNameList:'',
            items:'',
            mileage:'',
            userId:$rootScope.userInfo.userId
        };
        vm.upkeepEdit=false;
        vm.readonly=false;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.submit = function (evt, form) {
            evt.preventDefault();
            vm.query.items=vm.itemsArry.join(",");//数组元素用逗号','分开
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.addMaintainBaseList(vm.query)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                      vm.requesting = false;
                      $rootScope.catchError(err);
                    })
            }
        };
        //新增保养车型，车系下拉
        function getCAR_CHOICE(){
            TbossService.getBrandList()
                .then(function (data) {
                    vm.CAR_TYPE=data;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        getCAR_CHOICE();
        vm.changeSelect=function(obj){
            if(obj){
                getCAR_SERVICE(obj);
            }
            vm.query.serise='';
            vm.query.modelNameList='';
            vm.CAR_SERIES='';
            vm.CAR_Model='';
        };
        function getCAR_SERVICE(va){
            TbossService.getSeriseList(va)
                .then(function (data) {
                    vm.CAR_SERIES=data;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        vm.changeSelectType=function(obj){
            if(obj){
                getCAR_MODEL(obj);
            }
            vm.query.modelNameList='';
            vm.CAR_Model='';
        };

        function getCAR_MODEL(va){
            TbossService.getCallModelList(va)
                .then(function (data) {
                    vm.CAR_Model=data;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        //新增保养项目列表
        function getList2() {
            TbossService.MaintainItemList(vm.pageIndexItem,itemTotal)
                .then(function (data) {
                    vm.CAR_UPKEEP=data.list;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        getList2();

    }

})();
