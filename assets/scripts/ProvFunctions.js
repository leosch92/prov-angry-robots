#pragma strict
private var prov : ExtractProvenance = null;
public var hp : Health;

function Awake()
{
	// Load provenance pointers
	var provObj : GameObject = GameObject.Find("Provenance");
	prov = GetComponent(ExtractProvenance); 
	
	if(prov == null)
	{
		prov = GetComponentInParent(ExtractProvenance); 
	}
	
	prov.influenceContainer = provObj.GetComponent(InfluenceController); 
	prov.provenance = provObj.GetComponent(ProvenanceController); 
}

//==========================================================
// Configurable
//==========================================================
// Enemy Attributes
public function Prov_GetEnemyAttributes()
{ 
	prov.AddAttribute("Health", hp.health.ToString());
}

// Player attributes
public function Prov_GetPlayerAttributes()
{
	prov.AddAttribute("Health", hp.health.ToString());
}

//==========================================================
// Player
//==========================================================

// // <INTERFACE> Player agent
public function Prov_Player()
{
	Prov_GetPlayerAttributes();
	prov.NewAgentVertex("Player","");
}

// <INTERFACE> Player Walk action
public function Prov_PlayerWalk()
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Walking","");
	prov.HasInfluence("Player_Score");
}

// <INTERFACE> Player Jump action
public function Prov_PlayerJump()
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Jump","");
	prov.HasInfluence("Player_Score");
}

// <INTERFACE> Player Interact action
public function Prov_PlayerInteract()
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Interacted","");
	prov.HasInfluence("Player_Score");
}

// <INTERFACE> Player attack action
public function Prov_PlayerAttack()
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Shooting","");
	prov.HasInfluence("Player_Score");
	//Generated Influence in the ammo instantiation (Rocket)
}

// <INTERFACE> Player took damage
function Prov_PlayerTakeDamage(enemy : GameObject, damageAmount : float)
{
	var enemyProv : ProvFunctions = enemy.GetComponent(ProvFunctions); 
	
	if(enemyProv == null)
	{
		enemyProv = enemy.GetComponentInParent(ProvFunctions); 
	}
	
	var infID : String = enemyProv.Prov_EnemyAttack(damageAmount);
	this.Prov_PlayerTakeDamage(infID);
}

// Player took damage
public function Prov_PlayerTakeDamage(infID : String)
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Being Hit","");
	// Check Influence
	prov.HasInfluence_ID(infID);
}

// <INTERFACE> Player Death action
public function Prov_PlayerDeath()
{	
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("Dead","Dead");
	//Prov_Export();
}

	
//==========================================================
// Enemy
//==========================================================
// <INTERFACE> Enemy Agent
public function Prov_Enemy()
{
	Prov_GetEnemyAttributes();
	prov.NewAgentVertex("Enemy" + this.GetInstanceID(),"");
	Prov_EnemyIdle();
}

// <INTERFACE> Enemy Idle action
public function Prov_EnemyIdle()
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Idle","");
}

// <INTERFACE> Enemy Spot action
public function Prov_EnemyOnSpot()
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Spotted","");
	prov.GenerateInfluenceC("Player", this.GetInstanceID().ToString(), "Spotted", "1", 1);
	return this.GetInstanceID().ToString();
}

// <INTERFACE> Enemy Lost Track action
public function Prov_EnemyLostTrack()
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("LostTrack","");
	prov.GenerateInfluenceC("Player", this.GetInstanceID().ToString(), "Spotted", "-1", 1);
	return this.GetInstanceID().ToString();
}

// <INTERFACE> Enemy Attack action
public function Prov_EnemyAttack(damageAmount : float)
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Attacking","");
	prov.GenerateInfluenceC("Player", this.GetInstanceID().ToString(), "Health (Player)", (-damageAmount).ToString(), 1);
	return this.GetInstanceID().ToString();
}

// <INTERFACE> Enemy Death action
public function Prov_EnemyDeath(scoreValue : float)
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Dead","Dead");
	
	if(scoreValue != 0)
		prov.GenerateInfluenceC("Player_Score", this.GetInstanceID().ToString(), "Score", scoreValue.ToString(), 1);
}

// <INTERFACE> Enemy Escaped (the scene) action
public function Prov_EnemyEscaped()
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Escaped","");
	prov.GenerateInfluenceC("Player_Score", this.GetInstanceID().ToString(), "Score Missed", "0", 1);
}

// <INTERFACE> Enemy took damage
function Prov_EnemyTakeDamage(enemy : GameObject, damageAmount : float)
{
	var enemyProv : ProvFunctions = enemy.GetComponent(ProvFunctions); 
	
	if(enemyProv == null)
	{
		enemyProv = enemy.GetComponentInParent(ProvFunctions); 
	}
	
	Prov_generateEnemyTakeDamage(damageAmount);
	enemyProv.Prov_EnemyHurt(this.GetInstanceID().ToString());
}

// Influence from taking damage
function Prov_generateEnemyTakeDamage(damageAmount : float)
{
	var heroObj : GameObject = GameObject.FindGameObjectWithTag("Player");
	var player : ProvFunctions = heroObj.GetComponent(ProvFunctions);
	player.prov.GenerateInfluenceC("Enemy", this.GetInstanceID().ToString(), "Health (Enemy)", (-damageAmount).ToString(), 1);
}

// Enemy took damage
public function Prov_EnemyHurt(infID : String)
{
	Prov_GetEnemyAttributes();
	prov.NewActivityVertex("Taking Hit","");
	prov.HasInfluence_ID(infID);
}

//==========================================================
// Export Provenance
//==========================================================

// <INTERFACE> Export Provenance Data
function Prov_Export()
{
	Debug.Log ("Exported");
	var ProvObj : GameObject = GameObject.Find("Provenance");
	var prov : ProvenanceController = ProvObj.GetComponent(ProvenanceController); 
	prov.Save("2D_Provenance");
}

//==========================================================
// Spawner
//==========================================================
/*
private function Prov_SpawnAgent()
{
	//ExtractProvenance prov = GetComponent<ExtractProvenance>(); 
	prov.NewAgentVertex("ItemSpawner","");
	
}

private void Prov_SpawnPickup()
{
	pickupSpawner.Prov_SpawnPickup("LifeBox", "Health (Player)", this.GetInstanceID().ToString(), healthBonus);
}

private function Prov_Pickup()
{
	//var playerControl : PlayerControl = GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerControl);
	//playerControl.Prov_PickUp(this.GetInstanceID().ToString());
}

public function Prov_SpawnPickup(type : String, infType : String, infID : String, value : float)
{
	var prov : ExtractProvenance = GetComponent(ExtractProvenance); 
	prov.NewEntityVertexFromAgent(type,"");
	var player : GameObject = GameObject.FindGameObjectWithTag("Player");
	prov.GenerateInfluenceMC("Player", infID, infType, value.ToString(), 1, player);

}

public function Prov_PickUp(infID : String)
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("PickedUp","");
	// Check Influence
	prov.HasInfluence_ID(infID);
}

public function RemovePickupInfluence(infID : String)
{
	prov.RemoveInfluenceID(infID);
}

public function Prov_LayBomb(infID : String)
{
	Prov_GetPlayerAttributes();
	prov.NewActivityVertex("LayingBomb","");
	prov.HasInfluence("Player_Score");
	prov.GenerateInfluence("Enemy", infID, "Health (Enemy)", "-2");
}
*/
	