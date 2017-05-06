# InterPlanetary Publishing

This specification describes a method to announce and publish media over the IPFS PubSub system, and an optional method for
Clients to query this data. All interactions described within this spec occur over the PubSub system, on predetermined `topics`
that are specific to an implementation. This spec maintains that all parties should send all data as JSON objects.

A **Publisher** is an entity which submits a publication, which an **Archiver** subscribes to and records. **Clients** are
users which request search queries, while **Servers** respond to these queries. A **PeerID** is a unique identifier granted
by IPFS and tied to a private key, which is sent over PubSub with every message. **IPNS** refers to IPFS's "Name Space" system
that allos individual IPFS daemons to point publish unique hashes under their PeerID.

## Publishing and Archiving

Publishers should optimally publish to a single `topic` to make things easier on Archivers. For the purposes of this spec, that
`topic` will be referred to as the `releases` topic. Archivers should be subscribed to the `releases` topic at all times,
and individual Publishers should maintain an up-to-date JSON array containing all of their publications, which should be
published over IPNS.

Archivers should avoid recognizing publications sent from untrusted PeerIDs.

Below is an example of a `publication object` sent over the `releases` topic. Comments are added to describe a parameter's use.

    {
      name: "string",
        // The name of the publication, to be used as an identifying name.
	
      cat: "string",
        // The category this publication falls into. Archivers may ignore unrecognized categories.
      
      desc: "string",
        // (optional) A description of the publication. Preferrably NOT HTML.
      
      filesize: 0,
        // The size of the file in bytes.
      
      time: 0,
        // A Unix timestamp to associate with this publication.
      
      torrent: "string",
        // (optional) A BitTorrent hash associated with this publication.
      
      trackers: ["string"],
        // (optional) BitTorrent trackers to associate with this publication.
      
      ipfs: "string",
        // (optional) An IPFS hash to associate with this publication.
      
      website: "string"
        // (optional) A website URL to associate with this publication.
        //May be pubisher's website or the published content.
    }

How Archivers will store this content is up to individual implementations.


## Search and Results

People should be able to download a record of publications, either through publishers directly, or through an archiver's open
database. However this isn't always optimal, and it may be desirable for a Search Engine to exist that can return results from
any database. This system assumes that **Clients** will send their query over a `search` topic, and receive results from a
**Server** at a specified topic.

Below is an example of a `query object` send over the `search` topic. Comments are added to explain a parameter's use.

    {
      query: "string",
        // (optional) A string representing a client's request.
      
      cat: "string",
        // (optinal) The category in which the client wishes to search.
      
      limit: 0,
        // (optional) The number of results to return.
      
      page: 0,
        // (optional) The "page" to return.
      
      room: "string"
        // The topic a Client will be waiting at.
    }

This requires more explanation. The `query` parameter should be interpretted as the Client searching for a publication by name.
Servers may optionally search by description, or use other algorithms, but that's beyond the scope of this spec.

If the `cat` parameter is omitted, treat is as "All" categories. Servers may also interpret certain categories as being subsets
of other categories.

The `limit` and `page` parameters are to facilitate pagination features, and to reduce bandwidth cost. `limit` is the amount of
"results per page", and `page` is the current page. `page` is zero-indexed, meaning that `0` should be the first page, and thus
considered the default value if there is no `page` parameter. The default value of `limit` is implementation specific, but
suggested values are between 10 and 50.

Because Clients cannot be expected to listen to every search result sent over the `search` topic, the `room` parameter exists
so that a Client can subscribe to a second topic, and wait for a response from the server. This second topic should be named as
the original topic with a hyphen and the new name appended. If for example a Client prepared to send a query over the `search`
topic, with the `room` parameter `foo`, they should first subscribe to the topic `search-foo` before sending their query.

When the Server reads the Client's query in `search`, they will subscribe to the new topic `search-foo`, and after generating
results according to the query, they will publish these results over the specified topic. Below is an example `result object`.
Comments are added to explain a parameter's use.

    {
      client: "string",
        // The PeerID of the Client requesting this.
      
      query: {},
        // The original `query object` that this result is a response to.
      
      results: []
        // An array containing `publication object`s that fit the query.
    }

Once a Client recognizes the results they are to publish a confirmation message with the following format:

    {
      success: "ok",
      query:{}
        // The original `query object` that this confirmation received.
    }

The `success` message lets the server know the client received their results. The inclusion of the **query** object once again
confirms that the correct query was confirmed, and tells the bot it doesn't need to try again. However, if no success message
is given the server will attempt to send the query 5 more times, several seconds apart. If no success message is received, the
server will quit.
