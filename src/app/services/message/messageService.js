/**
 * Created by ligj on 2016/3/11.
 */
(function () {

    angular.module('WeServices')
        .provider('MessageService', function () {
            var serviceUrl = '';
            var templateUrl = {
                sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
                base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
            };

            var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

            function resolveBaseData(list) {
                if (list) {
                    return list.map(function (item) {
                        return {
                            key: item.value,
                            value: item.name
                        };
                    });
                } else {
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
                    //by zhaoming 推送消息列表
                    SendMsgList: function (pageIndex, pageSize, query) {
                        return RequestService.get(
                            makeUrl('/notice/queryNoticeList'),
                            angular.merge({
                                page_number: pageIndex,
                                page_size: pageSize
                            }, query)
                        )
                    }, MsgModelList: function (pageIndex, pageSize, query) {
                        return RequestService.get(
                            makeUrl('/notice/queryMessageTemplate'),
                            angular.merge({
                                page_number: pageIndex,
                                page_size: pageSize
                            }, query)
                        )
                    }, updateModel: function (params) {
                        return RequestService.post(
                            makeUrl('/notice/updateMessageTemplate'),
                            angular.merge({
                                userId: 110
                            }, params)
                        );
                    }, deleteModel: function (modelid) {
                        return RequestService.get(
                            makeUrl('/notice/delMessageTemplate'),
                            {
                                id: modelid
                            }
                        );
                    },addMessage: function (params){
                    return RequestService.post(
                      makeUrl('/notice/newNotice'),
                      angular.merge({
                        userId:'admin'
                      },  params)

                    );
                  },
                  getResendNotice: function (param){
                    return RequestService.post(
                      makeUrl('/notice/resendNotice'),
                      angular.merge({
                        userId:'admin',
                        id:param
                      })

                    );
                  },
                  getDeviceInfo: function (param){
                    return RequestService.get(
                      makeUrl('/notice/queryDevice'),
                      angular.merge({
                        keyWord:param
                      })
                    );
                  },
                  getModelList: function (seriseId) {
                    return RequestService.get(
                      makeUrl('/common/activityModelList'),
                      {seriseId: seriseId}
                    )
                  },
                  SendChitList: function (pageIndex, pageSize, query,sortType) {
                    return RequestService.get(
                      makeUrl('/msgManageGetSendedSMSList'),
                      angular.merge({
                        page_number: pageIndex,
                        page_size: pageSize,
                        sortType:sortType
                      }, query)
                    )
                  },
                  addChit: function (title,content,userPhoneNumbers){
                    return RequestService.post(
                      makeUrl('/msgManageSendSMS'),
                      {
                        title: title,
                        content: content,
                        userPhoneNumbers: userPhoneNumbers
                       }
                      );
                  },
                  sendChits: function (title,content,userPhoneNumbers){
                    return RequestService.get(
                      makeUrl('/msgManageSendSMS'),
                      {
                        title: title,
                        content: content,
                        userPhoneNumbers: userPhoneNumbers
                      }
                    );
                  },
                  sendChit: function (id){
                    return RequestService.get(
                      makeUrl('/msgManageReSendSMS'),
                      {
                        id: id
                       }
                    );
                  },
                };
            };
        });
})();
