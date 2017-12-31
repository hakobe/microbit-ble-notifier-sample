'use strict';

const BBCMicrobit = require('bbc-microbit');
const express = require('express')

//
var PATTERNS = [
  {
    name: 'Blank',
    value: Buffer.from('0000000000', 'hex')
  },
  {
    name: 'Arrow up right',
    value: Buffer.from('0F03050910', 'hex')
  },
  {
    name: 'Arrow down left',
    value: Buffer.from('011214181E', 'hex')
  },
  {
    name: 'Arrow down right',
    value: Buffer.from('100905030F', 'hex')
  },
  {
    name: 'Arrow down left',
    value: Buffer.from('011214181E', 'hex')
  },
  {
    name: 'Arrow up left',
    value: Buffer.from('1E18141201', 'hex')
  },
  {
    name: 'Diamond',
    value: Buffer.from('040A110A04', 'hex')
  },
  {
    name: 'Smile',
    value: Buffer.from('0A0A00110E', 'hex')
  },
  {
    name: 'Wink',
    value: Buffer.from('080B00110E', 'hex')
  },
  {
    name: 'Solid',
    value: Buffer.from('1F1F1F1F1F', 'hex')
  },
];

const discover = () => new Promise((resolve) => {
  BBCMicrobit.discover((microbit) => {
    resolve(microbit);
  });
});

const connectAndSetUp = (microbit) => new Promise((resolve) => {
  microbit.connectAndSetUp(resolve)
});

const writeLedMatrixState = (microbit, pattern) => new Promise((resolve) => {
  console.log('sending pattern: "%s"', pattern.name);
  microbit.writeLedMatrixState(pattern.value, () => {
    resolve(pattern);
  });
});

const randomPattern = () => {
  const patternIndex = Math.floor((Math.random() * PATTERNS.length)); // choose a random pattern
  return PATTERNS[patternIndex];
};

const run = async() => {
  const microbit = await discover();

  microbit.on('disconnect', () => {
    console.log('disconnected');
    process.exit(0);
  });

  function handle(signal) {
    console.log(`Received ${signal}`);
    microbit.disconnect();
  }
  process.on('SIGINT', handle);
  process.on('SIGTERM', handle);

  await connectAndSetUp(microbit);

  const app = express()
  app.get('/', async(req, res) => {
    const pattern = await writeLedMatrixState(microbit, randomPattern());
    res.send(`sent ${pattern.name}`);
  })

  console.log('started at :3000');
  app.listen(3000)
};

run();
