
FP.WorkOrders = function () {
    this.data = [];
    this.alldata = [];
    this.repairsovertime = [];
    this.failureCauses = [];
    this.sCode = null;
    this.filter = {};
};


FP.WorkOrders.prototype = Object.create(FP.Component.prototype);
FP.WorkOrders.prototype.constructor = FP.WorkOrders.prototype.constructor;

FP.WorkOrders.prototype.getData = function () {
    var self = this;
    var filename = "WorkOrderTop200";
    if (self.sCode)
        filename = "WorkOrderTop200PerItem";

    $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (datat) {
        var data = [], alldata = [];
        if (self.sCode)
            datat = datat[self.sCode];

        data = [];
       alldata = [];
        if (datat.length > 0) {
            data = datat;
            alldata = datat;
        }
        ////////////
        var repairdata = [];
        $.each(data, function (key, value) {
            date = new Date(value.CreationDate);
            date = date.getTime();
            repairdata.push([date, value.ActualLabourCost]);
        });
        $(function () {
            $('#RepairCostTrend').highcharts('StockChart', {
                rangeSelector: {
                    selected: 10
                }, style: {
                    fontFamily: 'Lato'
                },

                title: {
                    text: ''
                },

                series: [{
                    name: 'Repairing Cost',
                    data: repairdata,
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    shadow: true
                }],
                xAxis: {

                    type: 'datetime',

                },
                yAxis: {
                    title: {
                        text: 'Repairing Cost'
                    },

                }

            });
        });

        /////////////////////
        var dynatable = $('#serial').dynatable({
            dataset: {
                records: data,
                perPageDefault: 9
            },
            features: {
                search: false,
                perPageSelect: false,
                recordCount: false

            }
        }).data('dynatable');



        dynatable.settings.dataset.originalRecords = data;
        dynatable.process();
        ///////////////////////
        var dynatable1 = $('#WorkOrders').dynatable({
            dataset: {
                records: data
            },

            features: {
                search: false,
                perPageSelect: false,
                recordCount: false,
            }
        }).data('dynatable');

        dynatable1.settings.dataset.originalRecords = data;
        dynatable1.process();

        //////////////////////
        count = 0;
        sumLeadtime = 0;
        sumCost = 0;
        $.each(data, function (key, value) {

            count += 1;
            temp = value.ActualLabourHours;
            if (temp != '') {
                sumLeadtime += parseFloat(value.ActualLabourHours);
            }
            else {
                sumLeadtime += 0;
            }
            sumCost += value.ActualLabourCost;
        });
        $('#AvgLeadTime')[0].innerHTML = (sumLeadtime / count).toFixed(2);
        $('#AvgCost')[0].innerHTML = (sumCost / count).toFixed(2);
    });
}
FP.WorkOrders.prototype.getFailureCauses = function () {
    var self = this;
    var filename = "WOFailureCause";
    if (self.sCode)
        filename = "WOFailureCausePerItem";

    $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (data) {
        var failureCauses = [];
        if (self.sCode)
            data = data[self.sCode];
        buckets = data.aggregations.failure_causes.buckets;
        $.each(buckets, function (key, value) {
            failureCauses.push([value.key, value.doc_count]);
        });
        //////////////////
        $('#FailureCause').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                width: '400',
                height: '400'

            }, style: {
                fontFamily: 'Lato'
            }, exporting: { enabled: false },
            title: {
                text: ''
            },
            tooltip: { enabled: false },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    size: "100%",
                    dataLabels: {
                        enabled: true,
                        distance: -15,
                        allowOverlap: false,
                        align: "center",

                        format: '<b>{point.name}</b>:<br>{point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver',
                    }
                }
            },
            series: [{
                name: 'Failure Causes',
                animation: false,
                innerSize: '50%',
                data: failureCauses
            }]
        });
    });
}
FP.WorkOrders.prototype.getRepairsPerYear = function () {
    var self = this;
    var filename = "WorkOrdersPerYear";
    if (self.sCode)
        filename = "WorkOrdersPerYearItem";
    $.getJSON("../DataFiles/SupplierPerformance/" + filename + ".json", function (data) {
        var repairsovertime = [];
        if (self.sCode)
            data = data[self.sCode];
        buckets = data.aggregations.repairs_per_year.buckets;
        $.each(buckets, function (key, value) {
            repairsovertime.push([value.key_as_string.substring(0,4), value.doc_count]);
        });
        ////////////////////
        var categories = [];
        $.each(repairsovertime, function (key, value) {
            categories.push(value[0]);
        });
        $(function () {
            var options2 = {
                chart: {
                    renderTo: 'RepairsPerYear',
                    type: 'column',
                    height: '400'
                },
                title: {
                    text: ''
                }, style: {
                    fontFamily: 'Lato'
                },
                series: [{
                    name: 'Repairs per Year'
                }],
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: 'Quantity repaired'
                    }
                }
            };

            options2.series[0].data = repairsovertime

            var repairChart = new Highcharts.Chart(options2);

        });
    });
  
}


FP.WorkOrders.prototype.init = function (callback) {
    var self = this;

    $('body').on('fp:stockcode.changed', function (data) {
        self.sCode = data.stockCode;
        self.getRepairsPerYear();
        self.getFailureCauses();
        self.getData();
    });

    /////////////////////////
    self.getRepairsPerYear();
    self.getFailureCauses();
    self.getData();
}

