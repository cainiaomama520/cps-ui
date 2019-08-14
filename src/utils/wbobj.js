import {
	rootUrl
} from './baseUrl'
export default {
	install(Vue, options) {
		Vue.prototype.rootUrl = rootUrl;
		Vue.prototype.getUrlParams = function() {
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			if(url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for(var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
				}
			}
			return theRequest;
		};
		//接口列表
		Vue.prototype.apiList = {
			//创建广告位
			goodsPid:'/api/goodsPid',
			goodsPidHistory:'/api/goodsPid-list',
			goodsPidHistoryExport:'/api/goodsPid-export',
			//普通商品推广链接
			goodsPromotion:'/api/goodsPromotion',
			goodsPromotionHistory:'/api/goodsPromotion-list',
			goodsPromotionExporty:'/api/goodsPromotion-export',
			//红包推广链接
			rpUrl:'/api/rpUrl',
			rpUrlHistory:'/api/rpUrl-list',
			rpUrHistoryExport:'/api/rpUrl-export',
			//转盘免单
			lotteryUrl:'/api/lotteryUrl',
			lotteryUrlHistory:'/api/lotteryUrl-list',
			lotteryUrlHistoryExport:'/api/lotteryUrl-export',
			//主题列表
			themeList:'/api/theme-list',
			//商品基本信息
			goodsInfo:'/api/goods-info',
			//订单详情
			orderDetail:'/api/order-detail'
		}
	}
}