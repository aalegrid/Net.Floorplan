$(function () {
    $("#save-floorplan-mapping").click(function () {

        var inputData = {
            Floorplan: $("#property-floorplan").val(),
            PropertyId: $("#PropertyId").val()
        }

        console.log(inputData);

        $.post('/api/Service/SaveFloorplanMapping', inputData)
            .done(function (msg) {
                common.alert(true, "info", "Property saved")

            })
            .fail(function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                common.alert(true, "error", xhr.responseText)

            });

    });

    $("#save-contract").click(function () {

        if (common.formHasError('pageForm')) {
            return;
        }

        var inputData = {

            ContractId: $("#ContractId").val(),
            Code: $("#code").val(),
            Name: $("#name").val(),
            Description: $("#description").val(),
            OriginatingSystemIdType: $("#system-value-type").val(),
            OriginatingSystemIdValue: $("#system-value-id").val(),
            SystemCode: $("#domain").val() == "1" ? "Spyderware" : "Spider",
            DomainValueId: $("#domain").val()
        }

        console.log(inputData);

        $.post('/api/Service/SaveContract', inputData)
            .done(function (msg) {
                common.alert(true, "info", "Contract saved")

            })
            .fail(function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                common.alert(true, "error", xhr.responseText)

            });

    });

    $("#delete-contract").click(function () {

        var inputData = {
            ContractId: $("#ContractId").val(),
        }

        console.log(inputData);

        $.post('/api/Service/DeleteContract', inputData)
            .done(function (msg) {
                //common.alert(true, "info", "Contract saved")
                parent.fbCloseRefresh();

            })
            .fail(function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                common.alert(true, "error", xhr.responseText)

            });

    });

    $("#save-location").click(function () {

        if (common.formHasError('pageForm')) {
            return;
        }

        var inputData = {
            LocationId: $("#LocationId").val(),
            ContractId: $("#contract-id").val(),
            Code: $("#code").val(),
            Name: $("#name").val(),
            Description: $("#description").val(),
            OriginatingSystemIdType: $("#system-value-type").val(),
            OriginatingSystemIdValue: $("#system-value-id").val()
        }

        console.log(inputData);

        $.post('/api/Service/SaveLocation', inputData)
            .done(function (msg) {
                common.alert(true, "info", "Location saved");


            })
            .fail(function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                common.alert(true, "error", xhr.responseText);

            });

    });

    $("#delete-location").click(function () {

        var inputData = {
            LocationId: $("#LocationId").val(),
        }

        console.log(inputData);

        $.post('/api/Service/DeleteLocation', inputData)
            .done(function (msg) {
                //common.alert(true, "info", "Contract saved")
                parent.fbCloseRefresh();

            })
            .fail(function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                common.alert(true, "error", xhr.responseText)

            });

    });
});

var jsonFind = function (c, prop, value) {
    var o = c,
        o_coll = [];

    function find(o) {
        for (item in o) {
            if (typeof o[item] === 'object') {
                find(o[item]);
            } else {
                if (item === prop && value === o[item]) {
                    o_coll.push(o);
                }
            }
        }
    }

    find(o);
    return o_coll;
};

var commonFunctions = {

    getContracts: function (element) {
        element.kendoDropDownList({
            dataTextField: "Text",
            dataValueField: "Value",
            dataSource: {
                transport: {
                    dataType: "json",
                    read: "/Contracts/GetContracts"

                }
            },
            optionLabel: "Select Contract"
        });
    },

    checkNumeric: function (value) {
        var rgx = /^(0|[1-9][0-9]*)$/;
        return value.match(rgx);
    },

    validateOriginatingSystemIdValue: function (event) {
        if ($("#OriginatingSystemIdType").val() === "INT" &&
            !commonFunctions.checkNumeric($("#OriginatingSystemIdValue").val())) {
            $("#OriginatingSystemIdValue").addClass("lm-input-error");
            $(".invalid-value-for-int").removeClass("hidden");
            event.preventDefault();
        } else {
            $("#OriginatingSystemIdValue").removeClass("input-validation-error");
            $(".invalid-value-for-int").addClass("hidden");

        }
    },
    addOriginatingSystemIdValueKeyupEvent: function () {
        $("#OriginatingSystemIdValue").keyup(function () {


            if ($("#OriginatingSystemIdType").val() === "INT" && !commonFunctions.checkNumeric(this.value)) {
                $("#OriginatingSystemIdValue").addClass("lm-input-error");
                $(".invalid-value-for-int").removeClass("hidden");

            } else {
                $("#OriginatingSystemIdValue").removeClass("lm-input-error");
                $(".invalid-value-for-int").addClass("hidden");

            }


        });
    }

};

