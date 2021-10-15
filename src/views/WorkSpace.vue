<template>
	<div id="dateContainer">
		<header class="header">
			<div class="sidebtn" @click="sideOpenClick">
				<svg focusable="false" viewBox="0 0 24 24">
					<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
				</svg>
			</div>
			<div class="logobox">
				<img
					class="logo"
					src="@/assets/logo.png"
					alt="WeNotes"
					aria-hidden="true"
					style="width:40px;height:40px"
				/>
				<span v-text="dnow" class="num"></span>
				<span class="txt"><b>W</b><i>e</i>Notes</span>
			</div>

			<div class="datebar">
				<span class="normalBtn todayBtn" @click="toToday">今天</span>
				<div class="preMon normalBtn" @click="preMon">＜</div>
				<div class="thisMon">
					<span v-text="ynow"></span>年/<span v-text="mnow + 1"></span>月
				</div>
				<div class="nextMon normalBtn" @click="nextMon">＞</div>
			</div>

			<div class="dataControl">
				<div class="viewControl">
					<el-radio-group v-model="radio1" size="medium">
						<el-tooltip
							content="月视图"
							placement="left"
							effect="light"
						>
							<el-radio-button label="我的工作"
								><i class="el-icon-date"></i>
								我的工作</el-radio-button
							>
						</el-tooltip>
						<el-tooltip
							content="月视图"
							placement="bottom"
							effect="light"
						>
							<el-radio-button label="项目归档"
								><i class="el-icon-s-grid"></i>
								项目归档</el-radio-button
							>
						</el-tooltip>
						<el-tooltip
							content="周视图"
							placement="right"
							effect="light"
						>
							<el-radio-button label="团队归档">
								<i class="el-icon-notebook-2"></i> 团队归档
							</el-radio-button>
						</el-tooltip>
					</el-radio-group>
				</div>
				<div class="normalBtn addArchive" @click="createArchive">
					<i class="el-icon-plus"></i> 创建归档
				</div>
				<el-dropdown>
					<div class="normalBtn">
					<b>We</b>数据<i
							class="el-icon-arrow-down el-icon--right"
						></i>
					</div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item
							><div
								class="normalBtn"
								@click="() => getWeekReport()"
							>
								周报
							</div></el-dropdown-item
						>
						<el-dropdown-item
							><div
								class="normalBtn"
								@click="() => getMonthReport()"
							>
								月报
							</div></el-dropdown-item
						>
						<el-dropdown-item
							><div class="normalBtn">年报</div></el-dropdown-item
						>
						<!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item> -->
						<el-dropdown-item divided>项目汇总</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-popover
					placement="bottom"
					title
					width="200"
					effect="light"
					trigger="click"
					content="点我干啥？^_^！！！"
				>
					<div class="avater" slot="reference">
						<img src="@/assets/hk.png" />
					</div>
				</el-popover>
			</div>
		</header>
		<div class="mainbox">
			<div :class="sideOpen ? 'sidebar open' : 'sidebar'">
				<div class="archive-wrap">
					<div class="archive-header">
						<i class="el-icon-s-data"></i> 归档总览
					</div>
					<div class="archive-content">
						<el-tree
							:data="data2"
							show-checkbox
							node-key="id"
							:default-expanded-keys="[1, 2, 3, 4, 5]"
							:default-checked-keys="[1, 2, 3, 4, 5]"
							:props="defaultProps2"
						>
						</el-tree>
					</div>
					<el-divider></el-divider>
					<div class="thisData">
						<dl>
							<dt>
								<i class="el-icon-s-unfold"></i>
								当前表格数据为：
							</dt>
							<dd>
								<ul>
									<li>深圳项目</li>
									<li>i深圳运营后台</li>
									<li>i深圳app端</li>
									<li>i深圳微信小程序</li>
									<li>i深圳支付宝小程序</li>
									<li>i深圳开放平台</li>
									<li>i深圳口罩预约项目</li>
								</ul>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			<TeamList />
			<div class="panel">
				<div class="panelTitle">
					<div>星期一</div>
					<div>星期二</div>
					<div>星期三</div>
					<div>星期四</div>
					<div>星期五</div>
					<div class="isRed">星期六</div>
					<div class="isRed">星期日</div>
				</div>
				<Calendar ref="cals" :dataMonth="dataMonth"></Calendar>
			</div>
		</div>

		<!-- 报告面板 -->
		<ReportPanel
			:reportPanelShow="reportPanelShow"
			:reportPanelType="reportPanelType"
			@activePanel="reportPanelShow = $event"
		></ReportPanel>
		<!-- 创建归档 -->
		<CreateArchive
			:createArchiveShow="createArchiveShow"
			@activePanel="createArchiveShow = $event"
		></CreateArchive>
		<!-- 录入事项 -->
		<AddArchiveItems
			:addArchiveItemShow="this.archivesItem.show"
			:editStatus="this.archivesItem.edit"
			:name="this.currentMatter.name"
		></AddArchiveItems>
		<!-- @activePanel="this.$store.state.archivesItem.show = $event" -->
	</div>
