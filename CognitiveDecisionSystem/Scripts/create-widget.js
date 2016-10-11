
    // Array of database or tables have been requested from the server

    // Temporary arrays to hold values from the request and will be displayed on the screen

    var tables = [];
var attrs = [];
var values = [];
var dashboards = [];
var dashboardids = [];
var tempReferencingTables = [];

// Chosen arrays of selected tables and attributes
var chosenTables = [];
var chosenConditions = [];
var chosenViews = [];
var chosenDatabase = "";
var finalQuery = "";

// Configuration for charts
var dimension = "";
var measure = "";
var title = "";
var xaxis = [];
var yaxis = [];

// Chart type
var chartType = "";
var stacking = false;

// This is only for temporary solution, should not be here, later will check tables or attributes
// if they are not empty then show the confirm
var firstTime = true;
var configureClicked = false;
var tableAdded = false;
var alreadyChosen = false;

// Get dashboard information for the current user and use it that information to save widget 
(function () {
    $.ajax({
        url: "../System/GetDashboard/?username="+"@User.Identity.Name",
        async: true,
        success: function (result) {
            var tokens = result.split(";");
            for(var i=0; i< tokens.length-1; i++)
            {
                var seperate = tokens[i].split(",");
                dashboards.push(seperate[0]);
                dashboardids.push(seperate[1]);
                        
                $("#dashboard-list").append("<option>"+seperate[0]+"</option>");
            }
        }
    });
           
})();

// Display the content for the panel in select a table, select a condition, select a display
function displayContent(id)
{
    if ($("#" + id).css("display") == "none")
    {
            
        if (chosenTables.length != 0) {
            $("#" + id).css("display", "block");
        }
        if (chosenDatabase != "") {
            $("#table-content").css("display", "block");
        }
    }
    else {
        closeContent(id)
    }
       
       
}

// Close the content for the panel in select a table, select a condition, select a display
function closeContent(id) {
    $("#" + id).css("display", "none");
}

// Enable Add a Grouping section (not currently in used)
function enableAttr() {
    var value = $("#view-select").val();
       
    if (value != "raw") {
        $("#grouping-other-view").prop("disabled", false);
    }
    else
    {
        $("#grouping-other-view").prop("disabled", true);
    }
}

function reset(option)
{
    var condition = true;
    switch(option)
    {
        case 'database':
            // Reset all the things when a user chose another database. Consider we only works with one table only
            condition = confirm("Changing database will remove any current selection. Do you want to proceed?");
            if (condition) {
                tables = []
                attrs = [];
                xaxis = [];
                yaxis = [];
                tempReferencingTables = [];

                chosenDatabase = "";
                chosenTables = [];
                chosenConditions = [];
                chosenViews = [];

                chartType = "";
                stacking = false;
                configureClicked = false;
                alreadyChosen = false;

                // Delete all the badge, options, drop down
                $("#table-badge-selection").empty();
                $("#table-select").empty();
                $("#attribute-select").empty();
                $("#attribute-other-view").empty();
                $("#condition-badge-selection").empty();
                $("#view-badge-selection").empty();
                $("#chart-badge-selection").empty();
                $("#pie-value-name").empty();
                $("#pie-value").empty();
                $("#x-axis").empty();
                $("#y-axis").empty();
                $("#link-referenced-tables").empty();
                $("#xaxis-badge-selection").empty();
                $("#yaxis-badge-selection").empty();

                $("#data").val('');
                // Got bug: Unable to get property 'style' of undefined or null reference
                $("#chart-visualization").empty();


                // Close all contents
                closeContent("table-content");
                closeContent("condition-content");
                closeContent("view-content");


                $("#table-select").append("<option selected disabled>-- Select an option --</option>");
                $("#attribute-select").append("<option selected disabled>-- Select an option --</option>");
                $("#attribute-other-view").append("<option selected disabled>-- Select an option --</option>");
                $("#pie-value-name").append("<option selected disabled>-- Select an option -- </option>");
                $("#pie-value").append("<option selected disabled>-- Select an option --</option>");
                $("#x-axis").append("<option selected disabled>-- Select an option --</option>");
                $("#y-axis").append("<option selected disabled>-- Select an option --</option>");

                // Disable visualization options
                $("#pie-chart").css("background-color", "");
                $("#pie-chart").addClass("disabled")
                $("#area-chart").addClass("disabled")
                $("#area-chart").css("background-color", "");
                $("#line-chart").addClass("disabled")
                $("#line-chart").css("background-color", "");
                $("#column-chart").addClass("disabled")
                $("#column-chart").css("background-color", "");

                $("#attribute-select").prop("disabled", true);
                $("#pie-value-name").prop("disabled", true);
                $("#pie-value").prop("disabled", true);
                $("#x-axis").prop("disabled", true);
                $("#y-axis").prop("disabled", true);
            }
            break;
        case 'table':
               
            attrs = [];
            xaxis = [];
            yaxis = [];

               
            chosenTables = [];
            chosenConditions = [];
            chosenViews = [];

            chartType = "";
            stacking = false;
            configureClicked = false;
            alreadyChosen = false;

            // Delete all the badge, options, drop down
            $("#table-badge-selection").empty();
               
            $("#attribute-select").empty();
            $("#attribute-other-view").empty();
            $("#condition-badge-selection").empty();
            $("#view-badge-selection").empty();
            $("#chart-badge-selection").empty();
            $("#pie-value-name").empty();
            $("#pie-value").empty();
            $("#x-axis").empty();
            $("#y-axis").empty();
            $("#link-referenced-tables").empty();
            $("#xaxis-badge-selection").empty();
            $("#yaxis-badge-selection").empty();

            $("#data").val('');
            // Got bug: Unable to get property 'style' of undefined or null reference
            $("#chart-visualization").empty();


            // Close all contents
            closeContent("condition-content");
            closeContent("view-content");
        
            $("#attribute-select").append("<option selected disabled>-- Select an option --</option>");
            $("#attribute-other-view").append("<option selected disabled>-- Select an option --</option>");
            $("#pie-value-name").append("<option selected disabled>-- Select an option -- </option>");
            $("#pie-value").append("<option selected disabled>-- Select an option --</option>");
            $("#x-axis").append("<option selected disabled>-- Select an option --</option>");
            $("#y-axis").append("<option selected disabled>-- Select an option --</option>");

            // Disable visualization options
            $("#pie-chart").css("background-color", "");
            $("#pie-chart").addClass("disabled")
            $("#area-chart").addClass("disabled")
            $("#area-chart").css("background-color", "");
            $("#line-chart").addClass("disabled")
            $("#line-chart").css("background-color", "");
            $("#column-chart").addClass("disabled")
            $("#column-chart").css("background-color", "");

            $("#attribute-select").prop("disabled", true);
            $("#pie-value-name").prop("disabled", true);
            $("#pie-value").prop("disabled", true);
            $("#x-axis").prop("disabled", true);
            $("#y-axis").prop("disabled", true);
            break;
    }
       
    return condition;
}
    
// Convert JSON object to JavaScript object
function convertToJavaScriptObject(data)
{
    return JSON.parse(JSON.stringify(data));

}

/*We will use the chosenDatabase varible to send an ajax request to the server to retreive a list of
  tables in that database. For now we will unlock the table selection input
 */
function selectDatabase()
{
        
    if (!firstTime) {
        var condition = reset('database');
          
    }
    else {
        condition = true;
        firstTime = false;

           
    }

    chosenDatabase = $("#database-select option:selected").val();

    if (condition)
    {
        $.getJSON("http://localhost:50931/Service/GetTables(Database='"+chosenDatabase+"')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                   
                tables.push(obj.value[i]);
                $("#table-select").append("<option>" + obj.value[i] + "</option>");
            }
        });
    }

    // Open the table content automatically
    displayContent("table-content");
    $("#table-select").prop("disabled", false);
}

