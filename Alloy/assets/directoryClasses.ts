// @ts-nocheck

import { v4 as uuidv4 } from 'uuid'

class MainDirectory {
	constructor (
		rawDirectory: {
			fileId: string,
			label: string,
			schemaId: string,
			isLeaf: boolean
		}[],
		files: {
			fileId: string,
			label: string,
			schemaId: string
		}[],
		schemes: {
			id: string,
			metadata: {
				isLeaf: boolean
			}
		}[]
	) {
		// looping through the raw (flat) directory
		for (const entry of rawDirectory) {
			// looping through all the files
			for (const file of files) {
				// checking if the fileId of the file and the fileId in the directory-entry match
				if (entry.fileId === file.fileId) {
					// adding the necessary data-fileds to the directory-entry
					entry.label = file.label
					entry.name = file.label
					entry.schemaId = file.schemaId
					// looping through the schemas to get the correct schemaId to the directory-entry
					for (const schema of schemes) {
						if (file.schemaId === schema.id) {
							entry.isLeaf = schema.metadata.isLeaf
						}
					}
				}
			}
		}
		return rawDirectory
	}
}

class DirectoryImage {
	directoryCopy: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[]

	constructor (storeDirectory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[]
	) {
		// creating a copy of the directory in the store
		this.directoryCopy = JSON.parse(JSON.stringify(storeDirectory))
	}
}

class NestedDirectory extends DirectoryImage {
	unflattenTree (flatDirectory: object[]) {
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
				mappedArr[arrElem.id] = arrElem
				mappedArr[arrElem.id].children = []
			}

