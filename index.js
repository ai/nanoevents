export let createNanoEvents = () => ({
  events: {},
  emit(event, ...args) {
    this.events[event]?.forEach(cb => cb(...args));
  },
  on(event, cb) {
    let events = this.events[event] ||= []
    events.push(cb)
    return () => {
      let i = events.indexOf(cb)
      if (i > -1) events.splice(i, 1)
    }
  }
})
