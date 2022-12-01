import Vue from 'vue'

export const state = () => ({
    pointList:[]
})


export const mutations = {
    setPointList (state: {pointList: object[]}, pointListToSet: object[]) {
        Vue.set(state, 'pointList', pointListToSet)
    }
}


export const getters = {
    getPointList (state: {pointList: object[] }){
        return state.pointList
    }
}


