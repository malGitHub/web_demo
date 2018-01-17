
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceSupplysourceController', TserviceSupplysourceController);

  /** @ngInject */
  function TserviceSupplysourceController($rootScope,$window,$timeout,Message,$uibModal,SupplysourceService,GetTemplateUrl,GetControllerName) {
    var vm = this;
    vm.nowDate=new Date();
    vm.page_number=1;
    vm.page_size=10;

    //审核状态
    vm.manualReview="";
    vm.thirdReview="";
    vm.finalReview="";
    vm.stateResult=[{key:'2',value:'审核中'},{key:'3',value:'不通过'},{key:'4',value:'通过'}];
    vm.stateResultOther=[{key:'3',value:'不通过'},{key:'4',value:'通过'}];
    vm.thirdCommits=[{key:'1',value:'身份证实名认证'},{key:'2',value:'身份证'},{key:'3',value:'驾驶证'},{key:'4',value:'行驶证'},{key:'5',value:'真实头像'}];

    vm.controlSort=false;
    vm.type="";
    vm.orderCheck = function () {
      vm.controlSort=!vm.controlSort;
      if(vm.controlSort){
        vm.type=0;
      }else {
        vm.type=1;
      }
      vm.queryData();
      return vm.sortType;
    };
    //人工审查开关
    vm.checkOn = "ON";
    vm.controlSwitch=false;
    vm.manualSwitch=0;
     vm.personcheck = function () {
       vm.controlSwitch=!vm.controlSwitch;
       if(vm.controlSwitch){
         vm.manualSwitch=1;
         vm.checkOn="OFF";
       }else {
         vm.manualSwitch=0;
         vm.checkOn="ON";
       }
      };

    //查看审查原则说明
    vm.prinexplain = false;
     vm.showDetailAll= function () {
      vm.prinexplain = true;
    };
    //关闭审查原则说明
    vm.closeDetailAll = function () {
      vm.prinexplain = false;
    };
    //高级筛选控制开关
    vm.highcontrol = false;
    vm.choosemore = function () {
      vm.highcontrol = !vm.highcontrol;
    };

    vm.query = {
      reviewDateStart:"",
      reviewDateEnd:"",
      submitDateStart:"",
      submitDateEnd:"",
      manualReview :"",
      thirdReview : "",
      finalReview : "",
      keyWord : ""
     };

    //货源会员认证列表查询
    vm.queryData =function (){
       SupplysourceService.getData(vm.query,vm.manualSwitch,vm.type,vm.page_number,vm.page_size)
        .then(function(data){
          vm.total = data.total;
          vm.informa = data.list;
        })
        .catch(function(err){
          $rootScope.catchError(err);
        })

    };
    vm.queryData();
    //分页
    vm.flip= function (page_number) {
      vm.page_number = page_number;
      //调用会话列表接口
      vm.queryData();
    };

    /*导出*/
    vm.getExecl=function () {
      //$('#btnExcel').attr('disabled',true);
      var email='';
      SupplysourceService.getExeclLink(email,vm.query,vm.manualSwitch,vm.type,vm.page_number,vm.page_size)
        .then(function(data){
          //window.open(data);
            Message.success("正在导出，请稍后");
             $timeout(function() {
             $window.location.href=data;
             //$('#btnExcel').attr('disabled',false);
           },1000*10);
          })
        .catch(function(err){
          if(err.resultCode==530){
            $uibModal.open({
              templateUrl: GetTemplateUrl('tservice.supplysource.email'),
              controller: GetControllerName('tservice.supplysource.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                query: function () {return vm.query;},
                manualSwitch: function () {return vm.manualSwitch;},
                page_number: function () {return vm.page_number;},
                page_size: function () {return vm.page_size;}
              }
            })
          }else{
            /*setTimeout(function() {
               $('#btnExcel').attr('disabled',false);
            },1000*3);*/
              $rootScope.catchError(err);
          }
        })
    };

    /**************************************************** tab2 hcb start ****************************************/

    vm.tab2 = {
      page_number: 1,
      page_size: 10
      //sortType: 0
    };

    //审核状态
    vm.tab2.manualReview="";
    vm.tab2.thirdReview="";
    vm.tab2.finalReview="";
    vm.tab2.stateResult=[{key:'2',value:'审核中'},{key:'3',value:'不通过'},{key:'4',value:'通过'}];
    vm.tab2.stateResultOther=[{key:'3',value:'不通过'},{key:'4',value:'通过'}];

    vm.tab2.controlSort=false;
    vm.tab2.type="";
    vm.tab2.orderCheck = function () {
      vm.tab2.controlSort=!vm.tab2.controlSort;
      if(vm.tab2.controlSort){
        vm.tab2.type=0;
      }else {
        vm.tab2.type=1;
      }
      vm.queryData2();
      return vm.sortType;
    };
    //人工审查开关
    vm.tab2.checkOn = "ON";
    vm.tab2.controlSwitch=false;
    vm.tab2.manualSwitch=0;
    vm.tab2.personcheck = function () {
      vm.tab2.controlSwitch=!vm.tab2.controlSwitch;
      if(vm.tab2.controlSwitch){
        vm.tab2.manualSwitch=1;
        vm.tab2.checkOn="OFF";
      }else {
        vm.tab2.manualSwitch=0;
        vm.tab2.checkOn="ON";
      }
    };

    //查看审查原则说明
    vm.tab2.prinexplain = false;
    vm.tab2.showDetailAll= function () {
      vm.tab2.prinexplain = true;
    };
    //关闭审查原则说明
    vm.tab2.closeDetailAll = function () {
      vm.tab2.prinexplain = false;
    };
    //高级筛选控制开关
    vm.tab2.highcontrol = false;
    vm.tab2.choosemore = function () {
      vm.tab2.highcontrol = !vm.tab2.highcontrol;
    };

    vm.tab2.query = {
      auditDateS:"",
      auditDateE:"",
      submitDateS:"",
      submitDateE:"",
      manualStatus :"",
      thirdStatus : "",
      finalStatus : "",
      keyword : ""
    };

    //货源会员认证列表查询
    vm.queryData2 =function (){
      SupplysourceService.hcbAuthInfoList(vm.tab2.query,vm.tab2.manualSwitch,vm.type,vm.tab2.page_number,vm.tab2.page_size,vm.page_total)
        .then(function(data){
          vm.tab2.total = data.total;
          vm.tab2.informa = data.list;
        })
        .catch(function(err){
          $rootScope.catchError(err);
        })

    };
    vm.queryData2();
    //分页
    vm.tab2.flip= function (page_number) {
      vm.tab2.page_number = page_number;
      //调用会话列表接口
      vm.queryData2();
    };

    /*导出*/
    vm.tab2.getExecl=function () {
      //$('#btnExcel').attr('disabled',true);
      var email='';
      SupplysourceService.getHcbExeclLink(email,vm.tab2.query,vm.tab2.manualSwitch,vm.tab2.type,vm.tab2.page_number,vm.tab2.page_size)
        .then(function(data){
          //window.open(data);
          Message.success("正在导出，请稍后");
          $timeout(function() {
            $window.location.href=data;
            //$('#btnExcel').attr('disabled',false);
          },1000*10);
        })
        .catch(function(err){
          if(err.resultCode==530){
            $uibModal.open({
              templateUrl: GetTemplateUrl('tservice.supplysource.email'),
              controller: GetControllerName('tservice.supplysource.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                query: function () {return vm.query;},
                manualSwitch: function () {return vm.manualSwitch;},
                page_number: function () {return vm.page_number;},
                page_size: function () {return vm.page_size;}
              }
            })
          }else{
            /*setTimeout(function() {
             $('#btnExcel').attr('disabled',false);
             },1000*3);*/
            $rootScope.catchError(err);
          }
        })
    }

   }
})();

