Maisons = new Mongo.Collection('maisons');

Router.plugin('auth');
Router.route('/', function () {
  this.render('Home');
});
Router.route('/login');
Router.route('/maison/:_id', function () {
  this.render('MaisonDetail', {
    data: function () {
      return Maisons.findOne({_id: this.params._id});
    }
  });
});

if (Meteor.isClient) {
  Meteor.subscribe('maisons');

  Comments.ui.config({
   template: 'bootstrap'
 });
  accountsUIBootstrap3.setLanguage('fr');
  Accounts.ui.config({
    requestPermissions: {
      facebook: ['email']
    }
  });

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
}

if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
    // Hack pour avoir de jolies infos !
    user.emails = user.emails || [];
    user.emails.push({ address: user.services.facebook.email });
    user.username = user.services.facebook.first_name;
    return user;
  });

  Meteor.methods({
    'maisons/fromUrl': function(url, prix, periode) {
      console.log('fromUrl ', url);
      var params = {
        token: Meteor.settings.Parser.apiKey,
        url: url
      };
      HTTP.get(
        'https://readability.com/api/content/v1/parser/',
        { params: params },
        function(err, result) {
          if (err) {
            console.log(err);
            return;
          }

          Maisons.insert({
            url: url,
            prix: prix,
            periode: periode,
            contenu: result,
            createdAt: Date.now()
          });
        }
        );
      return true;
    }
  });

  Meteor.publish('maisons', function () {
    return Maisons.find();
  });
}
