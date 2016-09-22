/**
 * Interface for event subscription.
 *
 * @example
 * class Ticker {
 *   constructor() {
 *     this.emitter = new NanoEvents()
 *   }
 *   on() {
 *     return this.emitter.on.apply(this.events, arguments)
 *   }
 *   once() {
 *     return this.emitter.once.apply(this.events, arguments)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 *
 * @class
 */
function NanoEvents () {
  /**
   * Event names in keys and listeners array in values
   * @type {object}
   */
  this.events = { }
}

function add (events, event, cb) {
  var added = true
  var listener = { fn: cb }

  listener.rm = function () {
    if (!added) return
    added = false
    var list = events[event]
    list.splice(list.indexOf(listener), 1)
  }

  if (events[event]) {
    events[event].push(listener)
  } else {
    events[event] = [listener]
  }
  return listener
}

function run (l, args) {
  var array = new Array(args.length - 1)
  for (var i = 1; i < args.length; i++) {
    array[i - 1] = args[i]
  }
  return l.fn.apply(this, array)
}

NanoEvents.prototype = {

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   */
  on: function on (event, cb) {
    return add(this.events, event, cb).rm
  },

  /**
   * Add a one-time listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.once('tick', (tickType, tickDuration) => {
   *   works = true
   * })
   */
  once: function once (event, cb) {
    var l = add(this.events, event, cb)
    l.once = true
    return l.rm
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments to listeners.
   *
   * @returns {boolean} `true` if the event had listeners, else `false`.
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event) {
    var list = this.events[event]
    if (!list || !list.length) return false

    var i
    var rm = []

    for (i = 0; i < list.length; i++) {
      var l = list[i]
      if (l.once) rm.push(l)
      run(l, arguments)
    }

    for (i = 0; i < rm.length; i++) {
      rm[i].rm()
    }

    return true
  },

  /**
   * Execute listener callback.
   *
   * @param {object} listener Listener object
   * @param {...*} arguments The arguments to listeners.
   *
   * @return {*} callback’s result
   *
   * @example
   * for (listener of ee.events['tick']) {
   *   if (ee.call(listener, tickType, tickDuration) === false) {
   *     break
   *   }
   * }
   */
  call: function call (listener) {
    if (listener.once) listener.rm()
    return run(listener, arguments)
  }

}

module.exports = NanoEvents
