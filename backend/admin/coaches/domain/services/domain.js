import connection from "../../../../database/database.js";
 
export const postDomainService = (domainName, domainThumbnail, status) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.domains(domain_name, domain_thumbnail, status)
			VALUES ($1, $2, $3)
			RETURNING id, domain_name, domain_thumbnail, status;
		`;
		connection.query(query, [domainName, domainThumbnail, status], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};

export const updateDomainService = (domainId, domainName, domainThumbnail) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE bm.domains
			SET domain_name = $2, domain_thumbnail = $3
			WHERE id = $1 AND status = 1
		`;
		connection.query(query, [domainId, domainName, domainThumbnail], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

export const deleteDomainService = (domainId) => {
	return new Promise((resolve, reject) => {
		const selectQuery = `
			SELECT domain_thumbnail
			FROM bm.domains
			WHERE id = $1 AND status = 1;
		`;
		connection.query(selectQuery, [domainId], (err, result) => {
			if (err) return reject(err);
			if (result.rowCount === 0) {
				return resolve({
					status: -1,
					thumbnail: null
				});
			}
			const thumbnail = result.rows[0].domain_thumbnail;
			const updateQuery = `
				UPDATE bm.domains
				SET status = 0
				WHERE id = $1 AND status = 1;
			`;
			connection.query(updateQuery, [domainId], (err2, result2) => {
				if (err2) return reject(err2);
				if (result2.rowCount === 0) {
					return resolve({
						status: -1,
						thumbnail: null
					});
				}
				resolve({
					status: result2.rowCount,
					thumbnail
				});
			});
		});
	});
};

export const getAllDomainsService = (pageNo, pageSize) => {
    return new Promise((resolve, reject) => {
        // 🟢 Convert numbers but allow "*"
        if (pageSize !== "*") {
            pageNo = parseInt(pageNo, 10);
            pageSize = parseInt(pageSize, 10);
            if (!pageNo || pageNo < 1) pageNo = 1;
            if (!pageSize || pageSize < 1) pageSize = 10;
        }

        // 🟢 If pageSize === "*" → fetch all records
        const fetchAll = pageSize === "*";

        const offset = fetchAll ? 0 : (pageNo - 1) * pageSize;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM bm.domains
            WHERE status = 1
        `;

        connection.query(countQuery, (err, countResult) => {
            if (err) return reject(err);

            const totalRecords = parseInt(countResult.rows[0].total, 10);
            const totalPages = fetchAll ? 1 : Math.ceil(totalRecords / pageSize);

            // 🟢 Query logic changes only here:
            const dataQuery = fetchAll
                ? `
                    SELECT d.id AS domain_id,
                           d.domain_name,
                           d.domain_thumbnail
                    FROM bm.domains d
                    WHERE d.status = 1
                    ORDER BY d.id ASC
                `
                : `
                    SELECT d.id AS domain_id,
                           d.domain_name,
                           d.domain_thumbnail
                    FROM bm.domains d
                    WHERE d.status = 1
                    ORDER BY d.id ASC
                    LIMIT $1 OFFSET $2
                `;

            const queryParams = fetchAll ? [] : [pageSize, offset];

            connection.query(dataQuery, queryParams, (err, dataResult) => {
                if (err) return reject(err);
                if (!dataResult.rows.length) return resolve(-1);

                return resolve({
                    current_page: fetchAll ? 1 : pageNo,
                    page_size: fetchAll ? totalRecords : pageSize,
                    total_records: totalRecords,
                    total_pages: totalPages,
                    has_next_page: fetchAll ? false : pageNo < totalPages,
                    has_prev_page: fetchAll ? false : pageNo > 1,
                    domains: dataResult.rows
                });
            });
        });
    });
};

export const getDomainByIdService = (domainId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT d.id AS domain_id, d.domain_name, d.domain_thumbnail
			FROM bm.domains d
			WHERE id = $1
			LIMIT 1;
		`;
		connection.query(query, [domainId], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};

export const postSubdomainService = (domainId, subdomainName, progressiveDifficulty, subdomainThumbnail, status) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.subdomains(domain_id, subdomain_name, progressive_difficulty, status, subdomain_thumbnail)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, domain_id, subdomain_name, progressive_difficulty, subdomain_thumbnail, status;
		`;
		connection.query(
			query,
			[domainId, subdomainName, progressiveDifficulty, status, subdomainThumbnail],
			(err, result) => {
				if (err) return reject(err);
				if (!result.rows.length) return resolve(-1);
				resolve(result.rows[0]);
			}
		);
	});
};

export const updateSubdomainService = (subdomainId, domainId, subdomainName, progressiveDifficulty, subdomainThumbnail) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE bm.subdomains
			SET domain_id = $2, subdomain_name = $3, progressive_difficulty = $4, subdomain_thumbnail = $5
			WHERE id = $1 AND status = 1
		`;
		connection.query(
			query,
			[subdomainId, domainId, subdomainName, progressiveDifficulty, subdomainThumbnail],
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
			}
		);
	});
};

