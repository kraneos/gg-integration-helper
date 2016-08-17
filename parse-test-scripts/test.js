var dataMig = require('./data-migration');

require('./create-test2')('http://seggu-api-test.herokuapp.com/parse/', 'seggu-api', 'SegguMasterKey');
var dm = dataMig('http://seggu-api-test.herokuapp.com/parse/', 'seggu-api', 'SegguMasterKey');
// dm.createProvinces('./data/provinces.json');
// dm.createDistricts('./data/provinces.new.json', './data/districts.json');
// dm.createLocalities('./data/districts.new.json', './data/localities.json');
// dm.createBanks('./data/banks.json');
// dm.createKeyValue('./data/bodyworks.json', 'Bodywork');
// dm.createKeyValue('./data/brands.json', 'Brand');
// dm.createKeyValue('./data/casualtytypes.json', 'CasualtyType');
// dm.createKeyValue('./data/uses.json', 'Use');
// dm.createKeyValue('./data/vehicle-types.json', 'VehicleType');
// dm.createCompanies('./data/companies.json');
// dm.createVehicleModels('./data/vehicle-models.js');
