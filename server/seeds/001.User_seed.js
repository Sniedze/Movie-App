exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("movies")
    .del()
    .then(() => {
      return knex("users").del();
    })
    .then(() => {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "admin",
          email: "u.sniedze@gmail.com",
          password: "password",
        },
        {
          username: "poweruser",
          email: "pu@mail.com",
          password: "password123",
        },
      ]);
    })
    .then((userId) => {
      return knex("movies").insert([
        {
          user_id: userId[0],
          title: "Life Is Beautiful",
          year: "1997",
          watched: false,
        },
      ]);
    });
};
