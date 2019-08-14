<template>
	<div class="goodsUrlHistory">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;"></el-col>
			<el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-form-item label="日期：">
					<el-date-picker v-model="ruleForm.datePicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :clearable="false">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="推广位id：" prop="p_id">
					<el-col :xs="24" :sm="16" :md="10" :lg="6">
						<el-input v-model="ruleForm.p_id" clearable></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="商品id：" prop="goods_id">
					<el-col :xs="24" :sm="16" :md="10" :lg="6">
						<el-input v-model="ruleForm.goods_id" clearable></el-input>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="submitDisabled" @click="onSubmit()">搜索</el-button>
					<el-button @click="exportExcel">导出</el-button>
					<el-button type="warning" @click="backAction()">返回</el-button>
				</el-form-item>
			</el-form>
			<div class="source">
				<el-col :span="24">
					<el-table :data="tableData" v-loading="tableLoading" height="500" border style="width: 100%">
						<el-table-column prop="createDate" label="日期"></el-table-column>
						<el-table-column prop="pid" label="推广位id"></el-table-column>
						<el-table-column prop="goodsIds" label="商品id"></el-table-column>
						<el-table-column prop="url" label="推广长链接">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<div v-else-if="scope.row.content.url">
									<el-popover placement="top-start" title="推广长链接" width="300" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.url}}</span>
										</div>
									</el-popover>
								</div>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="we_app_web_view_short_url" label="唤起微信app推广短链接" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_web_view_url" label="唤起微信app推广链接">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<div v-else-if="scope.row.content.we_app_web_view_url">
									<el-popover placement="top-start" title="唤起微信app推广链接" width="300" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.we_app_web_view_url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.we_app_web_view_url}}</span>
										</div>
									</el-popover>
								</div>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="mobile_short_url" label="唤醒拼多多app的推广短链接" :formatter="formatter"></el-table-column>
						<el-table-column prop="mobile_url" label="唤醒拼多多app的推广长链接">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<div v-else-if="scope.row.content.mobile_url">
									<el-popover placement="top-start" title="唤醒拼多多app的推广长链接" width="300" trigger="hover" content="">
										<div style="word-wrap:break-word">
											<span>{{scope.row.content.mobile_url}}</span>
										</div>
										<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
											<span>{{scope.row.content.mobile_url}}</span>
										</div>
									</el-popover>
								</div>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="short_url" label="推广短链接" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_info.we_app_icon_url" label="小程序图片">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<el-link v-else-if="(scope.row.content.we_app_info && scope.row.content.we_app_info.we_app_icon_url)" type="primary" :underline="false" :href="scope.row.content.we_app_info.we_app_icon_url">{{scope.row.content.we_app_info.we_app_icon_url}}</el-link>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="we_app_info.banner_url" label="小程序Banner图">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<el-link v-if="(scope.row.content.we_app_info && scope.row.content.we_app_info.banner_url)" type="primary" :underline="false" :href="scope.row.content.we_app_info.banner_url">{{scope.row.content.we_app_info.banner_url}}</el-link>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="we_app_info.desc" label="小程序描述" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_info.source_display_name" label="小程序来源名" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_info.page_path" label="小程序path值">
							<template slot-scope="scope">
								<div v-if="Object.keys(scope.row.content).length==0">
									<span>无</span>
								</div>
								<el-popover  v-else-if="(scope.row.content.we_app_info && scope.row.content.we_app_info.page_path)" placement="top-start" title="小程序path值" width="300" trigger="hover" content="">
									<div style="word-wrap:break-word">
										<span>{{scope.row.content.we_app_info.page_path}}</span>
									</div>
									<div style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap;" slot="reference">
										<span>{{scope.row.content.we_app_info.page_path}}</span>
									</div>
								</el-popover>
								<span v-else>无</span>
							</template>
						</el-table-column>
						<el-table-column prop="we_app_info.user_name" label="小程序用户名" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_info.title" label="小程序标题" :formatter="formatter"></el-table-column>
						<el-table-column prop="we_app_info.app_id" label="拼多多小程序id" :formatter="formatter"></el-table-column>
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
						goods_id: '',
						datePicker: [moment(new Date()).format("YYYY-MM-DD") + ' 00:00:00', moment(new Date()).format("YYYY-MM-DD") + " 23:59:59"],
						p_id: ''
					},
					tableData: [],
					tableLoading: false,
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '普通商品推广链接历史纪录'
				}
			},
			mounted: function() {

			},
			methods: {
				formatter(row, column) {
					//				 	debugger
					const property = column['property'];
//					console.log(property)
					let value;
					if(Object.keys(row.content).length == 0) {
						return '无'
					} else {
						if(row.content.we_app_info &&property.indexOf("we_app_info") != -1) {
							let key = property.split(".")[1]
							value = row.content.we_app_info[key]
						} else {
							value = row.content[property];
						}
						if(!value) {
							value = '无'
						}
						return value;
					}
				},
				onSubmit() {
					this.pageCtr.pageCurrent = 1;
					this.getTableListWithParams();
				},
				getTableListWithParams() {
					var v = this;
					v.tableLoading = true;
					let sdata = {
						'pageCondition': {
							"groupOp": "AND",
							"rules": [{
								"data": v.ruleForm.p_id,
								"field": "pid ",
								"op": "eq"
							}, {
								"data": v.ruleForm.goods_id,
								"field": "goods_ids ",
								"op": "eq"
							}, {
								"data": v.ruleForm.datePicker[0],
								"field": "create_date ",
								"op": "ge"
							}, {
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
//					console.log(sdata)
					v.$api.post(v.apiList.goodsPromotionHistory, sdata, function(r) {
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
								"data": v.ruleForm.p_id,
								"field": "pid ",
								"op": "eq"
							}, {
								"data": v.ruleForm.goods_id,
								"field": "goods_ids ",
								"op": "eq"
							}, {
								"data": v.ruleForm.datePicker[0],
								"field": "create_date ",
								"op": "ge"
							}, {
								"data": v.ruleForm.datePicker[1],
								"field": "create_date ",
								"op": "le"
							}]
						}
					};
					v.downDisabled = true;
					v.$api.exportstats(v.apiList.goodsPromotionExporty, cdn, {
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
	.goodsUrlHistory {
		.borderRight {
			border-top: 5px solid #5cc0fd;
		}
		.source {
			padding: 24px;
		}
	}
</style>