// setting default package config 
let rest = 0, pages = 1, dataLength;
var take = 10 , tokenChild , tokenParent , startId = 1, dynamicStart = 1, btnGroups = 1, trashed = 0, paggingEnd = 19, paggingStart = 0, virtualGrouping = 1 , lengthOfColumns = 0 ;
function pendControllers(layout, tableId) {
    $(layout).append('<section class="tablebalancer-outer-wrapper"></section>');
    $(".tablebalancer-outer-wrapper").append('<div class= "tablebalancer-header-wrapper" >\
        <div class="searchable-controller">\
            <input type="text" id="dataloader-search" class="form-control input-sm" placeholder="Search In Data  " />\
            <i class="fa fa-search searchdatatable activeSearch"></i>\
            <i class="fa fa-times searchdatatable disableSearch hide"></i>\
        </div></div>');
    $(".tablebalancer-outer-wrapper").append('<div class="tablebalancer-inner-wrapper"></div>');
    $(tableId).prependTo(".tablebalancer-inner-wrapper");
    $(".tablebalancer-outer-wrapper").append('<div class="tablebalancer-footer-wrapper">\
        <div class= "pagging-controllers" >\
        <button id="previous-controller" class="traversing-controller btn btn-sm btn-default">Previous </button>\
        <button id="pagging-old-slider" class="pagging-slider traversing-controller btn btn-sm btn-default ">...</button>\
        <div id="pagging-controller" class="traversing-controller"></div>\
        <button id="pagging-new-slider" class="pagging-slider traversing-controller btn btn-sm btn-default " data-stop="20">...</button>\
        <button id="next-controller" class="traversing-controller btn btn-sm btn-default">Next</button></div>\
        <div class="pagging-custom-addons"> </div>\
        <div class="pagging-accessor">\
            <input type="text" id="dataloader-access" class="form-control input-sm" placeholder=" Page Number  " />\
        </div></div>');
    $(tableId).append("<tbody class='dataloader-search-tbody'></tbody>");
}

