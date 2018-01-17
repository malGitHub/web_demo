
/**
 * Created by wangshuai on 2016/11/14.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderVisitController', TserviceDealorderVisitController);
  function TserviceDealorderVisitController($uibModalInstance,$state,Message,DealorderService,$rootScope,visitObj,PublicService) {
    var vm = this;
    vm.title="工单回访";
    vm.requesting=false;
    vm.userId=$rootScope.userInfo.userId;
    vm.content="";
    vm.woCode=visitObj.woCode;
    vm.rate = visitObj.userRate;
    vm.max = 5;
    vm.isReadonly = false;

    vm.hoveringOver = function(value) {
    vm.overStar = value;
    };

    vm.clickstart=function () {
      console.log(vm.rate)
    };

    vm.close = function (){
      $uibModalInstance.dismiss();
    };

    vm.info={};
    vm.driverId = "0";

    //获取工单详情
    DealorderService.WorkOrderDetail(vm.woCode).then(function (data) {
      vm.info = data;
    }).catch(function (err) {
      $rootScope.messageError (err, '获取工单详情失败，请稍后重试');
      }
    );

    vm.rateInfo={};

    //获取评价信息
      DealorderService.GetRate(vm.woCode).then(function (data) {
        vm.rateInfo = data;
        if(vm.rateInfo.rateContent!=''&&vm.rateInfo.rateContent!=null){
          vm.isReadonly = true;
        }else if(vm.rateInfo.rateScore!=''&&vm.rateInfo.rateScore!=null){
          vm.isReadonly = true;
        }else{
          vm.isReadonly = false;
        }
        vm.content = vm.rateInfo.rateContent;
        vm.rate=vm.rateInfo.rateScore;

      }).catch(function (err) {
        $rootScope.messageError (err, '获取评价失败，请稍后重试');
        }
      );


    //提交
    vm.submit = function (evt) {
      evt.preventDefault();
      vm.requesting=true;
       if(!vm.isReadonly){
         getDriverInfo();
      }else{
         addOperate();
       }
     };


    function getDriverInfo(){
      if(vm.info!=null && vm.info.repairTel!=null) {
        //获取司机ID
        PublicService.queryDriver(vm.info.repairTel)
          .then(function (driverdata) {
           vm.driverId = driverdata.driverId;
            addRate();
         }).catch(function (err) {
          vm.requesting=false;
          $rootScope.messageError (err, '获取司机信息失败，请稍后重试');
          }
        );
      }else{
        vm.requesting=false;
      }
    }

    function addRate(){

      //如果需要评价则提交评价信息
      DealorderService.AddRate(vm.woCode,vm.info.stationId,vm.driverId,vm.rate,vm.rateInfo.rateContent)
        .then(function () {
          addOperate();
      })
        .catch(function (err) {
        vm.requesting=false;
        $rootScope.messageError (err, '添加评价信息失败，请稍后重试');
        }
      );
    }


    function addOperate(){
      //写日志
      DealorderService.AddOperate(vm.woCode,"7",vm.info.carVin,vm.userId,"2","10",vm.content)
        .then(function () {
          updateAnswer();
         })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.messageError (err, '日志记录失败，请稍后重试');
        });
    }

    function updateAnswer(){
      //修改回访状态
      DealorderService.UpdateAnswer(vm.woCode)
        .then(function () {
          $uibModalInstance.close();
          Message.success('回访信息提交成功！');
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.messageError (err, '修改回访状态失败，请稍后重试');
        });
    }






 /*   //画可以评价的五星
    function drawStar() {
    /!*  var images = document.getElementsByTagName("Img");*!/
      var images = $(".visitstarimg");
      for (var i = 0; i < images.length; i++) {
        var index;
        images[i].addEventListener("click", function () {
          for (var j = 0; j < images.length; j++) {
            if (this == images[j]) {
              index = j;
            }
            images[j].src = "assets/images/star_n.png";
          }
          vm.rate = index+1;
          for (var n = 0; n <= index; n++) {
            images[n].src = "assets/images/star_y.png";
          }

        })
      }
    }

    //已经评价的展示出来
    function drawStar_already() {
     /!* var images = document.getElementsByTagName("Img");*!/
      var images = $(".visitstarimg");
      var star = Math.ceil(vm.rate);
      for (var n = 0; n < star; n++) {
        images[n].src = "assets/images/star_y.png";
      }

    }*/



  }
})();

