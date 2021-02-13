$(function() {
  function indexCars() {
    $.ajax({
        url: 'http://localhost:5000/index/cars',
        method: 'GET',
        dataType: 'json',
        success: listCars,
        error: () => {
            alert("Erro no backend!");
        }
    });

    function listCars(cars) {
      $('#carsTableContent').empty();
      showContent('cars');

      for (var i in cars) {
          line = `<tr id="line_${cars[i].id}">
            <td>${cars[i].name}</td>
            <td>${cars[i].car_type}</td>
            <td>${cars[i].brand}</td>
            <td>
              <a href=# id="${cars[i].id}" class="delete_car">
                <p class="badge badge-danger">Excluir</p>
              </a>
            </td>
            </tr>`;
          $('#carsTableContent').append(line);
      }
    }
  }

  function indexDrivers() {
    $.ajax({
        url: 'http://localhost:5000/index/drivers',
        method: 'GET',
        dataType: 'json',
        success: listDrivers,
        error: () => {
            alert("Erro no backend!");
        }
    });

    function listDrivers(drivers) {
      $('#driversTableContent').empty();
      showContent('drivers');

      for (var i in drivers) {
          line = `<tr id="line_${drivers[i].id}">
            <td>${drivers[i].name}</td>
            <td>${drivers[i].age}</td>
            <td>${drivers[i].email}</td>
            </tr>`;
          $('#driversTableContent').append(line);
      }
    }
  }

  function indexGarages() {
    $.ajax({
        url: 'http://localhost:5000/index/garages',
        method: 'GET',
        dataType: 'json',
        success: listGarages,
        error: () => {
            alert("Erro no backend!");
        }
    });

    function listGarages(garages) {
      $('#garagesTableContent').empty();
      showContent('garages');

      for (var i in garages) {
          line = `<tr id="line_${garages[i].id}">
            <td>${garages[i].name}</td>
            <td>${garages[i].zip_code}</td>
            <td>${garages[i].driver.name}</td>
            <td>${garages[i].driver.age}</td>
            <td>${garages[i].driver.email}</td>
            <td>${garages[i].car.name}</td>
            <td>${garages[i].car.car_type}</td>
            <td>${garages[i].car.brand}</td>
            </tr>`;
          $('#garagesTableContent').append(line);
      }
    }
  }

  function showContent(indentifier) {
    $('#cars').addClass('d-none');
    $('#drivers').addClass('d-none');
    $('#garages').addClass('d-none');
    $('#initialContent').addClass('d-none');
    $(`#${indentifier}`).removeClass('d-none');
  }

  $(document).on('click', '#linkHome', () => {
    showContent('initialContent');
  });

  $(document).on('click', '#linkIndexCars', () => {
    indexCars();
  });

  $(document).on('click', '#linkIndexDrivers', () => {
    indexDrivers();
  });

  $(document).on('click', '#linkIndexGarages', () => {
    indexGarages();
  });

  $(document).on('click', '#btnCreateCar', () => {
    carName = $('#nameCarField').val();
    car_type = $('#carTypeField').val();
    brand = $('#brandField').val();

    if(carName !== '' || car_type !== '' || brand !== '') {
      var data = JSON.stringify({ name: carName, car_type: car_type, brand: brand});
    }

    $.ajax({
      url: 'http://localhost:5000/create_car',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: data,
      success: insertCar,
      error: includeError,
    });

    function insertCar(returnedData) {
      if (returnedData.result === 'success') {
        $('#nameCarField').val('');
        $('#carTypeField').val('');
        $('#brandField').val('');

        alert('Carro inserido com sucesso!');
      } else {
        alert(`${returnedData.result}: ${returnedData.details}`)
      }
    }

    function includeError(returnedData) {
      alert(`${returnedData.result}: ${returnedData.details}`);
    }

    $(`#modalCreateCar`).on('hide.bs.modal', (e) => {
      if (! $('#cars').hasClass('d-none')) {
        indexCars();
      }
    });

  });

  $(document).on('click', '.delete_car', function() {
    var selectedCar = $(this).attr("id");

    $.ajax({
      url: `http://localhost:5000/delete_car/${selectedCar}`,
      type: "DELETE",
      dataType: 'json',
      success: deleteCar,
      error: deleteError
    });

    function deleteCar(returnedData) {
      if (returnedData.result === 'success') {
        $(`#line_${selectedCar}`).fadeOut(500, () => {
          alert('Carro excluído com sucesso!');
        });
      } else {
        alert(`${returnedData.result}: ${returnedData.details}`);
      }
    }

    function deleteError(returnedData) {
      alert('Erro ao excluir o carro!')
    }
  })

  function loadComp(idTable, tableName) {
    $.ajax({
      url: `http://localhost:5000/index/${tableName}`,
      type: 'GET',
      dataType: 'json',
      success: load,
      error: function(e) {
        alert('Erro no backend!');
      }
    });

    function load(data) {
      for (var i in data) {
        $(`#${idTable}`).append(
          $('<option></option>').attr("value",
            data[i].id).text(data[i].name));
      }
    }
  }

  $('#modalCreateGarage').on('shown.bs.modal', function(e) {
    loadComp('carIdField', 'cars');
    loadComp('driverIdField', 'drivers');
  });

  $(`#modalCreateGarage`).on('hide.bs.modal', (e) => {
    if (! $('#garages').hasClass('d-none')) {
      indexGarages();
    }
  });

  $(document).on("click", "#btnCreateGarage", function() {
    garageName = $("#nameGarageField").val();
    zip_code = $("#zipCodeField").val();
    car_id = $("#carIdField").val();
    driver_id = $("#driverIdField").val();

    var data = JSON.stringify({ name: garageName, zip_code: zip_code, car_id: car_id, driver_id: driver_id });

    $.ajax({
        url: 'http://localhost:5000/create_garage',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: data,
        success: insertGarage,
        error: includeError
    });

    function insertGarage(returnedData) {
      if (returnedData.result == "success") {
        alert("Garagem cadastrada com sucesso!");

        $("#nameGarageField").val("");
        $("#zipCodeField").val("");
        $("#carIdField").val("");
        $("#driverIdField").val("");
      } else {
        alert(`${returnedData.result}: ${returnedData.details}`);
      }
    }

    function includeError(returnedData) {
        alert("Erro no backend!");
    }
});

  showContent('initialContent');
});