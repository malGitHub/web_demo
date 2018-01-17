(function() {
    'use strict';

angular.module('WeComponents')
    .directive('wdStarLevel', wdStarLevel);
/*	function getLevelWidth(level) {
		level = +level;
		var padding = 4,//星星单侧留白宽度
				starWidth = 14, //星星的实际宽度
				outterWidth = 22; //单个星星图片总宽（包括两侧留白）
		var i = Math.floor(level), d = level % i;
		var width = i * outterWidth + padding + starWidth * d;

		return Math.floor(width);
	}*/
	function wdStarLevel () {
		return {
			restrict: 'AE',
			//template :'<div class="gj-level"><span class="gj-level-bg"></span></div>',
			template: new Array(6).join('<i class="glyphicon glyphicon-star glyphicon-star-empty"></i>'),
			transclude : true,
			link: function (scope, element, attr) {
				var scoreSplit = 20,
					level = attr.level ? +attr.level : (+attr.score / scoreSplit);
				level = Math.round(level);
				element.find('i').each(function(i) {
					if(i < level) angular.element(this).removeClass('glyphicon-star-empty');
				});
				/*
				var width = getLevelWidth(level);
				element.find('.gj-level-bg').css('width', width);*/
			}
		};
	}
})();

