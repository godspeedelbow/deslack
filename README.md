# deslack
Slack integration for the debug module. 


## why?

You are not looking at your terminal screen the whole day, in sharp contrast to your Slack client :) This module is a simple wrapper around `debug`, so that your debug log statements can be easily sent to a Slack channel of your choice.


## install

`npm isntall deslack`


## dependencies

- [debug](https://github.com/visionmedia/debug)

- [node-slack](https://github.com/xoxco/node-slack)


## setup

- Setup an `Incoming WebHooks` integration under Custom Integrations in your Slack account.

- setup `deslack`:

```
var deslack = require('deslack')({
    example: {
        channel: '#example-channel',
        hookUrl: '<the hook url you have setup in Slack>',
    },
}, function isSlackEnabled() {
    return true;
});
```

The **first argument** is hash map between `debug` namespaces and Slack channel data:

```
{
    <the debug namespace you want to send to Slack>: {
        channel: <name of the Slack channel, prepended with #>,
        hookUrl: <the hook url you have setup in Slack>
    },
    etc..
}
```

The **second argument** is a function of which its return value indicates whether Slack messages should be sent. This can be handy to evaluate a config environment value. You can of course also provide custom channels for local/staging development, up to you.

## using it

```
deslack('example')('hi', 'this', 'works', { yo: true });
```

**Note:** The value that's returned by `require('deslack')(...)` has the same api as `require('debug')`.

Start the process with `DEBUG=example`:
 - `debug` works exactly like how you'd expect it to
 - a Slack message is sent if a channel was setup for it

If there's no `DEBUG` environment provided, then no Slack message will be sent (nor, of course, will any `debug` statements be logged for that environment).

With regards to handling log arguments:
- in order to send a single message String to Slack, the arguments are concatenated using [`util.format`](https://nodejs.org/docs/latest/api/util.html#util_util_format_format)
- `debug` has its own way of handling arguments
