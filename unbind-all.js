module.exports =
  /**
   * Removes all listeners.
   *
   * @alias unbindAll
   * @param {NanoEvents} emitter NanoEvents instance.
   * @returns {undefined}
   *
   * @example
   * unbindAll(emitter)
   */
  function unbindAll (emitter) {
    emitter.events = { }
  }