export const deleteSubdomainService = (subdomainId) => {
	return new Promise((resolve, reject) => {
		const selectQuery = `
			SELECT subdomain_thumbnail
			FROM bm.subdomains
			WHERE id = $1 AND status = 1;
		`;
		connection.query(selectQuery, [subdomainId], (err, result) => {
			if (err) return reject(err);
			if (result.rowCount === 0) {
				return resolve({
					status: -1,
					thumbnail: null
				});
			}
			const thumbnail = result.rows[0].subdomain_thumbnail;
			const updateQuery = `
				UPDATE bm.subdomains
				SET status = 0
				WHERE id = $1 AND status = 1;
			`;
			connection.query(updateQuery, [subdomainId], (err2, result2) => {
				if (err2) return reject(err2);
				if (result2.rowCount === 0) {
					return resolve({
						status: -1,
						thumbnail: null
					});
				}
				resolve({
					status: result2.rowCount,
					thumbnail
				});
			});
		});
	});
};

export const deleteSubdomainsService = (domainId) => {
	return new Promise((resolve, reject) => {
		const selectQuery = `
			SELECT subdomain_thumbnail
			FROM bm.subdomains
			WHERE domain_id = $1 AND status = 1;
		`;
		connection.query(selectQuery, [domainId], (err, result) => {
			if (err) return reject(err);
			const thumbnails = result.rows.map(row => row.subdomain_thumbnail);
			if (result.rowCount === 0) {
				return resolve({
					status: 0,
					thumbnails: []
				});
			}
			const updateQuery = `
				UPDATE bm.subdomains
				SET status = 0
				WHERE domain_id = $1 AND status = 1;
			`;
			connection.query(updateQuery, [domainId], (err2, result2) => {
				if (err2) return reject(err2);
				resolve({
					status: result2.rowCount,  // number of subdomains deleted
					thumbnails: thumbnails      // array of thumbnail paths
				});
			});
		});
	});
};

