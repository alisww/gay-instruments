const { login } = require('masto');
const { setIntervalAsync } = require('set-interval-async/fixed');

var tracery = require('tracery-grammar');
var instruments = require('./instruments.js');
var labels = require('./labels.js');
var genders = require('./genders.js');

(async () => {
  var grammar = tracery.createGrammar({
    'instruments': instruments,
    'genders': genders,
    'labels': labels,
    'origin': ['#labels.a# who plays the #instruments#']
  });

  grammar.addModifiers(tracery.baseEngModifiers);

  const masto = await login({
    url: '',
    accessToken: ''
  });

  await masto.statuses.create({
    status: grammar.flatten("#origin#"),
    visibility: 'unlisted'
  });

  setIntervalAsync(
    async () => {
      await masto.statuses.create({
        status: grammar.flatten("#origin#"),
        visibility: 'unlisted'
      });
    },
    3600000
  );

})();
