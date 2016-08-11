$(function () {
    $(".ui-loader").hide();
    var description = "<ul class=\"list-group\"><li class=\"list-group-item\">Logistics: <div class=\"circleLogistics\"></div></li><li class=\"list-group-item\">Engineering: <div class=\"circleEngineering\"></div></li> <li class=\"list-group-item\">Finance: <div class=\"circleFinance\"></div></li></ul>";
    $('#sourceButtonLink').popover({ html: true, content: description });
    // Colour the items according to their data source (Logistics,Finance,Engineering)
    $("#sourceButton").click(function () {

        //var $currentIframe = $("#DecisionSummary");
        //alert($currentIframe.attr('class'));
        //var test = $currentIframe.contents().find("#DSummaryTable");
        //test.addClass('logistics');
        //alert(test.attr('id'))
        //$("#DecisionSummary").find("#DSummaryTable").addClass('logistics');
        var logisticsGroup = jQuery.makeArray([$("#img1SD"), $("#RIPriorityTable"), $("#SCodeSummaryTable"), $("#costli"), $("#leadli"), $("#locationli"), $("#LogisticsExpertImage")]);
        var financeGroup = jQuery.makeArray([$("#budgetli")]);
        var engineeringGroup = jQuery.makeArray([$("#criticalityli"), $("#img2SD"), $("#EngineeringExpertImage")]);

        $.each(logisticsGroup, function (index, value) {
            if (value.hasClass('logistics')) {
                value.removeClass('logistics');
            }
            else {
                value.addClass('logistics');

            }
        });
        $.each(financeGroup, function (index, value) {
            if (value.hasClass('finance')) {
                value.removeClass('finance');
            }
            else
                value.addClass('finance');
        });
        $.each(engineeringGroup, function (index, value) {
            if (value.hasClass('engineering')) {
                value.removeClass('engineering');
            }
            else
                value.addClass('engineering');
        });


    });
    var str = location.pathname.toLocaleLowerCase();
    $("ul.nav.navbar-nav.navbar-right li a").each(function () {
        if (str.indexOf($(this).attr("href").toLowerCase()) > 0 || $(this).attr("href").toLowerCase().indexOf(str) > 0) {
            $(this).parent().addClass("active");
            //$(this).parent.addClass("active");
        }
        else {
            // $(this).parent.removeClass("active");
            $(this).parent().removeClass("active");
        }
    });

});

$(function () {

    $.getJSON("../DataFiles/ResultTable_Master.json", function (data) {
    //PriorityTable = $.parseJSON(ResultPriority);
        PriorityTable = data;
    var dynatable = $('#PriorityTableSlider').dynatable({
        dataset: {
            records: PriorityTable,
            sorts: { 'criticality': -1 }
        },
        writers: {
            'action': function (record) {
                if (record.computedPriority.toString() == 'High')
                    return '<div class="circleRed"></div>';
                else if (record.computedPriority.toString() == 'Medium')
                    return '<div class="circleOrange"></div>';
                else
                    return '<div class="circleGreen"></div>';

            }

        },

        features: {
            paginate: true,
            search: true,
            show: true,
            recordCount: true,
            perPageSelect: false,
            pushState: false,
            sort: true
        }
    }).data("dynatable");

    dynatable.settings.dataset.originalRecords = PriorityTable;
    dynatable.paginationPerPage.set(20);
    //dynatable.sortedByColumnValue("Criticality");
    dynatable.process();

    $(function () {
        var pushLeft = new Menu({
            wrapper: '#wrapper',
            type: 'push-left',
            menuOpenerClass: '.c-button',
            maskId: '#c-mask'
        });

        var pushLeftBtn = document.querySelector('#selectAsset');

        pushLeftBtn.addEventListener('click', function (e) {
            e.preventDefault;
            pushLeft.open();
        });

        $('body').on('click', '#PriorityTableSlider tr', function (e) {
            var tablerow = $('#PriorityTableSlider')[0].rows[($(this).index() + 1)],
            cellvalue = tablerow.cells[0].innerHTML;
            setStockCodeSelection(cellvalue);

            $('body').trigger($.Event('fp:stockcode.changed', {
                stockCode: cellvalue
            }));

            itemHeaderID.innerHTML = "<i class=\"ion-chevron-right\"></i>" + "&nbsp;&nbsp;&nbsp;" + cellvalue + "   -   " + tablerow.cells[1].innerHTML;
            // $("#RIPriorityDIV").hide();
            var selected = $(this).hasClass("highlight");
            $("#PriorityTableSlider tr").removeClass("highlight");
            $("#PriorityTableSlider tr").css('background-color', '#FFFFFF');
            $("#PriorityTableSlider tr").css('color', '#030303');


            if (!selected) {
                $(this).addClass("highlight");
                $(this).css('background-color', '#e7e7e7');
                $(this).css('color', '#000000');
            }
            pushLeft.close();
        });
    });
    });
});

/**
             * Push left instantiation and action.
             */


