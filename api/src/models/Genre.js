const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // esta tabla se carga con una consulta a RAWG
    sequelize.define('genre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
