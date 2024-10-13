export let createNanoEvents = () => ({
  emit(event, ...args) {
    for (
      let callbacks = this.events[event] || [],
        i = 0,
        length = callbacks.length;
      i < length;
      i++
    ) {
      callbacks[i](...args)
    }
  },
  events: {},
  on(event, cb) {
    ;(this.events[event] ||= []).push(cb)
    return () => {
      this.events[event] = this.events[event]?.filter(i => cb !== i)
    }
  }
})
