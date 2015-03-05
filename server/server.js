Accounts.onCreateUser(function(options, user) {
	// Hack pour avoir de jolies infos !
	user.emails = user.emails || [];
	user.emails.push({ address: user.services.facebook.email });
	user.username = user.services.facebook.first_name;
	return user;
});

Meteor.publish('maisons', function () {
	return Maisons.find();
});