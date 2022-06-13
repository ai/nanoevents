export let createNanoEvents = () => ({
  events: {},
  emit(event, ...args) {
    for (let i = 0, handlers = this.events[event] || [], length = handlers.length; i < length; i++) handlers[i](...args)
  },
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb])
    return (function () { this.events[event] = this.events[event]?.filter(i => cb !== i) }).bind(this)
  }
})
