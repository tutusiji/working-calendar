

// 更新数据
export default {
    setProject( state) {
        console.log(state)
    },
    setMatters(state, matters) {
        state.matters = matters
    },
    setCurrentMatter(state, currentMatter) {
        state.currentMatter = currentMatter
    },
    setCurrentDay(state, currentDay) {
        state.currentDay = currentDay
    },
    setArchives(state, archives) {
        state.archives = archives
    },
}