"use strict";
const User = require("../../user/model/user")
const Project = require("./project")
const Sequelize = require("sequelize");
const db = require("../../../config/database");

const ProjectAccess = db.sequelize.define(
    "project_access",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        username: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        project_id: {
            type: Sequelize.STRING(20),
            allowNull: false
        },

        project_role:{
            type: Sequelize.ENUM("submitter","manager"),
            allowNull: false
        },
        status:{
            type:Sequelize.ENUM("pending","approved","rejected"),
            defaultValue:"pending"
        }
    },
    { timestamps: true }
);

ProjectAccess.belongsTo(User,{
    foreignKey:"username",
    targetKey:"username",
    as:"user"
})

ProjectAccess.belongsTo(Project,{
    foreignKey:"project_id",
    targetKey:"project_id",
    as:"project"
})

ProjectAccess.sync({force:true}).then()
module.exports = ProjectAccess;
