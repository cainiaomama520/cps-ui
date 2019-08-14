import Vue from 'vue'
import Router from 'vue-router'
import leftNav from '@/components/common/leftNav'
//创建
import goodsPidGenerate from '@/components/Form/goodsPidGenerate'
import goodsUrlGenerate from '@/components/Form/goodsUrlGenerate'
import rpUrlGenerate from '@/components/Form/rpUrlGenerate'
import lotteryUrlGenerate from '@/components/Form/lotteryUrlGenerate'
//历史纪录
import goodsPidHistory from '@/components/History/goodsPidHistory'
import goodsUrlHistory from '@/components/History/goodsUrlHistory'
import rpUrlHistory from '@/components/History/rpUrlHistory'
import lotteryUrlHistory from '@/components/History/lotteryUrlHistory'
//列表
import goodsBasicInfo from '@/components/List/goodsBasicInfo'
import orderDetailGet from '@/components/List/orderDetailGet'
import themeListGet from '@/components/List/themeListGet'

Vue.use(Router)

const routes =  [{
		path: '',
		redirect:'/Form/goodsPidGenerate',
		component: leftNav,
		children: [{
			path: '/Form/goodsPidGenerate',
			component: goodsPidGenerate,
			name: '广告位'
		},{
			path: '/Form/goodsUrlGenerate',
			component: goodsUrlGenerate,
			name: '商品推广链接'
		},{
			path: '/Form/lotteryUrlGenerate',
			component: lotteryUrlGenerate,
			name: '转盘抽免单链接'
		},{
			path: '/Form/rpUrlGenerate',
			component: rpUrlGenerate,
			name: '红包推广链接'
		},{
			path: '/History/goodsPidHistory',
			component: goodsPidHistory,
			name: '广告位历史纪录'
		},{
			path: '/History/goodsUrlHistory',
			component: goodsUrlHistory,
			name: '商品推广链接记录'
		},{
			path: '/History/lotteryUrlHistory',
			component: lotteryUrlHistory,
			name: '转盘抽免单链接记录'
		},{
			path: '/History/rpUrlHistory',
			component: rpUrlHistory,
			name: '红包推广链接记录'
		},{
			path: '/List/goodsBasicInfo',
			component: goodsBasicInfo,
			name: '商品基本信息'
		},{
			path: '/List/orderDetailGet',
			component: orderDetailGet,
			name: '订单详情'
		},{
			path: '/List/themeListGet',
			component: themeListGet,
			name: '主题列表'
		}]
	}]

const router = new Router({
	mode: 'history',
	routes,
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition) {
			return savedPosition;
		} else {
			return {
				x: 0,
				y: 0
			};
		}
	}
});
export default router