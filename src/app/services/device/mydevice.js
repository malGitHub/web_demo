/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('TbossService', function () {
            var serviceUrl = '';
            // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
            var templateUrl = {
                sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
                base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
            };

            var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

            function resolveBaseData(list) {
                if(list){
                    return list.map(function (item) {
                        return {
                            key: item.value,
                            value: item.name
                        };
                    });
                }else{
                    return false;
                }
            }

            function makeUrl(path) {
                return serviceUrl + path;
            }

            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };

            this.$get = function ($q, RequestService) {
                return {
                    //by wurui 基础保养管理表
                    MaintainBaseList: function (pageIndex,pageSize,query) {
                        return RequestService.post(
                            makeUrl('/maintain/queryMaintainBaseList'),
                            angular.merge({
                                page_number:pageIndex,
                                page_size:pageSize
                            },query)
                        )
                    },
                    //by wurui 基础保养管理表删除一项
                    DeleteMaintainBaseInfo: function (modelNameList,mileage,seriseId) {
                        return RequestService.get(
                            makeUrl('/maintain/deleteMaintainBaseInfo'),
                            {
                              modelNameList: modelNameList,
                              mileage: mileage,
                              serise: seriseId
                            }
                        );
                    },
                    //by wurui 基础保养管理表添加一项
                    addMaintainBaseList: function (params) {
                        return RequestService.get(
                            makeUrl('/maintain/addMaintainBaseInfo'),
                            params

                        );
                    },
                    //by wurui 编辑前获取基础保养管理
                    QueryMaintainBaseDetail: function (modelNameList,mileage) {
                        return RequestService.post(
                            makeUrl('/maintain/queryMaintainBaseDetail'),
                            {
                              modelNameList: modelNameList,
                              mileage:mileage
                            }
                        );
                    },
                    //by wurui 编辑基础保养管理
                    ModifyMaintainBaseInfo: function (modelNameList,query,userId) {
                        return RequestService.get(
                            makeUrl('/maintain/modifyMaintainBaseInfo'),
                            angular.merge({
                                userId:userId,
                                modelNameList: modelNameList
                            },query)
                        );
                    },

                    //by wurui 保养项目查询
                    MaintainItemList: function (page_number,page_size,va) {
                        return RequestService.get(
                            makeUrl('/maintain/queryMaintainItemList'),
                            {
                                page_number:page_number,
                                page_size:page_size,
                                maintainItemName:va
                            }
                        )
                    },
                    //by wurui 编辑保养项目
                    UpdateMaintainItem: function (maintainItemId,maintainItemName,userId) {
                      console.log(typeof (parseInt(maintainItemId)));
                        return RequestService.get(
                            makeUrl('/maintain/updateMaintainItem'),
                            {
                                maintainItemId:parseInt(maintainItemId),
                                maintainItemName:maintainItemName,
                                userId:userId
                            }
                        );
                    },
                    //by wurui 保养项目添加
                    addMaintainItemList: function (params,userId) {
                        return RequestService.get(
                            makeUrl('/maintain/addMaintainItem'),
                            {
                                maintainItemName:params,
                                userId:userId
                            }
                        );
                    },
                    //by wurui 保养项目高级筛选车辆品牌
                    getBrandList: function () {
                        return RequestService.get(
                            makeUrl('/common/brandList')
                        );
                    },
                    //by wurui 保养项目高级筛选车辆系列
                    getSeriseList: function (params) {
                        return RequestService.get(
                            makeUrl('/common/seriseList'),
                            {
                                brandId:params
                            }
                        );
                    },
                    //by wurui 通用车辆车型
                  getModelList: function (params) {
                    return RequestService.post(
                      makeUrl('/common/modelList'),
                      {
                        seriseId:params
                      }
                    );
                  },
                    //by wurui 保养项目高级筛选车辆车型
                    getModelListUpkeep: function (params,modelType) {
                        return RequestService.post(
                            makeUrl('/common/modelList'),
                            {
                                seriseId:params,
                                modelType:modelType
                            }
                        );
                    },
                    //by wurui 保养项目删除一项
                    DelMaintainItem:function (maintainItemId) {
                        return RequestService.post(
                            makeUrl('/maintain/delMaintainItem'),
                            {
                                maintainItemId: maintainItemId
                            }
                        );
                    },
                    //by wurui 查询故障诊断列表
                    QueryFaultRecord:function (page_number,page_size,filter) {
                        return RequestService.get(
                            makeUrl('/fault/queryFaultRecord'),
                            angular.merge({
                                page_number:page_number,
                                page_size:page_size
                            },filter)
                        );
                    },
                    //by wurui 查询通知规则列表
                    QueryNoticeRuleList:function (page_number,page_size,searchKey) {
                        return RequestService.post(
                            makeUrl('/fault/queryNoticeRuleList'),
                            {
                                page_number:page_number,
                                page_size:page_size,
                                searchKey:searchKey
                            }
                        );
                    },
                    //by wurui 故障码库列表查询
                    QueryFaultBase:function (page_number,page_size,faultCode) {
                        return RequestService.get(
                            makeUrl('/fault/queryFaultBase'),
                            {
                                page_number:page_number,
                                page_size:page_size,
                                faultCode:faultCode
                            }
                        );
                    },

                  ImpFaultCode: function (fullPath,fileType,userId) {
                    return RequestService.get(
                      makeUrl('/fault/impFaultCode'),
                      {uuid: fullPath, fileType: fileType,userId:userId}
                    );
                  },
                   //by guodx 电话号码的导入
                  PhoneNoFileUpload: function (uuid,fileType,title,content,userPhoneNumbers) {
                    return RequestService.post(
                      makeUrl('/msgManagePhoneNoFileUpload'),
                      {
                        uuid: uuid,
                        fileType: fileType,
                        title: title,
                        content: content,
                        userPhoneNumbers: userPhoneNumbers
                      }
                    );
                  },
                  //by wurui 故障诊断详细
                    QueryFaultRecordDetail:function (faultId,faultTime) {
                        return RequestService.get(
                            makeUrl('/fault/queryFaultRecordDetail'),
                            {
                                faultId:faultId,
                                faultTime:faultTime
                            }
                        );
                    },
                    //by wurui 新增故障码
                    AddFaultBase:function (filter) {
                        return RequestService.post(
                            makeUrl('/fault/addFaultBase'),
                            angular.merge({
                            },filter)
                        );
                    },
                    //by wurui 删除故障码
                    DelFaultBase:function (faultCode,userId) {
                        return RequestService.post(
                            makeUrl('/fault/delFaultBase'),
                            {
                                faultCode:faultCode,
                                userId:userId
                            }
                        );
                    },
                    //by wurui 获取故障码详情
                    QueryDetailFaultBase:function (faultCode) {
                        return RequestService.post(
                            makeUrl('/fault/queryDetailFaultBase'),
                            {
                                faultCode:faultCode
                            }
                        );
                    },
                    //by wurui 修改故障码
                    UpdateFaultBase:function (oldFaultCode,filter,userId) {
                        return RequestService.post(
                            makeUrl('/fault/updateFaultBase'),
                            angular.merge({
                                userId:userId,
                                oldFaultCode:oldFaultCode
                            },filter)
                        );
                    },
                    //by wurui 新建通知规则
                    AddNoticeRule:function (filter) {
                        return RequestService.post(
                            makeUrl('/fault/addNoticeRule'),
                            angular.merge({
                            },filter)
                        );
                    },
                    //by wurui 删除通知规则
                    DeleteNoticeRule:function (ruleId) {
                        return RequestService.post(
                            makeUrl('/fault/deleteNoticeRule'),
                            {
                                ruleId: ruleId
                            }
                        );
                    },
                    //by wurui 获取通知规则里通知方式
                    getNoticeTypeName:function () {
                        return RequestService.post(
                            makeUrl('/common/basedata?type=A&&code=A007')
                        );
                    },
                    //by wurui 获取通知规则里等级分类
                    getBreakdownClassAll:function () {
                        return RequestService.post(
                            makeUrl('/common/basedata?type=A&&code=A003')
                        );
                    },
                    //by wurui 通知规则详情
                    QueryNoticeRuleInfo:function (routeId) {
                        return RequestService.post(
                            makeUrl('/fault/queryNoticeRuleInfo'),
                            {
                                routeId:routeId
                            }
                        );
                    },
                    //by wurui 通知规则详情
                    ModifyNoticeRule:function(routeId,filter){
                        return RequestService.post(
                            makeUrl('/fault/modifyNoticeRule'),
                            angular.merge({
                                routeId:routeId
                            },filter)
                        );
                    },
                    //by wurui 一键呼救
                    CallCenter:function(page_number,page_size,filter){
                        return RequestService.post(
                            makeUrl('/customerCare/callCenter'),
                            angular.merge({
                                page_number:page_number,
                                page_size:page_size
                            },filter)
                        );
                    },
                    //一键呼救高级筛选车辆车型
                    getCallModelList: function (params) {
                      return RequestService.post(
                        makeUrl('/common/activityModelList'),
                        {
                          seriseId:params
                        }
                      );
                    },
                    QueryRealTimeCondition:function(rtcId,userTel){
                        return RequestService.get(
                            makeUrl('/customer/QueryRealTimeCondition'),
                            {
                                rtcId:rtcId,
                                userTel:userTel
                            }
                        );
                    },

                  //by wurui 导入故障码库列表
                  importDevices: function (file,userId) {
                    return RequestService.post(
                      'http://jfx.qdfaw.com:8081/fsm/fsevice/uploadFile',
                      {file: file,
                        account:userId
                      },
                      function (data, resolve,reject) {
                        resolve(data);
                      },
                      true
                    )
                  },
                  //by wurui 紧急电话图片上传
                  importDevicesImg: function (file,userId) {
                    return RequestService.post(
                      'http://jfx.qdfaw.com:8081/fsm/fsevice/uploadImageAndCrtThumbImage',
                      {file: file,
                        account:userId
                      },
                      function (data, resolve,reject) {
                        resolve(data);
                      },
                      true
                    )
                  },
                  //车辆车型列表（礼品发放专用）
                  getModelList_activity: function (params) {
                    return RequestService.post(
                      makeUrl('/common/activityModelList'),
                      {
                        seriseId:params
                      }
                    );
                  }

                };
            };
        });
})();
