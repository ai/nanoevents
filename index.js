export let createNanoEvents = () => ({
  emit(event, ...args) {
    for (
      let i = 0,
        callbacks = this.events[event] || [],
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
