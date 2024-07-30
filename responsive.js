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

function effect(fn) {
	function effectFn() {
		cleanup(effectFn)
		activeEffect = effectFn
		fn()
	}
	effectFn.deps = []
	effectFn()
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
	effects && effects.forEach((effect) => effect())
}

function cleanup(effectFn) {
	for (let i = 0; i < effectFn.deps.length; i++) {
		const deps = effectFn.deps[i]
		deps.delete(effectFn)
	}
	effectFn.activeDeps = []
}

let result
const test = () => {
	console.log(`1:`, 1)
	result = obj.ok ? obj.text : 'no'
}

effect(test)

console.log(`result:`, result)

obj.text = 'Hello World'
setTimeout(() => {
	obj.text = 'Hello World2'
	// console.log(`result:`, result)
}, 1000)

obj.ok = false
