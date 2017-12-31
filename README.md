# micro:bit BLE notifier sample

Notify you events using [micro:bit](http://microbit.org/)'s LED. Events are supplied from a host computer runnnig a watcher script via BLE(Bluetooth Low Energy).

So that this is a sample, events are from [filtered realtime tweets](https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter.html). When new tweets including a specified keyword arrived from the API, LED on a micro:bit lights up. 

## firmware

+ Goto https://makecode.microbit.org/
+ Select JavaScript mode
+ Paste code in `firmware.js`
+ Download a hex file
+ Flash the hex file to your micro:bit

## watcher script

+ Install `node` and `yarn`
+ Run `yarn` to install dependencies
+ Start watching like `node index.js <keyword>`

## License

MIT
