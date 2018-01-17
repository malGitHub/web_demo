/**
 * 查看工单信息controller
 * @Author wangshuai
 * @Date 2016/11/23
 */
(function(){
  "use strict";
  angular.module("WeViews").controller("TserviceDealorderviewController",TserviceDealorderviewController);

  function TserviceDealorderviewController($sce,$state,$interval,$rootScope,myParams,$stateParams,$uibModal,DealorderService,Message,GetTemplateUrl,GetControllerName,InverseService){
    var vm = this;
    vm.id = $stateParams.id;
    vm.phone = $stateParams.phone;
    vm.requesting=false;
     vm.mile = '未知';
    vm.serviceInfoFlg = false;//服务流程信息展示开关
    vm.rateInfoFlg = false;//评价信息展示开关
    vm.modifyFlg = false;//修改标示
    vm.queryFlg = true;//查看标示
    /*完成待确认*/
    vm.systemAutoClose=false;
    vm.inRescueListShow=false;
    vm.outRescueListShow=false;
    vm.systemAutoCloseTime='';
    vm.systemAutoCloseWarn='';
    if($stateParams.flg == 'modify'){
      vm.modifyFlg = true;//修改标示
      vm.queryFlg = false;//查看标示
      myParams.set({"nature":2});
    }
    vm.order =  {};
    vm.serviceProcess = {};
    vm.rate = {};

    vm.address = "";//扫码位置
    vm.FILE="";

    vm.closeWin = function (){
       if(myParams.get().nature==1){
        $state.go('tservice.outrescue');
      }else if(myParams.get().nature==2){
         $state.go('tservice.dealorder');
       }else if(myParams.get().nature==3){
         $state.go('tservice.close');
       }else if(myParams.get().nature==4){
         $state.go('tservice.build');
       }
       else if(myParams.get().nature==5){
         $state.go('tservice.statistics');
       }else{
         $state.go('tservice.dealorder');
       }
       myParams.clear();
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
      if((vm.order.woStatus >1)&&(vm.order.woStatus !==8)){
        /*getServiceProcess();*/
        if(vm.order.woStatus >3){
          vm.serviceInfoFlg = true;
          getServiceRate();
        }
      }

    }).catch(function (err) {
        $rootScope.catchError(err);
        $state.go('tservice.dealorder');

      }
    );



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
      vm.requesting=true;
      //提交修改400工单号或备注
      DealorderService.ModifyOrder(vm.order.woCode,vm.order.csWoCode,vm.serviceProcess.content).then(function (){
        Message.success('工单修改成功！');
        $state.go("tservice.dealorder");
      }).catch(function (err) {
        vm.requesting=false;
        $rootScope.catchError(err);
      });
    };


    vm.sce = $sce.trustAsResourceUrl; //解除angular对未知来源地址的禁止
    vm.openImg=function (filter,index){
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.dealorderview.openimg'),
        controller: GetControllerName('tservice.dealorderview.openimg'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorderview-small-picture',
        resolve:{
          filter:function(){return filter},
          index:function(){return index}
        }
      })
    };
    /**************************************服务信息时间轴********************************************/
    // 服务流程节点信息
    getOperateRecord();
    function getOperateRecord() {
      DealorderService.woOperateRecord(vm.id)
        .then(function (data) {
          vm.serveInfo=data;
          vm.woType=data.woType;
        if(vm.serveInfo.serviceTime=='00,00,00'){
           vm.serveTime=true;
        }else {
           vm.serveTime=false;
          if(data.woState!=7&&data.woState!=10&&data.woState!=11){
            timeChange()
          }
         }
           //接站位置（逆地理）
          for(var p=0;p<data.record.length;p++){
            vm.recPos=data.record[p].recPos;
            if(vm.recPos!=null){
              vm.recPos=vm.recPos.split(",");
              vm.rec={lon:vm.recPos[0],lat:vm.recPos[1]};
              InverseService.inverse(vm.rec).then(function (data) {
                 vm.address = data.data.city.value + data.data.dist.value + data.data.road.roadname;
                });
             }
          }

          if(vm.serveInfo.record.length==0){
            vm.serveInformation=false;
          }else {
            vm.serveInformation=true;
            }
          //计时：每隔1分钟
          data.serviceTime=data.serviceTime.split(",");
          vm.day=data.serviceTime[0];//获取天
          vm.hour=data.serviceTime[1]; //获取时
          vm.minite=data.serviceTime[2];//获取分
            function timeChange() {
            $interval(function(){
              vm.minite++;
              if(vm.minite<10 ){
                 vm.minite='0'+vm.minite;
               } else if(vm.minite/60>=1){
                vm.minite=vm.minite-60;
                if(vm.minite<10){
                   vm.minite='0'+vm.minite;
                }
                vm.hour++;
                if(vm.hour<10){
                  vm.hour='0'+vm.hour
                }else if( vm.hour/24>=1){
                  vm.hour=vm.hour-24;
                  if(vm.hour<10){
                     vm.hour='0'+vm.hour;
                  }
                  vm.day++;
                  if(vm.day<10){
                    vm.day='0'+vm.day;
                  }

                }
              }
               vm.serveInfo.serviceTime=vm.day+'天'+vm.hour+'小时'+vm.minite+'分钟';
            },1000*60);
          }
          vm.serveInfo.serviceTime=vm.day+'天'+vm.hour+'小时'+vm.minite+'分钟';
          //有多次记录标签递增显示
          for(var n = 0; n < vm.serveInfo.record.length; n++){
            vm.list = [];
            for (var i = 0; i < vm.serveInfo.record.length; i++)
            {
              vm.hasRead = false;
              for (var k = 0; k < vm.list.length; k++)
              {
                if (i == vm.list[k])
                {
                  vm.hasRead = true;
                }
              }
              if (vm.hasRead) { break;}
              vm.index = i;
              vm.haveSame = false;
              for (var j = i + 1; j < vm.serveInfo.record.length; j++)
              {
                if (vm.serveInfo.record[i].title ==vm.serveInfo.record[j].title)
                {
                  vm.list.push(j);
                  vm.index += "," + j;
                  vm.haveSame = true;
                }
              }
              if (vm.haveSame)
              {
                vm.arr2=vm.index.split(",");
                if(vm.arr2.length!=1){
                  for(var m=0;m<vm.arr2.length;m++){
                    vm.serveInfo.record[vm.arr2[m]].title= vm.serveInfo.record[vm.arr2[m]].title+(m+1);
                  }
                }

              }
            }
          }

        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    }

  }
})();
