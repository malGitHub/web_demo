(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAuthenticationController', TserviceAuthenticationController);

  /** @ngInject */
  function TserviceAuthenticationController($q, $uibModal,$window, ActivityService,GetTemplateUrl,$timeout, GetControllerName, Message,$rootScope, AuthenticationService,TbossService) {
    var vm = this;
    vm.templateUrl = '';
    vm.EX_STATUSES = [];//人工审核状态
    vm.EX_RESULTS = [];
    vm.EX_SYS_STATUSES = [];//系统审核状态
    vm.EX_SYS_RESULTS = [];//系统审核结果


    /**************************************************** tab1 start ****************************************/
    vm.tab1 = {
      sumPage: 0,
      pageIndex: 1,
      pageSize: 10,
      sort: 1,//降序
      direction: 'down'
    };
    /*获取车辆车型车系*/
    TbossService.getBrandList()
      .then(function (data) {
        getCAR_SERVICE(data[0].brandId);
      })
      .catch(function (err) {
        $rootScope.messageError (err, '获取车辆品牌信息失败，请稍后重试');
      });

    function getCAR_SERVICE(bid) {
      TbossService.getSeriseList(bid)
        .then(function (data) {
          vm.CAR_SERIES = data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    gettab1Province();
    function gettab1Province(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaListOne=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changetab1Province=function(){

      if(vm.provinceIdOne != '' && vm.provinceIdOne != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.provinceIdOne)
          .then(function (data) {
            tab1List();
            vm.CityListOne = data;
            vm.storeTypeOne = '';
            vm.StoreListOne = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.storeTypeOne = '';
        vm.provinceIdOne='';
        vm.cityIdOne='';
        vm.StoreListOne = [];
        vm.CityListOne = [];
        tab1List();
      }
    };


    //城市下拉框选择操作
    vm.changetab1City=function(){
      vm.storeTypeOne='';
      vm.StoreListOne=[];
      if(vm.provinceIdOne != '' && vm.provinceIdOne != null) {
        tab1List();
      }
    };

    /*人工筛选车系*/
    vm.changeSelectType=function(obj){
      vm.modelNameList='';
      vm.CAR_Model='';
      if(obj){
        getCAR_MODEL(obj);
      }
      tab1List();
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
    vm.changeSelectModel=function(){
         tab1List();
       /*else{
        vm.modelNameList="1";
        tab1List()
      }*/
    };


    vm.changeTab = function (tabIndex) {
      vm.tabIndex = tabIndex;
      vm.tabIndex == 1 ? vm.queryTab1List() : vm.queryTab2List();
    };

    vm.queryTab1List = function () {
      vm.tab1.applyUser = null;
      vm.tab1.reviewStatus = null;
      vm.tab1.applyDate = null;
      vm.tab1.reviewResult = null;
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    }


    vm.tab1.moreobject = false;
    vm.tab1.formoreobj = function () {
      vm.tab1.moreobject = !vm.tab1.moreobject;
    };

    vm.tab1.onStatusFilter = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };
    vm.tab1.onTimeFilterStart = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };
    vm.tab1.onTimeFilterEnd = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };
    vm.tab1.onResultFilter = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };
    vm.tab1.onVinFilter = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };
    vm.tab1.onFilter = function () {
      vm.tab1.pageIndex = 1;
      tab1List();
    };

    vm.tab1.query = function (page) {
      vm.tab1.pageIndex = page;
      tab1List();
    };

    /**
     * 查询
     */
    vm.tab1.onSearch = function () {
      vm.tab1.sort = 1;
      vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };

    vm.tab1.onSort = function () {
      vm.tab1.sort === 1 ? vm.tab1.sort = 2 : vm.tab1.sort = 1;
      vm.tab1.direction === 'down' ? vm.tab1.direction = 'up' : vm.tab1.direction = 'down';
      vm.tab1.onFilter();
    };

    // 人工审核-打开查看界面
    vm.tab1.see = function (data) {
      if (data) {
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.authentication.examine'),
          controller: GetControllerName('tservice.authentication.examine'),
          controllerAs: 'vm',
          windowClass: 'tservice-authentication-small-examine',
          backdrop: false,
          resolve: {
            mainData: function () {
              return data;
            }
          }
        }).result.then(function () {
            Message.success('审核成功');
            tab1List();
          });
      } else {
        Message.warning('未选中审核信息');
      }
    };


    // tab1 先获取审核状态和审核结果，再获取审核列表
    $q.all([AuthenticationService.getExamineStatuses(), AuthenticationService.getExamineResults(), AuthenticationService.getSysExamineStatuses(), AuthenticationService.getSysExamineResults()])
      .then(function (values) {
        vm.EX_STATUSES = values[0];
        vm.EX_STATUSES.keys = {};
        vm.EX_STATUSES.forEach(function (status, index, statuses) {
          statuses.keys[status.key] = status.value;
        });
        vm.EX_RESULTS = values[1];
        vm.EX_RESULTS.keys = {};
        vm.EX_RESULTS.forEach(function (status, index, statuses) {
          statuses.keys[status.key] = status.value;
        });
        vm.EX_SYS_STATUSES = values[2];
        vm.EX_SYS_STATUSES.keys = {};
        vm.EX_SYS_STATUSES.forEach(function (status, index, statuses) {
          statuses.keys[status.key] = status.value;
        });
        vm.EX_SYS_RESULTS = values[3];
        vm.EX_SYS_RESULTS.keys = {};
        vm.EX_SYS_RESULTS.forEach(function (status, index, statuses) {
          statuses.keys[status.key] = status.value;
        });


        tab1List();
        tab2List();

      })
      .catch(function (err) {
        $rootScope.catchError(err);
      });

    function tab1List() {
      AuthenticationService.authenticationList(vm.tab1.pageIndex, vm.tab1.pageSize,vm.provinceIdOne,vm.cityIdOne, {
        reviewStatus: vm.tab1.reviewStatus,
        applyUser: vm.tab1.applyUser,
        searchKey: vm.tab1.searchKey,
        applyDateStart: vm.tab1.applyDateStart ? vm.tab1.applyDateStart.replace(/\./g, '') : vm.tab1.applyDateStart,
        applyDateEnd: vm.tab1.applyDateEnd ? vm.tab1.applyDateEnd.replace(/\./g, '') : vm.tab1.applyDateEnd,
        reviewResult: vm.tab1.reviewResult,
        sort: vm.tab1.sort,
        carVin: vm.tab1.carVin,
        series: vm.serise,
        model: vm.modelNameList
      })
        .then(function (data) {
          vm.tab1.list = data.list;
          vm.tab1.sumPage = data.totalPages;
          vm.tab1.total = data.total;
        })
        .catch(function (err) {
           $rootScope.catchError(err);
        });
    }

    /**************************************************** tab1 end ****************************************/

    /**************************************************** tab2 start ****************************************/
    vm.tab2 = {
      sumPage: 0,
      pageIndex: 1,
      pageSize: 10,
      sortType: 0
    };
    /*系统筛选车系*/
    vm.changeSelectType2=function(obj){
      vm.modelNameList2='';
      vm.CAR_Model2='';
       if(obj){
        getCAR_MODEL2(obj);
      }
      tab2List();
    };
    function getCAR_MODEL2(va){
      TbossService.getCallModelList(va)
        .then(function (data) {
          vm.CAR_Model2=data;
         })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    vm.changeSelectModel2=function(){
         tab2List();
      /*else{
       vm.modelNameList="1";
       tab1List()
       }*/
    };


    gettab2Province();
    function gettab2Province(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaListTwo=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changetab2Province=function(){

      if(vm.provinceIdTwo != '' && vm.provinceIdTwo != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.provinceIdTwo)
          .then(function (data) {
            tab2List();
            vm.CityListTwo = data;
            vm.storeTypeTwo = '';
            vm.StoreListTwo = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.storeTypeTwo = '';
        vm.StoreListTwo = [];
        vm.provinceIdTwo='';
        vm.cityIdTwo='';
        vm.CityListTwo = [];
        tab2List();
      }
    };


    //城市下拉框选择操作
    vm.changetab2City=function(){
      vm.storeTypeTwo='';
      vm.StoreListTwo=[];
      if(vm.provinceIdTwo != '' && vm.provinceIdTwo != null) {
        tab2List();
      }
    };

    vm.queryTab2List = function () {
      vm.tab2.keyWord = null;
      vm.tab2.reviewStatus = null;
      vm.tab2.applyDate = null;
      vm.tab2.reviewResult = null;
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    }

    vm.tab2.moreobject = false;
    vm.tab2.formoreobj = function () {
      vm.tab2.moreobject = !vm.tab2.moreobject;
    };

    vm.tab2.onStatusFilter = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };
    vm.tab2.onTimeFilterStart = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };
    vm.tab2.onTimeFilterEnd = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };
    vm.tab2.onResultFilter = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };
    vm.tab2.onVinFilter = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };

    vm.tab2.onFilter = function () {
      vm.tab2.pageIndex = 1;
      tab2List();
    };

    vm.tab2.query = function (pageIndex) {
      vm.tab2.pageIndex = pageIndex;
      tab2List();
    };
    vm.tab2.onSort = function () {
      vm.tab2.sortType === 0 ? vm.tab2.sortType = 1 : vm.tab2.sortType = 0;
      vm.tab2.direction === 'down' ? vm.tab2.direction = 'up' : vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };

    // 系统审核-打开查看界面
    vm.tab2.see = function (data) {
      if (data) {
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.authentication.autoexamine'),
          controller: GetControllerName('tservice.authentication.autoexamine'),
          controllerAs: 'vm',
          windowClass: 'overhidx',
          backdrop: false,
          resolve: {
            id: function () {
              return data.id;
            }
          }
        }).result.then(function () {
            Message.success('审核成功');
            tab2List();
          });
      } else {
        Message.warning('未选中审核信息');
      }
    };

    /**
     * 查询
     */
    vm.tab2.onSearch = function () {
      vm.tab2.sortType = 0;
      vm.tab2.direction = 'down';
      vm.tab2.onFilter();
    };

    function tab2List() {
      AuthenticationService.authenticationSysList(vm.tab2.pageIndex, vm.tab2.pageSize,vm.provinceIdTwo,vm.cityIdTwo, {
        reviewStatus: vm.tab2.reviewStatus,
        applyUser: vm.tab2.applyUser,
        searchKey: vm.tab2.searchKey,
        applyDateStart: vm.tab2.applyDateStart ? vm.tab2.applyDateStart.replace(/\./g, '-') : vm.tab2.applyDateStart,
        applyDateEnd: vm.tab2.applyDateEnd ? vm.tab2.applyDateEnd.replace(/\./g, '-') : vm.tab2.applyDateEnd,
        reviewResult: vm.tab2.reviewResult,
        reviewer: vm.tab2.reviewer,
        keyWord: vm.tab2.keyWord,
        sortType: vm.tab2.sortType,
        carVin: vm.tab2.carVin,
        sort: 'applyDate',
        series: vm.serise2,
        model: vm.modelNameList2
      })
        .then(function (data) {
          vm.tab2.list = data.list;
          vm.tab2.sumPage = data.totalPages;
          vm.tab2.total = data.total;
        })
        .catch(function (err) {
          console.log(err);
          $rootScope.catchError(err);
        });
    }

    /**************************************************** tab2 end ****************************************/
    /*人工审核导出*/
    vm.getExcelManual=function () {
      var email='';
      AuthenticationService.getExcelManual(email,vm.tab1.pageIndex, vm.tab1.pageSize,vm.provinceIdOne,vm.cityIdOne, {
        reviewStatus: vm.tab1.reviewStatus,
        applyUser: vm.tab1.applyUser,
        searchKey: vm.tab1.searchKey,
        applyDateStart: vm.tab1.applyDateStart ? vm.tab1.applyDateStart.replace(/\./g, '') : vm.tab1.applyDateStart,
        applyDateEnd: vm.tab1.applyDateEnd ? vm.tab1.applyDateEnd.replace(/\./g, '') : vm.tab1.applyDateEnd,
        reviewResult: vm.tab1.reviewResult,
        sort: vm.tab1.sort,
        carVin: vm.tab1.carVin,
        series: vm.serise,
        model: vm.modelNameList
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
              templateUrl: GetTemplateUrl('tservice.authentication.email'),
              controller: GetControllerName('tservice.authentication.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                pageIndex: function () {
                  return vm.tab1.pageIndex;
                },
                pageSize: function () {
                  return vm.tab1.pageSize;
                },
                query:function () {
                  return {
                    reviewStatus: vm.tab1.reviewStatus,
                    applyUser: vm.tab1.applyUser,
                    searchKey: vm.tab1.searchKey,
                    applyDateStart: vm.tab1.applyDateStart ? vm.tab1.applyDateStart.replace(/\./g, '') : vm.tab1.applyDateStart,
                    applyDateEnd: vm.tab1.applyDateEnd ? vm.tab1.applyDateEnd.replace(/\./g, '') : vm.tab1.applyDateEnd,
                    reviewResult: vm.tab1.reviewResult,
                    sort: vm.tab1.sort,
                    carVin: vm.tab1.carVin,
                    series: vm.serise,
                    provinceId: vm.provinceIdOne,
                    cityId: vm.provinceIdOne,
                    model: vm.modelNameList
                  };
                }
              }
            })
          }else{
            $rootScope.catchError(err);
          }
        })
    };

    /*系统审核导出*/
    vm.getExcelSystem=function () {
      var email='';
      AuthenticationService.getExcelSystem(email,vm.tab2.pageIndex, vm.tab2.pageSize,vm.provinceIdTwo,vm.cityIdTwo, {
        reviewStatus: vm.tab2.reviewStatus,
        applyUser: vm.tab2.applyUser,
        searchKey: vm.tab2.searchKey,
        applyDateStart: vm.tab2.applyDateStart ? vm.tab2.applyDateStart.replace(/\./g, '-') : vm.tab2.applyDateStart,
        applyDateEnd: vm.tab2.applyDateEnd ? vm.tab2.applyDateEnd.replace(/\./g, '-') : vm.tab2.applyDateEnd,
        reviewResult: vm.tab2.reviewResult,
        reviewer: vm.tab2.reviewer,
        keyWord: vm.tab2.keyWord,
        sortType: vm.tab2.sortType,
        carVin: vm.tab2.carVin,
        sort: 'applyDate',
        series: vm.serise2,
        model: vm.modelNameList2
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
              templateUrl: GetTemplateUrl('tservice.authentication.email'),
              controller: GetControllerName('tservice.authentication.emailSystem'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                pageIndex: function () {
                  return vm.tab2.pageIndex;
                },
                pageSize: function () {
                  return vm.tab2.pageSize;
                },
                provinceId: function () {
                  return vm.provinceIdTwo;
                },
                cityId: function () {
                  return vm.cityIdTwo;
                },
                query:function () {
                  return {
                    reviewStatus: vm.tab2.reviewStatus,
                    applyUser: vm.tab2.applyUser,
                    searchKey: vm.tab2.searchKey,
                    applyDateStart: vm.tab2.applyDateStart ? vm.tab2.applyDateStart.replace(/\./g, '-') : vm.tab2.applyDateStart,
                    applyDateEnd: vm.tab2.applyDateEnd ? vm.tab2.applyDateEnd.replace(/\./g, '-') : vm.tab2.applyDateEnd,
                    reviewResult: vm.tab2.reviewResult,
                    reviewer: vm.tab2.reviewer,
                    keyWord: vm.tab2.keyWord,
                    sortType: vm.tab2.sortType,
                    carVin: vm.tab2.carVin,
                    sort: 'applyDate',
                    series: vm.serise2,
                    model: vm.modelNameList2
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
})();

