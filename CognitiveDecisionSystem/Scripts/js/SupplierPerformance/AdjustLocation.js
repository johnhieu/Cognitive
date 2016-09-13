   
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
var improvedOrder = "";
var previousOrder = "";
var firstTime = false;
var undo = false;

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
    else if (index == array.length )
    {
        FP.init();
    }
}


function RejectDashboard()
{
    $("#notice").empty();
    $("#notice").append("<div class=\"alert alert-info\">Thank you for your feedback!</div>");
    $("#firstRow").empty();
    $("#secondRow").empty();
    $("#thirdRow").empty();
    undo = true;

   

    var tokens = previousOrder.split(" ");
    
    customWidgets = [];
    for (var i = 0; i < tokens.length; i++) {
       
        customWidgets.push(defaultWidgets[parseInt(tokens[i]) - 1]);
      
    }
    
    
    for (var i = 0; i < 3; i++) {
        
        callAjax(customWidgets, "#firstRow", i);
    }

    for (var i = 3; i < 6; i++) {
        
        callAjax(customWidgets, "#secondRow", i);
    }


    for (var i = 6; i <= customWidgets.length; i++) {
       
        callAjax(customWidgets, "#thirdRow", i);
    }

   
}

function firstTimeUserOrders()
{
    // 2 possible outcomes: first time user and not first time user, so the string returns will be in 2 different forms
    // In order to distinguish between them, we have to split the string by using string.split() to return 2 results.

    var tokens;
    
        $.ajax({
            url: "../Functions/CheckFirstTimeUser/?username=" + window.username,
            async: false,
            success: function (result) {
               
                if (result != "") {
                    var tokens = result.split(" ");
                   
                    if (tokens.length == 1)
                    {
                        firstTime = true;
                        // Send an ajax to accept the new recommended widget and save it in the database 
                        condition = confirm("Do you want us to recommend a new dashboard for you?");
                        if (condition) {
                            var widget = result;
                            for (var i = 0; i < defaultWidgets.length; i++)
                            {
                                if(i != parseInt(result-1))
                                {
                                    
                                    widget += " " + (i+1).toString();
                                }
                            }
                            
                          

                            $.ajax({
                                url: "../Functions/StoreCurrentDashboard/?username=" + window.username + "&widgetID=" + widget,
                                async: false,
                                success: function (result) {
                                }
                            });
                            
                            var splits = widget.split(" ");
                            for (var i = 0; i < splits.length; i++) {
                                customWidgets.push(defaultWidgets[parseInt(splits[i])-1]);
                                
                            }

                          
                        }


                    }
                        // There are possibilitiy that the most used widget in the next login is the first recommended widget
                        // so this condition is to check if they are the same. If same, just need to push the result to the array once
                    else {
                        condition = true;

                        $.ajax({
                            url: "../Functions/GetLastWidgetOrder/?username=" + window.username,
                            async: false,
                            success: function (result) {
                                previousOrder = result;
                              
                            }
                        });                  
                        
                        for (var i = 0; i < tokens.length; i++) {   
                            customWidgets.push(defaultWidgets[parseInt(tokens[i]) - 1]);
                            
                        }
                        
                       

                        improvedOrder = result;
                        if(previousOrder != improvedOrder)
                        {
                            $("#notice").append("<div class=\"alert alert-info\">Based on the last session, the system has generated a new order for you to work easily. You can reject the new dashboard and use the previous one by click <a href=\"#\" onclick=\"RejectDashboard()\"><b>Undo</b></a> . The new dashboard will be recorded once you left this page. </div>");
                        }
                       
                    }
                                          
                }

            }
        });
  

}

$(document).ready(function () {
    firstTimeUserOrders();
    if (!condition) {
        
        for (var i = 0; i < 3; i++) {
            callAjax(defaultWidgets, "#firstRow", i);
        }

        for (var i = 3; i < 6; i++) {
            callAjax(defaultWidgets, "#secondRow", i);
        }


        for (var i = 6; i < defaultWidgets.length; i++) {
            callAjax(defaultWidgets, "#thirdRow", i);
        }
    }
    else {
        for (var i = 0; i < 3; i++) {
            callAjax(customWidgets, "#firstRow", i);
        }

        for (var i = 3; i < 6; i++) {
            callAjax(customWidgets, "#secondRow", i);
        }


        for (var i = 6; i < defaultWidgets.length; i++) {
            callAjax(customWidgets, "#thirdRow", i);
        }
    }

    window.onbeforeunload = function () {
        if(!undo & !firstTime)
        {
            $.ajax({
                url: "../Functions/StoreCurrentDashboard/?username=" + window.username + "&widgetID=" + improvedOrder,
                async: false,
                success: function (result) {
                }
            });
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



