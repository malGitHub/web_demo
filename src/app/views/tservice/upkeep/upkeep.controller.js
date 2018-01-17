(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceUpkeepController', TserviceUpkeepController);

    /** @ngInject */
    function TserviceUpkeepController($uibModal,GetTemplateUrl,GetControllerName, Message,TbossService,$rootScope) {
        var vm = this;
        vm.moreobject=false;
        vm.pageIndex = 1;
        vm.pageSize =10;
        vm.pageIndexTwo = 1;
        vm.pageSizeTwo =10;
        getList2();
        vm.formoreobj=function(){
            vm.moreobject=!vm.moreobject;
        };
        vm.flip = function (pageIndex) {
            vm.pageIndex = pageIndex;
            getList();
        };
        vm.flipTwo = function (pageIndexTwo) {
            vm.pageIndexTwo = pageIndexTwo;
            getList2();
        };
        vm.add=function(){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.upkeep.upkeepedit'),
                controller: GetControllerName('tservice.upkeep.upkeepadd'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepadd',
                backdrop: false,
                resolve:{
                      itemTotal:function(){return vm.totalTwo}
                }
            }).result.then(function () {//回传到父级页面
                     Message.success('添加成功');
                    getList();
                });
        };
        vm.edit=function(modelNameList,mileage,modelName){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.upkeep.upkeepedit'),
                controller: GetControllerName('tservice.upkeep.upkeepedit'),
                controllerAs: 'vm',
                windowClass: 'tservice-upkeep-small-upkeepedit',
                resolve:{
                    modelNameList:function(){return modelNameList},
                    modelName:function(){return modelName},
                    mileage:function(){return mileage},
                    itemTotal:function(){return vm.totalTwo}
                },
                backdrop: false
            }).result.then(function () {//回传到父级页面
                     Message.success('操作成功');
                    getList();
                });
        };
        vm.itemadd=function(){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.upkeep.upkeepitem'),
                controller: GetControllerName('tservice.upkeep.upkeepitem'),
                controllerAs: 'vm',
                windowClass: '',
                backdrop: false
            }).result.then(function () {
                     Message.success('添加成功');
                    getList2();
                });
        };
        vm.item=function(ItemId,ItemName){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.upkeep.upkeepitem'),
                controller: GetControllerName('tservice.upkeep.upkeepitemadd'),
                controllerAs: 'vm',
                windowClass: '',
                resolve:{        //传参
                    maintainItemId:function(){return ItemId},
                    maintainItemName:function(){return ItemName}
                },
                backdrop: false
            }).result.then(function () {
                     Message.success('操作成功');
                    getList2();
                });
        };
        vm.query={
            brand:'',
            serise:2267,
            modelNameList:''
        };
        function getList2() {
            TbossService.MaintainItemList(vm.pageIndexTwo,vm.pageSizeTwo,vm.inputText)
                .then(function (data) {
                    vm.mydata=data.list;
                    vm.itemList=data.list;
                    vm.totalTwo=data.total;
                  //得到全部保养项目
                  TbossService.MaintainItemList("1",vm.pageSizeTwo)
                    .then(function (data) {
                      vm.itemList2=data.list;
                      vm.upkeepLength=data.list.length+4;
                      getCAR_CHOICE();
                    })
                    .catch(function (err) {
                      $rootScope.catchError(err);
                    });
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        function getList() {
            TbossService.MaintainBaseList(vm.pageIndex,vm.pageSize,vm.query)
                .then(function (data) {
                    for (var i=0;i<data.list.length;i++) {
                        var items = data.list[i].maintainItems.split(",");
                        var temps = [];
                        for (var j=0;j<vm.itemList2.length;j++) {
                            temps.push({isOrNo: false});
                            for (var k=0;k<items.length;k++) {
                                if (parseInt(items[k]) == vm.itemList2[j].maintainItemId) {
                                    temps[j].isOrNo = true;
                                    break;
                                }
                            }
                        }
                        data.list[i].temps = temps;
                    }
                    vm.mydata2=data.list;
                    vm.total=data.total;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }

        //删除基础保养列表一条
        vm.remove = function (modelNameList,mileage,seriesId,seriesName,modelsName) {
            Message.confirm('确定要删除 ' + seriesName+' '+modelsName+ ' ？', '删除')
                .then(function () {
                    TbossService.DeleteMaintainBaseInfo(modelNameList,mileage,seriesId)
                        .then(function () {
                            Message.success('删除成功');
                            getList();
                        })
                        .catch(function (err) {
                          $rootScope.catchError(err);
                        });
                });
        };
        //删除保养项目一项
        vm.removeItem = function (id,name) {
            Message.confirm('确定要删除保养项 ' + name + ' ？', '删除')
                .then(function () {
                    TbossService.DelMaintainItem(id)
                        .then(function () {
                            Message.success('删除成功');
                            getList2();
                        })
                        .catch(function (err) {
                          $rootScope.catchError(err);
                        });
                });
        };

        //保养基础列表高级筛选品牌
       function getCAR_CHOICE(){
            TbossService.getBrandList()
                .then(function (data) {
                    vm.CAR_TYPE=data;
                    vm.query.brand=data[0].brandId;

                  getCAR_SERVICE(vm.query.brand);
            })
            .catch(function (err) {
                $rootScope.catchError(err);
            });
        }
        vm.changeSelect=function(obj){
            vm.query.modelNameList='';
            vm.CAR_SERIES='';
            vm.CAR_Model='';
            if(obj){
                getCAR_SERVICE(obj);
            }

        };
        function getCAR_SERVICE(va){
            TbossService.getSeriseList(va)
                .then(function (data) {
                vm.CAR_SERIES=data;
                getCAR_MODEL(vm.query.serise);

                  getList();
            })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }
        vm.changeSelectType=function(obj){
            vm.query.modelNameList='';
            vm.CAR_Model='';
            if(obj){
                getCAR_MODEL(obj);
            }
            getList();
        };
        vm.changeSelectModel=function(obj){
            getList();
        };
        function getCAR_MODEL(va){
            vm.modelType="1";
            TbossService.getCallModelList(va)
                .then(function (data) {
                    vm.CAR_Model=data;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });

        }
        vm.inputText='';
        vm.changeInput=function(){
            getList2()
        };
        vm.firstTab=function(){
             vm.inputText="";
            getList2();
        }

    }
})();

