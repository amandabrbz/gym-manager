const fs = require("fs");
const data = require("./data.json");

//create
exports.post = function (req, res) {
  /** VALIDACAO **/
  const keys = Object.keys(req.body); //cria as chaves sem os valores do forms

  for (key of keys) {
    //percorre todas as chave e verifica se está vazio
    if (req.body[key] == "") {
      return res.send("Preencha todos os campos");
    }
  }

  /** ORGANIZACAO **/
  let { avatar_url, name, birth, gender, services } = req.body;

  /** TRATAMENTO **/
  birth = Date.parse(req.body.birth); //transforma a string birth em timestamp
  const createdAt = Date.now(); //criando a data de hoje em timestamp
  const id = Number(data.instructors.length + 1); //criando uma chave unica para cada log

  /** ENVIA O NECESSARIO **/
  data.instructors.unshift({
    id,
    name,
    birth,
    gender,
    services,
    avatar_url,
    createdAt,
  });

  //armazenar send em um arquivo as json e trativa de erro com callbacks (err)
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error");

    return res.redirect("/members");
  });
};

//delete
