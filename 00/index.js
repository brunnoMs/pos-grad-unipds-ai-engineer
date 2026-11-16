import tf from '@tensorflow/tfjs-node';

async function trainModel(inputXs, outputYs) {
    const model = tf.sequential()


    //Primeira Camada
    //inputShape -> quantidade da entrada das posições | Ex.: 7 posições (idade normalizada + 3 cores + 3 localizações)
    //units      -> quantidade de neuronios
    //activation -> filtro | Ex.: usando a ReLU, mantem dados interessantes seguirem na rede. Informação > 0 passa, informação <= 0 é descartada
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }))

    //Camada de Saida
    //units      -> 3 neuronios refletindo as 3 categorias (premium, medium, basic)
    //activation -> softmax normaliza a saida em probabilidades
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

    //Compilação do Modelo
    //optmizer -> otimizador utilizado | Ex.: adam (adaptive moment estimation), ajusta pesos de forma eficiente, aprende com o historico de erros e acertos
    //loss     -> compara o que o modelo "acha" (os scores de cada categoria) com a resposta certa
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    })

    //Treinamento do Modelo
    //inputs e outputs
    //object -> 
    //       -> verbose | desabilita log interno (usa só callback) 
    //       -> epoch | quantidade de vezes que vai rodar no dataset
    //       -> shuffle | embaralha os dados para evitar vies
    await model.fit(
        inputXs,
        outputYs,
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            callbacks: {
                // onEpochEnd: (epoch, log) => console.log(`Epoch: ${epoch}: Loss = ${log.loss}`)
            }
        }
    )

    return model
}

async function predict(model, person) {
    //transformando array js em tensor
    const tfInput = tf.tensor2d(person)

    //faz a predição
    const pred = model.predict(tfInput)
    const predArray = await pred.array()
    return predArray[0].map((prob, index) => ({ prob, index }))
}

// Exemplo de pessoas para treino (cada pessoa com idade, cor e localização)
// const pessoas = [
//     { nome: "Erick", idade: 30, cor: "azul", localizacao: "São Paulo" },
//     { nome: "Ana", idade: 25, cor: "vermelho", localizacao: "Rio" },
//     { nome: "Carlos", idade: 40, cor: "verde", localizacao: "Curitiba" }
// ];

// Vetores de entrada com valores já normalizados e one-hot encoded
// Ordem: [idade_normalizada, azul, vermelho, verde, São Paulo, Rio, Curitiba]
// const tensorPessoas = [
//     [0.33, 1, 0, 0, 1, 0, 0], // Erick
//     [0, 0, 1, 0, 0, 1, 0],    // Ana
//     [1, 0, 0, 1, 0, 0, 1]     // Carlos
// ]

// Usamos apenas os dados numéricos, como a rede neural só entende números.
// tensorPessoasNormalizado corresponde ao dataset de entrada do modelo.
const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], // Erick
    [0, 0, 1, 0, 0, 1, 0],    // Ana
    [1, 0, 0, 1, 0, 0, 1]     // Carlos
]

// Labels das categorias a serem previstas (one-hot encoded)
// [premium, medium, basic]
const labelsNomes = ["premium", "medium", "basic"]; // Ordem dos labels
const tensorLabels = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
];

// Criamos tensores de entrada (xs) e saída (ys) para treinar o modelo
const inputXs = tf.tensor2d(tensorPessoasNormalizado)
const outputYs = tf.tensor2d(tensorLabels)

const model = await trainModel(inputXs, outputYs)

const person = { name: "Ze", age: 28, color: "green", locatization: "Curitiba" }
//Normalizando idade
//Exemplo: idade_min = 25, idade_max = 40, então (28 - 25) / (40 - 25) = 0.2

const normalizedTensorPerson = [
    [0.2, 0, 0, 1, 0, 0, 1]
]

const predictions = await predict(model, normalizedTensorPerson)
const results = predictions.sort((a, b) => b.prob - a.prob).map(p => `${labelsNomes[p.index]} (${(p.prob * 100).toFixed(2)}%)`).join('\n')

console.log(results)