			for (const id in mappedArr) {
				if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
					mappedElem = mappedArr[id]
					// If the element is not at the root level, add it to its parent array of children.
					if (mappedElem.parentId) {
						if (mappedArr[mappedElem.parentId]) {
							mappedArr[mappedElem.parentId].children.push(mappedElem)
							mappedArr[mappedElem.parentId].children.sort(comparePosition)
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
}

class OrphanedFiles extends DirectoryImage {
	orphanedFiles: {
		id: string,
		fileId: string,
		schemaId: string,
		label: string,
		isLeaf: boolean
	}[]

	constructor (
		storeDirectory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[],
		files: {
			id: string,
			fileId: string,
			label: string
			schemaId: string,
			isLeaf: boolean
		}[],
		schema: {
			id: string,
			metadata: {
				isLeaf: boolean
			}
		}[]
	) {
		super(storeDirectory)
		const directoryString = JSON.stringify(this.directoryCopy)
		this.orphanedFiles = []

		for (const file of files) {
			if (!directoryString.includes(file.fileId)) {
				file.id = file.fileId
				const schemaToFile = schema.find(item => item.id === file.schemaId)!
				file.isLeaf = schemaToFile.metadata.isLeaf
				this.orphanedFiles.push(file)
			}
		}
	}
}

class EditEntity extends DirectoryImage {
	changeVisibility (id: string) {
		const entityInDirectoryCopy = this.directoryCopy.find(item => item.id === id)!
		entityInDirectoryCopy.isVisible = !entityInDirectoryCopy.isVisible
	}

	changeName (fileId: string, newLabel: string) {
		const entitiesInDirectoryCopy = this.directoryCopy.filter(item => item.fileId === fileId)
		for (const entity of entitiesInDirectoryCopy) {
			entity.label = newLabel
		}
	}
}

class ParentOfEntity extends DirectoryImage {
	getParentOfEntity (
		entity: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}
	) {
		if (entity.parentId) {
			const parent = this.directoryCopy.find(item => item.id === entity.parentId)
			return parent
		} else {
			const entityById = this.directoryCopy.find(item => item.id === entity.id)!
			const parent = this.directoryCopy.find(item => item.id === entityById.parentId)
			return parent
		}
	}

	getAllParentsToFile (id: string) {
		const entityArray = this.directoryCopy.filter(item => item.fileId === id)
		const arrayOfParentIds = []
		for (const entity of entityArray) {
			arrayOfParentIds.push(entity.parentId)
		}
		const arrayOfParents = []
		if (arrayOfParentIds.length > 0) {
			for (const parentId of arrayOfParentIds) {
				const parent = this.directoryCopy.find(item => item.id === parentId)
				if (parent) {
					arrayOfParents.push(parent.id)
				}
			}
		}
		return arrayOfParents
	}
}

class MoveEntityInBranch extends DirectoryImage {
	// function to move an entity down in the directory (down meaning back in the array / visually "down" on the website)
	moveDown (id: string) {
		// to find the entity that has to be moved down in the copy of the directory in the store
		const entityToBeMovedDown = this.directoryCopy.find(item => item.id === id)!
		// to find the sibling that has to be moved up in the copy of the directory in the store
		const siblingToMoveUp = this.directoryCopy.find(item => item.parentId === entityToBeMovedDown.parentId && item.position === (entityToBeMovedDown.position + 1))
		// checking if a sibling at the required position exists (not able to move an entity beyond the array it belongs to)
		// changing the position parameter of the two entities to be moved
		if (siblingToMoveUp) {
			// changing the position parameter of the two entities to be moved
			entityToBeMovedDown.position = entityToBeMovedDown.position + 1
			siblingToMoveUp.position = siblingToMoveUp.position - 1
		}
	}

	// function to move an entity up in the directory (up meaning forward in the array / visually "up" on the website)
	moveUp (id: string) {
		// to find the entity that has to be moved up in the copy of the directory in the store
		const entityToBeMovedDown = this.directoryCopy.find(item => item.id === id)!
		// to find the sibling that has to be moved down in the copy of the directory in the store
		const siblingToMoveUp = this.directoryCopy.find(item => item.parentId === entityToBeMovedDown.parentId && item.position === (entityToBeMovedDown.position - 1))
		// checking if a sibling at the required position exists (not able to move an entity beyond the array it belongs to)
		if (siblingToMoveUp) {
			// changing the position parameter of the two entities to be moved
			entityToBeMovedDown.position = entityToBeMovedDown.position - 1
			siblingToMoveUp.position = siblingToMoveUp.position + 1
		}
	}
}

class DeleteEntityInBranch extends DirectoryImage {
	arrayWithDeletedEntity: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[]

	constructor (
		storeDirectory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[],
		id: string) {
		super(storeDirectory)
		this.arrayWithDeletedEntity = this.directoryCopy.filter(item => item.id !== id)

		// return arrayWithDeletedEntity
	}
}

// #############

function getAncestors (
	directory: {
		id: string,
		parentId: string
	}[], parentId: string, ancestorArray: object[]) {
	const parent = directory.find(item => item.id === parentId)!
	ancestorArray.push(parent)
	if (parent.parentId.toString() !== '0') {
		getAncestors(directory, parent.parentId, ancestorArray)
	}
	return ancestorArray
}

// #############

class Ancestors extends DirectoryImage {
	getAncestorsOfEntity (
		entity: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}) {
		const ancestorArray: object[] = []
		if (entity.id) {
			if (entity.parentId) {
				const result = getAncestors(this.directoryCopy, entity.parentId, ancestorArray)
				return result
			} else {
				const entityById = this.directoryCopy.find(item => item.id === entity.id)!
				console.log(entity, entityById)
				if (entityById.parentId.toString() !== '0') {
					const result = getAncestors(this.directoryCopy, entityById.parentId, ancestorArray)
					return result
				}
			}
		}
	}

	getAllAncestorsOfFile (entity: {id: number, fileId: string, parentId: number}) {
		if (entity.id) {
			if (entity.parentId) {
				const entityArray = this.directoryCopy.filter(item => item.fileId === entity.fileId)
				console.log(entityArray)
				const ancestorArray: object[] = []
				for (const entity of entityArray) {
					const ancestorArrayToEntity: object[] = []
					ancestorArray.push(getAncestors(this.directoryCopy, entity.parentId, ancestorArrayToEntity))
				}
				console.log(ancestorArray)
				return ancestorArray
			} else {
				// const entityById = this.directoryCopy.find(item => item.id === entity.id)
				// if (entityById.parentId) {
				// 	const result = getAncestors(this.directoryCopy, entityById.parentId, ancestorArray)
				// 	return result
				// }
			}
		}
	}
}

class DirectoryWithoutLeaves extends NestedDirectory {
	flatDirectoryWithoutLeaves: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[]

