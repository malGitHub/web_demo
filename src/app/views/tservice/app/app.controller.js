(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAppController', TserviceAppController);


  /** @ngInject */
  function TserviceAppController($rootScope, $q, $uibModal,$window,$timeout, GetTemplateUrl, GetControllerName, AppService, Message) {
    var vm = this;
    vm.title = "注册用户管理";
    vm.templateUrl = '';
    vm.sumPage = 0;
    vm.pageIndex = 1;
    vm.pageSize = 10;
    vm.ROLES = [];//认证角色
    vm.BRANDS = [];//品牌
    vm.SERISES = [];//车系
    vm.MODELS = [];//车型
    vm.sortType = 0;
    vm.direction = 'down';


    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };

    vm.moreobject = false;
    vm.formoreobj = function () {
      vm.moreobject = !vm.moreobject;
    };
    vm.onSort = function () {
      vm.sortType === 0 ? vm.sortType = 1 : vm.sortType = 0;
      vm.direction === 'down' ? vm.direction = 'up' : vm.direction = 'down';
      vm.onFilter();
    };

    vm.onFilter = function () {
      vm.pageIndex = 1;
      appList();

    };

    vm.onRoleFilter = function () {
      vm.sortType = 0;
      vm.direction = 'down';
      vm.onFilter();
    };
    vm.onTimeFilter = function () {
      vm.sortType = 0;
      vm.direction = 'down';
      vm.onFilter();
    };

/*    vm.onBrandFilter = function () {
      vm.carSeries = null;
      vm.carModel = null;
      vm.SERISES = [];//车系
      vm.MODELS = [];//车型
      vm.sortType = 0;
      vm.direction = 'down';
      if (vm.carBrand != null) {
        getSerises();
      }
      appList();
    };*/

    getSerises();
    vm.onSeriesFilter = function () {
      if (vm.carSeries == null) {
        vm.carBrand=null;
      } else {
        vm.carBrand='10';     //品牌固定为一汽解放
      }
      vm.carModel = '';
      vm.MODELS = [];//车型
      vm.sortType = 0;
      vm.direction = 'down';
      if (vm.carSeries != null) {
        getModels();
      }
      appList();
    };

    vm.onModelFilter = function () {
      vm.sortType = 0;
      vm.direction = 'down';
      vm.onFilter();
    };

    init();

    function init() {
      vm.onFilter();
      getBrandList();
    }

    vm.query = function (page) {
      vm.sortType = 0;
      vm.direction = 'down';
      vm.pageIndex = page;
      appList();
    };
    //获取品牌下拉列表
    function getBrandList() {
      AppService.getbrands().then(function (values) {
        vm.BRANDS = values;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    /**
     * 查询
     */
    vm.onSearch = function () {
      vm.sortType = 0;
      vm.direction = 'down';
      vm.onFilter();
    };

    function appList() {
      AppService.registerUserList(vm.pageIndex, vm.pageSize, {
        registerDateEnd: vm.registerDateEnd,
        registerDateStart: vm.registerDateStart,
        userRole: vm.userRole,
        keyWord: vm.keyWord,
        carBrand: vm.carBrand,
        carSeries: vm.carSeries,
        carModel: vm.carModel,
        sortType: vm.sortType,
        sort: 'createDate'
      })
        .then(function (data) {
          vm.list = data.list;
          vm.sumPage = data.totalPages;
          vm.total = data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    // 打开查看车主页
    vm.seeOwner = function (data) {
      if (data) {
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.app.appowner'),
          controller: GetControllerName('tservice.app.appowner'),
          controllerAs: 'vm',
          windowClass: 'tservice-app-small-appdriver',
          backdrop: false,
          resolve: {
            userId: function () {
              return data.id;
            }
          }
        }).result.then(function () {
            appList();
          });
      } else {
        Message.warning('未选中查看信息');
      }
    };


    // 打开查看司机页
    vm.seeDriver = function (data) {
      if (data) {
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.app.appdriver'),
          controller: GetControllerName('tservice.app.appdriver'),
          controllerAs: 'vm',
          windowClass: 'tservice-app-small-appdriver',
          backdrop: false,
          resolve: {
            userId: function () {
              return data.id;
            }
          }
        }).result.then(function () {
            appList();
          });
      } else {
        Message.warning('未选中查看信息');
      }
    };
    //获取车系下拉列表
    function getSerises() {
      AppService.getSeriseList('10').then(function (values) {
        vm.SERISES = values;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    //获取车型下拉列表
    function getModels() {
      AppService.getModelList(vm.carSeries).then(function (values) {
        vm.MODELS = values;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    //
    $q.all([AppService.getRoles()])
      .then(function (values) {
        vm.ROLES = values[0];
        vm.ROLES.keys = {};
        vm.ROLES.forEach(function (status, index, statuses) {
          statuses.keys[status.key] = status.value;
        });
        appList();
      })
      .catch(function (err) {
        $rootScope.catchError(err);
      });

    /*导出*/
    vm.getExecl=function () {
      var email='';
      AppService.getExeclLink(vm.pageIndex, vm.pageSize,email, {
        registerDateEnd: vm.registerDateEnd,
        registerDateStart: vm.registerDateStart,
        userRole: vm.userRole,
        keyWord: vm.keyWord,
        carBrand: vm.carBrand,
        carSeries: vm.carSeries,
        carModel: vm.carModel,
        sortType: vm.sortType,
        sort: 'createDate'
      })
        .then(function(data){
           //window.open(data);
          Message.success("正在导出，请稍后");
          $timeout(function() {
            $window.location.href=data;
          },1000*10);
        })
        .catch(function(err){
          if(err.resultCode==530){
            $uibModal.open({
              templateUrl: GetTemplateUrl('tservice.app.email'),
              controller: GetControllerName('tservice.app.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                pageIndex: function () {
                    return vm.pageIndex;
                  },
                pageSize: function () {
                  return vm.pageSize;
                },
                query:function () {
                  return {
                    registerDateEnd: vm.registerDateEnd,
                    registerDateStart: vm.registerDateStart,
                    userRole: vm.userRole,
                    keyWord: vm.keyWord,
                    carBrand: vm.carBrand,
                    carSeries: vm.carSeries,
                    carModel: vm.carModel,
                    sortType: vm.sortType,
                    sort: 'createDate'
                  };
                }
                }
            })
          }else{
            $rootScope.catchError(err);
          }
        })
    }
  }
})
();
