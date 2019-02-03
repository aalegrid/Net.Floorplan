var floorplanHistory = {

    init: function () {

        $(".period-links a").click(function () {

            $(".map").find("canvas").attr("id", "img-canvas");

            var cv = document.getElementById("img-canvas"),
                cvctx = cv.getContext("2d");

            cvctx.clearRect(0, 0, cv.width, cv.height);

            var group = $(this).attr("data-group"),
                fillStyles = {
                    //"PastYear": "rgba(68, 140, 203, 0.5)",
                    //"SixMonths": "rgba(124, 197, 118, 0.5)",
                    "Completed": "rgba(68, 140, 203, 0.3)",
                    "InProgress": "rgba(140, 98, 57, 0.5)",
                    "Scoped": "rgba(255, 245, 104, 0.5)",
                    "Defected": "rgba(255, 0, 0, 0.5)"
                },
                img = document.getElementById('floorplan'),
                width = img.clientWidth,
                originalWidth = window.originalImageWidth,
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

        $('#image-map area').on('click', function (event) {
            event.preventDefault();
            // <area alt="alt" shape="rect" coords="280,23,418,127" id="loc-40" href="#loc-40-panel" data-hasqtip="0" aria-describedby="qtip-0">

            //<div class="tab-content"><div role="tabpanel" class="tab-pane active" id="loc-40-panel"></div></div>
            $(".tab-content").find(".tab-pane").removeClass("active");
            $(".tab-content").find($(this).attr("href")).addClass("active");


        });



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
                    itemTemplateSpider = _.template($("#work_history_template_spider").html()),
                    itemTemplateSpyderware = _.template($("#work_history_template_spyderware").html()),
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
                                        panel.append(itemTemplateSpyderware(value));
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
                var html = "<table class='table-summary-info table table-striped'>";



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
            }

        };

        $.getJSON("/Json/WorkHistory.json").done(callback);




    },



    showLink: function (obj) {
        $(".tab-content").find(".tab-pane").removeClass("active");
        $(".tab-content").find($(obj).attr("data-link")).addClass("active");
    }
};