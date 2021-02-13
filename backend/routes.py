from config import app, db, jsonify, request
from models import Car, Driver, Garage

@app.route('/', methods=['GET'])
def index():
  return 'Sistema de cadastro de Carros<br>' +\
    '<a href="/index-cars">Veja os carros cadastrados aqui</a>'


@app.route('/index/<string:table>', methods=['GET'])
def index_table(table):
  data = None

  if table == 'cars':
    data = db.session.query(Car).all()
  elif table == 'drivers':
    data = db.session.query(Driver).all()
  elif table == 'garages':
    data = db.session.query(Garage).all()

  json_data = [_.json() for _ in data]
  response = jsonify(json_data)
  response.headers.add("Access-Control-Allow-Origin", "*")

  return response


@app.route('/create_car', methods=['POST'])
def create_car():
  response = jsonify({"result": "success", "details": "ok"})

  data = request.get_json()

  try:
    new_car = Car(**data)
    db.session.add(new_car)
    db.session.commit()

  except Exception as e:
    response = jsonify({"result": "error", "details": str(e)})

  response.headers.add("Access-Control-Allow-Origin", "*")

  return response


@app.route('/delete_car/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
  response = jsonify({"result": "success", "details": "ok"})

  try:
    Car.query.filter(Car.id == car_id).delete()
    db.session.commit()

  except Exception as e:
    response = jsonify({"result": "error", "details": str(e)})

  response.headers.add("Access-Control-Allow-Origin", "*")

  return response


@app.route('/create_garage', methods=['POST'])
def create_garage():
  response = jsonify({"result": "success", "details": "ok"})

  data = request.get_json()

  try:
    new_garage = Garage(**data)
    db.session.add(new_garage)
    db.session.commit()

  except Exception as e:
    response = jsonify({"result": "error", "details": str(e)})

  response.headers.add("Access-Control-Allow-Origin", "*")

  return response