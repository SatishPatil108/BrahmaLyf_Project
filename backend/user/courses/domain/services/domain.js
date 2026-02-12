import connection from "../../../../database/database.js";

export const getAllDomainsService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.domains
      WHERE status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          d.id AS domain_id,
          d.domain_thumbnail,
          d.domain_name
        FROM bm.domains d
        WHERE d.status = 1
        ORDER BY d.id ASC
        LIMIT $1 OFFSET $2
      `;
      connection.query(dataQuery, [pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          domains: dataResult.rows
        });
      });
    });
  });
};

export const getAllSubdomainsService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.subdomains
      WHERE status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          sd.id AS subdomain_id,
          sd.domain_id,
          d.domain_name,
          sd.subdomain_name,
          sd.progressive_difficulty
        FROM bm.subdomains sd
        INNER JOIN bm.domains d ON sd.domain_id = d.id
        WHERE sd.status = 1
        ORDER BY sd.id ASC
        LIMIT $1 OFFSET $2
      `;
      connection.query(dataQuery, [pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          subdomains: dataResult.rows
        });
      });
    });
  });
};

export const getSubdomainsByDomainIdService = (pageNo, pageSize, domainId) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.subdomains
      WHERE domain_id = $1 AND status = 1
    `;
    connection.query(countQuery, [domainId], (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          sd.id AS subdomain_id,
          sd.domain_id,
          d.domain_name,
          sd.subdomain_name,
          sd.progressive_difficulty,
          sd.subdomain_thumbnail
        FROM bm.subdomains sd
        INNER JOIN bm.domains d ON sd.domain_id = d.id
        WHERE sd.domain_id = $1
        AND sd.status = 1
        ORDER BY sd.id ASC
        LIMIT $2 OFFSET $3
      `;
      connection.query(dataQuery, [domainId, pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          subdomains: dataResult.rows
        });
      });
    });
  });
};