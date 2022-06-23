export function	hasAnythingChanged (
	hasChangedArray: {
		elementId: String,
		hasChanged: Boolean
	}[]
) {
	// checking if the hasChanged-property of every item in the hasChangedArray is false
	if (hasChangedArray.every(item => item.hasChanged === false)) {
		// returning false if nothing has changed (has changed property is everywhere false)
		return false
	}
	// else returning true (something has changed)
	return true
}