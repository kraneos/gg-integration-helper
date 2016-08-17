var Parse = require('parse/node');
var fs = require('fs');

module.exports = function (serverUrl, appId, masterKey) {
    Parse.initialize(appId, null, masterKey);
    Parse.Cloud.useMasterKey();
    Parse.serverURL = serverUrl;

    return {
        createProvinces: createProvinces,
        createDistricts: createDistricts,
        createLocalities: createLocalities,
        createBanks: createBanks,
        createKeyValue: createKeyValue,
        createVehicleModels: createVehicleModels,
        createCompanies: createCompanies
    };
};

function createProvinces(jsonFile) {
    readFile(jsonFile, function (provinces) {
        var parseProvinces = provinces.map(function (p) {
            var parseProvince = new Parse.Object('Province');
            parseProvince.set('name', p.Name);
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(false);
            parseProvince.setACL(acl);
            return parseProvince;
        });

        Parse.Object.saveAll(parseProvinces, {
            success: function (savedProvinces) {
                var newProvinces = [];
                savedProvinces.forEach(function (p, i) {
                    var prevProv = provinces[i];
                    newProvinces.push({
                        Id: prevProv.Id,
                        Name: prevProv.Name,
                        ObjectId: p.id,
                        CreatedAt: p.createdAt,
                        UpdatedAt: p.createdAt,
                        LocallyUpdatedAt: p.createdAt
                    });
                });
                writeFileAsNew(jsonFile, newProvinces);
            },
            error: console.log
        });
    });
}

function createLocalities(distFile, locFile) {
    var ParseDistrict = Parse.Object.extend('District');
    readFile(distFile, function (dists) {
        var locs = require('./data/localities');
        var parseLocs = locs.map(function (l) {
            var parseLoc = new Parse.Object('Locality');
            parseLoc.set('name', '' + l.Name);
            parseLoc.set('district', ParseDistrict.createWithoutData(dists.filter(function (d) {
                return d.Id === l.DistrictId;
            })[0].ObjectId));
            parseLoc.setACL(getPublicACL());
            console.log(parseLoc);
            return parseLoc;
        });
        Parse.Object.saveAll(parseLocs, {
            success: function (savedLocs) {
                var newLocs = [];
                savedLocs.forEach(function (l, i) {
                    var newLoc = locs[i];
                    newLoc.ObjectId = l.id;
                    newLoc.CreatedAt = l.createdAt;
                    newLoc.UpdatedAt = l.createdAt;
                    newLoc.LocallyUpdatedAt = l.createdAt;
                    console.log(newLoc);
                    newLocs.push(newLoc);
                });
                writeFileAsNew(locFile, newLocs);
            },
            error: console.log
        });
    });
}

function createDistricts(provFile, distFile) {
    var ParseProvince = Parse.Object.extend('Province');
    readFile(provFile, function (provs) {
        readFile(distFile, function (dists) {
            var parseDists = dists.map(function (d) {
                var parseDist = new Parse.Object('District');
                parseDist.set('name', '' + d.Name);
                parseDist.set('province', ParseProvince.createWithoutData(provs.filter(function (p) {
                    return p.Id === d.ProvinceId;
                })[0].ObjectId));
                parseDist.setACL(getPublicACL());
                return parseDist;
            });
            Parse.Object.saveAll(parseDists, {
                success: function (savedDists) {
                    var newDists = [];
                    savedDists.forEach(function (d, i) {
                        var newDist = dists[i];
                        newDist.ObjectId = d.id;
                        newDist.CreatedAt = d.createdAt;
                        newDist.UpdatedAt = d.createdAt;
                        newDist.LocallyUpdatedAt = d.createdAt;
                        newDists.push(newDist);
                    });
                    writeFileAsNew(distFile, newDists);
                },
                error: console.log
            });
        });
    });
}

function createBanks(jsonFile) {
    readFile(jsonFile, function (banks) {
        var parseBanks = banks.map(function (b) {
            var parseBank = new Parse.Object('Bank');
            parseBank.set('name', '' + b.Name);
            parseBank.set('number', '' + b.Number);
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(false);
            parseBank.setACL(acl);
            return parseBank;
        });

        Parse.Object.saveAll(parseBanks, {
            success: function (savedBanks) {
                var newBanks = [];
                savedBanks.forEach(function (b, i) {
                    var prevBank = banks[i];
                    newBanks.push({
                        Id: prevBank.Id,
                        Name: prevBank.Name,
                        Number: prevBank.Number,
                        ObjectId: b.id,
                        CreatedAt: b.createdAt,
                        UpdatedAt: b.createdAt,
                        LocallyUpdatedAt: b.createdAt
                    });
                });
                writeFileAsNew(jsonFile, newBanks);
            },
            error: console.log
        });
    });
}

