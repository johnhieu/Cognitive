   
// Initialize the json file first but not calling it yet
var FP = FP || {};

FP.init = function () {
    stockcode = "";
    var workorders = new FP.WorkOrders();
    var supplier = new FP.Supplier();

    supplier.init();
    workorders.init();


}

// Initialize variables to be used in the process of initializing widgets
var condition = false;
var customWidgets = new Array();
var defaultWidgets = ["ItemSelection.txt", "TimeAndCost.txt", "CostTrend.txt", "NumberOfRepairs.txt","WorkOrders.txt", "Demand_Supplier Locations.txt", "Top_5_Suppliers.txt", "Suppliers_and_Suppliers_Performance.txt", "Failure_Causes.txt"];

// These variables are not for first time user
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
                    sortable: true,
                    unpin: false
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

// Reject the dashboard by clicking the Undo 
function RejectDashboard()
{
    $("#notice").empty();
    $("#notice").append("<div class=\"alert alert-info\">Thank you for your feedback!</div>");
    $("#firstRow").empty();
    $("#secondRow").empty();
    $("#thirdRow").empty();
    undo = true;

   
    // Get the previous order of widgets
    var tokens = previousOrder.split(" ");
    
    customWidgets = [];
    for (var i = 0; i < tokens.length; i++) {
       
        customWidgets.push(defaultWidgets[parseInt(tokens[i]) - 1]);
      
    }
    
    // Add widgets to each row
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
                            
                          
                            // Store the current order to the database
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
                        // so this condition is to check if they are the same. If same, just need to push the result to the array 
                        // This is the second phase of the recommendation, recommend based on the last session's activities
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
                        // If the improved order is different from the order in the last session then we have a pop up message at the top to notify 
                        // users
                        if(previousOrder != improvedOrder)
                        {
                            $("#notice").append("<div class=\"well well-sm\">Based on the last session, the system has generated a new order for you to work easily. You can reject the new dashboard and use the previous one by click <button class=\"btn btn-primary btn-md\"  style=\"font-size: 18px;\"onclick=\"RejectDashboard()\">Undo</button> . The new dashboard will be recorded once you left this page. </div>");
                        }
                       
                    }
                                          
                }

            }
        });
  

}

$(document).ready(function () {
    firstTimeUserOrders();
    // After initializing, we will check the condition and callAjax to retreive the data from the server
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
        // Only for not first time user, when they go to another page, save the current order to the dashboard
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

