function playerModel() {
  const db = {
    1: { firstName: 'Ash', lastName: 'Barty' },
    2: { firstName: 'Garbine', lastName: 'Muguruza' },
    3: { firstName: 'Iga', lastName: 'Swiatek' },
    4: { firstName: 'Naomi', lastName: 'Osaka' },
  };

  return {
    uid,
    getAll,
    read,
    create,
    update,
    del,
  };

  function uid() {
    return (
      Object.keys(db)
        .sort((a, b) => a - b)
        .map(Number)
        .pop() + 1
    );
  }

  function getAll(cb) {
    setImmediate(() => cb(null, db));
  }

  function read(id, cb) {
    if (!db.hasOwnProperty(id)) {
      setImmediate(() => cb(new Error('id does not exist')));
      return;
    }
    setImmediate(() => cb(null, db[id]));
  }
  function create(data, cb) {
    const id = uid();
    db[id] = data;
    setImmediate(() => cb(null, id));
  }

  function update(id, data, cb) {
    if (!db.hasOwnProperty(id)) {
      setImmediate(() => cb(new Error('id does not exist')));
      return;
    }
    db[id] = data;
    setImmediate(() => cb(null, data));
  }

  function del(id, cb) {
    if (!db.hasOwnProperty(id)) {
      setImmediate(() => cb(new Error('id does not exist')));
      return;
    }
    delete db[id];
    setImmediate(() => cb());
  }
}

module.exports = {
  players: playerModel(),
};
