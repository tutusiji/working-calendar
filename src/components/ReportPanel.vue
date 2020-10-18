<template>
  <div class="reportpanel">
    <el-dialog
      title
      :visible.sync="this.reportPanelShow"
      :close-on-click-modal="false"
      :modal="false"
      :show-close="false"
      width="40%"
    >
      <div slot="title" class="dialog-header">
        <div class="tit">{{ this.reportPanelType === "week" ? "周报" : "月报" }}</div>
        <div class="handle">
          <el-tooltip content="点击复制" placement="top" effect="light">
            <i class="el-icon-document-copy"></i>
          </el-tooltip>
          <el-tooltip content="关闭" placement="top" effect="light">
            <i class="el-icon-close" @click="$emit('activePanel', false)"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="content">123213123213213213</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('activePanel', false)">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ReportPanel",
  data() {
    return {};
  },
  props: ["reportPanelShow", "reportPanelType"],
  created() {},
  mounted() {
    // console.log("-------", this.reportPanelShow, this.reportPanelType);
  },
  methods: {
    closePanel() {
      this.$emit("activePanel", false);
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
