(function () {
    'use strict';

    angular.module('WeServices')
        .config(function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;   // 发送CORS请求
	        //todo 目前未使用session验证
            $httpProvider.defaults.withCredentials = false;  // 请求携带Cookies
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        })

        .provider('RequestService', function () {
            var serviceUrl = '';

            function resultProcessor(result, success, failed) {
                if( result.status === 200 || result.code === 200 || result.resultCode === 200){
                    success(result.data);
                }else{
                    failed(result);
                }
            }


            function typeToString(obj){
              if(obj instanceof Object || obj instanceof Array){
                angular.forEach(obj, function (value,k) {
                  obj[k] = (obj[k] !== null && typeof obj[k] === 'object') ? typeToString(obj[k]) : String(obj[k]);
                });
              }
              return obj;
            }

            return {
                setBaseServiceUrl : function (url) {
                    if (url) {
                        serviceUrl = url;
                    }
                },

                $get : function ($http, $q, $log, $rootScope) {

                    function request(opts, processor, isUpload) {
                        var d = $q.defer(),
                            url = /^(http|https):\/\//.test(opts.url) ? opts.url : (serviceUrl + opts.url),
                            options = {
                                method : opts.method || 'GET',
                                url : url,
                                cache : false,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                }
                            },
                            queryString, formData;


	                    if(opts.withCredentials != undefined){
		                    options.withCredentials = opts.withCredentials;
	                    }

	                    //todo 统一加上token（临时处理方案）
	                    if($rootScope.userInfo){
                        if (!opts.data) {
                          opts.data = {};
                        }
                            opts.data['token'] = $rootScope.userInfo.token;
                            //opts.data['token'] ="43b71e3ea6c74fd48f612e0ce16a1258";
                        }

                        if (opts.data && angular.isObject(opts.data)) {
                            for(var _d in opts.data){
                                if((options.method === 'GET' && opts.data[_d] === '') || angular.isUndefined(opts.data[_d]) || opts.data[_d] === null){
                                    delete  opts.data[_d];
                                }else if(opts.data[_d] == 'null'){
                                    delete  opts.data[_d];
                                }
                            }
                        }

                        if (options.method === 'POST') {
                            if (angular.isString(opts.data)) {
                                options.data = opts.data;
                                console.log("isString",options.data);
                                // 为了兼容接口，其实不应该这样实现
                                /*options.headers = {
                                    'Content-Type': 'application/json;charset=utf-8'
                                };*/
                            } else {
                                if (opts.data instanceof FormData) {
                                  options.data = opts.data;
                                  options.headers = {
                                    'Content-Type': undefined
                                  };
                                  console.log("data instanceof FormData",options.data)
                                } else if (isUpload) {
                                  formData = new FormData();
                                  if (opts.data) {
                                    angular.forEach(opts.data, function (value, key) {
                                      formData.append(key, value);
                                    });
                                  }
                                  options.data = formData;
                                  options.headers = {
                                    'Content-Type': undefined
                                  };
                                } else {
                                    options.data = JSON.stringify(typeToString(opts.data));
                                    options.headers = {
                                      'Content-Type': 'application/json;charset=utf-8'
                                    };
                                }
                            }
                        }
                        else if (options.method === 'GET') {

                            if(!opts.data) opts.data = {};
                            opts.data['__rid'] = Math.random();

                            queryString = angular.element.param(opts.data);
                            options.url = url + (url.indexOf('?') > -1 ? '&' : '?') + queryString;
                        }

                        processor = processor || resultProcessor;

                        try{
                            $http(options).then(function (res) {
                                processor(res.data, d.resolve, d.reject);
                            }, function (err) {
                                d.reject(err);
                            });
                        }catch(e){
                            $log.info(e);
                        }
                        return d.promise;
                    }

                    return {
                        get : function (url, data, processor) {
                            if (arguments.length === 2 && angular.isFunction(data)) {
                                processor = data;
                                data = null;
                            }
                            return request({
                                url : url,
                                data : angular.copy(data)
                            }, processor);
                        },

                        post : function (url, data, processor, isUpload) {
                            if (angular.isFunction(data) && arguments.length === 2) {
                                isUpload = processor;
                                processor = data;
                                data = null;
                            }

                              return request({
                                method : 'POST',
                                url : url,
                                data : isUpload?data:angular.copy(data)   //
                              }, processor, isUpload);


                        },
                        request : request

                    };
                }
            };
        })
})();
