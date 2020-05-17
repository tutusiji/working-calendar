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
						<i class="el-icon-close" @click="$emit('activePanel', false)"></i>
					</el-tooltip>
				</div>
			</div>
			<el-form :model="form">
				<el-form-item label="事项名称" :label-width="formLabelWidth">
					<el-input
						v-if="this.editStatus"
						v-model="form.name"
						autocomplete="off"
						autofocus="true"
					></el-input>
					<div v-else>{{ form.name }}</div>
				</el-form-item>
				<el-form-item label="事项归档" :label-width="formLabelWidth">
					<el-select
						v-if="this.editStatus"
						v-model="form.archive"
						placeholder="请选择关联项目"
					>
						<el-option
							v-for="(item, index) in archiveList"
							:key="index"
							:label="item.archiveName"
							:value="item.archiveName"
						></el-option>
					</el-select>
					<div v-else>{{ form.archive }}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="$emit('activePanel', false)">取 消</el-button>
				<el-button type="primary" @click="confirmItem">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import ArchiveList from "@/tempdata/archive.json";

export default {
	name: "CreateArchive",
	data() {
		return {
			formLabelWidth: "100px",
			dialogFormVisible: false,
			status: false,
			archiveList: [],
			form: {
				name: "",
				archive: "",
				date1: "",
				date2: "",
				delivery: false,
				type: [],
				resource: "",
				desc: ""
			},
		};
	},
	props: ["addArchiveItemShow","editStatus"],
	created() {
		console.log("-------1",this.editStatus);
		this.archiveList = ArchiveList;
	},
	mounted() {
		console.log("-------", this.editStatus);
		this.archiveList = ArchiveList;
		
	},
	methods: {
		closePanel() {
			this.$emit("activePanel", false);
		},
		confirmItem() {}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.handle {
	margin-right: 0;
}
</style>
