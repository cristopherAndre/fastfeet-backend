<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  FastFeet
</h3>

<h3 align="center">
  :warning: Desafio Final :warning:
</h3>

<p>Esse desafio faz parte do Desafio Final, que é uma aplicação completa (Back-end, Front-end e Mobile) que é avaliada para emissão do Certificado do Bootcamp GoStack.</p>


### **Um pouco sobre as ferramentas**

Você deverá criar a aplicação do zero utilizando o [Express](https://expressjs.com/), além de precisar configurar as seguintes ferramentas:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilize PostgreSQL ou MySQL);

### Ajuda

Instale o Docker e crie uma instância do Postgress com o seguinte comando:

    docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

### Iniciando aplicação

    yarn
    yarn sequelize db:migrate
    yarn sequelize db:seed:all
    yarn dev

### Endereço de execução

    localhost:3333

---

