module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        userName: {
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull:false,
        },
    });

    Users.associate = (models) => {
        Users.hasMany(models.Likes, {
            onDelete:"cascade",
        });
        Users.hasMany(models.Posts, {
            onDelete:"cascade",
            onUpdate:"cascade",
        });
        Users.hasMany(models.Comments, {
            onDelete:"cascade",
            onUpdate:"cascade",
        });
    };
    return Users;
};

