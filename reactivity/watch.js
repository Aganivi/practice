import { effect } from './effect.js'

function watch(source, cb, options = {}) {
	let getter
	if (typeof source === 'function') {
		getter = source
	} else {
		getter = () => traverse(source)
	}
	let oldValue, newValue
	let cleanup
	function onInvalidate(fn) {
		cleanup = fn
	}
	const job = () => {
		// 当依赖项变化时，重新执行副作用函数，拿到新值
		newValue = effectFn()
		if (cleanup) cleanup()
		cb(newValue, oldValue, onInvalidate)
		oldValue = newValue
	}
	const effectFn = effect(() => getter(), {
		lazy: true,
		scheduler: () => {
			if (options.flush === 'post') {
				const p = Promise.resolve()
				p.then(job)
			} else {
				job()
			}
		},
	})
	if (options.immediate) {
		job()
	} else {
		// 手动调用副作用函数，拿到旧值
		oldValue = effectFn()
	}
}

function traverse(value, seen = new Set()) {
	if (value === null || typeof value !== 'object' || seen.has(value)) return
	seen.add(value)
	for (let key in value) {
		traverse(value[key], seen)
	}
	return value
}

watch(obj, async (newValue, oldValue, onInvalidate) => {
	let expire = false
	onInvalidate(() => {
		expire = true
	})
	const res = await fetch('post/to/request')
	if (!expire) {
		finalData = res
	}
})
