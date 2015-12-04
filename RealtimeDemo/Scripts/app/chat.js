/* global jQuery: false */

(function($) {
    'use strict';

    var $form = $('#message-form'),
        $message = $form.find('textarea[name="message"]'),
        $list = $('#message-list'),
        hub = $.connection.chatHub,
        userName = '';

    hub.client.broadcastMessage = function(name, message) {
        $('<li/>')
            .append($('<strong />', { text: name + ': ' }))
            .append($('<span />', { text: message }))
            .appendTo($list)
            .animate({ backgroundColor: '#ffff99' }, function() {
                $(this).slideDown(function() {
                    $(this).css({ backgroundColor: '' });
                });
            });
    };

    $.connection.hub.start().done(function() {
        $form.submit(function (e) {
            var message = $message.val();

            e.preventDefault();

            if (!message) {
                return;
            }

            hub.server.send(userName, message).done(function() {
                $message.val('').select().focus();
            });
        });
    });

    while (!userName.length) {
        userName = prompt('Enter your name:', '');
    }

})(jQuery);