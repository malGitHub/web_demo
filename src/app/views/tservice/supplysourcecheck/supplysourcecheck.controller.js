(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceSupplysourcecheckController', TserviceSupplysourcecheckController);
  function TserviceSupplysourcecheckController($sce,$state,$stateParams,$uibModal,GetTemplateUrl,GetControllerName,SupplysourceService,$rootScope){
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
/*      realNameValidResult:"",
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
    SupplysourceService.getGoodsMemberInfo(vm.id,vm.manualSwitch)
      .then(function(data){
          vm.userId=data.userId;//用户ID
          vm.commitTime=data.commitTime;//提交申请时间
          vm.realPhoto=data.realPhoto;//真实头像
          vm.realName=data.realName;//真实姓名
          vm.identityNo=data.identityNo;//身份证号
          vm.idFrontPhoto=data.idFrontPhoto;//身份证正面照
          vm.idBackPhoto=data.idBackPhoto;//身份证背面照
          vm.drivingLicensePhoto=data.drivingLicensePhoto;//驾驶证照片
          vm.vehicleLicensePhoto=data.vehicleLicensePhoto;//行车证照片
          vm.reviewTime=data.reviewTime;//审核时间
          vm.carNumber=data.carNumber;//车牌号
          vm.carType=data.carType;//车辆类型
          vm.carLength=data.carLength;//有效车长
          vm.reviewResult=data.reviewResult;//审核结果
          vm.thirdIdNoValidStatus=data.thirdIdNoValidStatus;//第三方身份实名认证结果
          vm.thirdIdNoValidReason=data.thirdIdNoValidReason;//第三方身份实名认证失败原因
          vm.thirdIdCardValidStatus=data.thirdIdCardValidStatus;//第三方身份证认证结果
          vm.thirdIdCardValidReason=data.thirdIdCardValidReason;//第三方身份证认证失败原因
          vm.thirdDrivingLicenseValidStatus=data.thirdDrivingLicenseValidStatus;//驾驶证认证结果
          vm.thirdDrivingLicenseValidReason=data.thirdDrivingLicenseValidReason;//第三方驾驶证认证失败原因
          vm.thirdVehicleLicenseValidStatus=data.thirdVehicleLicenseValidStatus;//第三方行驶证认证结果
          vm.thirdVehicleLicenseValidReason=data.thirdVehicleLicenseValidReason;//第三方行驶证认证失败原因
          vm.thirdMemberPhotoValidStatus=data.thirdMemberPhotoValidStatus;//第三方真实头像认证结果
          vm.thirdMemberPhotoValidReason=data.thirdMemberPhotoValidReason;//第三方真实头像认证失败原因
/*          vm.inforecord.realNameValidResult=data.idNoValidStatus=="通过"?'4':'3';//身份实名认证结果
          vm.inforecord.realNameValidReason=data.idNoValidReason;//身份实名认证失败原因
          vm.inforecord.idCardValidResult=data.idCardValidStatus=="通过"?'4':'3';//身份证认证结果	审核中、通过、不通过
          vm.inforecord.idCardValidReason=data.idCardValidReason;//身份证认证失败原因
          vm.inforecord.drivingLicenseResult=data.drivingLicenseValidStatus=="通过"?'4':'3';//驾驶证认证结果	审核中、通过、不通过
          vm.inforecord.drivingLicenseReason=data.drivingLicenseValidReason;//驾驶证认证失败原因
          vm.inforecord.vehicleLicenseResult=data.vehicleLicenseValidStatus=="通过"?'4':'3';//行驶证认证结果	审核中、通过、不通过
          vm.inforecord.vehicleLicenseReason=data.vehicleLicenseValidReason;//行驶证认证失败原因
          vm.inforecord.memberValidResult=data.memberPhotoValidStatus=="通过"?'4':'3';//真实头像认证结果
          vm.inforecord.memberValidReason=data.memberPhotoValidReason;//真实头像认证失败原因*/
          vm.memberPhotoIsNew=data.memberPhotoIsNew;//头像(新提交)
          vm.idcardIsNew=data.idcardIsNew;//身份证前(新提交)
          vm.identityNoIsNew=data.identityNoIsNew;//身份证后(新提交)
          vm.drivingLicenseIsNew=data.drivingLicenseIsNew;//驾驶证(新提交)
          vm.vehicleLicenseIsNew=data.vehicleLicenseIsNew;//行驶证(新提交)
          vm.inforecord.idCardInvalidDate=data.idcardInvalidDate; //身份证失效日期
          vm.inforecord.drivingLicense=data.drivingLicense; //驾驶证号
          vm.inforecord.drivingType=data.drivingType; //准驾车型
          vm.inforecord.drivingLicenseFileNo=data.recordNo; //驾驶证档案编号
          vm.inforecord.drivingLicenseInvalidDate=data.drivingLicenseDate; //驾驶证失效日期
          vm.inforecord.carVin=data.carId; //车辆识别码后6位
          vm.inforecord.engineNo=data.engineNo; //发动机后6位
          vm.inforecord.carWeight=data.carWeight; //核载质量/KG
          vm.inforecord.carWidth=data.carWide; //车宽/mm
          vm.inforecord.vehicleLicenseInvalidDate=data.vehicleLicenseInvalidDate; //行驶证失效日期
          vm.arr=[vm.thirdIdNoValidStatus,vm.thirdIdCardValidStatus,vm.thirdDrivingLicenseValidStatus,vm.thirdVehicleLicenseValidStatus,vm.thirdMemberPhotoValidStatus];
          for(var i=0;i< vm.arr.length;i++){
            if(vm.arr[i]=="失败"){
              vm.arr[i]='不通过';
             }else if(vm.arr[i]=='成功'){
              vm.arr[i]='通过';
            }else if(vm.arr[i]=='已审核'){
              vm.arr[i]='已在陆鲸认证过';
            }else {
              vm.arr[i]='审核中';
            }
           }
          vm.thirdIdNoValidStatus=vm.arr[0];
          vm.thirdIdCardValidStatus=vm.arr[1];
          vm.thirdDrivingLicenseValidStatus=vm.arr[2];
          vm.thirdVehicleLicenseValidStatus=vm.arr[3];
          vm.thirdMemberPhotoValidStatus=vm.arr[4];
           }
      ).catch(function(err){
      $rootScope.catchError(err);
    });
  }
    checkInfo();
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
    vm.submit = function (event,form) {
      event.preventDefault();
         if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        //执行提交表单接口
         SupplysourceService.reviewUserInfo(vm.userId,vm.inforecord)
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
