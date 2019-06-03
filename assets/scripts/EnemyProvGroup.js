#pragma strict

public var prov : ExtractProvenance = null;
public var enemyType : String;

function Awake()
{
	// Load provenance pointers
	var provObj : GameObject = GameObject.Find("Provenance");
	prov = GetComponent(ExtractProvenance); 
	
	prov.influenceContainer = provObj.GetComponent(InfluenceController); 
	prov.provenance = provObj.GetComponent(ProvenanceController); 
	
	Prov_Enemy();
}

public function Prov_Enemy()
{
	prov.NewAgentVertex(enemyType,"");
}