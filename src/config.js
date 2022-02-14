export default {

    filesystem: {
        path: process.env.PWD + '/data'
    },

    mongodb: {
        string: 'mongodb+srv://user:user123@cluster0.n3sme.mongodb.net/eCommerce',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    }, 

    firebase: {
        apiKey: "AIzaSyA3WD5Kixj1i8n_D7A3Aa3HdGoRqcqQFPM",
        authDomain: "segunda-entrega-coder.firebaseapp.com",
        projectId: "segunda-entrega-coder",
        storageBucket: "segunda-entrega-coder.appspot.com",
        messagingSenderId: "24036845751",
        appId: "1:24036845751:web:32da5b1f49cd6c53920532",
        measurementId: "G-HS5Q3374S2"
      }

}