function dataloader(layout, tableId, countApi, dataApi, searchApi, takenParam, takenValue = 10, StartParam, searchParam, buttons = 5, requests , options = true , hideOpr = true   ,  deleteOption = true , editOption = false , printOption = false   ) {
    pendControllers(layout, tableId);
    lengthOfColumns = $(tableId).children("thead").children("tr").children("th").length;
    take = takenValue;
    // validating count of data  and setting datatable controlling buttons 
    $.ajax({
        url: countApi,
        type: 'Get',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            dataLength = data;
            rest = dataLength % take;
            trashed = rest / take
            if (rest !== 0) {
                pages = (dataLength / take) + 1;
            } else {
                pages = dataLength / take;
            }
            btnGroups = Math.ceil((pages - trashed) / buttons);
            for (let j = 1; j <= pages - trashed; j++) {
                $(tableId).append('<tbody class="dataholder-tbody" data-bodyTag="' + j + '"></tbody>');
                if (j == 1) {
                    $("#pagging-controller").append('<button data-load="1" data-take="' + take + '" data-start="' + startId + '" class="btn page-loader btn-sm btn-primary">' + j + '</button>');
                } else {
                    dynamicStart = (j * 9) + (j - 1) - 8;
                    $("#pagging-controller").append('<button   data-take="' + take + '" data-start="' + dynamicStart + '"   class="btn page-loader btn-sm btn-default">' + j + '</button>');
                }
            }
        }
    });
    // showing the first buttons pagging buttons and validating length 
    if (pages - rest / take > buttons) {
        for (let i = 0; i <= buttons  - 1 ; i++) {
            $("#pagging-controller").children(".page-loader").eq(i).show();
            $("#pagging-new-slider").show();
        }
    } else {
        $(".page-loader").show();
    }
    // showing newer data each click with buttons record 
    $("#pagging-new-slider").click(function () {
        virtualGrouping++;
        paggingEnd = virtualGrouping * buttons - 1;
        paggingStart = paggingEnd - (buttons - 1 );
        if (virtualGrouping <= btnGroups) {
            if (virtualGrouping === btnGroups) {
                $("#pagging-new-slider").hide();
            }
            $("#pagging-old-slider").show();
            for (var i = paggingStart, j = paggingStart - 1; i <= paggingEnd; i++, j--) {
                $("#pagging-controller").children(".page-loader").eq(j).hide();
                $("#pagging-controller").children(".page-loader").eq(i).show();
            }
        }
    });
    //showing the older data each click with previous buttons record
    $("#pagging-old-slider").click(function () {
        $("#pagging-new-slider").show();
        virtualGrouping--;
        paggingEnd = virtualGrouping * buttons - 1;
        paggingStart = paggingEnd - (buttons - 1);
        if (virtualGrouping <= btnGroups) {
            if (virtualGrouping === 1) {
                $("#pagging-old-slider").hide();
            }
            for (var i = paggingStart, j = paggingEnd + 1; i <= paggingEnd; i++, j++) {
                $("#pagging-controller").children(".page-loader").eq(i).show();
                $("#pagging-controller").children(".page-loader").eq(j).hide();
            }
        }
    });
    // Initial  call scripts  change only the ajax calls URL APIS [ Requests Tokens Reviewed here ]
    $.ajax({
        url: dataApi + "?" + takenParam + "=" + take + "&" + StartParam +"="+ startId,
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $.each(data, function (i) {
                $(tableId).children("tbody").eq(1).show();
                $(tableId).children("tbody").eq(1).append('<tr></tr>');
                for (let j = 0; j < lengthOfColumns - 1; j++) {
                    $(tableId).children("tbody").eq(1).children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                }
                if (options === true) {
                    $(tableId).children("tbody").eq(1).children("tr").last().append('<td class="datatable-custom-operations"></td>');
                    if (deleteOption === true) {
                        $(tableId).children("tbody").eq(1).children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                    } else if (editOption === true) {
                        $(tableId).children("tbody").eq(1).children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                    } else if (printOption === true) {
                        $(tableId).children("tbody").eq(1).children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                    }
                }
                //$(tableId).children("tbody").eq(1).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                if (i === take) {
                    return false;
                }
            });
        }
    }); 
    //load page data from api into her tbody wrapper  [ Requests Tokens Reviewed here ]
    $("#pagging-controller").on('click', '.page-loader', function () {
        var btnStart = $(this).data('start'), btnLoad = $(this).data('load');
        $(tableId).children("tbody").eq($(this).index() + 1).show().siblings("tbody").hide();
        $(this).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
        if (btnLoad == 0 || btnLoad == undefined) {
            $(this).data('load', 1);
            var thisIndex = $(this).index();
            $.ajax({
                url: dataApi + "?" + takenParam + "=" + take + "&" + StartParam + "=" + btnStart,
                type: 'Get',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $.each(data, function (i) {
                        $(tableId).children("tbody").eq(thisIndex + 1).show();
                        $(tableId).children("tbody").eq(thisIndex + 1).append('<tr></tr>');
                        for (let j = 0; j < lengthOfColumns - 1; j++) {
                            $(tableId).children("tbody").eq(thisIndex + 1).children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                        }
                        if (options === true) {
                            $(tableId).children("tbody").eq(thisIndex + 1).children("tr").last().append('<td class="datatable-custom-operations"></td>');
                            if (deleteOption === true) {
                                $(tableId).children("tbody").eq(thisIndex + 1).children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                            } else if (editOption === true) {
                                $(tableId).children("tbody").eq(thisIndex + 1).children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                            } else if (printOption === true) {
                                $(tableId).children("tbody").eq(thisIndex + 1).children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                            }
                        }
                        //$(tableId).children("tbody").eq(thisIndex + 1).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                        //$(tableId).children("tbody").eq(thisIndex + 1).show();
                        $(tableId).children("tbody").eq(thisIndex + 1).siblings("tbody").hide();
                        if (i === take) {
                            return false;
                        }
                    });
                }
            });
        }
    });
    //prevoius traversing controller  [ Requests Tokens Reviewed here ]
    $("#previous-controller").click(function () {
        var activePageIndex = $("#pagging-controller").children(".btn-primary").index();
        if (activePageIndex >= 0) {
            var dataLaod = $("#pagging-controller").children(".page-loader").eq(activePageIndex ).data("load"),
                startId = $("#pagging-controller").children(".page-loader").eq(activePageIndex ).data("start");
            $("#pagging-controller").children(".page-loader").eq(activePageIndex - 1 ).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
            if (dataLaod == 1) {
                $(tableId).children("tbody").eq(activePageIndex ).show();
                $(tableId).children("tbody").eq(activePageIndex ).siblings("tbody").hide();
            } else {
                $("#pagging-controller").children(".page-loader").eq(activePageIndex ).data("load", 1);
                $.ajax({
                    url: dataApi + "?" + takenParam + "=" + take + "&" + StartParam + "=" + startId,
                    type: 'Get',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $.each(data, function (i) {
                            $(tableId).children("tbody").eq(activePageIndex).show();
                            $(tableId).children("tbody").eq(activePageIndex).append('<tr></tr>');
                            for (let j = 0; j < lengthOfColumns - 1; j++) {
                                $(tableId).children("tbody").eq(activePageIndex).children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                            }
                            if (options === true) {
                                $(tableId).children("tbody").eq(activePageIndex).children("tr").last().append('<td class="datatable-custom-operations"></td>');
                                if (deleteOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex).children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                                } else if (editOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex).children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                                } else if (printOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex).children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                                }
                            }
                            //$(tableId).children("tbody").eq(activePageIndex ).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                            //$(tableId).children("tbody").eq(activePageIndex ).show();
                            $(tableId).children("tbody").eq(activePageIndex ).siblings("tbody").hide();
                            if (i === take ) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
    });
    //next traversing controller  [ Requests Tokens Reviewed here ]
    $("#next-controller").click(function () {
        var activePageIndex = $("#pagging-controller").children(".btn-primary").index();
        if (activePageIndex <= $("#pagging-controller").children(".page-loader").length) {
            var dataLaod = $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("load"),
                startId = $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("start");
            $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
            if (dataLaod == 1) {
                $(tableId).children("tbody").eq(activePageIndex + 1).show();
                $(tableId).children("tbody").eq(activePageIndex + 1).siblings("tbody").hide();
            } else {
                $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("load", 1);
                $.ajax({
                    url: dataApi + "?" + takenParam + "=" + take + "&" + StartParam + "=" + startId,
                    type: 'Get',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $.each(data, function (i) {
                            $(tableId).children("tbody").eq(activePageIndex + 2).show();
                            $(tableId).children("tbody").eq(activePageIndex + 2).append('<tr></tr>');
                            for (let j = 0; j < lengthOfColumns - 1; j++) {
                                $(tableId).children("tbody").eq(activePageIndex + 2).children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                            }
                            if (options === true) {
                                $(tableId).children("tbody").eq(activePageIndex + 2).children("tr").last().append('<td class="datatable-custom-operations"></td>');
                                if (deleteOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex + 2).children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                                } else if (editOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex + 2).children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                                } else if (printOption === true) {
                                    $(tableId).children("tbody").eq(activePageIndex + 2).children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                                }
                            }
                            //$(tableId).children("tbody").eq(activePageIndex + 2).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                            //$(tableId).children("tbody").eq(activePageIndex + 2).show();
                            $(tableId).children("tbody").eq(activePageIndex + 2).siblings("tbody").hide();
                            if (i === take ) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
    });
    //direct page access controller  [ Requests Tokens Reviewed here  ]
    $("#dataloader-access").on('keypress', function (e) {
        if (e.which == 13) {
            if ($(this).val() > Math.ceil(pages - trashed) || $(this).val() <= 0) {
                alert("من فضلك ادخل رقم صفحة صحيح ");
            } else {
                if ($("#pagging-controller").children(".page-loader").eq($(this).val() - 1).hasClass("btn-primary")) {
                    alert("هذه الصفحة مفعلة بالفعل ");
                } else {
                    $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
                    if ($("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("load") == 1) {
                        $(tableId).children("tbody").eq($(this).val()).show().siblings("tbody").hide();
                    } else {
                        $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("load", 1);
                        var btnStart = $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("start"),
                            thisIndex = $(this).val();
                        $.ajax({
                            url: dataApi + "?" + takenParam + "=" + take + "&" + StartParam + "=" + btnStart,
                            type: 'Get',
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                $.each(data, function (i) {
                                    $(tableId).children("tbody").eq(thisIndex).show();
                                    $(tableId).children("tbody").eq(thisIndex).append('<tr></tr>');
                                    for (let j = 0; j < lengthOfColumns - 1; j++) {
                                        $(tableId).children("tbody").eq(thisIndex).children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                                    }
                                    if (options === true) {
                                        $(tableId).children("tbody").eq(thisIndex).children("tr").last().append('<td class="datatable-custom-operations"></td>');
                                        if (deleteOption === true) {
                                            $(tableId).children("tbody").eq(thisIndex).children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                                        } else if (editOption === true) {
                                            $(tableId).children("tbody").eq(thisIndex).children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                                        } else if (printOption === true) {
                                            $(tableId).children("tbody").eq(thisIndex).children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                                        }
                                    }
                                    //$(tableId).children("tbody").eq(thisIndex).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                                    //$(tableId).children("tbody").eq(thisIndex).show();
                                    $(tableId).children("tbody").eq(thisIndex).siblings("tbody").hide();
                                    if (i === take) {
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    // search structure and controlling dom enviroment 
    $("#dataloader-search").focusin(function () {
        $(this).siblings(".disableSearch").removeClass("hide");
        $(this).siblings(".activeSearch").addClass("hide");
        $(".dataholder-tbody").hide();
        $(".dataloader-search-tbody").show();
        if (hideOpr === true) {
            $(tableId).children("thead").children("tr").children("th").last().hide();
            $(".datatable-custom-operations").hide();
        }
    });
    $("#dataloader-search").focusout(function () {
        $(this).siblings(".disableSearch").addClass("hide");
        $(this).siblings(".activeSearch").removeClass("hide");
        $(tableId).children("tbody").eq($("#pagging-controller").children(".btn-primary").index() + 1).show();
        $(".dataloader-search-tbody").hide();
        if (hideOpr === true) {
            $(tableId).children("thead").children("tr").children("th").last().show();
            $(".datatable-custom-operations").show();
        }
    });
    $(".searchable-controller").on("click", ".disableSearch", function () {
        $(this).addClass("hide");
        $(this).siblings(".activeSearch").removeClass("hide");
        $(tableId).children("tbody").eq($("#pagging-controller").children(".btn-primary").index() + 1).show();
        $(".dataloader-search-tbody").hide();
        if (hideOpr === true) {
            $(tableId).children("thead").children("tr").children("th").last().show();
            $(".datatable-custom-operations").show();
        }
    });
    //Listing Search Results Data   [ Requests Tokens Reviewed here ]
    $("#dataloader-search").keyup(function () {
        var searchRequest = $(this).val();
        $.ajax({
            url: searchApi + "?" + searchParam + "=" + searchRequest,
            type: 'Get',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $(".dataloader-search-tbody").children("tr").remove();
                $.each(data, function (i) {
                    $(".dataloader-search-tbody").append('<tr></tr>');
                    for (let j = 0; j < lengthOfColumns - 1; j++) {
                        $(".dataloader-search-tbody").children("tr").last().append('<td> ' + data[i][requests[j]] + ' </td>');
                    }
                    if (options === true) {
                        $(".dataloader-search-tbody").children("tr").last().append('<td class="datatable-custom-operations"></td>');
                        if (deleteOption === true) {
                            $(".dataloader-search-tbody").children("tr").last().children("td").last().append("<button class='delete-custom-datatable btn btn-xs btn-danger'><i class='fa fa-times'></i></button>");
                        } else if (editOption === true) {
                            $(".dataloader-search-tbody").children("tr").last().children("td").last().append("<button class='edit-custom-datatable btn btn-xs btn-warning'><i class='fa fa-edit'></i></button>");
                        } else if (printOption === true) {
                            $(".dataloader-search-tbody").children("tr").last().children("td").last().append("<button class='print-custom-datatable btn btn-xs btn-info'><i class='fa fa-print'></i></button>");
                        }
                    }
                });
            }
        });
    });

}
