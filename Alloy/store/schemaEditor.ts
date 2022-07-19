import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const state = () => ({
	schemaId: '',
	schemaLabel: '',
	schemaMetadata: [],
	schemaElements: [],
	schemaLayout: [],
	elementIdToEdit: '',
	elementToEdit: null
})

export const mutations = {
	setNewSchema (
		state: {
			schemaId: string,
			schemaLabel: string,
			schemaMetadata: object[],
			schemaElements: object[],
			schemaLayout: object[]
		}
	) {
		const metadata = {
			"group": "",
			"isLeaf": true,
			"metadata_elements": [
				{
					"label": "",
					"parentId": 0,
					"position": 1,
					"variable": "id",
					"elementId": "2ca1c114-cd2e-49ad-97f6-699985b552a0",
					"componentId": "fileId",
					"validations": {}
				},
				{
					"label": "FileId",
					"parentId": "2ca1c114-cd2e-49ad-97f6-699985b552a0",
					"position": 1,
					"elementId": "86fe6096-50dc-4cb6-82e3-a0e94675f742",
					"parameters": {
						"editable": false
					},
					"componentId": "inputField",
					"validations": {}
				},
				{
					"label": "",
					"parentId": 0,
					"position": 2,
					"variable": "fileName",
					"elementId": "09eb3dc8-4ff3-41c1-9cfd-d8f439d1e2e8",
					"componentId": "fileName",
					"validations": {}
				},
				{
					"label": "",
					"parentId": "09eb3dc8-4ff3-41c1-9cfd-d8f439d1e2e8",
					"position": 1,
					"elementId": "75e96f94-0103-4804-abc0-5331ea980e9b",
					"parameters": {
						"default": "function_consecutiveNumber",
						"required": true
					},
					"componentId": "inputField",
					"validations": {}
				}
			]
		}
		Vue.set(state, 'schemaId', uuidv4())
		Vue.set(state, 'schemaLabel', '')
		Vue.set(state, 'schemaMetadata', metadata)
		Vue.set(state, 'schemaElements', [])
		Vue.set(state, 'schemaLayout', [])
	},

	setSchemaId (
		state: {
			schemaId: string
		},
		schemaId: string,
	) {
		Vue.set(state, 'schemaId', schemaId)
	},

	setSchemaLabel (
		state: {
			schemaLabel: string
		},
		schemaLabel: string
	) {
		Vue.set(state, 'schemaLabel', schemaLabel)
	},

	setSchemaGroup (
		state: {
			schemaMetadata: {
				group: string
			}
		},
		schemaGroup: string
	) {
		state.schemaMetadata.group = schemaGroup
	},

	setSchemaLeafValue (
		state: {
			schemaMetadata: {
				isLeaf: boolean
			}
		},
		isLeaf: boolean
	) {
		state.schemaMetadata.isLeaf = isLeaf
	},

	setSchemaMetadata (
		state: {
			schemaMetadata: object[],
		},
		schemaMetadata: object[]
	) {
		Vue.set(state, 'schemaMetadata', schemaMetadata)
	},

	setSchemaElements(
		state: {
			schemaElements: object[]
		},
		schemaElements: object[]
	) {
		Vue.set(state, 'schemaElements', schemaElements)
	},

	setSchemaLayout (
		state: {
			schemaLayout: object[]
		},
		schemaLayout: object[]
	) {
		Vue.set(state, 'schemaLayout', schemaLayout)
	},

	addNewElement (
		state: {
			schemaElements: object[]
		},
		newElement: object[]
	) {
		let elementsArray = JSON.parse(JSON.stringify(state.schemaElements))
		for (const item of newElement) {
			elementsArray.push(item)
		}

		Vue.set(state, 'schemaElements', elementsArray)
	},

	setElementIdToEdit (
		state: {
			elementIdToEdit: String,
			elementToEdit: {
				elementId: String,
				label: String,
				position: Number,
				parentId: String,
				parameters: Object
			},
			schemaElements: {
				elementId: String,
				label: String,
				position: Number,
				parentId: String,
				parameters: Object
			}[]
		},
		elementId: String
	) {
		Vue.set(state, 'elementIdToEdit', elementId)

		const element = state.schemaElements.find(item => item.elementId === elementId)
		Vue.set(state, 'elementToEdit', element)
	},

	moveElementByElementId (
		state: {
			schemaElements: {
				elementId: String,
				position: Number,
				parentId: Number
			} []
		},
		payload: {
			elementId: String,
			direction: String
		}
	) {
		console.log(payload.elementId, payload.direction)

		let elementToMove = state.schemaElements.find(item => item.elementId === payload.elementId)
		
		console.log(elementToMove?.position)
		if (payload.direction === 'up') {
			const elementForcedToMove = state.schemaElements.find(item => item.position === (elementToMove?.position - 1) && item.parentId === 0)
			console.log(elementForcedToMove?.position)
			elementToMove?.position -= 1
			elementForcedToMove?.position += 1
		} else if (payload.direction === 'down') {
			const elementForcedToMove = state.schemaElements.find(item => item.position === (elementToMove?.position + 1) && item.parentId === 0)
			console.log(elementForcedToMove?.position)
			elementToMove?.position += 1
			elementForcedToMove?.position -= 1
		}
	},

	setLabelOfElement (
		state: {
			schemaElements: {
				label: String,
				elementId: String
			} [],
			elementIdToEdit: String
		},
		label: String
	) {
		const elementToEdit = state.schemaElements.find(item => item.elementId === state.elementIdToEdit)
		console.log(elementToEdit)
		
		elementToEdit?.label = label
	},

	setParametersOfElement (
		state: {
			schemaElements: {
				label: String,
				elementId: String
			} [],
			elementIdToEdit: String
		},
		payload: object
	) {
		const elementToEdit = state.schemaElements.find(item => item.elementId === state.elementIdToEdit)
		console.log(elementToEdit)
		
		elementToEdit?.parameters = payload
	}
}

export const getters = {
	getSchema (
		state: {
			schemaId: string,
			schemaLabel: string,
			schemaMetadata: object[],
			schemaElements: object[],
			schemaLayout: object[]
		}
	) {
		return state
	},

	getSchemaId (
		state: {
			schemaId: string
		}
	) {
		return state.schemaId
	},

	getSchemaLabel (
		state: {
			schemaLabel: string
		}
	) {
		return state.schemaLabel
	},

	getSchemaMetadata (
		state: {
			schemaMetadata: object[]
		}
	) {
		return state.schemaMetadata
	},

	getSchemaElements (
		state: {
			schemaElements: object[]
		}
	) {
		return state.schemaElements
	},

	getSchemaLayout (
		state: {
			schemaLayout: object[]
		}
	) {
		return state.schemaLayout
	},

	getElementIdToEdit (
		state: {
			elementIdToEdit: String
		}
	) {
		return state.elementIdToEdit
	},

	getElementToEdit (
		state: {
			elementToEdit: {
				elementId: String,
				label: String,
				position: Number,
				parentId: String,
				parameters: Object
			},
		}
	) {
		return state.elementToEdit
	}
}
