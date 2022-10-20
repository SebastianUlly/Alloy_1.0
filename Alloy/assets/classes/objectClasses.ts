// @ts-nocheck

// class Cloneable {
// 	static deepCopy<T> (source: T): T {
// 		// checking if object passed is an array
// 		return Array.isArray(source)
// 			? source.map(item => this.deepCopy(item))
// 			: source instanceof Date
// 				? new Date(source.getTime())
// 				: source && typeof source === 'object'
// 					? Object.getOwnPropertyNames(source).reduce((o, prop) => {
// 						Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
// 						o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
// 						return o
// 					}, Object.create(Object.getPrototypeOf(source)))
// 					: source as T
// 	}
// }

// function deepCopy<T> (source: T): T {
// 	if (Array.isArray(source)) {
// 		source.map(item => this.deepCopy(item))
// 	} else if (source && typeof source === 'object') {
// 		Object.getOwnPropertyNames(source).reduce((o, prop) => {
// 			Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop))
// 			o[prop] = deepCopy((source as { [key: string]: any })[prop])
// 			return o
// 		}, Object.create(Object.getPrototypeOf(source)))
// 	} else {
// 		source as T
// 	}
// 	return source
// }
// class Cloneable {
// 	constructor (source) {
// 		return deepCopy(source)
// 	}
// }

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

// export const deepCopy: Function = <T>(
// 	source: T
// ): Mutable<T> => {
// 	console.log(source)
// 	return Object.getOwnPropertyNames(source).reduce((obj: any, prop: string): Mutable<T> => {
// 		obj[prop] = deepCopy(source[prop])
// 		return obj
// 	}, Object.create(Object.getPrototypeOf(source)))
// }

// export const deepCopy: Function = <T>(
// 	source: T
// ) => {
// 	if (Array.isArray(source)) {
// 		console.log('Array')
// 	} else if (source instanceof Date) {
// 		console.log('Date')
// 	} else if (source && typeof source === 'object') {
// 		const propList = Object.getOwnPropertyNames(source)
// 		if (propList.length > 1) {
// 			for (const prop of propList) {
// 				if (prop !== '__ob__') {
// 					source[prop] = deepCopy(source[prop])
// 					return source
// 				}
// 			}
// 		}
// 	}
// }

export function deepCopy (obj) {
	let copy

	// Handle the 3 simple types, and null or undefined
	if (obj == null || typeof obj !== 'object') {
		return obj
	}

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date()
		copy.setTime(obj.getTime())
		return copy
	}

	// Handle Array
	if (Array.isArray(obj)) {
		copy = []
		for (let i = 0, len = obj.length; i < len; i++) {
			copy[i] = deepCopy(obj[i])
		}
		return copy
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {}
		for (const attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = deepCopy(obj[attr])
			}
		}
		return copy
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}
import _ from 'lodash';
//merging schemas with overwrite
export function mergeSchemas (destination, source){
	 let id =  source.id;
	 let label = source.label;
	 /* Merging the metadata of the destination and source. */
	 let metadata =_.merge(destination.metadata, source.metadata);
	 let elements = [];
	 /* Merging two objects. */
	 for(let destinationItem of destination.elements){
		let foundPair = false;
		for(let sourceItem of source.elements){
			if(destinationItem.elementId == sourceItem.elementId){
				foundPair = true;
				elements.push(_.merge(destinationItem, sourceItem));
				break;
			}
		}
		if(!foundPair){
			elements.push(destinationItem);
		}
	 }
	//console.log(elements)
	return {
		id: id,
		label: label,
		metadata: metadata,
		elements: elements
	};
}
// export {
// 	Cloneable
// }
