export let createNanoEvents = () => ({
  events: {},
  emit(event, ...args) {
    for (let i = 0, handlers = this.events[event] || [], length = handlers.length; i < length; i++) handlers[i](...args)
  },
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb])
    return () => {
      /* eslint-disable prefer-arrow-callback */
      // The code is faster on V8 with anonymous function.
      let result = (this.events[event] || []).filter(function (i) {
        return cb !== i;
      });
      if (result.length) {
        this.events[event] = result
      } else {
        delete this.events[event]
      }
    }
  }
})
