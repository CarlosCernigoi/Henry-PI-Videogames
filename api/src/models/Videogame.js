const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le inyectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    // Para evitar repetir un número de videogame de los que ya tiene RAWG
    // defino el Id de tipo UUID, versión V4 y sé que tendrá un formato del tipo: 9a8bc576-6a25-4ff2-9a5e-6d4cfec8bc7b
    // de esta manera puedo diferenciarlo de un Id obtenido de la página de RAWG, que es siempre un entero
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // las columnas de la tabla deben tener el mismo nombre que las propiedades obtenidas en RAWG
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released: {
      type: DataTypes.DATEONLY,
    },
    rating: {
      type: DataTypes.DECIMAL,
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
