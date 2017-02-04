var payloadFlag;

$( document ).ready(function() {
  payloadFlag = $('#payloadFlag').val();
});

var makeRequest = function(url, verb, payload, type, callback){
  var requestDetails = {};

  if(payloadFlag == "json"){
    requestDetails.contentType = "application/json";
    requestDetails.payload = JSON.stringify(payload);
  } else if(payloadFlag == "xml"){
    requestDetails.contentType = "text/xml";
    requestDetails.payload = '<booking>' + x2js.json2xml_str(payload) + '</booking>';
  } else if(payloadFlag == "form"){
    requestDetails.contentType = "application/x-www-form-urlencoded";
    requestDetails.payload = $.param(payload);
  }

  $.ajax({
    url: url,
    type: verb,
    data: requestDetails.payload,
    contentType: requestDetails.contentType,
    success: function(data){
      callback(data);
    },
    statusCode: {
      400: function(data) {
        highlightInputs(type, JSON.parse(data.responseText));
      }
    }
  });
}

var createBooking = function(){
  var booking = {
        "firstname": $('#createFirstname').val(),
        "lastname": $('#createLastname').val(),
        "totalprice": $('#createTotalprice').val(),
        "depositpaid": $('#createDepositpaid').val(),
        "dob": $('#createAge').val(),
        "bookingdates": {
            "checkin": $('#createCheckin').val(),
            "checkout": $('#createCheckout').val()
        },
      };

  var message = validate(booking, constraints);

  if(highlightInputs('create', message)){
    makeRequest('/booking', 'POST', booking, 'create', function(data){
      $('#form').modal('toggle');
    })
  }
}

var editBooking = function(){
  var requestDetails = {},
      booking = {
        "firstname": $('#editFirstname').val(),
        "lastname": $('#editLastname').val(),
        "totalprice": $('#editTotalprice').val(),
        "depositpaid": $('#editDepositpaid').val(),
        "dob": $('#editAge').val(),
        "bookingdates": {
            "checkin": $('#editCheckin').val(),
            "checkout": $('#editCheckout').val()
        },
      },
      bookingId = $('#editBookingId').val();

  var message = validate(booking, constraints);

  if(highlightInputs('edit', message)){
    makeRequest('/booking/' + bookingId, 'PUT', booking, 'edit', function(data){
      $('#editModal').modal('toggle');
    });
  }
};

var partialEditBooking = function(value, item, bookingId){
  var requestDetails = {},
      booking = {
        "dob": $('#editAge').val(),
      };

  var itemName = item.replace('edit','').toLowerCase();

  if(itemName == 'checkin' || itemName == 'checkout'){
      booking['bookingdates'] = {
          'checkin': $('#editCheckin').val(),
          'checkout': $('#editCheckout').val()
      }
  } else {
      booking[itemName] = value;
  }

  var message = validate(booking, constraints);

  if(highlightInputs('edit', message)){
    makeRequest('/booking/' + bookingId, 'PATCH', booking, 'edit', function(data){
      $('#editStatus').text('Booking updated');
    });
  }
};

var deleteBooking = function(id){
  $.ajax({
    url: '/booking/' + id,
    type: 'DELETE',
    success: function(data){
      location.reload();
    }
  })
};
