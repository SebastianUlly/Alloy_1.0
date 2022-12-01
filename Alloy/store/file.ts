import Vue from 'vue'

export const state = () => ({
	values: {},
	data: [],
	valuesToSave: {},
	dataToSave: [],
	fileList: [],
	isInputOk: []
})

export const mutations = {
	setFile (state: object, fileData: { id: string, schemaId: number, label: string, parentIds: string[], data: object[] }) {
		const values = {
			id: fileData.id,
			label: fileData.label,
			parentIds: fileData.parentIds
		}

		Vue.set(state, 'values', values)
		Vue.set(state, 'data', fileData.data)
	},

	resetFile (state: object, fileId: string) {
		const values = {
			id: fileId,
			label: '',
			parentIds: []
		}

		Vue.set(state, 'values', values)
		Vue.set(state, 'data', [])
	},

	setFileIdToEnteredValues (state: { valuesToSave: { fileId: string } }, fileId: string) {
		state.valuesToSave.fileId = fileId
	},

	setFileNameToEnteredValues (state: { valuesToSave: { label: string } }, fileName: string) {
		state.valuesToSave.label = fileName
	},

	setParentIdsToEnteredValues (state: { valuesToSave: { parentIds: string[] } }, parentIds: string[]) {
		state.valuesToSave.parentIds = parentIds
	},

	setSchemaIdToEnteredValues (state: { valuesToSave: { schemaId: string } }, schemaId: string) {
		state.valuesToSave.schemaId = schemaId
	},

	setEnteredData (state: { dataToSave: { elementId: string, data: any }[] }, payload: { elementId: string, data: any}) {
		const arrayToSave = state.dataToSave
		const element = arrayToSave.find(item => item.elementId === payload.elementId)
		if (element) {
			element.data = payload.data
		} else {
			state.dataToSave.push(payload)
		}
	},

	resetEnteredData (state: { dataToSave: object[] }) {
		state.dataToSave = []
	},

	setFileList (state: { fileList: object[] }, fileListToSet: object[]) {
		Vue.set(state, 'fileList', fileListToSet)
	},
	setIsInputOk (state: { isInputOk : {elementId: string, value: boolean}[] }, payload: {elementId: string, value: boolean} ){
		//state.isInputOk.map(element => payload.find(payloadelement => payloadelement.elementId === element.elementId) || payloadelement)

		if(!state.isInputOk.find(item => item.elementId == payload.elementId)){
			state.isInputOk.push(payload)
		}
		else {
			let inputElement = state.isInputOk.find(item => item.elementId === payload.elementId)!
			inputElement.value = payload.value
		}
		//console.log(state)
		
	}
}

export const getters = {
	getFileValues (state: { values: object }) {
		return state.values
	},

	getFileData (state: { data: object[] }) {
		return state.data
	},

	getDataToSave (state: { dataToSave: object[] }) {
		return state.dataToSave
	},

	getValuesToSave (state: { valuesToSave: object[] }) {
		return state.valuesToSave
	},

	getFileList (state: { fileList: object[] }) {
		return state.fileList
	},
	getReadyToSave (state: { isInputOk: {elementId: string, value: boolean}[]}){
		return state.isInputOk.every(element => element.value === true);
	}
}
