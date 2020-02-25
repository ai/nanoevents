import createNanoEvents = require('..')

interface Events {
  set: (a: string, b: number) => void,
  add: (c: number) => void,
  tick: () => void
}

let typed = createNanoEvents<Events>()

// THROWS not assignable to parameter of type '"set" | "add" | "tick"'
typed.emit('unknown')
// THROWS Expected 3 arguments, but got 2
typed.emit('set', 1)
// THROWS Expected 1 arguments, but got 2
typed.emit('tick', 1)

typed.events = {
  // THROWS is not assignable to type '((a: string, b: number) => void)[]
  set: 1
}

typed.events = {
  // THROWS '{ unknown: never[]; }' is not assignable to type
  unknown: []
}

typed.events = {
  add: [
    // THROWS not assignable to type '(c: number) => void'
    (a: string) => a
  ]
}

let untyped = createNanoEvents()
// THROWS not assignable to parameter of type '(...args: any) => void'
untyped.on('test', 1)

const { on, emit } = typed;
// THROWS is not assignable to method's 'this' of type
on('tick', () => {});
// THROWS is not assignable to method's 'this' of type
emit('tick');
