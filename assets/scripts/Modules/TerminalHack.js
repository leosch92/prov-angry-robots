#pragma strict

@script RequireComponent (Health)

private var health : Health;
private var animationComp : Animation;

public var prov : EnviromentProv = null;

health = GetComponent.<Health> ();
animationComp = GetComponentInChildren.<Animation> ();

function Awake()
{
	prov = GetComponent(EnviromentProv);
	if(prov == null)
	{
		prov = GetComponentInParent(EnviromentProv); 
	}
}
function Start () {
	UpdateHackingProgress ();
	enabled = false;
}

function OnTriggerStay (other : Collider) {
	if (other.gameObject.tag == "Player")
		health.OnDamage (Time.deltaTime, Vector3.zero, this.gameObject);
}

function OnHacking () {
	enabled = true;
	UpdateHackingProgress ();
}

function OnHackingCompleted () {
	audio.Play ();
	animationComp.Stop ();
	enabled = false;
	
	// Provenance
	prov.Prov_Enviroment("Terminal", this.gameObject);
	prov.Prov_UnlockInfluence();
}

function UpdateHackingProgress () {
	animationComp.gameObject.SampleAnimation (animationComp.clip, (1 - health.health / health.maxHealth) * animationComp.clip.length);
}

function Update () {;
	UpdateHackingProgress ();
	
	if (health.health == 0 || health.health == health.maxHealth) {
		UpdateHackingProgress ();
		enabled = false;
	}
}