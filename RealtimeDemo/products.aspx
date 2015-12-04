<%@ Page Language="C#" MasterPageFile="~/site.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="content" runat="server">
    <h1 class="page-header">Products</h1>
    <form action="/" id="login-box" class="form-inline" role="form">
        <div class="form-group">
            <input id="handle-edit" type="text" class="form-control" placeholder="Type your name..." autofocus />
        </div>
        <button id="join-button" type="submit" class="btn btn-primary">
            <i class="glyphicon glyphicon-log-in"></i> Join
        </button>
    </form>
    <form action="/" id="logout-box" class="form-inline" style="display: none">
        <strong>Welcome</strong> <span id="handle-display" class="label label-success"></span>, 
        <button id="leave-button" type="submit" class="btn btn-primary">
            <i class="glyphicon glyphicon-log-out"></i> Leave
        </button>
    </form>
    <div id="data" style="display: none">
        <hr />
        <div class="table-responsive">
            <table id="product-list" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td>
                            <input class="form-control" name="name" placeholder="Product name..." type="text" />
                        </td>
                        <td>
                            <textarea class="form-control" name="description" rows="2" placeholder="Product description..."></textarea>
                        </td>
                        <td>
                            <input class="form-control" name="price" type="number" />
                        </td>
                        <td>
                            <button class="btn btn-primary" type="button">
                                <i class="glyphicon glyphicon-plus"></i> Add
                            </button>
                        </td>
                    </tr>
                </tfoot>
                <tbody></tbody>
            </table>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="scripts" runat="server">
    <script id="display-row-template" type="text/html">
        <tr data-id="{{ id }}">
            <td>{{ name }}</td>
            <td>{{ description }}</td>
            <td class="text-right">{{ price }}</td>
            <td>
                <button type="button" class="btn btn-default" data-command="edit">
                    <i class="glyphicon glyphicon-edit"></i> Edit
                </button>
                <button type="button" class="btn btn-danger" data-command="delete">
                    <i class="glyphicon glyphicon-trash"></i> Delete
                </button>
            </td>
        </tr>
    </script>
    <script id="edit-row-template" type="text/html">
        <tr data-id="{{ id }}">
            <td>
                <input class="form-control" name="name" placeholder="Product name..." type="text" value="{{ name }}" />
            </td>
            <td>
                <textarea class="form-control" name="description" rows="2" placeholder="Product description...">{{ description }}</textarea>
            </td>
            <td>
                <input class="form-control" name="price" type="number" value="{{ price }}" />
            </td>
            <td>
                <button class="btn btn-primary" type="button" data-command="update">
                    <i class="glyphicon glyphicon-ok"></i> Update
                </button>
                <button class="btn btn-default" type="button" data-command="cancel">
                    <i class="glyphicon glyphicon-refresh"></i> Cancel
                </button>
            </td>
        </tr>
    </script>
    <script src="Scripts/app/products.js"></script>
</asp:Content>