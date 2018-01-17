/* global malarkey:false, moment:false */
(function () {
	'use strict';

	angular
		.module('wedriveOperationPlatform')
		.constant('malarkey', malarkey)
		.constant('moment', moment)
		//根据stateName获取模板地址
		.constant('GetTemplateUrl', function (stateName) {
			var states = stateName.split('.');
			states = states.map(function (state) {
				return state.replace(/([A-Z])/g, '-$1').toLowerCase();
			});
			return 'app/views/' + states.join('/') + '/' + states[states.length - 1] + '.html';
		})
		//根据stateName获取controller名称
		.constant('GetControllerName', function (stateName) {
			var states = stateName.split('.');
			states = states.map(function (state) {
				return state[0].toUpperCase() + state.slice(1);
			});
			return states.join('') + 'Controller';
		})
		.constant('ssoConfig',{
      serviceUrl : 'http://10.30.50.153:8950/qingqi/operate'
      //serviceUrl : 'http://jfx.qdfaw.com:8081/api/qingqi/operate'
      //serviceUrl : 'http://10.102.95.17:8068/api/qingqi/operate'
      //serviceUrl : 'http://61.161.238.158:8071/api153/qingqi/operate'//西安  http://61.161.238.158:8071/tboss153/
      //serviceUrl : 'http://219.146.249.190:8071/api/qingqi/operate'  //图吧
      //serviceUrl : 'http://10.30.50.152:8071/apipre/qingqi/operate' //预发布环境
		});
})();
