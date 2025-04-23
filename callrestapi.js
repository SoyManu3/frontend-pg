var url = "https://manu-pgapi.onrender.com/api/users";

// Crear usuario (POST)
function postUser() {
  console.log(url);
  var myUser = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val()
  };
  console.log(myUser);

  $.ajax({
    url: url,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(myUser),
    success: function (data) {
      console.log(data);
      resetUserForm();
      $('#resultado').html(JSON.stringify(data.user));
    },
    error: function (err) {
      $('#resultado').html('Error: ' + JSON.stringify(err.responseJSON));
    }
  });
}

// Obtener todos los usuarios (GET)
function getUsers() {
  console.log(url);
  $.getJSON(url, function(json) {
    console.log(json);
    var arrUsers = json.users;
    var html = '<table border="1"><tr>'
      + '<th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Comentarios</th><th>Acciones</th>'
      + '</tr>';
    arrUsers.forEach(function(item) {
      html += '<tr>'
        + '<td>' + item.id + '</td>'
        + '<td>' + item.name + '</td>'
        + '<td>' + item.email + '</td>'
        + '<td>' + item.age + '</td>'
        + '<td>' + item.comments + '</td>'
        + '<td>'
          + '<button onclick="fillUserForm(' + item.id + ')">Editar</button> '
          + '<button onclick="deleteUser(' + item.id + ')">Eliminar</button>'
        + '</td>'
        + '</tr>';
    });
    html += '</table>';
    $('#resultado').html(html);
  });
}

// Llenar formulario para editar (GET by id)
function fillUserForm(id) {
  $.getJSON(url + '/' + id, function(data) {
    var user = data.user;
    if (user) {
      $('#name').val(user.name).data('user-id', user.id);
      $('#email').val(user.email);
      $('#age').val(user.age);
      $('#comments').val(user.comments);
    } else {
      alert('Usuario no encontrado');
    }
  });
}

// Actualizar usuario (PUT)
function updateUser() {
  var userId = $('#name').data('user-id');
  if (!userId) {
    alert('Primero selecciona un usuario con el botón Editar.');
    return;
  }
  var myUser = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val()
  };
  $.ajax({
    url: url + '/' + userId,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(myUser),
    success: function (data) {
      alert('Usuario actualizado correctamente');
      resetUserForm();
      getUsers();
    },
    error: function (err) {
      $('#resultado').html('Error: ' + JSON.stringify(err.responseJSON));
    }
  });
}

// Eliminar usuario (DELETE)
function deleteUser(id) {
  if (confirm('¿Seguro que quieres eliminar este usuario?')) {
    $.ajax({
      url: url + '/' + id,
      type: 'DELETE',
      success: function () {
        alert('Usuario eliminado correctamente');
        getUsers();
      },
      error: function (err) {
        $('#resultado').html('Error: ' + JSON.stringify(err.responseJSON));
      }
    });
  }
}

// Obtener usuario por ID y mostrar detalle (GET)
function getByIdUser() {
  var userId = $('#user_id').val();
  if (!userId) {
    alert('Por favor ingresa un ID de usuario.');
    return;
  }
  $.ajax({
    url: url + '/' + userId,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      var u = data.user;
      var details = `
        <h3>Detalle del Usuario</h3>
        <p><strong>ID:</strong> ${u.id}</p>
        <p><strong>Nombre:</strong> ${u.name}</p>
        <p><strong>Email:</strong> ${u.email}</p>
        <p><strong>Edad:</strong> ${u.age}</p>
        <p><strong>Comentarios:</strong> ${u.comments}</p>
      `;
      $('#resultado').html(details);
    },
    error: function (err) {
      $('#resultado').html('Error: ' + JSON.stringify(err.responseJSON));
    }
  });
}

// Limpiar formulario
function resetUserForm() {
  $('#name').val('').removeData('user-id');
  $('#email').val('');
  $('#age').val('');
  $('#comments').val('');
}
