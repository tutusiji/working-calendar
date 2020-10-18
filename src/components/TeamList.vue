<template>
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
					<img v-bind:src="row.avater" alt="" />
					{{ row.name }}
				</div>
			</div>
		</div>
</template>

<script>
// import ArchiveList from "./archive.json";
import hkimg from "@/assets/hk.png";

export default {
	name: "TeamList",
	data() {
		return {
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
			]
		};
	},
	props: [],
	created() {},
	mounted() {
		
	},
	methods: {
	
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
