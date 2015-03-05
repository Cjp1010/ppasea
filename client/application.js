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