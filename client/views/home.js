Template.home.helpers({
  isAddMode: function() {
    return Session.get("isAddMode");
  },
  isViewAll: function() {
    return Session.get("isViewAll");
  },
  maisons: function () {
    return Maisons.find({}, {sort: {createdAt: -1}});
  }
});

Template.home.events({
  "click #add": function() {
    Session.set("isAddMode", true);
  },
  "change .togglebutton input": function(e) {
    Session.set("isViewAll", e.target.checked);
  },
  "submit form": function(e) {
    var form = e.target;
    var args = [form.url.value, form.prix.value, form.periode.value].map(_.clone);
    Meteor.apply('maisons/fromUrl', args, function(err, foo) {
      if (err) {
        console.log(err);
      } else {
        $(form)[0].reset();
        Session.set("isAddMode", false);
      }
    });
    e.preventDefault();
  }
});

Template.maison.created = function() {
  var rvar = this.commentsCount = new ReactiveVar(0);
  Meteor.call('comments/count', this.data._id, function(err, count) {
    if (err) {
      console.log(err);
    } else {
      rvar.set(count);
    }
  });
};
Template.maison.helpers({
  commentsCount: function() {
    var inst = Template.instance();
    return inst.commentsCount.get();
  }
});
Template.maison.events({
  "click .thumbnail": function() {
    Router.go('/maison/' + this._id);
  }
});