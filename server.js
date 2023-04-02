// Import package 
const grpc = require('@grpc/grpc-js');
const protobuf = require('protobufjs');
const firebasePb = require('./firebase_pb.js');
const firebaseGrpc = require('./firebase_grpc_pb.js');
const firebase = require('firebase/app');
require('firebase/database');

// Define Proto path 
const PROTO_PATH = './tes.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load Proto 
const mahasiswaProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Dummy data 
let mahasiswa = {
  mahasiswa: [
    {
      id: "1",
      nama: "Rudi",
      nrp: "5119",
      nilai: 59
    },
    {
      id: "2",
      nama: "Budi",
      nrp: "5118",
      nilai: 60
    }
  ]
}


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDra7tkHIa_HolTAdBJRjyujdcPD2c3Rqg",
  authDomain: "pemintegra.firebaseapp.com",
  projectId: "pemintegra",
  storageBucket: "pemintegra.appspot.com",
  messagingSenderId: "28937625436",
  appId: "1:28937625436:web:5fa2fad59c1ac95fb6ab99"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



// Add service in proto 
server.addService(mahasiswaProto.MahasiswaService.service, {
  // Create
  addMahasiswa: (call, callback) =>  {
    const _mahasiswa = { ...call.request };
    mahasiswa.mahasiswa.push(_mahasiswa);
    callback(null, _mahasiswa);
  },
  addSiswa: (call, callback) => {
    const _mahasiswa = call.request;
    db.collection('mahasiswa').add(_mahasiswa)
      .then((docRef) => {
        const newMahasiswa = { ..._mahasiswa, id: docRef.id };
        callback(null, newMahasiswa);
      })
      .catch((error) => {
        console.error('Error adding new mahasiswa: ', error);
        callback(error);
      });
  },
  addData: (call, callback) => {
    const key = call.request.getKey();
    const value = call.request.getValue();

    const ref = firebase.database().ref(key);
    ref.set(value);

    callback(null, new firebasePb.Empty());
},
  // Read 
  getAll: (call, callback) => {
    callback(null, mahasiswa);
  },
  getMahasiswa: (call, callback) => {
    const mahasiswaId = call.request.id;
    const mahasiswaItem = mahasiswa.mahasiswa.find(({ id }) => mahasiswaId == id);
    callback(null, mahasiswaItem);
  },
  // Update
  editMahasiswa: (call, callback) => {
    const mahasiswaId = call.request.id;
    const mahasiswaItem = mahasiswa.mahasiswa.find(({ id }) => mahasiswaId == id);
    mahasiswaItem.nama = call.request.nama;
    mahasiswaItem.nrp = call.request.nrp;
    mahasiswaItem.nilai = call.request.nilai;
    callback(null, mahasiswaItem)
  },
  // Delete 
  deleteMahasiswa: (call, callback) => {
    const mahasiswaId = call.request.id;
    mahasiswa = mahasiswa.mahasiswa.filter(({ id }) => id !== mahasiswaId);
    callback(null, {mahasiswa});
  },
})

// Start server 
// server.bindAsync(
//   "127.0.0.1:50051",
//   grpc.ServerCredentials.createInsecure(),
//   (error, port) => {
//     console.log("Server running at http://127.0.0.1:50051");
//     server.start();
//   }
// )
server.addService(firebaseGrpc.FirebaseServiceService, { addData });
server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://localhost:50051');
    server.start();
});
