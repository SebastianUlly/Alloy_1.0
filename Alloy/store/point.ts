import Vue from 'vue'

export const state = () => ({
    pointList:[],
    autoFillId:''
})


export const mutations = {
    setPointList (state: {pointList: object[]}, pointListToSet: object[]) {
        Vue.set(state, 'pointList', pointListToSet)
    },
    setAutoFillId (state: {autoFillId: string}, idToSet: string) {
        Vue.set(state, 'autoFillId', idToSet )
    }
}

export const getters = {
    getPointList (state: {pointList: object[] }){
        return state.pointList
    },
    getAutoFillId (state: {autoFillId: string}){
        return state.autoFillId
    }
}


