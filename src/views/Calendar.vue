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
					alt="工作日历"
					aria-hidden="true"
					style="width:40px;height:40px"
				/>
				<span v-text="dnow" class="num"></span>
				<span class="txt">工作日历</span>
			</div>

			<div class="datebar">
				<span class="normalBtn todayBtn" @click="toToday">今天</span>
				<div class="preMon normalBtn" @click="preMon">上个月</div>
				<div class="thisMon">
					<span v-text="ynow"></span>年/
					<span v-text="mnow + 1"></span>月
				</div>
				<div class="nextMon normalBtn" @click="nextMon">下个月</div>
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
				<div class="normalBtn" @click="() => getWeekReport()">周报</div>
				<div class="normalBtn" @click="() => getMonthReport()">
					月报
				</div>
				<div class="normalBtn">年报</div>
				<el-popover
					placement="bottom"
					title
					width="200"
					effect="light"
					trigger="click"
					content="点我干啥？是不是对我有意思！！！"
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
							<dt><i class="el-icon-s-unfold"></i> 当前表格数据为：</dt>
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
			<div class="team-list">
				<div class="team-title">
					参与人
				</div>
				<div class="team-content">
					<div
						class="row"
						v-for="(row, index) in teamList"
						:key="index"
					>
						<img v-bind:src="row.avater" alt="">
						{{ row.name }}
					</div>
				</div>
			</div>
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
				<div class="panelContainer">
					<div
						class="row"
						v-for="(row, index) in dateArray"
						:key="index"
					>
						<div
							v-for="(day, index) in row"
							@click="() => addArchiveItem(day)"
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
								>{{ day.dateStr }}</span
							>
							<div class="list">
								<div
									class="item"
									v-for="(items, index) in day.msgStr"
									:key="index"
									@click="() => changeItem(items, day)"
								>
									<span v-if="items && items.name">
										{{ items.name }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
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
			:addArchiveItemShow="addArchiveItemShow"
			:editStatus = 'editStatus'
			:name = 'this.currentMatter.name'
			@activePanel="addArchiveItemShow = $event"
		></AddArchiveItems>
	</div>
</template>

<script>
// import JsonHtml from "../tempdata/data.json";
// import ArchiveList from "../tempdata/archive.json";
import ReportPanel from "../components/ReportPanel";
import CreateArchive from "../components/CreateArchive";
import AddArchiveItems from "../components/AddArchiveItems";
import { getDefaultMatterConfig } from '../utils'
import hkimg from "@/assets/hk.png";
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
			reportPanelType: "",
			createArchiveShow: false,
			addArchiveItemShow: false,
			sideOpen: true,
			value1: false,
			value2: false,
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
			teamList: [
				{
					avater: hkimg,
					name: "金城武001",
					id: "jinchengwu001"
				},
				{
					avater: hkimg,
					name: "金城武002",
					id: "jinchengwu002"
				},
				{
					avater: hkimg,
					name: "金城武003",
					id: "jinchengwu003"
				},
				{
					avater: hkimg,
					name: "金城武004",
					id: "jinchengwu04"
				}
			],
			radio1: "我的工作"
		};
	},
	components: {
		ReportPanel,
		CreateArchive,
		AddArchiveItems
	},
	async mounted() {
		await this.$store.dispatch('fetchMatters')
		await this.$store.dispatch('fetchAchives')
		//画出当前的月份的天数对应的表格
		this.getDaysInfo();
		this.archiveList = this.$store.state.archives;
		console.log("mnow", this.mnow, typeof this.mnow + 1 + "月");
		// InputContent() {
		// 	console.log(111)
		// }
		//进行数据的获取，显示到对应的位置
	},
	computed: {
		matters() {
			console.log('matters ....', this.$store.state.matters)
			return this.$store.state.matters
		},
		currentMatter() {
			return this.$store.state.currentMatter
		}
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
		},
		matters: function() {
			this.showMsg()
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
			// hasMsg = ""
			let arr = [];
			let msgStr = [];

			for (var i = 0; i < _this.tr_str; i++) {
				arr[i] = [];
				weekStr = i;
				for (var k = 0; k < 7; k++) {
					arr[i][k] = [];
					idx = i * 7 + k + 1;
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
		addArchiveItem(e) {
			this.addArchiveItemShow = true;
			this.editStatus = true;
			// this.currentDay = e;
			if (this.currentDay.dateStr) {
				this.currentDayClass = this.currentDay.dateStr;
			}
			this.$store.commit('setCurrentDay', e)
			this.$store.commit('addMatter', getDefaultMatterConfig())
			// this.form = {};
		},
		changeItem(items, day) {
			event.stopPropagation(); // 阻止事件冒泡
			// event.preventDefault()
			console.log("items", items, day);
			this.addArchiveItemShow = true;
			this.editStatus = true;
			this.currentDay = day;
			this.currentItem = items;
			this.form.name = items.name;
			this.form.archive = items.archive;
			this.$store.commit('setCurrentDay', day)
			this.$store.commit('setCurrentMatter', items)
		},
		confirmItem() {
			this.currentDayClass = null;
			this.dialogFormVisible = false;
			// console.log(this.form) // name  archive
			// dateStr,msgStr
			const { weekStr, weekDateStr } = this.currentDay;
			const { name, archive } = this.form;
			// console.log(this.editStatus)
			if (this.editStatus && this.currentItem.id && name && archive) {
				const index = this.dateArray[weekStr][weekDateStr][
					"msgStr"
				].findIndex(item => item.id === this.currentItem.id);
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
			this.tr_str = Math.ceil(
				(_this.m_days[this.mnow] + this.firstnow) / 7
			);
			this.showMsg();
		},
		//通过接口返回的是我们当前的月份对应在日历中需要处理的事项
		showMsg() {
			this.drawTable(this.matters)
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
