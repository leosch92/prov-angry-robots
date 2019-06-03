#pragma strict

// This component will forward a signal only if all the locks are unlocked

var locks : Lock[];
var conditionalSignal : SignalSender;

public var prov : EnviromentProv = null;

function Awake()
{
	prov = GetComponent(EnviromentProv);
	if(prov == null)
	{
		prov = GetComponentInParent(EnviromentProv); 
	}
}

function OnSignal () {
	var locked : boolean = false;
	for (var lockObj : Lock in locks) {
		if (lockObj.locked)
			locked = true;
	}
	
	if (locked == false)
	{
		conditionalSignal.SendSignals (this);
		
		// Provenance
		prov.Prov_Unlock(this.gameObject);
		
	}
}
