var NanoEvents = require('./index')

module.exports = {
  unbindAll: unbindAll
}

/**
 * Removes all listeners.
 *
 * @param {NanoEvents} emitter — NanoEvents instance
 * @returns {undefined}
 *
 * @example
 * unbindAll(emitter)
 */
function unbindAll (emitter) {
  if (emitter instanceof NanoEvents) {
    emitter.events = { }
  }
}