function selectTable()
{

    // table Object that stores name and referenced tables
    var table = new Object();
    table.referencedTables = new Array();
    table.referencingTables = new Array();
        
    var chosenTable = $("#table-select option:selected").text();
        
    // Conditions to choose one table at a time
    if (alreadyChosen)
    {

        reset('table');
    }
      

    /*Same thing with select a database. We will end an ajax request to hold a list of attributes*/
    if (!alreadyChosen && chosenTable != "-- Select an option --") {
        alreadyChosen = true;
        table.name = chosenTable;
        $.getJSON("http://localhost:50931/Service/GetAttributes(Database='" + chosenDatabase + "',Table='" + chosenTable + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                var tokens = obj.value[i].split(" ");
                if (tokens.length != 3) {
                    // Insert attrs object that will store attribute's name and attribute'type
                    var attribute = new Object();
                    attribute.name = tokens[0];
                    attribute.belongsTo = chosenTable;
                    attribute.tableType = "normal";
                    switch (tokens[1]) {
                        case "int":
                            attribute.type = "Number";
                            break;
                        case "varchar":
                            attribute.type = "Word";
                            break;
                        case "date":
                            attribute.type = "Date";
                            break;
                    }

                    $("#attribute-select").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") ("+ attribute.belongsTo+")</option>");
                    $("#attribute-other-view").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                    attrs.push(attribute);
                }
            }
        });

        // Information about referenced tables in the selected table
        $.getJSON("http://localhost:50931/Service/GetReferencedTables(Database='" + chosenDatabase + "',Table='" + chosenTable + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for(var i=0; i< obj.value.length; i++)
            {
                    
                $("#link-referenced-tables").append("<li><a href=\"javascript:selectReferencedTable('"+obj.value[i]+"','"+chosenTable+"');\">"+obj.value[i]+"</a></li>");
            }
            

        });

        // Information about referencng tables in the selected table
        $.getJSON("http://localhost:50931/Service/GetTablesReferencingTable(Database='" + chosenDatabase + "',Table='" + chosenTable + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                var tokens = obj.value[i].split(" ");
                // If there is a many-to-many relationship, then we need to display the other linked table not the table created by many-to-many relationship
                if (tokens.length > 1)
                {
                    var tempTable = new Object();
                    tempTable.joinTable = tokens[0];
                    tempTable.referencingTables = new Array();
                    for (var j = 2; j < tokens.length; j++)
                    {
                        tempTable.referencingTables.push(tokens[j]);
                        $("#link-referenced-tables").append("<li><a href=\"javascript:selectReferencingTable('" + tokens[j] + "','" + chosenTable + "');\">" + tokens[j] + "</a></li>");
                    }
                        
                    tempReferencingTables.push(tempTable);
                }
                    // Display the link table normally 
                else {
                    var tempTable = new Object();
                    tempTable.joinTable = "";
                    tempTable.referencingTables = new Array();
                       
                    tempTable.referencingTables.push(tokens[0]);
                    $("#link-referenced-tables").append("<li><a href=\"javascript:selectReferencingTable('" + tokens[0] + "','" + chosenTable + "');\">" + tokens[0] + "</a></li>");
                        

                    tempReferencingTables.push(tempTable);
                }
                    
            }
        });

        $("#table-badge-selection").append("<span id=\"" + chosenTable + "-table\" class=\"badge\">" + chosenTable + " <a href=\"javascript:removeAttribute('table','" + chosenTable + "')\">&times;</a></span> ");
        // Add a badge to inform the user that this table has been selected
            
        chosenTables.push(table);
           
        $("#attribute-select").prop("disabled", false);
            
        // Open view and condition content automatically
        displayContent("view-content");
        displayContent("condition-content");
    }
}

// Function that reuses the selectTable function code to link other related tables together, for referencing table
function selectReferencingTable(referencingTable, chosenTable) {

    var joinTable = new Object();
    joinTable.manyToManyRelationship = false;
    joinTable.name = "";

    var alreadyChosen = false;

    // If already chosen, we dont add anymore
    for (var i = 0; i < chosenTables.length; i++) {
        for (var j = 0; j < chosenTables[i].referencingTables.length; j++) {
            if (referencingTable == chosenTables[i].referencingTables[j]) {
                alreadyChosen = true;
            }
        }

    }

    // Second condition is that because of the limitation of how many tables that we can reference. Only 2 tables can be linked at a time
    // Add more than 2 will cause API to send an error message
    if (chosenTables[0].referencingTables.length == 2)
    {
        alreadyChosen = true;
    }

        

    // Check if there is a table in the many to many relationship
    for (var i = 0; i < tempReferencingTables.length; i++)
    {
        if(tempReferencingTables[i].referencingTables.indexOf(referencingTable) != -1)
        {
            if(tempReferencingTables[i].joinTable != "")
            {
                joinTable.manyToManyRelationship = true;
            }
        }
    }

    // Reused the code the in selectTable function, replace the chosenTable attribute with value in the parameter
    if (!alreadyChosen) {
        $.getJSON("http://localhost:50931/Service/GetAttributes(Database='" + chosenDatabase + "',Table='" + referencingTable + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                var tokens = obj.value[i].split(" ");
                if (tokens.length != 3) {
                    var attribute = new Object();
                    attribute.name = tokens[0];
                    attribute.belongsTo = referencingTable;
                    attribute.tableType = "referencing";
                    switch (tokens[1]) {
                        case "int":
                            attribute.type = "Number";
                            break;
                        case "varchar":
                            attribute.type = "Word";
                            break;
                        case "date":
                            attribute.type = "Date";
                            break;
                    }
                    attrs.push(attribute);

                    $("#attribute-select").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                    $("#attribute-other-view").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                }
            }
        });

        // Add a badge to inform the user that this table has been selected
        $("#table-badge-selection").append("<span id=\"" + referencingTable + "-referencingTable\"  class=\"badge\">" + referencingTable + " ( " + chosenTable + "'s referencing table)<a href=\"javascript:removeAttribute('referencingTable','" + referencingTable + "')\">&times;</a> </span> ");
        for (var i = 0; i < chosenTables.length; i++) {

            if (chosenTables[i].name == chosenTable) {
                chosenTables[i].referencingTables.push(referencingTable);
                   
                break;
            }
        }


    }

    // Add attributes from join table in many to many relationship
    if (joinTable.manyToManyRelationship) {
        $.getJSON("http://localhost:50931/Service/GetAttributes(Database='" + chosenDatabase + "',Table='" + joinTable.name + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                var tokens = obj.value[i].split(" ");
                if (tokens.length != 3) {
                    var attribute = new Object();
                    attribute.name = tokens[0];
                    attribute.belongsTo = joinTable.name;
                    attribute.tableType = "join";
                    switch (tokens[1]) {
                        case "int":
                            attribute.type = "Number";
                            break;
                        case "varchar":
                            attribute.type = "Word";
                            break;
                        case "date":
                            attribute.type = "Date";
                            break;
                    }
                    attrs.push(attribute);

                    $("#attribute-select").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                    $("#attribute-other-view").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                }
            }
        });
    }

}


