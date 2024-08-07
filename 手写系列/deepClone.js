function deepClone(target, map = new WeakMap()) {
	if (typeof target !== 'object' || target === null) {
		return target
	}
	const isArray = Array.isArray(target)
	let result = isArray ? [] : {}
	if (map.get(target)) return map.get(target)
	map.set(result)
	let keys = isArray ? undefined : Object.keys(target)
	forEach(keys || target, (value, key) => {
		if (keys) {
			key = value
		}

		result[key] = deepClone(target[key], map)
	})

	return result
}

const obj = { a: 1, b: 2, c: function () {}, d: {} }
const arr = [1, 2, function () {}, { c: 1 }]

const obj1 = deepClone(obj)
// const arr1 = deepClone(arr)

console.log(obj, obj1)
// console.log(arr, arr1)

function forEach(array, iteratee) {
	let index = -1
	const length = array.length
	while (++index < length) {
		iteratee(array[index], index)
	}
	return array
}
