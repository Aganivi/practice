function quickSort(arr, left, right) {
	if (left >= right) return
	let p = partition(arr, left, right)
	quickSort(arr, left, p - 1)
	quickSort(arr, p + 1, right)
}

function partition(arr, left, right) {
	let i = left
	j = right
	while (i < j) {
		while (arr[j] > arr[left]) j--
		while (arr[i] < arr[left]) i++
		swap(arr, i, j)
	}
	swap(arr, i, left)
	return i
}

function swap(nums, i, j) {
	let tmp = nums[i]
	nums[i] = nums[j]
	nums[j] = tmp
}

const arr = [10, 9, 4, 7, 8, 4, 5, 2, 6]

const res = quickSort(arr, 0, arr.length - 1)

console.log(`res:`, res)