export const getAllSubdomainsService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {

    // 🟢 Detect fetch-all mode
    const fetchAll = pageSize === "*";

    // 🟢 Parse only when not "*"
    if (!fetchAll) {
      pageNo = parseInt(pageNo, 10);
      pageSize = parseInt(pageSize, 10);
      if (!pageNo || pageNo < 1) pageNo = 1;
      if (!pageSize || pageSize < 1) pageSize = 10;
    }

    const offset = fetchAll ? 0 : (pageNo - 1) * pageSize;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.subdomains
      WHERE status = 1
    `;

    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);

      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = fetchAll ? 1 : Math.ceil(totalRecords / pageSize);

      // 🟢 Query updated: LIMIT/OFFSET only when not "*"
      const dataQuery = fetchAll
        ? `
            SELECT 
              sd.id AS subdomain_id, 
              sd.domain_id, 
              d.domain_name,
              sd.subdomain_name, 
              sd.progressive_difficulty, 
              sd.subdomain_thumbnail
            FROM bm.subdomains sd
            INNER JOIN bm.domains d ON sd.domain_id = d.id
            WHERE sd.status = 1
            ORDER BY sd.id ASC
          `
        : `
            SELECT 
              sd.id AS subdomain_id, 
              sd.domain_id, 
              d.domain_name,
              sd.subdomain_name, 
              sd.progressressive_difficulty, 
              sd.subdomain_thumbnail
            FROM bm.subdomains sd
            INNER JOIN bm.domains d ON sd.domain_id = d.id
            WHERE sd.status = 1
            ORDER BY sd.id ASC
            LIMIT $1 OFFSET $2
          `;

      const queryParams = fetchAll ? [] : [pageSize, offset];

      connection.query(dataQuery, queryParams, (err, dataResult) => {
        if (err) return reject(err);
        if (!dataResult.rows.length) return resolve(-1);

        return resolve({
          current_page: fetchAll ? 1 : pageNo,
          page_size: fetchAll ? totalRecords : pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: fetchAll ? false : pageNo < totalPages,
          has_prev_page: fetchAll ? false : pageNo > 1,
          subdomains: dataResult.rows
        });
      });
    });
  });
};

export const getSubdomainsByDomainIdService = (pageNo, pageSize, domainId) => {
  return new Promise((resolve, reject) => {

    // 🟢 Detect fetch-all mode
    const fetchAll = pageSize === "*";

    // 🟢 Normal pagination only when not "*"
    if (!fetchAll) {
      pageNo = parseInt(pageNo, 10);
      pageSize = parseInt(pageSize, 10);
      if (!pageNo || pageNo < 1) pageNo = 1;
      if (!pageSize || pageSize < 1) pageSize = 10;
    }

    const offset = fetchAll ? 0 : (pageNo - 1) * pageSize;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.subdomains
      WHERE domain_id = $1 AND status = 1
    `;

    connection.query(countQuery, [domainId], (err, countResult) => {
      if (err) return reject(err);

      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = fetchAll ? 1 : Math.ceil(totalRecords / pageSize);

      // 🟢 Data Query: with LIMIT/OFFSET only when not "*"
      const dataQuery = fetchAll
        ? `
            SELECT 
              sd.id AS subdomain_id, 
              sd.domain_id, 
              d.domain_name,
              sd.subdomain_name, 
              sd.progressive_difficulty, 
              sd.subdomain_thumbnail
            FROM bm.subdomains sd
            INNER JOIN bm.domains d ON sd.domain_id = d.id
            WHERE sd.domain_id = $1 AND sd.status = 1
            ORDER BY sd.id ASC
          `
        : `
            SELECT 
              sd.id AS subdomain_id, 
              sd.domain_id, 
              d.domain_name,
              sd.subdomain_name, 
              sd.progressive_difficulty, 
              sd.subdomain_thumbnail
            FROM bm.subdomains sd
            INNER JOIN bm.domains d ON sd.domain_id = d.id
            WHERE sd.domain_id = $1 AND sd.status = 1
            ORDER BY sd.id ASC
            LIMIT $2 OFFSET $3
          `;

      const queryParams = fetchAll ? [domainId] : [domainId, pageSize, offset];

      connection.query(dataQuery, queryParams, (err, dataResult) => {
        if (err) return reject(err);
        if (!dataResult.rows.length) return resolve(-1);

        return resolve({
          current_page: fetchAll ? 1 : pageNo,
          page_size: fetchAll ? totalRecords : pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: fetchAll ? false : pageNo < totalPages,
          has_prev_page: fetchAll ? false : pageNo > 1,
          subdomains: dataResult.rows
        });
      });
    });
  });
};

export const getSubdomainByIdService = (subdomainId, domainId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT sd.id AS subdomain_id, sd.domain_id, d.domain_name,
				   sd.subdomain_name, sd.progressive_difficulty, sd.subdomain_thumbnail
			FROM bm.subdomains sd
			INNER JOIN bm.domains d ON sd.domain_id = d.id
			WHERE sd.id = $1 AND sd.domain_id = $2 AND sd.status = 1
			LIMIT 1;
		`;
		connection.query(query, [subdomainId, domainId], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};