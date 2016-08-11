   
// Initialize the json file first but not calling it yet
var FP = FP || {};

FP.init = function () {
    stockcode = "";
    var workorders = new FP.WorkOrders();
    var supplier = new FP.Supplier();

    supplier.init();
    workorders.init();


}

var condition = false;
var customWidgets = new Array();
var defaultWidgets = ["ItemSelection.txt", "TimeAndCost.txt", "CostTrend.txt", "NumberOfRepairs.txt","WorkOrders.txt", "Demand_Supplier Locations.txt", "Top_5_Suppliers.txt", "Suppliers_and_Suppliers_Performance.txt", "Failure_Causes.txt"];

//This function will call the Ajax request in the correct orders.
function callAjax(array, row, index)
{
    if (index < array.length) {
        $.ajax({
            url: "../DataFiles/WidgetInfo/" + array[index],
            async: false,
            success: function (result) {
                $(row).append(result);

                $('.panel').lobiPanel({
                    sortable: true
                });

                //callAjax(array, row, index + 1)
               
            }
        });
    }
    else if (index == array.length)
    {
        FP.init();
    }
}

function firstTimeUserOrders()
{
    $.ajax({
        url: "../RegularUser/CheckFirstTimeUser/?username=" + window.username,
        async: false,
        success: function (result) {
            if (result != "") {
                customWidgets.push(defaultWidgets[parseInt(result) - 1]);
                for (var i = 0; i < defaultWidgets.length; i++) {
                    if (i == (parseInt(result) - 1)) {
                        i++;
                    }
                    customWidgets.push(defaultWidgets[i]);
                }
                console.log(result);
                condition = confirm("Do you want us to recommend a new dashboard for you?");
                
            }
          
        }
    });
}

$(document).ready(function () {
    firstTimeUserOrders();
    if (!condition) {
        
        for (var i = 0; i < 4; i++) {
            callAjax(defaultWidgets, "#firstRow", i);
        }

        for (var i = 4; i < 7; i++) {
            callAjax(defaultWidgets, "#secondRow", i);
        }


        for (var i = 7; i < defaultWidgets.length; i++) {
            callAjax(defaultWidgets, "#thirdRow", i);
        }
    }
    else {
        for (var i = 0; i < 4; i++) {
            callAjax(customWidgets, "#firstRow", i);
        }

        for (var i = 4; i < 7; i++) {
            callAjax(customWidgets, "#secondRow", i);
        }


        for (var i = 7; i < defaultWidgets.length; i++) {
            callAjax(customWidgets, "#thirdRow", i);
        }
    }
    /*callAjax(defaultFirst, "#firstRow",0 );
    callAjax(defaultSecond, "#secondRow", 0);
    callAjax(defaultThird, "#thirdRow", 0);*/
    /*This function will be called after all the widgets have been setup probably. Also I prevent caching in 
       the controller so if users press the reload button, it will reload a page again. This will avoid 
       the situation when the widgets got caching and the order of widgets change.*/
    FP.init();
   

   
});

/*$(document).ready(function ()
{
   
    $.ajax({
        url: "../DataFiles/WidgetInfo/ItemSelection.txt",
        success: function (result) {
            $("#firstRow").append(result);

            $('.panel').lobiPanel({
                sortable: true
            });

           
        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/TimeAndCost.txt",
        success: function (result) {
            $("#firstRow").append(result);

            $('.panel').lobiPanel({
                sortable: true
            });


        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/CostTrend.txt",
        success: function (result) {
            $("#firstRow").append(result);
            $('.panel').lobiPanel({
                sortable: true
            });

           

        }
    });
   
    $.ajax({
        url: "../DataFiles/WidgetInfo/NumberOfRepairs.txt",
        success: function (result) {
            $("#firstRow").append(result);

            $('.panel').lobiPanel({
                sortable: true
            });


        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/WorkOrders.txt",
        success: function (result) {
            $("#secondRow").append(result);

            $('.panel').lobiPanel({
                sortable: true
            });


        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/Demand_Supplier Locations.txt",
        success: function (result) {
            $("#secondRow").append(result);


            $('.panel').lobiPanel({
                sortable: true
            });

        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/Top_5_Suppliers.txt",
        success: function (result) {
            $("#secondRow").append(result);


            $('.panel').lobiPanel({
                sortable: true
            });


        }
    });

    $.ajax({
        url: "../DataFiles/WidgetInfo/Suppliers_and_Suppliers_Performance.txt",
        success: function (result) {
            $("#thirdRow").append(result);


            $('.panel').lobiPanel({
                sortable: true
            });



        }
    });


    $.ajax({
        url: "../DataFiles/WidgetInfo/Failure_Causes.txt",
        success: function (result) {
            $("#thirdRow").append(result);

            $('.panel').lobiPanel({
                sortable: true
            });

        }
    });


    FP.init();
}); */



