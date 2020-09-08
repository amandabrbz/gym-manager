const fs = require("fs");
const data = require("./data.json");
const { age, date } = require("./utils");

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

//read
exports.show = function (req, res) {
  //req.params.id
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id;
  });

  if (!foundInstructor) {
    return res.render("404/index");
  }

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    createdAt: new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
      foundInstructor.createdAt
    ),
  };

  return res.render("instructors/show", { instructor });
};

//edit
exports.edit = function (req, res) {
  //req.params.id
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return id == instructor.id;
  });

  if (!foundInstructor) {
    return res.render("404/index");
  }

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth),
  };

  return res.render("instructors/edit", { instructor: instructor });
};

//update
exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;

  const foundInstructor = data.instructors.find((instructor, foundIndex) => {
    if (id == instructor.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundInstructor) {
    return res.render("404/index");
  }

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
  };

  data.instructors[index] = instructor;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write error");

    return res.redirect(`/instructors/${id}`);
  });
};

//delete
exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredInstructors = data.instructors.filter((instructor) => {
    return instructor.id != id;
  });

  data.instructors = filteredInstructors;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Erro");

    return res.redirect("/instructors");
  });
};
