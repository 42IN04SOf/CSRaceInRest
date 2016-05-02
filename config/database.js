// configuration for the database.
// contains url to database
// contains directory paths to schemas, repositories
module.exports = {
	url: "mongodb://admin:admino@ds025439.mlab.com:25439/restrace",
	entities: [
		{ 
			key: "Race", 
			schemaPath: "../schema/RaceSchema", 
			repositoryPath: "../repository/RaceRepository"
		},
		{
			key: "User",
			schemaPath: "../schema/UserSchema", 
			repositoryPath: "../repository/UserRepository"
		},
		{
			key: "Waypoint",
			schemaPath: "../schema/WaypointSchema", 
			repositoryPath: "../repository/WaypointRepository"
		},
		{
			key: "Participant",
			schemaPath: "../schema/ParticipantSchema", 
			repositoryPath: "../repository/ParticipantRepository"
		}
	]
};