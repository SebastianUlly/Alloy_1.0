import gql from 'graphql-tag'

export function getConsecutiveNumber (
	directory: {
		id: string,
		fileId: string,
		parentId: string,
		label: string
	}[],
	clickedId: string
) {
	let consecutiveNumber
	// finding the ck´licked entity in the directory
	const itemInDirectory = directory.find(item => item.id === clickedId)
	// checking if the entity has been found
	if (itemInDirectory) {
		// finding all siblings of the entity
		const siblings = directory.filter(item => item.parentId === itemInDirectory.parentId)
		// checking if siblings have been found
		// console.log(siblings)
		if (siblings) {
			// sorting the siblings by converting their labels to integers
			siblings.sort(function(a, b) {
				return parseInt(a.label) - parseInt(b.label)
			})
			consecutiveNumber = parseInt(siblings[siblings.length - 1].label) + 1
		}
	}
	console.log('calculated Number', consecutiveNumber)
	return consecutiveNumber
}