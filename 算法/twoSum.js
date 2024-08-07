var twoSum = function (nums, target) {
	const map = new Map()
	let result = []
	for (let i = 0; i < nums.length; i++) {
		// console.log(`map.get(nums[i]):`, map.has(nums[i]))
		console.log(`map:`, i, map)
		console.log(`map.get(nums[i]):`, map.get(nums[i]))
		if (map.get(nums[i])) {
			console.log(`i:`, i)
			result = [i, map.get(nums[i])]
			break
		}
		map.set(target - nums[i], i)
	}
	console.log(`result:`, result)
	return result
}

twoSum([2, 7, 11, 15], 9)
