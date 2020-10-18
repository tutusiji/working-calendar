<template>
	<div class="addArchiveShow">
		<el-dialog
			title="录入事项"
			:visible.sync="this.addArchiveItemShow"
			:close-on-click-modal="false"
			:modal="false"
			:show-close="false"
			width="30%"
		>
			<div slot="title" class="dialog-header">
				<div class="tit">
					{{ this.editStatus ? "编辑事项" : "事项详情" }}
				</div>
				<div class="handle">
					<el-tooltip content="编辑" placement="top" effect="light">
						<i
							v-if="!this.editStatus"
							class="el-icon-edit"
							@click="status = true"
						></i>
					</el-tooltip>
					<el-tooltip content="删除" placement="top" effect="light">
						<i class="el-icon-delete"></i>
					</el-tooltip>
					<el-tooltip content="关闭" placement="top" effect="light">
						<i
							class="el-icon-close"
							@click="closePanel('ruleForm')"
						></i>
					</el-tooltip>
				</div>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
				<el-form-item
					label="事项名称"
					:label-width="formLabelWidth"
					prop="name"
				>
					<el-input
						v-if="this.editStatus"
						v-model="ruleForm.name"
						autocomplete="off"
						autofocus="true"
						@input="this.updateMatterName"
					></el-input>
					<div v-else>{{ ruleForm.name }}</div>
				</el-form-item>
				<el-form-item
					label="事项归档"
					:label-width="formLabelWidth"
					prop="archive"
				>
					<el-select
						v-if="this.editStatus"
						v-model="ruleForm.archive"
						placeholder="请选择关联项目"
					>
						<el-option
							v-for="(item, index) in archiveList"
							:key="index"
							:label="item.archiveName"
							:value="item.archiveName"
						></el-option>
					</el-select>
					<div v-else>{{ ruleForm.archive }}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click="$emit('activePanel', false)">取 消</el-button> -->
				<el-button @click="closePanel('ruleForm')">取 消</el-button>
				<el-button type="primary" @click="confirmItem('ruleForm')"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// import ArchiveList from "@/tempdata/archive.json";

export default {
	name: "CreateArchive",
	data() {
		return {
			formLabelWidth: "100px",
			dialogFormVisible: false,
			status: false,
			// archiveList: [],
			ruleForm: {
				name: this.name,
				archive: "",
				type: []
			},
			rules: {
				name: [
					{ required: true, message: "请输入名称", trigger: "blur" }
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				archive: [
					{
						required: true,
						message: "请选择事件归档",
						trigger: "change"
					}
				]
			}
		};
	},
	props: ["addArchiveItemShow", "editStatus", "name"],
	created() {},
	computed: {
		archiveList() {
			return this.$store.state.archives;
		}
	},
	mounted() {},
	methods: {
		closePanel(formName) {
			this.$refs[formName].resetFields();
			// this.$emit("activePanel", false);
			this.$store.state.archivesItem.show = false;
		},
		updateMatterName(value) {
			this.$store.commit("setCurrentMatter", {
				...this.$store.state.currentMatter,
				name: value
			});
		},
		confirmItem(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$store.commit(
						"updateMatters",
						this.$store.state.currentMatter
					);
					this.$store.commit("setCurrentMatter", {});
					this.closePanel(formName);
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.handle {
	margin-right: 0;
}
</style>