function createKeyValue(jsonFile, entityName) {
    readFile(jsonFile, function (provinces) {
        var parseProvinces = provinces.map(function (p) {
            var parseProvince = new Parse.Object(entityName);
            parseProvince.set('name', p.Name);
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(false);
            parseProvince.setACL(acl);
            return parseProvince;
        });

        Parse.Object.saveAll(parseProvinces, {
            success: function (savedProvinces) {
                var newProvinces = [];
                savedProvinces.forEach(function (p, i) {
                    var prevProv = provinces[i];
                    newProvinces.push({
                        Id: prevProv.Id,
                        Name: prevProv.Name,
                        ObjectId: p.id,
                        CreatedAt: p.createdAt,
                        UpdatedAt: p.createdAt,
                        LocallyUpdatedAt: p.createdAt
                    });
                });
                writeFileAsNew(jsonFile, newProvinces);
            },
            error: console.log
        });
    });
}

function createFullObject(jsonFile, entityName, mapToParse, mapFromParse) {
    readFile(jsonFile, function (provinces) {
        var parseProvinces = provinces.map(mapToParse);

        Parse.Object.saveAll(parseProvinces, {
            success: function (savedProvinces) {
                var newProvinces = [];
                savedProvinces.forEach(function (p, i) {
                    var prevProv = provinces[i];
                    prevProv.ObjectId = p.id;
                    prevProv.CreatedAt = p.createdAt;
                    prevProv.UpdatedAt = p.createdAt;
                    prevProv.LocallyUpdatedAt = p.createdAt;
                    newProvinces.push(prevProv);
                });
                writeFileAsNew(jsonFile, newProvinces);
            },
            error: console.log
        });
    });
}

function createCompanies(jsonFile) {
    createFullObject(
        jsonFile,
        'Company',
        function (c) {
            var parseCompany = new Parse.Object('Company');
            parseCompany.set('name', c.Name);
            parseCompany.set('phone', '' + c.Phone);
            parseCompany.set('notes', c.Notes);
            parseCompany.set('active', !!c.Active);
            parseCompany.set('email', c.EMail);
            parseCompany.set('cuit', c.CUIT);
            parseCompany.set('liqDay1', c.LiqDay1);
            parseCompany.set('liqDay2', c.LiqDay2);
            parseCompany.set('paymentDay1', c.PaymentDay1);
            parseCompany.set('paymentDay2', c.PaymentDay2);
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(false);
            parseCompany.setACL(acl);
            return parseCompany;
        }
    )
}

function createVehicleModels(jsonFile) {
    readFile('./data/brands.new.json', function (brands) {
        var ParseBrand = Parse.Object.extend('Brand');
        readFile('./data/vehicle-types.new.json', function (vehicleTypes) {
            var ParseVehicleType = Parse.Object.extend('VehicleType');
            createFullObject(
                jsonFile,
                'VehicleModel',
                function (vm) {
                    var parseVehicleModel = new Parse.Object('VehicleModel');
                    parseVehicleModel.set('name', vm.Name);
                    parseVehicleModel.set('origin', vm.Origin);
                    parseVehicleModel.set('brand', ParseBrand.createWithoutData(brands.filter(function (b) {
                        return b.Id === vm.BrandId;
                    })[0].ObjectId));
                    parseVehicleModel.set('vehicleType', ParseVehicleType.createWithoutData(vehicleTypes.filter(function (b) {
                        return b.Id === vm.VehicleTypeId;
                    })[0].ObjectId));
                    var acl = new Parse.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setPublicWriteAccess(false);
                    parseVehicleModel.setACL(acl);
                    return parseVehicleModel;
                }
            )

            function createFullObject(jsonFile, entityName, mapToParse, mapFromParse) {
                provinces = require(jsonFile);
                var parseProvinces = provinces.map(mapToParse);

                Parse.Object.saveAll(parseProvinces, {
                    success: function (savedProvinces) {
                        var newProvinces = [];
                        savedProvinces.forEach(function (p, i) {
                            var prevProv = provinces[i];
                            prevProv.ObjectId = p.id;
                            prevProv.CreatedAt = p.createdAt;
                            prevProv.UpdatedAt = p.createdAt;
                            prevProv.LocallyUpdatedAt = p.createdAt;
                            newProvinces.push(prevProv);
                        });
                        writeFileAsNew(jsonFile, newProvinces);
                    },
                    error: console.log
                });
            }
        });
    });
}

function readFile(fileName, callback) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        callback(JSON.parse(data));
    });
}

function writeFileAsNew(fileName, data) {
    var jsonIx = fileName.indexOf('.json');
    var newFileName = fileName.substring(0, jsonIx) + '.new.json';
    fs.writeFile(newFileName, JSON.stringify(data), function (err) {
        if (err) {
            throw err;
        }
        console.log('Save file to ' + newFileName);
    });
}

function getPublicACL() {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    return acl;
}