<template>
	<div class="themeList">
		<el-col class="line" :span="24">
			<h3 style="margin: 10px;">{{title}}</h3>
			<el-col class="borderRight" :span="24" style="margin-bottom: 20px;">
				<el-col :span="16">
					<el-form :model="ruleForm"  ref="ruleForm" label-width="160px" class="demo-ruleForm">
						<el-form-item label="Client_id：">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								{{ruleForm.Client_id}}
							</el-col>
						</el-form-item>
						<el-form-item label="返回的一页数据数量：" prop="page_size">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								<el-tooltip content="数据数量取值范围为1-50" placement="top">
									<el-input-number v-model.trim="ruleForm.page_size" :controls="false" :min="1" :max="50"></el-input-number>
								</el-tooltip>
							</el-col>
						</el-form-item>
						<el-form-item label="返回的页码：" prop="page">
							<el-col :xs="24" :sm="16" :md="10" :lg="6">
								<el-tooltip content="页码取值范围为1-10000" placement="top">
									<el-input-number v-model.trim="ruleForm.page" :controls="false" :min="1" :max="10000"></el-input-number>
							</el-tooltip>		
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="submitDisabled" @click="onSubmit()">搜索</el-button>
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
					<el-table :data="tableData" v-loading="tableLoading" height="500" border style="width: 100%" id="themeTable">
						<el-table-column prop="id" label="主题ID"></el-table-column>
						<el-table-column prop="imageUrl" label="主题图片">
							<template slot-scope="scope">
								<el-link type="primary" :underline="false" :href="scope.row.imageUrl">{{scope.row.imageUrl}}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="主题名称"></el-table-column>
						<el-table-column prop="goodsNum" label="主题包含的商品数量"></el-table-column>
					</el-table>
				</el-col>
			</div>
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
						page_size: 50,
						page:''
					},
					textarea:'',
					tableData: [],
					tableLoading: false,
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '多多进宝主题列表'
				}
			},
			mounted: function() {

			},
			methods: {
				onSubmit() {
					var v = this;
					v.tableLoading = true;
					v.submitDisabled = true;
					v.$api.get(v.apiList.themeList+'?pageSize='+v.ruleForm.page_size+'&page='+v.ruleForm.page, '', function(r) {
						v.tableLoading = false;
						if(r && r.records && r.records.length > 0) {
							v.textarea = JSON.stringify(r);
							v.tableData = r.records || [];
						} else {
							v.tableData = [];
							v.textarea = ''
						};
						v.submitDisabled = false;
					})
				},
				exportExcel() {
					let xlsxParam = { raw: true };
					/* generate workbook object from table */
					let wb = XLSX.utils.table_to_book(document.querySelector('#themeTable'),xlsxParam);
					/* get binary string as output */
					let wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'array'
					});
					try {
						FileSaver.saveAs(new Blob([wbout], {
							type: 'application/octet-stream;charset=utf-8'
						}), '多多进宝主题列表.xlsx');
					} catch(e) {
						if(typeof console !== 'undefined')
							console.log(e, wbout)
					}
					return wbout
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.themeList {
		.borderRight {
			border-top: 5px solid #5cc0fd;
		}
		.source {
			padding: 24px;
		}
	}
</style>