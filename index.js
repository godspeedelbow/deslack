var debug = require('debug');
var Slack = require('node-slack');
var util = require('util');

var sendToSlackChannel = {};

module.exports = function setupChannels (channelSetup, isSlackEnabled) {
    channelSetup = channelSetup || {};
    isSlackEnabled = isSlackEnabled || function() { return true; };

    if (isSlackEnabled()) {
        setupNamespaceChannels(channelSetup);
    }

    return registerNamespace;
};

function setupNamespaceChannels(channelSetup) {
    Object.keys(channelSetup).forEach(function (debugNamespace) {
        var slack = channelSetup[debugNamespace];
        if (!slack.channel) {
            throw new Error('missing slack `channel` argument for namespace ' + debugNamespace);
        }
        if (!slack.hookUrl) {
            throw new Error('missing slack `hookUrl` argument ' + debugNamespace);
        }
        sendToSlackChannel[debugNamespace] = createSlackSender({
            channel: slack.channel,
            hookUrl: slack.hookUrl,
            username: slack.username || 'deslack',
        });
    });
}

function createSlackSender (slackProps) {
    var slackChannel = new Slack(slackProps.hookUrl);
    return function sendSlackMessage(text) {
        slackChannel.send({
            channel: slackProps.channel,
            username: slackProps.username,
            text: text,
        });
    };
}

function registerNamespace(namespace) {
    var logger = debug(namespace);
    return function(/* any number of arguments */) {
        //check whether DEBUG environment variable is set for this namespace
        if (!logger.enabled) return;

        var args = [].slice.call(arguments); //https://davidwalsh.name/arguments-array
        logger.apply(logger, args);

        //only send to slack when there is channel for this namespace
        if (sendToSlackChannel[namespace]) {
            sendToSlackChannel[namespace](util.format(args));
        }
    };
}
