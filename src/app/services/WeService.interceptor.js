(function () {
	'use strict';
	angular.module('WeServices')
		.factory('requestInterceptor', function ($rootScope, $log) {
			return {
				request: function (config) {
					return config;
				},
				response: function (response) {
					if (response &&
						response.data &&
						(response.data.code == 10007 || response.data.resultCode === 405)) {
						$log.info('登陆超时');
						//重置data值，解决
						response.data = {
							resultCode : 200,
							data : {}
						};
						$rootScope.$broadcast('user:invalid');
					} else if (response.data.resultCode === 406) {
						$rootScope.$broadcast('user:norole');
					} else if (response && response.data && response.data.code == 500) {
						$log.error('系统错误');
					}
					return response;
				},
				requestError: function (config) {
					return config;
				},
				responseError: function (data) {
					//Message.error('系统错误，请稍后再试');
					//$log.info(data)
					(!data.data.code && !data.data.resultCode) && (data.data = {
						code: 500,
						resultCode : 500,
						msg: '网络或服务器错误，请稍后重试',
						message: '网络或服务器错误，请稍后重试'
					});
          if (data &&
            data.data &&
            (data.data.code == 10007 || data.data.resultCode === 405)) {
            $log.info('登陆超时');
            //重置data值，解决
            data.data = {
              resultCode : 200,
              data : {}
            };
            $rootScope.$broadcast('user:invalid');
          } else if (data.data.resultCode === 406) {
            $rootScope.$broadcast('user:norole');
          } else if (data && data.data && data.data.code == 500) {
            $log.error('系统错误');
          }

					$log.error('error:', data.data.msg || data.data.message);
					return data;
				}
			}
		}).config(function ($httpProvider) {
		$httpProvider.interceptors.push('requestInterceptor');
	})
})();
