<template>
	<div class="goodsBasic">
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
						<el-form-item label="商品id：" prop="goods_id_list">
							<el-col :xs="24" :sm="16" :md="16" :lg="16">
								<el-input type="textarea" v-model="ruleForm.goods_id_list" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
								<div class="sub-msg">（ 注：一个商品id一行）</div>
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
					<el-table :data="tableData" v-loading="tableLoading" height="500" border style="width: 100%" id="goodsBasicTable">
						<el-table-column prop="goodsId" label="商品id"></el-table-column>
						<el-table-column prop="minNormalPrice" label="最小单买价格(分)"></el-table-column>
						<el-table-column prop="minGroupPrice" label="最小成团价格(分)"></el-table-column>
						<el-table-column prop="goodsPic" label="商品缩略图">
							<template slot-scope="scope">
								<el-link type="primary" :underline="false" :href="scope.row.goodsPic">{{scope.row.goodsPic}}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="goodsName" label="商品标题"></el-table-column>
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
						Client_id: 'be0356fc977b412cb9c75fd10c2d7e19',
						goods_id_list: ''
					},
					rules: {
						goods_id_list: [{
							required: true,
							message: '请输入商品id',
							trigger: 'blur'
						}]
					},
					textarea: '',
					tableData: [],
					tableLoading: false,
					submitDisabled: false
				};
			},
			computed: {
				title: function() {
					return '商品基本信息'
				}
			},
			mounted: function() {

			},
			methods: {
				onSubmit(formName) {
					this.$refs[formName].validate((valid) => {
						if(valid) {
							var v = this;
							v.tableLoading = true;
							//名称list
							let arrays = [],
								goods_id_list = [];
							arrays = v.ruleForm.goods_id_list.split(/[(\r\n)\r\n]+/);
							for(let i = 0; i < arrays.length; i++) {
								if(arrays[i] != "") {
									goods_id_list.push(arrays[i]);
								}
							};
							v.submitDisabled = true;
							v.$api.get(v.apiList.goodsInfo+'?goodsIdList='+goods_id_list, '', function(r) {
								v.tableLoading = false;
								if(r.length > 0) {
									v.textarea = JSON.stringify(r);
									v.tableData = r || [];
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
					if(v.ruleForm.goods_id_list.length  == 0){
						v.$message({
							type: 'warning',
							message: '商品id不能为空！'
						});
						return;
					}else{
						let xlsxParam = { raw: true };
						/* generate workbook object from table */
						let wb = XLSX.utils.table_to_book(document.querySelector('#goodsBasicTable'),xlsxParam);
						/* get binary string as output */
						let wbout = XLSX.write(wb, {
							bookType: 'xlsx',
							bookSST: true,
							type: 'array'
						});
						try {
							FileSaver.saveAs(new Blob([wbout], {
								type: 'application/octet-stream;charset=utf-8'
							}), '商品基本信息列表.xlsx');
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
	.goodsBasic {
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