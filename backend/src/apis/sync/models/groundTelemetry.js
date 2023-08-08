// const Sequelize = require("sequelize");
// const db = require("../../../config/database");

// const GroundTelemetry = db.sequelize.define(
//     "ground_telemetry_data",
//     {
//         id: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: Sequelize.INTEGER,
//         },
//         time:{
//             type:Sequelize.DATE
//         },
//         station:{
//             type:Sequelize.STRING(20)
//         },
//         bearing:{
//             type:Sequelize.STRING(50)
//         },
//         signal:{
//             type:Sequelize.STRING(50)
//         },
//         bias:{
//             type:Sequelize.STRING(50)
//         },
//         notes:{
//             type:Sequelize.TEXT
//         }
//     },
//     { timestamps: true ,underscored: true}
// );

// //GroundTelemetry.sync({alter:true}).then()
// module.exports = GroundTelemetry;
