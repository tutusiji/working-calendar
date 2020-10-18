
import Vue from 'vue'

function findMatter(state) {
    const { dateStr, monthStr } = state.currentDay
    const key = `${monthStr}-${dateStr}`
    return state.matters.find(item => `${item.month}-${item.date}` === key)
}
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
    setArchivesItem(state, params){
        state.archivesItem = params
        console.log('state', params)
    },
    setArchives(state, archives) {
        state.archives = archives
    },
    addMatter(state, matter){
        const { dateStr, monthStr } = state.currentDay
        let dayMatter = findMatter(state)
        if (!dayMatter) {
            dayMatter = {
                date: dateStr,
                month: monthStr,
                msg: [matter]
            }
            state.currentDay = { dateStr, monthStr, msg: [matter] }
            state.matters = [ ...state.matters, dayMatter]
        } else {
            Vue.set(dayMatter.msg, dayMatter.msg.length, matter)
        }
        state.currentMatter = matter
        
    },
    updateMatters(state, matter) {
        const dayMatter = findMatter(state)
        const index = dayMatter.msg.findIndex(item => item.id === matter.id)
        Vue.set(dayMatter.msg, index > -1 ? index : 0, matter)
    },
}