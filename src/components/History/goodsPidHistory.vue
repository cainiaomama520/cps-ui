<template>
	<div class="pidHistory">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;"></el-col>
			<el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-form-item label="日期：">
					<el-date-picker v-model="ruleForm.datePicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :clearable="false">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="推广位名称：" prop="name">
					<el-col :xs="24" :sm="16" :md="10" :lg="6">
						<el-input v-model="ruleForm.name" clearable></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="推广位id：" prop="p_id">
					<el-col :xs="24" :sm="16" :md="10" :lg="6">
						<el-input v-model="ruleForm.p_id" clearable></el-input>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="submitDisabled" @click="onSubmit()">搜索</el-button>
					<el-button @click="exportExcel()" :loading="downDisabled">导出</el-button>
					<el-button type="warning" @click="backAction()">返回</el-button>
				</el-form-item>
			</el-form>
			<div class="source">
				<el-col :span="20">
					<el-table :data="tableData" v-loading="tableLoading" height="400" border style="width: 100%">
						<el-table-column prop="createDate" label="日期">
						</el-table-column>
						<el-table-column prop="pidName" label="推广位名称">
						</el-table-column>
						<el-table-column prop="pid" label="推广位id">
						</el-table-column>
						<el-table-column prop="pddCreateTime" label="推广位创建时间">
						</el-table-column>
					</el-table>
					<div class="block">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageCtr.pageCurrent" :page-sizes="[10, 50, 100, 400]" :page-size="pageCtr.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageCtr.pageTatol">
						</el-pagination>
					</div>
				</el-col>
			</div>
		</el-col>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import moment from 'moment'
	export default {
		data() {
				return {
					pageCtr: {
						pageSize: 10,
						pageTatol: 0,
						pageCurrent: 1
					},
					ruleForm: {
						name: '',
						datePicker: [moment(new Date()).format("YYYY-MM-DD")+' 00:00:00', moment(new Date()).format("YYYY-MM-DD")+" 23:59:59"],
						p_id: ''
					},
					tableData: [],
					tableLoading: false,
					submitDisabled: false,
					downDisabled:false
				};
			},
			computed: {
				title: function() {
					return '创建广告位历史纪录'
				}
			},
			mounted: function() {

			},
			methods: {
				onSubmit() {
					this.pageCtr.pageCurrent = 1;
					this.getTableListWithParams();
				},
				getTableListWithParams() {
					var v = this;
					v.tableLoading = true;
					let cdn = {
						'pageCondition': {
							"groupOp": "AND",
							"rules": [{
								"data": v.ruleForm.name,
								"field": "pid_name ",
								"op": "like"
							},{
								"data": v.ruleForm.p_id,
								"field": "pid ",
								"op": "eq"
							},{
								"data": v.ruleForm.datePicker[0],
								"field": "create_date ",
								"op": "ge"
							},{
								"data": v.ruleForm.datePicker[1],
								"field": "create_date ",
								"op": "le"
							}]
						},
						'page': v.pageCtr.pageCurrent,
						'limit': v.pageCtr.pageSize,
						'order': 'ASC',
						'sidx': 'create_date'
					};
					v.submitDisabled = true;
					v.$api.post(v.apiList.goodsPidHistory, cdn, function(r) {
						v.tableLoading = false;
						if(r && r.records && r.records.length > 0) {
							v.tableData = r.records || [];
							v.pageCtr.pageTatol = r.total || 0;
						} else {
							v.tableData = [];
							v.pageCtr.pageTatol = 0;
						};
						v.submitDisabled = false;
					})
				},
				handleSizeChange(val) {
					this.pageCtr.pageSize = val;
					this.getTableListWithParams();
				},
				handleCurrentChange(val) {
					this.pageCtr.pageCurrent = val;
					this.getTableListWithParams();
				},
				exportExcel() {
					var v = this;
					let cdn = {
						'pageCondition': {
							"groupOp": "AND",
							"rules": [{
								"data": v.ruleForm.name,
								"field": "pid_name ",
								"op": "like"
							},{
								"data": v.ruleForm.p_id,
								"field": "pid ",
								"op": "eq"
							},{
								"data": v.ruleForm.datePicker[0],
								"field": "create_date ",
								"op": "ge"
							},{
								"data": v.ruleForm.datePicker[1],
								"field": "create_date ",
								"op": "le"
							}]
						}
					};
					v.downDisabled = true;
					v.$api.exportstats(v.apiList.goodsPidHistoryExport, cdn, {
						responseType: 'arraybuffer',
						emulateJSON: false,
						'Content-type': 'application/octet-stream'
					}, function(response) {
						v.downReportData(response);
					});
				},
				downReportData(response){
					var type = response.headers['Content-Type'] != undefined ? response.headers['Content-Type'] : response.headers['content-type'];
					var filename = "";
					var disposition = response.headers['Content-Disposition'] != undefined ? response.headers['Content-Disposition'] : response.headers['content-disposition'];
					if(disposition && disposition.indexOf('attachment') !== -1) {
						var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						var matches = filenameRegex.exec(disposition);
						if(matches != null && matches[1])
							filename = matches[1].replace(/['"]/g, '');
					}
					var blob = typeof File === 'function' ?
						new File([response.data], filename, {
							type: type
						}) :
						new Blob([response.data], {
							type: type
						});
					var URL = window.URL || window.webkitURL;
					var downloadUrl = URL.createObjectURL(blob);
					var a = document.createElement("a");
					if(typeof a.download === 'undefined') {
						window.location = downloadUrl;
					} else {
						a.href = downloadUrl;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
					}
					this.downDisabled = false;
				},
				//时间格式化
				dateFormat: function(row, column) {
					var date = row[column.property];     
					if(date == undefined) {     
						return "";     
					}     
					return moment(date * 1000).format("YYYY-MM-DD");
				},
				backAction() {
					this.$router.go(-1);
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.pidHistory {
		.borderRight {
			border-top: 5px solid #5cc0fd;
		}
		.source {
			padding: 24px;
		}
	}
</style>