// Function that reuses the selectTable function code to link other related tables together
function selectReferencedTable(referencedTable, chosenTable)
{
      
        
    var alreadyChosen = false;
    for (var i = 0; i < chosenTables.length; i++) {
        for (var j = 0; j < chosenTables[i].referencedTables.length; j++)
        {
            if (referencedTable == chosenTables[i].referencedTables[j]) {
                alreadyChosen = true;
            }
        }
            
    }

    // Reused the code the in selectTable function, replace the chosenTable attribute with value in the parameter
    if (!alreadyChosen) {
        $.getJSON("http://localhost:50931/Service/GetAttributes(Database='" + chosenDatabase + "',Table='" + referencedTable + "')", function (data) {
            var obj = convertToJavaScriptObject(data);
            for (var i = 0; i < obj.value.length; i++) {
                var tokens = obj.value[i].split(" ");
                if (tokens.length != 3) {
                    var attribute = new Object();
                    attribute.name = tokens[0];
                    attribute.belongsTo = referencedTable;
                    attribute.tableType = "referenced";
                    switch (tokens[1]) {
                        case "int":
                            attribute.type = "Number";
                            break;
                        case "varchar":
                            attribute.type = "Word";
                            break;
                        case "date":
                            attribute.type = "Date";
                            break;
                    }
                    attrs.push(attribute);

                    $("#attribute-select").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                    $("#attribute-other-view").append("<option value=\"" + attribute.name + "\">" + attribute.name + " (" + attribute.type + ") (" + attribute.belongsTo + ")</option>");
                }
            }
        });
           
        // Add a badge to inform the user that this table has been selected
        $("#table-badge-selection").append("<span id=\"" + referencedTable + "-referencedTable\"  class=\"badge\">" + referencedTable + " ( " + chosenTable + "'s referenced table)<a href=\"javascript:removeAttribute('referencedTable','" + referencedTable + "')\">&times;</a> </span> ");
        for (var i = 0; i < chosenTables.length; i++)
        {
                
            if(chosenTables[i].name == chosenTable)
            {
                chosenTables[i].referencedTables.push(referencedTable);
                    
                break;
            }
        }    
    }      
      
}

// When user selects a column in the condition content, this function will show a glimpse of data that
// is in that column
function getData()
{
    $("#pre-data-table").empty();
    $("#pre-data-table").append("<table class=\"display\" id=\"preTableChart\" cellspacing=\"0\">   <thead id=\"pre-column-name\"> </thead>   </table> ");

    var data = [];
    var table = "";

    var chosenAttribute = $("#attribute-select option:selected").val();
    data.push({ "data": chosenAttribute });
    $("#pre-column-name").append("<th>" + chosenAttribute + "</th>");
    for (var i = 0 ; i < attrs.length; i++) {
        if (attrs[i].name == chosenAttribute) {
          
            table = attrs[i].belongsTo;
        }
    }

    var uriQuery = "http://localhost:50931/Service/" + table + "?$select=" + chosenAttribute;
    $('#preTableChart').DataTable({
        "responsive": true,
        "paging": true,
        "ordering": true,
        "processing": true,
        "lengthMenu": [[5], [5]],
        ajax:{
            url: uriQuery,
            dataSrc : "value"
        },
        "columns": data

    });

}

function selectCondition()
{
       
    if ($("#pre-data-table").attr("aria-expanded") == "true")
    {
        $("#preview").click();
    }

    var chosenAttribute = $("#attribute-select option:selected").val();
    var chosenOperation = $("#operation option:selected").text();
    var value = $("#data").val();

    var condition = new Object();
    condition.attr = chosenAttribute;
    condition.opertion = chosenOperation;
    condition.value = value;
    var finalCondition = chosenAttribute + " " + chosenOperation + " " + value;

    // No repeated condition
    var alreadyChosen = false;
    for (var i = 0; i < chosenConditions.length; i++) {

        if (finalCondition == chosenConditions[i]) {
            alreadyChosen = true;
        }
    }

    // Check if the condition is the same in the array we store
    if(!alreadyChosen && chosenAttribute != "-- Select an option --") {

        chosenConditions.push(condition.attr +" "+condition.opertion+" "+condition.value);
        $("#condition-badge-selection").append("<span id=\"" + chosenAttribute + "-condition\" class=\"badge\">" + finalCondition + "<a href=\"javascript:removeAttribute('condition','" + finalCondition + "')\">&times;</a></span>");
    }

}

