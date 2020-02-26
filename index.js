module.exports = (events = {}) => ({
  events,
  emit (event, ...args) {
    for (var i of events[event] || []) {
      i(...args)
    }
  },
  on (event, cb) {
    (events[event] = events[event] || []).push(cb)
    return () => (
      events[event] = events[event].filter(i => i !== cb)
    )
  }
})
