module.exports = {
	url: "mongodb://test:test@ds015780.mlab.com:15780/restracetest",
	entities: [
		{ 
			key: "Race", 
			schemaPath: "../../lib/schema/RaceSchema", 
			repositoryPath: "../../lib/repository/RaceRepository"
		},
		{
			key: "User",
			schemaPath: "../../lib/schema/UserSchema", 
			repositoryPath: "../../lib/repository/UserRepository"
		},
		{
			key: "Waypoint",
			schemaPath: "../../lib/schema/WaypointSchema", 
			repositoryPath: "../../lib/repository/WaypointRepository"
		},
		{
			key: "Participant",
			schemaPath: "../../lib/schema/ParticipantSchema", 
			repositoryPath: "../../lib/repository/ParticipantRepository"
		}
	]
}