function selectView()
{
    // Get the view and store in the array in the form example: Raw (name)
    var chosenAttribute = $("#attribute-other-view option:selected").text();
    var chosenView = $("#view-select option:selected").val();
    var tokens = chosenAttribute.split(" ");
    var alreadyChosen = false;
    for (var i = 0; i < chosenViews.length; i++) {

        if (chosenView + " (" + tokens[0] + ")" == chosenViews[i]) {
            alreadyChosen = true;
        }
    }

    if (!alreadyChosen && chosenAttribute != "-- Select an option --") {
            
            
        if (chosenViews.length != 0)
        {
               
            chosenViews.push(chosenView + " (" + tokens[0] + ")");
                
            $("#pie-value-name").append("<option value=\""+tokens[0]+"\">" + chosenAttribute + "</option>");
            $("#pie-value").append("<option  value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
            $("#x-axis").append("<option  value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
            $("#y-axis").append("<option  value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
        }
        else
        {
            // Append view attribute to the chart details
            $("#pie-value-name").empty();
            $("#pie-value").empty();
            $("#pie-value-name").append("<option selected disabled>-- Select an option --</option>");
            $("#pie-value").append("<option selected disabled>-- Select an option --</option>");

            $("#x-axis").empty();
            $("#y-axis").empty();
            $("#x-axis").append("<option selected disabled>-- Select an option --</option>");
            $("#y-axis").append("<option selected disabled>-- Select an option --</option>");



            $("#pie-value-name").append("<option value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
            $("#pie-value").append("<option value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
            $("#x-axis").append("<option value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");
            $("#y-axis").append("<option value=\"" + tokens[0] + "\">" + chosenAttribute + "</option>");

            var tokens = chosenAttribute.split(" ");
            chosenViews.push(chosenView + " (" + tokens[0] + ")");
                

        }
        $("#view-badge-selection").append("<span id=\"" + tokens[0] + "-view\" class=\"badge\">" + chosenView + " (" + tokens[0] + ") <a href=\"javascript:removeAttribute('view','" + tokens[0] + "')\">&times;</a></span>");

        // Enable or disable the conditions in the chart visualization based on number of columns selected
        var count = 0;
        for (var i = 0 ; i < chosenViews.length; i++) {
            switch (chosenViews[i].substring(0, 3)) {
                case "Raw":
                    count++;
                    break;
            }
        }

        switch(count)
        {
            case (0):
            case (1):
                $("#pie-chart").css("background-color", "");
                $("#pie-chart").addClass("disabled")
                $("#area-chart").addClass("disabled")
                $("#area-chart").css("background-color", "");
                $("#line-chart").addClass("disabled")
                $("#line-chart").css("background-color", "");
                $("#column-chart").addClass("disabled")
                $("#column-chart").css("background-color", "");
                break;
            default:
                $("#pie-chart").css("background-color", "white");
                $("#pie-chart").removeClass("disabled")
                $("#area-chart").css("background-color", "white");
                $("#area-chart").removeClass("disabled")
                $("#line-chart").css("background-color", "white");
                $("#line-chart").removeClass("disabled")
                $("#column-chart").css("background-color", "white");
                $("#column-chart").removeClass("disabled")
                break;
        }
    }
}

// Change chart type and enable options in the Chart Details panel
function changeChartType(type)
{
    var count = 0;
    for (var i = 0 ; i < chosenViews.length; i++) {
        switch (chosenViews[i].substring(0, 3)) {
            case "Raw":
                count++;
                break;
        }
    }
    chartType = type;

    if (count > 1 || chartType == "Table")
    {
        $("#chart-badge-selection").empty();
        $("#chart-badge-selection").append("<span id=\"" + chartType + "\"  class=\"badge\">" + chartType + " chart</span>");
        switch (chartType) {
            case "Table":
                query();
                break;
            case "Pie":
                $("#pie-value-name").prop("disabled", false);
                $("#pie-value").prop("disabled", false);
                $("#x-axis").prop("disabled", true);
                $("#y-axis").prop("disabled", true);
                break;
            case "Area":
            case "Line":
            case "Column":
                $("#pie-value-name").prop("disabled", true);
                $("#pie-value").prop("disabled", true);
                $("#x-axis").prop("disabled", false);
                $("#y-axis").prop("disabled", false);
                break;
            default:
                $("#pie-value-name").prop("disabled", true);
                $("#pie-value").prop("disabled", true);
                $("#x-axis").prop("disabled", true);
                $("#y-axis").prop("disabled", true);
                break;
        }
    }

}

// Query and display the result in a visualization
function query()
{
    $("#chart-visualization").empty();
    if (chosenViews.length == 0) {
        alert("Please choose at least 1 view");
        $("#chart-badge-selection").empty();
    }
    else if(chartType == "Pie" && (dimension == "" || measure == ""))
    {
        alert("Please select options for chart in Chart Details.");
    }
    else if(chosenTables != 0)
    {
        var uriQuery = "http://localhost:50931/Service/" + chosenTables[0].name;
        var selectClause = "$select=";
        var filterClause = "&$filter=";
        var expandClause = "&$expand=";
        var nestedSelectClause = "$select=";
        var nestedFilterClause = "$filter=";
        // This variable will be used for entities that contain a collection of other entites, for a single entity, we can just add it directly to filterClause
        var nestedFilterClause = "$filter=";
        // Define the select part of the query
        for(var i =0 ; i< chosenViews.length; i++)
        {
            switch(chosenViews[i].substring(0,3))
            {
                case "Raw":
                    var attribute = seperateBrackets(chosenViews[i]);
                        
                    var attrObj ;
                    for (var j = 0; j < attrs.length; j++)
                    {
                        if(attrs[j].name == attribute)
                        {
                            attrObj = attrs[j];
                            break;
                        }
                    }
                    if (attrObj.belongsTo == chosenTables[0].name)
                    {
                        selectClause += seperateBrackets(chosenViews[i]) + ",";
                    }
                        
                    break;
            }
        }

            
           

        // Define the filter part of the query
        for (var i = 0; i < chosenConditions.length; i++) {
                
            var tokens = chosenConditions[i].split(" ");
            var attribute;
            for (var j = 0; i < attrs.length; j++) {
                if (tokens[0] == attrs[j].name) {
                    attribute = attrs[j];
                    break;
                }
            }
               
            // Filter clause syntax
            if (attribute.belongsTo == chosenTables[0].name) {
                   
                // For main table
                switch (tokens[1]) {
                    case "=":
                        filterClause += tokens[0] + " eq " + tokens[2] + " and ";
                        break;
                    case ">":
                        filterClause += tokens[0] + " gt " + tokens[2] + " and ";
                        break;
                    case ">=":
                        filterClause += tokens[0] + " ge " + tokens[2] + " and ";
                        break;
                    case "<=":
                        filterClause += tokens[0] + " le " + tokens[2] + " and ";
                        break;
                    case "<":
                        filterClause += tokens[0] + " lt " + tokens[2] + " and ";
                        break;
                    case "contains":                          
                    case "endswith":
                    case "startswith":
                        filterClause += tokens[1] + "(" + tokens[0] + ",'" + tokens[2] + "')" + " and "
                        break;
                }
            }
            else if(attribute.tableType == "referenced") {
                // For referenced tables
                switch (tokens[1]) {
                    case "=":
                        filterClause += attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/"+ tokens[0] + " eq " + tokens[2] + " and ";
                        break;
                    case ">":
                        filterClause += attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/" + tokens[0] + " gt " + tokens[2] + " and ";
                        break;
                    case ">=":
                        filterClause += attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/" + tokens[0] + " ge " + tokens[2] + " and ";
                        break;
                    case "<=":
                        filterClause += attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/" + tokens[0] + " le " + tokens[2] + " and ";
                        break;
                    case "<":
                        filterClause += attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/" + tokens[0] + " lt " + tokens[2] + " and ";
                        break;
                    case "contains":
                    case "endswith":
                    case "startswith":
                        filterClause += tokens[1] + "(" + attribute.belongsTo.substring(0, attribute.belongsTo.lastIndexOf('s')) + "/" + tokens[0] + ",'" + tokens[2] + "')" + " and ";;
                        break;
                }
            }
   
        }


          
        filterClause = filterClause.substring(0, filterClause.lastIndexOf("and"));
            
        // Define the expand part of the query
        if (chosenTables[0].referencedTables.length == 0 && chosenTables[0].referencingTables.length == 0)
        {
            expandClause = "";
        }
        else {
            // For each referenced tables in the main table, we  will define the expand clause for each of them
                

            for(var i=0; i< chosenTables[0].referencedTables.length; i++)
            {
                // Define the $select=.... Attributes of the expand clause. For example: $expand=employees($select=....),....
                for (var j = 0 ; j < chosenViews.length; j++) {
                    switch (chosenViews[j].substring(0, 3)) {
                        case "Raw":
                            var attribute = seperateBrackets(chosenViews[j]);
                            var attrObj;
                            for (var k = 0; i < attrs.length; k++) {
                                if (attrs[k].name == attribute) {
                                    attrObj = attrs[k];
                                    break;
                                }
                            }

                            if (attrObj.belongsTo == chosenTables[0].referencedTables[i]) {
                                nestedSelectClause += seperateBrackets(chosenViews[j]) + ",";
                                empty = false;
                            }

                            break;
                    }

                     
                }

                   
                nestedSelectClause = nestedSelectClause.substring(0, nestedSelectClause.lastIndexOf(","));
                expandClause += chosenTables[0].referencedTables[i].substring(0, chosenTables[0].referencedTables[i].lastIndexOf('s'));
                if (nestedSelectClause.length > 8) {
                    expandClause += "(" + nestedSelectClause + "),";
                    nestedSelectClause = "$select=";
                }
                else {
                    expandClause += ",";
                    nestedSelectClause = "$select=";
                }
                    
            }

            // For each referencing table in the main table, we will define their own expand clause
            for (var i = 0; i < chosenTables[0].referencingTables.length; i++) {
                    
                for (var j = 0 ; j < chosenViews.length; j++) {
                    switch (chosenViews[j].substring(0, 3)) {
                        case "Raw":
                            var attribute = seperateBrackets(chosenViews[j]);
                            var attrObj;
                            for (var k = 0; i < attrs.length; k++) {
                                if (attrs[k].name == attribute) {
                                    attrObj = attrs[k];
                                    break;
                                }
                            }

                            if (attrObj.belongsTo == chosenTables[0].referencingTables[i]) {
                                nestedSelectClause += seperateBrackets(chosenViews[j]) + ",";
                                empty = false;
                            }

                            break;
                    }
                }

                // Define the $filter=.... Attributes of the expand clause. For example: $expand=employees($filter=Age gt 10....),....
                for (var j = 0 ; j < chosenConditions.length; j++) {
                    var tokens = chosenConditions[j].split(" ");
                    var attribute;
                    for (var k = 0; k < attrs.length; k++) {
                        if (tokens[0] == attrs[k].name) {
                            attribute = attrs[k];
                            break;
                        }
                    }

                    if(attribute.belongsTo == chosenTables[0].referencingTables[i])
                    {
                           
                        switch (tokens[1]) {
                            case "=":
                                nestedFilterClause += tokens[0] + " eq " + tokens[2] + " and ";
                                break;
                            case ">":
                                nestedFilterClause += tokens[0] + " gt " + tokens[2] + " and ";
                                break;
                            case ">=":
                                nestedFilterClause += tokens[0] + " ge " + tokens[2] + " and ";
                                break;
                            case "<=":
                                nestedFilterClause += tokens[0] + " le " + tokens[2] + " and ";
                                break;
                            case "<":
                                nestedFilterClause += tokens[0] + " lt " + tokens[2] + " and ";
                                break;
                            case "contains":
                            case "endswith":
                            case "startswith":
                                filterClause += tokens[1] + "(" + tokens[0] + ",'" + tokens[2] + "')" + " and "
                                break;
                        }
                    }
                }

                // Trim off unnessary texts
                nestedFilterClause = nestedFilterClause.substring(0, nestedFilterClause.lastIndexOf("and"));
                    
                nestedSelectClause = nestedSelectClause.substring(0, nestedSelectClause.lastIndexOf(","));
                expandClause += chosenTables[0].referencingTables[i];

                    
                // Checking the nested clauses and add to expand clause, then reset all the things and go to the next view
                if (nestedSelectClause.length > 8 && nestedFilterClause.length >8) {
                    expandClause += "(" + nestedSelectClause + ";"+nestedFilterClause+"),";
                }
                else if(nestedSelectClause.length > 8 && nestedFilterClause.length <= 8)
                {
                    expandClause += "(" + nestedSelectClause + "),";
                }
                else if (nestedSelectClause.length <= 8 && nestedFilterClause.length > 8)
                {
                    expandClause += "(" + nestedFilterClause + "),";
                }
                else {
                    expandClause += ",";           
                }
                nestedSelectClause = "$select=";
                nestedFilterClause = "$filter=";


            }
        }

        // Connect every clauses in the expand clause together
        /*  if (nestedFilterClause.length != 0 && nestedSelectClause != 0)
          {
              expandClause += "(" + nestedFilterClause + ";" + nestedSelectClause + "),";
          }
          else if(nestedFilterClause.length == 0 && nestedSelectClause == 0)
          {
              expandClause += ",";
          }
          else
          {
              expandClause += "("  + nestedSelectClause + "),";
          }
          */
          
                
        uriQuery += ("?"+selectClause +filterClause+expandClause);
   

        finalQuery = uriQuery;
        console.log(finalQuery);
            
        switch(chartType){
            case "":
            case "Table":
                // Only if user does not choose chart type, default option is just create a table
                if (chartType == "")
                {
                    $("#chart-badge-selection").append("<span class=\"badge\">Table chart</span>")
                }
                $("#chart-visualization").append(" <table class=\"display\" id=\"tableChart\" style=\"display: none;\" cellspacing=\"0\"  >  <thead id=\"column-name\"> </thead>  </table>           ");
    
                // Check to see if they are raw view
                var data = [];
                   
                if (chosenViews.length == 0)
                {
                        
                    for(var i =0; i< attrs.length; i++)
                    {
                            
                        data.push({ "data": attrs[i].name });
                        $("#column-name").append("<th>" + attrs[i].name + "</th>");
                           
                    }
                }
                else {
                    for (var i = 0 ; i < chosenViews.length; i++)
                    {                                 
                        if(chosenViews[i].search("Raw") != -1)
                        {
                            var chosen = seperateBrackets(chosenViews[i]);
                            data.push({ "data": chosen });
                            $("#column-name").append("<th>" + chosen + "</th>");
                               
                        }
                    }
                        
                }

                // Prepare the dataSet for the table
                var dataSet = [];
                $('#tableChart').DataTable({
                    "responsive": true,
                    "paging": true,
                    "ordering": true,
                    "processing": true,
                    "columns": data

                });
                var table = $('#tableChart').DataTable();

                // Instead of using the ajax in dataTables, we will seperate it down since it will have a potential where many tables are selected
                $.getJSON(uriQuery, function (result) {
                    var data = convertToJavaScriptObject(result);
                      
                    for (var i = 0 ; i < data.value.length; i++) {
                        var obj = "{";
                        // Used for repeating Collection in referencing table 
                        var tempAttributeList = [];
                        // We have to check the chosen attribute if it belongs to the main table or the referenced table. 
                        for (var j = 0; j < chosenViews.length; j++) {
                            if (chosenViews[j].search("Raw") != -1) {
                                var chosen = seperateBrackets(chosenViews[j]);
                                   

                                for (var k = 0; k < attrs.length; k++) {
                                    if (chosen == attrs[k].name) {
                                        // If it belongs to the main table we just need to push the data since in JSON the value for the attribute is not in another object
                                        // so the syntax to retreive is data.value[index of data][name of the chosen attribute]
                                        if (attrs[k].belongsTo == chosenTables[0].name) {
                              
                                            obj += '"' + chosen + '" : "' + data.value[i][chosen] + '",';
                                            tempAttributeList.push('"' + chosen + '" : "' + data.value[i][chosen] + '",');
                                            break;
                                        }
                                        else if(attrs[k].tableType == "referenced"){
                                            // If it belongs to the  table, we have to include another referenced object -> data.value[index of data][nameOfReferencedTable][the attribute name]
                                            var referencedTable = attrs[k].belongsTo.substring(0, attrs[k].belongsTo.lastIndexOf('s'));
                                               
                                            obj += '"' + chosen + '" : "' + data.value[i][referencedTable][chosen] + '",';
                                            tempAttributeList.push('"' + chosen + '" : "' + data.value[i][referencedTable][chosen] + '",');
                                            break;
                                        }
                                        else if(attrs[k].tableType == "referencing")
                                        {
                                            var referencingTable = attrs[k].belongsTo;
                                            // If the referencing table only contains 1 result then dont have to repeat the value again
                                            if (data.value[i][referencingTable].length == 1)
                                            {
                                                obj += '"' + chosen + '" : "' + data.value[i][referencingTable][0][chosen] + '",';
                                                tempAttributeList.push('"' + chosen + '" : "' + data.value[i][referencingTable][0][chosen] + '",');
                                            }
                                                // If the referencing contains more than 1 result than repeat the value
                                            else if(data.value[i][referencingTable].length > 1){
                                                    
                                                // Write out the result for the first value
                                                obj += '"' + chosen + '" : "' + data.value[i][referencingTable][0][chosen] + '"}';
                                                  
                                                // Repeat adding the second result by going through 
                                                for(var p=1; p< data.value[i][referencingTable].length ; p++)
                                                {
                                                        
                                                    for (var m = 0; m < tempAttributeList.length; m++)
                                                    {
                                                        obj += tempAttributeList[m];
                                                          
                                                    }
                                                    obj += '"' + chosen + '" : "' + data.value[i][referencingTable][p][chosen] + '",';
                                                }
                                            }
                                              
                                               
                                             
                                        }
                                            
                                    }
                                }
                                  
                            }
                               
                        }

                        // Specify the string as a json object then when adding to the table, using JSON.parse to make it as a json and draw it out
                        obj = obj.substring(0, obj.lastIndexOf(','));
                        obj += "}";
                    
                        var tokens = obj.split("}");
                           
                        table.row.add(JSON.parse(tokens[0] + "}")).draw();
                        
                        for (var j = 1; j < tokens.length; j++)
                        {
                            // Since we split the word by } so it always have a second token with an empty string, so we have to check the length of the string 
                            if (tokens[j].length != 0)
                            {
                                table.row.add(JSON.parse("{" + tokens[j] + "}")).draw();
                            }
                                
                        }
                            
                    }
                       
                    
                });
                   

                // Got bug: Unable to get property 'style' of undefined or null reference
                $("#tableChart").show();
                    
                break;
                // Create a pie chart
            case "Pie":
                   
                var options = {
                    chart: {
                        renderTo: "chart-visualization",
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    //tooltip: {
                    //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    // },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    title: {
                        text: title
                    },
                    series: [{
                        name: measure,
                        data: []
                            
                    }]
                };

                // Retreive data
                $.getJSON(uriQuery,  function(result) {
                    var data = convertToJavaScriptObject(result);
                        
                    for (var i = 0 ; i < result.value.length; i++)
                    {
                        var dimensionValue = "";
                        var measureValue = 0;
                        for(var attribute in attrs)
                        {
                              
                            // Loop through a set of attributes and check if dimension variable belongs in one of the referenced table or not
                            if (dimension == attrs[attribute].name)
                            {
                                // Belongs to main table
                                if (attrs[attribute].belongsTo == chosenTables[0].name)
                                {
                                    dimensionValue = data.value[i][dimension];
                                }
                                    // Belongs to referenced tables
                                else if(attrs[attribute].tableType == "referenced"){
                                    dimensionValue = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][dimension];
                                }
                                    // Belongs to referencing tables
                                else if (attrs[attribute].tableType = "referencing") {
                                    var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s')+1)];
                                    // Only account for those that have values. Since we are not sure if they are an array of values so checking must be done and add those values together
                                    if (tableReferencing.length > 0)
                                    { 
                                        dimensionValue = tableReferencing[0][dimension];
                                            
                                    }
                                        
                                }
                                /* Belongs to join table
                                else if()
                                {

                                }*/
                            }
                               
                                
                            // Same functions to check for measure variable
                            if (measure == attrs[attribute].name ) {
                                   
                                if (attrs[attribute].belongsTo == chosenTables[0].name) {
                                    measureValue = data.value[i][measure];
                                }
                                else if (attrs[attribute].tableType == "referenced") {
                                    measureValue = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][measure];
                                }
                                else if (attrs[attribute].tableType == "referencing") {           
                                    var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s') + 1)];
                                    if (tableReferencing.length > 0 ) {
                                        for (var j = 0; j < tableReferencing.length; j++) {
                                            measureValue += tableReferencing[j][measure];
                                        }
                                    }
                                }
                                // else if join table
                            }
                        }
                            
                        if (dimensionValue.length != 0)
                        {
                            options.series[0].data.push({ name: dimensionValue, y: parseInt(measureValue) });
                        }
                            
                             
                    }
                     
                    var chart = new Highcharts.Chart(options);
                });


                   
                break;
                // Create an area chart
            case 'Area':
                var options = {
                    chart: {
                        renderTo: "chart-visualization",
                        type: 'area'
                    },

                    //tooltip: {
                    //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    // },
                    title: {
                        text: title,
                    },
                    xAxis: {
                        title: {
                            text: xaxis[0]
                        },
                        categories: []     
                    },
                    // 2 axis, 1 y-axis is from 0-500 and the other one from 0 to the maximum value of the data which will be calculated
                    // during the process of getting value from the JSON
                    yAxis: [{
                        min:0,
                        max: 500,
                        title:{
                            text: 'Hundreds (< 1000)'
                        },
                        labels:{
                            overflow: 'justify'
                        }
                    },
                    {
                        min: 0,
                            
                        title:{
                            text: 'Thousands ( > 1000)'
                        },
                        labels:{
                            overflow: 'justify'
                        },
                        opposite: true
                    }],
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                      
                    credits: {
                        enabled: false
                    },
                    series: []
                };
                configuringChartData(options, uriQuery);
                   
                break;
                // Create a column chart
            case 'Column':

                // Initializa chart by setting variable options
                var options = {
                    chart: {
                        renderTo: "chart-visualization",
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'column'
                    },
                    //tooltip: {
                    //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    // },
                    title: {
                        text: title,

                    },
                       

                    xAxis: {
                        title: {
                            text: xaxis[0]
                        },
                        categories: []
                            
                    },
                    // 2 axis, 1 y-axis is from 0-500 and the other one from 0 to the maximum value of the data which will be calculated
                    // during the process of getting value from the JSON
                    yAxis: [{
                        min: 0,
                        max: 500,
                        title: {
                            text: 'Hundreds (< 1000)'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    {
                        min: 0,

                        title: {
                            text: 'Thousands ( > 1000)'
                        },
                        labels: {
                            overflow: 'justify'
                        },
                        opposite: true
                    }],
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },    
                    credits: {
                        enabled: false
                    },
                    series: []
                };

                configuringChartData(options, uriQuery);
                break;
                // Create a line chart
            case 'Line':
                var options = {
                    chart: {
                        renderTo: "chart-visualization",
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'line'
                    },
                    //tooltip: {
                    //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    // },
                    title: {
                        text: title,
                          
                    },
                       
                    xAxis: {
                        title: {
                            text: xaxis[0]
                        },
                        categories: []

                    },
                    yAxis: [{
                        min: 0,
                        max: 500,
                        title: {
                            text: 'Hundreds (< 1000)'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                     {
                         min: 0,

                         title: {
                             text: 'Thousands ( > 1000)'
                         },
                         labels: {
                             overflow: 'justify'
                         },
                         opposite: true
                     }],
                    series: []

                };

                configuringChartData(options, uriQuery);
                break;
            default:
                break;
        }
                
            

           
    }
      
}

// Helper function for query() function when modifying the data value in charts
function configuringChartData(options, uriQuery)
{
    $.getJSON(uriQuery, function (result) {
        var data = convertToJavaScriptObject(result);
        switch (xaxis.length) {
            // First case if there is only 1 x-axis is chosen
            case (1):
                options.series = new Array(yaxis.length);

                // Variable count to check if the total average of each data is less or greater than 500 than 
                // we will decide which yAxis it will belong to
                var count = new Array(yaxis.length);
                for (var i = 0; i < yaxis.length; i++) {
                    count[i] = 0;
                }


                // Max value variable to store the maximum value from the data
                var maxValue = 0;
                for (var i = 0; i < yaxis.length; i++) {

                    options.series[i] = new Object();
                    options.series[i].name = yaxis[i];
                    options.series[i].data = [];
                    options.series[i].yAxis = 0;

                }

                // Loop through each record of the result
                for (var i = 0 ; i < result.value.length; i++) {

                    var xValue ="";
                    var yValue = new Array(yaxis.length);

                    // Loop through each attribute from the attrs array to know which attribute belongs to which table
                    for (var attribute in attrs) {

                        // Loop through a set of attributes and check if xaxis variable belongs in one of the referenced table or not
                        if (xaxis[0] == attrs[attribute].name) {
                            // Belongs to main table
                            if (attrs[attribute].belongsTo == chosenTables[0].name) {
                                xValue = data.value[i][xaxis[0]];
                            }
                                // Belongs to referenced tables
                            else if(attrs[attribute].tableType == "referenced"){
                                xValue = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][xaxis[0]];
                            }
                                // Belongs to referencing tables
                            else if (attrs[attribute].tableType == "referencing") {
                                var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s') + 1)];
                                // Only account for those that have values. Since we are not sure if they are an array of values so checking must be done and add those values together
                                if (tableReferencing.length > 0) {
                                    xValue = tableReferencing[0][xaxis[0]];

                                }

                            }
                        }

                        // Same functions to check for yaxis variable
                        for (var j = 0; j < yaxis.length; j++) {
                            if (yaxis[j] == attrs[attribute].name) {
                                if (attrs[attribute].belongsTo == chosenTables[0].name) {
                                    yValue[j] = data.value[i][yaxis[j]];
                                }
                                else if(attrs[attribute].tableType == "referenced"){
                                    yValue[j] = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][yaxis[j]];
                                }
                                else if (attrs[attribute].tableType == "referencing") {
                                    var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s') + 1)];
                                    if (tableReferencing.length > 0) {
                                        for (var k = 0; k < tableReferencing.length; k++) {
                                            yValue[j] = tableReferencing[k][yaxis[j]];
                                        }
                                    }
                                }
                            }
                        }

                    } // End looping each attribute


                    // Push data to the catergories and value to each data array. Also if there is no value for the xaxis, then skip.
                    if (xValue.length != 0)
                    {
                        if (options.xAxis.categories.indexOf(xValue) != -1) {
                            var index = options.xAxis.categories.indexOf(xValue);
                            for (var j = 0 ; j < yValue.length; j++) {
                                options.series[j].data[index] += parseInt(yValue[j]);
                                // Checking the maximum value
                                if (yValue[j] > maxValue) {
                                    maxValue = parseInt(yValue[j]);
                                }
                                count[j] += parseInt(yValue[j]);

                            }

                        }
                        else {
                            options.xAxis.categories.push(xValue);

                            for (var j = 0 ; j < yValue.length; j++) {
                                options.series[j].data.push(parseInt(yValue[j]));
                                if (yValue[j] > maxValue) {
                                    maxValue = parseInt(yValue[j]);
                                }
                                count[j] += parseInt(yValue[j]);

                            }
                        }
                        // End of push data
                    }
                      



                }// End looping through each record


                var otherYAxisUsed = false;
                // Checking the average value to set the yAxis
                for (var i = 0; i < yaxis.length; i++) {

                    if (count[i] / result.value.length > 500) {

                        options.series[i].yAxis = 1;

                        otherYAxisUsed = true;
                    }
                }
                // End checking the average value

                // Checking if the second y-axis is needed or not
                if (!otherYAxisUsed) {
                    delete options.yAxis[1];
                    options.yAxis[0].max = maxValue;
                }
                else {
                    // Set the maximun value to the other y-axis
                    options.yAxis[1].max = maxValue;
                }





                break;
                // Ending first case scenario 

                // Second scenario when 2 x-axis are chosen
            case (2):

                options.series = new Array(result.value.length);
                var seriesCounter = 0;

                if (yaxis.length == 1) {
                    // Change the y-axis setting since these variables are only applicable in the first case
                    options.yAxis[0].min = null;
                    options.yAxis[0].max = null;
                    options.yAxis[0].title.text = yaxis[0];

                    delete options.yAxis[1];
                }


                // Loop through each record of the result
                for (var i = 0 ; i < result.value.length; i++) {

                    var xValue = new Array(xaxis.length);
                    // Since we limit the xaxis down to 2 then
                    xValue[0] = "";
                    xValue[1] = "";
                    var yValue = new Array(yaxis.length);

                    // Loop through each attribute from the attrs array to know which attribute belongs to which table
                    for (var attribute in attrs) {

                        // Loop through a set of attributes and check if first xaxis variable belongs in one of the referenced table or not
                        for (var j = 0; j < xaxis.length; j++) {
                            if (xaxis[j] == attrs[attribute].name) {
                                // Belongs to main table
                                if (attrs[attribute].belongsTo == chosenTables[0].name) {
                                    xValue[j] = data.value[i][xaxis[j]];
                                }
                                    // Belongs to referenced tables
                                else if(attrs[attribute].tableType == "referenced"){
                                    xValue[j] = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][xaxis[j]];
                                }
                                    // Belongs to referencing tables
                                else if (attrs[attribute].tableType == "referencing") {
                                    var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s') + 1)];
                                    // Only account for those that have values. Since we are not sure if they are an array of values so checking must be done and add those values together
                                    if (tableReferencing.length > 0) {
                                        xValue[j] = tableReferencing[0][xaxis[j]];

                                    }

                                }
                            }
                        }

                        // Same functions to check for yaxis variable
                        for (var j = 0; j < yaxis.length; j++) {
                            if (yaxis[j] == attrs[attribute].name) {
                                if (attrs[attribute].belongsTo == chosenTables[0].name) {
                                    yValue[j] = data.value[i][yaxis[j]];
                                }
                                   
                                else if(attrs[attribute].tableType == "referenced"){
                                    yValue[j] = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s'))][yaxis[j]];
                                }
                                else if (attrs[attribute].tableType == "referencing") {
                                    var tableReferencing = data.value[i][attrs[attribute].belongsTo.substring(0, attrs[attribute].belongsTo.lastIndexOf('s') + 1)];
                                    if (tableReferencing.length > 0) {
                                        for (var k = 0; k < tableReferencing.length; k++) {
                                            yValue[j] = tableReferencing[k][yaxis[j]];
                                        }
                                    }
                                }
                            }
                        }

                    } // End looping each attribute


                    // Push data to the catergories and value to each data array
                    // If categories already exist than add it
                    if (xValue[0].length != 0 && xValue[1].length != 0)
                    {
                        if (options.xAxis.categories.indexOf(xValue[0]) != -1) {

                            var indexCat = options.xAxis.categories.indexOf(xValue[0]);
                            var indexSeries = seriesCounter;

                            for (var j = 0; j < options.series.length; j++) {
                                if (options.series[j] != null && options.series[j].name == xValue[1]) {
                                    indexSeries = j;
                                }
                            }

                            // Create a new object in the series array
                            if (indexSeries == seriesCounter) {
                                options.series[seriesCounter] = new Object();
                                options.series[seriesCounter].data = [result.value.length];
                                for (var j = 0; j < result.value.length; j++) {
                                    options.series[seriesCounter].data[j] = null;
                                }
                                options.series[seriesCounter].yAxis = 0;
                                options.series[seriesCounter++].name = xValue[1];
                            }

                            /*Problem 1: These line of code specify the y-axis value that we got from the JSON. This will check the 
                            the data inside the object inside the series array. Each array will have their own name as to specify 
                            the origin of the data. The problem is that this only works if user chooses only 1 y-axis. The reason is that 
                            for each set of data, we have to specify the array with a name to know what set of data they belong to. Because of that,
                            if we have 2 y-axis, we must have 2 arrays with the same name. This will cause problem when checking later data if they
                            belongs to which one because of the confusion of the name of the array.*/
                            for (var j = 0 ; j < yValue.length; j++) {
                                if (options.series[indexSeries].data[indexCat] == 0) {
                                    options.series[indexSeries].data[indexCat] = parseInt(yValue[j])
                                }
                                else {
                                    options.series[indexSeries].data[indexCat] += parseInt(yValue[j]);
                                }
                            }

                        }
                            // If categories value did not exist, then we push a new value to it, most of the code is the same as in the if statement
                        else {
                            options.xAxis.categories.push(xValue[0]);
                            var indexCat = options.xAxis.categories.indexOf(xValue[0]);
                            var indexSeries = seriesCounter;

                            for (var j = 0; j < options.series.length; j++) {

                                if (options.series[j] != null && options.series[j].name == xValue[1]) {
                                    indexSeries = j;
                                }
                            }

                            if (indexSeries == seriesCounter) {

                                options.series[seriesCounter] = new Object();
                                options.series[seriesCounter].data = [result.value.length];
                                for (var j = 0; j < result.value.length; j++) {
                                    options.series[seriesCounter].data[j] = null;
                                }
                                options.series[seriesCounter].yAxis = 0;
                                options.series[seriesCounter++].name = xValue[1];
                            }

                            // Same as problem 1
                            for (var j = 0 ; j < yValue.length; j++) {

                                if (options.series[indexSeries].data[indexCat] == 0) {
                                    options.series[indexSeries].data[indexCat] = parseInt(yValue[j]);
                                }
                                else {
                                    options.series[indexSeries].data[indexCat] += parseInt(yValue[j]);

                                }
                            }
                        }
                        // End of push data
                    }
                       



                }// End looping through each record

                // Check if series array contains any empty data using the series counter we used above
                options.series = options.series.slice(0, seriesCounter);

                // Trim off any empty data in data array in series array, leaving it 0 as we specified above will make errors
                for (var j = 0; j < options.series.length; j++) {
                    options.series[j].data = options.series[j].data.slice(0, options.xAxis.categories.length);
                }
                // End trimming

                break;
        }


        var chart = new Highcharts.Chart(options);
    });
}

// Remove the table visualization
function removeAttribute(arrayName, id)
{
    var temp = [];
    var countTemp = 0;
    switch(arrayName)
    {
        case "table":
               
            for(var i = 0; i< chosenTables.length; i++)
            {
                if (chosenTables[i].name != id) {
                    temp[countTemp++] = chosenTables[i];
                }
            }
            chosenTables = temp;
            reset('table');
                
                
            break;
        case "referencedTable":
               
            // Remove the referenced table in the main table
            for (var i = 0; i < chosenTables[0].referencedTables.length; i++)
            {
                if (chosenTables[0].referencedTables[i] != id) {
                    temp[countTemp++] = chosenTables[0].referencedTables[i];
                }
                   
            }
            chosenTables[0].referencedTables = temp;
            $("#" + id + "-" + arrayName).remove();

            // Remove the attribute in the attrs array
            temp = [];
            countTemp = 0;
               
            for (var i = 0; i < attrs.length; i++)
            {
                if(attrs[i].belongsTo != id)
                {
                    temp[countTemp++] =  attrs[i];
                        
                }
                else
                {
                    var removedItem = attrs[i];
                       
                    $("#attribute-select option[value='"+removedItem.name+"']").remove();
                    $("#attribute-other-view option[value='" + removedItem.name + "']").remove();
                    removeAttribute("view", removedItem.name);
                    removeAttribute("condition", removedItem.name);
                }
            }
            attrs = temp;
                
            break;
        case "referencingTable":
            // Remove the referenced table in the main table
            for (var i = 0; i < chosenTables[0].referencingTables.length; i++) {
                if (chosenTables[0].referencingTables[i] != id) {
                    temp[countTemp++] = chosenTables[0].referencingTables[i];
                }

            }
            chosenTables[0].referencingTables = temp;
            $("#" + id + "-" + arrayName).remove();

            // Remove the attribute in the attrs array
            temp = [];
            countTemp = 0;

            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i].belongsTo != id) {
                    temp[countTemp++] = attrs[i];

                }
                else {
                    var removedItem = attrs[i];

                    $("#attribute-select option[value='" + removedItem.name + "']").remove();
                    $("#attribute-other-view option[value='" + removedItem.name + "']").remove();
                    removeAttribute("view", removedItem.name);
                    removeAttribute("condition", removedItem.name);
                }
            }
            attrs = temp;
            break;
        case "view":
            // Remove the attribute in the chosenViews array
            for (var i = 0 ; i < chosenViews.length; i++)
            {
                if(seperateBrackets(chosenViews[i]) != id)
                {
                    temp[countTemp++] = chosenViews[i];
                }
                else {
                    $("#pie-value-name option[value='" + seperateBrackets(chosenViews[i]) + "']").remove();
                    $("#pie-value option[value='" + seperateBrackets(chosenViews[i]) + "']").remove();
                    $("#x-axis option[value='" + seperateBrackets(chosenViews[i]) + "']").remove();
                    $("#y-axis option[value='" + seperateBrackets(chosenViews[i]) + "']").remove();
                }
            }
            chosenViews = temp;
            $("#" + id + "-" + arrayName).remove();
            removeAttribute("xaxis", id);
            removeAttribute("yaxis", id);

            if (chosenViews.length < 2)
            {
                // Disable visualization options
                $("#pie-chart").css("background-color", "");
                $("#pie-chart").addClass("disabled")
                $("#area-chart").addClass("disabled")
                $("#area-chart").css("background-color", "");
                $("#line-chart").addClass("disabled")
                $("#line-chart").css("background-color", "");
                $("#column-chart").addClass("disabled")
                $("#column-chart").css("background-color", "");
                $("#" + chartType).remove();
                   
                $("#pie-value-name").prop("disabled", true);
                $("#pie-value").prop("disabled", true);
                $("#x-axis").prop("disabled", true);
                $("#y-axis").prop("disabled", true);
            }
            break;
        case "condition":
            // Remove the condition in the chosenCondition array
            var tokens = id.split(" ");
            for (var i = 0; i < chosenConditions.length; i++)
            {
                if(chosenConditions[i] != id)
                {
                    temp[countTemp++] = chosenConditions[i];
                }   
            }
            chosenConditions = temp;
                
            $("#" + tokens[0] + "-" + arrayName).remove();
            break;
        case "xaxis":
            // Remove the attribute in the xaxis
            for (var i = 0; i < xaxis.length; i++) {
                if (xaxis[i] != id) {
                    temp[countTemp++] = xaxis[i];
                }
            }
            xaxis = temp;
            $("#" + id + "-" + arrayName).remove();
            break;
        case "yaxis":
            // Remove the attribute in the xaxis
            for (var i = 0; i < yaxis.length; i++) {
                if (yaxis[i] != id) {
                    temp[countTemp++] = yaxis[i];
                }
            }
            yaxis = temp;
            $("#" + id + "-" + arrayName).remove();
            break;
    }

}
    
