var FP = FP || {};

FP.init = function () {
    stockcode = "";
    var workorders = new FP.WorkOrders();
    var supplier = new FP.Supplier();

    supplier.init();
    workorders.init();
    

}

FP.init();

