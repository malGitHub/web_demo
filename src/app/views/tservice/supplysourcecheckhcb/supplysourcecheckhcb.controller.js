(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceSupplysourcecheckhcbController', TserviceSupplysourcecheckhcbController);
  function TserviceSupplysourcecheckhcbController($sce,$uibModal,GetTemplateUrl,GetControllerName,$state,$stateParams,SupplysourceService,$rootScope,$filter){
    var vm = this;
     //货源会员信息

    /*
    *
    * realNameValidResult:4
     idCardValidResult:4
     drivingLicenseResult:4
     vehicleLicenseResult:4
     memberValidResult:4
    * */
    vm.inforecord={
      idCardInvalidDate:"",
      drivingLicense:"",
      drivingType:"",
      drivingLicenseFileNo:"",
      drivingLicenseInvalidDate:"",
      carNo:"",
      carVin:"",
      engineNo:"",
      vehicleLicenseInvalidDate:"",
      carType:"",
      carWeight:"",
      carLength:"",
      carWidth:""
/*    realNameValidResult:"",
      realNameValidReason:"",
      idCardValidResult:"",
      idCardValidReason:"",
      drivingLicenseResult:"",
      drivingLicenseReason:"",
      vehicleLicenseResult:"",
      vehicleLicenseReason:"",
      memberValidResult:"",
      memberValidReason:""*/
    };

    vm.id=$stateParams.id;
    vm.manualSwitch=$stateParams.manualSwitch;

    //第三方未完成审核时，此处显示空
    if($stateParams.thirdReviewResult=="审核中"){
      vm.thirdOpinion=false;
    }else {
      vm.thirdOpinion=true;
    }
    //确定与保存按钮的切换
    if(vm.manualSwitch==1&&$stateParams.manualReviewResult!='通过'){
      vm.sureButton=true;
      vm.saveButton=false;
    }else {
      vm.sureButton=false;
      vm.saveButton=true;
    }

    //人工补录控制开关
    vm.addrecordup = false;
    vm.addrecorddown = false;
    vm.personRecordUp = function () {
      vm.addrecordup = !vm.addrecordup;
     };
    vm.personRecordDown = function () {
      vm.addrecorddown = !vm.addrecorddown;
    };
    //准驾车型型号的选择
    vm.typeNumber="";
    vm.modelType=[{key:'1',value:'A1'},{key:'2',value:'A2'},{key:'3',value:'A3'},{key:'4',value:'B1'},{key:'5',value:'B2'},{key:'6',value:'C1'}
      ,{key:'7',value:'C2'},{key:'8',value:'C3'},{key:'9',value:'C4'}
    ];
    //审核结论下拉列表
/*  vm.inforecord.realNameValidResult="";
    vm.inforecord.idCardValidResult="";
    vm.inforecord.drivingLicenseResult="";
    vm.inforecord.vehicleLicenseResult="";
    vm.inforecord.memberValidResult="";
    vm.auditconclusion=[{key:'3',value:'不通过'},{key:'4',value:'通过'}];*/

    //关闭查看页面，跳转回会员认证页面
    vm.closeRecord = function (){
      $state.go('tservice.supplysource');
    };
     //货源会员认证信息查看
  function checkInfo() {
    SupplysourceService.getHcbAuthInfoDetail(vm.id)
      .then(function(data){
          vm.userId=data.userId;//用户ID
          vm.commitTime=data.submitDate;//提交申请时间
          vm.realPhoto=data.headPicUrl;//真实头像
          vm.realName=data.realName;//真实姓名
          vm.identityNo=data.idCard;//身份证号
          //vm.idFrontPhoto=data.idFrontPhoto;//身份证正面照
          //vm.idBackPhoto=data.idBackPhoto;//身份证背面照
          vm.drivingLicensePhoto=data.drivingLicenseUrl;//驾驶证照片
          vm.vehicleLicensePhoto=data.travelPapersPic;//行车证照片
          vm.reviewTime=data.auditDate;//审核时间
          vm.carNumber=data.plateNumber;//车牌号
          vm.plateNumberType=data.plateNumberType;//车牌类型
          vm.carType=data.vehicleStruct;//车辆类型
          vm.carLength=data.vehicleLength;//有效车长
          vm.reviewResult=data.thirdStatus;//第三方审核结果
          vm.thirdReason=data.thirdReason;//第三方审核意见
          vm.inforecord.idCardInvalidDate=data.idcardInvalidDate; //身份证失效日期
          vm.inforecord.drivingLicenseNo=data.drivingLicenseNo; //驾驶证号
          vm.inforecord.drivingLicenseClass=data.drivingLicenseClass; //准驾车型
          vm.inforecord.drivingLicenseRecordNo=data.drivingLicenseRecordNo; //驾驶证档案编号
          vm.inforecord.drivingLicenseExpireDate=data.drivingLicenseExpireDate; //驾驶证失效日期
          vm.inforecord.vehicleIdentity=data.vehicleIdentity; //车辆识别码后6位
          vm.inforecord.engineNo=data.engineNo; //发动机后6位
          vm.vehicleLoad=data.vehicleLoad; //核载质量/KG
          vm.inforecord.vehicleWidth=data.vehicleWidth; //车宽/mm
          vm.inforecord.vehicleLicenseExpireDate=data.vehicleLicenseExpireDate; //行驶证失效日期
          vm.thirdIdCardValidStatus=thirdNumber(data.artificialIdentityNoStatus);//身份证
          vm.thirdIdCardValidReason=data.artificialIdentityNoReason;
          vm.thirdDrivingLicenseValidStatus=thirdNumber(data.artificialDrivingLicenseStatus);//驾驶证
          vm.thirdDrivingLicenseValidReason=data.artificialDrivingLicenseReason;
          vm.thirdVehicleLicenseValidStatus=thirdNumber(data.artificialVehicleLicenseStatus);//行驶证
          vm.thirdVehicleLicenseValidReason=data.artificialVehicleLicenseReason;
          vm.thirdMemberPhotoValidStatus=thirdNumber(data.artificialUserPhotoStatus);//头像
          vm.thirdMemberPhotoValidReason=data.artificialUserPhotoReason;

        }
      ).catch(function(err){
      $rootScope.catchError(err);
    });
  }
    checkInfo();
    function thirdNumber(statu){
      if(statu==3){return '不通过'}
      else if(statu==4) {return '通过'}
      else{return '审核中'}
    }
    vm.sce = $sce.trustAsResourceUrl; //解除angular对未知来源地址的禁止
    vm.openImg=function (filter){
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.supplysourcecheck.openimg'),
        controller: GetControllerName('tservice.supplysourcecheck.openimg'),
        controllerAs: 'vm',
        windowClass: 'tservice-supplysourcecheck-big-picture overhidx',
        resolve:{
          filter:function(){return filter}
        }
      })
    };
    //根据货源页的操作项判断人工审查布局
      if($stateParams.manualReviewResult!='通过'){
         vm.selview=true;
        vm.showselview=false;
        }else{
        vm.selview=false;
        vm.showselview=true;
      }
    vm.drivecardNumber=false;
    //提交表单
    /*carLength:""carNo:""carType:""carVin:""carWeight:""carWidth:""drivingLicense:""drivingLicenseClass:"5"drivingLicenseExpireDate:"2017-05-04"drivingLicenseFileNo:""drivingLicenseInvalidDate:""drivingLicenseNo:""drivingLicenseRecordNo:"211321198902"drivingType:""engineNo:"123456"id:"4a05b23f976e4f68b993209d528f767c"token:"866fd3e0ffad4651807844bca5f6a22c"vehicleIdentity:"123456"vehicleLicenseExpireDate:"2017-05-04"vehicleLicenseInvalidDate:""vehicleWidth:"45"*/
    vm.submit = function (event,form) {
      event.preventDefault();
         if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        //执行提交表单接口
         SupplysourceService.hcbAuthInfoInput(vm.id,vm.inforecord)
             .then(function(){
                  vm.closeRecord();
               }).catch(function(err){
             $rootScope.catchError(err);
           })
           .then(function () {
           vm.requesting = false;
         });
      }
    };
    }
})();
