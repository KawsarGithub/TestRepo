/* global jQuery: false, _: false, toastr: false */

(function($, _, toastr) {
    'use strict';

    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    $(function() {
        var $loginBox = $('#login-box'),
            $logoutBox = $('#logout-box'),
            $handleEdit = $('#handle-edit'),
            $handleDisplay = $('#handle-display'),
            $data = $('#data'),
            $list = $('#product-list'),
            $listContainer = $list.find('tbody'),
            $newForm = $list.find('tfoot'),
            displayTemplate = _($('#display-row-template').html()).template(),
            editTemplate = _($('#edit-row-template').html()).template(),
            hub = $.connection.productsHub,
            list,
            editId;

        function showLoggedOutView() {
            $handleEdit.val('');
            $data.fadeOut();
            $logoutBox.slideUp(function() {
                $loginBox.slideDown();
            });
        }

        function showLoggedInView(handle) {
            $handleDisplay.text(handle);
            $loginBox.slideUp(function () {
                $logoutBox.slideDown(function () {
                    $handleEdit.select().focus();
                });
                $data.fadeIn();
            });
        }

        function findRow(id) {
            return _(list).findWhere({ id: id });
        }

        function $findRow(id) {
            return $listContainer.find('tr[data-id="' + id + '"]');
        }

        function renderList(products) {
            var html = _(products).reduce(function(rows, product) {
                return rows + displayTemplate(product);
            }, '');
            $listContainer.empty().append($.parseHTML(html));
        }

        function animateChange(id) {
            $findRow(id)
                .animate({ backgroundColor: '#ffff99' }, function() {
                    $(this).slideDown(function() {
                        $(this).css({ backgroundColor: '' });
                    });
                });
        }

        function animateRemove(id) {
            $findRow(id)
                .animate({ backgroundColor: '#fb6c6c' }, function () {
                $(this).slideUp(function() {
                    $(this).remove();
                });
            });
        }

        function remove(id) {
            var matched = findRow(id),
                index;

            if (!matched) {
                return;
            }

            index = _(list).indexOf(matched);

            if (index < 0) {
                return;
            }

            list.splice(index, 1);
        }

        function add() {
            var $name = $newForm.find('input[name="name"]'),
                $description = $newForm.find('textarea[name="description"]'),
                $price = $newForm.find('input[name="price"]');

            if (!$name.val()) {
                $name.select().focus();
                return;
            }

            if (!$price.val()) {
                $price.select().focus();
                return;
            }

            hub.server.add($name.val(), $description.val(), $price.val())
                .done(function(product) {
                    $name.val('');
                    $description.val('');
                    $price.val('');
                    list.push(product);
                    $listContainer.append($.parseHTML(displayTemplate(product)));
                    animateChange(product.id);
                });
        }

        function destroy(id) {
            if (!confirm('Are you sure you want to delete this row?')) {
                return;
            }

            hub.server.delete(id).done(function () {
                remove(id);
                animateRemove(id);
            });
        }

        function edit(id, $displayRow) {
            var product = findRow(id),
                $row = $($.parseHTML(editTemplate(product)));

            if (editId) {
                cancel(editId, $findRow(editId));
            }

            $displayRow.replaceWith($row);
            $row.find('input,textarea').first().select().focus();
            editId = id;
        }

        function cancel(id, $editRow) {
            var product = findRow(id),
                $row = $($.parseHTML(displayTemplate(product)));

            $editRow.replaceWith($row);
            editId = void(0);
        }

        function update(id, $row) {
            var product = findRow(id),
                $name = $row.find('input[name="name"]'),
                $description = $row.find('textarea[name="description"]'),
                $price = $row.find('input[name="price"]');

            if (!$name.val()) {
                $name.select().focus();
                return;
            }

            if (!$price.val()) {
                $price.select().focus();
                return;
            }

            hub.server.update(id, $name.val(), $description.val(), $price.val()).done(function() {
                product.name = $name.val();
                product.description = $description.val();
                product.price = $price.val();
                cancel(id, $row);
                animateChange(id);
            });
        }

        function onDeleted(handle, product) {
            if (product.id === editId) {
                toastr.error(handle + ' has already deleted \"' + product.name + "\", so we are reverting the edit.");
                cancel(editId, $findRow(editId));
            } else {
                toastr.warning(handle + ' has deleted \"' + product.name + "\".");
            }

            remove(product.id);
            animateRemove(product.id);
        }

        function onAdded(handle, product) {
            toastr.success(handle + ' has added \"' + product.name + "\".");
            list.push(product);
            $listContainer.append($.parseHTML(displayTemplate(product)));
            animateChange(product.id);
        }

        function onUpdated(handle, product) {
            var existing = findRow(product.id),
                template;

            if (product.id === editId) {
                template = editTemplate;
                toastr.error(handle + ' has already updated \"' + existing.name + "\", so we are loading the updated data in edit.");
            } else {
                template = displayTemplate;
                toastr.success(handle + ' has updated \"' + existing.name + "\".");
            }

            existing.name = product.name;
            existing.description = product.description;
            existing.price = product.price;
            $findRow(product.id).replaceWith($.parseHTML(template(product)));
            animateChange(product.id);
        }

        $logoutBox.submit(function (e) {
            e.preventDefault();
            hub.server.leave().done(function() {
                showLoggedOutView();
            });
        });

        $listContainer.on('click', 'button[data-command]', function(e) {
            var $el = $(e.currentTarget),
                $row = $el.closest('tr'),
                id = $row.attr('data-id'),
                command;

            e.preventDefault();

            if (!id) {
                return;
            }

            command = $el.attr('data-command');

            if (command === 'edit') {
                edit(id, $row);
            } else if (command === 'delete') {
                destroy(id);
            } else if (command === 'cancel') {
                cancel(id, $row);
            } else if (command === 'update') {
                update(id, $row);
            }
        });

        $newForm.find('button').click(add);

        hub.client.joined = function(handle) {
            toastr.info(handle + ' has joined.');
        };

        hub.client.left = function(handle) {
            toastr.info(handle + ' has left.');
        };

        hub.client.onDataAction = function(action, handle, product) {
            if (action === 'deleted') {
                onDeleted(handle, product);
            } else if (action === 'added') {
                onAdded(handle, product);
            } else if (action === 'updated') {
                onUpdated(handle, product);
            }
        };

        $.connection.hub.start().done(function() {
            $loginBox.submit(function (e) {
                var handle = $handleEdit.val();

                e.preventDefault();

                if (!handle) {
                    $handleEdit.focus();
                    return;
                }

                hub.server.join(handle).done(function() {
                    showLoggedInView(handle);

                    hub.server.all().done(function(products) {
                        list = products;
                        renderList(list);
                    });
                });
            });
        });
    });

})(jQuery, _, toastr);