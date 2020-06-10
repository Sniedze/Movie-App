exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username").unique().notNullable();
      table.string("password").notNullable();
      table.string("email").notNullable().unique();
      table.string("recover_password_token");
      table.boolean("recover_password_active").defaultTo(false);
      table.datetime("recover_password_exp_date");
    })
    .createTable("movies", (table) => {
      table.increments("id");
      table.string("title");
      table.string("year");
      table.boolean("watched").defaultTo(false);
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("movies").dropTableIfExists("users");
};
