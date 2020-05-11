<template>
  <div id="dateContainer">
    <header class="header">
      <div class="datebar">
        <span class="normalBtn todayBtn" @click="toToday">今天</span>
        <div class="preMon normalBtn" @click="preMon">上个月</div>
        <div class="thisMon">
          <span v-text="ynow"></span>年 /
          <span v-text="mnow + 1"></span>月
        </div>
        <div class="nextMon normalBtn" @click="nextMon">下个月</div>
      </div>
      <div class="control">
        <div class="normalBtn addArchive" @click="addArchive">
          <i class="el-icon-plus"></i> 创建项目
        </div>
        <div class="normalBtn" @click="() => getWeekReport()">周报</div>
        <div class="normalBtn" @click="() => getMonthReport()">月报</div>
        <el-popover
          placement="bottom"
          title
          width="200"
          effect="light"
          trigger="click"
          content="点我干啥？是不是对我有意思！！！"
        >
          <div class="avater" slot="reference">
            <img src="@/assets/hk.jpg" />
          </div>
        </el-popover>
      </div>
    </header>

    <div class="panel">
      <div class="panelTitle">
        <div class="isRed">星期日</div>
        <div>星期一</div>
        <div>星期二</div>
        <div>星期三</div>
        <div>星期四</div>
        <div>星期五</div>
        <div class="isRed">星期六</div>
      </div>
      <div class="panelContainer">
        <div class="row" v-for="(row, index) in dateArray" :key="index">
          <div
            v-for="(day, index) in row"
            @click="() => InputContent(day)"
            :class="
							day.dateStr === currentDayClass
								? 'day current'
								: 'day'
						"
            :key="day + row + index"
          >
            <span
              v-if="dnow && mnow"
              :class="
								+day.dateStr === dnow &&
								day.monthStr === mnow + 1
									? 'sup today'
									: 'sup'
							"
            >{{ day.dateStr }}</span>
            <div class="list">
              <div
                class="item"
                v-for="(items, index) in day.msgStr"
                :key="index"
                @click="() => changeItem(items, day)"
              >
                <span v-if="items && items.name">
                  {{
                  items.name
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="录入事项"
      :visible.sync="dialogFormVisible"
      :modal="false"
      :show-close="false"
      width="30%"
    >
      <div slot="title" class="dialog-header">
        <div class="tit">{{ editStatus ? "编辑事项" : "事项详情" }}</div>
        <div class="handle">
          <el-tooltip content="编辑" placement="top" effect="light">
            <i v-if="!editStatus" class="el-icon-edit" @click="editStatus = true"></i>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-delete"></i>
          </el-tooltip>
          <el-tooltip content="关闭" placement="top" effect="light">
            <i class="el-icon-close" @click="confirmItem"></i>
          </el-tooltip>
        </div>
      </div>
      <el-form :model="form">
        <el-form-item label="事项名称" :label-width="formLabelWidth">
          <el-input v-if="editStatus" v-model="form.name" autocomplete="off" autofocus="true"></el-input>
          <div v-else>{{ form.name }}</div>
        </el-form-item>
        <el-form-item label="事项归档" :label-width="formLabelWidth">
          <el-select v-if="editStatus" v-model="form.archive" placeholder="请选择关联项目">
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmItem">确 定</el-button>
      </div>
    </el-dialog>
    <ReportPanel
      :reportPanelShow="reportPanelShow"
      :reportPanelType="reportPanelType"
      @activePanel="reportPanelShow = $event"
    ></ReportPanel>
  </div>
</template>

<script>
import JsonHtml from "./data.json";
import ArchiveList from "./archive.json";
import ReportPanel from "../components/ReportPanel";
import "./main.less";

export default {
  data() {
    return {
      newDate: "", //当前的日期的信息
      ynow: "", //当前的年数
      mnow: "", //当前的月份
      dnow: "", //当前的天数
      firstDay: "", //第一天
      firstnow: "", //当前的星期
      m_days: [],
      tr_str: "",
      monthStr: "",
      weekStr: "",
      dateStr: "",
      dateArray: "",
      currentDate: "",
      currentDay: "",
      currentItem: "",
      currentDayClass: null,
      dialogFormVisible: false,
      editStatus: false,
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
      formLabelWidth: "75px",
      reportPanelShow: false,
      reportPanelType: ""
    };
  },
  components: {
    ReportPanel
  },
  mounted() {
    //画出当前的月份的天数对应的表格
    this.getDaysInfo();
    this.archiveList = ArchiveList;
    console.log("mnow", this.mnow, typeof this.mnow + 1 + "月");
    // InputContent() {
    // 	console.log(111)
    // }
    //进行数据的获取，显示到对应的位置
  },
  watch: {
    mnow: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(newVal, oldVal);
      }
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) {
        this.currentDayClass = null;
      }
    }
  },
  methods: {
    getDaysInfo() {
      var _this = this;
      this.sureDate(_this);
    },
    is_leap(year) {
      return year % 100 == 0
        ? year % 400 == 0
          ? 1
          : 0
        : year % 4 == 0
        ? 1
        : 0;
    },
    //下面的是画表格的方法，这个方法会根据数据画出我们需要的表格
    drawTable(jsonHtml) {
      let _this = this;
      var idx = "",
        monthStr = "",
        weekStr = "",
        weekDateStr = "",
        dateStr = "";
      // isRed = "",
      // hasMsg = "";
      let arr = [];
      let msgStr = [];

      for (var i = 0; i < _this.tr_str; i++) {
        arr[i] = [];
        weekStr = i;
        for (var k = 0; k < 7; k++) {
          arr[i][k] = [];
          idx = i * 7 + k;
          weekDateStr = k;
          dateStr = idx - _this.firstnow + 1;
          // 判断date是否超过一个月的边界值
          dateStr <= 0 || dateStr > this.m_days[this.mnow]
            ? (dateStr = "")
            : (dateStr = idx - _this.firstnow + 1);

          arr[i][k] = {
            monthStr,
            dateStr,
            weekStr,
            weekDateStr,
            msgStr: []
          };

          for (let l = 0, len = jsonHtml.length; l < len; l++) {
            if (
              this.mnow === jsonHtml[l].month - 1 &&
              dateStr == jsonHtml[l].date
            ) {
              msgStr = jsonHtml[l].msg;
              monthStr = jsonHtml[l].month;
              arr[i][k] = {
                monthStr,
                weekStr,
                weekDateStr,
                dateStr,
                msgStr
              };
            }
          }
        }
      }
      console.log("---", arr);
      this.dateArray = arr;
    },
    InputContent(e) {
      this.dialogFormVisible = true;
      this.editStatus = true;
      console.log("currentDay", e);
      this.currentDay = e;
      if (this.currentDay.dateStr) {
        this.currentDayClass = this.currentDay.dateStr;
      }
      this.form = {};
    },
    changeItem(items, day) {
      event.stopPropagation(); // 阻止事件冒泡
      // event.preventDefault()
      console.log("items", items, day);
      this.dialogFormVisible = true;
      this.editStatus = false;
      this.currentDay = day;
      this.currentItem = items;
      this.form.name = items.name;
      this.form.archive = items.archive;
    },
    confirmItem() {
      this.currentDayClass = null;
      this.dialogFormVisible = false;
      // console.log(this.form); // name  archive
      // dateStr,msgStr
      const { weekStr, weekDateStr } = this.currentDay;
      const { name, archive } = this.form;
      // console.log(this.editStatus);
      if (this.editStatus && this.currentItem.id && name && archive) {
        const index = this.dateArray[weekStr][weekDateStr]["msgStr"].findIndex(
          item => item.id === this.currentItem.id
        );
        this.dateArray[weekStr][weekDateStr]["msgStr"][index] = {
          id: this.currentItem.id,
          name,
          archive
        };
      } else if (this.editStatus && name && archive) {
        this.dateArray[weekStr][weekDateStr]["msgStr"].push({
          id: Math.floor(Math.random() * 10000),
          name,
          archive
        });
      } else {
        console.log("没有更新");
      }
    },
    toToday() {
      var _this = this;
      this.mnow = this.newDate.getMonth();
      this.sureDate(_this, "now");
    },
    preMon() {
      var _this = this;
      this.mnow--;
      this.sureDate(_this, "up");
    },
    nextMon() {
      var _this = this;
      this.mnow++;
      this.sureDate(_this, "next");
    },
    //两个参数代表的含义分别是this对象以及判断当前的操作是不是在进行月份的修改
    sureDate(_this, other) {
      this.newDate = new Date();
      this.ynow = this.newDate.getFullYear();
      if (!other) {
        this.mnow = this.newDate.getMonth(); //月份
      }
      this.dnow = this.newDate.getDate(); //今日日期
      this.firstDay = new Date(this.ynow, this.mnow, 1);
      this.firstnow = this.firstDay.getDay();
      this.m_days = [
        31,
        28 + this.is_leap(this.ynow),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ];
      this.tr_str = Math.ceil((_this.m_days[this.mnow] + this.firstnow) / 7);
      this.showMsg();
    },
    //通过接口返回的是我们当前的月份对应在日历中需要处理的事项
    showMsg() {
      this.drawTable(JsonHtml);
    },
    getWeekReport() {
      this.reportPanelShow = true;
      this.reportPanelType = "week";
    },
    getMonthReport() {
      this.reportPanelShow = true;
      this.reportPanelType = "month";
    },
    addArchive() {},
    activeReportPanel(data) {
      console.log(data);
      this.reportPanelShow = data;
    }
  }
};
</script>
