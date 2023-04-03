const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql');

const PROTO_PATH = './user.proto';
const options =
{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

console.log(packageDefinition);

const usersProto = grpc.loadPackageDefinition(packageDefinition);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'penduduk'
});

db.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Connected to database')
});

const server = new grpc.Server();

server.addService(usersProto.UserService.service, {
  ListUser:(call, callback) => {
    db.query('SELECT * FROM data', (error, results) => {
        if (error) {
            console.error(error);
            callback(error, null);
            return;
          }
          const users = results
        if (!users.length) {
            callback({ code: grpc.status.NOT_FOUND, details: 'User not found' }, null);
            return;
        }
    })
    callback(null, { users });
  },  
  AddUser: (call, callback) => {
    const user = call.request;
    db.query('INSERT INTO data SET ?', user, (error, result) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      user.id = result.insertId;
      callback(null, { success: true, user });
    });
  },
  GetUser: (call, callback) => {
    const id = call.request.id;
    db.query('SELECT * FROM data WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      const user = results[0];
      if (!user) {
        callback({ code: grpc.status.NOT_FOUND, details: 'User not found' }, null);
        return;
      }
      callback(null, { user });
    });
  },
  UpdateUser: (call, callback) => {
    const user = call.request;
    db.query('UPDATE data SET nama = ?, umur = ? WHERE id = ?', [user.name, user.email, user.id], (error) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      callback(null, { success: true });
    });
  },
  DeleteUser: (call, callback) => {
    const id = call.request.id;
    db.query('DELETE FROM data WHERE id = ?', [id], (error) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
    }
    callback(null, { success: true });
    });
  }
});



server.bindAsync('127.0.0.1:3500', grpc.ServerCredentials.createInsecure(),
(error, port) => {
  console.log("Server running at http://127.0.0.1:3500");
  server.start();
}
)
