const port = 3080;
const name = "Torradeira";
// const port = 3081;
// const name = "Assadeira";

const net = require('net');
const client = net.Socket();


let returnMsg;



net.createServer((socket) => {
    console.log('Socket Conectado');
    socket.pipe(socket);

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('data', (data) => {
        console.log("Data: ", data.toString());
        const newData = JSON.parse(data.toString());

        client.connect(newData.port, newData.id, () => {
            console.log("Conetado")
            client.write('greet', { msg: name + "CONECTAR" + newData.name });
        });

    });

    socket.on('end', () => {
        console.log('end');
    });
    socket.on('close', () => {
        console.log('close');
    });
    socket.on('error', (e) => {
        console.log('error ', e);
    });

    socket.on('orchestratorRequest', (data) => {
        console.log("Reived qrequest");
        client.connect(data.port, data.id, () => {
            const res = { msg: name + "CONECTAR" + data.name, info };
            client.emit('greet', name + "CONECTAR" + data.name);
        });
    });

    socket.on('greet', (data) => {
        const estado = Math.random() >= 0.5;
        let time = 0;
        client.emit('status', `${name} ${estado ? 'ativado' : 'desativado'} ${time}`)
        if (estado) {
            setTimeout(() => {
                const temperature = Math.random() * 10;
                client.emit('temperature', temperature);
            }, 30000)
        }
    });

    socket.on('status', (status) => {
        console.log(`Received status: ${status}`);
    });

    socket.on('temperature', (temperature) => {
        console.log(`Received temperature: ${temperature}`);
    });



    socket.on('serverrecept', (msg) => {
        console.log("msg: ", msg);

        const name = msg.returnMsg.parse(' ');
        const estado = Math.random() >= 0.5;
        let tries = 0;
        if (estado) {
            setTimeout(() => {
                returnMsg = `${name} ATIVADO ${tries * 30}`;
                tries++;
            }, 30000);
        } else {
            returnMsg = "DESATIVADO";
        }
    });
    if (returnMsg) {
        socket.emit('clientrecept', { returnMsg });
    }
}).listen(port, () => {
    console.log('TCP SERVER na porta', port);
});
