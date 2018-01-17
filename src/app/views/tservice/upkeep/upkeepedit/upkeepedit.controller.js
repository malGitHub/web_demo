(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceUpkeepUpkeepeditController', TserviceUpkeepUpkeepeditController);
    function TserviceUpkeepUpkeepeditController($rootScope,$uibModalInstance,TbossService, Message,modelNameList,mileage,itemTotal,modelName) {
        var vm = this;
        vm.title="编辑";
        vm.upkeepEdit=true;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.readonly=true;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            vm.query.items=vm.itemsArry.join(",");//数组元素用逗号','分开
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.ModifyMaintainBaseInfo(modelNameList,vm.query,$rootScope.userInfo.userId)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                      vm.requesting = false;
                      $rootScope.catchError(err);
                    })
            }
        };
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
            vm.query.modelName='';
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
            vm.query.modelName='';
            vm.CAR_Model='';
        };
        function getCAR_MODEL(va){
            vm.modelType="1";
            TbossService.getModelListUpkeep(va,vm.modelType)
                .then(function (data) {
                    vm.CAR_Model=data;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }

/*      /!**
       * 多选选中方法
       *!/
      vm.selUpkeep = function(arr){
      var indexOfValue = vm.itemsArryCache.indexOf(arr[0]);
       //如果是-1，则是新选中，新增到数组
      if(indexOfValue!=-1){
        vm.itemsArryCache.splice(indexOfValue,1);
      }else{//如果不是-1，则是取消选中，从数组中移除
        vm.itemsArryCache.push(vm.itemsArry[0]);
      }
      vm.itemsArry = vm.itemsArryCache;
     }


      vm.cacheSel = function(arr){
       vm.itemsArryCache = arr;
     }*/

    TbossService.QueryMaintainBaseDetail(modelNameList,mileage)
        .then(function (data) {
            vm.query={
                brand:parseInt(data.brandId),
                serise:parseInt(data.seriesId),
                modelNameList:modelNameList,
                mileage:parseInt(data.mileAge),
                modelName:modelName
            };
            getCAR_SERVICE(vm.query.brand);
            getCAR_MODEL(vm.query.serise);
            var arrayType =data.maintain_Items.split(',');
            for(var i=0;i<arrayType.length;i++){
                arrayType[i] = parseInt(arrayType[i]);
            }
            vm.itemsArry=arrayType;
        })
        .catch(function (err) {
            $rootScope.catchError(err);
        })
        .then(function () {
            vm.requesting = false;
        });

    }

})();
