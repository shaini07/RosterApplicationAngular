function editEvent(event) {   
    
    $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    if (event.shiftId != undefined) {
        // $("#drpShift option:contains(" + event.name + ")").attr('selected', 'selected');
        $("#drpPopupShift").prop('selectedIndex', event.shiftId);
    }
    else {
        $("#drpPopupShift").val("");
    }
    $('#event-modal input[name="event-start-date"]').val(event ? $.date(event.startDate) : '');
    $('#event-modal input[name="event-end-date"]').val(event ? $.date(event.endDate) : '');
    $('#event-modal').modal();
}
function deleteEvent(event) {    
    var dataSource = $('#calendar').data('calendar').getDataSource();
    for (var i in dataSource) {
        if (dataSource[i].id == event.id) {
            dataSource.splice(i, 1);
            break;
        }
    }
    $('#calendar').data('calendar').setDataSource(dataSource);
}
function renderCalendarControl() {
    var currentYear = new Date().getFullYear();
    var date = new Date();
    $('#calendar').calendar({
        maxDate: new Date(2200, 5, 22),
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        enableContextMenu: true,
        displayWeekNumber: true,
        enableRangeSelection: true,
        contextMenuItems: [
            {
                text: 'Update',
                click: editEvent
            },
            {
                text: 'Delete',
                click: deleteEvent
            }
        ],
        selectRange: function (e) {            
            if (e.id != null && e.id != undefined) {
                editEvent({ id: e.id, shiftId: e.shiftId, name: e.name, startDate: e.startDate, endDate: e.endDate });
            }
            else {
                e = getEventDetails(e);                
                editEvent({ id: e.id, shiftId: e.shiftId, name: e.name, startDate: e.startDate, endDate: e.endDate });
            }
        },
        mouseOnDay: function (e) {
            if (e.events.length > 0) {
                var content = '';

                for (var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                                    + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'                                   
                                + '</div>';
                }

                $(e.element).popover({
                    trigger: 'manual',
                    container: 'body',
                    html: true,
                    content: content
                });

                $(e.element).popover('show');
            }
        },
        mouseOutDay: function (e) {
            if (e.events.length > 0) {
                $(e.element).popover('hide');
            }
        },
        dayContextMenu: function (e) {
            $(e.element).popover('hide');
        },
        dataSource: []
    });
}

function getEventDetails(e) {    
    var event = e;
    var dataSource = $('#calendar').data('calendar').getDataSource();
    for (var i in dataSource) {
        if ($.date(event.startDate) >= $.date(dataSource[i].startDate) && $.date(event.startDate) <= $.date(dataSource[i].endDate)) {
            event.shiftId = dataSource[i].shiftId;
            event.name = dataSource[i].name;
            event.id = dataSource[i].id;           
        }
    }
    return event;
}