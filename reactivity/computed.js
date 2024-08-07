import { effect } from './effect.js'
const computed = function (getter) {
	let value
	let dirty = true

	const effectFn = effect(getter, {
		lazy: true,
		scheduler() {
			dirty = true
		},
	})

	const obj = {
		get value() {
			if (dirty) {
				value = effectFn()
				dirty = false
			}
			return value
		},
	}
	return obj
}
