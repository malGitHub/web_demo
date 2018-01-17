(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('SsoService', function () {
            var serviceUrl = '';

            function makeUrl(path) {
                return serviceUrl + path;
            }

            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };

            this.$get = function ($q,RequestService) {

                return {
                    /**
                     * 退出登录
                     */
                    logout : function () {
                      return RequestService.get(
                        makeUrl('/logout')
                      );
                    },

                    /**
                     * 是否已登录
                     */
                    logged : function (token) {
                        return RequestService.get(
                            makeUrl('/validateLogin'),
                          {
                            token: token
                          }
                        );
                        // return RequestService.request({
		                 //    url : makeUrl('/validateSSOLogin'),
		                 //    withCredentials : true
                        // });
                    },
                    /**
                     * 查询系统所有权限
                     */
                    projectPermissions : function () {
                      return RequestService.get(
                        makeUrl('/operate/user/queryProjectPermissions')
                      );
                    },
                    /**
                     * 查询用户权限列表
                     */
                    userPermissions : function () {
                      return RequestService.get(
                        makeUrl('/operate/user/queryUserPermissions')
                      );
                    },

                  login : function (loginName,loginPwd) {
                    return RequestService.get(
                      makeUrl('/login'),
                      {
                        loginName:loginName,
                        loginPwd:loginPwd
                      }
                    );
                  },
                  resetPassword : function (oldPwd,newPwd,confirmPwd) {
                    return RequestService.get(
                      makeUrl('/resetPassword'),
                      {
                        oldPwd: oldPwd,
                        newPwd:newPwd,
                        confirmPwd:confirmPwd
                      }
                    );
                  }
                };
            };
        });
})();
