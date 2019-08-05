const _maintenanceFullSite = (req, res, next) => {
    //For Emergency Maintenance - Disable all services.
    return res.status(503).send('The site is currently under maintenance. Please check back soon!');
};

module.exports = {
    fullSiteMaintenance: _maintenanceFullSite
};