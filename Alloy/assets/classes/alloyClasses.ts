// @ts-nocheck

import { deepCopy } from './objectClasses'

class GetElementData {
	dataToEdit: object
	dataFromDatabase: object

	constructor (
		fileData: {
			elementId: string,
			data: object
		}[],
		elementId: string
	) {
		// finding the data belonging to the passed elementId
		const elementData = fileData.find(item => item.elementId === elementId)
		// if matching data is found
		if (elementData) {
			// assinging the data to the class-property data after performing a deep-copy on the data-object
			this.dataToEdit = deepCopy(elementData.data)
			// assinging the data to the class-property dataFromDatabase, a deep-copy on the data-object is not necessary since that object is never edited
			this.dataFromDatabase = elementData.data
		} else {
			// if no data is found this.text is empty
			this.dataToEdit = null
			this.dataFromDatabase = null
		}
	}
}

// class to encode a string for urls
class URLEncoder {
	encodedString: string
	constructor (value: string) {
		value = value.toLowerCase()
		value = value.replace(/ä/g, 'ae')
		value = value.replace(/ö/g, 'oe')
		value = value.replace(/ü/g, 'ue')
		value = value.replace(/ß/g, 'ss')
		value = value.replace(/ /g, '-')
		value = value.replace(/\./g, '')
		value = value.replace(/,/g, '')
		value = value.replace(/\(/g, '')
		value = value.replace(/\)/g, '')
		this.encodedString = value
	}
}

// class to get the Link to a fileId with a flat directory
class GetLinkToFile {
	// recursive function to get the full path of the fileId
	getPath (
		directory: {
			fileId: string,
			id: string,
			parentId: string,
			label: string,
			isVisible: boolean
		}[],
		fileId: string,
		tempPath: string
	) {
		// initializing the empty path
		let path = ''
		// looking for the first file-entry, that is visible, that is visible
		const fileEntry = directory.find(item => item.fileId === fileId && item.isVisible)
		// checking if a file-entry has been found
		if (fileEntry) {
			// constructing the path: path = forward-slash + the label of the current file-label + the already exisiting temporary path (path that was found in previous function calls [assuming we are not in the first call of the recursive function])
			path = '/' + fileEntry.label + tempPath
		}
		// checking if the parentOd of the file-entry is 0 (root level)
		if (!fileEntry.parentId) {
			// if the parentId is 0 --> returning the path --> breaking out of the recursion
			return path
		} else {
			// if the parentId is not 0
			// looking for the parent of the file-entry
			const parent = directory.find(item => item.id === fileEntry.parentId && item.isVisible)
			// checking if a parent has been found
			if (parent) {
				// using the return-statement to make the recursive function call with the directory, the fileId of the parent and the new path
				return this.getPath(directory, parent.fileId, path)
			}
		}
	}

	link: string

	constructor (
		fileId: string,
		flatDirectory: {
			id: string,
			parentId: string,
			fileId: string,
			isVisible: boolean,
			label: string
		}[]
	) {
		// creating the link by using the result of the getPath-function in the URLEncoder-class, calling the encodedString-property of this class and removing the navigation-part of the string
		this.link = new URLEncoder(this.getPath(flatDirectory, fileId, '')).encodedString.replace(/\/navigation/i, '')
	}
}

export {
	GetElementData,
	GetLinkToFile
}
