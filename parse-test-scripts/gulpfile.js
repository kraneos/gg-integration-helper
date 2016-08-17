var gulp = require('gulp');
var scripts = require('./index');
var argv = require('yargs').argv;
var dataMig = require('./data-migration');

gulp.task('destroy-all', function () {
	if (argv.MASTERKEY) {
		scripts.queryAndDestroyAllClasses(argv.SERVERURL, argv.APPID, argv.MASTERKEY, argv.ROLEID, argv.USERID);
	} else if (argv.USERNAME && argv.PASSWORD) {
		console.log('queryAndDestroyAllClassesByUser');
		scripts.queryAndDestroyAllClassesByUser(argv.SERVERURL, argv.APPID, argv.USERNAME, argv.PASSWORD);
	}
});

gulp.task('task1', function () {
    scripts.getProvinceNullDistricts();
});

gulp.task('new-client-def', function () {
	if (argv.CLIENT_NAME) {
		scripts.createNewSegguClientWithDefaults(argv.CLIENT_NAME);
	}
});

gulp.task('login', function () {
	if (argv.USERNAME && argv.PASSWORD) {
		console.log('Gonna try to login as ${argv.USERNAME} with password ${argv.PASSWORD}');
		console.log(argv.USERNAME);
		console.log(argv.PASSWORD);

		scripts.logInAs(argv.USERNAME, argv.PASSWORD);
	}
});

gulp.task('destroy-user', function () {
	if (argv.USERNAME && argv.PASSWORD) {
		scripts.destroyUser(argv.USERNAME, argv.PASSWORD);
	}
});

gulp.task('create-provinces', function () {
	// dataMig('http://seggu-api-test.herokuapp.com/parse/', 'seggu-api', 'SegguMasterKey')
	// 	.createProvinces('./data/provinces.json');
});

gulp.task('add-user-to-role', function () {
	scripts.addUserToRole(argv.SERVERURL, argv.APPID, argv.MASTERKEY, argv.ROLEID, argv.USERID);
});