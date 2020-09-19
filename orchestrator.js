const net = require('net');
const { readFile } = require('fs');
const client = net.Socket();

const query = "1 CONNECT 2";

readFile("../atividade3/lista_dispositivos.txt", (err, data) => {
    const devices = data.toString().split("\n").map((aux) => {
        const obj = aux.split(' ');
        return {
            name: obj[0],
            ip: obj[1],
            port: obj[2]
        }
    }
    );

    let [origin, command, destination] = query.split(' ');
    console.log(`Origin: ${origin}, ${command}, ${destination}`);

    let originDevice = devices[origin - 1];
    let destinationDevice = devices[destination - 1];

    client.connect(originDevice.port, originDevice.ip, () => {
        console.log("Connected to orchestrator. Sending command");
        client.write(JSON.stringify(destinationDevice));
    });
});


//     connectDevices(devicesLength, devices).then((res) => {
//         console.log("Res", res);
//     }).catch((error) => {
//         console.log(error);
//     })

// });
// async function connectDevices(devicesLength, devices) {
//     const promises = [];
//     for (let index = 0; index < devicesLength; index++) {
//         const promise = new Promise((resolve, reject) => {
//             const currentDevice = devices[index];
//             let nextDevice;
//             if (devices[index + 1]) {
//                 nextDevice = devices[index + 1];
//             } else if (index != 0) {
//                 nextDevice = devices[0];
//             } else if (devices[index - 1]) {
//                 nextDevice = devices[index - 1];
//             } else {
//                 console.log("ERROR");
//                 throw (new Error("Unavailable device"));
//             }

//             nextDevice.port = nextDevice.port.replace('\r', '');
//             nextDevice.port = nextDevice.port.replace('r', '');

//             let msg = `${currentDevice.name} CONECTAR ${nextDevice.name}`;


//             try {
//                 client.connect(nextDevice.port, nextDevice.ip, () => {
//                     console.log("Conectou!", nextDevice.name);
//                     client.write('serverrecept', { msg });
//                 });

//                 client.on('clientrecept', (mensagem) => {
//                     console.log("Mensagem: ", mensagem);
//                 });
//             } catch (error) {
//                 reject(error);
//             } finally {
//                 resolve('Success');
//             }

//         });

//         promises.push(promise);


//         const result = await Promise.all(promises);
//         return result;
//     }
// }
