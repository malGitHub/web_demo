(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAssigndocumentController', TserviceAssigndocumentController);


  /** @ngInject */
  function TserviceAssigndocumentController(ActivityService,$uibModal,$rootScope,$interval,$window,$timeout,GetTemplateUrl, GetControllerName, Message,CustomerService,OperateService) {

    var vm = this;
    $rootScope.CustomerInterval = $interval(function () {
      getList2();
    }, 1000 *30);
    vm.pageIndex=1;
    vm.pageSize=10;
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      getList();
    };
    vm.masterFlg=0;
    vm.moreSearch=false;
    vm.query={
      woCode:'',
      csWoCode:'',
      engineCode:'',
      carModel:'',
      carCph:'',
      carMileage:'',
      woTypeName:'',
      orderWay:'',
      orderWayName:''
    };
    vm.filter={
      woId:'',
      woType:'',
      orderWay:''
    };
    //获取当前使用者userId
    vm.dealer=$rootScope.userInfo.userId;
    //判断当前使用者角色
    function getRole() {
      OperateService.queryRuleList(vm.dealer)
        .then(function (data) {
          if(data){
            vm.masterFlg=data.masterFlg;
            vm.userName=data.userName;
          }
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getRole();
    //高级筛选下拉
    vm.MISSTYPE=[
      {key:'1',value:'进出站'},{key:'2',value:'外出救援'}
    ];
    vm.ORDER=[
      {key:'1',value:'400'},{key:'2',value:'app'},{key:'3',value:'自主进站'}
    ];
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    //搜索
    vm.toSearch=function(){
      getList();
    };

    //省份下拉框选择操作
    getProvince();
    function getProvince(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvince=function(){
       if(vm.provinceId != '' && vm.provinceId != null) {
         getList();
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.provinceId)
          .then(function (data) {
            vm.CityList = data;
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.StoreList = [];
        vm.CityList = [];
        vm.cityId='';
        vm.storeId = '';
         getList();
      }
    };


    //城市下拉框选择操作
    vm.changeCity=function(){
      vm.StoreList=[];
      if(vm.provinceId != '' && vm.provinceId != null) {
        getStoreList();
       }
      getList();
    };

    //服务站下拉框选择操作
    function getStoreList(){
      if(vm.cityId!= '' && vm.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.provinceId, vm.cityId, '2')
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
        getList();
      }else {
        vm.StoreList = [];
         vm.storeId = '';
        getList();
      }

    }

    vm.changeStore = function(){
      if(vm.storeId != null  && vm.storeId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.storeId == vm.StoreList[i].stationId){
            vm.storeType = vm.StoreList[i].storeType;
            break;
          }
        }
        getList();
      }

    };
    //获取列表
    function getList() {
      CustomerService.CustomerList(vm.pageIndex,vm.pageSize,vm.filter,vm.dealer,vm.provinceId,vm.cityId,vm.storeId)
        .then(function (data) {
          vm.list=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    function getList2() {
      CustomerService.CustomerList(vm.pageIndex,vm.pageSize,vm.filter,vm.dealer,vm.provinceId,vm.cityId,vm.storeId)
        .then(function (data) {
          vm.list=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.consoleError(err);
        });
    }
    getList();
    // 我要处理
    vm.handle = function (obj) {
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.assigndocument.handle'),
          controller: GetControllerName('tservice.assigndocument.handle'),
          controllerAs: 'vm',
          windowClass: '',
          backdrop: false,
          resolve: {
            FILTER:function () {
                return obj;
              },
            dealer: function () {
              return vm.userName;
            }
          }
        }).result.then(function () {
          Message.success('抢单成功！');
          getList();
          });
    };
    //复选框批量处理
    vm.result = [];
    vm.select = function(id,event) {
      var action = event.target;
      if (action.checked) {//选中，就添加
        if (vm.result.indexOf(id) == -1) {//不存在就添加
          vm.result.push(id);
        }
      } else {//去除就删除result里
        var idx = vm.result.indexOf(id);
        if (idx != -1) {//存在就删除
          vm.result.splice(idx, 1);//splice() 从数组中添加/删除项目，然后返回被删除的项目。
        }
      }
     };
    //分单
    vm.toBatch = function (id) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.assigndocument.batch'),
        controller: GetControllerName('tservice.assigndocument.batch'),
        controllerAs: 'vm',
        windowClass: '',
        backdrop: false,
        resolve: {
          woIds: function () {
            return id
          }
        }
      }).result.then(function () {
        Message.success('分配成功！');
        getList();
      });

    };
    //批量分单
    vm.toBatchMore = function () {
      if(vm.result.length==0){
        Message.error('您还没有选中工单');
        return false;
      }
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.assigndocument.batch'),
        controller: GetControllerName('tservice.assigndocument.batchmore'),
        controllerAs: 'vm',
        windowClass: '',
        backdrop: false,
        resolve: {
          woIds: function () {
            return vm.result.join(",");
          }
        }
      }).result.then(function () {
        Message.success('分配成功！');
        getList();
      });
    };

    /*导出*/
    vm.getExecl=function () {
      var email='';
      var filters={
        page_number:vm.pageIndex,
        page_size:vm.pageSize,
        userId:vm.dealer,
        provinceId:vm.provinceId,
        cityId:vm.cityId,
        storeId:vm.storeId
      };
      CustomerService.getExeclLink(email,vm.filter,filters)
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
              templateUrl: GetTemplateUrl('tservice.assigndocument.email'),
              controller: GetControllerName('tservice.assigndocument.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                filters: function () {return filters;},
                query: function () {return vm.filter;}
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

