<template>
	<div class="panelContainer">
		<div class="row" v-for="(row, index) in dateArray" :key="index">
			<div
				v-for="(day, index) in row"
				@click="() => addArchiveItem(day)"
				:class="day.dateStr === currentDayClass ? 'day current' : 'day'"
				:key="day + row + index"
			>
				<span
					v-if="dnow && mnow"
					:class="
						+day.dateStr === dnow && day.monthStr === mnow + 1
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
</template>

<script>
// import ReportPanel from "./ReportPanel";
// import CreateArchive from "./CreateArchive";
// import AddArchiveItems from "./AddArchiveItems";
import { getDefaultMatterConfig } from "@/utils";
import { getUserInfo } from '../service/api'
import hkimg from "@/assets/hk.png";
import "../views/main.less";

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
		// ReportPanel,
		// CreateArchive,
		// AddArchiveItems
	},
	async mounted() {
		this.getUserInfo()
		
		await this.$store.dispatch("fetchMatters");
		await this.$store.dispatch("fetchAchives");
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
			console.log("matters ....", this.$store.state.matters);
			return this.$store.state.matters;
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
			this.showMsg();
		}
	},
	methods: {
		getUserInfo(){
			getUserInfo()
			// this.$notify({
            //     title: '成功',
            //     message: '这是一条成功的提示消息',
            //     // type: 'success'
            //   });
		},
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
		
		// 点击面板
		addArchiveItem(e) {
			this.$store.commit("setArchivesItem", { show: true, edit: true });
			// this.currentDay = e;
			if (this.currentDay.dateStr) {
				this.currentDayClass = this.currentDay.dateStr;
			}
			this.$store.commit("setCurrentDay", e);
			this.$store.commit("addMatter", getDefaultMatterConfig());
			// this.form = {};
		},
		// 点击面板 里面的 单条
		changeItem(items, day) {
			event.stopPropagation(); // 阻止事件冒泡
			// event.preventDefault()
			console.log("items", items, day);
			this.editStatus = true;
			this.currentDay = day;
			this.currentItem = items;
			this.form.name = items.name;
			this.form.archive = items.archive;
			this.$store.commit("setCurrentDay", day);
			this.$store.commit("setCurrentMatter", items);
		},
		//下面的是画表格的方法，这个方法会根据数据画出我们需要的表格
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
			// console.log("---", arr);
			this.dateArray = arr;
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
			this.drawTable(this.matters);
		}
	}
};
</script>
