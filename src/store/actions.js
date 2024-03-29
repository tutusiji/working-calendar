import data from "../tempdata/data.json"
import ArchiveList from "@/tempdata/archive.json"

// 触发数据更新

export default {
    async saveProject({ state, commit, dispatch }) {
        console.log(state, commit, dispatch)
    },
    async fetchMatters({ commit }) {
        const result = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(data)
            }, 300)
        })
        commit("setMatters", result)
    },
    async fetchAchives({ commit }) {
        const result = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(ArchiveList)
            }, 300)
        })
        commit("setArchives", result)
    },
}