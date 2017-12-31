'use strict';

const BBCMicrobit = require('bbc-microbit');
const Twitter = require('twitter');
const throttle = require('throttle-debounce/throttle');

//
const PatternBlank = {
  name: 'Blank',
  value: Buffer.from('0000000000', 'hex')
};

const PatternSmile = {
  name: 'Smile',
  value: Buffer.from('0A0A00110E', 'hex')
};

const discover = () => new Promise((resolve) => {
  BBCMicrobit.discover((microbit) => {
    resolve(microbit);
  });
});

const connectAndSetUp = (microbit) => new Promise((resolve) => {
  microbit.connectAndSetUp(resolve)
});

const writeLedMatrixState = (microbit, pattern) => new Promise((resolve) => {
  microbit.writeLedMatrixState(pattern.value, () => {
    resolve(pattern);
  });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const watch = (keyword, handler) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  const throttled = throttle(5000, (event) => {
    handler(event);
  });

  client.stream('statuses/filter', {track: keyword}, (stream) => {
    stream.on('data', throttled);
    stream.on('error', (error) => {throw error;});
  });
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

  watch(process.argv[2], async(event) => {
    console.log('\n\n########## Received event ##########');
    if (event) {
      console.log(`\t${event.text}`);
    }
    for (let i = 0; i < 5; i++) {
      await writeLedMatrixState(microbit, PatternSmile);
      await sleep(100);
      await writeLedMatrixState(microbit, PatternBlank);
      await sleep(50);
    }
  });
};

run();
