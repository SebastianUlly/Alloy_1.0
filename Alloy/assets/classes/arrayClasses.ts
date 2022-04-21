// @ts-nocheck

import { deepCopy } from './objectClasses'

class CopyArray {
	arrayCopy: {
		position: number
	}[]

	constructor (
		array: {
			position: number
		}[]
	) {
		this.arrayCopy = JSON.parse(JSON.stringify(array))
	}
}

class SortPositionsOfElements extends CopyArray {
	constructor (
		array: {
			position: number
		}[]
	) {
		super(array)
		// checking if not an empty array is passed
		if (array) {
			// sorting the relationshipsInThisElementToThisFile by position
			this.arrayCopy.sort(function (a, b) {
				// checking if the position of element a is null
				if (a.position === null) {
					// if position of element a is null it is sorted behind element b
					return b.position - a.position
				} else {
					return a.position - b.position
				}
			})
			// counter starts at 0
			let counter = 0
			// looping through all the object of the array
			for (const obj of this.arrayCopy) {
				// increasing the counter by one
				counter += 1
				// assinging a new position to the object
				obj.position = counter
			}
		}
	}
}

class ChangePosition extends SortPositionsOfElements {
	constructor (
		array: {
			position: number
		}[],
		positionToMove: number,
		direction: string
	) {
		super(array)
		const elementToMove = this.arrayCopy.find(item => item.position === positionToMove)
		if (direction === 'UP') {
			const elementToMoveDown = this.arrayCopy.find(item => item.position === (positionToMove - 1))
			elementToMoveDown.position += 1
			elementToMove.position -= 1
		} else {
			const elementToMoveUp = this.arrayCopy.find(item => item.position === (positionToMove + 1))
			elementToMoveUp.position -= 1
			elementToMove.position += 1
		}

		// sorting the relationshipsInThisElementToThisFile by position
		this.arrayCopy.sort(function (a, b) {
			// checking if the position of element a is null
			if (a.position === null) {
				// if position of element a is null it is sorted behind element b
				return b.position - a.position
			} else {
				return a.position - b.position
			}
		})
	}
}

// class to check if changes have occured in an array
class CheckForChanges {
	arrayWithChanges: {
		id: string,
		position: number,
		editingParameters: {
			hasChanged: boolean
		}
	}[]

	constructor (
		oldArray: {
			id: string,
			position: number
		}[],
		newArray: {
			id: string,
			position: number,
			editingParameters: {
				hasChanged: boolean
			}
		}[]
	) {
		// checking if the ol and new Array aren't empty
		if (oldArray && newArray) {
			// looping through the new array
			for (const newItem of newArray) {
				// temporarily storing the editingParamters before removing them
				const tempEditingParameters = JSON.parse(JSON.stringify(newItem.editingParameters))
				// removing the editingParameters from the item in the new array
				delete newItem.editingParameters
				// finding the item in the old array belonging to the item in the new array by its id
				const oldItem = oldArray.find(item => item.id === newItem.id)
				// checking if an old item has been found
				if (oldItem) {
					// if an old item has been found:
					// comparing the old item and the new item by converting them to strings
					if (JSON.stringify(newItem) === JSON.stringify(oldItem)) {
						// if the old and the new item are the same (no changes have occured):

						// readding the editingParameters
						newItem.editingParameters = tempEditingParameters
						// and setting the hasChanged property of the editingParameters to false
						newItem.editingParameters.hasChanged = false
					} else {
						// if the old and the new item are not the same (changes have occured):

						// readding the editingParameters
						newItem.editingParameters = tempEditingParameters
						// and setting the hasChanged property of the editingParameters to false
						newItem.editingParameters.hasChanged = true
					}
				} else {
					// if no old item has been found:

					// readding the editingParameters
					newItem.editingParameters = tempEditingParameters
					// and setting the hasChanged property of the editingParameters to true
					newItem.editingParameters.hasChanged = true
				}
			}
			// overwriting the arrayWithChanges of the class with the newArry so it can be called outside the class
			this.arrayWithChanges = newArray
		}
	}
}

class NestedArray extends CopyArray {
	unflattenTree (flatDirectory: object[], idName: string, parentIdName: string) {
		// function to compare the posiition of two objects
		function comparePosition (a: {position: number}, b: {position: number}) {
			const positionA = a.position
			const positionB = b.position

			let comparison = 0
			if (positionA > positionB) {
				comparison = 1
			} else if (positionA < positionB) {
				comparison = -1
			}
			return comparison
		}

		// function to turn a flat tree into a nested tree
		function unflatten (arr: object[]) {
			const tree = []
			const mappedArr: any = {}
			let arrElem: any
			let mappedElem

			// First map the nodes of the array to an object -> create a hash table.
			for (let i = 0, len = arr.length; i < len; i++) {
				arrElem = arr[i]
				mappedArr[arrElem[idName]] = arrElem
				mappedArr[arrElem[idName]].children = []
			}

			for (const id in mappedArr) {
				if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
					mappedElem = mappedArr[id]
					// If the element is not at the root level, add it to its parent array of children.
					if (mappedElem[parentIdName]) {
						if (mappedArr[mappedElem[parentIdName]]) {
							mappedArr[mappedElem[parentIdName]].children.push(mappedElem)
							mappedArr[mappedElem[parentIdName]].children.sort(comparePosition)
						}
					} else { // If the element is at the root level, add it to first level elements array.
						tree.push(mappedElem)
						tree.sort(comparePosition)
					}
				}
			}
			return tree
		}

		const nestedTree = unflatten(flatDirectory)
		return nestedTree
	}

	nestedArray: object[]

	constructor (
		flatArray: {
			id: string,
			parentId: string,
			position: number
		}[],
		idName: string = 'id',
		parentIdName: string = 'parentId'
	) {
		super(flatArray)
		this.nestedArray = this.unflattenTree(this.arrayCopy, idName, parentIdName)
	}
}

export {
	CopyArray,
	SortPositionsOfElements,
	ChangePosition,
	CheckForChanges,
	NestedArray
}