</template>

<script>
// import JsonHtml from "../tempdata/data.json";
import Calendar from "../components/Calendar";
import ReportPanel from "../components/ReportPanel";
import CreateArchive from "../components/CreateArchive";
import AddArchiveItems from "../components/AddArchiveItems";
import TeamList from "../components/TeamList";
// import { getDefaultMatterConfig } from "../utils";
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
			editStatus: false,
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
			reportPanelType: "",
			createArchiveShow: false,
			sideOpen: true,
			value1: false,
			value2: false,
			dataMonth:null,
			defaultProps: {
				children: "children",
				label: "label"
			},
			defaultProps2: {
				children: "children",
				label: "label"
			},
			data2: [
				{
					id: 1,
					label: "一级 1",
					children: [
						{
							id: 4,
							label: "二级 1-1",
							children: [
								{
									id: 9,
									label: "三级 1-1-1"
								},
								{
									id: 10,
									label: "三级 1-1-2"
								}
							]
						}
					]
				},
				{
					id: 2,
					label: "一级 2",
					children: [
						{
							id: 5,
							label: "二级 2-1"
						},
						{
							id: 6,
							label: "二级 2-2"
						}
					]
				},
				{
					id: 3,
					label: "一级 3",
					children: [
						{
							id: 7,
							label: "二级 3-1"
						},
						{
							id: 8,
							label: "二级 3-2"
						}
					]
				}
			],

			radio1: "我的工作"
		};
	},
	components: {
		Calendar,
		ReportPanel,
		CreateArchive,
		AddArchiveItems,
		TeamList
	},
	async mounted() {
		// 页面加载时执行
		this.init();
	},
	computed: {
		currentMatter() {
			return this.$store.state.currentMatter;
		},
		archivesItem() {
			return this.$store.state.archivesItem;
		}
	},
	watch: {
		mnow: function(newVal, oldVal) {
			if (newVal !== oldVal) {
				// console.log(newVal, oldVal);
			}
		}
	},
	methods: {
		init() {
			this.newDate = new Date();
			this.ynow = this.newDate.getFullYear();
			// if (!other) {
			// 	this.mnow = this.newDate.getMonth(); //月份
			// }
			this.mnow = this.newDate.getMonth(); //月份
			this.dnow = this.newDate.getDate(); //今日日期
			this.firstDay = new Date(this.ynow, this.mnow, 1);
			this.firstnow = this.firstDay.getDay();
		},
		toToday() {
			var _this = this;
			this.mnow = this.newDate.getMonth();
			// this.sureDate(_this, "now");
			this.$refs.cals.sureDate(_this, "now");
		},
		preMon() {
			var _this = this;
			if( this.mnow === 0) return
			this.mnow--;
			this.$refs.cals.sureDate(_this, "up");
		},
		nextMon() {
			var _this = this;
			if( this.mnow === 11) return
			this.mnow++;
			this.$refs.cals.sureDate(_this, "next");

		},
		// 两个参数代表的含义分别是this对象以及判断当前的操作是不是在进行月份的修改
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
			this.tr_str = Math.ceil(
				(_this.m_days[this.mnow] + this.firstnow) / 7
			);
			this.showMsg();
		},
		getWeekReport() {
			this.reportPanelShow = true;
			this.reportPanelType = "week";
		},
		getMonthReport() {
			this.reportPanelShow = true;
			this.reportPanelType = "month";
		},
		createArchive() {
			this.createArchiveShow = true;
		},
		activeReportPanel(data) {
			console.log(data);
			this.reportPanelShow = data;
		},
		sideOpenClick() {
			if (this.sideOpen) {
				this.sideOpen = false;
			} else {
				this.sideOpen = true;
			}
		}
	}
};
</script>
