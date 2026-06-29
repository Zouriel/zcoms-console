module github.com/Zouriel/zcoms-console

go 1.25.6

require (
	github.com/Zouriel/zcoms v1.0.0-comms
	github.com/Zouriel/zcoms-agent v1.0.0
	golang.org/x/crypto v0.53.0
)

require github.com/skip2/go-qrcode v0.0.0-20200617195104-da1b6568686e

// Local development: build the console against the in-tree comms + agent tiers.
// Replaced by the real published versions at release time.
replace (
	github.com/Zouriel/zcoms => ../zcoms
	github.com/Zouriel/zcoms-agent => ../zcoms-agent
)