	constructor (
		storeDirectory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[]
	) {
		super(storeDirectory)
		this.flatDirectoryWithoutLeaves = this.directoryCopy.filter(item => item.isLeaf === false)
	}

	unflattenLeavelessTree (flatDirectory: object[]) {
		if (flatDirectory) {
			const nestedDirectoryWithoutLeaves = this.unflattenTree(flatDirectory)
			return nestedDirectoryWithoutLeaves
		} else {
			const nestedDirectoryWithoutLeaves = this.unflattenTree(this.flatDirectoryWithoutLeaves)
			return nestedDirectoryWithoutLeaves
		}
	}

	removeEntityByFileId (fileId: string) {
		const directoryWithRemovedEntity = this.flatDirectoryWithoutLeaves.filter(item => item.fileId !== fileId)
		return directoryWithRemovedEntity
	}
}

class AddEntityToDirectory extends DirectoryImage {
	constructor (
		storeDirectory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[],
		fileToAddOrRemove: {
			fileId: string,
			label: string,
			parentId: string,
			isLeaf: boolean
		},
		parentIds: string[]
	) {
		super(storeDirectory)
		// console.log('class', parentIds)

		// function to compare two arrays and get the difference (https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript)
		function arrayDiff (a1: string[], a2: string[]) {
			const a: any = []
			const diff = []
			for (let i = 0; i < a1.length; i++) {
				a[a1[i]] = true
			}
			for (let i = 0; i < a2.length; i++) {
				if (a[a2[i]]) {
					delete a[a2[i]]
				} else {
					a[a2[i]] = true
				}
			}
			for (const k in a) {
				diff.push(k)
			}
			return diff
		}

		if (!fileToAddOrRemove.isLeaf && this.directoryCopy.some(item => item.fileId === fileToAddOrRemove.fileId)) {
			const folderInDirectory = this.directoryCopy.find(item => item.fileId === fileToAddOrRemove.fileId)!
			folderInDirectory.parentId = parentIds[0]
		} else {
			// get the directory with the already removed files (if parent of file gets unselected, entity with the according parentId will be removed)
			const directoryWithRemovedFiles = this.directoryCopy.filter(item => parentIds.includes(item.parentId) || item.fileId !== fileToAddOrRemove.fileId)

			// find the entities in the directory with the according fileIds
			const entitiesInDirectory = directoryWithRemovedFiles.filter(item => item.fileId === fileToAddOrRemove.fileId)

			// get the parentIds that are already in use by the entities with the according fileId
			const parentIdsAlreadyInUse = []
			if (entitiesInDirectory) {
				for (const entity of entitiesInDirectory) {
					parentIdsAlreadyInUse.push(entity.parentId)
				}
			}

			// get the difference between the parentIds which have to be added
			const dif = arrayDiff(parentIdsAlreadyInUse, parentIds)

			// if a difference exists --> entities with the remaining parentIds will be added
			if (dif) {
				for (const parentId of dif) {
					// making a copy of the fileToAddOrRemove in order to edit it and make different instances of it
					const fileToAdd = JSON.parse(JSON.stringify(fileToAddOrRemove))
					// set the parentId of the entity that has to be added to the needed parentId (parentId that is not in use already)
					fileToAdd.parentId = parentId
					// is Visible defaults to false
					fileToAdd.isVisible = false
					// find the siblings to the entity that is about to be added
					const siblingEntities = directoryWithRemovedFiles.filter(item => item.parentId === parentId)
					// if siblings with this parentId exist
					if (siblingEntities.length > 0) {
						// find the highest position that one of the siblings takes in / highest position with the same parentId
						const highestPossitionOfSiblings = Math.max.apply(Math, siblingEntities.map(function (sibling) { return sibling.position }))
						// entity that is about to added gets the position at the end highest position + 1
						fileToAdd.position = highestPossitionOfSiblings + 1
					} else {
						// if no siblings were found --> position will be one (first entity in this folder)
						fileToAdd.position = 1
					}
					// new entity gets a unique id
					fileToAdd.id = uuidv4()
					// pushing the complete entity to the copy of the directory
					directoryWithRemovedFiles.push(fileToAdd)
				}
			}
			this.directoryCopy = directoryWithRemovedFiles
		}
	}
}

class ReorderPosition extends DirectoryImage {
	inEntity (entityId: string) {
		const entitiesInBranch = this.directoryCopy.filter(item => item.parentId === entityId)

		let newPosition = 1

		for (const entity of entitiesInBranch) {
			entity.position = newPosition
			newPosition += 1
		}

		return this.directoryCopy
	}
}

function findParents (
	directory: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[],
	children: {
		id: string,
		parentId: string
	}[]
) {
	// creating an empty array to push the matching entities into
	const entityArray: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[] = []
	// looping through every entity in the directory
	// console.log(children)
	for (const entity of directory) {
		// console.log(entity.id, entityArray.some(item => item.id === entity.id))
		// console.log(entityArray)
		if (!entityArray.some(item => item.id === entity.id)) {
			// looping through every child of the children-array
			for (const child of children) {
				// checking if the parentId is not 0 and if the id of the entity matches the parentId of the child
				if (child.parentId.toString() !== '0' && entity.id === child.parentId && !entityArray.includes(entity)) {
					// pushing the found entity to entityArray
					entityArray.push(entity)
					// console.log(entity.id, entityArray.some(item => item.id === entity.id))
				}
			}
		}
	}

	let recursiveResult: {
		id: string,
		fileId: string,
		schemaId: string,
		parentId: string,
		position: number,
		label: string,
		isVisible: boolean,
		isLeaf: boolean
	}[] = []
	if (entityArray.length > 0) {
		// calling the function
		recursiveResult = findParents(directory, entityArray)
	}

	// returning the entityArray plus the result of the recursive call of this function
	const result = entityArray.concat(recursiveResult)

	return result
}

class DirectoryOnlyWithAllowedSchemaIds extends DirectoryImage {
	result: object[]
	constructor (
		directory: {
			id: string,
			fileId: string,
			schemaId: string,
			parentId: string,
			position: number,
			label: string,
			isVisible: boolean,
			isLeaf: boolean
		}[],
		schemaIds: string[],
		fileId: string
	) {
		super(directory)
		// console.log(fileId)

		const entityArray = []
		for (const entity of this.directoryCopy) {
			if (schemaIds.includes(entity.schemaId) && entity.fileId !== fileId) {
				entityArray.push(entity)
			}
		}

		// console.log(entityArray)

		if (entityArray.length > 0) {
			const parents = findParents(this.directoryCopy, entityArray)
			// temp: getting rid of duplicate elements
			// console.log(parents)
			const uniqParents: {
				id: string,
				fileId: string,
				schemaId: string,
				parentId: string,
				position: number,
				label: string,
				isVisible: boolean,
				isLeaf: boolean
			}[] = [...new Set(parents)]
			this.result = entityArray.concat(uniqParents)
		} else {
			this.result = entityArray
		}
	}
}

export {
	MainDirectory,
	DirectoryImage,
	NestedDirectory,
	EditEntity,
	MoveEntityInBranch,
	DeleteEntityInBranch,
	OrphanedFiles,
	ParentOfEntity,
	Ancestors,
	DirectoryWithoutLeaves,
	AddEntityToDirectory,
	ReorderPosition,
	DirectoryOnlyWithAllowedSchemaIds
}
