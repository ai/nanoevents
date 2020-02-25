module.exports = () => {
  let events = {};
  return {
    events,
    emit (event, ...args) {
      for (let i of events[event] || []) {
        i(...args)
      }
    },
    on (event, cb) {
      (events[event] = events[event] || []).push(cb)
      return () => (
        events[event] = events[event].filter(i => i !== cb)
      )
    }
  }
}
