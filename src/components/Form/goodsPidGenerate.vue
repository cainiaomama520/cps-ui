<template>
	<div class="pidGenForm">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;">
				<el-col :span="16">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
						<el-form-item label="Client_id：">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								{{ruleForm.Client_id}}
							</el-col>
						</el-form-item>
						<el-form-item label="推广位数量：" prop="number">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								<el-tooltip content="推广位数量取值范围为1-100" placement="top">
									<el-input-number v-model.trim="ruleForm.number" :controls="false" :min="1" :max="100"></el-input-number>
								</el-tooltip>
							</el-col>
						</el-form-item>
						<el-form-item label="推广位名称：" prop="name">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input type="textarea" v-model="ruleForm.name" clearable :autosize="{ minRows: 2, maxRows: 6}"></el-input>
								<div class="sub-msg">（ 注：一个推广位名称一行）</div>
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="submitDisabled" @click="submitForm('ruleForm')">创建</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="8">
					<h4 style="margin: 10px;">返回的原始数据：</h4>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8}" v-model="textarea"></el-input>
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
						<el-table :data="tableData" height="400" border style="width: 100%" id="goodsPidGenTable" v-loading="tableLoading">
							<el-table-column prop="pidName" label="推广位名称">
							</el-table-column>
							<el-table-column prop="pid" label="推广位id">
							</el-table-column>
							<el-table-column prop="pddCreateTime" label="推广位创建时间">
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
						Client_id:'be0356fc977b412cb9c75fd10c2d7e19',
						name: '',
						number: 10,
					},
					tableData: [],
					tableLoading: false,
					textarea: '',
					rules: {
						number: [{
							required: true,
							message: '请输入推广位数量',
							trigger: 'blur'
						}]
					},
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '创建广告位'
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
							//名称list
							let arrays = [],
								name_list = [];
							arrays = v.ruleForm.name.split(/[(\r\n)\r\n]+/);
							for(let i = 0; i < arrays.length; i++) {
								if(arrays[i] != "") {
									name_list.push(arrays[i]);
								}
							};
							let sdata = {
								number: v.ruleForm.number,
								pidNameList: name_list
							};
							v.submitDisabled = true;
							console.log(sdata)
							v.$api.post(v.apiList.goodsPid, sdata, function(r) {
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
					let xlsxParam = { raw: true };//转换成excel时，使用原始的格式
					/* generate workbook object from table */
					let wb = XLSX.utils.table_to_book(document.querySelector('#goodsPidGenTable'),xlsxParam);
					/* get binary string as output */
					let wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'array'
					});
					try {
						FileSaver.saveAs(new Blob([wbout], {
							type: 'application/octet-stream;charset=utf-8'
						}), '创建广告位列表.xlsx');
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
						path: '/History/goodsPidHistory',
					});
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.pidGenForm {
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