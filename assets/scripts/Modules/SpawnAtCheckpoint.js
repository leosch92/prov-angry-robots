#pragma strict
#pragma downcast

var checkpoint : Transform;

public var provPlayer : PlayerProv = null;

function Awake () {
	provPlayer = GetComponent(PlayerProv); 
}

function OnSignal () {
	transform.position = checkpoint.position;
	transform.rotation = checkpoint.rotation;
	
	ResetHealthOnAll ();
	
	// Provenance
	
	provPlayer.Prov_Respawn();
	
	
}

static function ResetHealthOnAll () {
	var healthObjects : Health[] = FindObjectsOfType (Health);
	for (var health : Health in healthObjects) {
		health.dead = false;
		health.health = health.maxHealth;
	}
}
