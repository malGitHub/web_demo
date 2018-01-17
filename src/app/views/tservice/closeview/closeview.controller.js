/**
 * 查看工单信息controller
 * @Author wangshuai
 * @Date 2016/11/23
 */
(function(){
  "use strict";
  angular.module("WeViews").controller("TserviceCloseviewController",TserviceCloseviewController);

  function TserviceCloseviewController($sce,$state,$stateParams,$uibModal,$rootScope,DealorderService,Message,GetTemplateUrl,GetControllerName,InverseService){
    var vm = this;
    vm.id = $stateParams.id;
    vm.phone = $stateParams.phone;
    vm.mile = '未知';
    vm.serviceInfoFlg = false;//服务流程信息展示开关
    vm.rateInfoFlg = false;//评价信息展示开关
    vm.modifyFlg = false;//修改标示
    vm.queryFlg = true;//查看标示
    if($stateParams.flg == 'modify'){
      vm.modifyFlg = true;//修改标示
      vm.queryFlg = false;//查看标示
    }
    vm.order =  {};
    vm.serviceProcess = {};
    vm.rate = {};

    vm.address = "";//扫码位置
    vm.FILE="";

    vm.closeWin = function (){
      $state.go('tservice.close');
    };

    //获取工单详情
    DealorderService.WorkOrderDetail(vm.id).then(function (data) {
      vm.order = data;
      if(data.driverFiles!= null && data.driverFiles!= '') {
        vm.FILE = data.driverFiles;
        vm.ContentImg = vm.FILE.split(';')[0].split(',');
        if (vm.FILE.split(';')[1] != null)
          vm.ContentMusic = vm.FILE.split(';')[1].split(',');
      }
       vm.woCode = data.woCode;
      vm.csWoCode = data.csWoCode;
      if(data.miles != null && data.miles!= '' && data.miles!= 'null')
        vm.mile = data.miles+"Km";
      if(vm.order.woStatus > 3){
        getServiceProcess();
        getServiceRate();
      }
    }).catch(function (err) {
        $rootScope.catchError(err);
        $state.go('tservice.dealorder');
      }
    );


    //获取服务流程信息
    function getServiceProcess(){
      DealorderService.ProcessDetail(vm.id).then(function (data) {
        vm.serviceProcess = data;
        if(data != null)
        vm.serviceInfoFlg = true;
        var loc = {};
        loc.lat = data.scanLat;
        loc.lon = data.scanLon;
        InverseService.inverse(loc).then(function(data){
            vm.address = data.data.city.value + data.data.dist.value + data.data.road.roadname;
          }
        );
        var processes = data.proList;
        for(var i=0;i<processes.length;i++){
          var str =
          "<label class='col-sm-2 control-label'>"+(i+1)+"次处理方式:</label>"+
          "<div class='col-sm-10'><label class='control-label'>"+processes[i].maintenanceWay+"</label></div><div style='clear: both'></div>"+
          "<label class='col-sm-2 control-label'>"+(i+1)+"次处理说明:</label>"+
          "<div class='col-sm-10'><label class='control-label'>"+processes[i].instruction+"</label></div><div style='clear: both'></div>"+
          "<label class='col-sm-2 control-label'>"+(i+1)+"次处理时间:</label>"+
          "<div class='col-sm-10'><label class='control-label'>"+processes[i].proTime+"</label></div><div style='clear: both'></div>"+
          "<label class='col-sm-2 control-label'>"+(i+1)+"次处理账号:</label>"+
          "<div class='col-sm-10'><label class='control-label'>"+processes[i].proUserId+"</label></div>";
          $("#process").append(str);
        }
      });

    }

    //获取服务评价信息
    function getServiceRate(){
      DealorderService.RateDetail(vm.id).then(function (data) {
        vm.rate = data;
        if(data != null) {
          vm.rateInfoFlg = true;
          var star = Math.ceil(data.rateScore);
          for (var i = 0; i < star; i++) {
            var str = "<img  class='img' src='assets/images/star.png'/>";
            $("#rateStar").append(str);
          }
        }

      });
    }

    vm.submit = function (evt){
      evt.preventDefault();
      //提交修改400工单号或备注
      DealorderService.ModifyOrder(vm.order.woCode,vm.order.csWoCode,vm.serviceProcess.content).then(function (){
           Message.success('工单修改成功！');
          $state.go("tservice.dealorder");
      }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    // 吴瑞测试file     20161229170217000001
    //vm.FILE='../../../../assets/images/homeBg.jpg,' +
    //  '../../../../assets/images/car.jpg;' +
    //  'http://wailian.ik6.com/up/20150413/18/20150413184553_27366.mp3,' +
    //  'http://m2.music.126.net/-6WuXkM9zn3uQwmgH_yG4Q==/7968160767570793.mp3'
    //;

    //vm.ContentImg = vm.FILE.split(';')[0].split(',');
    //vm.ContentMusic = vm.FILE.split(';')[1].split(',');

    vm.sce = $sce.trustAsResourceUrl; //解除angular对未知来源地址的禁止
    vm.openImg=function (filter,index){
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.closeview.openimg'),
        controller: GetControllerName('tservice.closeview.openimg'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorderview-small-picture',
        resolve:{
          filter:function(){return filter},
          index:function(){return index}
        }
      })
    }
  }
})();
