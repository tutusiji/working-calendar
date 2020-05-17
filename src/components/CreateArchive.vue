<template>
	<div class="archiveShow">
		<el-dialog
			title
			:visible.sync="this.createArchiveShow"
			:close-on-click-modal="false"
			:modal="false"
			:show-close="false"
			width="40%"
		>
			<div slot="title" class="dialog-header">
				<div class="tit">创建【项目 / 团队】 归档</div>
				<div class="handle">
					<!-- <el-tooltip content="点击复制" placement="top" effect="light">
            <i class="el-icon-document-copy"></i>
          </el-tooltip> -->
					<el-tooltip content="关闭" placement="top" effect="light">
						<i
							class="el-icon-close"
							@click="$emit('activePanel', false)"
						></i>
					</el-tooltip>
				</div>
			</div>
			<div class="content">
				<el-form :model="form">
					<el-form-item
						label="一级归档名称"
						:label-width="formLabelWidth"
					>
						<el-input
							v-model="form.name"
							autocomplete="off"
							autofocus="true"
							placeholder="主名称，必填"
						></el-input>
					</el-form-item>
					<el-form-item
						label="二级归档名称"
						:label-width="formLabelWidth"
					>
						<el-input
							v-model="form.name"
							autocomplete="off"
							autofocus="true"
							placeholder="若无子项目/团队，可以不填"
						></el-input>
					</el-form-item>
					<el-form-item
						label="三级归档名称"
						:label-width="formLabelWidth"
					>
						<el-input
							v-model="form.name"
							autocomplete="off"
							autofocus="true"
							placeholder="若无子项目/团队，可以不填"
						></el-input>
					</el-form-item>
				</el-form>
				<el-row type="flex" class="row-bg" justify="center">
					<el-button @click="$emit('activePanel', false)"
						><i class="el-icon-plus"></i> 增加子归档</el-button
					>
				</el-row>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="$emit('activePanel', false)"
					>取 消</el-button
				>
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
			archiveList: []
		};
	},
	props: ["createArchiveShow"],
	created() {},
	mounted() {
		console.log("-------", this.createArchiveShow);
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
