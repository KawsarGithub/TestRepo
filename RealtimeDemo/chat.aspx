<%@ Page Language="C#" MasterPageFile="~/site.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="content" runat="server">
    <h1 class="page-header">Chat</h1>
    <form id="message-form" action="/" role="form">
        <div class="form-group">
            <label class="control-label" for="message">Message</label>
            <textarea name="message" class="form-control" placeholder="Type your message..." autofocus></textarea>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-primary">
                <i class="glyphicon glyphicon-share-alt"></i> Send
            </button>
        </div>
    </form>
    <ol id="message-list"></ol>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="scripts" runat="server">
    <script src="Scripts/app/chat.js"></script>
</asp:Content>