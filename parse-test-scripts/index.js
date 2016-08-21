var Parse = require('parse/node');

// Parse.initialize('seggu-api', null, '{B39EC4DE-2F1C-40AF-906E-9CDA7BA2BD7B}');
// Parse.Cloud.useMasterKey();
// Parse.serverURL = 'http://seggu-api-develop.herokuapp.com/parse/';
// createNewSegguClientWithDefaults('Segurolandia');
module.exports = {
    queryAndDestroyAllClasses: queryAndDestroyAllClasses,
    queryAndDestroyAllClassesByUser: queryAndDestroyAllClassesByUser,
    createRole: createRole,
    fetchUsers: fetchUsers,
    createUser: createUser,
    destroyUser: destroyUser,
    createNewSegguClient: createNewSegguClient,
    getRoleUsers: getRoleUsers,
    getProvinceNullDistricts: getProvinceNullDistricts,
    createNewSegguClientWithDefaults: createNewSegguClientWithDefaults,
    logInAs: logInAs,
    addUserToRole: addUserToRole
};
//fetchUsers();
// queryAndDestroyAllClasses();
// createNewSegguClient('Seggurolandia', [
// {
//     username: 'egentile', password: 'seggu2016', email: 'egentilemontes@gmail.com'
// },
// {
//     username: 'ecolombano', password: 'seggu2016', email: 'colombanoemiliano@gmail.com'
// },
// {
//     username: 'fcaironi', password: 'seggu2016', email: 'fcaironi@gmail.com'
// },
// {
//     username: 'apolo', password: 'seggu2016', email: 'poloagustin@gmail.com'
// }]);

// getRoleUsers('PYcD7T2kW9');
// Parse.User.logIn('apolo', 'seggu2016').then(function (user) {
//     new Parse.Query(Parse.Role).get('PYcD7T2kW9').then(function (role) {
//         role.getUsers().add(user);
//         role.save().then(console.log);
//     })
// })

function createRole(name, segguClient) {
    var role = new Parse.Role();
    role.set('name', name);
    role.set('segguClient', segguClient);

    role.save();
}

function fetchUsers() {
    new Parse.Query(Parse.User).find(function (users) {
        users.forEach(function (user) {
            console.log(user.getUsername());
        });
    });
}

