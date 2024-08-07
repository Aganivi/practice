let activeEffect
const bucket = new WeakMap()

const data = { text: 'Hello Vue3', ok: true }

const obj = new Proxy(data, {
	get(target, key) {
		track(target, key)
		return target[key]
	},
	set(target, key, value) {
		target[key] = value
		trigger(target, key)
	},
})

function effect(fn, option = {}) {
	function effectFn() {
		cleanup(effectFn)
		activeEffect = effectFn
		const res = fn()
		return res
	}
	effectFn.option = option
	effectFn.deps = []
	if (!option.lazy) {
		effectFn()
	}
	return effectFn
}

function track(target, key) {
	if (!activeEffect) return
	let depsMap = bucket.get(target)
	if (!depsMap) {
		bucket.set(target, (depsMap = new Map()))
	}
	let deps = bucket.get(key)
	if (!deps) {
		depsMap.set(key, (deps = new Set()))
	}
	deps.add(activeEffect)
	activeEffect.deps.push(deps)
}

function trigger(target, key) {
	let depsMap = bucket.get(target)
	if (!depsMap) return
	let deps = depsMap.get(key)
	if (!deps) return
	const effects = new Set(deps)
	effects &&
		effects.forEach((effect) => {
			if (!!effect.option.scheduler) {
				effect.option.scheduler(effect)
			} else {
				effect()
			}
		})
}

function cleanup(effectFn) {
	for (let i = 0; i < effectFn.deps.length; i++) {
		const deps = effectFn.deps[i]
		deps.delete(effectFn)
	}
	effectFn.deps.length = 0
}
