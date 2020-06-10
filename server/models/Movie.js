const { Model } = require("objection");

class Movie extends Model {
  static get tableName() {
    return "movies";
  }
  static get relationMappings() {
    const User = require("./User");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movies.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Movie;