// Seperate the view and the attribute column to be used in the function
function seperateBrackets(data)
{
    var first = data.indexOf("(");
    var last = data.indexOf(")");
    return data.substring(first + 1, last);
        
}

// Add X-Axis columns
function addXAxis()
{
    var x = $("#x-axis option:selected").val();
    if (xaxis.length >= 2 )
    {
           
    }
    else if (xaxis.indexOf(x) == -1 && yaxis.indexOf(x) == -1){
        xaxis.push(x);
        $("#xaxis-badge-selection").append("<span id=\"" + x + "-xaxis\" class=\"badge\">" + x + " <a href=\"javascript:removeAttribute('xaxis','" + x + "')\">&times;</a> </span> ");
    }
}

// Add X-Axis columns
function addYAxis() {
    var y = $("#y-axis option:selected").val();
    /*   if (yaxis.length >= 2) {

       }
       else*/ if (xaxis.indexOf(y) == -1 && yaxis.indexOf(y) == -1) {
            yaxis.push(y);
            $("#yaxis-badge-selection").append(" <span id=\"" + y + "-yaxis\" class=\"badge\">" + y + "<a href=\"javascript:removeAttribute('yaxis','" + y + "')\">&times;</a> </span> ");
        }
}

// Update details for the chart and display the visualization for chart
function configureChart() {
    title = $("#chart-title").val();
    if (title == "") {
        title = "Fill in Chart Title to display";
    }
    switch (chartType) {
        // Display pie chart and set the notification to display a text
        case "Pie":
            if ($("#pie-value-name option:selected").val() != "-- Select an option --" & $("#pie-value option:selected").val() != "-- Select an option --") 
            { 
                dimension = $("#pie-value-name option:selected").val();
                measure = $("#pie-value option:selected").val();
                $("#configure-notice").html("Successfully configure")
                query();
                configureClicked = true;
                setTimeout(function () { $("#configure-notice").empty(); }, 5000);
            }
            else {
                alert("Requires both field to be selected");
            }
              
            break;
            // Display area, line or column chart and set the notification to display a text
        case 'Area':
        case "Line":
        case 'Column':
            if (xaxis.length > 0 && yaxis.length >0) {
                       
                $("#configure-notice").html("Successfully configure")
                query();
                configureClicked = true;
                setTimeout(function () { $("#configure-notice").empty(); }, 5000);
            } else {
                alert("Requires both field to be selected");
            }
               
            break;
            // Default option if users choose nothing
        default:
            $("#configure-notice").html("To use this configuration, a chart beside table must be chosen.");
            setTimeout(function () { $("#configure-notice").empty(); }, 5000);
            break;
    }
        
}

