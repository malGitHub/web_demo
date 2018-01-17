
/**
 * Created by wangshuai on 2016/11/14.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderCloseController', TserviceDealorderCloseController);
  function TserviceDealorderCloseController($uibModalInstance,Message,$state,$rootScope,closeObj,DealorderService,PublicService) {
    var vm = this;
    vm.title="工单关闭";
    vm.rate=1;
    vm.content="";
    vm.woCode=closeObj.woCode;
    vm.userId=$rootScope.userInfo.userId;
    vm.info;
    vm.driverId = "0";

    vm.close = function (){
      $uibModalInstance.dismiss();
    };

    //获取工单详情
    DealorderService.WorkOrderDetail(vm.woCode).then(function (data) {
      vm.info = data;
      getDriverInfo();
      drawStar();
    }).catch(function (err) {
      $rootScope.catchError(err);
      // $rootScope.messageError (err, '获取工单详情失败，请稍后重试');
      // vm.close();
      }
    );


    function getDriverInfo(){
      if(vm.info!=null && vm.info.repairTel!=null) {
        //获取司机ID
        PublicService.queryDriver(vm.info.repairTel).then(function (data) {
           if(data!=null){
            vm.driverId = data.driverId;
          }
        }).catch(function (err) {
          $rootScope.catchError(err);
          // $rootScope.messageError (err, '获取司机信息失败，请稍后重试');
          // vm.close();
          }
        );
      }
    }

    //提交
    vm.submit = function (evt, form) {
      evt.preventDefault();
      //添加评价
     DealorderService.AddRate(vm.woCode,vm.info.stationId,vm.driverId,vm.rate,vm.content).then(function (data) {
      }).catch(function (err) {
       $rootScope.catchError(err);
       // $rootScope.messageError (err, '添加评价信息失败，请稍后重试');
        }
      );

      //写日志
      DealorderService.AddOperate(vm.woCode,"7",vm.info.carVin,vm.userId,"2","9",vm.content)
        .then(function (data) {

        })
        .catch(function (err) {
          $rootScope.catchError(err);
          // $rootScope.messageError (err, '日志记录失败，请稍后重试');
        });

      //写日志
      DealorderService.AddOperate(vm.woCode,"7",vm.info.carVin,vm.userId,"2","10",vm.content)
        .then(function (data) {

        })
        .catch(function (err) {
          $rootScope.catchError(err);
          // $rootScope.messageError (err, '日志记录失败，请稍后重试');
        });

      //将工单状态改为7（已出站）
      DealorderService.UpdateStatus(vm.woCode,"7")
        .then(function () {
          Message.success('工单关闭成功！');
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
          // $rootScope.messageError (err, '工单状态修改失败，请稍后重试');

        });

      updateAnswer();

    }

    function updateAnswer(){
      //修改回访状态
      DealorderService.UpdateAnswer(vm.woCode)
        .then(function () {

        })
        .catch(function (err) {
          $rootScope.messageError (err, '修改回访状态失败，请稍后重试');
        });
    }

    //画评价用的五星
   function drawStar() {
     /*var images = document.getElementsByTagName("Img");*/
     var images = $(".starcloseimg");
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
  }

})();

