
FP.Supplier = function () {
    this.sCode = null;
    this.dicon = L.ExtraMarkers.icon({
        icon: 'ion-help',
        markerColor: 'red',
        shape: 'star',
        prefix: 'fa'
    });
};

var suppliericon = L.ExtraMarkers.icon({
    icon: 'shipping icon',
    markerColor: 'orange',
    shape: 'penta',
    prefix: 'fa'
});

FP.Supplier.prototype = Object.create(FP.Component.prototype);
FP.Supplier.prototype.constructor = FP.Supplier.prototype.constructor;

FP.Supplier.prototype.getData = function () {
    var self = this;
    var filename = "SupplTop200";
    if (self.sCode)
        filename = "SupplTop200PerItem";
    $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (datat) {
        filename = "WarehouseDemands";
        if (self.sCode)
            filename = "WarehouseDemandsPerItem";

        $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (data1) {

        var data = [], alldata = [];
        //self.data = [];
        //self.alldata = [];
        if (self.sCode)
            datat = datat[self.sCode];

        if (datat.length > 0) {
            if (self.sCode) {
                var tmpdata = [];
                $.each(datat, function (key, value) {
                    tmpdata.push(value.Supplier);
                });
                data = tmpdata;
                alldata = tmpdata;
            }
            else {
                data = datat;
                alldata = datat;
            }
        }
            ////set suppliers performance
        var dynatable = $('#SupplierAndPerformance').dynatable({
            dataset: {
                records: data
            },
            features: {
                search: false,
                perPageSelect: false,
                recordCount: false,
            }
        }).data('dynatable');
        dynatable.settings.dataset.originalRecords = data;
        dynatable.process();

        //////////////////
        
            var buckets = null,demand=[];
            if (self.sCode)
                buckets = data1[self.sCode].aggregations.warehouse_demand.buckets;
            else
                buckets = data1.aggregations.warehouse_demand.buckets;

            $.each(buckets, function (key, value) {
                var Lon = value.warehouse_location.hits.hits[0]._source.WarehouseLocation.lon;
                var Lat = value.warehouse_location.hits.hits[0]._source.WarehouseLocation.lat;
                var name = value.warehouse_location.hits.hits[0]._source.Warehouse.Name;
                demand.push({ "ID": value.key, "Amount": value.doc_count, "Name": name, "Lat": Lat, "Lon": Lon });
            });

            /////////////////

            if (!self.sCode) {
                FP.map = L.map('Locations').setView([-28.2812123, 137.1247712], 3);
            }
            else {
                FP.map.eachLayer(function (layer) {
                    FP.map.removeLayer(layer);
                });
            }
            var esriWorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            }).addTo(FP.map);

            $.each(data, function (key, value) {
                if (value["Lat"] == null) {
                    return true;
                }
                SupplierMarker = L.marker([value["Lat"], value["Lon"]], { icon: suppliericon });
                SupplierPopup = new L.popup().setContent(value.SupplierName).setLatLng(SupplierMarker.getLatLng());
                SupplierMarker.bindPopup(SupplierPopup);
                SupplierMarker.addTo(FP.map);

            });
            $.each(demand, function (key, value) {
                if (value["Lat"] == null) {
                    return true;
                }
                DemandMarker = L.marker([value["Lat"], value["Lon"]], { icon: self.dicon });
                DemandPopup = new L.popup().setContent(value.Amount).setLatLng(DemandMarker.getLatLng());
                DemandMarker.bindPopup(DemandPopup);
                DemandMarker.addTo(FP.map);
            });
        });

    });
};

FP.Supplier.prototype.getElasticData = function () {
    var self = this;
    var filename = "PurchaseOrder";
    if (self.sCode)
        filename = "PurchaseOrderPerItem";
    $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (data) {
        var topsuppliers = [];
        if (self.sCode)
            data = data[self.sCode];
        buckets = data.aggregations.suppliers.buckets;

        $.each(buckets, function (key, value) {
            topsuppliers.push([value.supplier_name.hits.hits[0]._source.Supplier.Name, value.doc_count]);
        });
        
        //////////////
        $(function () {
            var options = {
                chart: {
                    renderTo: 'TopSuppliers',
                    type: 'column',
                    height: '400'
                },
                title: {
                    text: ''
                },
                style: {
                    fontFamily: 'Lato'
                },
                series: [{
                    name: 'Top Suppliers'
                }],
                xAxis: {
                    categories: topsuppliers
                },
                yAxis: {
                    title: {
                        text: 'Amount of Purchases'
                    }
                }
            };

            options.series[0].data = topsuppliers;

            var chart = new Highcharts.Chart(options);

        });
    });
};



FP.Supplier.prototype.init = function (callback) {
    var self = this;

    $('body').on('fp:stockcode.changed', function (data) {
        self.sCode = data.stockCode;
        
        self.getData();
        self.getElasticData();
        
    });
    /////////////////////////////
    self.getData();
    self.getElasticData();
}