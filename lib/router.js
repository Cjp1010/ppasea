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