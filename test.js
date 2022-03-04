var express = require("express");
var app = express();
var server = require('http').createServer(app);
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/test');

class User extends Model {
  static classLevelMethod() {
    return 'foo';
  }
  instanceLevelMethod() {
    return 'bar';
  }
  getFullname() {
    return [this.username, this.birthday].join(' ');
  }
}
User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'user' });

(async () => {
  await sequelize.sync();
})();

app.get('/', async (req, res) => {
  const jane = await User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  });
  res.send(jane.toJSON())
})

server.listen(3333, console.log('server runing in port 3333'))