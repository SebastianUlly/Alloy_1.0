// @ts-nocheck

class RelationshipImage {
	relationhipCopy: {
		fileId: string,
		elementId: string,
		relationshipId: string,
		position: number
	}[]

	constructor (relationhipsToCopy: {
			fileId: string,
			elementId: string,
			relationshipId: string,
			position: number
		}[]
	) {
		// creating a copy of the relationships
		this.relationhipCopy = JSON.parse(JSON.stringify(relationhipsToCopy))
	}
}

class RelationshipsToElementIdAndFileId extends RelationshipImage {
	relationshipsInThisElement: {
		fileId: string,
		elementId: string,
		relationshipId: string,
		position: number
	}[]

	relationshipsInThisElementToThisFile: {
		fileId: string,
		elementId: string,
		relationshipId: string,
		position: number
	}[]

	constructor (relationships: {
			fileId: string,
			elementId: string,
			relationshipId: string,
			position: number
		}[], elementId: string, fileValues: {
			id: string
		}
	) {
		// super call to create a copy of the relationshipArray
		super(relationships)
		// checking if relationships are passed and not an empty array
		if (relationships) {
			// finding the relationships belonging to this element (elementId)
			this.relationshipsInThisElement = this.relationhipCopy.filter(item => item.elementId === elementId)
			// finding only the relationships belonging to this element and are not the file current file Itself
			this.relationshipsInThisElementToThisFile = this.relationshipsInThisElement.filter(item => item.fileId !== fileValues.id)
		}
	}
}

// class to complete missing or wrong positions
class AssignRelationshipsNewPositions extends RelationshipsToElementIdAndFileId {
	relationshipsWithNewPosition: {
		fileId: string,
		elementId: string,
		relationshipId: string,
		position: number
	}[]

	constructor (relationships: {
			fileId: string,
			elementId: string,
			relationshipId: string,
			position: number
		}[], elementId: string, fileValues: {
			id: string
		}
	) {
		// super call to create a copy of the relationshipArray
		super(relationships, elementId, fileValues)
		// checking if relationships are passed and not an empty array
		if (relationships) {
			// checking if there are any relationships to work with
			if (this.relationshipsInThisElementToThisFile) {
				// sorting the relationshipsInThisElementToThisFile by position
				this.relationshipsInThisElementToThisFile.sort(function (a, b) {
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
				// looping through all the relationships
				for (const obj of this.relationshipsInThisElementToThisFile) {
					// increasing the counter by one
					counter += 1
					// assinging a new position to the relationship
					obj.position = counter
				}
				// assinging the relationships to the usable variable
				this.relationshipsWithNewPosition = this.relationshipsInThisElement
			}
		}
	}
}

class CheckForChanges {
	relationshipsWithChanges: {
		fileId: string,
		elementId: string,
		relationshipId: string,
		position: number,
		hasChanged: boolean
	}[]

	constructor (
		oldRelationships: {
			fileId: string,
			elementId: string,
			relationshipId: string,
			position: number
		}[],
		newRelationships: {
			fileId: string,
			elementId: string,
			relationshipId: string,
			position: number,
			hasChanged: boolean
		}[]
	) {
		for (const newRelatedFile of newRelationships) {
			const oldRelatedFile = oldRelationships.find(item => item.fileId === newRelatedFile.fileId)
			if (oldRelatedFile) {
				if (newRelatedFile.position === oldRelatedFile.position) {
					newRelatedFile.hasChanged = false
				} else {
					newRelatedFile.hasChanged = true
				}
			} else {
				newRelatedFile.hasChanged = true
			}
		}
		this.relationshipsWithChanges = newRelationships
	}
}

export {
	RelationshipsToElementIdAndFileId,
	AssignRelationshipsNewPositions,
	CheckForChanges
}