function createUser(username, password, email) {
    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set("email", email);

    user.signUp(null, {
        success: function (user) {
            console.log('The user has been created.');
        },
        error: function (user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function queryAndDestroyAllClasses(serverUrl, appId, masterKey, roleId, userId) {
    Parse.initialize(appId, null, masterKey);
    Parse.Cloud.useMasterKey();
    Parse.serverURL = serverUrl;

    queryAndDestroy();
}

function queryAndDestroyAllClassesByUser(serverUrl, appId, username, password) {
    Parse.initialize(appId, null, null);
    Parse.serverURL = serverUrl;

    if (Parse.User.current()) {
        Parse.User.logOut();
    }
    Parse.User.logIn(username, password).then(queryAndDestroy, console.log);
}

function queryAndDestroy(something) {
    // console.log('In queryAndDestroy');
    // console.log(something);
    // console.log(Parse.User.current());
    new Parse.Query('Vehicle').find(console.log);
    [
        'AccessoryType',
        'Asset',
        'Client',
        'CreditCard',
        'LedgerAccount',
        'Producer',
        'Cheque',
        'Contact',
        'Liquidation',
        'Risk',
        'Policy',
        'Endorse',
        'Employee',
        'FeeSelection',
        'Fee',
        'Vehicle',
        'Accessory',
        'Integral',
        'Address',
        'CashAccount',
        'Session',
        'Coverage',
        'CoveragesPack',
        'Casualty'
        // 'Bank',
        // 'Bodywork',
        // 'Brand',
        // 'CasualtyType',
        // 'Company',
        // 'District',
        // 'Locality',
        // 'Province',
        // 'Use',
        // 'VehicleModel',
        // 'VehicleType',
    ].forEach(function (value) {
        queryAndDestroy(value);
    });

    function queryAndDestroy(className) {
        // console.log(Parse.User.current().sessionToken);
        var options = {
            success: function (objects) {
                console.log("I'm gonna destroy " + objects.length + " objects in " + className);
                Parse.Object.destroyAll(objects).then(null, console.log);
                if (objects.length > 0) {
                    queryAndDestroy(className);
                }
            },
            error: console.log,
            sessionToken: Parse.User.current() ? Parse.User.current().sessionToken : null
        };
        new Parse.Query(className).find(options);
    }
}

function destroyUser(username, password) {
    Parse.User.logIn(username, password).then(function (user) {
        user.destroy().then(console.log, console.log);
    }, console.log);
}

function createNewSegguClient(clientName, users) {
    var segguClient = new Parse.Object('SegguClient');
    segguClient.set('name', clientName);

    segguClient.save().then(function (savedClient) {
        var clientRole = getNewRole(savedClient.id);
        var clientClientsRole = getNewRole(savedClient.id + 'Clients');
        var roles = [clientRole, clientClientsRole];
        Parse.Object.saveAll(roles).then(function (savedRoles) {
            var parseUsers = users.map(function (user) {
                var parseUser = new Parse.User();
                parseUser.set('username', user.username);
                parseUser.set('password', user.password);
                parseUser.set('email', user.email);
                parseUser.set('segguClient', savedClient);
                return parseUser;
            });

            parseUsers.forEach(function (parseUser) {
                parseUser.signUp().then(function (createdUser) {
                    savedRoles[0].getUsers().add(createdUser);
                    savedRoles.save().then(console.log, console.log);
                }, console.log);
            })
        }, console.log);

        function getNewRole(roleName, segguClient) {
            var roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role(roleName, roleACL);
            return role;
        }
    }, console.log)
}

function createNewSegguClientWithDefaults(clientName) {
    var segguClient = new Parse.Object('SegguClient');
    segguClient.set('name', clientName);

    var users = [
        {
            username: 'egentile' + clientName, password: 'seggu2016', email: 'egentilemontes@gmail.com'
        },
        {
            username: 'ecolombano' + clientName, password: 'seggu2016', email: 'colombanoemiliano@gmail.com'
        },
        {
            username: 'fcaironi' + clientName, password: 'seggu2016', email: 'fcaironi@gmail.com'
        },
        {
            username: 'apolo' + clientName, password: 'seggu2016', email: 'poloagustin@gmail.com'
        }];

    segguClient.save().then(function (savedClient) {
        var clientRole = getNewRole(savedClient.id);
        var clientClientsRole = getNewRole(savedClient.id + 'Clients');
        var roles = [clientRole, clientClientsRole];
        Parse.Object.saveAll(roles).then(function (savedRoles) {
            var parseUsers = users.map(function (user) {
                var parseUser = new Parse.User();
                parseUser.set('username', user.username);
                parseUser.set('password', user.password);
                parseUser.set('email', user.email);
                parseUser.set('segguClient', savedClient);
                return parseUser;
            });

            parseUsers.forEach(function (parseUser) {
                parseUser.signUp().then(function (createdUser) {
                    savedRoles[0].getUsers().add(createdUser);
                    savedRoles.save().then(console.log, console.log);
                }, console.log);
            })
        }, console.log);

        function getNewRole(roleName, segguClient) {
            var roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role(roleName, roleACL);
            return role;
        }
    }, console.log)
}

function getRoleUsers(roleId) {
    new Parse.Query(Parse.Role).get(roleId).then(function (role) {
        role.getUsers().query().find().then(console.log, console.log);
        // new Parse.Query(Parse.User).equalTo('roles', role).find(console.log, console.log);
    }, console.log);
}

function getProvinceNullDistricts() {
    new Parse.Query('District').doesNotExist('province').find().then(console.log, console.log);
}

function logInAs(username, password) {
    Parse.User.logIn(username, password).then(console.log, console.log);
}

function addUserToRole(serverUrl, appId, masterKey, roleId, userId) {
    Parse.initialize(appId, null, masterKey);
    Parse.Cloud.useMasterKey();
    Parse.serverURL = serverUrl;

    new Parse.Query(Parse.Role).get(roleId).then(function (role) {
        new Parse.Query(Parse.User).get(userId).then(function (user) {
            role.getUsers().add(user);
            role.save().then(console.log, console.log);
        }, console.log);
    }, console.log);
}
