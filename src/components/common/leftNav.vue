<template>
	<el-container class="navPage">
		<el-header>
			<div class="logo">拼多多</div>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router :default-openeds="openeds">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-document"></i>
							<span>创建</span>
						</template>
						<el-menu-item index="/Form/goodsPidGenerate">创建广告位</el-menu-item>
						<el-menu-item index="/Form/goodsUrlGenerate">普通商品推广链接</el-menu-item>
						<el-menu-item index="/Form/rpUrlGenerate">红包推广链接</el-menu-item>
						<!--<el-menu-item index="/Form/lotteryUrlGenerate">转盘免单链接</el-menu-item>-->
					</el-submenu>
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-setting"></i>
							<span>查询</span>
						</template>
						<el-menu-item index="/List/themeListGet">多多进宝主题列表</el-menu-item>
						<el-menu-item index="/List/goodsBasicInfo">商品基本信息</el-menu-item>
						<el-menu-item index="/List/orderDetailGet">订单详情</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
				return {
					openeds: ['1','2'],
				};
			},
			methods: {
				handleOpen(key, keyPath) {
					console.log(key, keyPath);
				},
				handleClose(key, keyPath) {
					console.log(key, keyPath);
				}
			}
	}
</script>
<style scoped="scoped" lang="scss">
	.navPage {
	    width: 100%;
		.el-header{
			height: 60px;
			line-height: 60px;
			background: #ff5454;
			color: #fff;
		}
		.logo{
			height: 60px;
		    font-size: 22px;
		}
		aside .el-menu{
			height:100%;
		}
	}
</style>