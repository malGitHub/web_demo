(function () {
  'use strict';

  angular
    .module('wedriveOperationPlatform')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, SsoServiceProvider, RequestServiceProvider, CommonServiceProvider, ssoConfig,mapbarMapConfig,WorkOrderServiceProvider,CustomerServiceProvider,OutrescueServiceProvider,DealorderServiceProvider,PublicServiceProvider,CashServiceProvider,GrantServiceProvider,ActivityListServiceProvider,ActivityServiceProvider,WebimServiceProvider,SupplysourceServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-center';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    SsoServiceProvider.setServiceUrl(ssoConfig.serviceUrl);

    var baseUrl = "http://10.30.10.183:8090/qingqi/";
    var factoryUrl = "http://10.30.10.183:8090/qingqi/";
    //var baseUrl = "http://10.102.95.17:8068/api/qingqi/";
    //var factoryUrl = "http://10.102.95.17:8068/qingqi/";
    //var baseUrl = "http://61.161.238.158:8071/api153/qingqi/";//西安
    //var factoryUrl = "http://61.161.238.158:8071/api153/qingqi/";//西安
    //var baseUrl="http://219.146.249.190:8071/api/qingqi/";//图吧
    //var factoryUrl="http://219.146.249.190:8950/qingqi/";  //车厂
    //var baseUrl="http://jfx.qdfaw.com:8081/api/qingqi/";
    //var factoryUrl="http://jfx.qdfaw.com:8081/api/qingqi/";
    //var baseUrl="http://10.30.50.152:8071/apipre/qingqi/";   //预发布环境
    //var factoryUrl="http://10.30.50.152:8071/apipre/qingqi/";  //预发布环境


    var servicePublicUrl = baseUrl;
    var serviceUrl = baseUrl + "operate";
    var servicestationUrl = factoryUrl + "servicestation";


    RequestServiceProvider.setBaseServiceUrl(serviceUrl);
    CommonServiceProvider.setServiceUrl(serviceUrl);
    WorkOrderServiceProvider.setServiceUrl(servicestationUrl);
    CustomerServiceProvider.setServiceUrl(servicestationUrl);
    OutrescueServiceProvider.setServiceUrl(servicestationUrl);
    DealorderServiceProvider.setServiceUrl(servicestationUrl);
    ActivityListServiceProvider.setServiceUrl(servicestationUrl);
    ActivityServiceProvider.setServiceUrl(servicestationUrl);
    CashServiceProvider.setServiceUrl(servicestationUrl);
    GrantServiceProvider.setServiceUrl(servicestationUrl);

    PublicServiceProvider.setServiceUrl(servicePublicUrl);
    WebimServiceProvider.setServiceUrl(servicePublicUrl);

    mapbarMapConfig.domain = 'http://api.mapbar.com/';
  }
})();
