import { Sequelize, DataTypes } from 'sequelize';
import applyExtraSetup from './applyExtraSetup';

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize({
	dialect: 'postgres',
	database: 'slack',
	username: 'postgres',
	password: 'postgres',
	logQueryParameters: true,
	benchmark: true,
	define: {
		freezeTableName: true
	}
});
// eslint-disable-next-line
export const modelDefiners = {
	user: require('./user').default,
	channel: require('./channel').default,
	message: require('./message').default,
	team: require('./team').default,
};

// We define all models according to their files.
Object.values(modelDefiners).forEach(model => {
	model(sequelize, DataTypes);

})

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
modelDefiners.sequelize = sequelize;
modelDefiners.Sequelize = Sequelize;
module.exports = modelDefiners;
