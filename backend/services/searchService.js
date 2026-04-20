import client from "../commons/esClient.js";

const INDEX_MAP = {
  domain: "domains",
  subdomain: "subdomains",
  course: "courses",
  video: "videos",
  music: "musics",
  shorts: "daily_shorts",
};

const FIELDS_MAP = {
  domain: ["title^3", "description"],
  subdomain: ["title^3", "description"],
  course: ["title^3", "description", "instructor"],
  video: ["title^2", "description", "transcript^0.5"],
  music: ["title^2", "artist"],
  shorts: ["title^2", "description"],
};

async function globalSearch({
  query = "",
  entityTypes = [],
  domainFilter = "",
  sort = "relevance",
  page = 1,
  pageSize = 20,
}) {
  const types = entityTypes.length ? entityTypes : Object.keys(INDEX_MAP);

  const indices = types.map((t) => INDEX_MAP[t]);

  // One bool.should clause per entity type
  const shouldClauses = types.map((t) => ({
    bool: {
      must: query
        ? [
            {
              multi_match: {
                query,
                fields: FIELDS_MAP[t],
                type: "best_fields",
                fuzziness: "AUTO",
              },
            },
          ]
        : [{ match_all: {} }],
      filter: [{ term: { _index: INDEX_MAP[t] } }],
    },
  }));

  const filters = [];
  if (domainFilter) {
    filters.push({ term: { domain_title: domainFilter } });
  }

  const sortClause =
    sort === "recency"
      ? [{ published_at: { order: "desc" } }, "_score"]
      : sort === "popularity"
        ? [{ view_count: { order: "desc" } }, "_score"]
        : ["_score", { published_at: { order: "desc" } }];

  const response = await client.search({
    index: indices,
    body: {
      query: {
        bool: {
          should: shouldClauses,
          minimum_should_match: 1,
          ...(filters.length && { filter: filters }),
        },
      },
      aggs: {
        by_type: { terms: { field: "_index", size: 10 } },
        by_domain: { terms: { field: "domain_title", size: 20 } },
      },
      highlight: {
        fields: { title: {}, description: {} },
        pre_tags: ["<mark>"],
        post_tags: ["</mark>"],
      },
      sort: sortClause,
      size: pageSize,
      from: (page - 1) * pageSize,
    },
  });

  const { hits, aggregations } = response;

  return {
    total: hits.total.value,
    results: hits.hits.map((h) => ({
      id: h._id,
      type: Object.keys(INDEX_MAP).find((k) => INDEX_MAP[k] === h._index),
      score: h._score,
      highlights: h.highlight || {},
      ...h._source,
    })),
    facets: {
      byType: aggregations.by_type.buckets.map((b) => ({
        type: Object.keys(INDEX_MAP).find((k) => INDEX_MAP[k] === b.key),
        count: b.doc_count,
      })),
      byDomain: aggregations.by_domain.buckets.map((b) => ({
        domain: b.key,
        count: b.doc_count,
      })),
    },
  };
}

module.exports = { globalSearch };
