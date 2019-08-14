<template>
	<div class="rpUrlGenForm">
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
						<el-form-item label="是否生成短链接：" prop="short_url">
							<el-radio-group v-model="ruleForm.short_url">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="推广位列表：" prop="p_id">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input type="textarea" v-model="ruleForm.p_id" clearable :autosize="{ minRows: 2, maxRows: 6}"></el-input>
								<div class="sub-msg">（ 注：一个推广位id一行）</div>
							</el-col>
						</el-form-item>
						<el-form-item label="自定义参数：" prop="custom_parameters">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input v-model="ruleForm.custom_parameters" maxlength="64" show-word-limit clearable></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="是否唤起微信客户端：" prop="webview">
							<el-radio-group v-model="ruleForm.webview">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="唤起微信app推广短链接：" prop="web_short_url">
							<el-radio-group v-model="ruleForm.web_short_url">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="唤起微信app推广链接：" prop="web_url">
							<el-radio-group v-model="ruleForm.web_url">
								<el-radio :label=true>是</el-radio>
								<el-radio :label=false>否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否生成小程序推广：" prop="we_app">
							<el-radio-group v-model="ruleForm.we_app">
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
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 28}" v-model="textarea"></el-input>
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
						<el-table :data="tableData" height="500" border style="width: 100%" id="rpUrlGenTable" v-loading="tableLoading">
							<el-table-column prop="url" label="红包推广链接">
								<template slot-scope="scope">
									<el-popover v-if="scope.row.content && scope.row.content.url" placement="top-start" width="200" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.url}}</span>
										</div>
									</el-popover>
									<span v-else>无</span>
								</template>
							</el-table-column>
							<el-table-column prop="short_url" label="红包推广短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="mobile_url" label="红包推广移动链接">
								<template slot-scope="scope">
									<el-popover v-if="scope.row.content && scope.row.content.mobile_url" placement="top-start" width="200" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.mobile_url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.mobile_url}}</span>
										</div>
									</el-popover>
									<span v-else>无</span>
								</template>
							</el-table-column>
							<el-table-column prop="mobile_short_url" label="红包推广移动短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="multi_group_url" label="红包推广多人团链接">
								<template slot-scope="scope">
									<el-popover v-if="scope.row.content && scope.row.content.multi_group_url" placement="top-start" width="200" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.multi_group_url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.multi_group_url}}</span>
										</div>
									</el-popover>
									<span v-else>无</span>
								</template>
							</el-table-column>
							<el-table-column prop="multi_group_short_url" label="红包推广多人团短链接" :formatter="formatter"></el-table-column>
							<el-table-column prop="multi_group_mobile_url" label="红包推广多人团移动链接">
								<template slot-scope="scope">
									<el-popover v-if="scope.row.content && scope.row.content.multi_group_mobile_url" placement="top-start" width="200" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.multi_group_mobile_url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.multi_group_mobile_url}}</span>
										</div>
									</el-popover>
									<span v-else>无</span>
								</template>
							</el-table-column>
							<el-table-column prop="multi_group_mobile_short_url" label="红包推广多人团移动短链接" :formatter="formatter"></el-table-column>
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
						short_url: false,
						p_id: '',
						custom_parameters: '',
						webview: false,
						web_short_url: false,
						web_url: false,
						we_app: false
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
					return '生成红包推广链接'
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
						value = row.content[property];
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
							v.tableLoading=true;
							//推广位list
							let arrays = [],
								p_id_list = [];
							arrays = v.ruleForm.p_id.split(/[(\r\n)\r\n]+/);
							for(let i = 0; i < arrays.length; i++) {
								if(arrays[i] != "") {
									p_id_list.push(arrays[i]);
								}
							};
							let sdata = {
								generateShortUrl: v.ruleForm.short_url,
								pidList: p_id_list,
								customParameters: v.ruleForm.custom_parameters,
								generateWeappWebview: v.ruleForm.webview,
								weAppWebViewShortUrl: v.ruleForm.web_short_url,
								weAppWebWiewUrl: v.ruleForm.web_url,
								generateWeApp: v.ruleForm.we_app
							};
							v.submitDisabled = true;
							console.log(sdata)
							v.$api.post(v.apiList.rpUrl, sdata, function(r) {
								v.tableLoading=false;
								let list = r.list;
								if(r && list && list.length > 0) {
									v.textarea = r.response;
									v.tableData = list || [];
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
					let wb = XLSX.utils.table_to_book(document.querySelector('#rpUrlGenTable'),xlsxParam);
					/* get binary string as output */
					let wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'array'
					});
					try {
						FileSaver.saveAs(new Blob([wbout], {
							type: 'application/octet-stream;charset=utf-8'
						}), '生成红包推广链接列表.xlsx');
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
						path: '/History/rpUrlHistory',
					});
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.rpUrlGenForm {
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