// Check details when using save a widget
function checkWidgetInfo()
{
    // Since the chart type and the view are the foundation for a chart ( at least for a table), this should stop anyone who tries to add empty widgets
    if(chartType == "Table")
    {
        $("#widget-query").val(finalQuery);

        $("#widget-title").val(title);
        $("#widget-type").val(chartType);
        var text = $("#dashboard-list option:selected").text();

        $("#dashboard-list option:selected").val(dashboardids[dashboards.indexOf(text)]);
    }
        // Check chart type, the views and the configuration has been clicked or not
    else if (chartType.length != 0  && chosenViews.length != 0 && configureClicked) {
        $("#widget-query").val(finalQuery);

        $("#widget-title").val(title);
        $("#widget-type").val(chartType);
        var text = $("#dashboard-list option:selected").text();

        $("#dashboard-list option:selected").val(dashboardids[dashboards.indexOf(text)]);
    }
    else
    {
        alert("Ah hah. You did not configure chart. JUST DO IT.")
        return false;
    }
    return true;
}

function checkColumnType()
{
    if ($("#pre-data-table").attr("aria-expanded") == "false") {
        $("#preview").click();
    }
    var chosenAttribute = $("#attribute-select option:selected").val();
    var attribute;
    for(var i=0; i< attrs.length; i++)
    {
        if(chosenAttribute == attrs[i].name)
        {
            attribute = attrs[i];
        }
    }
    switch(attribute.type)
    {
        case "Number":
            $("#operation").empty();
            $("#operation").append("<option >=</option>");
            $("#operation").append("<option >></option>");
            $("#operation").append("<option >>=</option>");
            $("#operation").append("<option><</option>");
            $("#operation").append("<option ><=</option>");
            break;
        case "Word":
            $("#operation").empty();
            $("#operation").append("<option>contains</options>")
            $("#operation").append("<option>endswith</option>")
            $("#operation").append("<option>startswith</option>")
            break;
        case "Date":
            $("#operation").empty();
            $("#operation").append("<option disabled>Not available</options>")
            break;
    }
}

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
            

});
