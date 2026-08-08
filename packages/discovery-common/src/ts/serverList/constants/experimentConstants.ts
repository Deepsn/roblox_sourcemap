// IXP layer that gates the expanded server-list "order by" dropdown options
// ("Servers for you" / "Best latency"). Defaults to disabled until the layer is
// configured in IXP, so the dropdown shows only the legacy occupancy ordering.
export const serverListExperimentLayer =
	"Discovery.EDP.PublicServerListOrderBy";

// Parameter (within the layer above) that enables the public server list V2 flow.
export const isPublicServerListV2EnabledParam = "IsPublicServerListV2Enabled";
