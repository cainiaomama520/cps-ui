<template>
	<div class="orderDetail">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;">
				<el-col :span="16">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
						<el-form-item label="Client_id：">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								{{ruleForm.Client_id}}
							</el-col>
						</el-form-item>
						<el-form-item label="订单号：" prop="order_sn">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.order_sn" clearable></el-input>
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="submitDisabled" @click="onSubmit('ruleForm')">搜索</el-button>
							<el-button @click="exportExcel" :disabled="0 == tableData.length">导出</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="8">
					<h4 style="margin: 10px;">返回的原始数据：</h4>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8}" v-model="textarea"></el-input>
				</el-col>
			</el-col>
			<div class="source">
				<el-col :span="24">
					<el-table :data="tableData" v-loading="tableLoading" height="400" border style="width: 100%" id="orderDetailTable">
						<el-table-column prop="name" label="名称"></el-table-column>
						<el-table-column prop="value" label="数据">
							<template slot-scope="scope">
								<div v-if="scope.row.isa == true" style="display: inline-block;">
									<span v-if="scope.row.value == '无'">无</span>
									<el-link v-else type="primary" :href="scope.row.value">{{scope.row.value}}</el-link>
								</div>
								<span v-else>{{scope.row.value}}</span>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</div>
		</el-col>
		<!--预览弹出框-->
		<el-dialog title="商品缩略图-预览" :visible.sync="imgBox" :show-close="isTrue" custom-class="myDialog">
			<div>图片地址：{{imgUrl}}</div>
			<div class="previewBox"><img :src="imgUrl"></div>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import moment from 'moment'
	export default {
		data() {
				return {
					ruleForm: {
						Client_id: 'be0356fc977b412cb9c75fd10c2d7e19',
						order_sn: ''
					},
					rules: {
						order_sn: [{
							required: true,
							message: '请输入订单号d',
							trigger: 'blur'
						}]
					},
					isTrue: true,
					imgBox: false,
					imgUrl: "",
					textarea: '',
					tableData: [],
					tableLoading: false,
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '订单详情'
				}
			},
			mounted: function() {

			},
			methods: {
				previewImg: function(url) {
					this.imgUrl = url;
					this.imgBox = true;
				},
				onSubmit(formName) {
					this.$refs[formName].validate((valid) => {
						if(valid) {
							var v = this;
							v.tableLoading = true;
							v.submitDisabled = true;
							v.$api.get(v.apiList.orderDetail+'?orderSn='+v.ruleForm.order_sn, '', function(r) {
								v.tableLoading = false;
								let tableObj;
								let _data = r
								if(_data) {
									v.textarea = JSON.stringify(r);
									tableObj = [{
										'name': '订单编号',
										'value': _data.orderSn? _data.orderSn:'无'
									}, {
										'name': '商品id',
										'value': _data.goodsId? _data.goodsId:'无'
									}, {
										'name': '商品名称',
										'value': _data.goodsName? _data.goodsName:'无'
									}, {
										'name': '商品缩略图',
										'value': _data.goodsThumbnailUrl? _data.goodsThumbnailUrl:'无',
										'isa': true
									}, {
										'name': '商品数量',
										'value': _data.goodsQuantity? _data.goodsQuantity:'无'
									}, {
										'name': '商品价格（分）',
										'value': _data.goodsPrice? _data.goodsPrice:'无'
									}, {
										'name': '订单价格（分）',
										'value': _data.orderAmount? _data.orderAmount:'无' 
									}, {
										'name': '佣金比例(千分比)',
										'value': _data.promotionRate? _data.promotionRate:'无' 
									}, {
										'name': '佣金（分）',
										'value': _data.promotionAmount? _data.promotionAmount:'无' 
									}, {
										'name': '结算批次号',
										'value': _data.batchNo? _data.batchNo:'无'
									}, {
										'name': '订单状态',
										'value': _data.orderStatus? _data.orderStatus:'无' 
									}, {
										'name': '订单状态描述',
										'value': _data.orderStatusDesc?_data.orderStatusDesc:'--'
									}, {
										'name': '订单创建时间',
										'value': _data.orderCreateTime? moment(_data.orderCreateTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单支付时间',
										'value': _data.orderPayTime? moment(_data.orderPayTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无'  
									}, {
										'name': '订单成团时间',
										'value': _data.orderGroupSuccessTime? moment(_data.orderGroupSuccessTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单确认收货时间',
										'value': _data.orderReceiveTime? moment(_data.orderReceiveTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单审核时间',
										'value': _data.orderVerifyTime? moment(_data.orderVerifyTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单结算时间',
										'value': _data.orderSettleTime? moment(_data.orderSettleTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单最后更新时间',
										'value': _data.orderModifyAt? moment(_data.orderModifyAt * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '订单来源',
										'value': _data.matchChannel == 0 ? "关联" : _data.matchChannel == 5 ? "直接下单页RPC请求" : "--"
									}, {
										'name': '订单类型',
										'value': _data.type == 0 ? "领券页面" : _data.type == 1 ? "红包页" : _data.type == 2 ? "领券页" : _data.type == 3 ? "题页" : "--"
									}, {
										'name': '成团编号',
										'value': _data.groupId? _data.groupId:'无' 
									}, {
										'name': '多多客工具id',
										'value': (_data.authDuoId || _data.authDuoId == 0)? _data.authDuoId:'无'
									}, {
										'name': '招商多多客id',
										'value': _data.zsDuoId || _data.zsDuoId == 0? _data.zsDuoId:'无'
									}, {
										'name': '自定义参数',
										'value': _data.customParameters? _data.customParameters:'无' 
									}, {
										'name': 'CPS_Sign',
										'value': _data.cpsSign? _data.cpsSign:'无' 
									}, {
										'name': '链接最后一次生产时间',
										'value': _data.urlLastGenerateTime? moment(_data.urlLastGenerateTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无'
									}, {
										'name': '打点时间',
										'value': _data.pointTime? moment(_data.pointTime * 1000).format("YYYY-MM-DD HH:mm:ss"):'无' 
									}, {
										'name': '售后状态',
										'value': _data.returnStatus == 0 ? "无" : _data.returnStatus == 1 ? "售后中" : _data.returnStatus == 2 ? "售后完成" : "--"
									}, {
										'name': '推广位id',
										'value': _data.pid?_data.pid:'无'
									}]

									v.tableData = tableObj || [];
								} else {
									v.tableData = [];
									v.textarea = ''
								};
								v.submitDisabled = false;
							})
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				},
				exportExcel() {
					let v = this;
					if(v.ruleForm.order_sn.length == 0) {
						v.$message({
							type: 'warning',
							message: '订单号不能为空！'
						});
						return;
					} else {
						let xlsxParam = { raw: true };//转换成excel时，使用原始的格式
						/* generate workbook object from table */
						let wb = XLSX.utils.table_to_book(document.querySelector('#orderDetailTable'),xlsxParam);
						/* get binary string as output */
						let wbout = XLSX.write(wb, {
							bookType: 'xlsx',
							bookSST: true,
							type: 'array'
						});
						try {
							FileSaver.saveAs(new Blob([wbout], {
								type: 'application/octet-stream;charset=utf-8'
							}), '订单详情列表.xlsx');
						} catch(e) {
							if(typeof console !== 'undefined')
								console.log(e, wbout)
						}
						return wbout
					}
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.orderDetail {
		.sub-msg {
			font-size: 12px;
			color: gray;
			line-height: 15px;
			margin-top: 7px;
		}
		.borderRight {
			border-top: 5px solid #5cc0fd;
		}
		.source {
			padding: 24px;
		}
	}
</style>