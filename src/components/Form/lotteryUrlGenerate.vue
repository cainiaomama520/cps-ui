<template>
	<div class="lotteryUrlGenForm">
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
								<el-input type="textarea" v-model="ruleForm.p_id" clearable :autosize="{ minRows: 2, maxRows: 6}"></el-input>
								<div class="sub-msg">（ 注：一个推广位id一行）</div>
							</el-col>
						</el-form-item>
						<el-form-item label="是否生成唤起微信客户端链接：">
							<el-radio-group v-model="ruleForm.webview">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否生成短链接：">
							<el-radio-group v-model="ruleForm.short_url">
								<el-radio :label='true'>是</el-radio>
								<el-radio :label='false'>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否生成多人成团推广链接：">
							<el-radio-group v-model="ruleForm.multi_group">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="自定义参数：" prop="custom_parameters">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.custom_parameters" clearable maxlength="64" show-word-limit></el-input>
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="submitDisabled" @click="submitForm('ruleForm')">生成转盘抽免单url</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="8">
					<h4 style="margin: 10px;">返回的原始数据：</h4>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 12}" v-model="textarea"></el-input>
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
					<el-col :span="24">
						<el-table :data="tableData" height="400" border style="width: 100%" id="lotteryUrlGenTable" v-loading="tableLoading">
							<el-table-column prop="url" label="转盘抽免单长链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="short_url" label="转盘抽免单短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="mobile_url" label="转盘抽免单唤醒APP长链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="mobile_short_url" label="转盘抽免单唤醒APP短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="we_app_web_view_url" label="转盘抽免单唤醒微信长链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="we_app_web_view_short_url" label="转盘抽免单唤醒微信短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="we_app_page_path" label="转盘抽免单小程序短链接" :formatter="formatter"></el-table-column>
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
						webview: false,
						short_url: 'false',
						multi_group: false,
						custom_parameters: ''
					},
					tableData: [],
					tableLoading:false,
					textarea: '',
					rules: {
						p_id: [{
							required: true,
							message: '请输入推广位id',
							trigger: 'blur'
						}]
					},
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '生成转盘抽免单url'
				}
			},
			mounted: function() {

			},
			methods: {
				formatter(row, column) {
					//					debugger;
					const property = column['property'];
					let value;
					if(row.content) {
						if(this.ruleForm.multi_group){
							value = row.content.multi_url_list[property];
						}else{
							value = row.content.single_url_list[property];
						}
						if(!value) {
							value = '无'
						}
						return value;
					} else {
						return '无'
					}
				},
				submitForm(formName) {
					var v = this;
					this.$refs[formName].validate((valid) => {
						if(valid) {
							v.tableLoading = true;
							//推广位list
							let arrays = [],p_id_list = [];
							arrays = v.ruleForm.p_id.split(/[(\r\n)\r\n]+/);
							for(let i = 0; i < arrays.length; i++) {
								if(arrays[i] != "") {
									p_id_list.push(arrays[i]);
								}
							};
							let sdata = {
								pidList: p_id_list,
								generateWeappWebview: v.ruleForm.webview,
								generateShortUrl: v.ruleForm.short_url,
								multiGroup: v.ruleForm.multi_group,
								customParameters: v.ruleForm.custom_parameters,
							};
							v.submitDisabled = true;
							console.log(sdata)
							v.$api.post(v.apiList.lotteryUrl, sdata, function(r) {
								v.tableLoading = false;
								if(r && r.list && r.list.length > 0) {
									v.textarea = r.response;
									v.tableData = r.list || [];
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
					let xlsxParam = { raw: true };
					/* generate workbook object from table */
					let wb = XLSX.utils.table_to_book(document.querySelector('#lotteryUrlGenTable'),xlsxParam);
					/* get binary string as output */
					let wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'array'
					});
					try {
						FileSaver.saveAs(new Blob([wbout], {
							type: 'application/octet-stream;charset=utf-8'
						}), '生成转盘抽免单url列表.xlsx');
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
						path: '/History/lotteryUrlHistory',
					});
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.lotteryUrlGenForm {
		.sub-msg {
			font-size: 12px;
			color: gray;
			line-height: 15px;
			margin-top: 7px;
		}
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