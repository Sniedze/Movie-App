const credentials = require(__dirname + "/config/db_config");
const knexSnakeCaseMapper = require("objection").knexSnakeCaseMappers;

module.exports = {
  development: {
    client: "mysql",
    connection: {
      database: credentials.database,
      user: credentials.user,
      password: credentials.password,
    },
  },
  ...knexSnakeCaseMapper(),
};
