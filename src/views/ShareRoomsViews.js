 /**
 * ShareRoomsView.js
 */
(function (spiderOakApp, window, undefined) {
  "use strict";
  var console = window.console || {};
  console.log = console.log || function(){};
  var Backbone    = window.Backbone,
      _           = window._,
      $           = window.$;

  /** A model-less view of the visited share rooms and account share rooms.
   *
   */
  spiderOakApp.ShareRoomsRootView = Backbone.View.extend({
    destructionPolicy: "never",
    initialize: function() {
      spiderOakApp.shareRoomsCollection =
          new spiderOakApp.ShareRoomsCollection();
      spiderOakApp.publicShareRoomsCollection =
          new spiderOakApp.PublicShareRoomsCollection();
      _.bindAll(this);
      this.name = "Share Rooms";
      this.on("viewActivate",this.viewActivate);
      this.on("viewDeactivate",this.viewDeactivate);
      spiderOakApp.navigator.on("viewChanging",this.viewChanging);
    },
    render: function() {
      this.$el.html(_.template(
        window.tpl.get("shareRoomsRootViewTemplate"),{})
      );
      this.scroller = new window.iScroll(this.el, {
        bounce: !$.os.android,
        vScrollbar: !$.os.android,
        hScrollbar: false
      });

      // Load the visited and account share rooms simultaneously (quasi-async)
      window.setTimeout(function(){
        this.loadMyShareRooms();
      }.bind(this), 10);
      this.loadVisitedShareRooms();

      return this;
    },
    loadVisitedShareRooms: function() {
      this.visitedShareRoomsRoot =
          new spiderOakApp.PublicShareRoomsCollection();

      this.visitedShareRoomsListView =
        new spiderOakApp.VisitedShareRoomsListView({
          collection: this.visitedShareRoomsRoot,
          el: this.$(".visitedShareRoomsSection")
        });
      // When we've finished fetching the folders, help hide the spinner:
      this.visitedShareRoomsListView.$el.one("complete", function(event) {
        this.visitedShareRoomsListView.settle();
        window.setTimeout(function(){
          this.scroller.refresh();
        }.bind(this),0);
        // @TODO: Refresh subviews scroller
      }.bind(this));
    },
    loadMyShareRooms: function() {
      if (! spiderOakApp.accountModel) {
        return;
      }
      this.myShareRooms = new spiderOakApp.MyShareRoomsCollection();
      this.myShareRooms.url =
          spiderOakApp.accountModel.get("mySharesListURL");
      this.myShareRooms.urlBase =
          spiderOakApp.accountModel.get("mySharesRootURL");
      // Avoid trying to fetch account's share rooms when not logged in:
      if (this.myShareRooms.url) {
        this.myShareRoomsListView = new spiderOakApp.MyShareRoomsListView({
          collection: this.myShareRooms,
          el: this.$(".myShareRoomsSection")
        });

        // When we have finished fetching the folders, help hide the spinner
        this.myShareRoomsListView.$el.one("complete", function(event) {
          this.myShareRoomsListView.settle();
          window.setTimeout(function(){
            this.scroller.refresh();
          }.bind(this),0);
          // @TODO: Refresh subviews scroller
        }.bind(this));
      }
    },
    viewChanging: function(event) {
      if (!event.toView || event.toView === this) {
        spiderOakApp.backDisabled = true;
      }
      var viewsStack = spiderOakApp.navigator.viewsStack;
      if (event.toView === this) {
        spiderOakApp.mainView.setTitle(this.name);
        if (!!viewsStack[0] &&
              viewsStack[0].instance.templateID === this.templateID) {
          spiderOakApp.mainView.showBackButton(false);
        }
        else if (!viewsStack[0] ||
            spiderOakApp.navigator.viewsStack.length === 0) {
          spiderOakApp.mainView.showBackButton(false);
        }
        else {
          spiderOakApp.mainView.showBackButton(true);
        }
      }
    },
    viewActivate: function(event) {
      if (spiderOakApp.navigator.viewsStack[0].instance === this) {
        spiderOakApp.mainView.showBackButton(false);
      }
      spiderOakApp.backDisabled = false;
    },
    viewDeactivate: function(event) {
      //this.close();
    },
    remove: function() {
      this.close();
      this.$el.remove();
      this.stopListening();
      return this;
    },
    close: function() {
      // Clean up our subviews
      this.scroller.destroy();
      this.visitedShareRoomsListView.close();
      this.myShareRoomsListView.close();
    }
  });

  spiderOakApp.MyShareRoomsListView = Backbone.View.extend({
    initialize: function() {
      this.subViews = [];

      /** A handle on our section's content list. */
      this.$elList = this.$el.find(".myShareRoomsList");
      _.bindAll(this);
      // "add" might not be in use in read-only version
      this.collection.on( "add", this.addOne, this );
      this.collection.on( "reset", this.addAll, this );
      this.collection.on( "all", this.render, this );

      this.collection.fetch();
    },
    render: function() {
      // @TODO: Add a "loading spinner" row at the top
      this.addAll();
      // @TODO: Then when we are done, clear the "loading spinner"
      return this;
    },
    settle: function() {
      this.$el.find(".mySharesViewLoading")
          .removeClass("loadingMyShares");
    },
    addOne: function(model) {
      var view = new spiderOakApp.ShareRoomItemView({
        model: model
      });
      this.$elList.append(view.render().el);
      this.subViews.push(view);
    },
    addAll: function() {
      this.$elList.empty(); // needed still?
      this.collection.each(this.addOne, this);
      this.$el.trigger("complete");
    },
    close: function(){
      this.remove();
      this.unbind();
      // handle other unbinding needs, here
      _.each(this.subViews, function(subViews){
        if (subViews.close){
          subViews.close();
        }
      });
    }
  });

  spiderOakApp.VisitedShareRoomsListView = Backbone.View.extend({
    events: {
      "tap .addPublicShare": "addPublicShare_tapHandler"
    },
    initialize: function() {
      this.subViews = [];

      /** A handle on our section's content list. */
      this.$elList = this.$el.find(".visitedShareRoomsList");

      _.bindAll(this);
      this.collection.on( "add", this.addOne, this );
      this.collection.on( "reset", this.addAll, this );
      this.collection.on( "all", this.render, this );

      this.collection.fetch();
    },
    render: function() {
      // @TODO: Add a "loading spinner" row at the top
      this.addAll();
      // @TODO: Then when we are done, clear the "loading spinner"
      return this;
    },
    settle: function() {
      this.$el.find(".visitedSharesViewLoading")
          .removeClass("loadingVisitedShares");
    },
    addOne: function(model) {
      var view = new spiderOakApp.ShareRoomItemView({
        model: model
      });
      this.$elList.append(view.render().el);
      this.subViews.push(view);
    },
    addAll: function() {
      this.$elList.empty(); // needed still?
      this.collection.each(this.addOne, this);
      this.$el.trigger("complete");
    },
    addPublicShare_tapHandler: function(event) {
      navigator.notification.alert("addPublicShare_tapHandler");
    },
    close: function(){
      this.remove();
      this.unbind();
      // handle other unbinding needs, here
      _.each(this.subViews, function(subViews){
        if (subViews.close){
          subViews.close();
        }
      });
    }
  });

  spiderOakApp.ShareRoomItemView = Backbone.View.extend({
    tagName: "li",
    className: "",
    events: {
      "tap a": "a_tapHandler"
    },
    initialize: function() {
      _.bindAll(this, "render");
    },
    render: function() {
      this.$el.html(
        _.template(
          "<a href='#share'>" +
          "<i class='icon-folder'></i> <%= name %>" +
          "</a>",
          this.model.toJSON()
        )
      );
      return this;
    },
    a_tapHandler: function(event) {
      var options = {
        id: this.model.cid,
        title: this.model.get("name"),
        model: this.model
      };
      var folderView = new spiderOakApp.FolderView(options);
      spiderOakApp.navigator.pushView(
        folderView,
        {},
        spiderOakApp.defaultEffect
      );
    },
    close: function(){
      this.remove();
      this.unbind();
    }
  });

})(window.spiderOakApp = window.spiderOakApp || {}, window);
