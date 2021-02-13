from config import db, db_file, path, remove

class Car(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  car_type = db.Column(db.String)
  brand = db.Column(db.String)
  name = db.Column(db.String)


  def __str__(self):
    return f'{self.id}. {self.name}, {self.car_type} - {self.brand}'


  def json(self):
    return {
      "id": self.id,
      "car_type": self.car_type,
      "brand": self.brand,
      "name": self.name
    }


class Driver(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
  age = db.Column(db.Integer)
  email = db.Column(db.String)


  def __str__(self):
    return f'{self.id}. {self.name}, {self.age}; {self.email}'


  def json(self):
    return {
      "id": self.id,
      "name": self.name,
      "age": self.age,
      "email": self.email,
    }


class Garage(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
  zip_code = db.Column(db.String)
  car_id = db.Column(db.Integer, db.ForeignKey(Car.id), nullable=False)
  car = db.relationship('Car')
  driver_id = db.Column(db.Integer, db.ForeignKey(Driver.id), nullable=False)
  driver = db.relationship('Driver')


  def __str__(self):
    return f'{self.id}. {self.name} - {self.zip_code}. '+\
      f'Carro {self.car_id}: {self.car.json()}; ' +\
      f'Motorista {self.driver_id}: {self.driver.json()}.'


  def json(self):
    return {
      "id": self.id,
      "name": self.name,
      "zip_code": self.zip_code,
      "car_id": self.car_id,
      "car": self.car.json(),
      "driver_id": self.driver_id,
      "driver": self.driver.json(),
    }


if __name__ == "__main__":
  if path.exists(db_file):
    remove(db_file)

  db.create_all()

  car1 = Car(name="Pampa", car_type="Funcional", brand="Ford")
  car2 = Car(name="Fusca", car_type="Popular", brand="Volkswagen")

  driver1 = Driver(name="Matheus", age=18, email="matheusogliarivenera@gmail.com")

  garage1 = Garage(name="Garagem 1", zip_code="89120-000", car=car1, driver=driver1)

  db.session.add(car1)
  db.session.add(car2)
  db.session.add(driver1)
  db.session.add(garage1)

  db.session.commit()

  print(car1)
  print(car1.json())
  print(driver1)
  print(garage1)
