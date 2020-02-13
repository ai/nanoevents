module.exports = function () {
  let emitter = {
    events: { }
  }

  emitter.emit = (event, ...args) => {
    (emitter.events[event] || []).filter(i => i(...args))
  }

  emitter.on = (event, cb) => {
    (emitter.events[event] = emitter.events[event] || []).push(cb)
    return function () {
      emitter.events[event] = emitter.events[event].filter(i => i !== cb)
    }
  }

  return emitter
}
