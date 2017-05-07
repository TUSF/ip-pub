package main

type Config struct {
	Categories []string `json:"categories"`
	Topics []string `json:"categories"`
	Database string `json:"database"`
}

type Publication struct {
	// The PeerID of the publisher.
	Peer string `json:"peer"`

	// The name of the publication, to be used as an identifying name.
	Name string `json:"name"`

	// The category this publication falls into. Archivers may ignore unrecognized categories.
	Cat string `json:"cat"`

	// (optional) A description of the publication. Preferrably NOT HTML.
	Desc string `json:"desc,omitempty"`

	// The size of the file in bytes.
	Filesize uint `json:"Filesize"`

	// A Unix timestamp to associate with this publication.
	Time uint `json:"time"`

	// (optional) A BitTorrent hash associated with this publication.
	Torrent string `json:"torrent,omitempty"`

	// (optional) BitTorrent trackers to associate with this publication.
	Trackers []string `json:"trackers,omitempty"`

	// (optional) An IPFS hash to associate with this publication.
	Ipfs string `json:"ipfs,omitempty"`

	// (optional) A website URL to associate with this publication.
	//May be pubisher's website or the published content.
	Website string `json:"website,omitempty"`
}

type Query struct {
	// (optional) A string representing a client's request.
	Query string `json:"query,omitempty"`

	// (optinal) The category in which the client wishes to search.
	Cat string `json:"cat,omitempty"`

	// (optional) The number of results to return.
	Limit uint `json:"limit,omitempty"`

	// (optional) The "page" to return.
	Page uint `json:"page,omitempty"`

	// The topic a Client will be waiting at.
	Room string `json:"room"`
}

type Results struct {
	// The PeerID of the Client requesting this.
	Client string `json:"client"`

	// The original `query object` that this result is a response to.
	Query Query `json:"query"`

	// An array containing `publication object`s that fit the query.
	Results []Publication `json:"results"`
}

type Success struct {
	Success string `json:"success"`
	Query   Query `json:"query"`
}
