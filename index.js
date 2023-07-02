export let createNanoEvents = () => ({
  events: {},
  emit(event, ...args) {
    for (const callback of (this.events[event] || [])) {
      callback(...args)
    }
  },
  on(event, cb) {
    const events = (this.events[event] ||= [])
    events.push(cb)
    return () => {
      const i = events.indexOf(cb)
      if (i > -1) events.splice(i, 1)
    }
  }
})
