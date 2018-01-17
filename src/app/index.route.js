(function () {
  'use strict';

  angular
    .module('wedriveOperationPlatform')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, GetTemplateUrl, GetControllerName) {

    function component(routerConfig) {
      var config = {},
        views = routerConfig.views || undefined;

      //子模板
      if (views) {
        config = {
          url: routerConfig.path
        };
        config.views = {};
        config.views['@' + views] = {
          templateUrl: GetTemplateUrl(routerConfig.name),
          controller: GetControllerName(routerConfig.name),
          controllerAs: routerConfig.as || undefined
        };
      } else {
        config = {
          url: routerConfig.path,
          templateUrl: GetTemplateUrl(routerConfig.name),
          controller: GetControllerName(routerConfig.name),
          controllerAs: routerConfig.as || undefined
        }
      }
      $stateProvider.state(routerConfig.name, config);
    }

    function routerConfig(items) {
      items.forEach(component)
    }

    //模仿angular2 router
    routerConfig([
      {path: '/home', name: 'home', as: 'home'},
      {path: '/loading', name: 'loading', as: 'loading'},
      {path: '/tservice', name: 'tservice', as: 'tservice'},
      //用户管理
      {path: '/user', name: 'tservice.user', as: 'user'},
      //保养管理
      {path: '/upkeep', name: 'tservice.upkeep', as: 'upkeep'},
      //一键呼救
      {path: '/care', name: 'tservice.care', as: 'care'},
      {path: '/carecall/:id/:tel', name: 'tservice.carecall', as: 'carecall'},
      //故障诊断
      {path: '/breakdown', name: 'tservice.breakdown', as: 'breakdown'},
      {path: '/subscribe', name: 'tservice.subscribe', as: 'subscribe'},
      //紧急电话配置
      {path: '/telephone', name: 'tservice.telephone', as: 'telephone'},
      {path: '/subscriberepairedit', name: 'tservice.subscribe.repairedit', as: 'subscriberepairedit'},
      {path: '/subscribeupkeepedit', name: 'tservice.subscribe.upkeepedit', as: 'subscribeupkeepedit'},
      {path: '/message', name: 'tservice.message', as: 'message'},
      //车辆信息查询
      {path: '/vehicles', name: 'tservice.vehicles', as: 'vehicles'},
      {path: '/vehiclesview/:id', name: 'tservice.vehiclesview', as: 'vehiclesview'},
      //部门管理
      {path: '/dptcontrol', name: 'tservice.dptcontrol', as: 'dptcontrol'},
      //角色管理
      {path: '/role', name: 'tservice.role', as: 'role'},
      //车主认证审核
      {path: '/authentication', name: 'tservice.authentication', as: 'authentication'},
      {path: '/authenticationExamine', name: 'tservice.authentication.examine', as: 'authenticationExamine'},
      {path: '/authenticationAutoExamine',name: 'tservice.authentication.autoexamine',as: 'authenticationAutoExamine'},
      //APP用户管理
      {path: '/app', name: 'tservice.app', as: 'app'},
      //货源会员认证
      {path: '/supplysource', name: 'tservice.supplysource', as: 'supplysource'},
      {path: '/supplysourcecheck/:id/:manualSwitch/:thirdReviewResult/:manualReviewResult', name: 'tservice.supplysourcecheck', as: 'supplysourcecheck'},
      {path: '/supplysourcecheckhcb/:id/:manualSwitch/:thirdReviewResult/:manualReviewResult', name: 'tservice.supplysourcecheckhcb', as: 'supplysourcecheckhcb'},
      //服务预约管理
      {path: '/dealorder', name: 'tservice.dealorder', as: 'dealorder'},
      {path: '/settings', name: 'settings', as: 'settings'},
      //消息新建与重发
      {path: '/messageadd', name: 'tservice.messageadd', as: 'messageadd'},
      {path: '/messageresend/:id', name: 'tservice.messageresend', as: 'messageresend'},
      //短信新建与重发
      {path: '/messagechitadd', name: 'tservice.messagechitadd', as: 'messagechitadd'},
      {path: '/messagechitsend/:id', name: 'tservice.messagechitsend', as: 'messagechitsend'},
      //客服分单
      {path: '/assigndocument', name: 'tservice.assigndocument', as: 'assigndocument'},
      {path: '/assigndocument', name: 'tservice.assigndocument.batch', as: 'assigndocumentbatch'},
      {path: '/assigndocument', name: 'tservice.assigndocument.handle', as: 'assigndocumenthandle'},

      {path: '/dealorderview/:id/:flg/:phone/:from', name: 'tservice.dealorderview', as: 'dealorderview'},
      {path: '/aboutus', name: 'aboutus', as: 'aboutus'},
        //新建工单
      {path: '/build', name: 'tservice.build', as: 'build'},
      {path: '/buildnew/:chassisNum', name: 'tservice.buildnew', as: 'buildnew'},
      {path: '/outrescue', name: 'tservice.outrescue', as: 'outrescue'},
      //关闭申请审核
      {path: '/close', name: 'tservice.close', as: 'close'},
      {path: '/closecheck', name: 'tservice.close.check', as: 'closecheck'},
      {path: '/closeview/:id/:flg/:phone', name: 'tservice.closeview', as: 'closeview'},
      //客服系统
      {path: '/webim', name: 'tservice.webim', as: 'webim'},
      //活动管理
      {path: '/activities', name: 'tservice.activities', as: 'activities'},
      {path: '/activitiesadd', name: 'tservice.activitiesadd', as: 'activitiesadd'},
      {path: '/activitiesstep/:id', name: 'tservice.activitiesstep', as: 'activitiesstep'},
      {path: '/activitiesnew/:id/:status', name: 'tservice.activitiesnew', as: 'activitiesnew'},
      {path: '/activitiesnewone/:id/:status/:cancel', name: 'tservice.activitiesnewone', as: 'activitiesnewone'},
      {path: '/activitiesnewtwo/:id/:status/:cancel', name: 'tservice.activitiesnewtwo', as: 'activitiesnewtwo'},
      {path: '/activitiesdetail/:id/:status/:isAdd/:isCar', name: 'tservice.activitiesdetail', as: 'activitiesdetail'},
       {path: '/activitiescheck/:id/:ischeck', name: 'tservice.activitiescheck', as: 'activitiescheck'},
      {path: '/activitiesend/:id', name: 'tservice.activitiesend', as: 'activitiesend'},
      //发放管理
      {path:'/grant',name:'tservice.grant',as:'grant'},
      {path:'/grantdit/:id',name:'tservice.grantdit',as:'grantdit'},
      {path:'/grantinfo/:id/:actId/:sType',name:'tservice.grantinfo',as:'grantinfo'},
      //兑现管理
      {path:'/cash',name:'tservice.cash',as:'cash'},
      {path:'/cashdit/:id',name:'tservice.cashdit',as:'cashdit'},
      {path:'/cashinfo/:id/:actId/:sType',name:'tservice.cashinfo',as:'cashinfo'},
      //兑现管理
      {path:'/statistics',name:'tservice.statistics',as:'statistics'},
      //app banner
      {path:'/banner',name:'tservice.banner',as:'banner'}
    ]);
    $urlRouterProvider.otherwise('/tservice');
  }

})();
