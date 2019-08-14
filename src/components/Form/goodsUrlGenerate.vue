<template>
	<div class="goodsUrlGenForm">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;">
				<el-col :span="16">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
						<el-form-item label="Client_id：">
							<el-col :xs="24" :sm="24" :md="24" :lg="24">
								{{ruleForm.Client_id}}
							</el-col>
						</el-form-item>
						<el-form-item label="推广位id：" prop="p_id">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.p_id"></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="商品id：" prop="goods_id">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.goods_id" clearable></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="是否生成短链接：">
							<el-radio-group v-model="ruleForm.short_url">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否生成多人团推广链接：">
							<el-radio-group v-model="ruleForm.multi_group">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="自定义参数：" prop="custom_parameters">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input type="text" v-model="ruleForm.custom_parameters" maxlength="64" show-word-limit clearable></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="是否生成唤起微信客户端链接：">
							<el-radio-group v-model="ruleForm.webview">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="招商多多客ID：" prop="duo_id">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.duo_id" clearable></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="是否生成小程序推广：">
							<el-radio-group v-model="ruleForm.app">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否生成微博推广链接：">
							<el-radio-group v-model="ruleForm.weiboapp">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="submitDisabled" @click="submitForm('ruleForm')">生成推广链接</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="8">
					<h4 style="margin: 10px;">返回的原始数据：</h4>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 30}" v-model="textarea"></el-input>
				</el-col>
			</el-col>
		</el-col>
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">返回的数据</h3>
			<el-col :span="24" class="borderLeft" label-width="120px">
				<div class="source">
					<div style="margin-bottom: 20px;">
						<el-button @click="exportExcel" :disabled="0 == tableData.length">导出</el-button>
						<el-button @click="toHistory()">历史纪录</el-button>
					</div>
					<el-col :span="16">
						<el-table :data="tableData" height="400" border style="width: 100%" id="goodsUrlGenTable" v-loading="tableLoading">
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
		</el-col>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
		data() {
				return {
					ruleForm: {
						Client_id: 'be0356fc977b412cb9c75fd10c2d7e19',
						p_id: '',
						goods_id: '',
						short_url: false,
						multi_group: false,
						custom_parameters: '',
						webview: false,
						duo_id: '',
						app: false,
						weiboapp: false
					},
					tableData: [],
					tableLoading:false,
					textarea: '',
					rules: {
						p_id: [{
							required: true,
							message: '请输入推广位id',
							trigger: 'blur'
						}],
						goods_id: [{
							required: true,
							message: '请输入商品id',
							trigger: 'blur'
						}]
					},
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '生成普通商品推广链接'
				}
			},
			mounted: function() {

			},
			methods: {
				submitForm(formName) {
					var v = this;
					this.$refs[formName].validate((valid) => {
						if(valid) {
							v.tableLoading = true;
							let goods_id = v.ruleForm.goods_id - 0;
							let goodsIdList=[];
							goodsIdList.push(goods_id);
							let sdata = {
								pId: v.ruleForm.p_id,
								goodsIdList: goodsIdList,
								generateShortUrl: v.ruleForm.short_url,
								multiGroup: v.ruleForm.multi_group,
								customParameters: v.ruleForm.custom_parameters,
								generateWeappWebview: v.ruleForm.webview,
								zsDuoId: v.ruleForm.duo_id - 0,
								generateWeApp: v.ruleForm.app,
								generateWeiboappWebview: v.ruleForm.weiboapp
							};
							v.submitDisabled = true;
							console.log(sdata)
							v.$api.post(v.apiList.goodsPromotion, sdata, function(r) {
								v.tableLoading = false;
								let tableObj;
								let _data = r.list[0].content;
//								console.log(_data)
								if(_data) {
									v.textarea = r.response;
									tableObj = [{
										'name': '唤起微信app推广短链接',
										'value': _data.we_app_web_view_short_url?_data.we_app_web_view_short_url:'无'
									}, {
										'name': '唤起微信app推广链接',
										'value': _data.we_app_web_view_url?_data.we_app_web_view_url:'无'
									}, {
										'name': '唤醒拼多多app的推广短链接',
										'value': _data.mobile_short_url?_data.mobile_short_url:'无'
									}, {
										'name': '唤醒拼多多app的推广长链接',
										'value': _data.mobile_url?_data.mobile_url:'无'
									}, {
										'name': '推广短链接',
										'value': _data.short_url?_data.short_url:'无'
									}, {
										'name': '推广长链接',
										'value': _data.url?_data.url:'无'
									}, {
										'name': '小程序图片',
										'value': (_data.we_app_info&&_data.we_app_info.we_app_icon_url)?_data.we_app_info.we_app_icon_url:'无',
										'isa':true
									}, {
										'name': '小程序Banner图',
										'value': (_data.we_app_info&&_data.we_app_info.banner_url)?_data.we_app_info.banner_url:'无',
										'isa':true
									}, {
										'name': '小程序描述',
										'value': (_data.we_app_info&&_data.we_app_info.desc)?_data.we_app_info.desc:'无'
									}, {
										'name': '小程序来源名',
										'value': (_data.we_app_info&&_data.we_app_info.source_display_name)?_data.we_app_info.source_display_name:'无'
									}, {
										'name': '小程序path值',
										'value': (_data.we_app_info&&_data.we_app_info.page_path)?_data.we_app_info.page_path:'无'
									}, {
										'name': '小程序用户名',
										'value': (_data.we_app_info&&_data.we_app_info.user_name)?_data.we_app_info.user_name:'无'
									}, {
										'name': '小程序标题',
										'value': (_data.we_app_info&&_data.we_app_info.title)?_data.we_app_info.title:'无'
									}, {
										'name': '拼多多小程序id',
										'value': (_data.we_app_info&&_data.we_app_info.app_id)?_data.we_app_info.app_id:'无'
									}, {
										'name': '微博推广短链接',
										'value': _data.we_app_web_view_short_url?_data.we_app_web_view_short_url:'无'
									}, {
										'name': '微博推广链接',
										'value': _data.we_app_web_view_url?_data.we_app_web_view_url:'无'
									}]

									v.tableData = tableObj || [];
								} else {
									v.tableData = [];
									v.textarea = '';
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
					let xlsxParam = { raw: true };//转换成excel时，使用原始的格式
					/* generate workbook object from table */
					let wb = XLSX.utils.table_to_book(document.querySelector('#goodsUrlGenTable'),xlsxParam);
					/* get binary string as output */
					let wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'array'
					});
					try {
						FileSaver.saveAs(new Blob([wbout], {
							type: 'application/octet-stream;charset=utf-8'
						}), '生成普通商品推广链接列表.xlsx');
					} catch(e) {
						if(typeof console !== 'undefined')
							console.log(e, wbout)
					}
					return wbout
				},
				resetForm(formName) {
					this.$refs[formName].resetFields();
				},
				//历史纪录
				toHistory() {
					this.$router.push({
						path: '/History/goodsUrlHistory',
					});
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.goodsUrlGenForm {
		.borderLeft {
			border-top: 5px solid #355c9d;
		}
		.borderRight {
			border-top: 5px solid #5cc0fd;
		}
		.source {
			padding: 24px;
		}
	}
</style>