var common = {
    alert: function (show, type, msg) {
        if (show) {

            $("#page-message-alert").find(".alert").removeClass(type == "error" ? "alert-info" : "alert-danger");
            $("#page-message-alert").find(".alert").addClass(type == "error" ? "alert-danger" : "alert-info");
            $("#page-message-alert").find(".alert").find(".message").text(msg);
            $("#page-message-alert").removeClass("hidden");
        }
        else {
            $("#page-message-alert").addClass("hidden");
        }
    },

    formHasError: function (formId) {

        var hasError = false;

        $('#' + formId + ' input[type="text"], #' + formId + ' select').each(function (key, value) {
            if ($(this).attr('required') != undefined && !$(this).val().length) {
                common.alert(true, "error", "Please fill in all required fields before submitting");
                hasError = true;
                return false;
            }

        });

        return hasError;
    },
};

var floorplans = {

    init: function () {
        $(function () {
            // var ctx = $('#floorplan-canvas')[0].getContext('2d');
            var rect = {};
            var drag = false;

            $(document).on('mousedown', '#floorplan-canvas', function (e) {
                rect.startX = e.pageX - $(this).offset().left;
                rect.startY = e.pageY - $(this).offset().top;
                rect.w = 0;
                rect.h = 0;
                drag = true;
            });

            $(document).on('mouseup', function () {
                drag = false;

            });

            $(document).on('mousemove', function (e) {

                var shouldRectDraw = !$('#active-location').hasClass("disabled") && !$('#active-location').hasClass("hidden");
                if (drag && shouldRectDraw) {
                    var c = document.getElementById("floorplan-canvas");
                    var ctx = c.getContext("2d");

                    ctx.clearRect(0, 0, c.width, c.height);

                    rect.w = ( e.pageX - $("#floorplan-canvas").offset().left ) - rect.startX;
                    rect.h = ( e.pageY - $("#floorplan-canvas").offset().top ) - rect.startY;
                    ctx.clearRect(0, 0, 500, 500);
                    ctx.fillStyle = "rgba(37, 37, 37, 0.5)";
                    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
                    //$('#active-location').find('#MinX').val(rect.startX);
                    //$('#active-location').find('#MaxX').val(rect.startX + rect.w);
                    //$('#active-location').find('#MinY').val(rect.startY);
                    //$('#active-location').find('#MaxY').val(rect.startY + rect.h);

                    $('#active-location').find('#MinX').val(Math.round(rect.startX * 10) / 10);
                    $('#active-location').find('#MaxX').val(Math.round((rect.startX + rect.w) * 10) / 10);
                    $('#active-location').find('#MinY').val(Math.round(rect.startY * 10) / 10);
                    $('#active-location').find('#MaxY').val(Math.round((rect.startY + rect.h) * 10) / 10);


                }
            });
        });

        var preSubmit = function (event) {

        };

        var showValidationError = function (message, mode) {

            var id = mode === "location" ? "#alert-floorplan-locations" : "#page-message-alert-fp";

            $(id).removeClass("hidden").addClass("show");
            $(id).find(".alert").removeClass("alert-info");
            $(id).find(".alert").addClass("alert-danger");
            $(id).find(".alert").find(".message").text(message);

        };
        var refreshActiveLocation = function (selectedValue) {
            var floorplanLocationId = selectedValue;

            if (floorplanLocationId === "") {
                $('#active-location').addClass("hidden");
                return;
            }

            var callback = function (data) {
                if (data != null && data.length) {
                    var loc = data[0];
                    $('#active-location').find('#MinX').val(loc.MinX);
                    $('#active-location').find('#MaxX').val(loc.MaxX);
                    $('#active-location').find('#MinY').val(loc.MinY);
                    $('#active-location').find('#MaxY').val(loc.MaxY);
                    $('#active-location').find('#location-description-input').val(loc.Description);
                    $('#active-location').removeClass("hidden");
                    $('#active-location').removeClass("disabled");
                    $('#system-locations').addClass("hidden");
                    $('#delete-active-location').removeClass("hidden");

                    var c = document.getElementById("floorplan-canvas");
                    var ctx = c.getContext("2d");
                    ctx.clearRect(0, 0, c.width, c.height);

                    ctx.beginPath();
                    ctx.rect(loc.MinX, loc.MinY, parseInt(loc.MaxX) - parseInt(loc.MinX), parseInt(loc.MaxY) - parseInt(loc.MinY));
                    ctx.fillStyle = "rgba(37, 37, 37, 0.5)";
                    ctx.fill();
                } else {

                }

            };

            $.get("/Floorplans/GetFloorplanLocationDetailsById", { floorplanLocationId: floorplanLocationId }).done(callback);
        };

        var refreshLocations = function (contractId) {

            var callback = function (data) {
                var el = $("#Locations");
                el.empty();
                if (data != null && data.length) {
                    $('#active-location').removeClass("disabled");
                    $.each(data,
                        function (key, value) {
                            el.append($("<option></option>")
                                .attr("value", value.Value).text(value.Text));
                        });
                } else {
                    var c = document.getElementById("floorplan-canvas");
                    var ctx = c.getContext("2d");
                    ctx.clearRect(0, 0, c.width, c.height);
                    $('#active-location').addClass("disabled");
                }

            };

            $.get("/Floorplans/GetLocationsByContractId", { contractId: contractId }).done(callback);
        };

        var refreshPropertyTypes = function (contractId) {

            $.get("/Floorplans/GetPropertyTypesByContractId", { contractId: contractId }).done(callback);
        };
        // Contract Drop Down Changed
        $('#ContractId').change(function () {

            var contractId = $(this).val();

            refreshLocations(contractId);

            refreshPropertyTypes(contractId);

        });

        // Current Location Drop Down Changed
        $('#CurrentLocations').change(function () {
            var floorplanLocationId = $(this).val();
            refreshActiveLocation(floorplanLocationId);
        });

        $("#add-location").click(function () {
            var c = document.getElementById("floorplan-canvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);

            $('#active-location').find('#MinX').val("");
            $('#active-location').find('#MaxX').val("");
            $('#active-location').find('#MinY').val("");
            $('#active-location').find('#MaxY').val("");
            $('#active-location').find('#location-description-input').val("");
            $('#active-location').removeClass("hidden");
            $('#system-locations').removeClass("hidden");
            $('#delete-active-location').addClass("hidden");

            if (!$('#Locations').children('option').length) {
                $('#active-location').addClass("disabled");
            } else {
                $('#active-location').removeClass("disabled");
            }


        });

        $("#save-active-location").click(function () {


            var rgx = /^\d+(\.\d{0,9})?$/;

            var minx = $('#active-location').find('#MinX').val();
            var maxx = $('#active-location').find('#MaxX').val();
            var miny = $('#active-location').find('#MinY').val();
            var maxy = $('#active-location').find('#MaxY').val();
            var description = $('#active-location').find('#location-description-input').val();
            var locationId = $('#active-location').find('#Locations').val();
            console.log(minx.length + " - " + maxx.length + " - " + miny.length + " - " + maxy.length + " - " + description.length)
            if (!minx.length || !maxx.length || !miny.length || !maxy.length || !description.length) {
                showValidationError("Please provide values for Name, MinX, MaxX, MinY, amd MaxY values", "location");
                return;
            }

            if (!minx.match(rgx) || !maxx.match(rgx) || !miny.match(rgx) || !maxy.match(rgx)) {
                showValidationError("Please provide valid values for Name, MinX, MaxX, MinY, amd MaxY values", "location");
                return;
            }

            var floorplanLocationId = $('#CurrentLocations').val();

            var saveMode = $('#system-locations').hasClass("hidden") ? "Save" : "Add";

            var callback = function (data) {

                $("#alert-floorplan-locations").removeClass("hidden").addClass("show");
                //console.log(data);
                //console.log(data.data.Data.FloorplanLocationId);

                if (data.error === "") {
                    // No error
                    var responseObject = data.data.Data;
                    $("#alert-floorplan-locations").find(".alert").removeClass("alert-danger");
                    $("#alert-floorplan-locations").find(".alert").addClass("alert-info");
                    $("#alert-floorplan-locations").find(".alert").find(".message").text("Room saved");

                    if (saveMode === "Save") {
                        $("#CurrentLocations option:selected").text(responseObject.Description);
                    } else {
                        $('#CurrentLocations').append($('<option>', {
                            value: responseObject.FloorplanLocationId,
                            text: responseObject.Description
                        }));
                        $('#CurrentLocations').val(responseObject.FloorplanLocationId);

                    }

                    $("#delete-active-location").removeClass("hidden");

                } else {
                    // Error

                    $("#alert-floorplan-locations").find(".alert").removeClass("alert-info");
                    $("#alert-floorplan-locations").find(".alert").addClass("alert-danger");
                    $("#alert-floorplan-locations").find(".alert").find(".message").text(data.error);
                }

            };

            var inputData = {
                saveMode: saveMode,
                floorplanId: $('.edit-form').find('#FloorplanId').val(),
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy,
                locationId: locationId,
                description: description,
                floorplanLocationId: floorplanLocationId
            };

            $.get("/Floorplans/AjaxSaveLocation", inputData).done(callback);

        });

        $("#delete-active-location-confirmed").click(function () {

            var floorplanLocationId = $('#CurrentLocations').val();

            var callback = function (data) {

                $("#alert-floorplan-locations").removeClass("hidden").addClass("show");


                if (data.error === "") {


                    $("#alert-floorplan-locations").find(".alert").removeClass("alert-danger");
                    $("#alert-floorplan-locations").find(".alert").addClass("alert-info");
                    $("#alert-floorplan-locations").find(".alert").find(".message").text("Room deleted");

                    $("#CurrentLocations option[value='" + floorplanLocationId + "']").remove();


                    if ( $('#CurrentLocations option').length >= 2) {
                        $("#CurrentLocations").val($("#CurrentLocations option:eq(1)").val()).change();
                    } else {
                        $("#CurrentLocations").val($("#CurrentLocations option:first").val()).change();
                    }


                    var c = document.getElementById("floorplan-canvas");
                    var ctx = c.getContext("2d");

                    ctx.clearRect(0, 0, c.width, c.height);

                    $(".delete-location-confirm").addClass("hidden");


                } else {
                    // Error

                    $("#alert-floorplan-locations").find(".alert").removeClass("alert-info");
                    $("#alert-floorplan-locations").find(".alert").addClass("alert-danger");
                    $("#alert-floorplan-locations").find(".alert").find(".message").text(data.error);
                    $(".delete-location-confirm").addClass("hidden");
                }

            };


            $.get("/Floorplans/AjaxDeleteLocation", { floorplanLocationId: floorplanLocationId }).done(callback);

        });

        $("a[href='#f-details']").click(function () {
          !$("#f-details").hasClass("show") ?
                $(this).find("i").removeClass("fa-plus-square").addClass("fa-minus-square") :
                $(this).find("i").removeClass("fa-minus-sqaure").addClass("fa-plus-square");
        });

        $("a[href='#f-rooms']").click(function () {
            !$("#f-rooms").hasClass("show") ?
                $(this).find("i").removeClass("fa-plus-square").addClass("fa-minus-square") :
                $(this).find("i").removeClass("fa-minus-sqaure").addClass("fa-plus-square");
        });

    },

    functionName: function () {

    }
};

var floorplanHistory = {

    init: function () {

        $(".period-links a").click(function () {

            $(".map").find("canvas").attr("id", "img-canvas");

            var cv = document.getElementById("img-canvas"),
                cvctx = cv.getContext("2d");

            cvctx.clearRect(0, 0, cv.width, cv.height);

            var group = $(this).attr("data-group"),
                fillStyles = {
                    "Completed": "rgba(68, 140, 203, 0.3)",
                    "InProgress": "rgba(140, 98, 57, 0.5)",
                    "Scoped": "rgba(255, 245, 104, 0.5)",
                    "Defected": "rgba(255, 0, 0, 0.5)"
                },
                img = document.getElementById('floorplan'),
                width = img.clientWidth,
                originalWidth = window.floorplanOriginalImage.width,
                percentage = width / originalWidth,
                items = window.workHistoryData,
                locations = locationArray;

            console.log(window.originalImageWidth);
            $.each(locations, function (index, value) {

                var location = value.coordinates,
                    locationId = value.id,
                    itemCount = 0,
                    type = group,
                    counts = _.countBy(items, "Type");

                $.each(counts,
                    function (index, value) {
                        if (index === type) {
                            itemCount = value;
                        }
                    });

                if (itemCount) {

                    $.each(items,
                        function (index, value) {

                            var equalLocation = false;

                            equalLocation = parseInt(value.LocationId) === parseInt(locationId);

                            if (value.Type === type && equalLocation) {

                                var loc = {
                                    MinX: parseFloat(location.minx) * parseFloat(percentage),
                                    MaxX: parseFloat(location.maxx) * parseFloat(percentage),
                                    MinY: parseFloat(location.miny) * parseFloat(percentage),
                                    MaxY: parseFloat(location.maxy) * parseFloat(percentage)
                                };

                                $(".map").find("canvas").attr("id", "img-canvas");

                                var c = document.getElementById("img-canvas"),
                                    ctx = c.getContext("2d");

                                ctx.beginPath();
                                ctx.rect(loc.MinX,
                                    loc.MinY,
                                    parseInt(loc.MaxX) - parseInt(loc.MinX),
                                    parseInt(loc.MaxY) - parseInt(loc.MinY));
                                ctx.fillStyle = fillStyles[group];
                                ctx.fill();
                            }
                        });
                }
            });


        });


        $(document).on('click', '.pane-nav li a', function (e) {
            var type = $(this).attr("data-anchor-type"),
                tabPane = $(this).parents(".tab-pane"),
                paneNav = $(this).parents(".pane-nav");

            tabPane.find("[class^='type-container']").addClass("hidden");
            tabPane.find("[class^='type-container-" + type + "']").removeClass("hidden");

            paneNav.find("a").removeClass("selected");
            $(this).addClass("selected");

        });

        $('.fp-image-view  .image-map-area').on('click', function (event) {
            event.preventDefault();
            // <area alt="alt" shape="rect" coords="280,23,418,127" id="loc-40" href="#loc-40-panel" data-hasqtip="0" aria-describedby="qtip-0">

            //<div class="tab-content"><div role="tabpanel" class="tab-pane active" id="loc-40-panel"></div></div>
            $(".tab-content").find(".tab-pane").removeClass("active");
            $(".tab-content").find($(this).attr("href")).addClass("active");


        });

        $(".fp-image-view  .image-map-area").bind("click touchstart", function (e) {
            event.preventDefault();

            $(".tab-content").find(".tab-pane").removeClass("active");
            $(".tab-content").find($(this).attr("href")).addClass("active");

        });


        (function ($, viewport) {
            $(document).ready(function () {

                

                // Executes only in XS breakpoint
                if (viewport.is('xs')) {
                    // ...
                    
                   // $('.fp-image-view, .right-panel').css("height", height + "px");
                }

                // Executes in SM, MD and LG breakpoints
                if (viewport.is('>=sm')) {
                    // ...
                }

                // Executes in XS and SM breakpoints
                if (viewport.is('<md')) {
                    // ...
                    
                }

                // Execute code each time window size changes
                $(window).resize(function () {
                    var height = $('#floorplan').height() + 35;
                    $('.fp-image-view, .right-panel').css("height", height + "px");
                });

                var height = $('#floorplan').height() + 35;
                $('.fp-image-view, .right-panel').css("height", height + "px");
            });
        })(jQuery, ResponsiveBootstrapToolkit);

    },

    getPropertyWorkHistory: function () {



        var callback = function (data) {

            if (data.success !== false) {

                console.log(data);

                var items = _.sortBy(data, 'Type'),
                    itemTypes = [
                        {
                            title: "In Progress",
                            type: "InProgress"
                        },
                        {
                            title: "Completed",
                            type: "Completed"
                        },
                        {
                            title: "Defected",
                            type: "Defected"
                        },
                        {
                            title: "Scoped",
                            type: "Scoped"
                        }],
                   
                    itemTemplate = _.template($("#workHistoryTemplate").html()),
                    locations = window.locationArray;

                window.workHistoryData = data;

                $.each(locations, function (index, value) {
                    var locationId = value.id;
                    var locationName = value.name;

                    $.each(itemTypes, function (index, value) {
                        var type = value.type,
                            title = value.title,
                            counts = _.countBy(items, "Type"),
                            itemCount = 0;

                        $.each(counts, function (index, value) {
                            if (index === type) {
                                itemCount = value;
                            }
                        });

                        if (itemCount) {

                            var panel;

                            if ($(".tab-content").find("#loc-" + locationId + "-panel").length) {
                                panel = $(".tab-content").find("#loc-" + locationId + "-panel");
                            } else {

                                panel = $('<div role="tabpanel" class="tab-pane" id="loc-' + locationId + '-panel"></div>');
                                //panel = $('<div class="collapse" id="loc-' + locationId + '-panel"></div>');
                            }




                            // panel.append("<h2>" + locationName + "</h2>");


                            if (!panel.find(".location-title-" + locationId).length) {
                                panel.append('<h2 class="location-title-' + locationId + '">' + locationName + '</h2>');
                            }



                            $.each(_.where(items, { Type: type }), function (index, value) {

                                var equalLocation = false;

                                equalLocation = parseInt(value.LocationId) === parseInt(locationId);

                                if (value.Type === type && equalLocation) {

                                    if (!panel.find(".type-title-" + type).length) {

                                        panel.append('<h3 data-type="' + type + '" class="type-header type-title-' + type + '">' + type + '</h3>');
                                    }
                                    var d = value.DateCreated;
                                    var dFormatted = moment(d).format('DD/MM/YYYY h:mm a');

                                    // var dForCheck = moment(d).format('DD/MM/YYYY');
                                    value.DateFormatted = dFormatted;

                                    value.Time = "";


                                    if (type === "Scoped") {
                                        value.QuantityLabel = "Scoped Qty:";
                                    }

                                    else if (type === "Completed") {
                                        value.QuantityLabel = "Invoiced Qty:";
                                    } else {
                                        value.QuantityLabel = "Ordered Qty:";
                                    }

                                    if (!panel.find("#" + type + "-" + value.OrderItemId).length) {
                                        panel.append(itemTemplate(value));
                                    }

                                }
                            });



                            $(".tab-content").append(panel);
                        }

                    });

                });

                var foundTypeArray = [];

                $.each($('.tab-pane'), function (index, value) {
                    var tabPane = $(this);

                    $.each(tabPane.find('.type-header'), function (index, value) {
                        var el = $(this);
                        var type = el.attr("data-type");

                        foundTypeArray.push(type);

                        var itemCount = tabPane.find("[id^='" + type + "']").length;

                        var nameWithCount = el.html() + " (" + itemCount + ")";
                        el.html(nameWithCount);


                    });


                });

                $.each($('.tab-pane'), function (index, value) {

                    var tabPane = $(this),
                        locationId = tabPane.attr("id").replace("loc-", "").replace("-panel", ""),
                        locationIndex;


                    $.each(window.locationArray, function (index, value) {
                        if (value.id === locationId) {
                            locationIndex = index;
                        }

                    });

                    if (!tabPane.find(".pane-nav").length) {
                        $("<ul class='pane-nav'></ul>").insertAfter(tabPane.find("[class^='location-title']"));
                    }

                    $.each(foundTypeArray, function (index, value) {
                        //$(".inner").wrapAll("<div class='new' />");

                        var paneNav = tabPane.find(".pane-nav");

                        var itemCount = tabPane.find("[id^='" + value + "']").length;

                        var typeObj = {
                            name: value,
                            count: itemCount
                        };

                        if (!jsonFind(window.locationArray[locationIndex].types, "name", value).length && itemCount > 0) {
                            window.locationArray[locationIndex].types.push(typeObj);
                        }




                        var icon = "";

                        switch (value) {
                            case "Completed":
                                icon = "<i class='fa fa-check' aria-hidden='true'></i> ";
                                break;
                            case "Defected":
                                icon = "<i class='fa fa-times' aria-hidden='true'></i> ";
                                break;
                            case "InProgress":
                                icon = "<i class='fa fa-clock-o' aria-hidden='true'></i> ";
                                break;
                            case "Scoped":
                                icon = "<i class='fa fa-calendar-check-o' aria-hidden='true'></i> ";
                                break;
                        }
                        if (!paneNav.find(".pane-nav-item-" + value).length && itemCount) {
                            if (index === 0) {
                                paneNav.append("<li class='pane-nav-item-" + value + "'><a href='#' class='selected' data-anchor-type='" + value + "'>" + icon + value + " (" + itemCount + ")</a></li>");
                            } else {
                                paneNav.append("<li class='pane-nav-item-" + value + "'><a href='#' data-anchor-type='" + value + "'>" + icon + value + " (" + itemCount + ")</a></li>");
                            }

                        }


                        if (index === 0) {
                            if (!tabPane.find(".type-container-" + value).length) {
                                tabPane.find("[data-type='" + value + "'],[id^='" + value + "']").wrapAll("<div class='type-container-" + value + "' />");
                            }
                        } else {
                            if (!tabPane.find(".type-container-" + value).length) {
                                tabPane.find("[data-type='" + value + "'],[id^='" + value + "']").wrapAll("<div class='type-container-" + value + " hidden' />");
                            }
                        }



                    });



                });

                console.log(window.locationArray);

                var typeCounts = [];

                $.each(window.locationArray, function (index, value) {

                    typeCounts.push(value.types.length);

                });

                var maxCount = Math.max.apply(Math, typeCounts);
                var html = "<table class='table-summary-info table'>";



                $.each(window.locationArray, function (index, value) {
                    var row = value,
                        location = row.name;


                    html += "<tr><td colspan='" + maxCount + "' class='location-td'> " + (index + 1) + ". " + location + "</td></tr>";

                    $.each(row.types, function (index, value) {

                        if (parseInt(value.count) > 0) {
                            if (index === 0) {
                                html += "<tr>";
                            }
                            html += "<td>" + value.name + ": " + value.count + "</td>";

                            if (index === (row.types.length - 1)) {
                                html += "</tr>";
                            }
                        }


                    });


                });

                html += "</table>";

                $(".location-summary-info a").attr("data-content", html);

               
                $(".tab-content").find(".pane-nav:empty").prev().hide();
                $(".tab-content").find(".pane-nav:empty").hide();
            }

        };

        $.getJSON("/Json/WorkHistory.json").done(callback);




    },

    showLocationPane: function (obj) {
        $(".tab-content").find(".tab-pane").removeClass("active");
        $(".tab-content").find($(obj).attr("data-link")).addClass("active");
    },


};

//$(".navbar-toggler").click(function () {
//    //alert($("#navbarHeader").hasClass("show"));

//    if (!$("#navbarHeader").hasClass("show")) {
//        $(this).html('<i class="fas fa-caret-up"></i>');
//    }
//    else {
//        $(this).html('<i class="fas fa-caret-down"></i>');
//    }
//});