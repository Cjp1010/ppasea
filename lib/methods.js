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
  }
});